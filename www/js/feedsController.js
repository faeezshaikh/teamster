angular.module('starter.controllers')
.controller('FeedsCtrl', function($scope, auth, store, $state, $timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage) {
	  $scope.auth = auth;
	  
	  $scope.items = [];
	//  var allFeeds = [];
	  
	  function loadLikesFromCache() {
		  var likedFeeds = JSON.parse(localStorage.get("liked"));
		  if(likedFeeds) {
			  return likedFeeds
		  } else {
			  var a = []
			  if(a instanceof Array) {
				  return a;
			  } 
		  }
	  }

	  var baseRef = new Firebase('https://teamsterapp.firebaseio.com/feeds');

	  var scrollRef = new Firebase.util.Scroll(baseRef, 'order');
	  $scope.items = $firebaseArray(scrollRef);
	  CtrlService.setFeeds($scope.items);
	  scrollRef.scroll.next(3);
	 

	  $scope.isLiked = function(feed) {
		  var likedFeeds = loadLikesFromCache();
			  if(likedFeeds.indexOf(feed.id) == -1) {
				  // Not found so not liked
				  	return false;
			  } else {
				  return true;
			  }
	  }
		  
		  
	  // This function is called whenever the user reaches the bottom
	  $scope.loadMore = function() {
		  console.log('loadmore fired');
		    // load the next item
		    scrollRef.scroll.next(1);
		  $scope.$broadcast('scroll.infiniteScrollComplete');
	  };
	  
	  $scope.isItemHot = function(feed) {
		  var hotNumber = JSON.parse(localStorage.get("hotnessNumber"));
		  if(hotNumber) {
			  
		  } else {
			   hotNumber = 3;
		  }
		  console.log('Hotness number is:',hotNumber);
		  if(feed.commenters && feed.commenters.length>hotNumber) {
			  return true;
		  }
		  return false;
	  };
	  
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
	  
	  $scope.updateLikes = function(index,obj) {
		  var likedFeeds = loadLikesFromCache();
		  if($scope.isLiked(obj))  {
			  $scope.liked=false
			  likedFeeds.splice(likedFeeds.indexOf(obj.id),1);
			  obj.likes --;
		  }
		  else { // not liked yet, so go ahead and like it
			
			  $scope.liked= true;
			  obj.likes++;
			  likedFeeds.push(obj.id);
		  }
		  localStorage.set("liked",JSON.stringify(likedFeeds));
		  $scope.items[index] = obj;
		  $scope.items.$save(obj);   // synchronize it with Firebase array
	  }
	});