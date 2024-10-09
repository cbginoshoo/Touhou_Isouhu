//==============================================================================
// MpiPassableChecker.js
//==============================================================================

/*:
 * @plugindesc 現在のプレイヤー位置から移動可能な場所に色を付けます。
 * @author 奏ねこま（おとぶき ねこま）
 * 
 * @param Color
 * @type string
 * @default red
 * @desc 色を設定します。
 * Webカラーのカラー名やカラーコードが指定できます。
 *
 * @param Alpha
 * @type string
 * @default 0.5
 * @desc 色の不透明度を設定します。
 * 0.0（透明）～1.0（不透明）で指定できます。
 * 
 * @param Test Only
 * @type boolean
 * @default true
 * @desc テスト時のみ有効にする場合は true を設定してください。
 * 
 * @help 
 * [概要]
 *  ・プレイヤーが現在位置から移動可能な場所に色を付ける機能を提供します。
 * 
 * [使用方法]
 *  ・マップ画面でF6キーを押すと色が付きます。もう一度F6キーを押すと消えます。
 * 
 * [ゲームの演出に使いたい人向け情報]
 *  ・以下のイベントコマンドを実行するとF6キーを押した場合と同じ動きをします。
 * 
 *     ◆スクリプト：Input._currentState['F6'] = true;
 *     ◆ウェイト：1フレーム
 *     ◆スクリプト：Input._currentState['F6'] = false;
 * 
 *  ・以下のようなスクリプトでプラグイン設定を書き換えることができます。
 * 
 *     //色を青に変更
 *     Makonet['MpiPassableChecker'].color = 'blue';
 *     //不透明度を0.2に変更
 *     Makonet['MpiPassableChecker'].alpha = 0.2;
 * 
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.02  2019/09/08  競合対策
 *   Version 1.01  2019/09/06  内部処理を一部変更。
 *   Version 1.00  2019/09/05  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2016-2019 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function(){
    'use strict';

    const plugin_name = 'MpiPassableChecker';

    Imported[plugin_name] = true;
    Makonet[plugin_name] = {};

    let _plugin = Makonet[plugin_name];
    let _parameters = PluginManager.parameters(plugin_name);

    _plugin.color     =        _parameters['Color'];
    _plugin.alpha     = Number(_parameters['Alpha']);
    _plugin.test_only =       (_parameters['Test Only'] === 'true');

    class Sprite_Passable extends Sprite {
        constructor(x, y) {
            super();
            this._character = new Game_CharacterBase();
            this._character.setPosition(x, y);
            this.bitmap = new Bitmap($gameMap.tileWidth(), $gameMap.tileHeight());
            this.bitmap.fillRect(0, 0, $gameMap.tileWidth(), $gameMap.tileHeight(), _plugin.color);
            this.alpha = _plugin.alpha;
            this.updatePosition();
        }

        update() {
            this.updatePosition();
            super.update();
        }

        updatePosition() {
            this.x = this._character.screenX() - $gameMap.tileWidth() / 2;
            this.y = this._character.screenY() - $gameMap.tileHeight() + this._character.shiftY();
        }
    }

    /* Scene_Map */
    {
        let __update = Spriteset_Map.prototype.update;
        Spriteset_Map.prototype.update = function() {
            __update.apply(this, arguments);
            if (Input.keyMapper[117] !== 'F6') {
                Input.keyMapper[117] = 'F6';
            }
            if (!_plugin.test_only || $gameTemp.isPlaytest()) {
                if (Input.isTriggered('F6')) {
                    if (this.__passableSprite) {
                        this.removeChild(this.__passableSprite);
                        delete this.__passableSprite;
                    } else {
                        let check_tile = {};
                        let checked_tile = {};
                        let d = [2, 4, 6, 8];
                        let xy = [[0, 1], [-1, 0], [1, 0], [0, -1]];
                        check_tile[[$gamePlayer.x, $gamePlayer.y]] = [$gamePlayer.x, $gamePlayer.y];
                        this.__passableSprite = new Sprite();                
                        do {
                            for (let key in check_tile) {
                                let [x, y] = check_tile[key];
                                for (let i = 0; i < 4; i++) {
                                    if ($gamePlayer.canPass(x, y, d[i])) {
                                        let _x = x + xy[i][0];
                                        let _y = y + xy[i][1];
                                        if (!checked_tile[[_x, _y]]) {
                                            check_tile[[_x, _y]] = [_x, _y];
                                        }
                                    }
                                }
                                checked_tile[key] = true;
                                delete check_tile[key];
                                this.__passableSprite.addChild(new Sprite_Passable(x, y));
                            }
                        } while(Object.keys(check_tile).length > 0);
                        this.addChild(this.__passableSprite);
                    }
                }
            }
        };
    }
}());
