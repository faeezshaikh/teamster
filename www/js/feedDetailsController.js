angular.module('starter.controllers')

.controller('FeedDetailsCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService,$filter,CtrlService,$cordovaSocialSharing) {
	
		$scope.feedDetailId = $stateParams.feedId;
		var key = $scope.feedDetailId;

		var url = 'https://teamsterapp.firebaseio.com/feeds/' + key;
		var feedDetail = new Firebase(url);

		// TODO: Show a spinner.. Test in slow connections
		  feedDetail.on("value", function(snapshot) {
			  console.log(snapshot.val());
			  $scope.feed = snapshot.val();
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});
		  
		  
//		var feeds = CtrlService.getFeeds();
//		 console.log('Feeds:' ,feeds);
//         $scope.feed = $filter('getById')(feeds, key);
//         console.log("Found" , $scope.feed);
     
         $scope.share = function(item) {
       	  $cordovaSocialSharing
       	    .share(item.article, "Teamster Article",  item.articleImg,"http://www.ameren.com") // Share via native share sheet
       	    .then(function(result) {
       	      // Success!
       	    	 console.log('sharing successfull');
       	    }, function(err) {
       	      // An error occured. Show a message to the user
       	    	 console.log('sharing failed');
       	    });
         }
         
         
		 
		
});