---
date: 2010-10-24 06:29:00+00:00

slug: c-google-image-search
author: [Rahul Nath]
title: C# google image search
wordpress_id: 95
tags:
  - Dotnet
  - Tools
---

Need not much of an explanation I guess.
The title has it all....
....a C# API for searching images from google.
Works on Regex for matching the image URL from the HTML returned for the image tag search.This might stop working anytime google changes the formatting.
Even the current regex is not returning all the images from a page.Working on that though..would be fixed in the next release*.
I started this to try the AsynEnumerator from [PowerThreading ](http://www.wintellect.com/Resources/Downloads)Library by Wintellect.
I guess i've not understood it fully and there is an overuse of it in this version..that too would be looked into the next release*.

Download VS2010 source [code](http://rahulpnath.files.wordpress.com/2011/07/imagesearch_2010.jpg) (right click and save link as and  rename to .rar)
Download VS2008 source [code](http://rahulpnath.files.wordpress.com/2011/02/imagesearch_2008.jpg) (right click and save link as and  rename to .rar)

PS: Since the search results format is changing often the code might not work sometimes.Doing my best to keep it updated and working.Do check the comments too to see if the regex match string is changed.Sometimes I might not get time to update the solution,but would just leave a comment.Latest comment should be the best to match with :)

\*Conditions Apply: might be there :)
