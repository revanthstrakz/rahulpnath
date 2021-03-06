---
  
date: 2013-07-26 05:21:51+00:00

slug: mvvm-a-windows-phone-scenario
author: [Rahul Nath]
title: MVVM – A Windows phone scenario
wordpress_id: 486
tags:
  - Windows Phone
---

With multiple platforms/devices, embracing the same technology, common architectural patterns become more popular as they provide us with what we want the most – **Reusability. **MVVM has turned out to be a must use architectural pattern while developing for Windows phone/Windows 8 store apps. I had blogged on this, [Why MVVM matters](http://rahulpnath.com/blog/mvvm-does-it-really-matter/).

In this post will take a quick look into the scenarios that would come across while we develop a windows phone app and how that could possibly(as there could be many other ways/approaches too) be implemented using MVVM. I would be covering shorter scenarios in this same post, and those that would be better off in a different one would be linked here . [MVVM Light](http://mvvmlight.codeplex.com/) is a very popular toolkit that assists in getting started with MVVM quickly and we would also be using the same. This can be easily added in as a [nuget package](http://nuget.org/packages/mvvmLight)
MVVM Light does come with a ViewModelBase class, that all your View Models are to inherit so that you do not have to worry about implementing the [INotifyPropertyChanged](http://msdn.microsoft.com/en-in/library/system.componentmodel.inotifypropertychanged.aspx) interface. I would still think of having a intermediate view model base class specific to our app and have all the reusable piece of code that you want across your ViewModels.

Common MVVM scenarios that we come across while developing and probable approaches are discussed below. There might be different ways of achieving the same, and at times we might go off the ‘purist’  MVVM implementation,  i.e.  of not having a code behind at all. As for me I am ok to have code behind at a minimum if it is really required and does not affect the original intent of MVVM(separations of concerns, testability and reusability)

## Scenarios

1. Binding the View – ViewModel
2. ViewModel and Model
3. Basic Commanding
4. Advanced Commanding
5. Page Navigations and Parameters
6. Page Events
7. Application Bar\*\* \*\*

We will discuss each on in details and the sample that we would be using is that of a photo browser, for [500px](http://500px.com/). You can get the api access [here](http://developers.500px.com/)

**1. Binding the View-ViewModel**

MVVM Light comes default with a ViewModelLocator(**VML**) class that will help you with the binding of the ViewModels(**VM’s**) with the corresponding View. The VML will have public properties for the different view models that you have. You can either have different public properties for each of your view model here, or have a property for MainViewModel and then that would in turn have other ViewModel properties. The VML uses a SimpleIOC container to resolve type instances. In simple terms, with an IoC container all we are trying to solve is to minimize the dependency between different types/classes, so that we would never have to instantiate one class(complex type) in another. So whenever a instance of a class is required, the IoC container would generate it for us , and all we would be concerned would be of the interface that we require. For IoC to resolve types for us we need to register the interface and the original class that implements the interface.
Below you see how we are registering for the interface IDataService and setting its implementation class to DataService. Similarly we can also register classes, which would be how we would be registering our VM’s.

```csharp
SimpleIoc.Default.Register<IDataService, DataService>();
SimpleIoc.Default.Register<MainViewModel>();
```

When installing the nuget package itself an instance of the VML is added into the app.xaml class, which can be used in all the View classes to data-bind to the VM.

```xml
<Application.Resources>
       <ResourceDictionary>
           <!--Global View Model Locator-->
           <vm:ViewModelLocator x:Key="Locator"
               d:IsDataSource="True" />
 .....
<Application.Resources>
```

This instance is used in all the view classes as below  in the xaml.

```xml
DataContext="{Binding Main, Source={StaticResource Locator}}"
```

The Main property returns the View model that should be bound with the view. The ‘ServiceLocator.Current’, returns the default instance of the SimpleIoc. The GetInstance always returns the same instance of the ViewModel as if it would have for a Singleton. If you need a new instance then you would need to pass a specific key(any identifier value) to get a different instance.

```csharp
public MainViewModel Main
{
    get
    {
        return ServiceLocator.Current.GetInstance<MainViewModel>();
    }
}
```

**What about the other Views and View Models?**

Mostly the main VM would be the one that would be like a hub page, from which the user be able to navigate onto other pages and detailed views., say from a list of friends to a friend, a list of photos to a specific photo. One common thing that we do wrong is to think of View – ViewModel as a one-to-one relationship, meaning one view will have only one ViewModel bound to it.  In our sample app we have a list of photos that needs to be displayed on the main page and on selecting one of the photo, we should be taken to the photo’s detail page. So the mistake to do here would be to have an observable list of Photos in the MainViewModel. We should rather have a list of PhotoViewModel , that would be bound to the list control in the main page. So the MainViewModel would have a property SelectedPhoto, which would be of PhotoViewModel type, that would become the data context of the PhotoDetail page.

```xml
DataContext="{Binding Main.SelectedPhoto, Source={StaticResource Locator}}"
```

For views that are not at all related to each other, we can have separate properties in the VML, like say for Settings, About page.

```xml
DataContext="{Binding About, Source={StaticResource Locator}}"
```

```csharp
public AboutViewModel About
 {
    get
    {
        return ServiceLocator.Current.GetInstance<AboutViewModel>();
    }
  }
```

So whenever you have hierarchical pages, it would mostly be that your parent/callee will have the ViewModel property that you would bind to like SelectedPhoto in MainViewModel and for cases you have separate navigations you can have a property exposed in VML like About, Main.

**2. ViewModel and Model**

Like I mentioned above, one common mistake that we make is to think of View-ViewModel as a one-to-one relationship and normally end up binding the UI to models and not VM’s. We soon tend to hit into problems, such as adding custom properties into models, not finding ways to trigger property changed etc. So it is always best to wrap your models in the VMs. In cases where you are sure you would never want to change/format the data format then you can directly bind to a model. In  cases where you would want to format the data (like say you have a First Name & Last Name property on the model and you want to display Full Name)  you would rather wrap the data into a VM and bind that. You could always use [ValueConverters](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter.aspx), to format the data specific to the UI, but that always comes with a price, especially on a phone device. Phone’s come with lesser hardware resource and you would want to make the maximum use of it. So it is better to have properties exposed on VM itself rather than having converters all over the UI to format the data. But still you would be in positions where you would absolutely want to use a converter where you should. That is a wise decision that one should make for yourself. (a [thread](https://groups.google.com/forum/?fromgroups#!topic/wpf-disciples/P-JwzRB_GE8) that discusses on this )

**3. Basic Commanding**

It’s not just the data that gets displayed needs to be separated out cleanly. User actions and actions taken should also be cleanly separated from the UI. Commands is what would help us here. Commanding support is currently only for elements that inherit from [ButtonBase](http://msdn.microsoft.com/en-us/library/system.windows.controls.primitives.buttonbase.aspx). As in any mvvm implementation, mvvmlight also has a wrapper that implements [ICommand](http://msdn.microsoft.com/en-us/library/system.windows.input.icommand.aspx) interface for us, which is RelayCommand. An instance of this can be directly bound to the Command property, for those elements that inherits from ButtonBase. Below is how you would wire up the command to a button on a page

```xml
<Button Content="My Command" Command="{Binding MyCommand}"
    VerticalAlignment="Center" HorizontalAlignment="Center" />
```

```csharp
public MainViewModel()
{
    MyCommand = new RelayCommand(OnMyCommand);
}
public RelayCommand MyCommand { get; set; }

private void OnMyCommand()
{
    MessageBox.Show("You clicked me :)");
}
```

**4. Advanced Commanding**

It’s not just UI elements that inherit from Buttonbase that we would be using, and hence we definitely need alternatives to bind events of such elements. ListBox SelectionChanged, Page loaded etc are very common events that one would be interested in while developing phone apps. There are a couple of approaches that one could follow here

- **Wire-up the command from code behind**

We could  easily wire up all such events from the code-behind class, and have it invoked on the view model. Some might argue here that we are going off the MVVM pattern, which says ‘no code behind’. I don’t this it ever said that in the first place. It is just about decoupling the UI from the code and this is still done. Even binding/commanding is still going to generate code and do the wiring of commands. As long as there is a clear separation of logics and concerns we are good. So I think this this is very well acceptable and the easiest in fact of all the approaches.

Code Behind:

```csharp
private MainViewModel viewModel
{
   get { return this.DataContext as MainViewModel; }
}

protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
{
   base.OnNavigatedTo(e);
   viewModel.OnnavigatedToCommand.Execute(NavigationContext.QueryString);
}
```

View Model

```csharp
public MainViewModel()
{
    OnnavigatedToCommand = new RelayCommand<IDictionary<string, string>>(OnNavigatedTo);
}
public RelayCommand<IDictionary<string, string>> OnnavigatedToCommand { get; set; }

private void OnNavigatedTo(IDictionary<string,string> parameters)
{
// do whatever you want to here
}
```

- **EventToCommand Behavior**

With the EventToCommand behavior introduced for Blend, can be used to bind an ICommand from the UI elements. Though it was introduced for Blend, it can be used independently. You would need to add a reference to System.Windows.Interactivity.dll, which is were all these behaviors are implemented. There is a detailed [post](http://geekswithblogs.net/lbugnion/archive/2009/11/05/mvvm-light-toolkit-v3-alpha-2-eventtocommand-behavior.aspx) out here on to how to use EventToCommand to trigger commands directly from the UI.

Just to keep a sample here, below would be how it would look like

```xml
xmlns:i="clr-namespace:System.Windows.Interactivity;assembly=System.Windows.Interactivity"
xmlns:command="clr-namespace:GalaSoft.MvvmLight.Command;assembly=GalaSoft.MvvmLight.Extras.WP71"
...
<ListBox>
    <i:Interaction.Triggers>
        <i:EventTrigger EventName="SelectionChanged">
            <command:EventToCommand Command="{Binding SelectionChangedCommand}" />
        </i:EventTrigger>
    </i:Interaction.Triggers>
    <ListBox.Items>
        <ListBoxItem>Item1</ListBoxItem>
        <ListBoxItem>Item2</ListBoxItem>
        <ListBoxItem>Item3</ListBoxItem>
    </ListBox.Items>
</ListBox>
```

```csharp
public MainViewModel()
{
    SelectionChangedCommand = new RelayCommand(OnSelectionChangedCommand);
}
public RelayCommand SelectionChangedCommand { get; set; }
private void OnSelectionChangedCommand()
{
// do whatever you want to here
}
```

- **Messenger**

We could also use a messenger service, to propogate UI events to VM’s. MVVMLight  has a built in messenger service that can be used for this. In simple terms a messenger is nothing but a decoupled eventing system, something of a publisher-subscriber model. In the messenger one entity  would send a message and there would be another entity that listens for this message and acts upon it.

```csharp
private void Selector_OnSelectionChanged(object sender, SelectionChangedEventArgs e)
{
    Messenger.Default.Send<NotificationMessage>(
        new NotificationMessage("You could have your own items here by using a generic NotificationMessage<>"));
}
…

public MainViewModel()
{
    MessengerInstance.Register<NotificationMessage>(this, OnSelectionChanged);
}
private void OnSelectionChanged(NotificationMessage message)
{
// do whatever you want to here
}
```

As you see above, in the code behind we send a Notification message indicating a click has happened. In the VM we register for the notification message and act upon it. We could send generic objects via the notification message and also create our own messages by inheriting from MessageBase of mvvmlight. This [article](http://msdn.microsoft.com/en-us/magazine/jj694937.aspx) gives more information and scenarios around this

We are still left with a lot more scenarios to cover here and I would be covering them in a separate post to keep this one 'short' :)

**Edit**: Check out [MVVM – A Windows Phone Scenario – Part 2](http://rahulpnath.com/blog/mvvm-a-windows-phone-scenario-part-2/) for the rest of the scenarios
