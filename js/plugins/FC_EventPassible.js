//===============================================================================
// FC_EventPassible.js
//===============================================================================
// Copyright (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) イベント通行許可プラグイン
 * @author FantasticCreative
 *
 * @help メモ欄を設定したイベントの条件を満たすと、
 * そのイベントの上を通行可能になります。
 *
 * 主に橋をかけるなどのイベントで使用する想定です。
 *
 *
 * [使い方]
 * 出現条件を拡張したいイベントのメモ欄に
 *   <通行:XXX>
 * と設定します。
 *
 * XXXは条件部分を表し、以下の文字列を設定します。
 *
 *   スイッチYYY
 *
 * スイッチYYYがONのときに通行可能になります。
 *
 *   セルフY
 *
 * セルフスイッチYがONのときに通行可能になります。
 *
 *
 * [コピペ用]
 * <通行:スイッチ100>
 * <通行:セルフA>
 *
 *
 * ==============================================================================
 */

var Imported = Imported || {};
Imported.FC_EventPassible = true;

(function(_global) {
    'use strict';

    const PN = "FC_EventPassible";
    const META = "通行";


    const _Game_Map_isPassable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, d) {
        const eventId = $gameMap.eventIdXy(x, y);

        if (eventId <= 0) {
            return _Game_Map_isPassable.call(this, x, y, d);
        }

        const event = $gameMap.event(eventId);

        if (!event || !event.event().meta[META]) {
            return _Game_Map_isPassable.call(this, x, y, d);
        }

        const meta = event.event().meta[META];

        const m = meta.match(/スイッチ(\d+)|セルフ([ABCD])/);

        if (m[1]) {
            // スイッチ判定
            return $gameSwitches.value(parseInt(m[1], 10));
        } else if (m[2]) {
            // セルフスイッチ判定
            return $gameSelfSwitches.value([this._mapId, eventId, m[2]]);
        }

        return _Game_Map_isPassable.call(this, x, y, d);
    };


})(this);