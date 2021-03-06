---
author: [Rahul Nath]
title: "Remote Debugging: Azure Virtual Machines With Visual Studio"
  
date: 2019-09-13
tags:
- Azure
- Programming
thumbnail: ../images/remote_debug_visualstudio.jpg
---

It's not often that you want to debug into applications running on a Virtual Machine, but not to say that it is never required. Recently at one of my clients, I had to debug into an application running on an Azure Virtual machine. I wanted to debug an application with Azure AD group logic, and my laptop was not domain-joined. This called for remote debugging with the application running on a domain-joined virtual machine.

`youtube:https://www.youtube.com/embed/I_9LBBbsWHI`
<br /> 

In this post, we will look at how to set up the Virtual Machine and Visual Studio for remote debugging. If you are interested in watching this in action, check out the video in the link above.

## Setting up Virtual Machine

To be able to remote debug to a Virtual Machine it needs to be running the *Remote Debugging Monitor (msvsmon)*. Assuming you have Visual Studio installed on your local machine (which is why you are trying to debug in the first place), you can find *msvsmon* under the folder - *C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional\Common7\IDE\Remote Debugger*. The path might slightly different based on the version of Visual Studio and the Subscription (Professional, Community, Enterprise). The above path is for Visual Studio (VS) 2019 Professional version. Copy over the Remote Debugger folder into the virtual machine. Alternatively, you can also install the Remote Debugger tools from the [internet](https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugging?view=vs-2019#download-and-install-the-remote-tools). Make sure you download the version that matches the Visual Studio version that you will be using to debug.

Run the msvsmon.exe as an Administrator, and it will prompt you to set up some firewall rules on the Virtual Machine as below.

![](../images/remote_debug_firewallRules.jpg)

Once confirmed it adds in the following firewall rules for the x64 and x86 versions of the application. 

![](../images/remote_debug_firewall_Rules.jpg)

The Remote Debugging Monitor listens to a port ([each Visual Studio version has a different default](https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugger-port-assignments?view=vs-2019)) - 4024 for VS 2019. This can be changed under Options if needed. For this example I have turned off Authentication as shown below.

![](../images/remote_debug_running.jpg)

### Azure Portal Settings

In the Azure Portal, under the Networking tab for the Virtual Machine,  add an inbound port rule to open the port that msvsmon is listening - 4024 in this case

![](../images/remote_debug_vm_azure_portal.jpg)

## Debugging From Visual Studio

Now that everything is set up, we are good to debug the application from our local machine. Make sure the application to be debugged is running in the Virtual Machine. From Debug -> Attach To Process in Visual Studio. Choose Remote (no authentication) under the Connection type and enter the IP address or the fqdn to the VM along with the port number. Shortly you should see the list of applications running on the machine, and you can choose the appropriate app to debug.

![](../images/remote_debug_visualstudio.jpg)

Visual Studio is now debugging the application running on the Virtual Machine. Hope this helps and happy debugging! 