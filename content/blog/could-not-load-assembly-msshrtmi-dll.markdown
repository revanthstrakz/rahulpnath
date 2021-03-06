---
author: [Rahul Nath]
title: 'Could Not Load Assembly msshrtmi.dll?'

tags:
  - Dotnet
  - Azure
date: 2016-06-19 17:38:37
keywords:
description:
thumbnail: ../images/msshrtmi_load_error.png
---

While migrating a few Azure Cloud Services to Web Jobs, we started facing the error, <span style='color: red;'>_Could not load assembly ... /msshrtmi.dll_</span>,for just one of the projects. The error provides the exact path from where it is trying to load the DLL and is the same path from which the process is running. But the location does have the _msshrtmi.dll_, which for some reason the process is not able to load.

<img class="center" src="../images/msshrtmi_load_error.png" alt="msshrtmi dll load error" />

<div class="alert alert-info" role="alert">
<strong>TL;DR</strong> This error occurred due to an attribute - <i>&lt;Prefer32Bit&gt;false&lt;/Prefer32Bit&gt;</i> - in the csproj file, while the referred msshrtmi dll was 32-bit version. This might not be applicable to you, but since it has happened once it's very likely to happen again.
</div>

To our surprise, this was happening only with a specific worker, while all others (around 8) were working fine. All of the workers are generated by the same build process on a server. For some reason (I am still investigating into this) the msshrtmi.dll is added as an external reference in the project and referred from there in all the project files. This was done mainly because we had a few external dependencies that were dependent on specific Azure SDK version (2.2). But this explicit reference should not have caused any issues as all, as the other processes were working fine and only a specific one was failing.

One useful tool to help diagnose why the .NET framework cannot locate assemblies is [Assembly Binding Log Viewer(Fuslogvw.exe)](https://msdn.microsoft.com/en-us/library/e74a18c4(v=vs.110\).aspx). The viewer displays an entry for each failed assembly bind. For each failure, the viewer describes the application that initiated the bind; the assembly the bind is for, including name, version, culture and public key; and the date and time of the failure.

> _Fuslogvw.exe is automatically installed with Visual Studio. To run the tool, use the Developer Command Prompt with administrator credentials._

Running _fuslogvw_ with the application shows the assembly binding error, double clicking which gives a details error information, as shown below. This error message gives more details and tells us that the assembly platform or ContentType is invalid.

<img class="center" src="../images/msshrtmi_fuslogvw.png" alt="LOG: Assembly Name is: msshrtmi, Version=2.2.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35
ERR: Invalid assembly platform or ContentType in file (hr = 0x8007000b).
ERR: Run-from-source setup phase failed with hr = 0x8007000b.
ERR: Failed to complete setup of assembly (hr = 0x8007000b). Probing terminated." />

In the Task Manager, the worker with the assembly loading error (last _worker_ in the image below) shows as a 64-bit process, while the others as 32-bit. Since the referred msshrtmi DLL is 32-bit, it explains why it was unable to find the correct platform matching msshrtmi assembly.

<img class="center" src="../images/msshrtmi_task_manager.png" alt="msshrtmi task manager" />

[CorFlags.exe](https://msdn.microsoft.com/en-us/library/ms164699(v=vs.110\).aspx) is used to determine whether an .exe file or .dll file is meant to run only on a specific platform or under WOW64. Running the _corflags_ on all the workers produces the below two results:

<mark>corflags Problematic_Worker.exe</mark>  
Version : v4.0.30319  
CLR Header: 2.5  
PE : PE32  
CorFlags : 0x1  
ILONLY : 1  
32BITREQ : 0  
<mark>32BITPREF : 0</mark>  
Signed : 0

<mark>corflags Worker.exe</mark>  
Version : v4.0.30319  
CLR Header: 2.5  
PE : PE32  
CorFlags : 0x20003  
ILONLY : 1  
32BITREQ : 0  
<mark> 32BITPREF : 1</mark>  
Signed : 0

The _32BITPREF_ flag is '0' for the worker that shows the error, whereas for the rest shows 1. The [*32BITPREF*](https://msdn.microsoft.com/en-us/library/ms164699(v=vs.110\).aspx) flag indicates that the application runs as a 32 bit process even on 64-bit platforms. This explains why the problematic worker was running as 64-bit process since the flag is turned off.

> _[From .NET 4.5 and Visual Studio 11](http://blogs.microsoft.co.il/sasha/2012/04/04/what-anycpu-really-means-as-of-net-45-and-visual-studio-11/), the default for most .NET projects is again AnyCPU, but there is more than one meaning to AnyCPU now. There is an additional sub-type of AnyCPU, “Any CPU 32-bit preferred”, which is the new default (overall, there are now five options for the /platform C# compiler switch: x86, Itanium, x64, anycpu, and anycpu32bitpreferred). When using that flavor of AnyCPU, the semantics are the following:_

> - _If the process runs on a 32-bit Windows system, it runs as a 32-bit process. IL is compiled to x86 machine code._
> - _If the process runs on a 64-bit Windows system, it runs as a 32-bit process. IL is compiled to x86 machine code._
> - _If the process runs on an ARM Windows system, it runs as a 32-bit process. IL is compiled to ARM machine code._

All the projects are getting built using the same build scripts, and we are not explicitly turning off/on this compiler option. So the next possible place where any setting for this flag is specified is the _csproj_ file. On the properties of the worker project file (the one that shows error), I see that '_Prefer 32-bit_' option is not checked and the csproj file has it explicitly set to false (as shown below). For other projects, this option is checked in Visual Studio and has no entry in the csproj file, which means the flag defaults to true.

<img class="center" src="../images/msshrtmi_prefer32bit.png" alt="msshrtmi prefer 32bit csproj" />

**_Deleting the Prefer32Bit attribute from the csproj and building fixed the assembly loading issue of msshrtmi!_**

Though this ended up being a minor fix (in terms of code change), I learned a lot of different tools that can be used to debug assembly loading issues. It was using these right tools that helped me identify this extra attribute on the csproj file and help solve the issue. So the next time you see such an error , either with mssrhtmi or another DLL, hope this helps to find your way through!
