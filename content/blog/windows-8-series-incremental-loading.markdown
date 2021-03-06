---
date: 2012-10-28 14:41:31+00:00

slug: windows-8-series-incremental-loading
author: [Rahul Nath]
title: Windows 8 Series - Incremental Loading
wordpress_id: 392
tags:
  - Dotnet
  - REST
  - Windows 8
thumbnail: ../images/windows8_incremental_loading.png
---

Fast and fluid experience is one of the most important characteristics of a Windows 8 application. As the data becomes larger , it might not be always possible to get the entire data loaded before hand.We might want to have a incremental or sequential data loading so that the user has a better experience.
While developing windows 8 this can be easily achieved by using [ISupportIncrementalLoading](http://msdn.microsoft.com/en-us/library/windows/apps/Hh701916)
interface which would load the data incrementally.The class that implements this should also implement the [IList](http://msdn.microsoft.com/en-us/library/system.collections.ilist.aspx) and [INotifyColectionChanged](http://msdn.microsoft.com/en-us/library/system.collections.specialized.inotifycollectionchanged.aspx). A sample on how to implement this interface can be seen [here](http://msdn.microsoft.com/en-us/library/windows/apps/Hh701916).
Implementing these over and over for different data sources that you would want to load incrementally might soon become tedious and repetitive.So why not make up some generic classes that you could abstract away the task of loading the data incrementally. That's exactly what we would be looking into here.

First lets get the class that implements [ISupportIncrementalLoading](http://msdn.microsoft.com/en-us/library/windows/apps/Hh701916), IList and INotifyCollectionChanged. To keep things simple lets inherit from ObservableCollection,which in turn inherits the latter 2 interfaces

```csharp
    public class IncrementalSource<T, K> : ObservableCollection<K>, ISupportIncrementalLoading
        where T: class
    {
        private string Query { get; set; }
        private int VirtualCount { get; set; }
        private int CurrentPage { get; set; }
        private IPagedSource<T,K> Source { get; set; }
        private int rpp { get; set; }

        public IncrementalSource(string query, Func<T, IPagedResponse<K>> GetPagedResponse)
        {
            this.Source = new PagedSourceLoader<T, K>(GetPagedResponse);
            this.VirtualCount = int.MaxValue;
            this.CurrentPage = 0;
            this.Query = query;
        }

        #region ISupportIncrementalLoading

        public bool HasMoreItems
        {
            get { return this.VirtualCount > this.CurrentPage * (rpp == 0 ? 10 :rpp); }
        }

        public IAsyncOperation<LoadMoreItemsResult> LoadMoreItemsAsync(uint count)
        {
            CoreDispatcher dispatcher = Window.Current != null ? Window.Current.Dispatcher : Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher;
            if (count > 50 || count <= 0)
            {
                // default load count to be set to 50
                count = 50;
            }

            return Task.Run<LoadMoreItemsResult>(
                async () =>
                {

                    IPagedResponse<K> result = await this.Source.GetPage(string.Format(this.Query,count), ++this.CurrentPage, (int)count);

                    this.VirtualCount = result.VirtualCount;
                    if (rpp == 0)
                    {
                        rpp = result.rpp;
                    }

                    await dispatcher.RunAsync(
                        CoreDispatcherPriority.Normal,
                        () =>
                        {
                            foreach (K item in result.Items)
                                this.Add(item);
                        });

                    return new LoadMoreItemsResult() { Count = (uint)result.Items.Count() };

                }).AsAsyncOperation<LoadMoreItemsResult>();
        }

        #endregion
    }

```

Before going into the details of the code, lets understand what this class is going to do for us. We need to load data in a paged fashion from a large datasource. So we would generally be dealing with two types of object – one the type of object(**_K_**) whose list we are trying to load incrementally. Another one the type of object(**_T_**) that represents each paged request result. This object would ideally contain a property to hold list of objects of type K, the total number of items that the datasource would give us,so that we know how many pages we need to request for and also a property indicating the current page. Each datasource might return us these required properties in different property names and types. So we have a class to hold these data together for us, PagedResponse which implements IPagedResponse

```csharp
    public interface IPagedResponse<T>
    {
        IEnumerable<T> Items { get; }
        int VirtualCount { get; }
        int rpp { get; set; } // rpp - requests per page
    }




    public class PagedResponse<K> : IPagedResponse<K>
    {
        public PagedResponse(IEnumerable<K> items, int virtualCount,int itemsPerPage)
        {
            this.Items = items;
            this.VirtualCount = virtualCount;
            rpp = itemsPerPage;
        }

        public int VirtualCount { get; private set; }
        public int rpp { get;  set; }
        public IEnumerable<K> Items { get; private set; }
    }

```

That said lets see the  _IncremetnalSource_ class. It takes in the object type **_T _**and **_K._**The constructor takes in the url where the datasource can be found.The `Func<T, IPagedResponse<K>>` parameter represents a function that takes in the return type of the call to the url as a parameter and returns the PagedResponse type. In other words that function converts the paged request call type to the type that we use to represent it, IPagedResponse.See a sample below.

```csharp
private PagedResponse<Photo> RootObjectResponse(RootObject rootObject)
{
    return new PagedResponse<Photo>(rootObject.photos, rootObject.total_items, rootObject.photos != null ? rootObject.photos.Count : 0);
}
```

Now we need to make the call to the datasource url. This might return us data in different formats, most popularly json or xml. So we would always want to abstract away the loading of data to another class so that we don’t get tied up with the data formats in _IncrementalSource._

`IPagedSource<T,K>` will do this for us. A sample implementation of this is _PagedSourceLoader_ that handles for json return type is below

```csharp
    public interface IPagedSource<R,K>
    {
        Task<IPagedResponse<K>> GetPage(string query, int pageIndex, int pageSize);
    }

    public class PagedSourceLoader<T,K> : IPagedSource<T,K>
        where T:class
    {
        private Func<T, IPagedResponse<K>> getPagedResponse;
        public PagedSourceLoader(Func<T, IPagedResponse<K>> GetPagedResponse)
        {
            getPagedResponse = GetPagedResponse;
        }

        #region IPagedSource

        public async Task<IPagedResponse<K>> GetPage(string query, int pageIndex, int pageSize)
        {
            query += "&page="+pageIndex;
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(query);
            var data = await response.Content.ReadAsStreamAsync();
            DataContractJsonSerializer json = new DataContractJsonSerializer(typeof(T));
            T dat = json.ReadObject(data) as T;
            return getPagedResponse(dat);
        }

        #endregion
    }

```

As you see above the _PagedSourceLoader_ gets the json from the datasource url and converts to the type that we are interested in . You could always replace this class to use any other data format as you would want. Mostly you would just want one implementation for `IPagedSource<T,K>`, as your data source would always return you the same data format. In case not you could inject that too into the _IncrementalSource_ class.

I have a sample [here](http://sdrv.ms/RdPtdL) that incrementally loads the photos from a photo site [500px](http://500px.com/flow). You would need to register for an to get the consumer key,which should hardly take some time [here](http://500px.com/settings/applications?from=developers).

![windows8 incremental loading](../images/windows8_incremental_loading.png)

[Download the sample source code](https://github.com/rahulpnath/Blog/tree/master/Windows8%20-%20IncrementalLoading)

Keep a sample of the source code for yourself in case you wanted this specific version. I might refine this to a more usable library with couple of default _PagedSourceLoader._

**References:
**[Metro: Incrementally load GridView and ListView with ISupportIncrementalLoading](http://www.silverlightplayground.org/post/2012/06/10/Metro-Incrementally-load-GridView-and-ListView-with-ISupportIncrementalLoading.aspx)

Feel free to reuse it if you find it useful and drop a comment to refine it.
