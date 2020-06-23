---
title: 'How To Continuosly Deploy Your Azure Web Jobs'
tags:
  - DevOps
  - Azure
description: New To Azure WebJobs? Learn how to get started and set up a build deploy pipeline.
thumbnail: ../images/happy_new_year.png
popular: false
draft: true
---

> WebJobs is a feature of Azure App Service that enables you to run a program or script in the same instance as a web app, API app, or mobile app. Since this runs as part of the same instance as the Web App, there is no additional cost to use WebJobs. _WebJobs is not supported on a Linux App Service._

The Azure WebJobs SDK simplifies the task of writing WebJobs. Version 3.x of WebJobs SDK supports both .NET Core and .NET Framework. At the time of writing there are no code templates to create a Azure WebJob .NET Core application in Visual Studio. However setting up is not that hard and well explained in the [Getting started with Azure WebJobs SDK article](https://docs.microsoft.com/en-us/azure/app-service/webjobs-sdk-get-started).

## Set Up Azure WebJob

All you need to do, is create a .NET Core Console application, add the _Microsoft.Azure.WebJobs_ and _Microsoft.Azure.WebJobs.Extensions_ NuGet packages. Update the Program.cs file in the .NET Console Application to use the HostBuilder as shown. If you want to log to the console, also add the _Microsoft.Extensions.Logging.Console_ NuGet package.

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
#if DEBUG
    builder.UseEnvironment("development");
#endif
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddAzureStorage();

    });
    builder.ConfigureLogging((context, b) =>
    {
        b.AddConsole();
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

To run the [host in development mode](https://docs.microsoft.com/en-us/azure/app-service/webjobs-sdk-how-to#host-development-settings) call the _UseEnvironment_ method on the builder and set it to _development_. It increases the queue polling interval, sets log level to verbose etc and makes development more efficient.

### Adding the Job

Azure Functions is also built on the WebJobs SDK and both have a lot in common. To add a Job we add a 'Function'.

The HostBuilder that we created is the container for these functions. It listens to various Triggers and calls the functions.

Triggers define how a function is invoked and a function must have exactly one trigger.

> [Check this article](https://docs.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs#compare-functions-and-webjobs) for the full differences between Azure WebJobs and Azure Functions.

## Azure DevOps Pipeline

### Build Pipeline

### Release Pipeline

Getting Started - https://docs.microsoft.com/en-us/azure/app-service/webjobs-sdk-get-started

Web Job Types - https://docs.microsoft.com/en-us/azure/app-service/webjobs-create#webjob-types
