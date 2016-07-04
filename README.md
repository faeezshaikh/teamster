Plugins:
--------
1. cordova plugin add cordova-plugin-inappbrowser
2. ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git

White screen of death probably due to plugins or network issues.


For Inoic Push
===============

1. Install web client using

bower install --save-dev ionic-platform-web-client


2. Then include


For network calls, add in config.xml
--------
  <allow-intent href="*"/>
  <allow-navigation href="*"/>
  
  This goes hand in hand with the whitelist plugin listed above
  
  
 For CORS issue
 ----------------
 
 Add Proxies array in ionic.project file:
 ,
  "proxies": [
    {
      "path": "/api",
      "proxyUrl": "https://api.twitter.com/1.1/"
    }
  ]
  
  then update urls 
  
 
 For running node in browser
 
 --------
 
 Instead of doing a require('target.js')
 
 Download target.js
 
 For all its dependencies do npm install in the same folder as downloaded
 
 npm install dep1
 
 then do 
 browserify -g target.js moduleName > myTarget.js
 
 Then <script include> myTarget.js
 Then inject module in angular app.js ..Use the same name as the one used in the command above?
  
  

In order to use pull-to-refresh and infinite-scroll
------------------------------------------------------

By default the newest item appears at the bottom of the list in the view. This is becasuse in Firebase the default order is always ascending.
Used workaround. While inserting records in list, used orderId, Started with 1M and for every insert decreased by one and then in FB query ordered by 'orderId'  



Permission denied for /config
Error: EACCES: permission denied, open '/Users/faeezshaikh/.config/configstore/bower-github.json'
You don't have access to this file.

sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config