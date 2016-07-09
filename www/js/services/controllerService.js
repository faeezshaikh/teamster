angular.module('starter.controllers')

.service('CtrlService', function(localStorage) {
	var feeds = [];
	var hotTopics = [];
	var hotnessNumber;
	return {
		setFeeds : function(arr) {
			feeds = arr;
		},
		getFeeds : function() {
			return feeds;
		},
		addHotTopic : function(topicId) {
			console.log('Added hot topic',topicId);
			hotTopics.push(topicId);
		},
		isTopicHot : function(topicId) {
			if(hotTopics.indexOf(topicId) == -1) {
				return false;
			}
			else {
				console.log(topicId + ' is hot');
				return true;
			}	
		}
	}
});