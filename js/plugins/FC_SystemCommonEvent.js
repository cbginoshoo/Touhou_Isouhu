//===============================================================================
// FC_SystemCommonEvent.js
//===============================================================================
// Copyright (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.2) 特定状況でコモンイベント呼び出し
 * @author FantasticCreative
 *
 * @help 以下の状態のときに指定したコモンイベントを実行します。
 * ・セーブ完了後
 * ・ロード完了後
 * ・マップ移動後
 *
 * ==============================================================================
 *
 * @param save common
 * @text セーブ時コモン
 * @desc セーブ後に実行するコモンイベントを指定します。
 * @type common_event
 * @default 0
 *
 * @param load common
 * @text ロード時コモン
 * @desc ロード後に実行するコモンイベントを指定します。
 * @type common_event
 * @default 0
 *
 * @param transfer common
 * @text マップ移動時コモン
 * @desc マップ移動後に実行するコモンイベントを指定します。
 * @type common_event
 * @default 0
 *
*/

var Imported = Imported || {};
Imported.FC_SystemCommonEvent = true;

(function () {
    'use strict';

    const PN = "FC_SystemCommonEvent";

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
        "SaveCommon" : Number(Parameters["save common"]),
        "LoadCommon" : Number(Parameters["load common"]),
        "TransferCommon" : Number(Parameters["transfer common"]),
    };


    //=========================================================================
    // Game_Interpreter
    //  ・コモンイベント予約を定義します。
    //
    //=========================================================================
    // Game_Interpreter.prototype.setupReservedCommonEventEx = function(eventId) {
    //     if ($gameTemp.isCommonEventReserved()) {
    //         this.setup($gameTemp.reservedCommonEvent().list, eventId);
    //         $gameTemp.clearCommonEvent();
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };


    //=========================================================================
    // Scene_Load
    //  ・ロード成功時の処理を再定義します。
    //
    //=========================================================================
    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.call(this);
        if(Params.LoadCommon > 0) {
            $gameTemp.reserveCommonEvent(Params.LoadCommon);
            $gameMap._interpreter.setupReservedCommonEvent(0);
        }
    };


    //=========================================================================
    // Scene_Save
    //  ・セーブ成功時の処理を再定義します。
    //
    //=========================================================================
    const _Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
    Scene_Save.prototype.onSaveSuccess = function() {
        _Scene_Save_onSaveSuccess.call(this);
        if(Params.SaveCommon > 0) {
            $gameTemp.reserveCommonEvent(Params.SaveCommon);
            $gameMap._interpreter.setupReservedCommonEvent(0);
        }
    };


    //=========================================================================
    // Scene_Map
    //  ・マップ移動時の処理を再定義します。
    //
    //=========================================================================
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if(Params.TransferCommon > 0) {
            $gameTemp.reserveCommonEvent(Params.TransferCommon);
            // $gameMap._interpreter.setupReservedCommonEvent(0);
        }
    };

})();