---
  
date: 2009-08-20 16:41:00+00:00

slug: solidcolorbrush-list-from-brushes
author: [Rahul Nath]
title: SolidColorBrush List from Brushes
wordpress_id: 30
tags:
  - WPF
---

Hi,
Everybody will be using [Brushes](http://msdn.microsoft.com/en-us/library/system.windows.media.brushes.aspx),which implements a set of predefined SolidColrBrush objects,to choose various colors.
Sometimes you may want to get a list of all these brushes up in your application,so that the user can select the color of his/her choice.
To get the list of colors from Brushes you can use the following piece of code

```vbnet
Dim dictBrushes As New Dictionary(Of String, SolidColorBrush)
For Each objPropertyInfo As PropertyInfo In GetType(Brushes).GetProperties
	If (objPropertyInfo.PropertyType Is GetType(SolidColorBrush)) Then
 		dictBrushes.Add(objPropertyInfo.Name,objPropertyInfo.GetValue(Nothing, Nothing)) 
	End If 
Next
```

Here dictBrushes will give what you want.
You can use this in your view,bind to a combobox if you want and show the possible selections of color

Hope it helps :)
