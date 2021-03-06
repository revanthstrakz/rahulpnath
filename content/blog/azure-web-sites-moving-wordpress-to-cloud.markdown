---
  
date: 2014-05-26 15:46:09+00:00

author: [Rahul Nath]
title: 'Azure Web Sites: Moving Wordpress to Cloud'
wordpress_id: 1431
tags:
  - Azure
  - Blogging
thumbnail: ../images/PortalQuickglance.jpg
---

It’s been almost an year since I have moved to this custom hosted blog and is nearing its renewal with my current host, Godaddy. Now that Azure has full support for Web Sites which enables you to deploy web applications on a scalable and reliable cloud infrastructure and being a FTE(Full Time Employee), I have the privilege of a free [msdn account that offers 150\$ free credit on azure](http://azure.microsoft.com/en-us/pricing/member-offers/msdn-benefits-b/), I have decided on to move to Azure for my blog. You could also try this with [a free Azure trial that offers you 200\$ credit for all the services](http://azure.microsoft.com/en-us/pricing/free-trial/)

**Setting up Wordpress** on Azure is very easy and is just a matter of few clicks from the [Management Portal](https://manage.windowsazure.com). You can find the detailed steps to get this done [here](http://azure.microsoft.com/en-us/documentation/articles/web-sites-php-web-site-gallery/). By default Azure Web Sites are installed in the root directory of IIS. To move this into a sub-folder of your choice, you can use any FTP client(FileZilla). The connection details can be obtained from the Management Portal as shown in the below screen shot.

![Portal Quick glance](../images/PortalQuickglance.jpg) ![Portal Quick glance 1](../images/PortalQuickglance1.jpg)

**Mapping your custom domain **to the new wordpress site is about adding a [CName record for awverify or www](http://azure.microsoft.com/en-us/documentation/articles/web-sites-custom-domain-name/) in your Domain dashboard provided by the domain registrar. Once you have the required CName entries you can map the custom domain in the portal using the ‘Manage Domains’ option.

![Custom Domain](../images/CustomDomain.jpg)

**Restoring your content **from my current host was easy as I am using [Vaultpress](http://vaultpress.com) for my site backup and it provides an option to [backup to a different web site too](http://help.vaultpress.com/restore-to-a-new-site/). If not you could also use [FTP to move your current site content which is detailed out here](http://www.davebost.com/2013/07/11/moving-a-wordpress-blog-to-windows-azure-transferring-your-content). Once the content is restored you would need to update the Wordpress Url and Site address url in the General Settings of your blog dashboard. You could also update this directly on the MySQL database in the _wp_options_ table(_home_ and _siteurl_ property). To connect to the database you would get the connection string details from the portal and you can use [MySQL Workbench](http://www.mysql.com/products/workbench/) to connect to it. You might have to recheck your permalink setting on the Wordpress dashboard to ensure that it is the same as you were using earlier.

![General Settings](../images/AzureGeneralSettings.jpg)

Now you are up an running your blog on Azure!!

**Things to look out for:**

**1**. Make sure that all your blog links use your custom domain and not *yourdomain*.azurewebsite.net.

**2**. I had my Jetpack commenting system broken as I had moved the blog to a subdirectory. To correct this you would need to disconnect jetpack from the wordpress account and reconnect it. You can do this from the Wordpress dashboard. If reconnecting throws some error, then connect to your SQL database and delete of the entries that starts with jetpack in the _wp_options_ table.(Make sure you have a db backup before you do this). Reconnecting after that should work fine

**3. **If you see any error indicating there is a Redirect loop error, this is mostly because you would be redirecting a no-www request to the www sub domain. In this case make sure that the siteurl and home property in wp_options table also has www in the urls. Otherwise it will keep redirecting itself between no-www and www creating a redirect loop.

\*\*Edit:

4. \*\*If you face any error while trying to connect to the azure hosted web site from [Windows Live Writer](http://www.microsoft.com/en-in/download/details.aspx?id=8621)(WLW), this most likely is because it uses [xmlrpc.php](http://codex.wordpress.org/XML-RPC_Support) for publishing posts to the site and this is accessed over the https enpoint. Since https is not setup for the custom domain, accessing xmlrpc.php over https would present you with the below certificate error.

![Https error](../images/wlw_https_error.jpg)

You could either configure your ssl bindings in azure portal, under the [Configure tab under your website](http://ruslany.net/2013/07/how-to-setup-ip-ssl-on-windows-azure-web-sites/). SSL bindings to custom domains can only be used in Basic or Standard mode. If yours is not in basic or standard mode as mine, you can workaround this by either configuring the blog in WLW using your \*.azurewebsites.net url.

**Azure Plans & Pricing**

If you do not have a free account, you might be thinking of the costs that would be really incurred for you to move on to Azure. In short Azure Web Sites is offered in four tiers: **Free**, **Shared (Preview)**, **Basic** and **Standard**. The pricing details for each of these is available in detail [here](http://azure.microsoft.com/en-us/pricing/details/web-sites/). To have a custom domain name mapping you would at least need to choose Shared mode. For more information on how to choose the right plan for you, Scott Hanselman has a very good article on [Penny Pinching in the cloud.](http://www.hanselman.com/blog/PennyPinchingInTheCloudWhenDoAzureWebsitesMakeSense.aspx)

Do you plan to move to Azure Web Sites some time soon?
