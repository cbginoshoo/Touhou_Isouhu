
/*:
* @plugindesc メタル系の敵を設定
* @author SQUARE PHOENIX
*
* @param metal_enemy
* @text メタル系の敵のID
* @type number[]
* @min 0
* @default []
* @desc 与えられるダメージを１にしたい敵のIDを設定します。


* @help
* パラメーターで設定したIDの敵は、メタル系の敵になります。
* メタル系の敵に与えられるダメージは最大１になりますが、クリティカルは例外で
* 大きなダメージを与えられます。

* パラメーターの「テキストのリスト」タブで、複数の敵のIDを設定できます。
* １行に一つのIDを設定します。
*「テキスト」タブを利用する場合は、["2","3"]のように設定していきます。

* RPGツクールMVで使用する場合は、ご自由にお使いいただけます。
* 自己責任でお使いください。
* [SQUARE PHOENIX] : http://enix.web.fc2.com/
 */


(function() {
    'use strict';

    const PN = "metal_enemy_custom";

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

    const parameters = paramParse(PluginManager.parameters(PN));

    const metal_enemy_id  = parameters['metal_enemy'];


    //=============================================================================
    // メタル系の敵のダメージを１にする。　クリティカル時は大ダメージ。
    //=============================================================================
    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let value;
        value = _Game_Action_makeDamageValue.apply(this, arguments);

        if (target.isEnemy() && metal_enemy_id.contains(target._enemyId)){
            if(value > 1){
              if(critical == false){
                value = 1
             }
            }
        }
        return value;
    };

})();
