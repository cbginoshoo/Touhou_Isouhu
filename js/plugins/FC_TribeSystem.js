//===============================================================================
// FC_TribeSystem.js
//===============================================================================
// (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v 1.0.0) 種族システム
 * @author FantasticCreative
 *
 * @help ゲーム内に種族システムを実装します。
 *
 * 現在実装されている項目は以下のとおりです。
 *   ・種族     - アクター/エネミーに複数個設定可能な要素です。
 *   ・種族有効 - 特定種族へ与える/特定種族が受けるダメージに影響する要素です。
 *
 *
 * [種族有効の仕様について]
 * 本プラグインでは、種族有効のダメージ計算について
 * 次の方式を取っています。
 *
 *   1.スキル計算式に則った値を算出(攻撃力強化分などもここで計算)
 *   2.[1]の値を元に特徴(物理軽減や有効属性など)を考慮した値を算出
 *     ([2]の値がバトラーに与える本来のダメージ)
 *   3.本プラグインで[2]の値を元に種族有効の数値を
 *      考慮した値を算出
 *     (本プラグインで、[3]の値をバトラーにダメージとして与えます)
 *
 * 対象となる複数の種族有効が設定されている場合、
 * それらを乗算した数値で計算を行います。
 *
 * なお、武器に設定できるのは特定種族相手に与えるダメージに対する有効数値、
 * 防具に設定できるのは特定種族相手から受けるダメージに対する有効数値となります。
 * (回復スキルの場合、種族有効設定は無視されます)
 *
 * [例]
 *   [2]時点で敵に与えるダメージ(本来敵に与えるダメージ):
 *     200
 *
 *   [2]時点で敵から受けるダメージ(本来敵から受けるダメージ):
 *     80
 *
 *   【装備状態】
 *   武器1:種族有効120%
 *   武器2:種族有効 90%
 *   防具1:種族有効 50%
 *   防具2:種族有効 95%
 *
 *   【使用スキル】
 *         種族有効200%
 *
 *   [3]時点で対象種族へ与えるダメージ(本プラグインで変化したダメージ):
 *     200*1.2*0.9*2.0=432
 *
 *   [3]時点で対象種族から受けるダメージ(本プラグインで変化したダメージ):
 *     80*0.5*0.95=38
 *
 *
 * [プラグインの使い方]
 * まずは、プラグインパラメータ[種族リスト]を設定します。
 * 次に、必要な分だけメモ欄を設定します。
 *
 *   [アクターに設定できるメモ欄]
 *     <種族:種族ID>
 *       アクターの種族を指定します。
 *       複数の種族を指定することができます。
 *
 *   [エネミーに設定できるメモ欄]
 *     <種族:種族ID>
 *       エネミーの種族を指定します。
 *       複数の種族を指定することができます。
 *
 *     <種族有効:種族ID_パーセンテージ(単位なし)の数値>
 *       "指定した種族に与える"ダメージ有効率を指定します。
 *
 *   [武器に設定できるメモ欄]
 *     <種族有効:種族ID_パーセンテージ(単位なし)の数値>
 *       "指定した種族に与える"ダメージ有効率を指定します。
 *       スキルの有効率と乗算されることに注意。
 *
 *   [防具に設定できるメモ欄]
 *     <種族有効:種族ID_パーセンテージ(単位なし)の数値>
 *       "指定した種族から受ける"ダメージ有効率を指定します。
 *
 *   [スキルに設定できるメモ欄]
 *     <種族有効:種族ID_パーセンテージ(単位なし)の数値>
 *       "指定した種族に与える"ダメージ有効率を指定します。
 *       武器の有効率と乗算されることに注意。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * ==============================================================================
 *
 * @param tribe_list
 * @text 種族リスト
 * @desc 種族名のリストを設定します。
 * @type struct<TribeList>[]
 * @default []
 *
 */
/*~struct~TribeList:
 * @param id
 * @text 種族ID
 * @desc メモ欄に設定する種族IDを設定します。(使用可->半角英数,-,_のみ、重複不可)
 *
 * @param name
 * @text 種族名
 * @desc 種族名を設定します。(ゲーム画面に表示する場合は種族名を使います)
*/


var Imported = Imported || {};
Imported.FC_TribeSystem = true;

(function () {
    'use strict';

    const PN = "FC_TribeSystem";

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
        "TribeList" : new Map(),
    };

    const RegObj = {
        Battler:/<(種族):([a-zA-Z0-9]+)>/i,
        Item:/<(種族有効):([a-zA-Z0-9]+)_([0-9]+)>/i,
    };

    Parameters["tribe_list"].forEach(function(tribe) {
        if(!/^[a-zA-Z0-9\-_]+$/.test(tribe.id) || tribe.name.trim() == null || this.has(tribe.id)) {
            return;
        }
        this.set(tribe.id, tribe.name);
    }, Params.TribeList);

    // console.log("Params:%o", Params);


    //=========================================================================
    // Game_Action
    //  ・ダメージ計算処理を再定義します。
    //
    //=========================================================================
    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let value;
        value = _Game_Action_makeDamageValue.apply(this, arguments);

        value = this.applyTribeDamage(value, this.subject(), target);

        return value;
    };

    Game_Action.prototype.applyTribeDamage = function(value, subject, target) {
        let tribeInfo, atkRate, grdRate;
        tribeInfo = {
            subject:subject.getTribeInfo(this.item()),
            target:target.getTribeInfo(null),
        };
        atkRate = 1.0;
        grdRate = 1.0;

        if(!tribeInfo || !tribeInfo.subject || !tribeInfo.target || tribeInfo.target.id.length < 1) {
            return value;
        }

        tribeInfo.target.id.forEach(function(id) {
            atkRate *= id in this.subject.atk ? this.subject.atk[id] : 1.0;
            grdRate *= id in this.target.grd ? this.target.grd[id] : 1.0;
        }, tribeInfo);

        // console.log("rate subject:%f target:%f",atkRate,grdRate);

        return value * atkRate * grdRate;
    };


    //=========================================================================
    // Game_Battler
    //  ・種族関連情報取得処理を定義します。
    //
    //=========================================================================
    Game_Battler.prototype.getTribeInfo = function(item, reg, battler, isActor, isRecover) {
        let notes, i, m, tribeInfo;
        tribeInfo = {
            "id":[],
            "atk":{},
            "grd":{}
        };
        notes = battler && "note" in battler ? battler.note.split(/[\r\n]+/) : [];

        for(i = 0; i < notes.length; i++) {
            if(!reg.test(notes[i].trim())) {
                continue;
            }
            m = notes[i].trim().match(reg);
            if(m[1] == "種族") {
                tribeInfo.id.push(m[2]);
            }
        }

        if(isRecover) {
            return tribeInfo;
        }

        if(isActor) {
            this.makeTribeRate(tribeInfo.atk, this.weapons());
            this.makeTribeRate(tribeInfo.grd, this.armors());
        } else {
            this.makeTribeRate(tribeInfo.atk, [battler]);
        }
        if(item) {
            this.makeTribeRate(tribeInfo.atk, [item]);
        }

        return tribeInfo;
    };

    Game_Battler.prototype.makeTribeRate = function(tribeInfo, typeItems) {
        let notes, i, m, reg, value;
        reg = RegObj.Item;

        if(!typeItems || typeItems.length < 1) {
            return ;
        }

        typeItems.forEach(function(item) {
            notes = item.note.split(/[\r\n]+/);
            for(i = 0; i < notes.length; i++) {
                if(!reg.test(notes[i].trim())) {
                    continue;
                }
                m = notes[i].trim().match(reg);
                if(m[1] == "種族有効") {
                    value = isFinite(m[3]) ? parseInt(m[3], 10) : 0;
                    if(!tribeInfo[m[2]]) {
                        tribeInfo[m[2]] = 1.0;
                    }
                    tribeInfo[m[2]] *= value / 100;
                }
            }
        });

        return ;
    };


    //=========================================================================
    // Game_Actor
    //  ・種族関連情報取得処理を定義します。
    //
    //=========================================================================
    Game_Actor.prototype.getTribeInfo = function(item) {
        let isRecover;
        isRecover = item && "damage" in item && [3, 4].contains(item.damage.type) ? true : false;

        return Game_Battler.prototype.getTribeInfo.call(this, item, RegObj.Battler, this.actor(), this.isActor(), isRecover);
    };


    //=========================================================================
    // Game_Enemy
    //  ・種族関連情報取得処理を定義します。
    //
    //=========================================================================
    Game_Enemy.prototype.getTribeInfo = function(item) {
        let isRecover;
        isRecover = item && "damage" in item && [3, 4].contains(item.damage.type) ? true : false;

        return Game_Battler.prototype.getTribeInfo.call(this, item, RegObj.Battler, this.enemy(), this.isActor(), isRecover);
    };


})(this);