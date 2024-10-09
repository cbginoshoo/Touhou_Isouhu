//===============================================================================
// FC_FaceChatHistory.js
//===============================================================================
// (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.1.2) フェイスチャット履歴プラグイン
 * @author FantasticCreative
 *
 * @help フェイスチャットプラグイン「SupportFaceChat.js」に履歴機能を追加します。
 *
 * コモンイベントリストに作成したフェイスチャットイベントのリスト2行目に
 * 注釈文を追加することで、フェイスチャット履歴画面にフェイスチャットの説明文等を
 * 表示させることができます。
 *
 * 注釈中に使用できる特殊文字列は以下のとおりです。
 *   Category1:[任意の数値]
 *   Category2:[任意の数値]
 * どちらも、フェイスチャット履歴画面のチャットリストソートのために使用します。
 * Category1,Category2の順にソートされ、履歴画面に表示されます。
 *
 * 注釈中の上記以外の文字列は全てチャットの説明文として使用されます。
 *
 *
 * プラグインコマンド:
 *   facechathistory open
 *     ・フェイスチャット履歴画面を開きます。
 *
 * スクリプトコマンド:
 *   ありません。
 *
 * ==============================================================================
 *
 * @param scene_background
 * @text 画面背景
 * @desc 画面の背景画像を措定します。
 * @type file
 * @require 1
 * @dir /img/pictures/
 *
 * @param help_window_setting
 * @text ヘルプウィンドウ設定
 * @desc フェイスチャット履歴画:1番上にあるウィンドウの設定
 * @type struct<HelpWindow>
 *
 * @param detail_window_setting
 * @text 詳細ウィンドウ設定
 * @desc フェイスチャット履歴画面:上から2番目左にあるウィンドウの設定
 * @type struct<DetailWindow>
 *
 * @param choice_window_setting
 * @text 選択ウィンドウ設定
 * @desc フェイスチャット履歴画面:上から2番目右にあるウィンドウの設定
 * @type struct<ChoiceWindow>
 *
 * @param list_window_setting
 * @text リストウィンドウ設定
 * @desc フェイスチャット履歴画面:上から3番目にあるウィンドウの設定
 * @type struct<ListWindow>
 *
*/
/*~struct~HelpWindow:
 *
 * @param text_init
 * @text 初期表示テキスト
 * @desc 履歴画面を表示したときに表示されるヘルプテキストを指定します。
 * @default 再生したいフェイスチャットを選択してください。
 *
 * @param text_select
 * @text 選択時テキスト
 * @desc フェイスチャットを選択したさいに表示されるヘルプテキストを指定します。
 * @default このフェイスチャットを再生しますか？
 *
*/
/*~struct~DetailWindow:
 *
 * @param max_row
 * @text 最大行数
 * @desc 文章表示可能な最大行数を指定します。
 * @type number
 * @min 2
 * @max 4
 * @default 2
 *
 * @param text_secret
 * @text 未確認時説明テキスト
 * @desc フェイスチャットを未確認時、フェイスチャット説明の代わりに表示されるテキストを指定します。
 * @type note
 * @default "未確認のフェイスチャットです。"
 *
*/
/*~struct~ChoiceWindow:
 *
 * @param width
 * @text ウィンドウ横幅
 * @desc ウィンドウの横幅をpxサイズで指定します。
 * @type number
 * @min 180
 * @max 240
 * @default 180
 *
 * @param text_ok
 * @text OKテキスト
 * @desc 選択肢「OK」部分のテキストを指定します。
 * @default はい
 *
 * @param text_cancel
 * @text Cancelテキスト
 * @desc 選択肢「cancel」部分のテキストを指定します。
 * @default いいえ
 *
*/
/*~struct~ListWindow:
 *
 * @param text_secret
 * @text 未確認時タイトルテキスト
 * @desc フェイスチャットを未確認時、フェイスチャットタイトルの代わりに表示されるテキストタイトルを指定します。
 * @default ？？？？？？
 *
 * @param title_format
 * @text チャットタイトルフォーマット
 * @desc フェイスチャットタイトルの書式を指定します。(%1:分類1, %2:分類2, %3:タイトル)
 * @default %1-%2:%3
 *
 * @param new_icon
 * @text 未確認アイコン
 * @desc 履歴に追加されたフェイスチャットが未確認である場合に表示するアイコンを指定します。(ボックスを右クリック→アイコンセットビューア)
 * @type text
 * @min 0
 * @default 238
 *
*/

var Imported = Imported || {};
Imported.FC_FaceChatHistory = true;

(function(_global) {
    'use strict';

    const PN = "FC_FaceChatHistory";

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch(e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));

    const Params = {
        "SceneBackground": String(Parameters["scene_background"] || ""),
        "HelpWindow": {
            "InitText": String(Parameters["help_window_setting"]["text_init"] || ""),
            "SelectText": String(Parameters["help_window_setting"]["text_select"] || ""),
        },
        "DetailWindow": {
            "MaxRow": Number(Parameters["detail_window_setting"]["max_row"] || 1),
            "SecretText": String(Parameters["detail_window_setting"]["text_secret"] || ""),
        },
        "ChoiceWindow": {
            "Width": Number(Parameters["choice_window_setting"]["width"] || 90),
            "OkText": String(Parameters["choice_window_setting"]["text_ok"] || ""),
            "CancelText": String(Parameters["choice_window_setting"]["text_cancel"] || ""),
        },
        "ListWindow": {
            "SecretText": String(Parameters["list_window_setting"]["text_secret"] || ""),
            "TitleFormat": String(Parameters["list_window_setting"]["title_format"] || ""),
            "NewIcon": Number(Parameters["list_window_setting"]["new_icon"] || 0),
        },
    };

    const PluginCommandNo = 356;             // 実行内容[プラグインコマンド]コード番号
    const FaceChatCommand = "FaceChat Ready";     // フェイスチャット開始判定文字列
    const Category1Regexp = /Category1[: ](\d+)/; // フェイスチャット分類判定用正規表現
    const Category2Regexp = /Category2[: ](\d+)/; // フェイスチャット分類判定用正規表現
    const AnnotationNo = 108;              // 実行内容[注釈]コード番号
    const AnnotationNextNo = 408;              // 実行内容[注釈2行目以降]コード番号

    _global.Parameter = _global.Parameter || {};
    _global.Parameter.FC_FaceChatHistory = Params;


    //=========================================================================
    // Game_Interpreter
    //  ・プラグインコマンドを追加します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        let mode, banner;

        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command.toLowerCase() === "facechathistory") {
            switch(args[0].toLowerCase()) {
                case 'open':
                    SceneManager.push(Scene_FaceChatHistory);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_Temp
    //  ・フェイスチャット履歴用変数を定義します
    //  ・フェイスチャットタイトル取得関数を定義します。
    //
    //=========================================================================
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._faceChatArray = [];
        this._faceChatStatus = {};
        this._faceChatLastIndex = 0;
    };

    Game_Temp.prototype.makeFaceChatArray = function() {
        if(this._faceChatArray === undefined) {
            this._faceChatArray = [];
        }

        let commonCnt = $dataCommonEvents.length;

        // コモンイベントリストの先頭は必ずnullであるため1からスタート
        for(let i = 1; i < commonCnt; i++) {
            let data = $dataCommonEvents[i];

            if(data.name === "" || data.list[0].code !== PluginCommandNo || !data.list[0].parameters.length || data.list[0].parameters[0] !== FaceChatCommand) {
                continue;
            }

            // フェイスチャット設定の取得
            let { desc, category1, category2 } = getChatSetting(data.list);

            let list = {
                "id": i,
                "name": data.name,
                "description": desc,
                "category1": category1,
                "category2": category2,
            };
            this._faceChatArray.push(list);
        }

        // category1, category2の順に昇順ソート
        this._faceChatArray.sort((a, b) => {
            if(a.category1 < b.category1) return -1;
            if(a.category1 > b.category1) return 1;
            if(a.category2 < b.category2) return -1;
            if(a.category2 > b.category2) return 1;
            return 0;
        });
    };

    Game_Temp.prototype.getFaceChatArray = function() {
        return this._faceChatArray;
    };

    Game_Temp.prototype.hasFaceChatArray = function() {
        return this._faceChatArray.length > 0;
    };

    Game_Temp.prototype.getFaceChatLastIndex = function() {
        return this._faceChatLastIndex;
    };

    Game_Temp.prototype.setFaceChatLastIndex = function(faceChatLastIndex) {
        this._faceChatLastIndex = faceChatLastIndex;
    };

    Game_Temp.prototype.faceChatTitle = function(no, categoryEnable) {
        if(!isFinite(no) || no < 1) {
            return "";
        }

        let title = $dataCommonEvents[no].name;

        if(!categoryEnable) {
            return title;
        }

        return title;
    };

    Game_Temp.prototype.initFaceChatStatus = function(index) {
        this._faceChatStatus["" + index] = {
            new: false,
        };
    };

    Game_Temp.prototype.setFaceChatStatusList = function(list) {
        this._faceChatStatus = list;
    };

    Game_Temp.prototype.faceChatStatusNewEnable = function(index) {
        if(!("" + index in this._faceChatStatus)) {
            this.initFaceChatStatus(index);
        }

        this._faceChatStatus["" + index].new = true;
    };

    Game_Temp.prototype.deleteFaceChatStatus = function(index) {
        if(("" + index in this._faceChatStatus)) {
            delete this._faceChatStatus["" + index];
        }
    };

    Game_Temp.prototype.getFaceChatStatus = function(index) {
        if(!("" + index in this._faceChatStatus)) {
            return null;
        }

        return this._faceChatStatus["" + index];
    };

    Game_Temp.prototype.getFaceChatStatusList = function() {
        return this._faceChatStatus;
    };

    let DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = DataManager_makeSaveContents();
        contents.FaceChatStatus = $gameTemp.getFaceChatStatusList();
        return contents;
    };

    let DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        DataManager_extractSaveContents(contents);
        if(!(typeof contents.FaceChatStatus === "undefined")) {
            $gameTemp.setFaceChatStatusList(contents.FaceChatStatus);
        }
    };


    //=========================================================================
    // SceneManager
    //  ・シーンを挿入する処理を定義します。
    //
    //=========================================================================
    SceneManager.pushNewScene = function(scene) {
        this._stack.push(scene.constructor);
    };


    //=========================================================================
    // Scene_FaceChatHistory
    //  ・フェイスチャット履歴画面を定義します。
    //
    //=========================================================================
    function Scene_FaceChatHistory() {
        this.initialize.apply(this, arguments);
    }

    Scene_FaceChatHistory.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_FaceChatHistory.prototype.constructor = Scene_FaceChatHistory;

    Scene_FaceChatHistory.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        let _prevScene;
    };

    Scene_FaceChatHistory.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createFaceChatDetailWindow();
        this.createChoiceWindow();
        this.createFaceChatListWindow();
    };

    Scene_FaceChatHistory.prototype.createBackground = function() {
        let bg = Params.SceneBackground;

        if(bg) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = ImageManager.loadPicture(bg);
            this.addChild(this._backgroundSprite);
        } else {
            Scene_MenuBase.prototype.createBackground.call(this);
        }
    };

    Scene_FaceChatHistory.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(1);
        this._helpWindow.setText(Params.HelpWindow.InitText);
        this.addWindow(this._helpWindow);
    };


    Scene_FaceChatHistory.prototype.createFaceChatDetailWindow = function() {
        let x = 0;
        let y = this._helpWindow.height;
        let width = Graphics.boxWidth - Params.ChoiceWindow.Width;
        this._faceChatDetailWindow = new Window_FaceChatDetail(x, y, width);
        this.addWindow(this._faceChatDetailWindow);
    };

    Scene_FaceChatHistory.prototype.createChoiceWindow = function() {
        let x = Graphics.boxWidth - Params.ChoiceWindow.Width;
        let y = this._helpWindow.height;
        this._choiceWindow = new Window_ChoiceCommand(x, y);
        this._choiceWindow.setHandler('ok', this.onChoiceOk.bind(this));
        this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
        this.addWindow(this._choiceWindow);
        this._choiceWindow.deactivate();
    };

    Scene_FaceChatHistory.prototype.onChoiceOk = function() {
        // フェイスチャット再生
        let item = this._faceChatListWindow.item();
        if(item) {
            SceneManager.push(Scene_Map);
            $gameTemp.setFaceChatLastIndex(this._faceChatListWindow.index());
            $gameTemp.callFaceChat(item.id, item.title);
            $gameTemp.deleteFaceChatStatus(item.id);
        } else {
            this.onChoiceCancel();
        }
    };

    Scene_FaceChatHistory.prototype.onChoiceCancel = function() {
        this._choiceWindow.close();
        this._faceChatListWindow.activate();
        this._helpWindow.setText(Params.HelpWindow.InitText);
    };

    Scene_FaceChatHistory.prototype.createFaceChatListWindow = function() {
        // 初回表示時はフェイスチャットリストを作成する。
        if(!$gameTemp.hasFaceChatArray()) {
            $gameTemp.makeFaceChatArray();
        }

        let x = 0;
        let y = this._faceChatDetailWindow.y + this._faceChatDetailWindow.height;
        let width = Graphics.boxWidth;
        let height = Graphics.boxHeight - y;
        this._faceChatListWindow = new Window_FaceChatList(x, y, width, height);
        // this._faceChatListWindow.setHelpWindow(this._helpWindow);
        this._faceChatListWindow.setDetailWindow(this._faceChatDetailWindow);
        this._faceChatListWindow.setHandler('ok', this.onFaceChatOk.bind(this));
        this._faceChatListWindow.setHandler('cancel', this.popScene.bind(this));

        let lastIndex = $gameTemp.getFaceChatLastIndex();
        if(lastIndex > 0) {
            this._faceChatListWindow.select(lastIndex);
            $gameTemp.setFaceChatLastIndex(0);
            SceneManager.pushNewScene(new Scene_Menu);
        } else {
            this._faceChatListWindow.select(0);
        }

        this.addWindow(this._faceChatListWindow);
    };

    Scene_FaceChatHistory.prototype.onFaceChatOk = function() {
        this._choiceWindow.start();
        this._helpWindow.setText(Params.HelpWindow.SelectText);
    };


    //=========================================================================
    // Window_FaceChatList
    //  ・フェイスチャットリストウィンドウを定義します。
    //
    //=========================================================================
    function Window_FaceChatList() {
        this.initialize.apply(this, arguments);
    }

    Window_FaceChatList.prototype = Object.create(Window_Selectable.prototype);
    Window_FaceChatList.prototype.constructor = Window_FaceChatList;

    Window_FaceChatList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.makeItemList();
        this.refresh();
        this.activate();
        this.select(0);
    };

    Window_FaceChatList.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };

    Window_FaceChatList.prototype.item = function() {
        if(this.index() < 0) {
            return null;
        }
        return this._data[this.index()];
    };

    Window_FaceChatList.prototype.refresh = function() {
        this.contents.clear();
        this.drawAllItems();
    };

    Window_FaceChatList.prototype.makeItemList = function() {
        let faceChatArray = $gameTemp.getFaceChatArray();
        let seenArray = $gameTemp.getSeenChatArray();
        let chatCnt = faceChatArray.length;
        this._data = [];

        for(let i = 0; i < chatCnt; i++) {
            let item = faceChatArray[i];

            if(!item) {
                continue;
            }

            let data;
            let category1str = ("  " + item.category1).slice(-2);
            let category2str = (" " + item.category2).slice(-1);
            let status = $gameTemp.getFaceChatStatus(item.id);
            if(seenArray.contains("" + item.id)) {
                let title = item.category1 == 0 || item.category2 == 0
                    ? item.name
                    : Params.ListWindow.TitleFormat.format(category1str, category2str, item.name);
                data = {
                    "id": item.id,
                    "title": title,
                    "description": item.description,
                    "enable": true,
                    "new": !status ? false : true,
                };
            } else {
                let title = item.category1 == 0 || item.category2 == 0
                    ? Params.ListWindow.SecretText
                    : Params.ListWindow.TitleFormat.format(category1str, category2str, Params.ListWindow.SecretText);
                data = {
                    "id": item.id,
                    "title": title,
                    "description": Params.DetailWindow.SecretText,
                    "enable": false,
                    "new": false,
                };
            }

            this._data.push(data);
        }
    };

    Window_FaceChatList.prototype.drawItem = function(index) {
        let item = this._data[index];
        let rect = this.itemRect(index);
        let icon = item.new ? Params.ListWindow.NewIcon : 0;

        this.changePaintOpacity(item.enable);
        if(icon > 0) {
            this.drawIcon(icon, rect.x, rect.y + 2);
        }
        this.drawText(item.title, rect.x + Window_Base._iconWidth, rect.y, rect.width, 'left');
        this.changePaintOpacity(true);
    };

    Window_FaceChatList.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);
        this.callUpdateDetail();
    };

    Window_FaceChatList.prototype.setDetailWindow = function(detailWindow) {
        this._detailWindow = detailWindow;
        this.callUpdateDetail();
    };

    Window_FaceChatList.prototype.callUpdateDetail = function() {
        if(this.item() && this.active && this._detailWindow) {
            this.updateDetail();
        }
    };

    Window_FaceChatList.prototype.updateDetail = function() {
        this.setDetailWindowItem(this.item());
    };

    Window_FaceChatList.prototype.setDetailWindowItem = function(item) {
        if(this._detailWindow) {
            this._detailWindow.setItem(item);
        }
    };

    Window_FaceChatList.prototype.isCurrentItemEnabled = function() {
        let index = this.index();
        let item = this._data[index];

        if(!item) {
            return false;
        }

        return item.enable;
    };

    Window_FaceChatList.prototype.isOkTriggered = function() {
        return Input.isTriggered('ok');
    };


    //=========================================================================
    // Window_FaceChatDetail
    //  ・フェイスチャット詳細ウィンドウを定義します。
    //
    //=========================================================================
    function Window_FaceChatDetail() {
        this.initialize.apply(this, arguments);
    }

    Window_FaceChatDetail.prototype = Object.create(Window_Help.prototype);
    Window_FaceChatDetail.prototype.constructor = Window_FaceChatDetail;

    Window_FaceChatDetail.prototype.initialize = function(x, y, width) {
        let height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = '';
    };

    Window_FaceChatDetail.prototype.windowHeight = function() {
        return this.fittingHeight(Params.DetailWindow.MaxRow);
    };

    //=========================================================================
    // Window_ChoiceCommand
    //  ・選択肢ウィンドウを定義します。
    //
    //=========================================================================
    function Window_ChoiceCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_ChoiceCommand.prototype = Object.create(Window_Command.prototype);
    Window_ChoiceCommand.prototype.constructor = Window_ChoiceCommand;

    Window_ChoiceCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this.deactivate();
        this.openness = 0;
    };

    Window_ChoiceCommand.prototype.windowWidth = function() {
        return Params.ChoiceWindow.Width;
    };

    Window_ChoiceCommand.prototype.numVisibleRows = function() {
        return 2;
    };

    Window_ChoiceCommand.prototype.start = function() {
        this.refresh();
        this.select(0);
        this.open();
        this.activate();
    };

    Window_ChoiceCommand.prototype.makeCommandList = function() {
        this.addCommand(Params.ChoiceWindow.OkText, 'ok');
        this.addCommand(Params.ChoiceWindow.CancelText, 'cancel');
    };


    //=========================================================================
    // 汎用的な処理を定義します。
    //
    //=========================================================================
    function getChatSetting(list) {
        // フェイスチャット設定の取得
        let desc = "";
        let category1 = 0;
        let category2 = 0;
        let listCnt = list.length;
        for(let j = 1; j < listCnt; j++) {
            let data = list[j];
            let param = data.parameters[0];
            if(data.code === AnnotationNo || data.code === AnnotationNextNo) {
                if(Category1Regexp.test(param)) {
                    let m = param.match(Category1Regexp);
                    category1 = parseInt(m[1], 10);
                } else if(Category2Regexp.test(param)) {
                    let m = param.match(Category2Regexp);
                    category2 = parseInt(m[1], 10);
                } else {
                    desc += param + "\n";
                }
            }
        }

        return { desc, category1, category2 };
    };

})(this);