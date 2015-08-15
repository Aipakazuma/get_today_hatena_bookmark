;(function($) {
    /**
     * はてなブックマークから本日ブクマした内容をスクレイピングしてmarkdownに変更
     */
    $(function() {
        var selector = {
            'input_text'  : '#input_text',
            'output_text' : '#output_text'
        };

        $(selector.input_text).on({
            blur : function() {
                // 空っぽだったら何もしない
                var hatenaId = $(this).val();
                if (hatenaId == '') {
                    return;
                }

                // スクレイピングする
                var scraping = new Scraping({'hatenaId':hatenaId});
                scraping.getServerData()
                    .done(function(data) {
                        console.log(data);
                        // var data = scraping.parse(xml);
                        // console.log(data);

                        // // markdown記法で生成
                        // var markdown()

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
            url: 'http://b.hatena.ne.jp/' + hatenaId + '/rss?' + randomVal,
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
        $(xml.results[0]).find('item').each(function() {
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
                // コンテンツ
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
var toMarkDown = function() {
};