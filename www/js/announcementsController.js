angular.module('starter.controllers')


.controller('AnnouncementsCtrl', function($scope,localStorage) {
//	$scope.announcements = ["First announcement","Second announcements","Third announcements","Fourth announcements","Fifth announcements","Sixth announcement",]
	$scope.announcements = [{"id":1, "text" : "First"},{"id":2, "text" : "Second"},{"id":3, "text" : "Third"}];
	
	$scope.updateFavorites = function(announcement) {

		  var favAnnouncements = loadAnnouncementsFromCache();
		  if($scope.checkIfFavorite(announcement))  {
			  if(getIndexInArray(announcement,favAnnouncements) != -1) {
				  favAnnouncements.splice(favAnnouncements.indexOf(announcement),1);
			  }
		  }
		  else { // not liked yet, so go ahead and like it
			  favAnnouncements.push(announcement);
		  }
		  localStorage.set("announcements",JSON.stringify(favAnnouncements));
	  
	}
	
	function loadAnnouncementsFromCache() {
		var favoriteAnnouncements = JSON.parse(localStorage.get("announcements"));
		if(favoriteAnnouncements) {
			return favoriteAnnouncements
		} else {
			return [];
		}
	
		
	}
	
	function containsObject(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return true;
	        }
	    }

	    return false;
	}
	
	function getIndexInArray(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return i;
	        }
	    }

	    return -1;
	}
	
	$scope.checkIfFavorite = function(announcement) {
		var favoriteAnnouncements = loadAnnouncementsFromCache();
		 if(containsObject(announcement,favoriteAnnouncements)) {
			  	return true;
		  } else {
			  return false;
		  }
	}
});