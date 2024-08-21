(function () {

    window.pj_isBot = {
        cookieRead: 		cookieRead
      , cookieCreate: 		cookieCreate
      , identifyBot: 		identifyBot
      }

    function cookieRead(name) {
        try {
            if (typeof name === "undefined" ) {
                return undefined;
            }
            var nameEQ = name + "=";
            // get array of all cookies
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            // search array for cookie name
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return undefined;
        } catch(err) {
            window.console.error(err);
            return undefined;
        }
    }

    function cookieCreate(name, value, domain) {
        try {
            if (typeof name === "undefined" || typeof value === "undefined") {
                return
            }
            domain = domain || ""; // defaul value of empty string
            if (domain !== "") {
                domain = '; domain=' + domain + ';';
            }
            // write cookie
            // without expires attribute it will be a session-scoped cookie
            document.cookie = name + "=" + value + "; path=/" + domain;
        } catch(err) {
            window.console.error(err);
        }
    }

    function identifyBot() {
        try {
            var cookieValue = pj_isBot.cookieRead('pj_bot');
            if(typeof cookieValue === "undefined") {
                var ua = navigator.userAgent;
                var fullPattern = new RegExp("bot|spider|crawl|http|lighthouse| daum[ /]| deusu/| yadirectfetcher|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|@[a-z][\\w-]+\\.|\\(\\)|\\.com|\\b\\d{13}\\b|^<|^[\\w \\.\\-\\(?:\\):]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d \\(compatible;?\\)$|^mozilla/\\d\\.\\d \\w*$|^navermailapp|^netsurf|^offline|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^valid|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^\{\{.*\}\}$|analyzer|archive|ask jeeves/teoma|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|firephp|functionize|gomezagent|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|images|infrawatch|insight|inspect|iplabel|ips-agent|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node|nutch|offbyone|optimize|pageburst|pagespeed|parser|perl|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|reputation|resolver|retriever|rexx;|rigor|rss\\b|scan|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|trace|transcoder|url|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|zgrab", "i");
            
                if (fullPattern.test(ua)) {
                    pj_isBot.cookieCreate('pj_bot', 'true', '');
                    return true;
                } else {
                    pj_isBot.cookieCreate('pj_bot', 'false', '');
                    return false;
                }
            } else {
                return cookieValue === 'true'
            }
        } catch(err) {
            window.console.error(err);
            return false;
        }
    }

})();