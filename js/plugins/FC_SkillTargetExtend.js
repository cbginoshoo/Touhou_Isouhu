//===============================================================================
// FC_SkillTargetExtend.js
//===============================================================================
// (c) 2016 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) スキルターゲット拡張プラグイン
 * @author FantasticCreative
 *
 * @help エネミーを複数選択して
 * 効果を発動させることができるスキルを作成可能なプラグインです。
 *
 * スキルのメモ欄に下記のように設定します。
 *
 *   <plusTarget:1>
 *
 * 本来の攻撃回数にプラスして指定した回数分、対象の選択が可能です。
 *
 * プラグインパラメータ「連続攻撃時威力低下率」により、
 * 回数内で同じ対象を選択した場合にダメージを低下させることができます。
 * (同じ対象を"選択"した場合であり、同じ対象を"攻撃"した場合ではありません)
 *
 * 現在は秦こころ専用プラグインとなっています。
 *
 * ==============================================================================
 *
 * @param actionFormat
 * @text 行動説明文の書式
 * @desc 対象の選択時に表示する行動説明文字列です。(%1:選択可能数)
 * @default %1体の敵を選択します。
 *
 * @param selectFormat
 * @text 対象選択文の書式
 * @desc 対象の選択時に表示する対象選択文字列です。(%1:選択番号, %2:選択対象名)
 * @default %1体目:%2
 *
 * @param selectDownDamage
 * @text 連続攻撃時威力低下率
 * @desc 同じ対象を選択した場合に低下させるダメージ率です。リストの上から2回目、3回目と続きます。
 * @type number[]
 * @min 0
 * @max 100
 * @default []
 *
*/

var Imported = Imported || {};
Imported.FC_SkillTargetExtend = true;

(function () {
    'use strict';

    const PN = "FC_SkillTargetExtend";

    const ParamParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, ParamReplace));
    }

    const ParamReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = ParamParse(PluginManager.parameters(PN));
    let Params = {};

    Params = {
        "actionFormat" : Parameters.actionFormat,
        "selectFormat" : Parameters.selectFormat,
        "selectDownDamageList" : Parameters.selectDownDamage || [],
    };


    //=========================================================================
    // BattleManager
    //  ・アクション開始処理を再定義します。
    //
    //=========================================================================
    const _BattleManager_startAction = BattleManager.startAction
    BattleManager.startAction = function() {
        let action, subject, plusCount;
        subject = this._subject;
        action = subject.currentAction();


        if(!action.isSETarget()) {
            _BattleManager_startAction.call(this);
            return ;
        }

        plusCount = action.getPlusActionCount();

        if(plusCount > 0) {
            subject.plusActions();
            action.clearPlusActionTarget();
        }

        _BattleManager_startAction.call(this);
    };


    //=========================================================================
    // Scene_Battle
    //  ・エネミー選択処理を再定義します。
    //
    //=========================================================================
    const _Scene_Battle_selectEnemySelection = Scene_Battle.prototype.selectEnemySelection
    Scene_Battle.prototype.selectEnemySelection = function() {
        let action;
        action = BattleManager.inputtingAction();

        if(action.isSETarget()) {
            this._logWindow.enableForceUpdate();
            this._logWindow.displaySelect(action.getPlusActionCount() + 1, action);
        }
        _Scene_Battle_selectEnemySelection.call(this);
    };

    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function() {
        let action;
        action = BattleManager.inputtingAction();

        if(action.isSETarget()) {
            if(action.canInputPlusAction()) {
                action.addPlusActionTarget(this._enemyWindow.enemyIndex());
                this.selectEnemySelection();
            } else {
                _Scene_Battle_onEnemyOk.call(this);
                this._logWindow.clear();
                this._logWindow.disableForceUpdate();
                action.addPlusActionTarget(this._enemyWindow.enemyIndex());
                action.setTarget(action.shiftPlusActionTarget());
            }
        } else {
            _Scene_Battle_onEnemyOk.call(this);
        }
    };

    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        let action;
        action = BattleManager.inputtingAction();

        if(action.isSETarget() && action.getPlusActionCount()) {
            action.shiftPlusActionTarget();
            this.selectEnemySelection();
        } else {
            this._logWindow.clear();
            this._logWindow.disableForceUpdate();
            _Scene_Battle_onEnemyCancel.call(this);
        }
    };

    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this._logWindow.clear();
        this._logWindow.disableForceUpdate();
        _Scene_Battle_startPartyCommandSelection.call(this);
    }


    //=========================================================================
    // Game_Action
    //  ・対象を再選択する処理を定義します。
    //
    //=========================================================================
    const _Game_Action_initialize = Game_Action.prototype.initialize;
    Game_Action.prototype.initialize = function(subject, forcing) {
        _Game_Action_initialize.apply(this, arguments);

        this.clearPlusActionTarget();
        this.clearDamageDown();
    };

    Game_Action.prototype.targetIndex = function(targetIndex) {
        return this._targetIndex;
    };

    const _Game_Action_setSkill = Game_Action.prototype.setSkill;
    Game_Action.prototype.setSkill = function(skillId) {
        _Game_Action_setSkill.apply(this, arguments);

        this.clearPlusActionTarget();
        this.clearDamageDown();
    };

    const _Game_Action_setItem = Game_Action.prototype.setItem;
    Game_Action.prototype.setItem = function(itemId) {
        _Game_Action_setItem.apply(this, arguments);

        this.clearPlusActionTarget();
        this.clearDamageDown();
    };

    Game_Action.prototype.canInputPlusAction = function() {
        let item, targetCount, targetMax;
        item = this._item;

        if(!item) {
            return false;
        }

        targetCount = this._plusActionTargets.length;
        targetMax = item.plusTarget();
        if(targetCount < targetMax) {
            return true;
        }

        return false;
    }

    Game_Action.prototype.isSETarget = function() {
        let item;
        item = this.item();

        if(this.isSkill() && item && item.meta.plusTarget) {
            return true;
        }
        return false;
    }

    Game_Action.prototype.plusActionTarget = function(index) {
        return this._plusActionTargets[index];
    }

    Game_Action.prototype.addPlusActionTarget = function(index) {
        this._plusActionTargets.push(index);
    }

    Game_Action.prototype.clearPlusActionTarget = function() {
        this._plusActionTargets = [];
    }

    Game_Action.prototype.clearDamageDown = function() {
        this._damageDown = 0;
    }

    Game_Action.prototype.setDamageDown = function(damageDown) {
        this._damageDown = damageDown;
    }

    Game_Action.prototype.getDamageDown = function() {
        return this._damageDown;
    }

    Game_Action.prototype.getPlusActionCount = function() {
        return this._plusActionTargets.length;
    }

    Game_Action.prototype.shiftPlusActionTarget = function() {
        return this._plusActionTargets.shift();
    }

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let result, index;
        result = _Game_Action_makeDamageValue.apply(this, arguments);

        if(this.isSETarget() && Params.selectDownDamageList.length > 0) {
            // console.log("makeDamage:%d", result);
            // console.log("damageDown:%d", this.getDamageDown());
            result = Math.round(result * (100 - this.getDamageDown()) / 100);
            // console.log("makeDownDamage:%s", result);
        }

        return result;
    };


    //=========================================================================
    // Game_Item
    //  ・スキルメモ欄の再選択回数を返す処理を定義します。
    //
    //=========================================================================
    Game_Item.prototype.plusTarget = function() {
        let item;
        item = this.object();

        if(!this.isSkill() || !item || !item.meta || !item.meta.plusTarget) {
            return 0;
        }

        return parseInt(item.meta.plusTarget, 10);
    };


    //=========================================================================
    // Game_Battler
    //  ・アクターのplusActionをactions配列に追加する処理を定義します。
    //
    //=========================================================================
    Game_Battler.prototype.plusActions = function() {
        let action, nextAction, targetIndex, skillId, i, cnt, selectList, damageDown;
        action = this.currentAction();
        selectList = {};
        selectList[action.targetIndex()] = 0;

        if (!action.isSETarget()) {
            return ;
        }

        cnt = action.getPlusActionCount() - 1;
        if (cnt < 0) {
            return;
        }

        // console.log("before:%o",this._actions);
        skillId = action.item().id;

        // plusTarget配列を処理
        for (i = 0; i <= cnt; i++) {
            targetIndex = action.plusActionTarget(i);
            // console.log("i:%d targetIndex:%d", i, targetIndex);
            nextAction = new Game_Action(this);
            nextAction.setSkill(skillId);
            nextAction.setTarget(targetIndex);

            if(selectList[nextAction.targetIndex()] !== undefined) {
                selectList[nextAction.targetIndex()] += 1;
                damageDown = Params.selectDownDamageList.length > selectList[nextAction.targetIndex()] - 1 ? Params.selectDownDamageList[selectList[nextAction.targetIndex()] - 1] : 0;
                // console.log("setDamageDown:%d", damageDown);
                nextAction.setDamageDown(damageDown);
            } else {
                selectList[nextAction.targetIndex()] = 0;
            }
            // console.log("selectList:%o", selectList);

            // this._actions.splice(1, 0, nextAction);
            this._actions.push(nextAction);
        }

        // console.log("after:%o",this._actions);
    };


    //=========================================================================
    // Window_BattleLog
    //  ・再選択時の文章描画を定義します。
    //
    //=========================================================================
    const _Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        _Window_BattleLog_initialize.call(this);

        this._forceUpdate = false;
    };

    Window_BattleLog.prototype.enableForceUpdate = function() {
        this._forceUpdate = true;
    };

    Window_BattleLog.prototype.disableForceUpdate = function() {
        this._forceUpdate = false;
    };

    Window_BattleLog.prototype.forceUpdate = function() {
        return this._forceUpdate;
    };

    Window_BattleLog.prototype.displaySelect = function(count, action) {
        let text, i, enemy, index, name;
        i = 0;

        this.push('clear');

        text = Params.actionFormat;
        text = text.format(count);
        this.push('addText', text);

        if(count == 1) {
            text = Params.selectFormat;
            text = text.format(1, "");
            this.push('addText', text);
            return ;
        }

        for(i;i<count;i++) {
            index = action.plusActionTarget(i);
            enemy = $gameTroop.members()[index];
            name = enemy ? enemy.name() : "";
            text = Params.selectFormat;
            text = text.format(i + 1, name);
            this.push('addText', text);
        }

    };

    const _Window_BattleLog_updateWait = Window_BattleLog.prototype.updateWait;
    Window_BattleLog.prototype.updateWait = function() {
        return this.forceUpdate() ? !this.forceUpdate() : _Window_BattleLog_updateWait.call(this);
    };
})();