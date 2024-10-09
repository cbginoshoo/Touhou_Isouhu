//===============================================================================
// FC_EventPopEx.js
//===============================================================================
// Copyright (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) イベント出現条件拡張プラグイン
 * @author FantasticCreative
 *
 * @help イベントの出現条件を拡張します。
 * 既存の出現条件に加え、イベントの注釈コマンドに記載された条件式も
 * 出現条件の判定処理に使うことができます。
 *
 *
 * [使い方]
 * 1.出現条件を拡張したいイベントのメモ欄に
 *     <popEx>
 *   と設定します。
 *
 * 2.イベントの実行内容に注釈を挿入します。
 *
 * 3.注釈は、EX:の後に続いて条件式を入力します。
 *
 * [設定例1](同じ意味である式はまとめて記載)
 * popEx:$gameVariables.value(30) == 5
 *   -> 変数30番の値が5である
 *
 * popEx:$gameVariables.value(30) != 5
 *   -> 変数30番の値が5ではない
 *
 * popEx:$gameVariables.value(30) >= 5
 *   -> 変数30番の値が5以上である
 *
 * popEx:$gameVariables.value(30) <= 5
 *   -> 変数30番の値が5以下である
 *
 * popEx:$gameVariables.value(30) > 5
 *   -> 変数30番の値が5より大きい
 *
 * popEx:$gameVariables.value(30) < 5
 *   -> 変数30番の値が5未満である
 *
 * popEx:$gameSwitches.value(1) == true
 * popEx:$gameSwitches.value(1) != false
 * popEx:$gameSwitches.value(1)
 *   -> スイッチ1番がON(true)である
 *
 * popEx:$gameSwitches.value(1) != true
 * popEx:$gameSwitches.value(1) == false
 * popEx:!$gameSwitches.value(1)
 *   -> スイッチ1番がON(true)ではない
 *
 * popEx:$gameSelfSwitches.value("A") == true
 * popEx:$gameSelfSwitches.value("A") != false
 * popEx:$gameSelfSwitches.value("A")
 *   -> セルフスイッチAがON(true)である
 *
 * popEx:$gameVariables.value(30) == 5 && $gameSwitches.value(1)
 *   -> 変数30番の値が5、かつスイッチ1番がON(true)である
 *
 * popEx:$gameVariables.value(30) == 5 || $gameVariables.value(30) == 10
 *   -> 変数30番の値が5、または10である
 *
 *
 * [条件式の例2](サブクエスト関連)
 * popEx:$gameQuest.isReport(17)
 *   -> 依頼17番を完了可能(=報酬を受け取れる状態)である
 *
 * popEx:$gameQuest.isOrder(8)
 *   -> 依頼8番を受注している
 *
 * popEx:$gameQuest.isComplete(10)
 *   -> 依頼10番が完了済みである(=報酬を受け取り済み)
 *
 * popEx:$gameQuest.getProgress(31) >= 2
 *   -> 依頼31番の進行度が2以上である
 *
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.FC_EventPopEx = true;

(function (_global) {
    'use strict';

    const PN = "FC_EventPopEx";
    const DELIMITER = "popEx:"
    const CODE = "108";

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const parameters = paramParse(PluginManager.parameters(PN));

    const Params = {};


    const _Game_Event_meetsConditions = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function(page) {
        let popExEnable;
        popExEnable = true;

        if(this.event().meta.popEx && page && page.list.length > 0) {
            let command, arr, script, i, cnt;
            cnt = page.list.length;
            for(i = 0; i < cnt; i++) {
                command = page.list[i];
                if(command.code == CODE) {
                    arr = command.parameters[0].split(DELIMITER);
                    if(arr && arr.length > 1 && arr[1] != "") {
                        script = arr[1].trim();
                        popExEnable = Function('"use strict";return ('+script+')')();
                        break;
                    }
                }
            }
        }

        return _Game_Event_meetsConditions.apply(this, arguments) && popExEnable;
    };

})(this);