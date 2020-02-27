
window.onload = function(){
	youtubePlayer.initial();
	search.mostPopularVideoSearch.action();
	document.getElementById("search-span").addEventListener("click" , search.effectHandler.searchIconClicked , false);
	document.getElementById("search-input").addEventListener("keyup" , search.effectHandler.searchEnterClicked , false);
	document.getElementById("main-section").addEventListener("click" , youtubePlayer.videoClicked.action , false);
	document.getElementById("back-top").addEventListener("click" , search.effectHandler.moveToTop , false );
	document.getElementById("mode-btn").addEventListener("click" , mode.redirectTo , false);
	//document.getElementById("playlist-area-ul").addEventListener("click" , checkClickedItem , false);
}

$(window).scroll(
	function (event) {
		var scrollPosition = $(window).scrollTop();
		if(scrollPosition >= (($(document).height() - $(window).height()) - 370)){
			if( search.effectHandler.getState() === "mostPopularVideoSearch" && search.effectHandler.getValve() === true && (!search.effectHandler.getAtLastPage())){
				search.effectHandler.closeValve();
				search.mostPopularVideoSearch.action();
			}
			if(search.effectHandler.getState() === "keyWordSearch" && search.effectHandler.getValve() === true && (!search.effectHandler.getAtLastPage())){
				search.effectHandler.closeValve();
				search.keyWordSearch.nextPage();
			}
		}
	}
);

let mode = (function(){
	let musicModePage = './music_mode.html';
	let videoModePage = './index.html';
	return {
		redirectTo : function(e){
			try{
				let id = e.target.id;
				if( id === "music-mode"){
					window.document.location.assign(musicModePage);
				}
				if( id === "video-mode"){
					window.document.location.assign(videoModePage);
				}
			}
			catch(e){
				console.log(e)
			}
		}
	}
})();

// let checkClickedItem = function(e){
// 	let target = e.target;
// 	let nodeName = target.tagName;
// 	let nodeId = target.id;
// 	while( nodeName !== "LI"){
// 		target = target.parentNode;
// 		nodeName = target.tagName;
// 		nodeId = target.id;
// 	}
// }

var search = (function(){
	var apiKey = "AIzaSyAJJtlbiUYneQZQKDkF5SXz2qgClOJCxo4";
	var state = "mostPopularVideoSearch";
	var valve = false;
	var atLastPage = false;
	var perPage = 30;
	var q = "";
	var type = "video";
	var totalResults = 0;
	var totalPages = 0;
	var nextPageToken = "";
	var initialUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet";
	var videoDetailUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet , ";
	var mostPopularVideoUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=TW&videoCategoryId=0";
	return {
		effectHandler : {
			loadingScene : {
				on : function(){
					var target = document.querySelectorAll(".cover-search-loader , .local-search-loader");
					for(var i = 0 ; i<target.length ; i++){
						target[i].style.display = "block";
					}
				},
				off : function(){
					var target = document.querySelectorAll(".cover-search-loader , .local-search-loader");
					for(var i = 0 ; i<target.length ; i++){
						target[i].style.display = "none";
					}
				}
			},
			searchResultClear : function(){
				document.getElementById("main-section").innerHTML = "";
			},
			initialHeaderCleaner : function(){
				var header = document.getElementsByTagName("header")[0];
				var initialContent =  document.getElementsByClassName("initial-content");
				var player = document.getElementById("player");

				for(var i=0 ; i<initialContent.length ; i++){
					initialContent[i].style.display = "none";
				}
				document.getElementsByTagName("nav")[0].style.backgroundColor = "#e62117";
				document.getElementsByTagName("footer")[0].style.backgroundColor = "#e62117";
				player.style.width = "0px";
				player.style.height = "0px";
				header.style.height = "60px";
				header.style.backgroundColor = "rgba(0,0,0,0.9)";
			},
			searchEnterClicked : function(e){
				if(e.key === "Enter"){
					search.effectHandler.searchIconClicked();
				}
			},
			searchIconClicked : function(){
				search.keyWordSearch.action();
			},
			searchResultInfo : function(){
				document.getElementById("search-word").textContent = q;
				document.getElementById("total-result").textContent = totalResults;
				document.getElementById("total-pages").textContent = totalPages;
				document.getElementById("search-result-info").style.visibility = "visible";
			},
			moveToTop : function(){
				window.scrollTo(0,0);
			},
			getValve : function(){
				return valve;
			},
			closeValve : function(){
				valve = false;
			},
			getState : function(){
				return state;
			},
			getAtLastPage : function(){
				return atLastPage;	
			},
			error : {
				errorFound : function(){
					search.effectHandler.loadingScene.off();
					var errorMsg = "<h3 class=\"error-found\">出現了未知的錯誤，可能是網路或系統相關問題，</br>建議檢查本地端網路、按重新整理後，再重新使用本服務。</h3>";
					document.getElementById("main-section").innerHTML = "";
					document.getElementById("main-section").insertAdjacentHTML("beforeend" , errorMsg);
				},
				fail : function(){
					search.effectHandler.loadingScene.off();
					var failMsg = "<h3 class=\"fail\">無法與遠端伺服器聯繫，可能是網路或系統相關問題，</br>建議檢查本地端網路、按重新整理後，再重新使用本服務。</h3>";
					document.getElementById("main-section").innerHTML = "";
					document.getElementById("main-section").insertAdjacentHTML("beforeend" , failMsg);
				}
			}
		},
		keyWordSearch : {
			action : function(){
				if(document.getElementById("search-input").value){
					youtubePlayer.videoClicked.nowPlaying.hiddenNowPlaying();
					search.effectHandler.loadingScene.on();
					state = "keyWordSearch";
					atLastPage = false;
					search.effectHandler.initialHeaderCleaner();
					search.effectHandler.searchResultClear();
					youtubePlayer.stopPlaying();
					q = document.getElementById("search-input").value;
					
					$.ajax({
						url:initialUrl+"&type="+type+"&maxResults="+perPage+"&q="+q+"&key="+apiKey,
						method:"GET",
						dataType:"json"
					})
					.then(
						function(data){
							if(data.items.length === 0){
								totalResults = data.pageInfo.totalResults || 0;
								totalPages = Math.ceil((parseInt(totalResults)/perPage)) || 0;
								search.effectHandler.searchResultInfo();
								search.effectHandler.loadingScene.off();
							}
							else if(data.items.length > 0){
								data.nextPageToken? nextPageToken = data.nextPageToken : nextPageToken = "";
								totalResults = data.pageInfo.totalResults;
								totalPages = Math.ceil((parseInt(totalResults)/perPage));
								search.effectHandler.searchResultInfo();
								search.keyWordSearch.afterSearch(data.items);
							}
							else{
								search.effectHandler.error.errorFound();
							}
						},
						function(){
							search.effectHandler.error.fail();
						}
					)
					.always(
						function(){}
					)
				}
			},
			afterSearch : function(objArray){
				var section = document.getElementById("main-section");
				var objArrayLenght = objArray.length;
				var count = 0;
				objArray.map(function(obj){
					var videoId = obj.id.videoId;
					var channelId = obj.snippet.channelId;
					var imgUrl = obj.snippet.thumbnails.medium.url;
					var duration = "";
					var videoTitle = search.videoTitleProcessor(obj.snippet.title);
					var publishAt = obj.snippet.publishedAt.substring(0 , 10);
					var channelTitle = obj.snippet.channelTitle;
					$.ajax({
						url:videoDetailUrl+"contentDetails,statistics&id="+videoId+"&key="+apiKey,
						method:"GET",
						dataType:"json"
					})
					.then(
						function(data){
							if(data.items.length === 1){
								duration = search.durationParser(data.items[0].contentDetails.duration);
								section.appendChild(search.elementPrepare( videoId , imgUrl , duration , videoTitle , publishAt , channelTitle ));
							}
						},
						function(){}
					)
					.always(
						function(){
							count++;
							if( objArrayLenght === count){
								valve = true;
							}
							search.effectHandler.loadingScene.off();
						}
					)
					
				})
			},
			nextPage : function(){
				search.effectHandler.loadingScene.on();
				$.ajax({
						url:initialUrl+"&type="+type+"&maxResults="+perPage+"&q="+q+"&key="+apiKey+"&pageToken="+nextPageToken,
						method:"GET",
						dataType:"json"
				})
				.then(
					function(data){
						if(data.nextPageToken && data.items.length > 0){
							nextPageToken = data.nextPageToken;
							atLastPage = false;
							search.keyWordSearch.afterSearch(data.items);
						}
						else if( (!data.nextPageToken) && data.items.length > 0){
							nextPageToken = "";
							atLastPage = true;
							search.keyWordSearch.afterSearch(data.items);
						}
						else if( (data.nextPageToken) && data.items.length === 0 ){
							nextPageToken = "";
							atLastPage = true;
							search.effectHandler.loadingScene.off();
						}
						else{
							search.effectHandler.error.errorFound();
						}
					},
					function(){
						search.effectHandler.error.fail();
					}
				)
				.always(
					function(){}
				)
			}
		},
		mostPopularVideoSearch : {
			action : function(){
				search.effectHandler.loadingScene.on()
				$.ajax({
					url:mostPopularVideoUrl+"&key="+apiKey+"&maxResults="+perPage+"&pageToken="+nextPageToken,
					method:"GET",
					dataType:"json",
				})
				.then(
					function(data){
						if(data.nextPageToken && data.items.length > 0){
							nextPageToken = data.nextPageToken;
							atLastPage = false;
							search.mostPopularVideoSearch.afterSearch(data.items);
						}
						else if( (!data.nextPageToken) && data.items.length > 0){
							nextPageToken = "";
							atLastPage = true;
							search.mostPopularVideoSearch.afterSearch(data.items);
						}
						else if( (data.nextPageToken) && data.items.length === 0 ){
							nextPageToken = "";
							atLastPage = true;
							search.effectHandler.loadingScene.off();
						}
						else{
							search.effectHandler.error.errorFound();
						}
					},
					function(){
						search.effectHandler.error.fail();
					}
				)
				.always(
					function(){}
				)
			},
			afterSearch : function(objArray){
				var section = document.getElementById("main-section");
				var objArrayLenght = objArray.length;
				var count = 0;
				objArray.map(function(obj){
					var videoId = obj.id;
					var channelId = obj.snippet.channelId;
					var imgUrl = obj.snippet.thumbnails.medium.url;
					var duration = "";
					var videoTitle = search.videoTitleProcessor(obj.snippet.title);
					var publishAt = obj.snippet.publishedAt.substring(0 , 10);
					var channelTitle = obj.snippet.channelTitle;
					$.ajax({
						url:videoDetailUrl+"contentDetails,statistics&id="+videoId+"&key="+apiKey,
						method:"GET",
						dataType:"json"
					})
					.then(
						function(data){
							if(data.items.length === 1){
								duration = search.durationParser(data.items[0].contentDetails.duration);
								section.appendChild(search.elementPrepare( videoId , imgUrl , duration , videoTitle , publishAt , channelTitle ));
							}
						},
						function(){}
					)
					.always(
						function(){
							count++;
							search.effectHandler.loadingScene.off();
							if( objArrayLenght === count){
								valve = true;
							}
						}
					)
				})
			}
		},
		elementPrepare : function( videoId ,
								   imgUrl ,
								   duration ,
								   videoTitle ,
								   publishAt ,
								   channelTitle )
		{
			var article = document.createElement("ARTICLE");
			var imgContainer = document.createElement("DIV");
			var infoContainer = document.createElement("DIV");
			var img = document.createElement("IMG");
			var spanDuration = document.createElement("SPAN");
			var spanVideoTitle = document.createElement("SPAN");
			var spanChannelTitle = document.createElement("SPAN");
			var spanPublishAt = document.createElement("SPAN");
			article.className = "card";
			article.id = videoId;
			article.dataset.videoTitle = videoTitle;
			imgContainer.className = "img-container";
			infoContainer.className = "info-container";
			spanDuration.className = "duration";
			spanVideoTitle.className = "video-title";
			spanChannelTitle.className = "channel-title";
			spanPublishAt.className = "publish-at";
			img.src = imgUrl;
			spanDuration.textContent = duration;
			spanVideoTitle.textContent = videoTitle;
			spanChannelTitle.textContent = channelTitle;
			spanPublishAt.textContent = publishAt;
			imgContainer.appendChild(img);
			imgContainer.appendChild(spanDuration);
			infoContainer.appendChild(spanVideoTitle);
			infoContainer.appendChild(spanChannelTitle);
			infoContainer.appendChild(spanPublishAt);
			article.appendChild(imgContainer);
			article.appendChild(infoContainer);
			return article;
		},
		durationParser : function(timeStr){
			var hour = /\d*H/.exec(timeStr);
			var min = /\d*M/.exec(timeStr);
			var sec = /\d*S/.exec(timeStr);

			return secondLayerParser(hour , min , sec);
			function secondLayerParser( h , m , s){
				var hour="" , min="" , sec="" ;

				/*解析小時*/
				if(h){
					hour = /\d*/.exec(h)[0]+":";
				}
				else{
					hour = "";
				}
				/*解析分鐘*/
				if(m){
					min = /\d*/.exec(m)[0];
					if(min.length === 1){
						min = "0"+min;
					}
				}
				else{
					min = "00";
				}
				/*解析秒*/
				if(s){
					sec = /\d*/.exec(s)[0];
					if(sec.length === 1){
						sec = "0"+sec;
					}
				}
				else{
					sec = "00";
				}
				/*回傳完成的影片時間格式*/
				return hour+min+":"+sec;
			}
		},
		videoTitleProcessor : function(videoTitle){
			if(videoTitle.length > 40){
				return videoTitle.substring( 0 , 40)+"...";
			}
			return videoTitle;
		}
	}
})();



var youtubePlayer = (function(){
	var player ;
	var nowPlaying = "";
	return {
		initial : function(){
			var tag = document.createElement('script');
			var firstScriptTag = document.getElementsByTagName('script')[0];
			tag.src = "https://www.youtube.com/iframe_api";
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		},
		videoClicked : {
			action : function(e){
				if(player){
					if(getArticle(e.target)){
						search.effectHandler.initialHeaderCleaner();
						youtubePlayer.changeVideo(getArticle(e.target));
						youtubePlayer.videoClicked.effect.afterClicked();
						youtubePlayer.videoClicked.nowPlaying.showNowPlaying();
					}
				}
				else{
					if(getArticle(e.target)){
						search.effectHandler.initialHeaderCleaner();
						youtubePlayer.createPlayer(getArticle(e.target));
						youtubePlayer.videoClicked.effect.afterClicked();
						youtubePlayer.videoClicked.nowPlaying.showNowPlaying();
					}
				}
				
				function getArticle(target){
					var tag = target;
					try{
						while( tag.tagName.toLowerCase() !== "article"){
							tag = tag.parentNode;
						}
						if(tag.id){
							nowPlaying = tag.dataset.videoTitle;
							return tag.id;	
						}
					}
					catch(e){

					}
				}
			},
			nowPlaying: {
				getVideoTitle : function(){
					document.getElementById("now-playing").innerHTML = "";
					document.getElementById("now-playing").innerHTML = nowPlaying;
				},
				showNowPlaying : function(){
					youtubePlayer.videoClicked.nowPlaying.getVideoTitle();
					document.getElementById("now-playing").style.display = "block";
				},
				hiddenNowPlaying : function(){
					document.getElementById("now-playing").innerHTML = "";
					document.getElementById("now-playing").style.display = "none";
				}
			},
			effect : {
				afterClicked : function(){
					document.getElementsByTagName("header")[0].style.height = "450px";
					document.getElementById("player").style.width = "690px";
					document.getElementById("player").style.height = "390px";
					search.effectHandler.moveToTop();
				}
			}
		},
		createPlayer : function(videoId){
			player = new YT.Player(
				'player', 
				{
					height: '390',
					width: '640',
					videoId: videoId,
					events: {
						'onReady':firstVideoPlay
					},
					playerVars: {rel: 0}
				}
			);
			function firstVideoPlay() {
				player.playVideo();
			}
		},
		changeVideo : function(videoId){
			player.loadVideoById(videoId);
		},
		stopPlaying : function(){
			if(player){
				player.stopVideo();	
			}
		}


	}
})();
