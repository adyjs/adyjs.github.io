
window.onload = function(){
  document.getElementById("language").addEventListener("change" , changLan , false);
}

i18next.init({
  lng: 'tw',
  debug: false,
  resources: {
    tw: {
      translation: {
        "em" : {
          "0":"友善" , 
          "1":"努力" , 
          "2":"專注"
        },
        "introduction" : "我是國泓，歡迎來到我的個人網頁。我自學程式開發，從 2017 年開始學寫程式，學習內容包含 Web 網頁開發，主要在前端領域較拿手，熟悉前端原生語法或 React 框架，另外也有學習些許的 C、Linux、GNU/Linux 相關工具，我看到貴公司有相關的工作職務正在徵人，職務內容我也很有興趣，所以我投了履歷。希望能有面試及進一步了解公司的機會，謝謝。",
        "sub-title" : {
          "0" : "程式語言及相關技術",
          "1" : "相關工具、平台使用經驗",
          "2" : "前端網頁作品集",
          "3" : "Linux & C 相關練習",
        },
        "topic-title" : {
          "web" : "網頁",
          "system" : "C & Linux",
        },
        "ps" : {
          "triangle-notation" : "&#9650; : 代表曾經學習過的語言技能，並使用其語言來做過作品的某一個部分，但沒有進一步深入學習其語言特性",
        },
        "item" : {
          "0" : "臺灣口罩資訊查詢列表",
          "1" : "Icon Hub",
          "2" : "縮短網址服務應用",
          "3" : "台灣高鐵公開資訊",
          "4" : "YouTube-Too",
          "5" : "Flickr-Too",
          "6" : "排序演算法視覺化",
          // "5" : "YouTube-Too React 版",
          "7" : "Qt 雜湊-驗證碼產生器",
          "8" : "Raspberry-Pi Router 樹莓派路由器",
          "9" : "Linux & C 開發練習",
          "10" : "LeetCode 程式演算法練習",
        },
      }
    },

    en: {
      translation: {
        "em" : {
          "0":"friendly" , 
          "1":"diligent" , 
          "2":"focus"
        },
        "introduction" : "I am Adyjs , welcome to my website. I am a self-taught developer, I started learn programming since 2017 and started to learn about web development, specific in front-end field, I know how to programming in native front-end languages and React libs. also including  C、Linux、GNU/Linux and other related tools, I found some jobs position of your company are available now and I am also interesting on it and apply for it as well. Hope I could have an opportunity to be a interviewee of your company and can both know each other well, thank you.",
        "sub-title" : {
          "0" : "Programming Skills",
          "1" : "Tools, Platform Experiences",
          "2" : "Web Front-End Portfolio",
          "3" : "Linux & C",
        },
        "topic-title" : {
          "web" : "Web",
          "system" : "C & Linux",
        },
        "ps" : {
          "triangle-notation" : "&#9650; : means I have learn that skills and that skills have been used for develop the parts of my portfolio</br> , but I did not research further details about that after that time point.",
        },
        "item" : {
          "0" : "Mask Info TW",
          "1" : "Icon Hub",
          "2" : "Share Shorten URLs Easier",
          "3" : "THSR Public Info",
          "4" : "YouTube-Too",
          "5" : "Flickr-Too",
          "6" : "Sorting Algorithm Visualization",
          // "5" : "YouTube-Too React Version",
          "7" : "Checksum Machine on Qt",
          "8" : "Raspberry-Pi Router",
          "9" : "Linux & C Development Practice",
          "10" : "LeetCode Algorithm & Programming Practice",
        },
      }
    }
  }
}, function(err, t) {
  updateContent();
});

function updateContent(){
  try{
    var em = document.querySelectorAll("header p")[0].children;
    for(var i=0 ; i < em.length ; i++){
      var target = "em."+i;
      em[i].innerHTML = i18next.t(target);
    }

    document.getElementById("introduction").innerHTML = i18next.t("introduction");

    var subTitle = document.querySelectorAll(".sub-title");
    for(var i=0 ; i<subTitle.length ; i++){
      var target = "sub-title."+i;
      subTitle[i].innerHTML = i18next.t(target);
    }

    var itemTitle = document.querySelectorAll(".works .item-title");
    for(var i=0 ; i<itemTitle.length ; i++){
      var target = "item."+i;
      itemTitle[i].innerHTML = i18next.t(target);
    }

    var currentLanguage = i18next.language.toString();

    var topicTitleWeb = i18next.store.data[currentLanguage].translation["topic-title"].web;
    var target = document.querySelectorAll(".topic-title.web");
    for(var i=0 ; i<target.length ; i++){
      target[i].innerHTML = topicTitleWeb;
    }
    
    var topicTitleSystem = i18next.store.data[currentLanguage].translation["topic-title"].system;
    var target = document.querySelectorAll(".topic-title.system");
    for(var i=0 ; i<target.length ; i++){
      target[i].innerHTML = topicTitleSystem;
    }

    var ps = i18next.store.data[currentLanguage].translation["ps"]["triangle-notation"];
    document.getElementById("ps").innerHTML = ps;
    

  }
  catch(e){
  }
  
}

function changLan(e){
  var lan = e.target.value;
  i18next.changeLanguage(lan);
  updateContent();
}



