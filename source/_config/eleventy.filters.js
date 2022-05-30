//
//
//

const sprintf = require('sprintf-js')
    .sprintf;
const escape = require('html-escaper')
    .escape;

//

const URL_HOME = '/';
const URL_404 = '/404.html';

const SPRINTF_LENGTH = 12;
const SPRINTF_STRING = '%' + SPRINTF_LENGTH + 's';

//
//
//

module.exports = {

    //
    // Filter to sort Eleventy's Collections.all in their own sort order
    //
    // EleventyのCollections.allを独自のソート順に並べ替えるためのフィルタ
    //   ※タイトル名はエスケープしているよ！
    //
    //   Collections.allと同等のモノを生成するコーディングを自分にはできません…
    //
    setMyCustomOrder: function (collections_all) {

        // 共通関数化する？
        var _tmp_search = function (_arr, _url) {
            var ret = [];

            _arr.forEach(function (element) {
                if (element.url === _url) {
                    ret = element;
                    return;
                }
            });

            return ret;
        };

        var ret = [];

        // 必要な要素の抽出と選択
        collections_all.forEach(function (element) {
            // URLが存在しない場合、スキップ
            if (!element.url) {
                return;
            }
            ret.push({
                'url': element.url,
                'order_original': element.data.order,
                'title': escape(element.data.title),
                //
                // macOSの場合、
                //  *.mdに`date`があればそれを優先
                //    年月日までの場合、時間は`00:00:00`
                //  無ければ、ファイルの作成日付（おそらく、更新日付ではない）
                //
                'date': element.date
            })
        });

        // ソートオーダーの統一化
        var i = 0;
        ret.forEach(function (element1) {
            var tmp_order = '';
            if ((URL_HOME === element1.url) || (URL_404 === element1.url)) {
                // ホームと404のみは特殊
                tmp_order += sprintf(SPRINTF_STRING, element1.order_original);
            } else {
                // URLを先頭から区切り、それぞれのソートオーダーをつなぎ合わせる
                var tmp_url = '/';
                element1.url.split('/')
                    .forEach(function (element2) {
                        if (0 == element2.length) {
                            return;
                        }
                        tmp_url += element2 + '/';
                        var tmp = _tmp_search(ret, tmp_url);
                        tmp_order += sprintf(SPRINTF_STRING, tmp.order_original);
                    });
            }
            ret[i++]['order_custom'] = tmp_order;
        });

        // 昇順に並べ替え
        ret.sort(function (a, b) {
            if (a.order_custom < b.order_custom) return -1;
            if (a.order_custom > b.order_custom) return 1;
            return 0;
        });

        // console.log(ret);
        return ret;
    },

    //
    // Browser title setting
    //
    // ブラウザのタイトルの設定
    //
    getHeadTitle: function (collections_custom_order, me, site_name, delimiter) {
        var ret = escape(site_name);

        // パンくずリストで親子関係を取得
        var tmp = module.exports.getBreadcrumb(collections_custom_order, me);

        // ホームの場合、配列最初がホームのデータなので、それのみ取得
        // 「サイト名 >> ホームの名称」
        if (URL_HOME === me.url) {
            ret += sprintf(' %s %s', delimiter, tmp[0].title)
            return ret;
        }

        // ホーム以外の場合、配列最初がホームのデータなので、それをスキップ
        for (var i = 1; i < tmp.length; i++) {
            ret += sprintf(' %s %s', delimiter, tmp[i].title)
        }

        return ret;
    },

    //
    // Breadcrumb
    //
    // パンくずリスト
    //   ブラウザに出力するタイトル名との違い
    //    - パンくずリストはタイトルとURLが必要だが、ブラウザの方はタイトルのみ
    //    - パンくずリストは「ホーム」で問題無いが、ブラウザの方はサイト名が普通
    //    - パンくずリストの並び順は親から子供が普通だが、ブウラウザの方は逆の場合もある
    //    - ブラウザの方で、ホームの場合、「サイト名 - Home」などの場合あり
    //
    getBreadcrumb: function (collections_custom_order, me) {

        // 共通関数化する？
        var _tmp_search = function (_arr, _url) {
            var ret = [];

            _arr.forEach(function (element) {
                if (element.url === _url) {
                    ret = element;
                    return;
                }
            });

            return ret;
        };

        var ret = [];

        // 自身のデータ取得
        var tmp_my_page = _tmp_search(collections_custom_order, me.url);

        // ホームのデータ取得
        var tmp_home_page = _tmp_search(collections_custom_order, URL_HOME);
        ret.push({ 'title': tmp_home_page.title, 'url': tmp_home_page.url });

        if (URL_HOME === tmp_my_page.url) {
            // ホームの場合、自身のみ
            return ret;
        } else
        if (URL_404 === tmp_my_page.url) {
            // 404の場合、ホームと自身
            ret.push({ 'title': tmp_my_page.title, 'url': tmp_my_page.url });
            return ret;
        }

        // ホーム以下の取得
        for (var i = 1; i <= tmp_my_page.order_custom.length / SPRINTF_LENGTH; i++) {
            // カスタムオーダー文字列をSPRINTF_LENGTH単位で切り取り、親のデータを取得
            var tmp = tmp_my_page.order_custom.substring(0, SPRINTF_LENGTH * i);
            collections_custom_order.some(function (element) {
                if (element.order_custom === tmp) {
                    ret.push({ 'title': element.title, 'url': element.url });
                    return true;
                }
            });
        }

        // console.log(ret);
        return ret;
    },

    //
    // Top-level article list
    //
    // トップレベルの記事一覧
    //
    getListTopLevel: function (collections_custom_order, me) {
        var ret = [];

        var tmp_my_order_custom = '';
        collections_custom_order.forEach(function (element) {
            // トップレベルの記事の取得
            if (SPRINTF_LENGTH == element.order_custom.length) {
                ret.push(element);
            }

            // 自身の独自オーダ取得
            if (me.url === element.url) {
                tmp_my_order_custom = element.order_custom;
            }
        });

        // 自身の親（トップレベル）の取得
        var tmp_parennt = tmp_my_order_custom.substring(0, SPRINTF_LENGTH);

        // 記事一覧と自身のトップの親が一致するデータをマーク
        var i = 0;
        ret.forEach(function (element) {
            ret[i++]['active'] = (tmp_parennt === element.order_custom) ? true : false;
        });

        // console.log(ret);
        return ret;
    },

    //
    // Related articles, acquisition of related articles (acquisition of subordinate articles)
    //
    // Related articles、関連する記事の取得（配下の記事の取得）
    //

    // 一旦、配列を返す
    getListParentLevelArray: function (collections_custom_order, me) {
        var ret = [];

        // 自身のオーダの取得
        var my_order_custom = '';
        collections_custom_order.some(function (element) {
            if (me.url === element.url) {
                my_order_custom = element.order_custom;
                return true;
            }
        });

        // 自身の一難上の親の取得
        var parent_order_custom = my_order_custom.substring(0, SPRINTF_LENGTH);

        // 自身の親の配下の投稿の取得
        collections_custom_order.forEach(function (element) {
            if (0 == element.order_custom.indexOf(parent_order_custom)) {
                ret.push(element);
            }
        });

        // トップや404など、子が存在しない場合を除く
        if (1 == ret.length) {
            return ret;
        }

        // 自身をマーク
        var i = 0;
        ret.forEach(function (element) {
            ret[i++]['active'] = (element.url === me.url) ? true : false;
        });

        return ret;
    },

    // 配列を与えてリスト文字列を返す
    // （処理の規模が大きくなるので、配列化と文字列作成を分割）
    getListParentLevelString: function (articles) {
        var ret = '';

        //
        // 親のレベルは<ol>、子以下のレベルは<ul>を作成
        //

        var _create_anker = function (_obj) {
            var ret = '';

            if (_obj.active) {
                ret = '<strong>' + _obj.title + '</strong>';
            } else {
                ret = '<a href="' + _obj.url + '">' + _obj.title + '</a>';
            }

            return ret;
        };

        var level_save = '';
        articles.forEach(function (element) {
            if (0 == level_save.length) {
                ret = '<li>' + _create_anker(element);
            } else {
                if (level_save == element.order_custom.length / SPRINTF_LENGTH) {
                    ret += '</li>' + '\n' + '<li>' + _create_anker(element);
                } else
                if (level_save < element.order_custom.length / SPRINTF_LENGTH) {
                    ret += '\n' + '<ol>' + '\n' + '<li>' + _create_anker(element);
                } else
                if (level_save > element.order_custom.length / SPRINTF_LENGTH) {
                    ret += '</li>' + '\n' + '</ol>' + '\n' + '</li>' + '\n' + '<li>' + _create_anker(element);
                }
            }
            level_save = element.order_custom.length / SPRINTF_LENGTH;
        });

        for (i = 1; i <= level_save; i++) {
            ret += '</li>' + '\n';
            if (i == level_save) {
                ret += '</ul>' + '\n';
            } else {
                ret += '</ol>' + '\n';
            }
        }

        return '<ul>' + '\n' + ret;
    },

    //
    // Get the next article
    //
    // 次の記事の取得
    //

    getArticleNext: function (collections_custom_order, me) {
        var ret = [];

        // 自身のオーダの取得
        var my_order_custom = '';
        var idx = 0;
        collections_custom_order.some(function (element) {
            if (me.url === element.url) {
                my_order_custom = element;
                return true;
            }
            idx++;
        });

        // 自身が一番最後のデータの場合
        if (idx == collections_custom_order.length - 1) {
            return ret;
        }

        // 独自のソートオーダに従って、次のデータを取得
        var next_order_custom = collections_custom_order[idx + 1];

        // 独自のソートオーダーが自身と次のデータと違う場合
        if (my_order_custom.order_custom.length != next_order_custom.order_custom.length) {
            return ret;
        }

        // 自身と次のデータの親が違う場合
        var my_order_custom_parennt = my_order_custom.order_custom.substring(0, SPRINTF_LENGTH);
        var next_order_custom_parennt = next_order_custom.order_custom.substring(0, SPRINTF_LENGTH);
        if (my_order_custom_parennt !== next_order_custom_parennt) {
            return ret;
        } else {
            ret = next_order_custom;
        }

        return ret;
    },

    //
    // Get the previous article
    //
    // 前の記事の取得
    //

    getArticlePrev: function (collections_custom_order, me) {
        var ret = [];

        // 自身のオーダの取得
        var my_order_custom = '';
        var idx = 0;
        collections_custom_order.some(function (element) {
            if (me.url === element.url) {
                my_order_custom = element;
                return true;
            }
            idx++;
        });

        // 自身が一番最初のデータの場合
        if (0 == idx) {
            return ret;
        }

        // 独自のソートオーダに従って、前のデータを取得
        var next_order_custom = collections_custom_order[idx - 1];

        // 独自のソートオーダーが自身と前のデータと違う場合
        if (my_order_custom.order_custom.length != next_order_custom.order_custom.length) {
            return ret;
        }

        // 自身と前のデータの親が違う場合
        var my_order_custom_parennt = my_order_custom.order_custom.substring(0, SPRINTF_LENGTH);
        var next_order_custom_parennt = next_order_custom.order_custom.substring(0, SPRINTF_LENGTH);
        if (my_order_custom_parennt !== next_order_custom_parennt) {
            return ret;
        } else {
            ret = next_order_custom;
        }

        return ret;
    },

    //
    // List of latest updated articles
    //
    // 最新更新記事一覧
    //
    getListRecentUpdated: function (collections_custom_sort, me, count = 3) {
        var ret = [];

        // 日付降順に並べ替え
        var tmp = collections_custom_sort;
        tmp.sort(function (a, b) {
            if (a.date < b.date) return 1;
            if (a.date > b.date) return -1;
            return 0;
        });

        // 必要な項目を必要な件数で取得
        var i = 0;
        tmp.some(function (element) {
            if (Number(count) > i++) {
                ret.push({ 'title': element.title, 'url': element.url, 'date': element.date });
            } else {
                return true;
            }
        });

        // 自身が含まれるか？
        i = 0;
        ret.some(function (element) {
            ret[i++]['active'] = (me.url === element.url) ? true : false;
        });

        return ret;
    },
};
