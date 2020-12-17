
window.onload = function(){
	keywordSearchActivate.forInitialSearch();
	initializePlaylist();
	document.getElementById("search-span").addEventListener("click" , keywordSearchActivate.searchClicked  , false);
	document.getElementById("search-input").addEventListener("keyup" , keywordSearchActivate.searchClicked , false);
	document.getElementById("mode-btn").addEventListener("click" , mode.redirectTo , false);
	document.getElementById("back-top").addEventListener("click" , function(){ 
		window.scrollTo(0,0);
	} , false );
	document.getElementById('main-section').addEventListener('click' , itemClicked , false);
	document.getElementById('music-mode-display').addEventListener('click' , wholePlayer , false);
}

let resInfo = {
	searchKeyword : null,	
	nextPageToken : null,
	totalResults : 0,
	totalPages : 0,
	searchInfoDisplayValve : false,
	nextPageSearchValve : false
};


let item = {
	videoId : null,
	channelTitle : null,
	title : null,
	publishedAt : null,
	thumbnails : null,
	duration : null,
};


let spinAnimation = (function(){
	let spin = document.querySelector('.local-search-loader');

	return {
		loadingEffect : {
			on : function(){
				spin.style.display = 'block';
			},
			off : function(){
				spin.style.display = 'none';
			}
		}
	}
})();

function initializePlaylist(){
	let storage = window.localStorage;
	let playlist = window.localStorage.getItem('playlist');

	if( storageAvailable('localStorage') ){
		if(!window.localStorage.getItem('playlist')){
			let playlist = [];
			window.localStorage.setItem('playlist' , JSON.stringify(playlist));
			return;
		}
		else{
			addIntoPlaylistFromLocalStorage();
		}
	}
	else{
		window.alert('你的瀏覽器不支援 localStoage 功能，將轉回 Video Mode ，建議更新瀏覽器再使用本功能。');
		window.document.location.assign('./index.html');
		return;
	}

	function storageAvailable(type) {
	    try {
	        var storage = window[type],
	            x = '__storage_test__';
	        storage.setItem(x, x);
	        storage.removeItem(x);
	        return true;
	    }
	    catch(e) {
	        return e instanceof DOMException && (
	            // everything except Firefox
	            e.code === 22 ||
	            // Firefox
	            e.code === 1014 ||
	            // test name field too, because code might not be present
	            // everything except Firefox
	            e.name === 'QuotaExceededError' ||
	            // Firefox
	            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
	            // acknowledge QuotaExceededError only if there's something already stored
	            storage.length !== 0;
	    }
	}
}

$(window).scroll(
	function (event) {
		var scrollPosition = $(window).scrollTop();
		if(scrollPosition >= (($(document).height() - $(window).height()) - 370)){
			if(resInfo.nextPageSearchValve && resInfo.nextPageToken){
				spinAnimation.loadingEffect.on();
				keywordSearchActivate.nextPageSearch();			
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
				// console.log(e)
			}
		}
	}
})();




var player;
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


/*當加入 item 或移除 item 的時候，都會改變 playerSomethingChanged 變數為 true*/
let playerSomethingChanged = false;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		playerVars : {
			fs: 0,
			rel: 0,
			origin: 1,
			iv_load_policy: 3,
			modestbranding: 1,
		},
		events : {
			onStateChange : playerOnStateChange,
		},
	});
}






function wholePlayer(e){
	let target = e.target;
	
	/*remove item from playlist*/
	if(target.className === 'playlist-item-option-content-delete'){
		playerSomethingChanged = true;
		removeFromLocalStorage(target);
		return;
	}

	/*點選 playlist 的曲目，並且播放*/
	if(target.parentNode.tagName === 'LI'){
		playerSomethingChanged = false;
		let playlist = JSON.parse(window.localStorage.getItem('playlist'));
		let clickedVideoId = target.parentNode.id;
		let len = playlist.length;
		let index = 0;
		let videoIdArray = [];
		for(let i=0 ; i<len ; i++){
			videoIdArray.push(playlist[i].id);
			if(clickedVideoId === playlist[i].id){
				index = i;
			}
		}
		player.loadPlaylist(videoIdArray , index , 0 , 'medium');
		player.setLoop(true);
		return;
	}
}

/*
<p id="now-playing-sign"></p>
<p id="now-playing-track-title"></p>
<p id="now-playing-track-total"></p>

-1 – unstarted
0 – ended
1 – playing
2 – paused
3 – buffering
5 – video cued
*/


function playerOnStateChange(event){
	let state = event.data;

	if(state === -1){
		playingVideoInfo(state);
	}
	
	if(state === 0 && playerSomethingChanged){
		playerSomethingChanged = false;
		player.stopVideo();
		let playlist = JSON.parse(window.localStorage.getItem('playlist'));
		let len = playlist.length;
		let videoIdArray = [];
		for(let i=0 ; i<len ; i++){
			videoIdArray.push(playlist[i].id);
		}
		player.cuePlaylist(videoIdArray , 0 , 0 , 'medium');
		return
	}

	if(state === 1){
		playingVideoInfo(state);
		return
	}


	if(state === 5){
		let playlist = JSON.parse(window.localStorage.getItem('playlist'));
		let len = playlist.length;
		if(len === 0){
			player.loadVideoById(null);
			return;
		}
		player.playVideo();
		player.setLoop(true);
		return;
	}
}


function playingVideoInfo(state){
	let videoData = player.getVideoData();
	let itemTitle = videoData.title;
	let itemAuthor = videoData.author;
	let nowPlayingVideoTitle = document.getElementById('now-playing-track-title');
	let nowPlayingVideoAuthor = document.getElementById('now-playing-track-author');
	while(nowPlayingVideoTitle.firstChild){
		nowPlayingVideoTitle.removeChild(nowPlayingVideoTitle.firstChild);
	}
	while(nowPlayingVideoAuthor.firstChild){
		nowPlayingVideoAuthor.removeChild(nowPlayingVideoAuthor.firstChild);
	}
	if(state === -1){
		nowPlayingVideoTitle.style.visibility = 'hidden';
		nowPlayingVideoAuthor.style.visibility = 'hidden';
		return;
	}
	nowPlayingVideoTitle.appendChild(document.createTextNode(itemTitle));
	nowPlayingVideoAuthor.appendChild(document.createTextNode(itemAuthor));
	
	if(state === 1){
		nowPlayingVideoTitle.style.visibility = 'visible';
		nowPlayingVideoAuthor.style.visibility = 'visible';
		return;
	}
}




// function loadingAnimation(){
// 	let spinning = document.querySelector('.local-search-loader');
// 	spinning.style.display = 'none';
// console.log(spinning);
// }

// loadingAnimation();


let keywordSearchActivate = (function(){
	let reqParam = {
		apiKey : e6bebbe30a44dd4164892b14aa7b498cde3(),
		searchResource : 'https://www.googleapis.com/youtube/v3/search?',
		searchPart : 'snippet',
		videoEmbeddable : 'true',
		videoResource: 'https://www.googleapis.com/youtube/v3/videos?',
		videoPart : 'snippet,contentDetails,statistics',
		maxResults : 30,
		q : null,
		searchType : 'video',
		requestMethod : 'GET',
		requestUrl : null,
		searchKeywordArray : ['pop music' , 'rock music' , 'jazz music' , 'post rock music'],
	};
	return {
		forInitialSearch : function(){
			// console.log('in initialSearch')
			let keyword = reqParam.searchKeywordArray[(Math.floor(Math.random() * reqParam.searchKeywordArray.length))]
			reqParam.q = keyword;
			reqParam.requestUrl = reqParam.searchResource+ 'part=' +reqParam.searchPart+ '&videoEmbeddable=' + reqParam.videoEmbeddable + '&maxResults=' +reqParam.maxResults+ '&q=' +reqParam.q+ '&type=' +reqParam.searchType+ '&key=' +reqParam.apiKey;
			resInfo.searchKeyword = reqParam.q;
			resInfo.searchInfoDisplayValve = true;
			ajax_1_StageProcess(reqParam);
		},
		searchClicked : function(e){
			if(e.key === 'Enter'){
				// console.log('in searchClicked ')
				reqParam.q = document.getElementById('search-input').value;
				reqParam.requestUrl = reqParam.searchResource+ 'part=' +reqParam.searchPart+ '&videoEmbeddable=' + reqParam.videoEmbeddable +'&maxResults=' +reqParam.maxResults+ '&q=' +reqParam.q+ '&type=' +reqParam.searchType+ '&key=' +reqParam.apiKey;
				ajax_1_StageProcess(reqParam);
				resInfo.searchKeyword = reqParam.q;
				resInfo.searchInfoDisplayValve = true;
				mainSectionClear();
				return;
			}
			if(e.type === 'click'){
				// console.log('in searchClicked ')
				reqParam.q = document.getElementById('search-input').value;
				reqParam.requestUrl = reqParam.searchResource+ 'part=' +reqParam.searchPart+ '&videoEmbeddable=' + reqParam.videoEmbeddable +'&maxResults=' +reqParam.maxResults+ '&q=' +reqParam.q+ '&type=' +reqParam.searchType+ '&key=' +reqParam.apiKey;
				ajax_1_StageProcess(reqParam);
				resInfo.searchKeyword = reqParam.q;
				resInfo.searchInfoDisplayValve = true;
				mainSectionClear();
				return;
			}
		},
		nextPageSearch : function(){
			if(resInfo.nextPageSearchValve){
				resInfo.nextPageSearchValve = false;
				// console.log('in nextPageSearch ')
				reqParam.q = document.getElementById('search-input').value;
				reqParam.requestUrl = reqParam.searchResource+ 'part=' +reqParam.searchPart+ '&videoEmbeddable=' + reqParam.videoEmbeddable +'&maxResults=' +reqParam.maxResults+ '&q=' +reqParam.q+ '&type=' +reqParam.searchType+ '&key=' +reqParam.apiKey+ '&pageToken=' + resInfo.nextPageToken;
				ajax_1_StageProcess(reqParam);
				return;
			}
		}

	}
})();


/*
let resInfo = {
	searchKeyword : null,	
	nextPageToken : null,
	totalResults : 0,
	totalPages : 0,
	valve : false
};
<span id="search-result-info">符合 <span id="search-word"></span> 的結果，約有 <span id="total-result"></span> 項，總共 <span id="total-pages"></span> 頁</span>
*/
function searchInfoDisplay(){
	let searchWord = document.getElementById('search-word');
	let totalResults = document.getElementById('total-result');
	let totalPages = document.getElementById('total-pages');
	let searchResultInfo = document.getElementById('search-result-info');
	if(searchWord.firstChild){
		searchWord.removeChild(searchWord.firstChild);	
	}
	if(totalResults.firstChild){
		totalResults.removeChild(totalResults.firstChild);	
	}
	if(totalPages.firstChild){
		totalPages.removeChild(totalPages.firstChild);	
	}
	searchWord.appendChild(document.createTextNode(resInfo.searchKeyword));
	totalResults.appendChild(document.createTextNode(resInfo.totalResults));
	totalPages.appendChild(document.createTextNode(resInfo.totalPages));

	searchResultInfo.style.visibility = 'visible';
}



function ajax_1_StageProcess(param){
	let data = null;
	spinAnimation.loadingEffect.on();
	$.ajax({
		url : param.requestUrl,
		method : param.requestMethod,
		dataType : 'json'
	})
	.done(function(resData){
		data = resData;
		// console.log(data);
		ajax_2_StageProcess(resData , param);
	})
	.fail(function(){
		resInfo.nextPageSearchValve = false;
		// console.log("ajax_1_ failed");
	})
	.always(function(){
		spinAnimation.loadingEffect.off();
		// console.log('resInfo.nextPageSearchValve' , resInfo.nextPageSearchValve)
		resInfo.nextPageToken = data.nextPageToken;
		// console.log('--------------'+resInfo.nextPageToken+'------------');
		resInfo.totalResults = data.pageInfo.totalResults;
		// console.log('--------------'+resInfo.totalResults+'------------');
		resInfo.totalPages = Math.floor(data.pageInfo.totalResults / data.pageInfo.resultsPerPage);
		// console.log('--------------'+resInfo.totalPages+'------------');
		resInfo.nextPageSearchValve = true;
		// console.log('resInfo.nextPageSearchValve' , resInfo.nextPageSearchValve)
		if(resInfo.searchInfoDisplayValve){
			searchInfoDisplay();
			resInfo.searchInfoDisplayValve = false;
		}
	})
}


function ajax_2_StageProcess(resData , param){
	let len = resData.items.length;
	let url = param.videoResource + 'part=' +param.videoPart+ '&key=' +param.apiKey+ '&id=';
	for(let i=0 ; i<len ; i++){
		$.ajax({
			url : (url + resData.items[i].id.videoId) ,
			method : param.requestMethod,
			dataType : 'json'
		})
		.done(function(resData){
			item.videoId = resData.items[0].id;
			item.channelTitle = resData.items[0].snippet.channelTitle;
			item.title = resData.items[0].snippet.title;
			item.publishedAt = (resData.items[0].snippet.publishedAt).substring(0,10);
			item.thumbnails = resData.items[0].snippet.thumbnails.medium.url;
			item.duration = durationParser(resData.items[0].contentDetails.duration);
		})
		.fail(function(){
			// console.log("ajax_2_ failed");
		})
		.always(function(){
			encapAndInsertIntoMain.action(item);
		})
	}
}

function mainSectionClear(){
	let mainSection = document.getElementById('main-section');
	while(mainSection.firstChild){
		mainSection.removeChild(mainSection.firstChild);
	}
}

let encapAndInsertIntoMain = (function(){
	let bookmarkNum = 0;
	return {
		action:function(item){
			let article = document.createElement("ARTICLE");
			article.className = "card";
			article.id = item.videoId;
			article.dataset.videoTitle = item.title;

			let imgContainer = document.createElement("DIV");
			imgContainer.className = "img-container";

			let infoContainer = document.createElement("DIV");
			infoContainer.className = "info-container";

			let img = document.createElement("IMG");
			img.src = item.thumbnails;

			let spanDuration = document.createElement("SPAN");
			spanDuration.className = "duration";
			spanDuration.textContent = item.duration;

			let spanVideoTitle = document.createElement("SPAN");
			spanVideoTitle.className = "video-title";
			spanVideoTitle.textContent = item.title;

			let spanChannelTitle = document.createElement("SPAN");
			spanChannelTitle.className = "channel-title";
			spanChannelTitle.textContent = item.channelTitle;
			
			let spanPublishAt = document.createElement("SPAN");
			spanPublishAt.className = "publish-at";
			spanPublishAt.textContent = item.publishedAt;

			let spanBookmark = document.createElement("SPAN");
			//spanBookmark.className = 'item-bookmark';
			spanBookmark.dataset.bookmarkNum = bookmarkNum++;
			
			imgContainer.appendChild(img);
			imgContainer.appendChild(spanDuration);
			imgContainer.appendChild(spanBookmark);

			infoContainer.appendChild(spanVideoTitle);
			infoContainer.appendChild(spanChannelTitle);
			infoContainer.appendChild(spanPublishAt);
			
			article.appendChild(imgContainer);
			article.appendChild(infoContainer);
			
			document.getElementById('main-section').appendChild(article);
		}
	}
})();




function durationParser(timeStr){
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
}


function itemClicked(e){
	let limit = 10;
	let target = e.target;
	let item = {
		id:'',
		title:'',
		img:'',
		duration:'',
		spanBookmark:'',
	};
	try{
		/*清單內曲目數量限制，超過 limit 就直接限制寫入 localStorage*/
		
		let itemsCount = JSON.parse(window.localStorage.getItem('playlist')).length;
		if(itemsCount >= limit){
			alert("播放清單數量已達清單上限，請刪除清單內曲目，再新增曲目。");
			window.scrollTo(0,0);
			return;
		}

		/*取得點選曲目的 article node*/
		while( target.tagName !== 'ARTICLE'){
			target = target.parentNode;
		}

		/*取得點選的曲目 article tag 中的相關資訊*/
		if(target.id && target.tagName === 'ARTICLE'){
			item.id = target.id;
			item.title = target.dataset.videoTitle;

			let imgContainerEles = document.querySelectorAll("#"+CSS.escape(item.id)+" .img-container")[0].children;
			
			for(let i=0 ; i<imgContainerEles.length ; i++){
				let ele = imgContainerEles[i];
				if(ele.tagName === 'IMG'){
					item.img = ele.src;
					continue;
				}
				if(ele.tagName === 'SPAN' && ele.className === 'duration'){
					item.duration = ele.textContent;
					continue;
				}
				if(ele.className === '' || ele.className === 'item-bookmark'){
					item.spanBookmark = ele;
					continue;
				}
			}
			/*把點選的 item 加入 localStorage playlist*/
			addIntoLocalStorage(item)
		}	
	 }
	 catch(e){}
}



function addIntoLocalStorage(item){
	/*如果 localStorage 不存在 playlist , 即初始化一個 playlist*/
	if(!window.localStorage.getItem('playlist')){
		let playlist = [];
		playlist.push({
			id:item.id,
			title:item.title,
			img:item.img,
			duration:item.duration,
		});
		/*將 playlist 字串化加回 localStorage*/
		window.localStorage.setItem('playlist' , JSON.stringify(playlist));

		/*把 playlist 從 localStorage 取出 , 加到畫面中的 playlist area*/
		addIntoPlaylistFromLocalStorage();
		return;
	}

	/*如果 localStorage 已存在 playlist , 則取出現有的 playlist */
	let playlist = JSON.parse(window.localStorage.getItem('playlist'));


	/*檢查要加入的新曲目與 playlist 的已有曲目是否重複*/
	if(!checkDupInLocalStorage()){
		playlist.push({
			id:item.id,
			title:item.title,
			img:item.img,
			duration:item.duration,
		});
		playerSomethingChanged = true;
		/*將 playlist 字串化加回 localStorage*/
		window.localStorage.setItem('playlist' , JSON.stringify(playlist));
		/*把 playlist 從 localStorage 取出 , 加到畫面中的 playlist area*/
		addIntoPlaylistFromLocalStorage();
	}
	

	function checkDupInLocalStorage(){
		for(let i=0 ; i<playlist.length ; i++){
			if(playlist[i].id === item.id){
				return true;
			}
		}
		return false;
	}
}



function removeFromLocalStorage(target){

	try{
		while(target.tagName !== 'LI'){
			target = target.parentNode;
		}
		if(target.id && target.tagName === 'LI'){
			let playlistItems = JSON.parse(window.localStorage.getItem('playlist'));
			let len = playlistItems.length;
			for(let i=0 ; i<len ; i++){
				if(playlistItems[i].id === target.id){
					playlistItems.splice(i , 1);
					break;
				}
			}
			window.localStorage.setItem('playlist' , JSON.stringify(playlistItems));
		}
		addIntoPlaylistFromLocalStorage();
	}
	catch(e){}
}


function addIntoPlaylistFromLocalStorage(){
	let playlistAreaUl = document.getElementById('playlist-area-ul');
	while( playlistAreaUl.firstChild ){
		playlistAreaUl.removeChild(playlistAreaUl.firstChild);
	}

	let items = JSON.parse(window.localStorage.getItem('playlist'));
	let len = items.length;
	
	if( len === 0){
		let div = document.createElement('DIV');
		div.id = 'empty-placeholder';

		let h2Slogan = document.createElement('H2');
		h2Slogan.id = 'h2-title-in-playlist-slogan';
		h2Slogan.appendChild(document.createTextNode('播放清單空空 der~'));
		h2Slogan.appendChild(document.createElement('br'));
		h2Slogan.appendChild(document.createTextNode('趕快加入你的歌曲'));
		div.appendChild(h2Slogan);
		playlistAreaUl.appendChild(div);
		return;
	}


	for(let i=0 ; i<len ; i++){
		encapAndInsertIntoPlaylist(items[i])
	}

	function encapAndInsertIntoPlaylist(item){
		let li = document.createElement('LI');
		li.id = item.id;

		let divOverlay = document.createElement('DIV');
		divOverlay.className = 'playlist-item-overlay';
		
		let divImageSet = document.createElement('DIV');
		divImageSet.className = 'playlist-item-image-set';
		
		let imgThumbnail = document.createElement('IMG');
		imgThumbnail.className = 'playlist-item-image';
		imgThumbnail.src = item.img;
		
		let spanDuration = document.createElement('SPAN');
		spanDuration.className = 'playlist-item-duration';
		spanDuration.textContent = item.duration;
		
		divImageSet.appendChild(imgThumbnail);
		divImageSet.appendChild(spanDuration);
		
		let divItemInfo = document.createElement('DIV');
		divItemInfo.className = 'playlist-item-info';
		
		let pTitle = document.createElement('P');
		pTitle.className = 'playlist-item-title';
		pTitle.textContent = item.title.trim();
		
		divItemInfo.appendChild(pTitle);
		
		let divOptionSet = document.createElement('DIV');
		divOptionSet.className = 'playlist-item-option-set';
		
		let spanDelete = document.createElement('SPAN');
		spanDelete.className = 'playlist-item-option-content-delete';
		
		let spanRepeat = document.createElement('SPAN');
		spanRepeat.className = 'playlist-item-option-content-repeat';
		
		divOptionSet.appendChild(spanDelete);
		divOptionSet.appendChild(spanRepeat);

		li.appendChild(divOverlay);	
		li.appendChild(divImageSet);
		li.appendChild(divItemInfo);
		li.appendChild(divOptionSet);

		let ul = document.getElementById('playlist-area-ul');
		ul.appendChild(li);
	}

}



