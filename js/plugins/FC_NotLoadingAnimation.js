//===============================================================================
// FC_NotLoadingAnimation.js
//===============================================================================
// (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v1.0.0) アニメーションロード切り替えプラグイン
 * @author FantasticCreative
 *
 * @help = アニメーションの読み込みを行うか、
 * オプション画面から切り替えることができるようになります。
 *
 *
 * 簡単な使い方説明:
 *
 *
 * メモ欄_基本設定:
 *
 *
 * メモ欄_オプション(各オプションはスペースで区切る):
 *
 *
 * メモ欄の設定例:
 *
 *
 * プラグインパラメーター:
 *   ありません。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 * ==============================================================================
 *
 * @param animation loading switch
 * @desc 戦闘アニメーションの読み込みを制御するスイッチです。スイッチONで読み込みを行います。
 * @type switch
 * @default 0
 *
 * @param animation loading option name
 * @desc オプション画面に表示させる項目文字列です。
 * @default 戦闘アニメーション
 *
 * @param animation loading default
 * @desc 戦闘アニメーション読込設定のデフォルト値を指定します。
 * @type select
 * @option ON
 * @value 1
 * @option Off
 * @value 0
 * @default 1
 *
*/

var Imported = Imported || {};
Imported.FC_NotLoadingAnimation = true;

(function () {
    'use strict';

    const PN = "FC_NotLoadingAnimation";

    const paramParse = function (obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    const paramReplace = function (key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const Parameters = paramParse(PluginManager.parameters(PN));

    const Params = {
        "AnimeLoadSwitch": Number(Parameters["animation loading switch"]),
        "AnimeLoadName": Parameters["animation loading option name"],
        "AnimeLoadDefault": Number(Parameters["animation loading default"]),
    };


    //=========================================================================
    // ConfigManager
    //  ・追加オプションを定義します。
    //
    //=========================================================================
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        let config;
        config = _ConfigManager_makeData.call(this);

        config.loadBattleAnime = this.loadBattleAnime;

        return config;
    };

    let _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.call(this, config);

        if (config["loadBattleAnime"] !== undefined) {
            this.loadBattleAnime = this.readFlag(config, "loadBattleAnime");
        } else {
            this.loadBattleAnime = Params.AnimeLoadDefault;
        }

    };

    let _ConfigManager_save = ConfigManager.save;
    ConfigManager.save = function () {
        _ConfigManager_save.call(this);

        this.exportCustomConfig();
    };

    ConfigManager.exportCustomConfig = function () {
        $gameSwitches.setValue(Params.AnimeLoadSwitch, !!this.loadBattleAnime);
    };

    ConfigManager.importCustomConfig = function () {
        this.loadBattleAnime = $gameSwitches.value(Params.AnimeLoadSwitch);
    };


    //=============================================================================
    // DataManager
    //  ・追加オプションの同期処理を定義します。
    //=============================================================================
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);

        ConfigManager.exportCustomConfig();
    };

    const _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function (savefileId) {
        let result;
        result = _DataManager_loadGameWithoutRescue.call(this, savefileId);

        ConfigManager.exportCustomConfig();

        return result;
    };


    //=========================================================================
    // Window_Options
    //  ・追加オプションを定義します。
    //
    //=========================================================================
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addCustomOptions();
    };

    // const _Window_Options_addCustomOptions = Window_Options.prototype.addCustomOptions;
    Window_Options.prototype.addCustomOptions = function () {
        let command_enable;
        command_enable = !SceneManager.isPreviousScene(Scene_Title);

        // _Window_Options_addCustomOptions.apply(this, arguments);

        this.addCommand(Params.AnimeLoadName, 'loadBattleAnime', command_enable);
    };

    const _Window_Options_changeValue = Window_Options.prototype.changeValue;
    Window_Options.prototype.changeValue = function (symbol, value) {
        let index;
        index = this.findSymbol(symbol);

        if (this.isCommandEnabled(index)) {
            _Window_Options_changeValue.apply(this, arguments);
        } else {
            this.playBuzzerSound();
            return;
        }
    };


    //=============================================================================
    // Game_Map
    //  ・追加オプションの同期処理を定義します。
    //=============================================================================
    const _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function () {
        _Game_Map_refresh.call(this);

        ConfigManager.importCustomConfig();
    };


    //=============================================================================
    // Game_Battler
    //  ・アニメーションの処理を再定義します。
    //=============================================================================
    const _Game_Battler_startAnimation = Game_Battler.prototype.startAnimation;
    Game_Battler.prototype.startAnimation = function (animationId, mirror, delay) {
        if (ConfigManager.loadBattleAnime) {
            _Game_Battler_startAnimation.apply(this, arguments);
        }
    };


    //=============================================================================
    // Game_CharacterBase
    //  ・アニメーションの処理を再定義します。
    //=============================================================================
    const _Game_CharacterBase_requestAnimation = Game_CharacterBase.prototype.requestAnimation;
    Game_CharacterBase.prototype.requestAnimation = function (animationId) {
        if (ConfigManager.loadBattleAnime) {
            _Game_CharacterBase_requestAnimation.call(this, animationId);
        }
    };


})();