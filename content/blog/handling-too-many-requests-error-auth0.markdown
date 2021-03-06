---
author: [Rahul Nath]
title: "Handling Too Many Request Error with Auth0 Using Polly"
date: 2019-06-10
  
tags: 
- Programming
---

When interacting with third-party services over the network, it is good to have a fault handling and resilience strategy in place.  Some libraries have built-in capabilities while for others you might have to roll your own. 

Below is a piece of code that I came across at one of my clients. It talks to [Auth0](https://auth0.com/) API and gets all users. However, Auth0 API has a [rate limiting policy](https://auth0.com/docs/policies/rate-limits). Depending on the API endpoint, the rates limits differ. It also varies based on time and other factors. The HTTP Response Headers contain information on the status of rate limits for the endpoint and are dynamic. The below code does have a constant delay defined between subsequent API calls not to exceed rate limits

``` csharp
public async Task<User[]> GetAllUsers()
{
    var results = new List<User>();
    IPagedList<User> pagedList = null;

    do
    {
        pagedList = await auth0Client.Users.GetAllAsync(
           connection: connectionString,
           page: pagedList?.Paging.Start / PageSize + 1 ?? 0,
           perPage: PageSize,
           includeTotals: true,
           sort: "email:1");

        results.AddRange(pagedList);

        await Task.Delay(THROTTLE_TIME_IN_MS);
    } while (pagedList.Paging.Start + pagedList.Paging.Length < pagedList.Paging.Total);

    return results.ToArray();
}
```
The delay seems valid when looked in isolation, but when different code flows/apps make calls to the Auth0 API at the same time, this is no longer the case. The logs show that this was the case. There were many Auth0 errors with *429 StatusCode * indicating '*Too Many Requests*' and 'Global Rate Limit has reached.'

An obvious fix here might be to re-architect the whole solution to remove this dependency with Auth0 and not make these many API calls in the first place. But let's accept the solution we have in place and see how we can make it more resilient and fault tolerant. Rate limit Exceptions are an excellent example of transient errors. *A transient error is a temporary error that is likely to disappear soon. By definition, it is safe for a client to ignore a transient error and retry the failed operation.*

> [Polly](http://www.thepollyproject.org/) is a .NET resilience and transient-fault-handling library that allows developers to express policies such as Retry, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback in a fluent and thread-safe manner.

With Polly added in as a NuGet package, we can define a  policy to retry the API request up to 3 times with a 429 status code response. There is also a backoff time added to subsequent requests based on the attempt count and a hardcoded THROTTLE_TIME.

``` csharp
private Polly.Retry.AsyncRetryPolicy GetAuth0RetryPolicy()
{
    return Policy
        .Handle<ApiException>(a => a.StatusCode == (HttpStatusCode)429)
        .WaitAndRetryAsync(
            3, attempt => TimeSpan.FromMilliseconds(
                THROTTLE_TIME_IN_MS * Math.Pow(2, attempt)));
}
```

The original code to Auth0 using the policy is as below.

``` csharp
...
pagedListResult = await auth0RetryPolicy.ExecuteAsync(() => auth0Client.Users.GetAllAsync(
    connection: connectionString,
    page: pagedListResult?.Paging.Start / PageSize + 1 ?? 0,
    perPage: PageSize,
    includeTotals: true,
    sort: "email:1"));
```

The calls to Auth0 are now more resilient and fault tolerant. It automatically retries the request if the failure reason is 'Too Many Requests (429)'. It is an easy win with just a few lines of code. This is just an example of fault handling and retry with the Auth0 API. The same technique can be used with any other services that depend on. You just need to define your own policy and modify the calls to use them. Hope this helps you handle transient errors in your application. 