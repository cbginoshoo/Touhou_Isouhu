//===============================================================================
// FC_ProgressStatus.js
//===============================================================================
// Copyright (c) 2017-2018 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v 1.0.0) 進行状況プラグイン
 * @author FantasticCreative
 *
 * @help メニュー画面に進行状況を表示するためのウィンドウを追加します。
 *
 * 進行状況の表示は
 * プラグインパラメータで指定した変数・スイッチにより管理されます。
 *
 * 指定条件に当てはまる進行状況が複数あった場合、
 * リストの下にあるものが優先されます。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 * ==============================================================================
 *
 * @param progress_list
 * @text 進行リスト
 * @desc 進行状況を管理するリストです。
 * @type struct<Progress>[]
 * @default []
 *
 * @param manage_variable
 * @text 管理用変数
 * @desc 進行状況を管理する変数を指定します。
 * @type variable
 * @default 0
 *
 * @param progress_format
 * @text 進行状況表示書式
 * @desc 進行状況を表示するフォーマットを指定します。(%1:進行状況)
 * @default 目的: %1
 *
 * @param no_progress
 * @text 進行状況不一致
 * @desc 進行状況リストに当てはまらない場合に表示する文字列を指定します。
 * @default なし(更新をお待ちください)
 *
 * @param window_setting
 * @text ウィンドウ設定
 * @desc ウィンドウを表示する位置、サイズを指定します。
 * @type struct<window>
 * @default {"x":"0","y":"552","w":"576","h":"72"}
*/
/*~struct~Progress:
 * @param text
 * @text 表示文字列
 * @desc ウィンドウに表示する文字列を指定します。(1行で収まる長さにすること)
 *
 * @param variable_value1
 * @text 変数条件
 * @desc [管理用変数]がこの値と同じだった場合に表示します。
 * @type number
 * @min 0
 * @max 99999
 * @default 0
 *
 * @param switch_value1
 * @text スイッチ条件
 * @desc 指定スイッチがONの場合に表示します。
 * @type switch
 * @default 0
 *
*/
/*~struct~Window:
 *
 * @param x
 * @text ウィンドウX座標
 * @desc ウィンドウのX座標を指定します。(左上を0とし、数字が大きいほど右に表示されます)
 * @type combo
 * @option 0
 *
 * @param y
 * @text ウィンドウY座標
 * @desc ウィンドウのY座標を指定します。(左上を0とし、数字が大きいほど下に表示されます)
 * @type combo
 * @option 552
 *
 * @param w
 * @text ウィンドウ横幅
 * @desc ウィンドウの横幅を指定します。
 * @type combo
 * @option 576
 *
 * @param h
 * @text ウィンドウ高さ
 * @desc ウィンドウの高さを指定します。
 * @type combo
 * @option 72
 *
*/

var Imported = Imported || {};
Imported.FC_ProgressStatus = true;

(function (_global) {
    'use strict';

    const PN = "FC_ProgressStatus";

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));

    const Params = {
        "ProgressList" : Parameters.progress_list || [],
        "ManageVar" : Number(Parameters.manage_variable || 0),
        "ProgressFormat" : String(Parameters.progress_format || "目的:%1"),
        "ProgressFontsize" : Number(Parameters.progress_fontsize || 28),
        "NoProgress" : String(Parameters.no_progress || "なし(更新をお待ちください)"),
        "Window" : {
            "X" : Number(Parameters.window_setting.x || 0),
            "Y" : Number(Parameters.window_setting.y || 0),
            "W" : Number(Parameters.window_setting.w || 0),
            "H" : Number(Parameters.window_setting.h || 0),
        },
    };


    //=========================================================================
    // Window_Progress
    //  ・進行状況を表示するウィンドウを定義します。
    //
    //=========================================================================
    function Window_Progress() {
        this.initialize.apply(this, arguments);
    }

    Window_Progress.prototype = Object.create(Window_Base.prototype);
    Window_Progress.prototype.constructor = Window_Progress;

    Window_Progress.prototype.initialize = function() {
        let x, y, width, height;
        x = Params.Window.X;
        y = Params.Window.Y;
        width = this.windowWidth();
        height = this.windowHeight();

        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_Progress.prototype.numVisibleRows = function() {
        return 1;
    };

    Window_Progress.prototype.windowWidth = function() {
        return Params.Window.W;
    };

    Window_Progress.prototype.windowHeight = function() {
        return Params.Window.H;
    };

    Window_Progress.prototype.refresh = function() {
        let text;
        text = this.text();

        this.contents.clear();
        this.drawTextEx(text, 0, 0);
    };

    Window_Progress.prototype.text = function() {
        let list, text, manageValue;
        text = Params.NoProgress;

        if(Params.ManageVar < 1) {
            Params.ProgressFormat.format(text);
        }

        manageValue = $gameVariables.value(Params.ManageVar);

        list = Params.ProgressList.filter(function(item, i) {
            if(item.variable_value1 != manageValue) {
                // NG:変数不一致
                return false;
            }
            if(item.switch_value1 < 1) {
                // OK:スイッチ条件なし
                return true;
            }
            if($gameSwitches.value(item.switch_value1)) {
                // OK:スイッチON
                return true;
            }

            // NG:スイッチOFF
            return false;
        });

        if(list.length > 0) {
            text = list.pop().text;
        }

        return Params.ProgressFormat.format(text);
    };


    //=========================================================================
    // Scene_Menu
    //  ・メニューに進行状況を表すウィンドウを表示します。
    //
    //=========================================================================
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this.createProgressWindow();
    };

    Scene_Menu.prototype.createProgressWindow = function() {
        this._progressWindow = new Window_Progress();
        this.addWindow(this._progressWindow);
    };




})(this);