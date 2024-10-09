﻿//=============================================================================
// NRP_EnemyRoutineKai.js
//=============================================================================

/*:
 * @plugindesc v1.01 敵行動ルーチンを改善します。
 * @author 砂川赳（http://newrpg.seesaa.net/）
 *
 * @help 敵の行動ルーチンを以下の通り改善します。
 * ・ターン開始時だけでなく行動直前にも行動再選択を行う。
 * ・ＨＰ＆ＭＰ回復時に最も減っている対象を選択する。
 * ・既にかかっているステートを重ねがけしない。
 * ・既に限界となっている能力変化を重ねがけしない。
 * ・有効な対象が存在しない場合、回復や治療、蘇生を行わない。
 * 
 * ■個別設定
 * 敵キャラのメモ欄に以下を記入すれば個別設定も可能です。
 * ・行動直前の再設定を行うか？     ：<RoutineReset:[true or false]>
 * ・無意味な行動をしないか？       ：<RoutineTest:[true or false]>
 * ・回復系行動を制御するか？       ：<RoutineRecover:[true or false]>
 * ・HP回復を行う条件              ：<RoutineIfHp:[condition]>
 * ・MP回復を行う条件              ：<RoutineIfMp:[condition]>
 * ・蘇生系行動を制御するか？       ：<RoutineForDead:[true or false]>
 * ・対アクター使用効果を制御するか？：<RoutineActorEffect:[true or false]>
 * ・対エネミー使用効果を制御するか？：<RoutineEnemyEffect:[true or false]>
 * ・ステート耐性を見るか？         ：<RoutineWatchResist:[true or false]>
 * 
 * ■注意点
 * ・回復時の対象制御はタイプが回復系のスキルのみ行います。
 * ・ステートなど使用効果の有効判定は、タイプが『なし』のスキルのみ行います。
 * ・タイプがダメージ・吸収系に該当するスキルは使用効果に依らず制御しません。
 * ・ターン制かつターン開始時に速度補正技が選ばれた場合、行動再選択を行いません。
 * ・また、行動再選択時に速度補正技を選ぶこともありません。
 * 
 * ■利用規約
 * 特に制約はありません。
 * 改変、再配布自由、商用可、権利表示も任意です。
 * 作者は責任を負いませんが、不具合については可能な範囲で対応します。
 * 
 * @param ＜基本設定＞
 * @desc 見出しです。
 * 
 * @param resetAction
 * @text 行動直前の再設定
 * @parent ＜基本設定＞
 * @type boolean
 * @default false
 * @desc ONならば、行動直前にも再度の行動決定を行います。
 * 一人ずつ行動するCTBでは無意味なので、OFF推奨です。
 * 
 * @param testApply
 * @text 行動判定の実行
 * @parent ＜基本設定＞
 * @type boolean
 * @default true
 * @desc ONならば効果の得られないスキルは使用しなくなります。
 * 
 * @param ＜回復関連＞
 * @desc 見出しです。
 * 
 * @param controlRecover
 * @text 回復系行動の制御
 * @parent ＜回復関連＞
 * @type boolean
 * @default true
 * @desc ONならば回復系スキルの制御を行います。
 * 
 * @param ifHpRecover
 * @text HP回復行動の条件
 * @parent ＜回復関連＞
 * @type text
 * @default b.hpRate() < 1.0
 * @desc 指定した条件でHP回復を行います。
 * 『b.hpRate() < 1.0』で誰かのHPが100%未満になった時です。
 * 
 * @param ifMpRecover
 * @text MP回復行動の条件
 * @parent ＜回復関連＞
 * @type text
 * @default b.mpRate() < 1.0
 * @desc MP回復系行動を行う条件を設定します。
 * 『b.mpRate() < 1.0』で誰かのMPが100%未満になった時です。
 * 
 * @param controlForDead
 * @text 蘇生系行動の制御
 * @parent ＜回復関連＞
 * @type boolean
 * @default true
 * @desc ONならば戦闘不能者を対象にしたスキルの制御を行います。
 * 
 * @param ＜使用効果関連＞
 * @desc 見出しです。
 * 
 * @param controlEnemyEffect
 * @text 対エネミーの使用効果制御
 * @parent ＜使用効果関連＞
 * @type boolean
 * @default true
 * @desc ONならば仲間（エネミー）サイドに対する使用効果系スキルの制御を行います。（支援系ステートなど）
 * 
 * @param controlActorEffect
 * @text 対アクターの使用効果制御
 * @parent ＜使用効果関連＞
 * @type boolean
 * @default true
 * @desc ONならば相手（アクター）サイドに対する使用効果系スキルの制御を行います。（異常系ステートなど）
 * 
 * @param watchResist
 * @text ステート耐性を見るか
 * @parent ＜使用効果関連＞
 * @type boolean
 * @default false
 * @desc ONならば対象の耐性を確認し、無効なステートは使用しません。
 */
(function() {
"use strict";

function setDefault(str, def) {
    return str ? str : def;
}
function toBoolean(val, def) {
    if (val == "") {
        return def; // 空白なら初期値を返す
    }
    // 文字列ならboolean型に変換して返す
    return val.toLowerCase() == "true";
}

var parameters = PluginManager.parameters("NRP_EnemyRoutineKai");
    
var pResetAction = toBoolean(parameters["resetAction"], true);
var pTestApply = toBoolean(parameters["testApply"], true);

var pControlRecover = toBoolean(parameters["controlRecover"], true);
var pIfHpRecover = setDefault(parameters["ifHpRecover"], "b.hpRate() < 1.0");
var pIfMpRecover = setDefault(parameters["ifMpRecover"], "b.mpRate() < 1.0");
var pControlForDead = toBoolean(parameters["controlForDead"], true);

var pControlActorEffect = toBoolean(parameters["controlActorEffect"], true);
var pControlEnemyEffect = toBoolean(parameters["controlEnemyEffect"], true);
var pWatchResist = toBoolean(parameters["watchResist"], true);

/**
 * ●行動再決定を行うか？
 */
function isResetAction(subject) {
    // メモ欄のmeta情報を確認
    var flg = eval(subject.enemy().meta.RoutineReset);
    // 設定がある場合
    if (flg == true || flg == false) {
        return flg;
    }
    // 未定義の場合
    return pResetAction;
}

/**
 * ●行動判定の実行を行うか？
 */
function isTestApply(subject) {
    var flg = eval(subject.enemy().meta.RoutineTest);
    if (flg == true || flg == false) {
        return flg;
    }
    return pTestApply;
}

/**
 * ●回復系行動の制御を行うか？
 */
function isControlRecover(subject) {
    var flg = eval(subject.enemy().meta.RoutineRecover);
    if (flg == true || flg == false) {
        return flg;
    }
    return pControlRecover;
}

/**
 * ●HP回復を行うかを判定する。
 * @param a 行動主体
 * @param b 対象
 */
function isRoutineHpRecover(a, b) {
    var flg = eval(a.enemy().meta.RoutineIfHp);
    if (flg == true || flg == false) {
        return flg;
    }
    return eval(pIfHpRecover);
}

/**
 * ●MP回復を行うかを判定する。
 * @param a 行動主体
 * @param b 対象
 */
function isRoutineMpRecover(a, b) {
    var flg = eval(a.enemy().meta.RoutineIfMp);
    if (flg == true || flg == false) {
        return flg;
    }
    return eval(pIfMpRecover);
}

/**
 * ●蘇生系行動の制御を行うか？
 */
function isControlForDead(subject) {
    var flg = eval(subject.enemy().meta.RoutineForDead);
    if (flg == true || flg == false) {
        return flg;
    }
    return pControlForDead;
}

/**
 * ●対エネミーの使用効果制御を行うか？
 */
function isControlEnemyEffect(subject) {
    var flg = eval(subject.enemy().meta.RoutineEnemyEffect);
    if (flg == true || flg == false) {
        return flg;
    }
    return pControlEnemyEffect;
}

/**
 * ●対アクターの使用効果制御を行うか？
 */
function isControlActorEffect(subject) {
    var flg = eval(subject.enemy().meta.RoutineActorEffect);
    if (flg == true || flg == false) {
        return flg;
    }
    return pControlActorEffect;
}

/**
 * ●無効なステートを使用しないか？
 */
function isRoutineWatchResist(subject) {
    var flg = eval(subject.enemy().meta.RoutineWatchResist);
    if (flg == true || flg == false) {
        return flg;
    }
    return pWatchResist;
}

/**
 * ●速度補正技の除外処理を行うか？
 */
function isSpeedException(action) {
    // CTTBなら速度補正の意味が異なるので除外しない
    // _cttbCountの有無で判定
    if (BattleManager._cttbCount || BattleManager._isCttb || BattleManager._isCtb) {
        return false;
    }
    // 速度補正技なので除外する
    if (action.item().speed != 0) {
        return true;
    }
    return false;
}

// 行動再設定を判定するフラグ
var resetActionFlg = false;

/**
 * ●戦闘行動の処理
 */
var _BattleManager_processTurn = BattleManager.processTurn;
BattleManager.processTurn = function() {
    var subject = this._subject;

    // 敵の場合、行動直前の再設定を実行
    if (subject.isEnemy() && isResetAction(subject)) {
        var action = subject.currentAction();
        // 敵の場合、行動前のタイミングでアクション再設定
        if (action && subject.isEnemy()) {
            // ただし、速度補正技は除く
            if (!action.item() || !isSpeedException(action)) {
                resetActionFlg = true;
                subject.makeActions();
                resetActionFlg = false;
            }
        }
    }

    // 元処理実行
    _BattleManager_processTurn.apply(this);
};

/**
 * ●敵のターン参照
 */
var _Game_Troop_turnCount = Game_Troop.prototype.turnCount;
Game_Troop.prototype.turnCount = function() {
    var turnCount = _Game_Troop_turnCount.apply(this);

    // 行動再設定時はターン-1
    // そうしないとターン最初の行動決定と条件が一致しない
    if (resetActionFlg) {
        turnCount -= 1;
    }
    return turnCount;
};

/**
 * ●仲間への対象選択
 */
var _Game_Action_targetsForFriends = Game_Action.prototype.targetsForFriends;
Game_Action.prototype.targetsForFriends = function() {
    var subject = this.subject();

    /*
     * 以下の条件を全て満たす場合が対象
     * ・行動主体が敵
     * ・死亡者向けではない
     * ・対象が使用者ではない
     * ・単体が対象
     * ・対象がランダム（敵の単体対象は原則ランダム扱い）
     * ・ダメージ・吸収ではない
     */
    if (subject.isEnemy() && !this.isForDeadFriend() && !this.isForUser() && this.isForOne()
            && this._targetIndex < 0 && !this.isDamage() && !this.isDrain()) {
        var targets = [];
        var target;
        var unit = this.friendsUnit();

        // 回復制御を行う場合
        if (isControlRecover(subject)) {
            // HP回復の場合
            if (this.isHpRecover()) {
                // HPが最も減っている対象を選択
                target = unit.aliveMembers().reduce(function(a, b) {
                    return a.hpRate() < b.hpRate() ? a : b;
                });
                targets.push(target);
                return targets;

            // MP回復の場合
            } else if (this.isMpRecover()) {
                // MPが最も減っている対象を選択
                target = unit.aliveMembers().reduce(function(a, b) {
                    return a.mpRate() < b.mpRate() ? a : b;
                });
                targets.push(target);
                return targets;
            }
        }

        // ダメージタイプがなしで、かつ使用効果がある場合
        if (this.checkDamageType([0]) && this.item().effects.length > 0) {
            // 効果のある対象だけに候補を絞る
            var filterTargets = unit.aliveMembers().filter(function(m) {
                return this.testApplyEnemy(m);
            }, this);

            // 行動判定を行う場合、または有効な対象が存在する場合
            // ※行動判定を行わない、かつ有効な対象がない場合は通常の処理をさせる。
            if (isTestApply(subject) || filterTargets.length > 0) {
                // 絞った候補からさらにランダムで選択する。
                targets.push(randomTargetFilter(filterTargets));
                return targets;
            }
        }
    }

    // 条件を満たさない場合は元処理実行
    return _Game_Action_targetsForFriends.apply(this);
};

/**
 * ●相手サイドへの対象選択
 */
var _Game_Action_targetsForOpponents = Game_Action.prototype.targetsForOpponents;
Game_Action.prototype.targetsForOpponents = function() {
    var subject = this.subject();

    /*
     * 以下の条件を全て満たす場合が対象
     * ・行動主体が敵
     * ・単体が対象
     * ・対象がランダム（敵の単体対象は原則ランダム扱い）
     * ・ダメージタイプがなし
     * ・使用効果が存在する
     */
    if (subject.isEnemy() && this.isForOne()
            && this._targetIndex < 0 && this.checkDamageType([0]) && this.item().effects.length > 0) {
        var targets = [];
        var unit = this.opponentsUnit();

        // 効果のある対象だけに候補を絞る
        var filterTargets = unit.aliveMembers().filter(function(m) {
            return this.testApplyEnemy(m);
        }, this);

        // 行動判定を行う場合、または有効な対象が存在する場合
        // ※行動判定を行わない、かつ有効な対象がない場合は通常の処理をさせる。
        if (isTestApply(subject) || filterTargets.length > 0) {
            // 絞った候補からさらにランダムで選択する。
            targets.push(randomTargetFilter(filterTargets));
            return targets;
        }
    }

    // 条件を満たさない場合は元処理実行
    return _Game_Action_targetsForOpponents.apply(this);
};

/**
 * 【独自定義】指定した対象集団の狙われ率合計を求める。
 */
function tgrSumFilter(targets) {
    return targets.reduce(function(r, member) {
        return r + member.tgr;
    }, 0);
}

/**
 * 【独自定義】指定した対象集団から狙われ率に従ってランダムで選択する。
 */
function randomTargetFilter(targets) {
    var tgrRand = Math.random() * tgrSumFilter(targets);
    var target = null;
    targets.forEach(function(member) {
        tgrRand -= member.tgr;
        if (tgrRand <= 0 && !target) {
            target = member;
        }
    });
    return target;
}

/**
 * ●敵の行動有効判定
 * ここで無効にした行動は取らない。
 */
var Game_Enemy_isActionValid = Game_Enemy.prototype.isActionValid;
Game_Enemy.prototype.isActionValid = function(action) {
    // 元処理実行（通常の使用条件判定）
    var ret = Game_Enemy_isActionValid.apply(this, arguments);
    // 使用不可なら、そこで終了
    if (ret == false) {
        return ret;
    }

    // 行動判定の実行を行う場合のみ
    if (isTestApply(this)) {
        // 引数のactionはJSONのパラメータそのままなので、
        // Game_Actionに変換する。
        var gameAction = new Game_Action(this);
        gameAction.setSkill(action.skillId);

        // 既にターン実行中ならば、速度補正技は使用候補から外す。
        if (isResetAction(this) && BattleManager.isInTurn()) {
            if (gameAction.item() && isSpeedException(gameAction)) {
                return false;
            }
        }

        // 使用者が対象
        if (gameAction.isForUser()) {
            // 効果が無効ならば、使用候補から外す。
            if (!gameAction.testApplyEnemy(this)) {
                return false;
            }
            
        // それ以外
        } else {
            // 対象がアクター向けかつ全員無効ならば、使用候補から外す。
            if (gameAction.isForOpponent()
                    && $gameParty.members().every(function(m){return !gameAction.testApplyEnemy(m);})) {
                return false;

            // 対象がエネミー向けかつ全員無効ならば、使用候補から外す。
            } else if (gameAction.isForFriend()
                    && $gameTroop.members().every(function(m){return !gameAction.testApplyEnemy(m);})) {
                return false;
            }
        }
    }

    // 使用可能と認定
    return true;
};

/**
 * 【独自実装】敵行動の有効判定
 * ここでtrueを返した場合に使用可能な行動となる。
 */
Game_Action.prototype.testApplyEnemy = function(target) {
    var subject = this.subject();

    // 対象が戦闘不能の仲間向け
    if (this.isForDeadFriend()) {
        // 蘇生制御を行わない場合は常に有効
        if (!isControlForDead(subject)) {
            return true;
        }
        // 対象が戦闘不能なら有効
        if (target.isDead()) {
            return true;
        }
        // それ以外は無効
        return false;

    // それ以外で対象が戦闘不能（逃走も含む）なら無効
    } else if (!target.isAlive()) {
        return false;
    }

    // ダメージまたは吸収は常に有効
    if (this.isDamage() || this.isDrain()) {
        return true;

    // 回復系の場合
    } else if (this.isRecover()) {
        // 回復制御を行わない場合は常に有効
        if (!isControlRecover(subject)) {
            return true;
        }

        // 効果がHP回復、かつ対象のHPが減っている。
        if (this.isHpRecover() && isRoutineHpRecover(subject, target)) {
            return true;
        // 効果がMP回復、かつ対象のMPが減っている。
        } else if (this.isMpRecover() && isRoutineMpRecover(subject, target)) {
            return true;
        }

    // ダメージタイプがなし
    } else if (this.checkDamageType([0])) {
        // 対象がアクター、かつ使用効果制御を行わない場合は有効
        if (target.isActor() && !isControlActorEffect(subject)) {
            return true;
        // 対象がエネミー、かつ使用効果制御を行わない場合は有効
        } else if (target.isEnemy() && !isControlEnemyEffect(subject)) {
            return true;
        }

        // 使用効果が空（様子を見るなどの何もしない行動）なら有効
        if (this.item().effects.length == 0) {
            return true;
        // 何らかの使用効果が得られるなら有効
        } else if (this.hasItemAnyValidEffects(target)) {
            return true;
        }
    }

    // それ以外は無効と判定
    return false;
};

/**
 * ●使用効果を得られるか？
 */
var _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
Game_Action.prototype.testItemEffect = function(target, effect) {
    // 敵限定
    if (this.subject().isEnemy()) {
        // ステート追加の場合のみ、無効かどうかを判定
        switch (effect.code) {
        case Game_Action.EFFECT_ADD_STATE:
            // 対象の耐性を参照する。
            if (isRoutineWatchResist(this.subject())) {
                // 対象がステート無効である。
                if (target.isStateResist(effect.dataId)) {
                    return false;
                // 行動が必中ではない。かつ、ステート成功率が０
                } else if (!this.isCertainHit() && target.stateRate(effect.dataId) == 0) {
                    return false;
                }
            }
        }
    }

    // 元処理実行
    return _Game_Action_testItemEffect.apply(this, arguments);
};

/**
 * ●バトラーに対する戦闘行動の強制
 */
var Game_Battler_forceAction = Game_Battler.prototype.forceAction;
Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    // 対象が-1（ランダム）の場合、decideRandomTarget()を経由せず、
    // そのまま返すように修正。
    // ここで確定してしまうと対象の補正を行えなくなる。
    if (targetIndex === -1) {
        this.clearActions();
        var action = new Game_Action(this, true);
        action.setSkill(skillId);
        action.setTarget(targetIndex);
        this._actions.push(action);
        return;
    }

    // 元処理実行
    Game_Battler_forceAction.apply(this, arguments);
};

})();
