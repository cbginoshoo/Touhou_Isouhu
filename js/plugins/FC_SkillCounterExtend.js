//===============================================================================
// FC_SkillCounterExtend.js
//===============================================================================
// (c) 2016 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) スキル反撃拡張プラグイン
 * @author FantasticCreative
 *
 * @help 攻撃による反撃を無効にするスキルを作成できます。
 *
 * スキルのメモ欄に下記のように設定します。
 *
 *   <CounterInvalid>
 *
 * ==============================================================================
 *
*/

var Imported = Imported || {};
Imported.FC_SkillTargetExtend = true;

(function () {
    'use strict';

    const PN = "FC_SkillCounterExtend";

    //=========================================================================
    // BattleManager
    //  ・攻撃反撃/魔法反射処理を再定義します。
    //
    //=========================================================================
    const _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
    BattleManager.invokeCounterAttack = function(subject, target) {
        let item = this._action.item();
        if(item && item.meta && item.meta.CounterInvalid) {
            this.invokeNormalAction(subject, target);
            return;
        }
        _BattleManager_invokeCounterAttack.apply(this, arguments);
    };

    const _BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
    BattleManager.invokeMagicReflection = function(subject, target) {
        let item = this._action.item();
        if(item && item.meta && item.meta.CounterInvalid) {
            this.invokeNormalAction(subject, target);
            return;
        }
        _BattleManager_invokeMagicReflection.apply(this, arguments);
    };

})();