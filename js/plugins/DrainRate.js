//=============================================================================
// DrainRate.js
//=============================================================================
//
//Copyright (c) 2015 Alec
//This software is released under the MIT License.
//http://opensource.org/licenses/mit-license.php

/*:
 * @plugindesc Set drain hp/mp rate for skill or item
 * use like <drain_hp_rate: 0.5> / <drain_mp_rate: 2>
 * @author Alec
 *
 *:ja
 * @plugindesc 与えたダメージの一部だけ吸収するスキルやアイテムを作る
 * noteに<drain_hp_rate: 0.5>のように書く
 * @author Alec
 *
 * @help Copyright (c) 2015 Alec
This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php

■使用方法
使用できるのは以下の二つのプラグインコマンドです

<drain_hp_rate: 数値>
<drain_mp_rate: 数値>

それぞれHPとMPの吸収攻撃に対応しています
入れた数値がダメージに掛け算されます。
半分にしたければ「0.5」、２倍にしたければ「2」と入力します。

サイドビューのバトルの際に自分のところに表示される吸収した数値は、
計算された後の数値が表示されます。

注意：吸収時のバトルログのテキストの数値は計算前の数値です。
　よって以下の様な文言に変更することをおすすめします。
　「%1に%3の%2ダメージを与え、一部を吸収した！」

■ライセンスについて
プラグインの戦闘のライセンス表記を変更しなければ
クレジットの表記や商用利用などの制限なく自由に使えます
 */

var prev_Game_Action_gainDrainedHp = Game_Action.prototype.gainDrainedHp;
Game_Action.prototype.gainDrainedHp = function(value) {
	value = Math.floor(value * this.drainHpRate());
	prev_Game_Action_gainDrainedHp.call(this, value);
};

var prev_Game_Action_gainDrainedMp = Game_Action.prototype.gainDrainedMp;
Game_Action.prototype.gainDrainedMp = function(value) {
	value = Math.floor(value * this.drainMpRate());
	prev_Game_Action_gainDrainedMp.call(this, value);
};

Game_Action.prototype.drainHpRate = function() {
	if (this.item().meta.drain_hp_rate) {
		var rate = parseFloat(this.item().meta.drain_hp_rate);
		return rate;
	}
	return 1.0;
}

Game_Action.prototype.drainMpRate = function() {
	if (this.item().meta.drain_mp_rate) {
		var rate = parseFloat(this.item().meta.drain_mp_rate);
		return rate;
	}
	return 1.0;
}
