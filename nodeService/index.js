var request = require('request');

var orderCount;


var Twitter = require('node-tweet-stream')
  , t = new Twitter({
    consumer_key: 'EPKzUx4PunKzL7j0MJdGPGpD0',
    consumer_secret: 'zn0ppKDivE9irX8EtHpwO3EtFc3nkU9Zjn0norCNzWNJpOMIsj',
    token: '4337715193-UeounMLKQ7fjJOLXvrHry4naZSoR3tUfmJcmQEG',
    token_secret: 'qUM3F6C5UjcMWaeW3b0DmPAaWjkU21FyhzSSjxgSyW8Bv'
  })


t.on('tweet', function (tweet) {
	console.log('tweet received', tweet.text);

	request('https://teamsterapp.firebaseio.com/tweetorder.json', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log("BODY = ", body);
		    orderCount = body;
		    var newCount = orderCount - 1;
		    
//			request({
//			    url : "https://teamsterapp.firebaseio.com/tweetorder.json",
//			    method: "PUT",
//			    json: newCount
//			});
			foo(newCount);
			postTweetInFirebase(newCount,tweet);
		  }
		  if(body == 'null') {  // the tweetorder was wiped out then
			  foo(100000);
			  
		  }
		 
	});
	

})

function foo(newCount) {
	    console.log('New count', newCount);
		request({
		    url : "https://teamsterapp.firebaseio.com/tweetorder.json",
		    method: "PUT",
		    json: newCount
		});
}

function postTweetInFirebase(newCount,tweet) {
	request({
	    url : "https://teamsterapp.firebaseio.com/tweets.json",
	    method: "POST",
	    json: {'screenName' : tweet.user.screen_name, 
	    		'text' :tweet.text,'statusId':tweet.id_str,
	    		'orderId':newCount,'tweetUrl': 'https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str}
	});
	

}

t.on('error', function (err) {
  console.log('Oh no')
})


t.track('@AmerenCorporation');
t.track('@AmerenMissouri');
t.track('@AmerenIllinois');
t.track('#ameren');
t.track('#pizza');
t.track('#brexit');



