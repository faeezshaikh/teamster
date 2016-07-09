angular.module('starter.controllers')

.controller('FeedDetailsCtrl', function($scope, 
		 store, $state,$stateParams,
         $ionicScrollDelegate,$firebaseArray,$firebase, 
         FIREBASE_URL,PersonService,$filter,CtrlService,$cordovaSocialSharing) {
	
		$scope.feedDetailId = $stateParams.feedId;
		var key = $scope.feedDetailId;
		 var feeds = CtrlService.getFeeds();
		 console.log('Feeds:' ,feeds);

         $scope.feed = $filter('getById')(feeds, key);
         console.log("Found" , $scope.feed);
//         $scope.selected = JSON.stringify(found);
     
         $scope.share = function(item) {
       	  console.log('sharing called',item);
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