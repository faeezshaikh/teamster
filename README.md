
To run on Android emulator
===========================
1. Start Genymotion
2. Select Android virtual device and run it .
3. sudo run android -l -c


Plugins:
========

1. cordova plugin add cordova-plugin-inappbrowser
2. ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git

White screen of death probably due to plugins or network issues.

3. ionic plugin add phonegap-plugin-push (see below point on how to install with GCM Number)
4. Social Sharing plugin: cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git (see below for details)

List all installed plugins

	cordova plugins list

For Inoic Push Notifications
==============================

Ref: Ionic Docs and
https://devdactic.com/ionic-push-notifications-guide/


		1. Install web client using
		
		bower install --save-dev ionic-platform-web-client
		
		
		2. Then <script src>
			<script src="lib/ionic-platform-web-client/dist/ionic.io.bundle.js"></script>
		
	For Android
	=============
	1. Get Project number from Google console: (this is your GCM_Number) 315458224205
		https://console.cloud.google.com/home/dashboard?project=ameren-teamster
		
	2. Run these commands:
		sudo ionic plugin add phonegap-plugin-push --variable SENDER_ID="315458224205"
		
		sudo ionic config set gcm_key 315458224205
		
		
		
iOS Push Notifications
========================

https://devdactic.com/ionic-push-notifications-guide/
http://docs.ionic.io/docs/ios-push-profiles
Posidon745			

 Uncaught TypeError: Cannot read property 'pushNotification' of undefined  ng-cordova.js:6180
 
 Will appear in browser. But will work on actual device
 
 
 1. In apps.ionic.com --> Settings -> Certificates make two profiles. One for 'Test' (development) and other for 'Production'.
 	Under 'Production' profile upload the .p12 (production certificate). for iOS. For android get the API key from google console.
 	
 2. Refer the screenshot for 'Build Settings' and 'Code Signing' properties. (Use correct provisioning profile)
 3. For iOS - Make App Id. Provisoning profile (See Udemy video). Uploaded through command line and set "production_mode = n" although new documentation doesnt have that. In new Doc you upload the .p12 files through the ionic site.
 			
		
To send push notifications from Postman
=======================================

POST
https://api.ionic.io/push/notifications

Headers:

Content-Type: application/json
Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDNjYjgwZi0yMmVmLTRmMDQtOTJhZi1kNDNiMWFlM2E3NDIifQ.FwRyg6N3Kr_9lU2sxvfHyLwOHWbHX4_rv_dUIGkknHw


Body:
{
    "tokens": ["eWcuh4kGlNQ:APA91bGXT7qKu11h-4LD2J_K5txamToGKVhzQREkttvOLCtpeKmWEygba2toUobIkJILPJ1T-PnEpECyb_XeE6psNw9A4rJeNOcovlfKZmKyQBIDgwgZFbufgB3gDyBBOdBeYHQkNhE9"],
    "profile": "test",
    "notification": {
        "message": "Tom Rice rides 100 miles for Cure for Cancer!"
    }
}

POSTMAN Collection:
https://www.getpostman.com/collections/e1b96873e0dd5aa76190

To Get Tokens:
==============
GET
https://api.ionic.io/push/tokens/

Use Same Headers as above

For network calls, add in config.xml
====================================
  <allow-intent href="*"/>
  <allow-navigation href="*"/>
  
  	This goes hand in hand with the whitelist plugin listed above
  
  
 For CORS issue
==================
 
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
============================
 
 
	 Instead of doing a require('target.js')
	 
	 Download target.js
	 
	 For all its dependencies do npm install in the same folder as downloaded
	 
	 npm install dep1
	 
	 then do 
	 browserify -g target.js moduleName > myTarget.js
	 
	 Then <script include> myTarget.js
	 Then inject module in angular app.js ..Use the same name as the one used in the command above?
  
  

In order to use pull-to-refresh and infinite-scroll
====================================================

By default the newest item appears at the bottom of the list in the view. This is becasuse in Firebase the default order is always ascending.
Used workaround. While inserting records in list, used orderId, Started with 1M and for every insert decreased by one and then in FB query ordered by 'orderId'  


Page scroll to bottom issue
============================
// Added below line because view is not scrolling to the bottom on the recepient side when a new msg arrives
	messagesRef.on('child_added', function(childSnapshot, prevChildKey) {
		  // code to handle new child.
		console.log('Fired..',childSnapshot)
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			},1000);
		});


Permission denied for /.config
================================
Error: EACCES: permission denied, open '/Users/faeezshaikh/.config/configstore/bower-github.json'
You don't have access to this file.

Run these 2 commands in project directory
	
	sudo chown -R $USER:$GROUP ~/.npm
	sudo chown -R $USER:$GROUP ~/.config
	
	
To Run Twitter Service
========================
Start the service from CLI

	cd git/teamster
	node index.js	
	
In case you get errors on missing dependencies

	npm install request	
	
	
Social Sharing
===============
1. Install plugin

		sudo cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git	
		
		
To demo
=======

As soon as you load 'feeds' EVERYTHING gets deleted..all references.
lastIdea needs to be present if you have feeds loaded, otherwise error		


Splash Screen
==============
By default ios splash screen works fine, android does not test in emulator by running in Genymotion

		sudo ionic run android

To make splash screen work in android install cordoval splash screen plugin. No need to remove and add android platform

	cordova plugin add cordova-plugin-splashscreen
	
	

 
 Screenshots:
 ============
 http://www.appscreenshot.me
 faeez.shaikh@gmail.com
 
 For Aug4 demo: 
 http://mockuphone.com/preview/aaca6f9233157297a975d89d99b62d13
 
 
 Icon maker:
 https://makeappicon.com
 
 Android Feature Graphic in Canva.com
 
 iOS Ipad Screenshot for iTunes - ios-simulator deviceType = iPad-Pro
 
 Other: (not used)
 https://placeit.net/