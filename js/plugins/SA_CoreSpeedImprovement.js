//=============================================================================
// SA_CoreSpeedImprovement.js
// ----------------------------------------------------------------------------
// Created by seea
// License: MIT License  https://opensource.org/licenses/mit-license.php
//
// Plugin author:
//  Contact: https://nekono.org
//=============================================================================
// History
// 18.0 2018/01/27 Initial release.
//=============================================================================
// 更新履歴
// 18.0 2018/01/27 初版

/*:
 * ==============================================================================
 * @plugindesc v18.0 SA Core Speed Improvement (Define at the top)
 * @author seea
 * @require rpg_core.js v1.5.1
 *
 * @help
 * SA Core Speed Improvement -- コアスクリプト速度改善
 *
 * 必須 - rpg_core.js v1.5.1
 *
 * コアスクリプトのうち、ボトルネックとなっている部分の実行速度を改善します。
 *
 * 画面内に表示されるイベントの数が多くなると、RPGツクールMV バージョン 1.5.1 の
 * 実行速度の低下が目立つ場合があります。
 *
 * 本プラグインは、コードの見通しは良いが実ゲームの速度を遅くするコードを
 * 見通しは悪いが機能は同等の、Chromeブラウザが高速に処理するコードに置き換え、
 * ゲームの速度の改善を目指します。
 *
 * Chromeブラウザのプロファイラを用いて検出した、ゲームの速度に特に影響の大きい
 * コードに限り、置き換えています。
 *
 * 【使用方法】
 * ・他の全てのプラグインよりも先に定義してください。
 *
 * 【補足】
 * ・制作者は、本プラグインの内容がコミュニティ版コアスクリプトに適用されることを
 *   望みます。
 * ・将来、RPGツクールMV本体のバージョンアップにともない、改善内容が反映されて
 *   このプラグインが不要となる場合があります。
 *   その際は、プラグインを削除してください。
 */

var Imported = Imported || {};
Imported.SA_CoreSpeedImprovement = true;

//-----------------------------------------------------------------------------
(function() {
'use strict';

	//-----------------------------------------------------------------------------
	// Game_Map
	//

	Game_Map.prototype.events = function() {
		var filtered = [];
		for (var i = 0; i < this._events.length; i++) {
			var event = this._events[i];
			if (!!event) {
				filtered.push(event);
			}
		}
		return filtered;
	};

	Game_Map.prototype.eventsXyNt = function(x, y) {
		var events = this.events();
		var filtered = [];
		for (var i = 0; i < events.length; i++) {
			if (events[i].posNt(x, y)) {
				filtered.push(events[i]);
			}
		}
		return filtered;
	};

	//-----------------------------------------------------------------------------
	// Game_CharacterBase
	//

	Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
		var events = $gameMap.eventsXyNt(x, y);
		for (var i = 0; i < events.length; i++) {
			if (events[i].isNormalPriority()) {
				return true;
			}
		}
		return false;
	};

})();
