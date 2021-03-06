---
  
date: 2014-04-17 23:56:17+00:00

slug: windows-phone-series-image-caching-library-jetimageloader
author: [Rahul Nath]
title: 'Windows Phone Series: Image Caching Library - JetImageLoader'
wordpress_id: 1012
tags:
  - Open Source
  - Windows Phone
thumbnail: ../images/WP-JetImagLoader.png
---

Recently on a client project, I had a requirement to cache images locally on the phone and then load it from there from subsequent requests. Initially I had plans for custom implementing this using sqlite and custom code. While googling for this, I came across an awesome custom library that solved my problem with just a few lines of code – [JetImageLoader](https://github.com/artem-zinnatullin/jet-image-loader) by [Artem](https://github.com/artem-zinnatullin). This is available via nuget, making it easy to install

[![WP-JetImagLoader](../images/WP-JetImagLoader.png)](http://www.nuget.org/packages/WP-JetImagLoader/0.8.5)

Integrating this library into any existing project is even easier and is just about using a converter on your Image datatemplate as shown below.

```xml
<Image Source="{Binding UserAvatarUrl, Converter={StaticResource JetImageLoaderConverter}}"/>
```

You would need to add a custom converter and add this as part of the resource. There is a sample for this on Github where the [project source](https://github.com/artem-zinnatullin/jet-image-loader) also lives.

```csharp
public class JetImageLoaderImplementation
{
    public static readonly BaseMemoryCache<string,stream> MemoryCacheImpl = new WeakMemoryCache<string,stream>();
    public static readonly BaseStorageCache StorageCacheImpl = new LimitedStorageCache(IsolatedStorageFile.GetUserStoreForApplication(), "\\image_cache", new SHA1CacheFileNameGenerator(), 1024 * 1024 * 10);</p>
    public static JetImageLoaderConfig GetJetImageLoaderConfig()
    {
        return new JetImageLoaderConfig.Builder
        {
            IsLogEnabled = true,
            CacheMode = CacheMode.MemoryAndStorageCache,
            DownloaderImpl = new HttpWebRequestDownloader(),
            MemoryCacheImpl = MemoryCacheImpl,
            StorageCacheImpl = StorageCacheImpl
        }.Build();
    }
}
```

```csharp
public class JetImageLoaderConverter : BaseJetImageLoaderConverter
{
    protected override JetImageLoaderConfig GetJetImageLoaderConfig()
    {
        return JetImageLoaderImplementation.GetJetImageLoaderConfig();
    }

    public override object Convert(object value, System.Type targetType, object parameter, System.Globalization.CultureInfo culture)
    {
        return base.Convert(value, targetType, parameter, culture);
    }
}
```

This is all you need to do to have all the images that are bound with the converter to be cached locally on to the Memory and storage. You could also choose to cache it to only memory or storage. Do check this out in case you want to have images cached locally.

The nuget is for Windows 8 library, but there is also a version for [WP7.1 avaialble on Github](https://github.com/artem-zinnatullin/jet-image-loader/tree/master/JetImageLoader.Wp7) (which apparently is a pull request from me, indeed my very first on Github that got merged)
