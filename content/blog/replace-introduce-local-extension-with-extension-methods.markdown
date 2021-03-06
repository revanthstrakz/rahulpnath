---
  
date: 2010-08-25 13:04:00+00:00

slug: replace-introduce-local-extension-with-extension-methods
author: [Rahul Nath]
title: Replace ‘Introduce Local Extension’ With ‘Extension Methods’
wordpress_id: 92
tags:
  - Refactoring
---

Introduce Foreign Method([IFM](http://www.refactoring.com/catalog/introduceForeignMethod.html)) and Introduce Local Extension([ILE](http://www.refactoring.com/catalog/introduceLocalExtension.html)) are two refactoring techniques that comes handy when you need to add functionality to an exisiting class,source code of which is beyond your control.
IFM is used when its just one or two functions that you need to add to the class.When the number of functions,that are to be added are more,then ILE is used.Not a rule though :)
But now with [Extension Methods](http://msdn.microsoft.com/en-us/library/bb383977.aspx) the whole process is much more simpler.
You need not do the subclassing or wrapper technique of ILE.
This can be a third way of implementing ILE :).Thanks to the framework team for keeping it simple.
The same date example using the 'Extension Methods' way of refactoring

```csharp
public static class MyExtensionMethods
   {
     public static DateTime NextDay(this DateTime date)
     {
      return new DateTime(date.Year, date.Month, date.Day+1);
     }
   }
```

The function NextDay is now available on any DateTime object,just as if you have written if you had access to the source code. It's the usage of ILE and IFM that has paved way for the inclusion of Extension Methods in the framework I guess.Thanks to [Fowler ](http://martinfowler.com/)for that.
[CodeProject](http://anyurl.com)
