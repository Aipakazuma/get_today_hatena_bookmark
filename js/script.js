;(function($) {
    /**
     * はてなブックマークから本日ブクマした内容をスクレイピングしてmarkdownに変更
     */
    $(function() {
        var selector = {
            'input_text'  : '#input_text',
            'output_text' : '#output_text'
        };

        var util = new Util();
        var markdown = new MarkDown();

        $(selector.input_text).on({
            blur : function() {
                // 空っぽだったら何もしない
                var hatenaId = $(this).val();
                if (hatenaId == '') {
                    return;
                }

                // スクレイピングする
                var scraping = new Scraping({'hatenaId':hatenaId,'util':util});
                scraping.getServerData()
                    .done(function(data) {
                        var scrapingData = scraping.parse(data);
                        console.log(scrapingData);

                        // markdown記法で生成

                        // viewに表示
                        // $(selector.output_text).hide().fadeIn(500).append();
                    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(textStatus);
                    });
            }
        });
    });
})(jQuery);


/**
 * スクレイピング。。。
 * しなくてもいいっぽい。Apiがある
 */
var Scraping = function(obj) {
    var hatenaId = obj.hatenaId;
    var randomVal = Math.round(Math.random()*10000000000);
    var today = obj.util.formatDate(new Date(), 'YYYYMMDD');
    var url = 'http://b.hatena.ne.jp/' + hatenaId + '/atomfeed?date=' + today + '&' + randomVal;

    var global = {
        getServerData : function() {
            return getServerData();
        },
        parse : function(data) {
            return parse(data);
        }
    };
    return global;

    function getServerData() {
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'xml',
            timeout: 5000,
        });
    }

    function parse(xml) {
        var row = 0;
        var data = [];
        var nodeName;
        // item の数だけ取得
        $(xml.results[0]).find('entry').each(function() {
            // 初期化
            data[row] = {};
            // 子要素を取得
            $(this).children().each(function() {
                // 要素名
                nodeName = $(this)[0].nodeName;
                // 初期化
                data[row][nodeName] = {};
                // 属性を取得
                attributes = $(this)[0].attributes;

                for (var i in attributes) {
                    // 属性名 = 値
                    data[row][nodeName][attributes[i].name] = attributes[i].value;
                }
                data[row][nodeName]['text'] = $(this).text();
            });
            row++;
        });
        return data;
    }
};

/**
 * スクレイピングのデータをMarkDownにする
 */
var MarkDown = function() {
    var global = {
        toMarkDonw : function() {
            return toMarkDown();
        }
    };
    return global;

    function toMarkDown() {
    }
};


var Util = function() {

    var global = {
        formatDate : function(date, format) {
            return formatDate(date, format);
        }
    };
    return global;

    /**
     * 日付をフォーマットする
     * @param  {Date}   date     日付
     * @param  {String} [format] フォーマット
     * @return {String}          フォーマット済み日付
     */
    function formatDate(date, format) {
      if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
      }
      return format;
    };
};