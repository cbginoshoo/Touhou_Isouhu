//=============================================================================
// PoisonArmor.js
//=============================================================================

/*:ja
 * @plugindesc ver1.03 お体のほうは・・・。
 * @author まっつＵＰ
 *
 * @param remove
 * @desc 装備の変更に成功した時、外れた装備についている
 * ノートタグのIDのステートを解除します。（付与より処理が先）
 * @type boolean
 * @default true
 *
 * @param states
 * @desc 指定したステートをマップ上での行動で解除されないようにします。
 * @type state[]
 * @default []
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * 武器または防具のノートタグ
 * <PAadd: x>
 * xはステートID
 *
 * <PAadd: 3>
 * このノートタグのついた装備をアクターが装備した時に
 * そのアクターにID3のステートを付加します。
 *
 * 注意：初期装備には効果がありません。
 * 普通に装備させなおしてください。
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * ver1.01　致命的なバグがあったので直しました。
 * ver1.02　ステートの解除に関する機能の追加。
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 */

(function() {
'use strict';

const PN = "PoisonArmor";

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

var PAremove = Parameters['remove'];
var PAstates = Parameters['states'] || [];

var _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item) {
    var PAlastequip = this.equips()[slotId];
    _Game_Actor_changeEquip.call(this, slotId, item);
    if(PAlastequip && this.equips()[slotId] !== PAlastequip){
        this.PAremovestate(PAlastequip);
    }
    // if(item && this.equips()[slotId] === item){
    //     this.PAaddstate(item);
    // }
    this.PAequipitems().forEach(function(item) {
        this.PAaddstate(item);
    }, this);
};

Game_Actor.prototype.PAaddstate = function(item) {
    var PAequip = this.PAcurrentstateid(item);
    if(PAequip <= 0 || this.isStateAffected(PAequip)) {
        return;
    }
    this.addState(PAequip);
    this.clearResult();
};

Game_Actor.prototype.PAremovestate = function(item) {
    var PAequip = this.PAcurrentstateid(item);
    if(!PAremove || PAequip <= 0) return;
    this.removeState(PAequip);
    this.clearResult();
};

Game_Actor.prototype.PAcurrentstateid = function(item) {
    if(!item) return 0;
    return Number(item.meta['PAadd'] || 0);
};

Game_Actor.prototype.PAequipitems = function() {
    return this.equips().filter(function(item) {
        return this.PAcurrentstateid(item) > 0;
    }, this);
};

const _Game_Actor_clearStates = Game_Actor.prototype.clearStates;
Game_Actor.prototype.clearStates = function() {
    _Game_Actor_clearStates.call(this);

    if(!this || !this._equips || this._hp < 1) {
        return;
    }

    this.PAequipitems().forEach(function(item) {
        this.PAaddstate(item);
    }, this);
};

const _Game_Actor_recoverAll = Game_Actor.prototype.recoverAll;
Game_Actor.prototype.recoverAll = function() {
    _Game_Actor_recoverAll.call(this);

    this.PAequipitems().forEach(function(item) {
        this.PAaddstate(item);
    }, this);
};

const _Game_Party_reviveBattleMembers = Game_Party.prototype.reviveBattleMembers;
Game_Party.prototype.reviveBattleMembers = function() {
    _Game_Party_reviveBattleMembers.call(this);
    this.battleMembers().forEach(function(actor) {
        actor.PAequipitems().forEach(function(item) {
            this.PAaddstate(item);
        }, actor);
    });
};

const _Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    _Game_Battler_removeState.apply(this, arguments);

    if(this.isEnemy()) {
        return;
    }

    this.PAequipitems().forEach(function(item) {
        this.PAaddstate(item);
    }, this);
};

const _Game_BattlerBase_revive = Game_BattlerBase.prototype.revive;
Game_BattlerBase.prototype.revive = function() {
    _Game_BattlerBase_revive.call(this);

    if(this.isEnemy()) {
        return;
    }

    this.PAequipitems().forEach(function(item) {
        this.PAaddstate(item);
    }, this);
};

const _Game_BattlerBase_removeStatesAuto = Game_BattlerBase.prototype.removeStatesAuto;
Game_Battler.prototype.removeStatesAuto = function(timing) {
    this.states().forEach(function(state) {
        if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing && !PAstates.contains(state.id)) {
            this.removeState(state.id);
        }
    }, this);
};


})();
