---
  
date: 2014-03-07 23:40:39+00:00

slug: windows-phone-series-bing-maps-and-turn-by-turn-navigation
author: [Rahul Nath]
title: 'Windows Phone Series: Bing Maps and Turn-by-Turn Navigation'
wordpress_id: 970
tags:
  - Windows Phone
thumbnail: ../images/Bing_wp_simulator_geolocation.jpg
---

Many applications today provide features that integrate with users location and provide information on a map based on that. In this blog will see how we can use the Bing maps to show a users current location, search for destination and show route to that location. For this will use Bing maps, and you would have to create an account here and create a key that we would be using. Make sure that you read on the [licensing terms](http://www.microsoft.com/maps/product/terms.html) on the api if you are planning to use this in a published application.

To use Maps in windows phone application, you would need to add a reference to ‘_Microsoft.Phone.Controls.Maps_’ once you create a new Windows phone project. Add the maps control to the application as below to display current location or other map related features.

```xml
<maps:Map Grid.Row="1" Name="mapBing"  AnimationLevel="None" VerticalAlignment="Stretch" VerticalContentAlignment="Stretch"
          CopyrightVisibility="Collapsed"  LogoVisibility="Collapsed"
          ZoomBarVisibility="Collapsed"
          ZoomLevel="12" CredentialsProvider="BING MAPS API KEY" >
    <maps:MapLayer Name="RouteLayer" />
    <maps:MapLayer Name="StartPoint" />
    <maps:MapLayer Name="DestinationPoint" />
    <maps:MapLayer Name="CurrentPosition" />
    <maps:MapLayer Name="MyPathLayer">
    </maps:MapLayer>
</maps:Map>
```

This adds a map user control to the application and also different layers to the application, on which we would be displaying the pins, routes etc. Anything that gets shown on the map is shown on different layers. Each of these can be cleared, deleted or toggled for visibility making it easy to work on maps.

**Track Me**

The  first thing that we would want is to track our location, so that we could provide information related to our current location. For this we use the [GeoCoordinateWatcher](<http://msdn.microsoft.com/en-us/library/system.device.location.geocoordinatewatcher(v=vs.110).aspx>), that provides the location information based in latitude and longitude. Registering for the PositionChanged event will update us whenver the location information related to the user has changed, so that we can update/obtain the real time location of the user if he is on the move. Once we have the user location co-ordinates, we can use the [Location API](http://msdn.microsoft.com/en-us/library/ff701715.aspx), to get the location name.

```csharp
GeoPosition myPosition;

private void TrackMe()
{
    startingPoint = null;
    CurrentPosition.Children.Clear();
    if (myWatcher != null)
    {
        myWatcher.PositionChanged -= myWatcher_PositionChanged;
        myWatcher.Dispose();
        myWatcher = null;
    }
    myWatcher = new GeoCoordinateWatcher();
    myWatcher.TryStart(false, TimeSpan.FromMilliseconds(1000));
    myWatcher.PositionChanged += myWatcher_PositionChanged;
}

void myWatcher_PositionChanged(object sender, GeoPositionChangedEventArgs e)
{
     myPosition = myWatcher.Position;
     currentLocation = myWatcher.Position.Location;
     if (isInDriveMode)
     {
         DrawMyCurrentRoute(currentLocation);
     }

     LocationManager.GetLocationName(UpdateLocation, myPosition.Location.Latitude.ToString(), myPosition.Location.Longitude.ToString());
}
```

**Destination and Routes**

Location points are depicted on maps using the Pushpin user control. Now that we have the users location, we need to get the destination where the user wants to go. We have added a simple panorama control where in one of them has a map and the other has the details to enter the destination location. Once the user enters the destination location name, we need to get the co-ordinates of this location. For this we use the Location API again but with a different endpoint. We might get multiple responses for the same location name, for which we add destination pushpins to the map, so that user can select the correct location from the map that he intends to go. On getting confirmation on the destination point, we now need to get the route from the current location to the destination location. A route is nothing but a set of co-ordinates between the start and the destination that the user will have to pass through to reach the final destination. You can use the [Routes API](http://msdn.microsoft.com/en-us/library/ff701705.aspx) or consume it adding a service reference to [http://dev.virtualearth.net/webservices/v1/routeservice/routeservice.svc/mex](http://dev.virtualearth.net/webservices/v1/routeservice/routeservice.svc/mex)

```csharp
RouteServiceClient routeService = new RouteServiceClient("BasicHttpBinding_IRouteService");

routeService.CalculateRouteCompleted += (sender, e) =&gt;
{
    DrawRoute(e);
};

mapBing.SetView(LocationRect.CreateLocationRect(locations));

routeService.CalculateRouteAsync(new RouteRequest()
{
    Credentials = new Credentials()
    {
        ApplicationId = LocationManager.bingApiKey
    },
    Options = new RouteOptions()
    {
        RoutePathType = RoutePathType.Points
    },
    Waypoints = new ObservableCollection(
        locations.Select(x =&gt; new Waypoint()
        {
            Location = new Microsoft.Phone.Controls.Maps.Platform.Location() { Latitude = x.Latitude, Longitude = x.Longitude }
        }))
});
```

The Draw route draws a route line on the RouteLayer on the map, so that the user can see the path that he needs to take to reach his final destination. As the user starts moving the routes are recalcualted and redrawn on the map, so that there is a constant feedback to the user on the path that he is taking. Along with the routes we also get a text direction information that describes the direction in which we need to travel. This can be spoken out to the user so that he need not always look at the mobile to find the next immediate action that he needs to perform. Here I have used the Google translate api

```csharp
public static string speechUrl = "http://translate.google.com/translate_tts?tl=en&amp;q=";
private void SpeakText(string message)
{
    // Play the audio
    med1.Source = new Uri(speechUrl + message);
    med1.Play();
}
```

You could add on more features to this using the different location related api’s that are available and provide the user a more enhanced experience.

![Bing_wp_route](../images/Bing_wp_route.jpg)![Bing_wp_place_search](../images/Bing_wp_place_search.jpg)![Bing_wp_directions_text](../images/Bing_wp_directions_text.jpg)

**Testing**

Using the [additional tools along with the phone emulator](<http://msdn.microsoft.com/en-us/library/windowsphone/develop/hh202933(v=vs.105).aspx>), you can simulate location changes and also be at any location without actually being there and test. The emulator also provides a lot of functionality to simulate movement along a specific route and fire location changes in fixed amount of time etc, that come handy while testing.
![Bing_wp_simulator_geolocation](../images/Bing_wp_simulator_geolocation.jpg)

You could also install it on to a phone and dash out to test it for yourself in your real-time location and reach the coffee-shop faster!. Find the sample code [here](https://github.com/rahulpnath/Blog/tree/master/SimpleGPS) and feel free to use it.
