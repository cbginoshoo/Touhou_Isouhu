//=============================================================================
// MPP_CallEventPage.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.1】指定したイベントページの実行内容を呼び出すプラグインコマンドの追加。
 * @author 木星ペンギン
 *
 * @help プラグインコマンド:
 *   CallEventPage n           # n ページ目のイベント事項内容を呼び出す。
 *   CallEventPage n id        # id でイベントIDを指定した場合、
 *                               そのイベントの n ページ目となる。
 * 
 * ●イベントの別ページにある実行内容を[コモンイベント]の呼び出しと
 *   同じ処理で実行します。
 * 
 * ●イベントIDを指定して別イベントの実行内容を呼び出した場合、
 *   [移動ルートの設定]等にある[このイベント]は呼び出し先のイベントとなります。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 */

(function() {

//1722
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'CallEventPage') {
        var eventId = Number(args[1]) || this._eventId;
        if (this.isOnCurrentMap() && eventId > 0) {
            var event = $dataMap.events[eventId];
            var index = Number(args[0]) - 1;
            var page = event && index >= 0 ? event.pages[index] : null;
            if (page) this.setupChild(page.list, eventId);
        }
    }
};


})();
