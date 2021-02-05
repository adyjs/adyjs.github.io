
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
        "introduction" : "是 Adyjs，歡迎來到我的個人網頁。我自學軟體開發，從 2017 年開始學寫程式，寫過網頁前、後端，桌面應用程式，用過相關工具，具自學能力。近期，我看到貴公司有相關的工作職務正在徵人，職務內容我也很有興趣，所以我投了履歷。希望能有面試及進一步了解公司的機會，謝謝。",
        "first-letter" : "我",
        
        "sub-title" : {
          "0" : "技術能力",
          "1" : "作品集",
        },
        "topic-title" : {
          "languages" : "程式語言經驗",
          "f2e": "前端框架經驗",
          "b2e": "後端、資料庫經驗",
          // "b2e-tools": "後端、資料庫工具經驗",
          "libs-tools": "程式庫、開發工具經驗",
          "APIs-experience" : "APIs 串接經驗",
          "system" : "系統、平台經驗",
          "concept": "技術觀念",
          "web-based": "網頁作品",
          "other": "桌面、網路應用、LeetCode",
        },
        "ps" : {
          "triangle-notation" : "&#9650; : 代表曾經學習過的語言技能，並使用其語言來做過作品的某一個部分，但沒有進一步深入學習其語言特性",
        },
        "APIs" : {
          "0" : "G0V 健保口罩明細清單 API",
          "1" : "YouTube 資料 API",
          "2" : "Flickr API",
          "3" : "IconFinder API",
          "4" : "交通部大眾運輸 API",
        },
        "portfolio" : {
          "0" : "臺灣口罩資訊查詢列表",
          "1" : "Icon Hub",
          "2" : "ShareURLs 服務應用",
          "3" : "台灣高鐵公開資訊",
          "4" : "YouTube-Too",
          "5" : "Flickr-Too",
          "6" : "排序演算法視覺化",
          // "5" : "YouTube-Too React 版",
          "7" : "雜湊驗證程式 Qt 版",
          "8" : "樹莓派路由器",
          // "9" : "Linux & C 開發練習",
          "9" : "LeetCode",
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
        "introduction" : " am Adyjs , welcome to my home website. I am a self-taught developer , I started learn programming about 2017 , I had done some personal portfolio in front-end , back-end , desktop , also had some experience in other libraries and tools , I found some jobs position of your company are available now and I am also interesting on it and apply for it as well. Hope I could have an opportunity to be a interviewee of your company and can both know each other well, thank you.",
        "first-letter" : "I",
        "sub-title" : {
          "0" : "Programming Skills",
          "1" : "Portfolio",
        },
        "topic-title" : {
          "languages" : "Languages",
          "f2e": " Front-End Frameworks",
          "b2e": "Back-End / Database",
          // "b2e-tools": "Back-End , DataBase Tools",
          "libs-tools": "Libs / Tools",
          "APIs-experience" : "APIs Experience",
          "system" : "System / Platform",
          "concept": "Technique Concept",
          "web-based": "Web Based",
          "other": "Desktop / Networks / LeetCode",
        },
        "ps" : {
          "triangle-notation" : "&#9650; : means I have learn that skills and that skills have been used for develop the parts of my portfolio</br> , but I did not research further details about that after that time point.",
        },
        "APIs" : {
          "0" : "G0V Mask Info API",
          "1" : "YouTube Data API",
          "2" : "Flickr API",
          "3" : "IconFinder API",
          "4" : "MOTC Transport API",
        },
        "portfolio" : {
          "0" : "Mask Info TW",
          "1" : "Icon Hub",
          "2" : "ShareURLs",
          "3" : "THSR Public Info",
          "4" : "YouTube-Too",
          "5" : "Flickr-Too",
          "6" : "Sorting Algorithm Visualization",
          // "5" : "YouTube-Too React Version",
          "7" : "Checksum Machine on Qt",
          "8" : "Raspberry-Pi Router",
          // "9" : "Linux & C Development Practice",
          "9" : "LeetCode",
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
      em[i].textContent = i18next.t(target);
    }
    
    let introTag = document.getElementById("introduction");
    
    while(introTag.firstChild){
      introTag.removeChild(introTag.firstChild);
    }
    
    
    let firstLetterTag = document.createElement("span");
    firstLetterTag.classList.add('introduction-first-letter')

    let firstLetterContent = document.createTextNode(i18next.t("first-letter"));
    firstLetterTag.appendChild(firstLetterContent);

    let mainIntroContent = document.createTextNode(i18next.t("introduction"));
    
    introTag.appendChild(firstLetterTag);
    introTag.appendChild(mainIntroContent);

    var subTitle = document.querySelectorAll(".sub-title");
    for(var i=0 ; i<subTitle.length ; i++){
      var target = "sub-title."+i;
      subTitle[i].textContent = i18next.t(target);
    }

    // var itemTitle = document.querySelectorAll(".works .item-title");
    // for(var i=0 ; i<itemTitle.length ; i++){
    //   var target = "item."+i;
    //   itemTitle[i].textContent = i18next.t(target)
    // }

    var currentLanguage = i18next.language.toString();

    
    var topicTitle = i18next.store.data[currentLanguage].translation["topic-title"];
    const keys = Object.keys(topicTitle);
    const len = keys.length;
    var target = document.querySelectorAll(".topic-title");
    for(let i=0 ; i<len ; i++){
      for(let j=0 ; j<len ; j++){
        if(target[j].classList.contains(keys[i])){
          target[j].textContent = topicTitle[keys[i]];
          break;
        }
      }
    }


    /* API items translation */
    const apiItemsContent = i18next.store.data[currentLanguage].translation["APIs"];
    const apiItems = document.querySelectorAll(".api-item");
    const apiItemLen = apiItems.length;
    for(let i=0 ; i<apiItemLen ; i++){
      apiItems[i].textContent = apiItemsContent[i];
    }

    /* Portfolio items translation */
    const portfolioItemsContent = i18next.store.data[currentLanguage].translation["portfolio"];
    const portfolio = document.querySelectorAll('.portfolio-name');
    const portfolioLen = portfolio.length;
    for(let i=0 ; i<portfolioLen ; i++){
      portfolio[i].textContent = portfolioItemsContent[i];
    }
    // for(var i=0 ; i<apiItems.length ; i++){
    //   var target = "sub-title."+i;
    //   subTitle[i].textContent = i18next.t(target);
    // }
    // const len = target.length;
    // for(let i=0 ; i<len ; i++){
    //   if(target.classList.contains())
    // }
    // target.textContent = topicTitle[]
    // for(var i=0 ; i<target.length ; i++){
    //   target[i].innerHTML = topicTitle;
    // }
    
    // var topicTitleSystem = i18next.store.data[currentLanguage].translation["topic-title"];
    // var target = document.querySelectorAll(".topic-title");
    // for(var i=0 ; i<target.length ; i++){
    //   target[i].innerHTML = topicTitleSystem;
    // }

    // var ps = i18next.store.data[currentLanguage].translation["ps"]["triangle-notation"];
    // document.getElementById("ps").innerHTML = ps;
    // console.log(ps);
    

  }
  catch(e){
    console.log(e)
  }
  
}

function changLan(e){
  var lan = e.target.value;
  i18next.changeLanguage(lan);
  updateContent();
}



