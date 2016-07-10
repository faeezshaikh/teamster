angular.module('starter.controllers')
.controller('FeedsCtrl', function($scope, auth, store, $state, $timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal) {
	  $scope.auth = auth;
	  
	  $scope.items = [];
	  
	  $ionicModal.fromTemplateUrl('templates/composeIdea.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.composeIdeaModal = modal;
		});
	  
	  $ionicModal.fromTemplateUrl('templates/confirmationModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.confirmationModal = modal;
		});
	  
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
	 
	  
	  ////
	  var lastIdeaRef = new Firebase('https://teamsterapp.firebaseio.com/lastIdea');
	  var feedQuery = lastIdeaRef.orderByChild("id").equalTo(1); // We just have one obj but getting it as an array.
	  var lastIdeaArr = $firebaseArray(feedQuery);
	  ////

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
	  
	  $scope.getDate = function(dateString) {
		  return new Date(dateString);
	  }
	  
	  $scope.isItemHot = function(feed) {
		  var hotNumber = JSON.parse(localStorage.get("hotnessNumber"));
		  if(hotNumber) {
			  
		  } else {
			   hotNumber = 3;
		  }
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
	  
	  $scope.openComposer = function() {
		  $scope.newIdea = {proprietary:false};
		 $scope.composeIdeaModal.show();
	  }
	  
	  $scope.closeComposer = function() {
		  $scope.composeIdeaModal.hide();
	  }
	  
	  $scope.openConfirmation = function() {
		  $scope.confirmationModal.show();
	  }
	  $scope.closeConfirmation = function() {
		  $scope.confirmationModal.hide();
	  }
	  
	  function getRandomImg() {
		  return "http://images.huffingtonpost.com/2015-06-23-1435071172-9008959-brainstormidea.jpg";
	  }
	  
	  $scope.finalSubmit = function() {
		  $scope.confirmationModal.hide();
		  $scope.composeIdeaModal.hide();
		  var date = new Date();
		  var obj = {
				  article:$scope.newIdea.desc,
				  name: PersonService.GetUserDetails().name,
				  articleImg : getRandomImg(),
				  sharing: $scope.newIdea.proprietary ? false : true,
				  id:lastIdeaArr[0].lastIdeaId+1,
				  order:lastIdeaArr[0].lastIdeaOrder-1,
				  articleDate: date.toString(),
				  picture: {thumbnail : PersonService.GetUserDetails().img},
				  likes:0
				  };
		  $scope.items.$add(obj);
	    
		  var fredNameRef = new Firebase('https://teamsterapp.firebaseio.com/lastIdea/0');
		fredNameRef.update({ lastIdeaId: lastIdeaArr[0].lastIdeaId+1, lastIdeaOrder: lastIdeaArr[0].lastIdeaOrder-1 });
		  
	  }
	  
	});