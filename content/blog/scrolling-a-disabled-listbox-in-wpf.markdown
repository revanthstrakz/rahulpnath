---
  
date: 2009-08-06 04:33:00+00:00

slug: scrolling-a-disabled-listbox-in-wpf
author: [Rahul Nath]
title: Scrolling a Disabled Listbox in WPF
wordpress_id: 31
tags:
  - WPF
---

Recently I had a requirement when developing an application,where i needed a listbox which was to be disabled but yet can be scrolled,so that all the contents in it was visible.Applying the property,IsEnabled=False makes the whole listbox disabled even disabling the scroll.
I just found out a way around this.I created a custom listbox(MyScrollableListbox) with a property IsItemsEnabled.Setting this property to true,gives the normal listbox behaviour.When set to false only the ItemsPresenter of the listbox is disabled,so that scrolling is possible

The Custom Listbox looks like this(just one property added for now)

```vbnet
Public Class MyScrollableListbox
    Inherits ListBox
Public Property IsItemsEnabled() As Boolean
 Get
 Return GetValue(IsItemsEnabledProperty)
 End Get

Set(ByVal value As Boolean)
 SetValue(IsItemsEnabledProperty, value)
 End Set
 End Property

Public Shared ReadOnly IsItemsEnabledProperty As DependencyProperty = _
 DependencyProperty.Register("IsItemsEnabled", _
 GetType(Boolean), GetType(MyScrollableListbox), _
 New FrameworkPropertyMetadata(Nothing))

End Class
```

In the xaml(or if you are going to make it a custom control then you can give it in your Generic.xaml)

Now if you set the property IsItemsEnabled to false the listbox will be disabled,but allowing you to scroll.

edit: Added in [CodeProject](http://www.codeproject.com/tips/60619/Scrollable-Disabled-ListBox-in-WPF.aspx)

Hope it helps :)
