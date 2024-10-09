//=============================================================================
// StateRingIcon.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2019/10/14 MOG_BattleHud.jsと併用したときもアイコンごとにターン数表示の有無が反映されるよう競合解消
// 2.0.0 2019/09/15 アイコンごとにターン数表示の有無を設定できる機能を追加
//                  パラメータ構造の変更(パラメータの再設定が必要です)
// 1.8.0 2019/08/12 味方に掛けられたステートもリング表示できる機能を追加
// 1.7.0 2019/07/15 他のプラグインとの競合対策でターン数の表示値を補正できる機能を追加
// 1.6.1 2018/12/07 1.6.0で一部処理に誤りがあったので修正
// 1.6.0 2018/12/06 BMSP_StateDisplayExtension.jsと共存できる機能を追加
// 1.5.2 2018/09/10 StateRolling.jsとの連携時、アクターのアイコン表示はStateRolling.jsを優先するよう修正
// 1.5.1 2018/08/30 StateRolling.jsとの競合を解消
// 1.5.0 2018/06/17 パラメータの型指定機能に対応
//                  ステートの解除タイミングが「行動終了時」の場合の表示ターン数を1加算しました。
// 1.4.1 2018/06/10 1.4.0の修正でステートアイコンが変化したときに常に先頭のターンが表示される問題を修正
// 1.4.0 2018/06/04 Battle_Hud使用時にも味方のステートターン数が表示される機能を追加
// 1.3.3 2018/03/11 YEP_BuffsStatesCore.jsとの競合を解消
// 1.3.2 2017/06/22 一度に複数のステートが解除された場合に一部アイコンが正しく消去されない問題を修正
// 1.3.1 2017/05/05 残りターン数のフォントサイズ指定機能を追加
// 1.3.0 2017/05/05 味方の残りターン数も表示する機能を追加
// 1.2.1 2017/05/05 1.2.0の機能でプラグイン等の機能により残りターン数が小数になった場合に切り上げする仕様を追加
// 1.2.0 2017/05/04 ステートおよびバフの残りターン数を表示する機能を追加
// 1.1.0 2017/02/28 ステートアイコンを横に並べる機能を追加。ステート数によって演出を分けることもできます。
// 1.0.0 2016/08/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Ring State Plugin
 * @author triacontane
 *
 * @param RadiusX
 * @desc 横方向の半径の値です。
 * @default 64
 * @type number
 *
 * @param RadiusY
 * @desc 縦方向の半径の値です。
 * @default 16
 * @type number
 *
 * @param CycleDuration
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。0に指定すると回転しなくなります。
 * @default 60
 * @type number
 *
 * @param LineViewLimit
 * @desc ステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 *
 * @param Reverse
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default false
 * @type boolean
 *
 * @param IconSpacing
 * @text アイコン間隔
 * @desc ステートアイコン同士の間隔を調整します。デフォルトは0です。
 * @default 0
 * @type number
 * @min 0
 * @max 1000
 *
 * @param ShowTurnCount
 * @desc ステートの残りターン数を表示します。
 * @default true
 * @type boolean
 *
 * @param IconIndexWithoutShowTurns
 * @desc ステートターン数の表示対象外になる「アイコンインデックス」です。
 * @default []
 * @type string[]
 *
 * @param TurnCountX
 * @desc ターン数のX座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnCountY
 * @desc ターン数のY座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnAdjustment
 * @desc ターン数の表示値を補正します。他のプラグインとの組み合わせで数値がズレる場合にのみ変更してください。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param ShowActorTurnCount
 * @desc 味方のステートの残りターン数を表示します。使用しているプラグイン次第で動作しない場合もあります。
 * @default true
 * @type boolean
 *
 * @param ActorRingIcon
 * @desc 味方のステートアイコンもリング表示にします。
 * @default false
 * @type boolean
 *
 * @param ActorRingIconX
 * @desc 味方のステートアイコンのX座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param ActorRingIconY
 * @desc 味方のステートアイコンのY座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param FontSize
 * @desc 残りターン数表示のフォントサイズです。
 * @default 32
 * @type number
 *
 * @help 敵キャラのステートが複数有効になった場合のステートアイコンを時計回りに
 * 回転させてリング表示したり一列に並べて表示したりできます。
 *
 * また、各ステートの残りターンを表示することもできます。
 * ・ステート解除のタイミングが「なし」でない場合のみ表示されます。
 * ・コアスクリプトで管理しているターン数の都合上、ステート解除のタイミングが
 * 　「行動終了時」の場合、設定したターン数よりも1大きい数から表示されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */

/*:ja
 * @plugindesc リングステートプラグイン 2.0.1 custom 1
 * @author トリアコンタン
 *
 * @param RadiusX
 * @text X半径
 * @desc 横方向の半径の値です。(Default:64)
 * @default 64
 * @type number
 *
 * @param RadiusY
 * @text Y半径
 * @desc 縦方向の半径の値です。(Default:16)
 * @default 16
 * @type number
 *
 * @param CycleDuration
 * @text 周期
 * @desc アイコンが一周するのに掛かる時間(フレーム数)です。0に指定すると回転しなくなります。
 * @default 60
 * @type number
 *
 * @param LineViewLimit
 * @text 一列配置上限
 * @desc ステート数がこの値以下の場合はリングアイコンではなく1列で表示されます。0にすると常に1列表示になります。
 * @default 1
 * @type number
 *
 * @param Reverse
 * @text 反時計回り
 * @desc 回転方向が反時計回りになります。(Default:OFF)
 * @default false
 * @type boolean
 *
 * @param IconSpacing
 * @text アイコン間隔
 * @desc ステートアイコン同士の間隔を調整します。デフォルトは0です。
 * @default 0
 * @type number
 * @min 0
 * @max 1000
 *
 * @param ShowTurnCount
 * @text ターン数表示
 * @desc ステートの残りターン数を表示します。
 * @default true
 * @type boolean
 *
 * @param IconIndexWithoutShowTurns
 * @text ターン数表示対象外アイコン
 * @desc ステートターン数の表示対象外になる「アイコンインデックス」です。
 * @default []
 * @type string[]
 *
 * @param TurnCountX
 * @text ターン数X座標
 * @desc ターン数のX座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnCountY
 * @text ターン数Y座標
 * @desc ターン数のY座標表示位置を調整します。デフォルトはアイコンの右下になります。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param TurnAdjustment
 * @text ターン数補正
 * @desc ターン数の表示値を補正します。他のプラグインとの組み合わせで数値がズレる場合にのみ変更してください。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param ShowActorTurnCount
 * @text 味方ターン数表示
 * @desc 味方のステートの残りターン数を表示します。使用しているプラグイン次第で動作しない場合もあります。
 * @default true
 * @type boolean
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc 残りターン数表示のフォントサイズです。
 * @default 32
 * @type number
 *
 * @param ActorRingIcon
 * @text 味方リングアイコン
 * @desc 味方のステートアイコンもリング表示にします。
 * @default false
 * @type boolean
 *
 * @param ActorRingIconX
 * @text 味方リングアイコンX座標
 * @desc 味方のステートアイコンのX座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @param ActorRingIconY
 * @text 味方リングアイコンY座標
 * @desc 味方のステートアイコンのY座標です。
 * @default 0
 * @type number
 * @min -1000
 * @max 1000
 *
 * @help 敵キャラのステートが複数有効になった場合のステートアイコンを時計回りに
 * 回転させてリング表示したり一列に並べて表示したりできます。
 *
 * また、各ステートの残りターンを表示することもできます。
 * ・ステート解除のタイミングが「なし」でない場合のみ表示されます。
 * ・コアスクリプトで管理しているターン数の都合上、ステート解除のタイミングが
 * 　「行動終了時」の場合、設定したターン数よりも1大きい数から表示されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * Sprite_StateIconChild
 * ステートアイコンを回転表示させるためのクラスです。
 * @constructor
 */
function Sprite_StateIconChild() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('StateRingIcon');
    param.IconIndexWithoutShowTurns = (param.IconIndexWithoutShowTurns || []).map(function(index) {
        return parseInt(index);
    });

    //=============================================================================
    // Game_BattlerBase
    //  ステートの残りターン数を取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getStateTurns = function() {
        var stateTurns = this.states().map(function(state) {
            if (state.iconIndex <= 0) {
                return null;
            } else if (state.autoRemovalTiming <= 0) {
                return '';
            } else {
                return Math.ceil(this._stateTurns[state.id]) + (state.autoRemovalTiming === 1 ? 1 : 0);
            }
        }, this);
        return stateTurns.filter(function(turns) {
            return turns !== null;
        });
    };

    Game_BattlerBase.prototype.getBuffTurns = function() {
        return this._buffTurns.filter(function(turns, index) {
            return this._buffs[index] !== 0;
        }, this);
    };

    Game_BattlerBase.prototype.getAllTurns = function() {
        return this.getStateTurns().concat(this.getBuffTurns()).map(function(turn) {
            return turn + param.TurnAdjustment;
        });
    };

    if (param.ActorRingIcon) {
        var _Sprite_Actor_createStateSprite = Sprite_Actor.prototype.createStateSprite;
        Sprite_Actor.prototype.createStateSprite = function() {
            _Sprite_Actor_createStateSprite.apply(this, arguments);
            this._stateSprite = new Sprite_StateIcon();
            this._stateSprite.x = param.ActorRingIconX;
            this._stateSprite.y = param.ActorRingIconY;
            this._mainSprite.addChild(this._stateSprite);
        };
    }

    //=============================================================================
    // Sprite_StateIcon
    //  ステートアイコンを回転させます。
    //=============================================================================
    var _Sprite_StateIcon_initMembers      = Sprite_StateIcon.prototype.initMembers;
    Sprite_StateIcon.prototype.initMembers = function() {
        _Sprite_StateIcon_initMembers.apply(this, arguments);
        this._icons        = [];
        this._iconsSprites = [];
    };

    var _Sprite_StateIcon_update      = Sprite_StateIcon.prototype.update;
    Sprite_StateIcon.prototype.update = function() {
        if (this._battler && !this.hasRingState()) {
            _Sprite_StateIcon_update.apply(this, arguments);
            return;
        }
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.getCycleDuration()) {
            this._animationCount = 0;
        }
        this.updateRingIcon();
    };

    Sprite_StateIcon.prototype.updateRingIcon = function() {
        var icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons();
        }
        if (!this._icons.equals(icons)) {
            this._icons = icons;
            this.setupRingIcon();
        }
        if (this._iconsSprites.length > param.LineViewLimit && param.LineViewLimit > 0) {
            this.updateRingPosition();
        } else {
            this.updateNormalPosition();
        }
        if (this._battler && param.ShowTurnCount) {
            this.updateTurns();
        }
        this._sortChildren();
    };

    Sprite_StateIcon.prototype.updateRingPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setRingPosition(this.getIconRadian(index));
        }, this);
    };

    Sprite_StateIcon.prototype.updateNormalPosition = function() {
        this._iconsSprites.forEach(function(sprite, index) {
            sprite.setNormalPosition(index, this._iconsSprites.length);
        }, this);
    };

    Sprite_StateIcon.prototype.updateTurns = function() {
        var turns = this._battler.getAllTurns();
        this._icons.forEach(function(icon, index) {
            this._iconsSprites[index].setIconTurn(turns[index]);
        }, this);
    };

    Sprite_StateIcon.prototype.getIconRadian = function(index) {
        var radian = (this._animationCount / this.getCycleDuration() + index / this._iconsSprites.length) * Math.PI * 2;
        if (param.Reverse) radian *= -1;
        return radian;
    };

    Sprite_StateIcon.prototype.getCycleDuration = function() {
        return param.CycleDuration || Infinity;
    };

    Sprite_StateIcon.prototype.setupRingIcon = function() {
        this._icons.forEach(function(icon, index) {
            if (!this._iconsSprites[index]) this.makeNewIcon(index);
            this._iconsSprites[index].setIconIndex(icon);
        }, this);
        var spriteLength = this._iconsSprites.length;
        for (var i = this._icons.length; i < spriteLength; i++) {
            this.popIcon();
        }
    };

    Sprite_StateIcon.prototype.makeNewIcon = function(index) {
        var iconSprite            = new Sprite_StateIconChild();
        this._iconsSprites[index] = iconSprite;
        this.addChild(iconSprite);
    };

    Sprite_StateIcon.prototype.popIcon = function() {
        var removedSprite = this._iconsSprites.pop();
        this.removeChild(removedSprite);
    };

    Sprite_StateIcon.prototype._sortChildren = function() {
        this.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_StateIcon.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    Sprite_StateIcon.prototype.hasRingState = function() {
        return this._battler.isEnemy() || param.ActorRingIcon
    };

    //=============================================================================
    // Sprite_StateIconChild
    //=============================================================================
    Sprite_StateIconChild.prototype             = Object.create(Sprite_StateIcon.prototype);
    Sprite_StateIconChild.prototype.constructor = Sprite_StateIconChild;

    Sprite_StateIconChild.prototype.initialize = function() {
        Sprite_StateIcon.prototype.initialize.call(this);
        this.visible     = false;
        this._turnSprite = null;
        this._turn       = 0;
    };

    Sprite_StateIconChild.prototype.update = function() {};

    Sprite_StateIconChild.prototype.setIconIndex = function(index) {
        this._iconIndex = index;
        this.updateFrame();
    };

    Sprite_StateIconChild.prototype.setIconTurn = function(turn) {
        this.makeTurnSpriteIfNeed();
        if (this._turn === turn) return;
        this._turn = turn;
        this.refreshIconTurn();
    };

    Sprite_StateIconChild.prototype.refreshIconTurn = function() {
        var bitmap = this._turnSprite.bitmap;
        bitmap.clear();
        if (param.IconIndexWithoutShowTurns.contains(this._iconIndex)) {
            return;
        }
        bitmap.drawText(this._turn, 0, 0, bitmap.width, bitmap.height, 'center');
    };

    Sprite_StateIconChild.prototype.makeTurnSpriteIfNeed = function() {
        if (this._turnSprite) return;
        var sprite             = new Sprite();
        sprite.bitmap          = new Bitmap(Sprite_StateIcon._iconWidth, Sprite_StateIcon._iconHeight);
        sprite.bitmap.fontSize = param.FontSize;
        sprite.x               = param.TurnCountX;
        sprite.y               = param.TurnCountY;
        this._turnSprite       = sprite;
        this.addChild(this._turnSprite);
    };

    Sprite_StateIconChild.prototype.setRingPosition = function(radian) {
        this.x       = Math.cos(radian) * param.RadiusX;
        this.y       = Math.sin(radian) * param.RadiusY;
        this.visible = true;
    };

    Sprite_StateIconChild.prototype.setNormalPosition = function(index, max) {
        // this.x       = ((-max + 1) / 2 + index) * Sprite_StateIcon._iconWidth;
        this.x       = ((-max + 1) / 2 + index) * Sprite_StateIcon._iconWidth + index * param.IconSpacing;
        this.y       = 0;
        this.visible = true;
    };

    //=============================================================================
    // Window_BattleStatus
    //  味方の残りターン数を表示します。
    //=============================================================================
    if (param.ShowActorTurnCount && !param.ActorRingIcon) {
        var _Window_BattleStatus_drawActorIcons      = Window_BattleStatus.prototype.drawActorIcons;
        Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
            this._drawIconIndexList = [];
            _Window_BattleStatus_drawActorIcons.apply(this, arguments);
            if (this.areaManager) {
                this.drawActorIconsTurnForBmsp(actor);
            } else {
                this.drawActorIconsTurn(actor, x, y);
            }
        };

        Window_BattleStatus.prototype.drawActorIconsTurn = function(actor, x, y) {
            var turns              = actor.getAllTurns();
            this.contents.fontSize = param.FontSize;
            for (var i = 0; i < this._drawIconIndexList.length; i++) {
                if (!param.IconIndexWithoutShowTurns.contains(this._drawIconIndexList[i])) {
                    var iconX = x + Window_Base._iconWidth * i;
                    var iconY = y + 2;
                    this.drawText(turns[i], iconX, iconY, Window_Base._iconWidth, 'right');
                }
            }
            this.resetFontSettings();
            this._drawIconIndexList = undefined;
        };

        Window_BattleStatus.prototype.drawActorIconsTurnForBmsp = function(actor) {
            var turns       = actor.getAllTurns();
            var areaName    = 'stateIcons_actor' + actor.actorId();
            var area        = this.areaManager.getArea(areaName);
            var pw          = Window_Base._iconWidth;
            var ph          = Window_Base._iconHeight;
            var column      = Math.floor(144 / pw);
            var icons       = actor.allIcons();
            var panelHeader = 'stateIcons' + icons.join('-') + '_';
            for (var i = 0; i < turns.length; i++) {
                var panelName = panelHeader + Math.floor(i / column);
                var panel      = area.getPanel(panelName);
                panel.bitmap.fontSize = param.FontSize;
                panel.bitmap.drawText(String(turns[i]), pw * (i % column), 0, pw, ph, 'right');
                area.removePanel(panelName, true);
            }
            area.lazyCommit();
            this._drawIconIndexList = undefined;
        };

        var _Window_BattleStatus_drawIcon      = Window_BattleStatus.prototype.drawIcon;
        Window_BattleStatus.prototype.drawIcon = function(iconIndex, x, y) {
            _Window_BattleStatus_drawIcon.apply(this, arguments);
            if (this._drawIconIndexList !== undefined) {
                this._drawIconIndexList.push(iconIndex);
            }
        };

        if (typeof Battle_Hud !== 'undefined') {
            var _Battle_Hud_create_states      = Battle_Hud.prototype.create_states;
            Battle_Hud.prototype.create_states = function() {
                if (String(Moghunter.bhud_states_visible) !== 'true') {
                    return;
                }
                this.removeChild(this._state_icon_turn);
                if (!this._battler) {
                    return;
                }
                this._state_icon_turn                 = new Sprite(new Bitmap(Window_Base._iconWidth, Window_Base._iconHeight));
                this._state_icon_turn.x               = this._pos_x + Moghunter.bhud_states_pos_x;
                // this._state_icon_turn.y               = this._pos_y + Moghunter.bhud_states_pos_y;
                this._state_icon_turn.y               = this._pos_y + Moghunter.bhud_states_pos_y + 6;
                this._state_icon_turn.bitmap.fontSize = param.FontSize;
                _Battle_Hud_create_states.apply(this, arguments);
                this.addChild(this._state_icon_turn);
            };

            var _Battle_Hud_refresh_states      = Battle_Hud.prototype.refresh_states;
            Battle_Hud.prototype.refresh_states = function() {
                var turn = this._battler.getAllTurns()[this._states_data[1]];
                _Battle_Hud_refresh_states.apply(this, arguments);
                this._state_icon_turn.bitmap.clear();
                if (turn && !param.IconIndexWithoutShowTurns.contains(this._states_data[0])) {
                    this._state_icon_turn.bitmap.drawText(turn, 0, 0, Window_Base._iconWidth, Window_Base._iconHeight, 'right');
                }
            };
        }
    }
})();

