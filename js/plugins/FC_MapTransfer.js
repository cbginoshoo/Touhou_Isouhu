//===============================================================================
// FC_MapTransfer.js
//===============================================================================
// Copyright (c) 2017 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v 1.0.2) マップ選択移動プラグイン
 * @author FantasticCreative
 *
 * @help マップ移動画面を生成します。
 * 表示された[エリア]を選び、選んだエリア毎に表示される[マップ]を選択することで
 * そのマップへと移動することができます。
 *
 * デフォルトのウィンドウ配置で、一番上の方に表示されるウィンドウが
 * 【情報ウィンドウ】です。エリアやマップの説明文がここに表示されます。
 *
 * 画面左にあるウィンドウが【エリアウィンドウ】です。設定した「エリア」が
 * このウィンドウに選択肢として表示されます。
 *
 * 画面右にあるウィンドウが【マップウィンドウ】です。選択したエリアから行ける
 * 「マップ」が存在する場合、このウィンドウに選択肢として表示されます。
 *
 * マップ移動画面を開いてエリアを選び、
 * エリア内のマップを選択することでそのマップに移動することができます。
 *
 * エリア/マップの選択は決定キーと選択キーで行います。
 *
 * マップウィンドウ内カーソルが選択可能(アクティブ)になっているとき、
 * キャンセルキーを押下することでエリアウィンドウをアクティブに
 * することができます。
 *
 * エリアウィンドウがアクティブのとき、キャンセルキーを押下することで
 * マップ選択画面を抜けることができます。
 *
 *
 *
 * [設定方法]
 *
 * このプラグインは、基本的にプラグインパラメータ[管理用変数]に
 * 設定した変数の値を見て、エリアやマップを表示するか決定しています。
 * (後述する追加設定で、スイッチによる判定も行うことができます)
 *
 * そのため、まずは[管理用変数]に使用する変数を設定してください。
 *
 * 次に、プラグインパラメータ[エリア設定]から、画面に表示するエリアを
 * 追加します。
 * リストボックス内をダブルクリックすることでエリア設定が開きます。
 *
 * エリア設定では、画面に表示するエリア名や説明文、
 * そのエリアをエリアウィンドウに出現させる条件などを設定できます。
 *
 *
 *   [エリア出現条件]
 *     [管理用変数]に格納された値と、ここで設定する[比較する値]を
 *     [比較方法]を使って比較、条件を満たす場合にエリアを出現させます。
 *
 *     [比較方法]は5種類あり、いずれも[管理用変数]の値を[比較する値]と
 *     比較します。
 *
 *     エリア出現条件を満たさない場合、そのエリアに含まれるマップも
 *     表示されないため注意してください。
 *
 *     [エリア出現条件の適用]は、この出現条件を使用するかどうかを
 *     選択することができます。"条件を使用しない"を選択した場合、
 *     この条件を無視してエリアを表示します。
 *
 *
 * エリア設定内にあるプラグインパラメータ[マップ設定]から、
 * エリアを選択したときに表示されるマップを追加することができます。
 * リストボックス内をダブルクリックすることでマップ設定が開きます。
 *
 * マップ設定では、画面に表示するマップ名や説明文、移動先のマップ情報、
 * そのマップをマップウィンドウに出現させる条件などを設定できます。
 *
 *
 *   [マップ出現条件]
 *     [管理用変数]に格納された値と、ここで設定する[比較する値]を
 *     [比較方法]を使って比較、条件を満たす場合にマップを出現させます。
 *
 *     [マップ出現条件の適用]は、この出現条件を使用するかどうかを
 *     選択することができます。"条件を使用しない"を選択した場合、
 *     この条件を無視してマップを表示します。
 *
 *
 * エリア内に表示可能なマップが１つも存在しない場合、
 * プラグインパラメータ[エリア表示方式]からエリアの表示方法を
 * 変更することができます。
 * また、マップウィンドウにはプラグインパラメータ[移動不可文言]に
 * 設定した文字列が表示されます。
 *
 *
 * [エリア/マップ出現条件(追加)]
 *
 * 管理用変数による判定条件では足りない場合、
 * ここでエリア/マップ毎に出現条件を追加することができます。
 * (条件を追加しておき、条件を適用する/しないを選択することも可能です)
 *
 * [判定用変数]には、管理用変数と同じく判定に使用する変数を選択できます。
 *
 * [比較方法]は5種類あり、ここでは[判定用変数]の値を[比較する値]と
 * 比較します。
 *
 * [比較方法]は5種類あり、ここでは[判定用変数]の値を[比較する値]と
 * 比較します。
 *
 * [判定用スイッチ]で、一定期間だけ出現するエリア/マップなどを
 * 制御する方法に変数ではなくスイッチを使うことが可能です。
 *
 * [スイッチの状態]で、
 * [判定用スイッチ]がONのときにエリア/マップを出現させるのか
 * OFFのときに出現させるのかを選択することができます。
 *
 *
 *
 * プラグインコマンド:
 *   MapTransfer open
 *     ・マップ転送画面を開きます。
 *
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 * ==============================================================================
 *
 * @param Area_Config
 * @text エリア設定
 * @desc マップ転送シーンに表示するエリアの設定
 * @type struct<Area>[]
 * @default []
 *
 * @param Background
 * @text 背景画像
 * @desc マップ転送シーンに表示する背景画像。未設定の場合はマップ画面をキャプチャしたものが背景に表示されます。
 * @type file
 * @require 1
 * @dir /img/pictures/
 *
 * @param Window_Config
 * @text ウィンドウの設定
 * @desc ウィンドウの設定一覧
 *
 * @param Info_Window
 * @text 情報ウィンドウ設定
 * @desc 情報ウィンドウ位置などの設定(デフォルト: X=0, Y=0, Width=816, Row=2)
 * @type struct<Window>
 * @default {"Window_X":"0","Window_Y":"0","Window_Width":"816","Window_Row":"2"}
 * @parent Window_Config
 *
 * @param Area_Window
 * @text エリアウィンドウ設定
 * @desc エリアウィンドウ位置などの設定(デフォルト: X=0, Y=108, Width=192, Row=4)
 * @type struct<Window>
 * @default {"Window_X":"0","Window_Y":"108","Window_Width":"192","Window_Row":"4"}
 * @parent Window_Config
 *
 * @param Map_Window
 * @text マップウィンドウ設定
 * @desc マップウィンドウ位置などの設定(デフォルト: X=624, Y=108, Width=192, Row=4)
 * @type struct<Window>
 * @default {"Window_X":"624","Window_Y":"108","Window_Width":"192","Window_Row":"4"}
 * @parent Window_Config
 *
 * @param Area_View
 * @text エリア表示方式
 * @desc (エリアの出現条件は満たしているが、)そのエリアに属するマップが1件も出現していないときの、エリアの表示方法を選択します。
 * @type select
 * @option エリア名をグレーアウトする
 * @option エリア名を通常表示する
 * @option エリア名を表示しない
 * @default エリア名をグレーアウトする
 *
 * @param None_Point
 * @text 移動不可文言
 * @desc エリア/マップが1件も出現していない場合に表示する文章
 * @type text
 * @default 行き先がありません
 *
 * @param Manage_Variable
 * @text 管理用変数
 * @desc 全エリア、マップに対し出現条件の判定を行うための変数を指定します。
 * @type Variable
 * @default 10
 *
*/
/*~struct~Area:
 *
 * @param Area_Name
 * @text エリア名称
 * @desc 画面に表示するエリア名称を入力します。
 * @type text
 *
 * @param Area_Description
 * @text エリア説明
 * @desc 情報ウィンドウに表示するエリア説明文を入力します。(改行は表示に反映されます)
 * @type note
 * @default ""
 *
 * @param Manage_Value
 * @text エリア出現条件
 * @desc [管理用変数]で指定した変数に対応する条件を指定します。
 * @type struct<Manage>
 * @default {"Manage_Use":"true","Compare_Value":"0","Compare_Method":"[管理用変数]の値が[比較する値]以上のときに表示"}
 *
 * @param Add_Manage
 * @text エリア出現条件(追加)
 * @desc [管理用変数]とは別に出現条件を指定する場合に設定します。(未設定の場合は追加条件を使用しません)
 * @type struct<AddManage>[]
 * @default []
 *
 * @param Map_Config
 * @text マップ設定
 * @desc このエリアを選択したときに表示するマップの設定
 * @type struct<Map>[]
 * @default []
 *
 */
/*~struct~Map:
 *
 * @param Map_Name
 * @text マップ名称
 * @desc 画面に表示するマップ名称を入力します。
 * @type text
 *
 * @param Map_Description
 * @text マップ説明
 * @desc 情報ウィンドウに表示するマップ説明文を入力します。(改行は表示に反映されます)
 * @type note
 * @default ""
 *
 * @param Map_Info
 * @text マップ詳細
 * @desc 項目を選択したときに移動するマップを設定します。
 * @type struct<MapInfo>
 * @default {"Map_Id":"1","Player_X":"1","Player_Y":"1","Player_Direction":"そのまま"}
 *
 * @param Manage_Value
 * @text マップ出現条件
 * @desc [管理用変数]で指定した変数に対応する条件を指定します。
 * @type struct<Manage>
 * @default {"Manage_Use":"true","Compare_Value":"0","Compare_Method":"[管理用変数]の値が[比較する値]以上のときに表示"}
 *
 * @param Add_Manage
 * @text マップ出現条件(追加)
 * @desc [管理用変数]とは別に出現条件を指定する場合に設定します。(未設定の場合は追加条件を使用しません)
 * @type struct<AddManage>[]
 * @default []
 *
 */
/*~struct~Window:
 *
 * @param Window_X
 * @text ウィンドウX座標
 * @desc ウィンドウのX座標(横軸)を入力します。
 * @type Number
 * @min 0
 *
 * @param Window_Y
 * @text ウィンドウY座標
 * @desc ウィンドウのY座標(縦軸)を入力します。
 * @type Number
 * @min 0
 *
 * @param Window_Width
 * @text ウィンドウ横幅
 * @desc ウィンドウの横幅を入力します。
 * @type Number
 * @min 1
 *
 * @param Window_Row
 * @text ウィンドウ表示行数
 * @desc ウィンドウ内に表示可能な最大行数を入力します。(行数の分、ウィンドウ高さが増減します)
 * @type Number
 * @min 1
 *
 */
/*~struct~MapInfo:
 *
 * @param Map_Id
 * @text マップId
 * @desc 移動先のマップIDを入力します。
 * @type Number
 * @min 1
 * @max 9999
 * @default 1
 *
 * @param Player_X
 * @text プレイヤー座標X
 * @desc マップ移動先のプレイヤーX座標(横軸)を入力します。
 * @type Number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param Player_Y
 * @text プレイヤー座標Y
 * @desc マップ移動先のプレイヤーY座標(縦軸)を入力します。
 * @type Number
 * @min 0
 * @max 255
 * @default 0
 *
 * @param Player_Direction
 * @text プレイヤー向き
 * @desc マップ移動先のプレイヤー向きを指定します。
 * @type select
 * @option そのまま
 * @option 上
 * @option 右
 * @option 下
 * @option 左
 * @default そのまま
 *
 */
/*~struct~Manage:
 *
 * @param Manage_Use
 * @text マップ出現条件の適用
 * @desc [マップ出現条件]を使用するか選択します。(使用しない場合、[マップ出現条件(追加)]だけで出現判定が行われます)
 * @type boolean
 * @on 条件を使用する
 * @off 条件を使用しない
 * @default true
 *
 * @param Compare_Value
 * @text 比較する値
 * @desc [管理用変数]の値と比較する値を指定します。
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param Compare_Method
 * @text 比較方法
 * @desc [管理用変数]の値と、この[比較する値]をどのように比較するか選択します。
 * @type select
 * @option [管理用変数]の値が[比較する値]より大きいときに表示
 * @option [管理用変数]の値が[比較する値]より小さいときに表示
 * @option [管理用変数]の値が[比較する値]以上のときに表示
 * @option [管理用変数]の値が[比較する値]以下のときに表示
 * @option [管理用変数]の値が[比較する値]と同じときに表示
 * @option [管理用変数]の値が[比較する値]と違うときに表示
 * @default [管理用変数]の値が[比較する値]以上のときに表示
 *
 */
/*~struct~AddManage:
 *
 * @param Add_Use
 * @text 条件の適用
 * @desc この条件を使用するか選択します。(一時的に条件を無効にしたい場合などにoffにします)
 * @type boolean
 * @on 条件を使用する
 * @off 条件を使用しない
 * @default true
 *
 * @param Add_Operator
 * @text 条件の種類
 * @desc 他に条件があるとき、この条件も満たしている必要がある(and,かつ)、この条件を満たしていれば良い(or,または)のか指定します。
 * @type boolean
 * @on and条件
 * @off or条件
 * @default true
 *
 * @param Add_Variable
 * @text 判定用変数
 * @desc このマップに対し追加で出現条件の判定を行うための変数を指定します。(未指定の場合は変数による判定を行いません)
 * @type Variable
 * @default 0
 *
 * @param Add_Compare_Value
 * @text 比較する値
 * @desc この[判定用変数]で指定した変数と比較する値を指定します。
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 *
 * @param Add_Compare_Method
 * @text 比較演算子
 * @desc この[判定用変数]で指定した変数と、この[比較する値]で指定した値をどのように比較するか選択します。
 * @type select
 * @option [判定用変数]の値が[比較する値]より大きいときに表示
 * @option [判定用変数]の値が[比較する値]より小さいときに表示
 * @option [判定用変数]の値が[比較する値]以上のときに表示
 * @option [判定用変数]の値が[比較する値]以下のときに表示
 * @option [判定用変数]の値が[比較する値]と同じときに表示
 * @option [判定用変数]の値が[比較する値]と違うときに表示
 * @default [判定用変数]の値が[比較する値]以上のときに表示
 *
 * @param Add_Switch
 * @text 判定用スイッチ
 * @desc このマップに対し追加で出現条件の判定を行うためのスイッチを指定します。(未指定の場合はスイッチによる判定を使用しません)
 * @type switch
 * @default 0
 *
 * @param Add_Switch_Method
 * @text スイッチの状態
 * @desc この[判定用スイッチ]で指定したスイッチが次の状態のとき、マップを表示します。
 * @type boolean
 * @on ONのとき表示
 * @off OFFのとき表示
 * @default true
 *
 */

var Imported = Imported || {};
Imported.FC_MapTransfer = true;

(function () {
    'use strict';

    const PN = "FC_MapTransfer";

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

    /**
     * convert @option to @value
     * @param {String} name : Parameter Name
     * @param {Any} option  : Parameter Value
     * @return {Any} value  : Convert Value
     */
    const convertOption = function(name, option) {
        let value;

        if(name == "Player_Direction") {
            value = 0;
            switch(option) {
                case "上":
                    value = 8;
                    break;
                case "右":
                    value = 6;
                    break;
                case "下":
                    value = 2;
                    break;
                case "左":
                    value = 4;
                    break;
            }
        }
        if(name == "Area_View") {
            value = 0;
            switch(option) {
                case "エリア名をグレーアウトする":
                    value = 0;
                    break;
                case "エリア名を通常表示する":
                    value = 1;
                    break;
                case "エリア名を表示しない":
                    value = 2;
                    break;
            }
        }
        if(name == "Compare_Method") {
            value = "";
            switch(option) {
                case "[管理用変数]の値が[比較する値]より大きいときに表示":
                    value = ">";
                    break;
                case "[管理用変数]の値が[比較する値]より小さいときに表示":
                    value = "<";
                    break;
                case "[管理用変数]の値が[比較する値]以上のときに表示":
                    value = ">=";
                    break;
                case "[管理用変数]の値が[比較する値]以下のときに表示":
                    value = "<=";
                    break;
                case "[管理用変数]の値が[比較する値]と同じときに表示":
                    value = "==";
                    break;
                case "[管理用変数]の値が[比較する値]と違うときに表示":
                    value = "!=";
                    break;
            }
        }
        if(name == "Add_Compare_Method") {
            value = "";
            switch(option) {
                case "[判定用変数]の値が[比較する値]より大きいときに表示":
                    value = ">";
                    break;
                case "[判定用変数]の値が[比較する値]より小さいときに表示":
                    value = "<";
                    break;
                case "[判定用変数]の値が[比較する値]以上のときに表示":
                    value = ">=";
                    break;
                case "[判定用変数]の値が[比較する値]以下のときに表示":
                    value = "<=";
                    break;
                case "[判定用変数]の値が[比較する値]と同じときに表示":
                    value = "==";
                    break;
                case "[判定用変数]の値が[比較する値]と違うときに表示":
                    value = "!=";
                    break;
            }
        }

        return value;
    };

    const createParams = function(Parameters) {
        let Params, infoWin, areaWin, mapWin;
        Params = {};
        infoWin = Parameters["Info_Window"];
        areaWin = Parameters["Area_Window"];
        mapWin = Parameters["Map_Window"];

        Params = {
            "Background" : String(Parameters["Background"] || ""),
            "ManageVariable" : Number(Parameters["Manage_Variable"] | 0),
            "InfoWin" : {
                "X" : Number(infoWin.Window_X || 0),
                "Y" : Number(infoWin.Window_Y || 0),
                "W" : Number(infoWin.Window_Width || 816),
                "R" : Number(infoWin.Window_Row || 2),
            },
            "AreaWin" : {
                "X" : Number(areaWin.Window_X || 0),
                "Y" : Number(areaWin.Window_Y || 108),
                "W" : Number(areaWin.Window_Width || 192),
                "R" : Number(areaWin.Window_Row || 4),
            },
            "MapWin" : {
                "X" : Number(mapWin.Window_X || 624),
                "Y" : Number(mapWin.Window_Y || 108),
                "W" : Number(mapWin.Window_Width || 192),
                "R" : Number(mapWin.Window_Row || 4),
            },
            "AreaView"  : convertOption("Area_View", Parameters["Area_View"]),
            "NonePoint" : String(Parameters["None_Point"] || "行き先がありません"),
        };

        Params["AreaConfig"] = Array();
        Parameters["Area_Config"].forEach(function(area) {
            if(area.Area_Name) {
                let areaConf, mapConf;

                areaConf = {
                    "Name" : String(area.Area_Name || ""),
                    "Desc" : String(area.Area_Description || ""),
                };

                areaConf["AreaManage"] = {
                    "Use"    : Boolean(area.Manage_Value.Manage_Use),
                    "Value"  : Number(area.Manage_Value.Compare_Value || 0),
                    "Method" : convertOption("Compare_Method", area.Manage_Value.Compare_Method),
                }

                areaConf["AddManage"] = Array();
                area.Add_Manage.forEach(function(manage) {
                    areaConf["AddManage"].push({
                        "Use"      : Boolean(manage.Add_Use),
                        "Variable" : Number(manage.Add_Variable || 0),
                        "vValue"   : Number(manage.Add_Compare_Value || 0),
                        "vMethod"  : convertOption("Add_Compare_Method", manage.Add_Compare_Method),
                        "Switch"   : Number(manage.Add_Switch || 0),
                        "sMethod"  : Boolean(manage.Add_Switch_Method),
                    });
                });

                areaConf["MapConfig"] = Array();
                if(area.Map_Config.length) {
                    area.Map_Config.forEach(function(map) {
                        if(map.Map_Name) {
                            mapConf = {
                                "Name" : String(map.Map_Name || ""),
                                "Desc" : String(map.Map_Description || ""),
                            };

                            mapConf["MapInfo"] = {
                                "Id" : Number(map.Map_Info.Map_Id),
                                "X"  : Number(map.Map_Info.Player_X),
                                "Y"  : Number(map.Map_Info.Player_Y),
                                "D"  : convertOption("Player_Direction", map.Map_Info.Player_Direction),
                            };

                            mapConf["MapManage"] = {
                                "Use"    : Boolean(map.Manage_Value.Manage_Use),
                                "Value"  : Number(map.Manage_Value.Compare_Value || 0),
                                "Method" : convertOption("Compare_Method", map.Manage_Value.Compare_Method),
                            }

                            mapConf["AddManage"] = Array();
                            map.Add_Manage.forEach(function(manage) {
                                mapConf["AddManage"].push({
                                    "Use"      : Boolean(manage.Add_Use),
                                    "Operator" : manage.Add_Operator === undefined ? true : Boolean(manage.Add_Operator),
                                    "Variable" : Number(manage.Add_Variable || 0),
                                    "vValue"   : Number(manage.Add_Compare_Value || 0),
                                    "vMethod"  : convertOption("Add_Compare_Method", manage.Add_Compare_Method),
                                    "Switch"   : Number(manage.Add_Switch || 0),
                                    "sMethod"  : Boolean(manage.Add_Switch_Method),
                                });
                            });

                            areaConf["MapConfig"].push(mapConf);
                        }
                    });
                }

                Params["AreaConfig"].push(areaConf);
            }
        });
        return Params;
    };

    const Parameters = paramParse(PluginManager.parameters(PN));
    const Params = createParams(Parameters);

    //=========================================================================
    // Game_Interpreter
    //  ・マップ転送用コマンドを定義します。
    //
    //=========================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "maptransfer") {
            switch (args[0].toLowerCase()) {
                case "open":
                    SceneManager.push(Scene_MapTransfer);
                    break;
            }
        }
    };


    //=========================================================================
    // Scene_MapTransfer
    //  ・マップ転送画面を定義します。
    //
    //=========================================================================
    function Scene_MapTransfer() {
        this.initialize.apply(this, arguments);
    }

    Scene_MapTransfer.prototype = Object.create(Scene_Base.prototype);
    Scene_MapTransfer.prototype.constructor = Scene_MapTransfer;

    Scene_MapTransfer.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_MapTransfer.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createWindowLayer();
        this.createHelpWindow();
        this.createAreaWindow();
        this.createMapWindow();
    };

    Scene_MapTransfer.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        if(Params.Background){
            this._backgroundSprite.bitmap = ImageManager.loadPicture(Params.Background);
        } else {
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        }
        this.addChild(this._backgroundSprite);
    }

    Scene_MapTransfer.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Info();
        this.addWindow(this._helpWindow);
    };

    Scene_MapTransfer.prototype.createAreaWindow = function() {
        let x, y;
        x = Params.AreaWin.X;
        y = Params.AreaWin.Y;

        this._areaWindow = new Window_AreaSelect(x, y);
        this._areaWindow.setHandler('ok',        this.areaOk.bind(this));
        this._areaWindow.setHandler('cancel',    this.popScene.bind(this));
        this.addWindow(this._areaWindow);
        this._areaWindow.setHelpWindow(this._helpWindow);
    }

    Scene_MapTransfer.prototype.createMapWindow = function() {
        let x, y;
        x = Params.MapWin.X;
        y = Params.MapWin.Y;

        this._mapWindow = new Window_MapSelect(x, y);
        this._mapWindow.setHandler('ok',        this.mapOk.bind(this));
        this._mapWindow.setHandler('cancel',    this.mapCancel.bind(this));
        this.addWindow(this._mapWindow);
        this._mapWindow.setHelpWindow(this._helpWindow);
        this._mapWindow.setAreaWindow(this._areaWindow);
        this._areaWindow.setMapWindow(this._mapWindow);
    }

    Scene_MapTransfer.prototype.areaOk = function() {
        let area;
        area = this._areaWindow.area();

        if(area > -1) {
            this._areaWindow.deactivate();
            this._mapWindow.activate();
            this._mapWindow.select(0);
        } else {
            this._mapWindow.activate();
        }
    };

    Scene_MapTransfer.prototype.mapOk = function() {
        let area, region, mapInfo, dir;
        area = this._mapWindow.area();
        region = this._mapWindow.region();
        mapInfo = Params.AreaConfig[area].MapConfig[region].MapInfo;
        dir = mapInfo.D == 0 ? $gamePlayer.direction() : mapInfo.D;

        $gamePlayer.reserveTransfer(mapInfo.Id, mapInfo.X, mapInfo.Y, dir, 0);
        SceneManager.goto(Scene_Map);
    };

    Scene_MapTransfer.prototype.mapCancel = function() {
        this._mapWindow.deactivate();
        this._mapWindow.deselect();
        this._areaWindow.activate();
    };


    //=========================================================================
    // Window_Info
    //  ・情報ウィンドウを定義します。(ヘルプウィンドウ継承)
    //
    //=========================================================================
    function Window_Info() {
        this.initialize.apply(this, arguments);
    }

    Window_Info.prototype = Object.create(Window_Help.prototype);
    Window_Info.prototype.constructor = Window_Info;

    Window_Info.prototype.initialize = function(numLines) {
        let x, y, width, height;
        x = Params.InfoWin.X;
        y = Params.InfoWin.Y;
        width = Params.InfoWin.W;
        height = this.fittingHeight(numLines || Params.InfoWin.R);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = '';
    };


    //=========================================================================
    // Window_AreaSelect
    //  ・エリア選択ウィンドウを定義します。
    //
    //=========================================================================
    function Window_AreaSelect() {
        this.initialize.apply(this, arguments);
    }

    Window_AreaSelect.prototype = Object.create(Window_Command.prototype);
    Window_AreaSelect.prototype.constructor = Window_AreaSelect;

    Window_AreaSelect.prototype.initialize = function(x, y) {
        this._displayInfo = {};
        this.createDisplayInfo();

        Window_Command.prototype.initialize.call(this, x, y);

        this.select(0);
        this.activate();
        this._area = -1;

    };

    Window_AreaSelect.prototype.windowWidth = function() {
        return Params.AreaWin.W;
    };

    Window_AreaSelect.prototype.windowHeight = function() {
        let row = this.numVisibleRows();
        if(this._list) {
            if(this._list.length < this.numVisibleRows()) {
                row = this._list.length;
            }
        }

        return this.fittingHeight(row);
    };

    Window_AreaSelect.prototype.numVisibleRows = function() {
        return Params.AreaWin.R;
    };

    Window_AreaSelect.prototype.makeCommandList = function() {
        let list, i, cnt, areaConfig, name, display;
        list = Array();

        if(Params.AreaConfig && Params.AreaConfig.length > 0) {
            cnt = Params.AreaConfig.length;
            for(i = 0; i < cnt; i++) {
                areaConfig = Params.AreaConfig[i];
                display = this.displayInfo("area_" + i);
                if(display == 2) {
                    continue;
                }
                this.addCommand(areaConfig.Name, "area_" + i, !!display);
            }
        }

        if(this.maxItems() == 0) {
            this.addCommand(Params.NonePoint, "area_-1", false);
        }
    };

    Window_AreaSelect.prototype.createDisplayInfo = function() {
        let areaConfig, mapConfig, manageVariable, manageValue, compareValue, displayInfo,
            display, manage;
        areaConfig = Params.AreaConfig;
        manageVariable = Params.ManageVariable;

        areaConfig.forEach(function(area, i) {
            displayInfo = {"display" : 0, "maps" : {}};
            // areaConfigの条件精査
            display = this.currentDisplay(Params.ManageVariable, area.AreaManage, area.AddManage);

            displayInfo.display = display;
            if(displayInfo.display != 2) {
                mapConfig = area.MapConfig;
                mapConfig.forEach(function(map, j) {
                    // mapConfigの条件精査
                    display = this.currentDisplay(Params.ManageVariable, map.MapManage, map.AddManage);

                    displayInfo.maps["region_" + j] = display;
                }, this);
            }

            if(displayInfo.display != 2) {
                if(Object.keys(displayInfo.maps).length == 0) {
                    displayInfo.display = Params.AreaView;
                } else {
                    if(Object.keys(displayInfo.maps).every(function(k) { return displayInfo.maps[k] == 0 || displayInfo.maps[k] == 2; })) {
                        displayInfo.display = Params.AreaView;
                    }
                }
            }

            this._displayInfo["area_" + i] = displayInfo;
        }, this);
    }

    /**
     * Display status 0=>disable, 1=>enable, 2=>hidden
     * @param {Number} manageVariable : Variable number
     * @param {Object} maange         : Manage object
     * @param {Object} addManage      : Add manage object
     * @return {Number} display       : Display status
     */
    Window_AreaSelect.prototype.currentDisplay = function(manageVariable, manage, addManage) {
        let manageValue, compareValue, display;
        display = 1;

        // 管理用変数チェック
        if(manage.Use && manageVariable > 0) {
            manageValue = $gameVariables.value(manageVariable);
            compareValue = manage.Value;
            if(!isFinite(manageValue) || !isFinite(compareValue)) {
                display = 2;
            }
            if(display != 2 && manage.Method == "") {
                display = 2;
            }
            if(display != 2) {
                switch(manage.Method) {
                    case ">" :
                        display = manageValue > compareValue ? 1 : 2;
                        break;
                    case "<" :
                        display = manageValue < compareValue ? 1 : 2;
                        break;
                    case ">=" :
                        display = manageValue >= compareValue ? 1 : 2;
                        break;
                    case "<=" :
                        display = manageValue <= compareValue ? 1 : 2;
                        break;
                    case "==" :
                        display = manageValue == compareValue ? 1 : 2;
                        break;
                    case "!=" :
                        display = manageValue != compareValue ? 1 : 2;
                        break;
                }
            }
        }
        // 追加条件チェック
        let manageCount = addManage.length;
        for(let i = 0; i < manageCount; i++) {
            let ad = addManage[i];
            if((display != 2 || ad.Operator === false) && ad.Use) {
                if(ad.Variable > 0 && ad.Method != "") {
                    manageValue = $gameVariables.value(ad.Variable);
                    compareValue = ad.vValue;
                    if(!isFinite(manageValue) || !isFinite(compareValue)) {
                        display = 2;
                    }
                    if(display != 2) {
                        switch(ad.vMethod) {
                            case ">" :
                                display = manageValue > compareValue ? 1 : 2;
                                break;
                            case "<" :
                                display = manageValue < compareValue ? 1 : 2;
                                break;
                            case ">=" :
                                display = manageValue >= compareValue ? 1 : 2;
                                break;
                            case "<=" :
                                display = manageValue <= compareValue ? 1 : 2;
                                break;
                            case "==" :
                                display = manageValue == compareValue ? 1 : 2;
                                break;
                            case "!=" :
                                display = manageValue != compareValue ? 1 : 2;
                                break;
                        }
                    }
                }
                if((display != 2 || ad.Operator === false) && ad.Switch > 0 && ad.sMethod != "") {
                    manageValue = $gameSwitches.value(ad.Switch);

                    if(ad.sMethod) {
                        display = manageValue ? 1 : 2;
                    } else {
                        display = !manageValue ? 1 : 2;
                    }
                }
            }

            if(ad.Operator === false && display == 1) {
                break;
            }
        }




        // addManage.forEach(function(ad) {
        //     if(display != 2 && ad.Use) {
        //         if(ad.Variable > 0 && ad.Method != "") {
        //             manageValue = $gameVariables.value(ad.Variable);
        //             compareValue = ad.vValue;
        //             if(!isFinite(manageValue) || !isFinite(compareValue)) {
        //                 display = 2;
        //             }
        //             if(display != 2) {
        //                 switch(ad.vMethod) {
        //                     case ">" :
        //                         display = manageValue > compareValue ? 1 : 2;
        //                         break;
        //                     case "<" :
        //                         display = manageValue < compareValue ? 1 : 2;
        //                         break;
        //                     case ">=" :
        //                         display = manageValue >= compareValue ? 1 : 2;
        //                         break;
        //                     case "<=" :
        //                         display = manageValue <= compareValue ? 1 : 2;
        //                         break;
        //                     case "==" :
        //                         display = manageValue == compareValue ? 1 : 2;
        //                         break;
        //                     case "!=" :
        //                         display = manageValue != compareValue ? 1 : 2;
        //                         break;
        //                 }
        //             }
        //         }
        //         if(display != 2 && ad.Switch > 0 && ad.sMethod != "") {
        //             manageValue = $gameSwitches.value(ad.Switch);
        //             if(ad.sMethod) {
        //                 display = manageValue ? 1 : 2;
        //             } else {
        //                 display = !manageValue ? 1 : 2;
        //             }
        //         }
        //     }

        //     if(!addManage.Operator && display == 1) {
        //         return false;
        //     }
        // });

        return display;
    };

    /**
     * Display status 0=>disable, 1=>enable, 2=>hidden
     * @param {String} symbol : Area or Map Symbol
     * @return {Number} Display status : 0=>disable, 1=>enable, 2=>hidden
     */
    Window_AreaSelect.prototype.displayInfo = function(symbol) {
        let display, displayInfo, lists;
        display = 1;
        lists = [];

        if(symbol != "" && this._displayInfo) {
            lists = symbol.split("_");
            if(lists.length > 1) {
                if(lists[0] == "area") {
                    if(symbol in this._displayInfo) {
                        displayInfo = this._displayInfo[symbol];
                        display = displayInfo.display;
                    }
                } else if(lists[0] == "region") {
                    if("area_"+lists[1] in this._displayInfo) {
                        displayInfo = this._displayInfo["area_"+lists[1]];
                        if(displayInfo && "region_"+lists[2] in displayInfo.maps) {
                            display = displayInfo.maps["region_"+lists[2]];
                        }
                    }
                }

            }

        }
        return display;
    };

    Window_AreaSelect.prototype.select = function(index) {
        Window_Command.prototype.select.call(this, index);
        this.setArea(index);
    };

    Window_AreaSelect.prototype.setArea = function(area) {
        if (area > -1 && this._area != area) {
            this._area = Number(area);
        }
    };

    Window_AreaSelect.prototype.area = function() {
        return this._area;
    };

    Window_AreaSelect.prototype.setHelpWindowText = function(text) {
        if (this._helpWindow) {
            this._helpWindow.setText(text);
        }
    };

    Window_AreaSelect.prototype.update = function() {
        Window_Command.prototype.update.call(this);

        let symbol, area;
        symbol = this.currentSymbol();

        if (this._mapWindow) {
            area = symbol.split("_");
            this._mapWindow.setArea(area[1]);
        }
    };

    Window_AreaSelect.prototype.drawItem = function(index) {
        let rect, align, item, regExp, match;
        rect = this.itemRectForText(index);
        align = this.itemTextAlign();
        item = this.commandName(index);
        regExp = /^\x1bC\[(\d+)\]/i;

        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));

        item = item.replace(/\\/g, '\x1b');
        item = item.replace(/\x1b\x1b/g, '\\');

        if(regExp.test(item)) {
            match = item.match(regExp);
            this.changeTextColor(this.textColor(match[1]));
            item = item.replace(regExp, '');
        }

        this.drawText(item, rect.x, rect.y, rect.width, align);
    };

    Window_AreaSelect.prototype.updateHelp = function() {
        let text, symbol, area;
        text = "";
        symbol = this.currentSymbol();
        area = -1;

        if(symbol) {
            area = Number(symbol.split("_")[1]);
        }
        if(area >= 0) {
            text = Params.AreaConfig[area].Desc;
        }

        this.setHelpWindowText(text);
    };

    Window_AreaSelect.prototype.setMapWindow = function(mapWindow) {
        this._mapWindow = mapWindow;
        this.update();
    };


    //=========================================================================
    // Window_MapSelect
    //  ・マップ選択ウィンドウを定義します。
    //
    //=========================================================================
    function Window_MapSelect() {
        this.initialize.apply(this, arguments);
    }

    Window_MapSelect.prototype = Object.create(Window_Command.prototype);
    Window_MapSelect.prototype.constructor = Window_MapSelect;

    Window_MapSelect.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);

        this._area = -1;
        this._region = -1;
        this.openness = 0;
        this.deselect();
        this.deactivate();
    };

    Window_MapSelect.prototype.windowWidth = function() {
        return Params.MapWin.W;
    };

    Window_MapSelect.prototype.windowHeight = function() {
        let row = this.numVisibleRows();
        if(this._list) {
            if(this._list.length < this.numVisibleRows()) {
                row = this._list.length;
            }
        }
        return this.fittingHeight(row);
    };

    Window_MapSelect.prototype.numVisibleRows = function() {
        return Params.MapWin.R;
    };

    Window_MapSelect.prototype.makeCommandList = function() {
        let list, area, areaConfig, mapConfig, i, cnt, map, display;
        list = Array();
        area = this._area;
        areaConfig = Params.AreaConfig;
        mapConfig = {};

        if(area > -1) {
            if(String(area) in areaConfig) {
                mapConfig = areaConfig[area].MapConfig;
            }
            if(mapConfig && mapConfig.length > 0) {
                cnt = mapConfig.length;
                for(i = 0; i < cnt; i++) {
                    map = mapConfig[i];
                    // ここで出現条件判定
                    display = 1;
                    if(this._areaWindow) {
                        display = this._areaWindow.displayInfo("region_" + area + "_" + i);
                    }
                    if(display == 2) {
                        continue;
                    }
                    this.addCommand(map.Name, "region_" + area + "_" + i, !!display);
                }
            }

            if(this.maxItems() == 0) {
                this.addCommand(Params.NonePoint, "region_" + area + "_-1", false);
            }
        }
    };

    /**
     * visible 0=>disable, 1=>enable, 2=>hidden
     * @param {Any} config : config
     * @return {Number} : condition 0=>disable, 1=>enable, 2=>hidden
     */
    Window_MapSelect.prototype.visibleCondition = function(config) {
        let ret, manage, addManage, manageValue, compareValue;
        ret = 2;
        manage = config.MapManage;
        addManage = config.AddManage;

        if(!isFinite(Params.ManageVariable)) {
            return 2;
        }

        manageValue = $gameVariables.value(Params.ManageVariable);
        compareValue = manage.Value;

        if(!isFinite(manageValue) || !isFinite(compareValue)) {
            return 2;
        }

        if(manage.Method == "") {
            ret = 1;
        }
        switch(manage.Method) {
            case ">" :
                ret = manageValue > compareValue ? 1 : ret;
                break;
            case "<" :
                ret = manageValue < compareValue ? 1 : ret;
                break;
            case ">=" :
                ret = manageValue >= compareValue ? 1 : ret;
                break;
            case "<=" :
                ret = manageValue <= compareValue ? 1 : ret;
                break;
            case "==" :
                ret = manageValue == compareValue ? 1 : ret;
                break;
            case "!=" :
                ret = manageValue != compareValue ? 1 : ret;
                break;
        }

        return ret;
    };

    Window_MapSelect.prototype.select = function(index) {
        Window_Command.prototype.select.call(this, index);
        // this.setRegion(index);
    }

    Window_MapSelect.prototype.setArea = function(area) {
        if (area > -1 && this._area != area) {
            this._area = Number(area);
            this.setup();
            this.resetScroll();
        }
    };

    Window_MapSelect.prototype.area = function() {
        return this._area;
    };

    // Window_MapSelect.prototype.setRegion = function(region) {
    //     if (region > -1) {
    //         this._region = region;
    //     }
    // };

    Window_MapSelect.prototype.region = function() {
        let symbol, arr;
        symbol = this.currentSymbol();

        if(symbol) {
            arr = symbol.split("_");
            return arr[arr.length - 1];
        } else {
            return -1;
        }
        return this._region;
    };

    Window_MapSelect.prototype.setup = function() {
        this.clearCommandList();
        this.makeCommandList();
        if(this._list.length > 0) {
            this.height = this.windowHeight();
            this.createContents();
            this.drawAllItems();
            this.open();
        }
    };

    Window_MapSelect.prototype.setHelpWindowText = function(text) {
        if (this._helpWindow) {
            this._helpWindow.setText(text);
        }
    };

    // Window_MapSelect.prototype.drawItem = function(index) {
    //     let rect, align, item, regExp, match;
    //     rect = this.itemRectForText(index);
    //     align = this.itemTextAlign();
    //     item = this.commandName(index);
    //     regExp = /^\x1bC\[(\d+)\]/i;

    //     this.resetTextColor();
    //     this.changePaintOpacity(this.isCommandEnabled(index));

    //     item = item.replace(/\\/g, '\x1b');
    //     item = item.replace(/\x1b\x1b/g, '\\');

    //     if(regExp.test(item)) {
    //         match = item.match(regExp);
    //         this.changeTextColor(this.textColor(match[1]));
    //         item = item.replace(regExp, '');
    //     }

    //     this.drawText(item, rect.x, rect.y, rect.width, align);
    // };
    Window_MapSelect.prototype.drawItem = Window_AreaSelect.prototype.drawItem;

    Window_MapSelect.prototype.updateHelp = function() {
        let text, symbol, area, region, mapConfig;
        text = "";
        symbol = this.currentSymbol();
        area = -1;
        region = -1;

        if(symbol) {
            area = Number(symbol.split("_")[1])
            region = Number(symbol.split("_")[2]);
        }
        if(area >= 0 && region >= 0) {
            mapConfig = Params.AreaConfig[area].MapConfig;
            text = mapConfig[region].Desc;
        }

        this.setHelpWindowText(text);
    };

    Window_MapSelect.prototype.setAreaWindow = function(areaWindow) {
        this._areaWindow = areaWindow;
    };


    //=========================================================================
    // Window_Base
    //  ・改行コードで正しく改行が行われるよう再定義します。
    //
    //=========================================================================
    var _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Base_processEscapeCharacter.call(this, code, textState);
        switch (code.toLowerCase()) {
            case 'n':
                this.processNewLine(textState);
                textState.index--;
                break;
        }
    };


    //=========================================================================
    // DataManager
    //  ・プラグイン導入前のセーブデータを
    //    ロードしたとき用の処理を定義します。
    //
    //=========================================================================
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // 処理を追記
    };


})();