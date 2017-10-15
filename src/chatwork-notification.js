(function() {
    'use strict';
    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission === "granted") {
        chatworkNotify();
    }else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                chatworkNotify();
            }
        });
    }

    var __notification;
    var __timer;
    var __clickedNotification = false;
    var __isTargetAll;
    var __displayIntarvalMilliSec;
    var __checkIntarvalMilliSec = 1000;
    function chatworkNotify(){
        // 設定を取得
        chrome.storage.sync.get({
            isTargetAll: true,
            displayIntarval: 10,
        }, function(items) {
            __isTargetAll = items.isTargetAll;
            __displayIntarvalMilliSec = items.displayIntarval * 1000;
            chatworkNotifyInner();
        });
    }
    function chatworkNotifyInner(){
        // 設定の秒数ごとに未読チェック
        setTimeout(
            chatworkNotify,
            __checkIntarvalMilliSec
        );

        if(__clickedNotification){
            return;
        }
        var messageBody = [];
        

        // 未読有り
        if(__isTargetAll){
            var unreadElm = document.getElementById("_chatUnreadStatus");
            if( unreadElm.style.display === "block" || unreadElm.style.display === "" ){
                messageBody.push(unreadElm.innerHTML + "グループに未読メッセージがあります");
            }
        }
        
        // あなた宛の未読有り
        var unreadToElm = document.getElementById("_chatToUnreadStatus");
        if( unreadToElm.style.display === "block" || unreadToElm.style.display === "" ){
            messageBody.push(unreadToElm.innerHTML + "グループにあなた宛の未読メッセージがあります");
        }
        
        // 未読有り
        if( messageBody.length > 0 ){
            // 通知を出す
            var options = {
                tag:"chatworkNotifcation",
                body:messageBody.join("\n"),
                icon:document.getElementById("_myStatusIcon").querySelectorAll("img")[0].getAttribute("src"),
                timestamp:Math.floor(Date.now())
            };
            __notification = new Notification("ChatWork - 未読通知", options);
            
            // 通知クリック
            __notification.addEventListener("click",
                function(){
                    // チャットワークタブにフォーカス
                    focus();
                }
            );
            // 通知クローズ
            __notification.addEventListener("close",
                function(){
                    // 設定の秒数通知を控える
                    __clickedNotification = true;
                    clearInterval(__timer);
                    __timer = setTimeout(
                        function(){__clickedNotification = false;},
                        __displayIntarvalMilliSec
                    );
                }
            );
        }
        // 未読無し
        else{
            // 通知を消す
            if(!!__notification){
                __notification.close();
            }
        }
    }
})();
