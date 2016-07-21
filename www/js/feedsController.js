angular.module('starter.controllers')
.controller('FeedsCtrl', function($scope, auth, store, $state, $timeout, PersonService, $cordovaToast,$firebaseArray,CtrlService,$cordovaSocialSharing,localStorage,$ionicModal) {
	  $scope.auth = auth;
	  $scope.items = [];
	  var ideaToDelete = {};
	  
	  $ionicModal.fromTemplateUrl('templates/composeIdea.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.composeIdeaModal = modal;
		});
	  
	  $ionicModal.fromTemplateUrl('templates/editIdea.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editIdeaModal = modal;
		});
	  
	  
	  $ionicModal.fromTemplateUrl('templates/deleteIdeaConfirmation.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.deleteIdeaModal = modal;
		});
	  
	  
	  $ionicModal.fromTemplateUrl('templates/confirmationModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.confirmationModal = modal;
		});
	  
	  
	  
	  var baseRef = new Firebase('https://teamsterapp.firebaseio.com/feeds');

	  var scrollRef = new Firebase.util.Scroll(baseRef, 'order');
	  $scope.items = $firebaseArray(scrollRef);
	  CtrlService.setFeeds($scope.items);
	  scrollRef.scroll.next(3);
	 
	  
	  ////
	  var lastIdeaRef = new Firebase('https://teamsterapp.firebaseio.com/lastIdea');
//	  var feedQuery = lastIdeaRef.orderByChild("id").equalTo(1); // We just have one obj but getting it as an array.
//	  var lastIdeaArr = $firebaseArray(feedQuery);
//	  
	  
	  var lastIdeaId,lastIdeaOrder;
	  
	  lastIdeaRef.on("value", function(snapshot) {
		  console.log('Last Idea objec',snapshot.val());
		  lastIdeaId =  snapshot.val().lastIdeaId;
		  lastIdeaOrder = snapshot.val().lastIdeaOrder;
//		  $scope.feed = snapshot.val();
		}, function (errorObject) {
		  console.log("The read of lastIdea Object failed: " + errorObject.code);
		});
	  ////
  
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

	  $scope.isLiked = function(feed) {
		  var likedFeeds = loadLikesFromCache();
			  if(likedFeeds.indexOf(feed.id) == -1) {
				  // Not found so not liked
				  	return false;
			  } else {
				  return true;
			  }
	  }
		  
	  $scope.updateLikes = function(index,obj) {
//		  obj = $scope.items[index]; // need to refresh
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
	  		  
	  // This function is called whenever the user reaches the bottom
	  $scope.loadMore = function() {
		  console.log('loadmore fired');
		    // load the next item
		    scrollRef.scroll.next(1);
		    CtrlService.setFeeds($scope.items);
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
	  
	  $scope.openComposer = function() {
		  $scope.newIdea = {title:'',desc:'',proprietary:false};
		  
		 $scope.composeIdeaModal.show();
	  }
	  
	  $scope.openEditor = function(item) {
		  $scope.idToEdit = item.$id;
		  $scope.editIdea = {};
		  $scope.editIdea.proprietary = item.sharing == true ? false : true;
		  $scope.editIdea.title = item.title;
		  $scope.editIdea.desc = item.article;
		  $scope.editIdea.author = item.name;
		  $scope.editIdea.authorPic = item.picture.thumbnail,
		  $scope.editIdea.articleImg = item.articleImg;
		  $scope.editIdeaModal.show();
	  }
	  
	  
	  $scope.closeComposer = function() {
		  $scope.composeIdeaModal.hide();
		  $scope.editIdeaModal.hide();
	  }
	  
	  $scope.openConfirmation = function() {
		  $scope.confirmationModal.show();
	  }
	  
	  $scope.openDeleteConfirmation = function(item) {
		  $scope.deleteIdeaModal.show();
		  ideaToDelete = item;
	  }
	  $scope.closeDeleteConfirmation = function() {
		  $scope.deleteIdeaModal.hide();
	  }
	  $scope.closeConfirmation = function() {
		  $scope.confirmationModal.hide();
	  }
	  
	  $scope.deleteIdea = function() {
		  $scope.items.$remove(ideaToDelete);
		  $scope.deleteIdeaModal.hide();
	  }
	  
	  function getRandomImg() {
		  var arrayOfImgs = ["http://images.huffingtonpost.com/2015-06-23-1435071172-9008959-brainstormidea.jpg",
		                     "http://static1.squarespace.com/static/530d75c7e4b0027bb049b777/t/5316ca37e4b02dddf7547c7f/1394002491278/5220e801b1396_light_bulb_idea.jpg",
		                     "http://1.bp.blogspot.com/-d6x0pLrpNyY/UA5Sz10gJaI/AAAAAAAAHH4/J7BPNgN2z6g/s1600/Idea_images.png",
		                     "http://images.huffingtonpost.com/2015-04-10-1428680355-4850708-HowMuchIsIdeaWorth-thumb.jpg",
		                     "https://www.ethos3.com/wp-content/uploads/2014/07/160231452.jpg",
		                     "http://rockypeaklc.com/blog/wp-content/uploads/2014/03/getinthemind.jpg",
		                     "http://media.bizj.us/view/img/5302701/idea*750xx3392-1908-0-182.jpg"];
		  var randomImg = arrayOfImgs[Math.floor(Math.random() * arrayOfImgs.length)];
		  return randomImg;
	  }
	  
	  $scope.finalSubmit = function() {
		  $scope.confirmationModal.hide();
		  $scope.composeIdeaModal.hide();
		  var date = new Date();
		  
		  var obj = {
				  title:$scope.newIdea.title,
				  article:$scope.newIdea.desc,
				  name: PersonService.GetUserDetails().name, // We could do that, but if admin wants to secretly update an idea it would expose the admin
				  articleImg : getRandomImg(),  // Same reason as above
				  sharing: $scope.newIdea.proprietary ? false : true,
//				  id:lastIdeaArr[0].lastIdeaId+1,
//				  order:lastIdeaArr[0].lastIdeaOrder-1,
				  id:lastIdeaId+1,
				  order:lastIdeaOrder-1,
				  articleDate: date.toString(),
				  picture: {thumbnail : PersonService.GetUserDetails().img},
				  likes:0
				  };
		  
		  $scope.items.$add(obj);
	    
		  var fredNameRef = new Firebase('https://teamsterapp.firebaseio.com/lastIdea');
		  fredNameRef.update({ lastIdeaId: lastIdeaId+1, lastIdeaOrder: lastIdeaOrder-1 });
		  
	  }
	  
	  $scope.saveEdit = function() {
		  $scope.editIdeaModal.hide();
		  var obj = {
				  title:$scope.editIdea.title,
				  article:$scope.editIdea.desc,
//				  name: PersonService.GetUserDetails().name,   // We could do that, but if admin wants to secretly update an idea it would expose the admin
				  name: $scope.editIdea.author, 
//				  articleImg : getRandomImg(),  // Same reason as above
				  articleImg : $scope.editIdea.articleImg,
				  sharing: $scope.editIdea.proprietary ? false : true,
				  articleDate: new Date().toString(),
//				  picture: {thumbnail : PersonService.GetUserDetails().img},
				  picture: {thumbnail : $scope.editIdea.authorPic}, 
				  };
		  
		  var url = 'https://teamsterapp.firebaseio.com/feeds/' + $scope.idToEdit;
		  var fredNameRef = new Firebase(url);
		  fredNameRef.update(obj);
		  
		  
		  
	  }
	  
	  $scope.isItMine = function(item) {
		  if(PersonService.GetUserDetails().name == item.name) {
			  return true;
		  }
		  return false;
	  }
	  
	  
	  $scope.isIdeaValid = function(title, desc) {
		  if( $scope.isTitleValid(title) && $scope.isDescValid(desc) ) {
			  return true;
		  }
		  return false;
	  }
	  
	 $scope.isTitleValid = function(title) {
		 if(title && title.length>8 && title.length<40) {
			 return true;
		 }
		 return false;
	 }
	 $scope.isDescValid = function(desc) {
		 if(desc && desc.length>100) {
			 return true;
		 }
		 return false;
	 }

	  
	});