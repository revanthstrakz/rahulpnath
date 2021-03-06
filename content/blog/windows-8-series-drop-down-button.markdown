---
date: 2013-01-04 09:36:48+00:00

slug: windows-8-series-drop-down-button
author: [Rahul Nath]
title: Windows 8 Series – Drop Down Button
wordpress_id: 415
tags:
  - Dotnet
  - Windows 8
thumbnail: ../images/windows8_dropdown_button.png
---

While working on my Windows 8 Store application, [Picfinity](http://apps.microsoft.com/windows/en-us/app/picfinity/33ba9249-a9f4-44df-973c-21962376c3ea) I came across a need for a drop-down button(which I thought was the correct term for this). A similar control is there on the start screen of Windows 8 that gives us options on clicking the logged in user’s image to Change Account picture, Lock, Sign Out etc.

![windows8 dropdown button](../images/windows8_dropdown_button.png)

I wanted this same behaviour in my application, to provide similar options for the logged in user. The easiest way to achieve this is to use a [Popup](http://msdn.microsoft.com/en-us/library/system.windows.controls.primitives.popup.aspx). The xaml snippet below shows how to get a similar look on your application

```xml
    <Grid Background="{StaticResource ApplicationPageBackgroundThemeBrush}">
        <Grid.ColumnDefinitions>
            <ColumnDefinition />
            <ColumnDefinition Width="Auto" />
        </Grid.ColumnDefinitions>
        <TextBlock Text="MY Content" FontSize="30" HorizontalAlignment="Center"
             VerticalAlignment="Center" />
       <span style="color:#000000;"> <StackPanel Grid.Column="1" Margin="0,10,30,0" >
            <Button Content="User Name" VerticalAlignment="Top" Click="Button_Click_1" />
            <Popup IsLightDismissEnabled="True" Name="buttonDropDown">
                <StackPanel Background="DarkGray"  Width="105">
                  <Button BorderThickness="0" Content="Option1" HorizontalAlignment="Stretch" />
                  <Button BorderThickness="0" Content="Option2" HorizontalAlignment="Stretch" />
                  <Button BorderThickness="0" Content="Option3" HorizontalAlignment="Stretch" />
                </StackPanel>
            </Popup>
        </StackPanel></span>
    </Grid>

```

On click of the button we need to set the popup’s [IsOpen](http://msdn.microsoft.com/en-us/library/system.windows.controls.primitives.popup.isopen.aspx) to true. Setting the [IsLightDismissEnabled](http://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.xaml.controls.primitives.popup.islightdismissenabled) to true the popup closes whenever the user taps outside of the popup.

![windows8 dropdown button](../images/windows8_dropdown_button_plain.png)

Style and color it the way you want it to look and there you have an easy drop-down button for Windows 8.
