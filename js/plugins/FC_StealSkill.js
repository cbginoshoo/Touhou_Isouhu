//===============================================================================
// FC_StealSkill.js
//===============================================================================
// (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.1.2) 「盗む」スキル
 * @author FantasticCreative
 *
 * @help 設定されたドロップアイテムを一定確率で「盗む」スキルを実装します。
 *
 * スキルのメモ欄に
 * <steal>
 * と記述することで、スキル命中時にアイテムを盗み
 * 結果をバトルウィンドウに表示します。
 *
 * なお、各ドロップアイテムは1度しか盗むことができず、
 * 盗んだアイテムはドロップアイテムとして抽選されなくなります。
 *
 * スキルが命中した場合、ドロップアイテムに設定された確率に従い
 * 「盗む候補アイテム」を選定します。
 *
 * 盗む候補アイテムが複数存在した場合、より確率の高い方が選ばれ
 * アイテムが獲得できます。(同率の場合はランダム)
 *
 * 盗む候補アイテムが一つも存在しない場合、
 * プラグインパラメータ[アイテムを盗める保証確率]により、
 * ドロップアイテムの中で一番確率の高いアイテムを
 * 盗む候補アイテムに加えるかどうかを判定します。
 * (ここが100%だと、スキルが命中した場合
 *  いずれかのアイテムを盗むことができるようになります)
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 *
 * ==============================================================================
 *
 * @param skill_success_message
 * @text スキル成功時
 * @desc スキルが成功したときのメッセージ。%1:対象エネミーの名前 %2:取得アイテム
 * @type note
 * @default "%1から\n　%2\nを盗み出した！"
 *
 * @param skill_failed_message
 * @text スキル失敗時
 * @desc スキルが失敗したときのメッセージ。%1:対象エネミーの名前
 * @type note
 * @default "しかし、%1に気づかれてしまった…！"
 *
 * @param skill_miss_message
 * @text スキルミス時
 * @desc スキルが命中しなかったときのメッセージ。%1:対象エネミーの名前
 * @type note
 * @default "しかし、%1は身をかわした！"
 *
 * @param non_droplist_message
 * @text ドロップリスト未設定時
 * @desc ドロップリストにアイテムがセットされていないときのメッセージ。%1:対象エネミーの名前
 * @type note
 * @default "しかし、%1は何も持っていないようだ…！"
 *
 * @param steal_min_per
 * @text アイテムを盗める保証確率
 * @desc スキルの命中後の判定で使われる、アイテムを盗める保証確率を設定します。
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param enable_luk_effect
 * @text 運を考慮する
 * @desc 運をスキルの命中判定に含めるか設定します。
 * @type boolean
 * @on 有効にする
 * @off 無効にする
 * @default false
 *
*/

var Imported = Imported || {};
Imported.FC_StealSkill = true;

(function (_global) {
    'use strict';

    const PN = "FC_StealSkill";

    const ParamParse = function (obj) {
        return JSON.parse(JSON.stringify(obj, ParamReplace));
    }

    const ParamReplace = function (key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = ParamParse(PluginManager.parameters(PN));
    const Params = {
        "SkillSuccessMessage": Parameters.skill_success_message,
        "SkillFailedMessage": Parameters.skill_failed_message,
        "SkillMissMessage": Parameters.skill_miss_message,
        "NonDroplistMessage": Parameters.non_droplist_message,
        "StealMinPer": Parameters.steal_min_per,
        "EnableLukEffect": Parameters.enable_luk_effect,
    };

    // console.log("parameters:%o", Parameters);
    // console.log("Params:%o", Params);


    //=========================================================================
    // Game_Interpreter
    //  ・
    //
    //=========================================================================
    const _Game_Troop_makeDropItems = Game_Troop.prototype.makeDropItems;
    Game_Troop.prototype.makeDropItems = function () {
        let result;


        this.members().forEach(function (enemy) {
            enemy._gameDropItems = JSON.parse(JSON.stringify($dataEnemies[enemy.enemyId()].dropItems));
        });

        this.members().forEach(function (enemy) {
            enemy.removeGameDropItems();
        });

        result = _Game_Troop_makeDropItems.call(this);

        return result;
    };

    //=========================================================================
    // Game_Enemy
    //  ・エネミーから盗めるアイテムを追加定義します。
    //
    //=========================================================================
    const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    Game_Enemy.prototype.initMembers = function () {
        _Game_Enemy_initMembers.call(this);

        this._stealItems = [];
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y)

        this.enemy().dropItems.forEach(function (item) {
            if (!item || item.kind < 1) {
                return;
            }
            this._stealItems.push({
                "id": item.dataId,
                "kind": item.kind,
                "denominator": item.denominator,
                "count": 1,
                "item": function () {
                    switch (this.kind) {
                        case 1:
                            return $dataItems[this.id];
                            break;
                        case 2:
                            return $dataWeapons[this.id];
                            break;
                        case 3:
                            return $dataArmors[this.id];
                            break;
                        default:
                            return null;
                    }
                }
            });
        }, this);
    };

    Game_Enemy.prototype.getDropItems = function () {
        if (!this._stealItems) {
            return null;
        }

        return this._stealItems.filter(function (item) {
            return item.count > 0;
        });
    };

    Game_Enemy.prototype.removeGameDropItems = function () {
        if (!this._stealItems) {
            return null;
        }

        if (this._stealItems.length > 0) {
            this._gameDropItems = this.enemy().dropItems.filter(function (item) {
                let data, i;
                data = null;

                for (i = 0; i < this.length; i++) {
                    if (item.dataId == this[i].id && item.kind == this[i].kind) {
                        data = this[i];
                        break;
                    }
                }

                if (!data) {
                    return true;
                }

                if (data.count <= 0) {
                    return false;
                }

                return true;
            }, this._stealItems);
        }
    };

    Game_Enemy.prototype.getStealItems = function (result) {
        if (!this._stealItems || this._stealItems.length < 1 || !result || !result.stealItem || result.stealItem < 1) {
            return;
        }

        result.stealItems().forEach(function (item) {
            this.some(function (enemyItem) {
                if (item.id == enemyItem.id && item.kind == enemyItem.kind && enemyItem.count > 0) {
                    enemyItem.count--;
                    return true;
                }
            });
        }, this._stealItems);
    };


    //=========================================================================
    // Game_Action
    //  ・「盗む」処理を定義します。
    //
    //=========================================================================
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _Game_Action_apply.call(this, target);

        let item;
        item = this.item();

        if (target.isEnemy() && item && item.meta.steal) {
            this.FC_stealAction(target, this.subject());
            this.FC_getStealItem(target, this.subject());
        }
    };

    const _Game_Action_itemHit = Game_Action.prototype.itemHit
    Game_Action.prototype.itemHit = function(target) {
        let item, subject, result, hitRate, buff;
        item = this.item();
        subject = this.subject();

        if (!Params.EnableLukEffect || !target.isEnemy() || !item || !item.meta.steal) {
            return _Game_Action_itemHit.call(this, target);
        }

        result = parseFloat(_Game_Action_itemHit.call(this, target));
        hitRate = parseFloat(subject.luk * 0.0001);
        buff = target.buff(7);
        hitRate = hitRate + 0.05 * buff * -1;

        return Math.max(result + hitRate, 0);
    };

    Game_Action.prototype.FC_stealAction = function (target, subject) {
        let items, result, stealList, dropItemRate, majorItem, minMajorItem, rand;
        items = target.getDropItems();
        result = target.result();
        stealList = [];

        if (!items || items.length <= 0) {
            result.success = true;
            result.missed = false;
            result.itemNotHold = true;
            return;
        }
        if (!target.result().isHit()) {
            result.missed = true;
            result.success = false;
            return;
        }
        majorItem = items[items.length - 1];
        items.forEach(function (item, i) {
            dropItemRate = Vitsuno ? target.dropItemRateFromIndex(i) : target.dropItemRate();

            rand = Math.random() * item.denominator;
            if (item.kind > 0 && rand < dropItemRate) {
                stealList.push(item);

                if (majorItem && majorItem.denominator > item.denominator) {
                    majorItem = item;
                } else if (majorItem.denominator == item.denominator) {
                    rand = Math.floor((Math.random() * 10) + 1);
                    majorItem = rand > 5 ? majorItem : item;
                }

            }
            if (i == 0 || (minMajorItem && minMajorItem.denominator > item.denominator)) {
                minMajorItem = item;
            } else if (minMajorItem.denominator == item.denominator) {
                rand = Math.floor((Math.random() * 10) + 1);
                minMajorItem = rand > 5 ? minMajorItem : item;
            }
        });
        rand = Math.floor(Math.random() * 101);
        if (stealList.length <= 0 && rand <= Params.StealMinPer) {
            stealList.push(minMajorItem);
        } else if (stealList.length > 1) {
            stealList = [majorItem];
        }
        // console.log("FC_stealAction 結果:%o",stealList);
        result.setStealItems(stealList);
        target.getStealItems(result);

        if (!stealList || stealList.length <= 0) {
            result.success = false;
        } else {
            result.success = true;
        }
    };


    Game_Action.prototype.FC_getStealItem = function (target, subject) {
        let result, stealItem;
        result = target.result();

        // console.log("FC_getStealItem 結果:%o", result);
        if (!result || !result.stealItems()) {
            return;
        }

        stealItem = result.stealItems();
        // console.log("盗んだアイテム獲得:%d:%o", stealItem.length, stealItem);

        if (!stealItem || stealItem.length <= 0) {
            return;
        }

        stealItem.forEach(function (item) {
            let data = null;
            switch (item.kind) {
                case 1:
                    data = $dataItems[item.id];
                    break;
                case 2:
                    data = $dataWeapons[item.id];
                    break;
                case 3:
                    data = $dataArmors[item.id];
                    break;
            }
            if (!data) {
                return;
            }
            $gameParty.gainItem(data, 1);
        });
    };


    //=========================================================================
    // Game_ActionResult
    //  ・「盗む」スキルの結果を定義します。
    //
    //=========================================================================
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function () {
        _Game_ActionResult_clear.call(this);
        this.stealItem = [];
        this.itemNotHold = false;
    }

    Game_ActionResult.prototype.setStealItems = function (items) {
        this.stealItem = items;
    }

    Game_ActionResult.prototype.pushStealItems = function (item) {
        this.stealItem.array_push(item);
    }

    Game_ActionResult.prototype.stealItems = function () {
        return this.stealItem;
    }


    //=========================================================================
    // Window_BattleLog
    //  ・「盗む」スキルの各メッセージ処理を定義します。
    //
    //=========================================================================
    const _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
    Window_BattleLog.prototype.displayActionResults = function (subject, target) {
        let skillId, skill;
        skillId = BattleManager._action._item._itemId;
        skill = $dataSkills[skillId];

        if (!skill || !skill.meta.steal) {
            _Window_BattleLog_displayActionResults.apply(this, arguments);
            return;
        }

        if (target.result().used) {
            this.push('pushBaseLine');
            this.displayCritical(target);
            this.push('popupDamage', target);
            this.push('popupDamage', subject);
            this.displayStealDamage(target);
            this.displayAffectedStatus(target);
            if (target.result().itemNotHold) {
                // console.log("%s は何も持っていない", target.name());
                this.displayNotHold(target);
            } else if (target.result().missed) {
                // console.log("%s に対するスキル命中せず", target.name());
                this.displayStealMiss(target);
            } else {
                // console.log("%s に対するスキル成功or失敗", target.name());
                this.displayStealResult(target);
                this.displayStealFailure(target);
            }
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }

        if (target.result().itemNotHold) {

        }
    };

    Window_BattleLog.prototype.displayStealDamage = function (target) {
        if (target.result().missed) {
            return;
        }

        this.displayDamage.apply(this, arguments);
    };

    // 盗むスキルが成功したとき
    Window_BattleLog.prototype.displayStealResult = function (target) {
        // console.log("攻撃がヒット:"+target.result().isHit());
        // console.log("成功判定:"+target.result().success);
        if (target.result().isHit() && target.result().success && !target.result().itemNotHold) {
            // this.push('addText', Params.SkillSuccessMessage.format(target.name(), this.getItemName(target)));
            const messages = Params.SkillSuccessMessage.format(target.name(), this.getItemName(target)).split("\n");
            for(const message of messages) {
                this.push('addText', message);
            }
        }
    };

    Window_BattleLog.prototype.getItemName = function (target) {
        let name;
        name = "";

        target.result().stealItems().forEach(function (stealItem, i) {
            if (i > 0) {
                name += " / ";
            }
            name += stealItem.item().name;
        });

        return name;
    };

    // 盗むスキルが命中しなかったとき
    Window_BattleLog.prototype.displayStealMiss = function (target) {
        this.push('addText', Params.SkillMissMessage.format(target.name()));
    };

    // 盗むスキルが命中したが有効ではなかったとき
    Window_BattleLog.prototype.displayStealFailure = function (target) {
        if ((target.result().isHit() && !target.result().success)) {
            this.push('addText', Params.SkillFailedMessage.format(target.name()));
        }
    };

    // 対象のドロップアイテムリストが空だったとき
    Window_BattleLog.prototype.displayNotHold = function (target) {
        this.push('addText', Params.NonDroplistMessage.format(target.name()));
    };


})(this);