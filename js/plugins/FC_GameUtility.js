//===============================================================================
// FC_GameUtility.js
//===============================================================================
// (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v 1.2.1) 東方異想符 - ゲームユーティリティ
 * @author FantasticCreative
 *
 * @help ゲームの細々とした動作を変更します。(東方異想符専用)
 *
 * 現在変更可能な箇所は次のとおりです。
 *   ・ゲームオプション - 音量のオフセットを任意調整可能に。
 *
 *   ・アクターステータス - HPやMPなど、アクターの各ステータス最大値を
 *                          変更可能に。
 *                          (最大値がメニューや戦闘画面に収まるか確認すること)
 *
 *   ・エネミーステータス - HPやMPなど、エネミーの各ステータス最大値を
 *                          変更可能に。
 *
 *   ・装備品ステータス - 攻撃力や防御力など、武器・防具の
 *                         各ステータス最大値を変更可能に。
 *
 *   ・最大所持金 - 所持金の最大値を変更可能に。
 *                  (最大値がメニュー画面に収まることを確認すること)
 *
 *   ・アイテム最大所持数 - 所持数の最大値を変更可能に。
 *                          (最大値がメニュー画面に収まることを確認すること)
 *
 *   ・マップ画面での再生効果 - マップシーンで歩くだけで再生効果を
 *                              受けられる設定を切替可能に。
 *
 *   ・メニュー上での回復量増減 - 特徴「薬の知識」による回復量変化をメニュー上で
 *                                反映させるか切替可能に。
 *
 *   ・戦闘報酬 - 特定スイッチがONの間、戦闘の報酬(経験値、お金、アイテム)を
 *                獲得できないようにできます。
 *
 *   ・マップbgm/bgs自動再生 - 特定のスイッチがONの間、マップに設定された
 *                             自動再生bgm/bgsを再生されないようにできます。
 *
 *
 * また以下の動作修正を行います。
 *   // ・MOG_BattleHudのClassic2導入していてフロントビュー戦闘の場合で、
 *   //   アニメーションの位置が「画面」であるスキルを敵が使用したときに
 *   //   アニメーションの位置がズレて表示される問題を修正。
 *   //   これに関連して、アクターがターゲットとなるスキルアニメーションの表示位置を
 *   //   変更可能にしました。
 *   // MOG_BattleHudをアップデートしたため一時無効化
 *
 *   ・マップbgs再生時、別マップに移動してもbgsが鳴り続けるため停止させるように。
 *     (別マップのbgs欄が空の場合)
 *
 *   ・戦闘逃走確率を100%に変更。(逃げられる戦闘の場合)
 *
 *   ・デバフ成功率を100%に。(スキルが命中した場合)
 *
 *   ・パーティがゴールド/アイテムの入手率2倍効果を複数持っていた場合、
 *     効果が加算されるように。
 *
 *   ・装備封印を行うアイテムを装備したとき、装備固定が優先されるように。
 *
 *
 * [データベース:エネミー]のメモ欄で
 * エネミーの各ステータスを個別指定することが可能です。
 * エディタ上では指定できないほど大きいステータスを指定する場合に使います。
 * (ただし最大値は超えられません)
 *
 *   <mhp:XXXX> - エネミーの最大HPを指定します。
 *   <mmp:XXXX> - エネミーの最大MPを指定します。
 *   <atk:XXXX> - エネミーの攻撃力を指定します。
 *   <def:XXXX> - エネミーの防御力を指定します。
 *   <mak:XXXX> - エネミーの魔法攻撃力を指定します。
 *   <mdf:XXXX> - エネミーの魔法防御力を指定します。
 *   <spd:XXXX> - エネミーの敏捷性を指定します。
 *   <luk:XXXX> - エネミーの運を指定します。
 *
 *
 * [データベース:装備品(武器、防具)]のメモ欄で
 * 装備品の各ステータスを個別指定することが可能です。
 * エディタ上では指定できないほど大きいステータスを指定する場合に使います。
 * (ただし最大値は超えられません)
 *
 *   <mhp:XXXX> - 装備することで増減する最大HPを指定します。
 *   <mmp:XXXX> - 装備することで増減する最大MPを指定します。
 *   <atk:XXXX> - 装備することで増減する攻撃力を指定します。
 *   <def:XXXX> - 装備することで増減する防御力を指定します。
 *   <mak:XXXX> - 装備することで増減する魔法攻撃力を指定します。
 *   <mdf:XXXX> - 装備することで増減する魔法防御力を指定します。
 *   <spd:XXXX> - 装備することで増減する敏捷性を指定します。
 *   <luk:XXXX> - 装備することで増減する運を指定します。
 *
 *
 * プラグインパラメータから[解除できないステート]を設定することで、
 * 回復効果によって解除されることのないステートを作る事ができます。
 * (装備していることにより付与される"呪い"ステートなど)
 *
 *
 * プラグインパラメータから[通行不可リージョンID]を設定することで、
 * そのリージョンが設定されたマス上を通行することができなくなります。
 *
 *
 * ゲーム内セルフスイッチのON/OFFを切り替えるための関数を作成しました。
 *
 *   スクリプト:
 *     $gameSelfSwitches.toggle([マップID,イベントID,"セルフスイッチ文字"]);
 *
 * で、指定したマップにあるイベントの
 * セルフスイッチの状態を切り替えられます。
 *
 * 例:$gameSelfSwitches.toggle([353,18,"A"])
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 * スクリプトコマンド:
 *   ありません。
 *
 * ==============================================================================
 *
 * @param max gold
 * @text 最大所持金
 * @desc 所持金の最大値を設定します。(デフォルト=最低値:99999999)
 * @type number
 * @min 99999999
 * @default 99999999
 *
 * @param max item
 * @text 最大アイテム所持数
 * @desc 所持金の最大値を設定します。(デフォルト=最低値:99)
 * @type number
 * @min 99
 * @default 99
 *
 * @param actor status
 * @text 最大アクターステータス
 * @type struct<ActorStatus>
 * @default {"max lv":"99","max hp":"9999","max mp":"9999","max status":"999"}
 *
 * @param enemy status
 * @text 最大エネミーステータス
 * @type struct<EnemyStatus>
 * @default {"max hp":"999999","max mp":"9999","max status":"999"}
 *
 * @param equip status
 * @text 最大装備品ステータス
 * @type struct<EquipStatus>
 * @default {"max hp":"5000","max mp":"5000","max status":"500"}
 *
 * @param animation position
 * @text スキル表示位置オフセット
 * @desc アクターが対象の全体スキルのアニメーション表示位置を調整します。(デフォルト:x=0,y=0)
 * @type struct<Position>
 * @default {"x":"0","y":"0"}
 *
 * @param map regenerate enable
 * @text マップ画面での再生効果
 * @desc マップシーンでの○○再生効果の有効/無効(デフォルト:有効にする)
 * @type boolean
 * @on 有効にする
 * @off 無効にする
 * @default true
 *
 * @param menu recover bonus
 * @text メニューでの回復量増減
 * @desc メニューシーンでの「薬の知識」による回復量増減の有効/無効(デフォルト:有効にする)
 * @type boolean
 * @on 有効にする
 * @off 無効にする
 * @default true
 *
 * @param minimum encount step
 * @text 最低エンカウント歩数
 * @desc 敵とエンカウントする最低歩数を設定します。(デフォルト:10)
 * @type number
 * @default 10
 *
 * @param option setting
 * @text オプション関連設定
 * @type struct<Option>
 * @desc オプション画面に関する設定を行います。
 *
 * @param reward disable
 * @text 報酬無効スイッチ
 * @type switch
 * @desc スイッチがONの間、戦闘の報酬を獲得できないようにします。
 *
 * @param autoPlay bgm/bgs disable
 * @text マップbgm/bgs無効スイッチ
 * @type switch
 * @desc スイッチがONの間、マップの自動再生bgm/bgsを再生されないようにします。
 *
 * @param load map id
 * @text ロード地点マップID
 * @type variable
 * @desc セーブデータをロードした際のマップIDを変数に代入します。
 *
 * @param not possible region
 * @text 通行不可リージョン
 * @type number[]
 * @min 1
 * @max 256
 * @default []
 * @desc 通行することができないリージョンIDを設定します。
*/
/*~struct~ActorStatus:
 * @param max lv
 * @text 最大LV
 * @desc 最大LVの上限を設定します。(デフォルト=最低値:99)
 * @type number
 * @min 99
 *
 * @param max hp
 * @text 最大HP
 * @desc 最大HPの上限を設定します。(デフォルト=最低値:9999)
 * @type number
 * @min 9999
 *
 * @param max mp
 * @text 最大MP
 * @desc 最大MPの上限を設定します。(デフォルト=最低値:9999)
 * @type number
 * @min 9999
 *
 * @param max status
 * @text 最大ステータス
 * @desc 上記以外のステータス値の上限を設定します。(デフォルト=最低値:999)
 * @type number
 * @min 999
 *
*/
/*~struct~EnemyStatus:
 * @param max hp
 * @text 最大HP
 * @desc 最大HPの上限を設定します。(デフォルト=最低値:999999)
 * @type number
 * @min 999999
 *
 * @param max mp
 * @text 最大MP
 * @desc 最大MPの上限を設定します。(デフォルト=最低値:9999)
 * @type number
 * @min 9999
 *
 * @param max status
 * @text 最大ステータス
 * @desc 上記以外のステータス値の上限を設定します。(デフォルト=最低値:999)
 * @type number
 * @min 999
 *
*/
/*~struct~EquipStatus:
 * @param max hp
 * @text 最大HP
 * @desc 最大HPの上限を設定します。(デフォルト=最低値:5000)
 * @type number
 * @min 5000
 *
 * @param max mp
 * @text 最大MP
 * @desc 最大MPの上限を設定します。(デフォルト=最低値:5000)
 * @type number
 * @min 5000
 *
 * @param max status
 * @text 最大ステータス
 * @desc 上記以外のステータス値の上限を設定します。(デフォルト=最低値:500)
 * @type number
 * @min 500
 *
*/
/*~struct~Position:
 * @param x
 * @text x座標
 * @desc x座標を変更します。(プラスで右、マイナスで左)
 * @type number
 * @max 624
 * @min -624
 *
 * @param y
 * @text y座標
 * @desc y座標を変更します。(プラスで下、マイナスで上)
 * @type number
 * @max 816
 * @min -816
 *
*/
/*~struct~Option:
 * @param volume offset
 * @text 音量オフセット
 * @desc 音量変更時、1度に変更可能な音量を設定します。(最終的に0か100になる切りの良い数字を設定すること)
 * @type number
 * @max 100
 * @min 1
 * @default 5
 *
 * @param always dash text
 * @text 常時ダッシュ説明
 * @desc 「常時ダッシュ」オプションの説明テキストを設定します。
 * @default 常にダッシュ移動を行います。
 *
 * @param command remember text
 * @text コマンド記憶説明
 * @desc 「コマンド記憶」オプションの説明テキストを設定します。
 * @default 選択したコマンドを記憶し、次回に復元します。
 *
 * @param bgm volume text
 * @text BGM 音量説明
 * @desc 「BGM 音量」オプションの説明テキストを設定します。
 * @default BGM音量を調整します。
 *
 * @param bgs volume text
 * @text BGS 音量説明
 * @desc 「BGS 音量」オプションの説明テキストを設定します。
 * @default BGS音量を調整します。
 *
 * @param me volume text
 * @text ME 音量説明
 * @desc 「ME 音量」オプションの説明テキストを設定します。
 * @default ME音量を調整します。
 *
 * @param se volume text
 * @text SE 音量説明
 * @desc 「SE 音量」オプションの説明テキストを設定します。
 * @default SE音量を調整します。
 *
 * @param difficulty text
 * @text 難易度説明
 * @desc 「難易度」オプションの説明テキストを設定します。
 * @default ゲーム難易度はゲーム中に変更が可能です。
 *
 * @param difficulty setting
 * @text 難易度設定
 * @type struct<Difficulty>[]
 * @desc 「難易度」オプションの設定を行います。
 *
 * @param pad config text
 * @text ゲームパッドコンフィグ説明
 * @desc 「ゲームパッドコンフィグ」オプションの説明テキストを設定します。
 * @default ゲームパッド使用時の操作方法を変更します。
 *
 * @param key config text
 * @text キーコンフィグ説明
 * @desc 「キーパッドコンフィグ」オプションの説明テキストを設定します。
 * @default キーボード使用時の操作方法を変更します。
 *
 * @param move speed text
 * @text 移動速度説明
 * @desc 「移動速度」オプションの説明テキストを設定します。
 * @default プレイヤーの移動速度を変更します。
 *
 * @param battle animation text
 * @text 戦闘アニメーション説明
 * @desc 「戦闘アニメーション」オプションの説明テキストを設定します。
 * @default 戦闘アニメーションの読み込みを行います。
 *
*/
/*~struct~Difficulty:
 * @param id
 * @text 難易度ID
 * @type number
 * @desc 難易度IDを指定します。(1～)
 * @default 1
 *
 * @param text
 * @text 難易度説明
 * @desc 指定した難易度に対する説明テキストを設定します。
 *
*/

var Imported = Imported || {};
Imported.FC_GameUtility = true;

(function (_global) {
    'use strict';

    const PN = "FC_GameUtility";

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
        "MaxGold" : Number(Parameters["max gold"] || 99999999),
        "MaxItem" : Number(Parameters["max item"] || 99),
        "ActorStatus" : Parameters["actor status"],
        "EnemyStatus" : Parameters["enemy status"],
        "EquipStatus" : Parameters["equip status"],
        "AnimePos" : Parameters["animation position"],
        "mapRegenerate" : Parameters["map regenerate enable"],
        "menuRecoverBonus" : Parameters["menu recover bonus"],
        "minimumEncountStep" : Number(Parameters["minimum encount step"] || 1),
        "VolumeOffset" : Number(Parameters["option setting"]["volume offset"] || 5),
        "alwaysDashText" : Parameters["option setting"]["always dash text"],
        "commandRememberText" : Parameters["option setting"]["command remember text"],
        "bgmVolumeText" : Parameters["option setting"]["bgm volume text"],
        "bgsVolumeText" : Parameters["option setting"]["bgs volume text"],
        "meVolumeText" : Parameters["option setting"]["me volume text"],
        "seVolumeText" : Parameters["option setting"]["se volume text"],
        "difficultyText" : Parameters["option setting"]["difficulty text"],
        "difficulty" : Parameters["option setting"]["difficulty setting"],
        "KEYBOARD_CONFIGText" : Parameters["option setting"]["key config text"],
        "GAMEPAD_CONFIGText" : Parameters["option setting"]["pad config text"],
        "_CBR_moveText" : Parameters["option setting"]["move speed text"],
        "loadBattleAnimeText" : Parameters["option setting"]["battle animation text"],
        "RewardSwitch" : Number(Parameters["reward disable"] || 0),
        "autoPlaySwitch" : Number(Parameters["autoPlay bgm/bgs disable"] || 0),
        "LoadMapId" : Number(Parameters["load map id"] || 0),
        "NotPassRegions" : Parameters["not possible region"],
    };

    let FC_isDatabeseLoaded = false;

    _global.Parameter = _global.Parameter || {};
    _global.Parameter.FC_GameUtility = Params;


    //=========================================================================
    // DataManager
    //  ・エネミーのステータス定義を変更します。
    //
    //=========================================================================
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        let ret;
        ret = _DataManager_isDatabaseLoaded.call(this);

        if(!ret) {
            return false;
        }
        if(FC_isDatabeseLoaded) {
            return true;
        }

        this.enemyDataOverride();
        this.equipDataOverride(true);
        this.equipDataOverride(false);
        FC_isDatabeseLoaded = true;
    };

    DataManager.enemyDataOverride = function() {
        let data, value;
        data = $dataEnemies;

        data.forEach(function(item, i) {
            if(!item) {
                return;
            }
            value = 0;
            Object.keys(item.meta).forEach(function(key) {
                switch(key) {
                    case "mhp" :
                        item.params[0] = Math.min(this[key], Params.EnemyStatus["max hp"]);
                        break;
                    case "mmp" :
                        item.params[1] = Math.min(this[key], Params.EnemyStatus["max mp"]);
                        break;
                    case "atk" :
                        item.params[2] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                    case "def" :
                        item.params[3] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                    case "mat" :
                        item.params[4] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                    case "mdf" :
                        item.params[5] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                    case "spd" :
                        item.params[6] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                    case "luk" :
                        item.params[7] = Math.min(this[key], Params.EnemyStatus["max status"]);
                        break;
                }
            }, item.meta);
        }, this);
    };

    DataManager.equipDataOverride = function(isWeapon) {
        let data, value;
        data = isWeapon ? $dataWeapons : $dataArmors;

        data.forEach(function(item, i) {
            if(!item) {
                return;
            }
            value = 0;
            Object.keys(item.meta).forEach(function(key) {
                switch(key) {
                    case "mhp" :
                        item.params[0] = Math.min(this[key], Params.EquipStatus["max hp"]);
                        break;
                    case "mmp" :
                        item.params[1] = Math.min(this[key], Params.EquipStatus["max mp"]);
                        break;
                    case "atk" :
                        item.params[2] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                    case "def" :
                        item.params[3] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                    case "mat" :
                        item.params[4] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                    case "mdf" :
                        item.params[5] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                    case "spd" :
                        item.params[6] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                    case "luk" :
                        item.params[7] = Math.min(this[key], Params.EquipStatus["max status"]);
                        break;
                }
            }, item.meta);
        }, this);
    };


    //=========================================================================
    // BattleManager
    //  ・戦闘逃走確率を再定義します。
    //  ・特定スイッチがONのとき、リワードを獲得できないようにします。
    //
    //=========================================================================
    BattleManager.makeEscapeRatio = function() {
        this._escapeRatio = 1.0;
    };

    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function() {
        let disableSwitch = Params.RewardSwitch;
        this._rewards = {};
        this._rewards.gold = 0;
        this._rewards.exp = 0;
        this._rewards.items = [];
        if(!(disableSwitch > 0 && $gameSwitches.value(disableSwitch))) {
            _BattleManager_makeRewards.call(this);
        }
    };


    //=========================================================================
    // Game_SelfSwitches
    //  ・スイッチ状態を切り替える関数を定義します。
    //
    //=========================================================================
    Game_SelfSwitches.prototype.toggle = function(key) {
        let flag;
        flag = this.value(key);

        this.setValue(key, !flag);
    };


    //=========================================================================
    // Game_Party
    //  ・所持金とアイテム所持数の最大値を再定義します。
    //
    //=========================================================================
    Game_Party.prototype.maxGold = function() {
        return Params.MaxGold;
    };

    Game_Party.prototype.maxItems = function(item) {
        return Params.MaxItem;
    };


    //=========================================================================
    // Game_CharacterBase
    //  ・キャラクターの移動可能判定を再定義します。
    //
    //=========================================================================
    const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        let result = _Game_CharacterBase_canPass.apply(this, arguments);
        let x2 = $gameMap.roundXWithDirection(x, d);
        let y2 = $gameMap.roundYWithDirection(y, d);
        let regionId = $gameMap.regionId(x2, y2);

        if(Params.NotPassRegions.contains(regionId)) {
            return false;
        }

        return result;
        // var x2 = $gameMap.roundXWithDirection(x, d);
        // var y2 = $gameMap.roundYWithDirection(y, d);
        // if (!$gameMap.isValid(x2, y2)) {
        //     return false;
        // }
        // if (this.isThrough() || this.isDebugThrough()) {
        //     return true;
        // }
        // if (!this.isMapPassable(x, y, d)) {
        //     return false;
        // }
        // if (this.isCollidedWithCharacters(x2, y2)) {
        //     return false;
        // }
        // return true;
    };


    //=========================================================================
    // Game_Player
    //  ・敵とのエンカウント歩数算出処理を再定義します。
    //
    //=========================================================================
    const _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    Game_Player.prototype.makeEncounterCount = function() {
        _Game_Player_makeEncounterCount.call(this);
        let n = $gameMap.encounterStep();
        this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + Params.minimumEncountStep;
    };


    //=========================================================================
    // Game_BattlerBase
    //  ・エネミーステータスの最大値を再定義します。
    //
    //=========================================================================
    Game_BattlerBase.prototype.paramMax = function(paramId) {
        if (paramId === 0) {
            return Params.EnemyStatus["max hp"];
        } else if (paramId === 1) {
            return Params.EnemyStatus["max mp"];
        } else {
            return Params.EnemyStatus["max status"];
        }
    };


    //=========================================================================
    // Game_Battler
    //  ・自動回復の処理を再定義します。
    //
    //=========================================================================
    const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        let rate, rate2, value;
        if(!$gameParty.inBattle() && !Params.mapRegenerate && this) {
            rate = this.states().reduce(function(r, state){
                rate2 = state.traits.reduce(function(r,trait) {
                    return r + (trait.code == 22 && trait.dataId == 7 && trait.value < 0) ? trait.value : 0;
                }, 0);
                return r + rate2;
            }, 0);
            value = Math.floor(this.mhp * rate);
            value = Math.max(value, -this.maxSlipDamage());
            if (value !== 0) {
                this.gainHp(value);
            }
            return ;
        }
        _Game_Battler_regenerateAll.call(this);
    };


    //=========================================================================
    // Game_Actor
    //  ・アクターステータスの最大値を再定義します。
    //
    //=========================================================================
    Game_Actor.prototype.paramMax = function(paramId) {
        if (paramId === 0) {
            return Params.ActorStatus["max hp"];
        } else if (paramId === 1) {
            return Params.ActorStatus["max mp"];
        } else {
            return Params.ActorStatus["max status"];
        }
    };

    Game_Actor.prototype.maxLevel = function() {
        return Params.ActorStatus["max lv"];
    };

    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        if (this.level > 99) {
          var i = this.currentClass().params[paramId][99];
          var j = this.currentClass().params[paramId][98];
          i += (i - j) * (this.level - 99);
          return i;
        }
        return _Game_Actor_paramBase.call(this, paramId);
    };

    // 再定義
    Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
        for (;;) {
            var slots = this.equipSlots();
            var equips = this.equips();
            var changed = false;
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
                if (item && (!this.canEquip(item) || item.etypeId !== slots[i]) && !this.isEquipTypeLocked(item.etypeId)) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    };

    //=========================================================================
    // Game_Enemy
    //  ・アイテムドロップレートを再定義します。
    //
    //=========================================================================
    const _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;
    Game_Enemy.prototype.dropItemRate = function() {
        let result, double;

        result = _Game_Enemy_dropItemRate.call(this);
        if(result > 1) {
            result = $gameParty.battleMembers().reduce(function(r, actor) {
                double = actor.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE) ? 2 : 0;

                // アクター「霧雨魔理沙」が防具「ドロップの指輪」を装備しているとき、
                // 魔理沙自身の能力「アイテムドロップ率2倍」を加算する。
                if(actor.actorId() === 2 && actor.isEquipped($dataArmors[64])) {
                    double += 2;
                }

                return r + double;
            }, 0);
        }

        return result;
    };


    //=========================================================================
    // Game_Troop
    //  ・ゴールドドロップレートを再定義します。
    //    (Vitsuno_Difficultyに処理を移動)
    //
    //=========================================================================
    // const _Game_Troop_goldRate = Game_Troop.prototype.goldRate;
    // Game_Troop.prototype.goldRate = function() {
    //     let result, double;

    //     result = _Game_Troop_goldRate.call(this);
    //     if(result > 1) {
    //         result = $gameParty.battleMembers().reduce(function(r, actor) {
    //             double = actor.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE) ? 2 : 0;
    //             return r + double;
    //         }, 0);
    //     }

    //     return result;
    // };


    //=========================================================================
    // Game_Action
    //  ・回復量を定義します。
    //  ・スキル成功率計算処理を再定義します。
    //
    //=========================================================================
    Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
        var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem() && ($gameParty.inBattle() || Params.menuRecoverBonus)) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainHp(value);
            this.makeSuccess(target);
        }
    };

    Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
        var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem() && ($gameParty.inBattle() || Params.menuRecoverBonus)) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainMp(value);
            this.makeSuccess(target);
        }
    };

    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        // var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        // if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        // }
    };


    //=========================================================================
    // Game_Map
    //  ・マップbgsを引き継がないように再定義します。
    //  ・マップIDが格納された変数に対する操作を定義します。
    //  ・特定のスイッチがONのとき、自動再生bgm/bgsを再生しないように再定義します。
    //=========================================================================
    const _Game_Map_autoplay = Game_Map.prototype.autoplay;
    Game_Map.prototype.autoplay = function() {
        let disableSwitch = Params.autoPlaySwitch;
        if(disableSwitch > 0 && $gameSwitches.value(disableSwitch)) {
            return ;
        }
        _Game_Map_autoplay.call(this);
        if(AudioManager._currentBgs || AudioManager._bgsBuffer) {
            if($dataMap && $dataMap.bgs && $dataMap.bgs.name == "") {
                AudioManager.stopBgs();
            }
        }
    };

    Game_Map.prototype.hasLoadMapId = function(mapId) {
        if(Params.LoadMapId < 1) {
            return false;
        }

        if($gameVariables.value(Params.LoadMapId) != mapId) {
            return false;
        }

        return true;
    }

    Game_Map.prototype.resetLoadMapId = function(mapId) {
        if(Params.LoadMapId < 1) {
            return ;
        }
        if($gameVariables.value(Params.LoadMapId) == mapId) {
            $gameVariables.setValue(Params.LoadMapId, 0);
        }
    }

    //=========================================================================
    // Window_Options
    //  ・音量の振れ幅を再定義します。
    //
    //=========================================================================
    Window_Options.prototype.volumeOffset = function() {
        return Params.VolumeOffset;
    };


    //=========================================================================
    // Window_ItemList
    //  ・アイテムの最大所持数を再定義します。
    //
    //=========================================================================
    Window_ItemList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth - this.textWidth(':'));
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_ItemList.prototype.numberWidth = function() {
        return this.textWidth(String(Params.MaxItem));
    };

    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.numberWidth(), 'right');
            this.drawText($gameParty.numItems(item), x, y, width, 'right');
        }
    };


    //=========================================================================
    // Sprite_Animation
    //  ・MOG_BattleHud導入時のアニメーション表示位置を再定義します。
    //
    //=========================================================================
    // const _Sprite_Animation_updatePosition = Sprite_Animation.prototype.updatePosition;
    // Sprite_Animation.prototype.updatePosition = function() {
    //     if(!Imported.MOG_BattleHud || this._animation.position !== 3 || $gameSystem.isSideView()) {
    //         _Sprite_Animation_updatePosition.call(this);
    //         return;
    //     }

    //     let width, height;
    //     width = this.parent.width || Graphics.width;
    //     height = this.parent.height || Graphics.height;

    //     if(this._target.parent.constructor === Sprite_Actor) {
    //         this.x = width / 2 + Params.AnimePos.x;
    //         this.y = height / 2 + Params.AnimePos.y;
    //     } else {
    //         this.x = width / 2;
    //         this.y = height / 2;
    //     }
    // };


    //=========================================================================
    // Scene_Options
    //  ・オプション画面にヘルプウィンドウを表示させます。
    //
    //=========================================================================
    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this.createHelpWindow();

        this._optionsWindow.setHelpWindow(this._helpWindow);
    };

    Scene_Options.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(1);
        this.addWindow(this._helpWindow);
    };


    //=========================================================================
    // Widnow_Options
    //  ・オプションウィンドウとヘルプウィンドウを連動させます。
    //
    //=========================================================================
    Window_Options.prototype.updateHelp = function() {
        let text, symbol;
        symbol = this.currentSymbol();
        text = Params[symbol + "Text"];

        if(symbol === "difficulty" && SceneManager.isPreviousScene(Scene_Menu)) {
            text = getDifficultyText();
        }

        if(this._helpWindow) {
            this._helpWindow.setText(text);
        }
    };


    //=========================================================================
    // Scene_Load
    //  ・ロード成功時、マップIDを変数に格納する機能を追加定義します。
    //
    //=========================================================================
    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess
    Scene_Load.prototype.onLoadSuccess = function() {
        if(Params.LoadMapId > 0) {
            $gameVariables.setValue(Params.LoadMapId, $gameMap.mapId());
        }
        _Scene_Load_onLoadSuccess.call(this);
    };


    //=========================================================================
    // ユーティリティ
    //  ・汎用的な関数を定義します。
    //
    //=========================================================================
    // 難易度に対する説明テキストを取得します。
    const getDifficultyText = function() {
        let difficulty, difficultyId, i, cnt;
        difficultyId = $gameSystem.difficultyId();
        cnt = Object.keys(Params.difficulty).length;

        for(i = 0; i < cnt; i++) {
            difficulty = Params.difficulty[i];
            if(difficulty.id === difficultyId) {
                return difficulty.text;
            }
        }

        return null;
    };

})(this);