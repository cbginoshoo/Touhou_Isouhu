//=============================================================================
// AnTares.js
//=============================================================================

/*:ja
 * @plugindesc ver1.06 パラムフッリワーケシステム
 * @author まっつＵＰ
 *
 * @param background
 * @text 背景
 * @desc 画面の背景画像を措定します。
 * @type file
 * @require 1
 * @dir /img/pictures/
 *
 * @param useval
 * @desc このIDの変数に配列を入れて
 * ポイントを実現します。
 * @type variable
 * @default 10
 *
 * @param argvalue
 * @desc このIDの変数はプラグインコマンドの引数に使われます。
 * @type variable
 * @default 11
 *
 * @param plusup
 * @desc 基本能力値ID順に能力上昇値を決めます。
 * @default 10 10 1 1 1 1 1 1
 *
 * @param pluscost
 * @desc 基本能力値ID順に能力上昇に必要なコストを決めます。
 * @default 50 50 10 10 10 10 10 10
 *
 * @param plusmax
 * @desc 基本能力値ID順に上昇能力限界値を決めます。
 * @default 100 100 10 10 10 10 10 10
 *
 * @param rateS
 * @desc そのアクターのこのIDのステート有効度で
 * ポイント加算率を指定できます。
 * @type state
 * @default 5
 *
 * @param lvvalue
 * @desc レベルアップした時にキャラクター毎に上昇させるポイント数を格納する変数番号を指定します。
 * @type variable
 * @default 3
 *
 * @param pluslvup
 * @desc レベルアップした時にキャラクター毎に上昇させるポイント数を指定します。
 * (rateSなどの影響を受けます)
 * @type number
 * @min 0
 * @default 2
 *
 * @param helptext
 * @desc アクター選択時ヘルプウインドウに表示する内容です。
 * このパラメータのIDのスキルの説明文を用います。
 * @type skill
 * @default 1
 *
 * @param smiletext
 * @desc ポイント残高の文字列です。
 * @default P
 *
 * @param maxtext
 * @desc 加算値が上限以上の時の文字列です。
 * @default 上限です
 *
 * @param resettext
 * @desc ポイントリセット用の文字列です。
 * @default ポイントリセット
 *
 * @param comtext
 * @desc 表示するメニューコマンド名
 * @default egao
 *
 * @param display
 * @desc このIDのスイッチがオンの時メニューコマンドにバインドします。
 * @type switch
 * @default 10
 *
 * @param completion
 * @desc ONの時このプラグインやアイテムの使用効果によって
 * mhpまたはmmpが元より大きくなったとき、その差分回復します。
 * @type boolean
 * @default false
 *
 * @param okname
 * @desc 決定音のファイル名
 * @type file
 * @require 1
 * @dir audio/se
 * @default Decision2
 *
 * @param okvolume
 * @desc 決定音のvolume
 * @default 90
 *
 * @param okpitch
 * @desc 決定音のpitch
 * @default 100
 *
 * @param okpan
 * @desc 決定音のpan
 * @default 0
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * （プラグインコマンド）
 * command:ATGrowing
 * args:
 *
 * パラムフッリワーケシステムのためのシーンを呼び出します。
 * このシーンはこのプラグインで追加されるメニューコマンドからも呼び出せます。
 * 引数はありませんのでcommandのみをプラグインコマンドに記入してください。
 *
 * （プラグインコマンド）
 * command:ATinit
 * args:
 *
 * こちらも引数のないプラグインコマンドです。
 * これはusevalのIDの変数にシーン用に「初期化された配列」を生成します。
 *
 * （プラグインコマンド）
 * command:ATdevide
 * args:0 id（ゲーム変数ID）
 *      1 id2（以下の説明を参照）
 *      2 true or false
 *
 * システムで使うためのコストの操作をします。
 * ゲーム変数idの値をid2の基準に従って振り分けます。
 * このとき、2番目の引数にtrueを指定すると
 * 基準によりますが対象者の数で割って振り分けます。
 * falseの場合は全て垂れ流しです。
 * そのアクターのrateSのステート有効度で影響度を上げたり下げたりできます。
 * また、ゲーム変数idの値は変化しません。
 *
 * id2に使うことのできる文字列
 * A:全てのアクター
 * B:バトルメンバー
 * C:argvalueのIDの変数の値と一致するクラスIDを持ったパーティメンバーのアクター
 * 　これには振り分け効果は無効です。
 * L:パーティメンバーの内最後尾のアクター
 * P:パーティメンバー
 * S:パーティメンバーの内argvalueのIDの変数の値のIDのステートが付加されたアクター
 *   これには振り分け効果は無効です。
 * V:IDがargvalueのIDの変数の値と一致するアクター
 *
 * 例：ATdevide 50 B true
 * ID50の変数の値をコストポイントとしてバトルメンバーに振り分けします。
 *
 * この操作によって要素に値が設定される場合、値は0~9999999の間に収まります。
 * シーンを開くときも同様の値の制御がなされます。
 *
 * （プラグインコマンド）
 * command:ATreset
 * args:0 id（アクターID）
 *      1 value（アクターのポイント数として設定する値）
 *
 * システムで使うためのコストをアクターごとに直接設定します。
 * 指定したアクターIDのポイント数をvalueで上書きします。
 *
 * ・パラムフッリワーケシステムについて
 * 実際にシーンで扱うことができるのはパーティメンバーです。
 * パーティメンバーを選択すると能力値用のウインドウが開きます。
 *
 * 以下の条件を満足する能力値のみ選択可能です。
 * ・能力値の、装備を除いた加算値が当プラグイン設定の上限未満。
 * ・上昇に必要なポイントコストがそのアクターの所有ポイント以下。
 *
 * 能力値を選択次第そのアクターの所有ポイントよりポイントコストが支払われ
 * そのアクターの能力値が大きくなります。
 *
 * ・ポイントリセットについて
 * アクターの現在の能力値毎に加算値を0にして
 * その差が0以上なら加算コストとの比率計算を行います。
 * その合計値をアクターの所有ポイントに加算します。
 * なお、パラメータ「resettext」に記述がない場合は機能は使えません。
 *
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *
 * ver1.01 選択の可否で能力値の項目の不透明度が変わるようにしました。
 * ver1.02 レイアウトの微調整。
 * ver1.03 加算値部分のレイアウトの変更、能力値加算処理の微調整。
 * ver1.04 ポイントリセットの実装。
 * ver1.05 所持ポイントと消費ポイントが同じの場合、項目が有効にならない不具合を修正
 * ver1.06 キャラクターグラフィックのロードがうまくいっていない不具合を修正
 *         パラメータのリセット時パラメータがおかしくなる可能性を排除
 *         その他パラメータ設定の追加・改善、コードの整理等
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 *
 */

(function() {

var parameters = PluginManager.parameters('AnTares');
var ATbackground = String(parameters['background']);
var ATuseval = Number(parameters['useval'] || 10);
var ATargvalue = Number(parameters['argvalue'] || 11);

var calconly = 0; //ループ計算用変数の先定義
var ATplusup = String(parameters['plusup']);
ATplusup = ATplusup.split(' ');
for (var i = 0; i < ATplusup.length; ++i) {
    calconly = Number(ATplusup[i] || 1);
    ATplusup[i] = Math.abs(calconly);
}

var ATpluscost = String(parameters['pluscost']);
ATpluscost = ATpluscost.split(' ');
for (var i = 0; i < ATpluscost.length; ++i) {
    calconly = Number(ATpluscost[i] || 1);
    ATpluscost[i] = Math.abs(calconly);
}

var ATplusmax = String(parameters['plusmax']);
ATplusmax = ATplusmax.split(' ');
for (var i = 0; i < ATplusmax.length; ++i) {
    calconly = Number(ATplusmax[i] || 0);
    ATplusmax[i] = Math.abs(calconly);
}

var ATrateS = Number(parameters['rateS'] || 5);
var ATlvvalue = Number(parameters['lvvalue'] || 4);
var ATpluslvup = Number(parameters['pluslvup']);
var AThelptext = Number(parameters['helptext'] || 1);
var ATsmiletext = String(parameters['smiletext'] || 'P');
var ATmaxtext = String(parameters['maxtext'] || '上限です');
var ATresettext = String(parameters['resettext']);
var ATcomtext = String(parameters['comtext'] || 'egao');
var ATdisplay = Number(parameters['display'] || 100);
var ATcompletion = parameters['completion'] === 'true';
var ATokname = String(parameters['okname'] || 'Decision2');
var ATokvolume = Number(parameters['okvolume'] || 90);
var ATokpitch = Number(parameters['okpitch'] || 100);
var ATokpan = Number(parameters['okpan'] || 0);

var ATplayok = {"name":ATokname,"pan":ATokpan,"pitch":ATokpitch,"volume":ATokvolume};

//Game
var _Game_Interpreter_pluginCommand =
     Game_Interpreter.prototype.pluginCommand;
     Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
        switch(command){

          case 'ATGrowing':
              SceneManager.push(Scene_ATGrowing);
          break;

          case 'ATdevide':
              $gameVariables.ATdevide(args[0], args[1], args[2]);
          break;

          case 'ATinit':
              $gameVariables.ATinit();
          break;

          case 'ATreset':
              $gameVariables.ATreset(args[0], args[1]);
          break;

        }
};

Game_Variables.prototype.ATdevide = function(id, id2, devide) {
    if(!this._data[ATuseval]) this.ATinit();

    for(var i = this._data[ATuseval].length; i < $dataActors.length; i++){
        this._data[ATuseval][i] = 0;
    }

    var val1 = this.value(id);
    var val2 = 0;
    var party = 1;
    var calc = true;
    var actid = 0;
    devide = eval(devide);

    switch(id2){
          case 'A':
              party = $dataActors.length - 1;
              val2 = 1;
          break;

          case 'B':
              party = $gameParty.battleMembers().length;
          break;

          case 'C':
              party = $gameParty.size();
              calc = 'this.value(ATargvalue) == $gameActors._data[actid]._classId';
              devide = false;
          break;

          case 'L':
              var backactor = $gameParty.size() - 1;
              actid = $gameParty.members()[backactor].actorId();
              val2 = 2;
          break;

          case 'P':
              party = $gameParty.size();
          break;

          case 'S':
              party = $gameParty.size();
              calc = '$gameActors.actor(actid).isStateAffected(this.value(ATargvalue))';
              devide = false;
          break;

          case 'V':
              actid = this.value(ATargvalue);
              val2 = 2;
          break;

          default:
              console.log('引数id2が間違っています。');
          return;
        }

    if(devide) val1 = Math.floor(val1 / party);
    for(var i = 0; i < party; i++){
        if(val2 == 0){
            actid = $gameParty.members()[i].actorId();
        }else if(val2 == 1){
            actid = i + 1;
        }
        if(eval(calc)){
            this._data[ATuseval][actid] += val1 * $gameActors.actor(actid).stateRate(ATrateS);
        }
    }
    this.ATallclamp();
};

Game_Variables.prototype.ATinit = function() {
    this._data[ATuseval] = [];
    for(var i = 0; i < $dataActors.length; i++){
        this._data[ATuseval][i] = 0;
    }
};

Game_Variables.prototype.ATreset = function(actid, value) {
    if(this._data[ATuseval]) {
        if(actid - 1 <= 0) return false;
        this._data[ATuseval][actid] = Number(value);
    } else{
        this.ATinit();
    }
};

Game_Variables.prototype.ATallclamp = function() {
    if(!this._data[ATuseval]) this.ATinit();
    var value;
    var value2;
    // console.log(this._data[ATuseval]);
    for(var i = 0; i < this._data[ATuseval].length; i++){
        // console.log(i);
        value = this._data[ATuseval][i];
        value2 = Math.round(value.clamp(0, 9999999));
        this._data[ATuseval][i] = value2;
    }
};

if(ATcompletion){

var _Game_BattlerBase_addParam = Game_BattlerBase.prototype.addParam;
Game_BattlerBase.prototype.addParam = function(paramId, value) {
    if(value > 0){
        if(paramId === 0){
            this._hp = this._hp + value;
        }else if(paramId === 1){
            this._mp = this._mp + value;
        }
    }
    _Game_BattlerBase_addParam.call(this, paramId, value)
};

}

//装備を除いた加算値の計算
Game_Actor.prototype.ATparamPlus = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    return value;
};

var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    _Game_Actor_levelUp.call(this);

    var args = [""+ATlvvalue, "V"];
    $gameVariables.setValue(ATargvalue, this.actorId());
    $gameVariables.setValue(ATlvvalue, ATpluslvup);
    if(SceneManager._scene.constructor === Scene_Battle) {
        $gameTroop._interpreter.pluginCommand("ATdevide", args);
    } else {
        $gameMap._interpreter.pluginCommand("ATdevide", args);
    }
};

//Scene
function Scene_ATGrowing() {
    this.initialize.call(this);
}

Scene_ATGrowing.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ATGrowing.prototype.constructor = Scene_ATGrowing;

Scene_ATGrowing.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.apply(this, arguments);
    $gameVariables.ATallclamp();
};

Scene_ATGrowing.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createATSelActWindow();
    this.createViewActWindow();
    this.createWakeWindow();
};

Scene_ATGrowing.prototype.createBackground = function() {
    if(ATbackground) {
        // console.log("back:"+ATbackground);
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(ATbackground);
        this.addChild(this._backgroundSprite);
    } else {
        Scene_MenuBase.prototype.createBackground.call(this);
    }
};

Scene_ATGrowing.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

Scene_ATGrowing.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help();
    this.addWindow(this._helpWindow);
};

Scene_ATGrowing.prototype.createATSelActWindow = function() {
    this._actorWindow = new Window_ATSelAct(0, 0, 0, 0); //Selectable
    this._actorWindow.setHelpWindow(this._helpWindow);
    var load = this._actorWindow;
    var i = 0;
    var waiter = setInterval(function(){
        load.refresh();
        i++;
    if (i > 2) clearInterval(waiter);
    }, 120);
    this._actorWindow.y = this._helpWindow.height;
    this._actorWindow.width = Graphics.boxWidth;
    this._actorWindow.height = Graphics.boxHeight - this._helpWindow.height;
    this._actorWindow.setHandler('ok', this.onselOk.bind(this));
    this._actorWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._actorWindow);
    this._actorWindow.refresh();
    this._actorWindow.select(0);
};

Scene_ATGrowing.prototype.createViewActWindow = function() {
    this._viewWindow = new Window_ViewAct(0, 0); //Base
    this.addWindow(this._viewWindow);
};

Scene_ATGrowing.prototype.createWakeWindow = function() {
    this._wakeWindow = new Window_Wake(0, 0, 0, 0); //Selectable
    this._wakeWindow.y = this._viewWindow.height;
    this._wakeWindow.width = Graphics.boxWidth;
    this._wakeWindow.setHandler('ok', this.onwakeOk.bind(this));
    // this._wakeWindow.setHandler('right', this.onwakeRight.bind(this));
    // this._wakeWindow.setHandler('left', this.onwakeLeft.bind(this));
    this._wakeWindow.setHandler('cancel', this.wakecancel.bind(this));
    this.addWindow(this._wakeWindow);
};

Scene_ATGrowing.prototype.onselOk = function() {
    var actor = $gameParty.members()[this._actorWindow._index];
    this._helpWindow.hide();
    this._actorWindow.hide();
    this._viewWindow.setActor(actor);
    this._wakeWindow.setActor(actor);
    this._wakeWindow.activate();
    this._viewWindow.show();
    this._wakeWindow.show();
};

Scene_ATGrowing.prototype.wakecancel = function() {
    this._viewWindow.hide();
    this._wakeWindow.hide();
    this._actorWindow.activate();
    this._actorWindow.refresh();
    this._actorWindow.select(0);
    this._helpWindow.show();
    this._actorWindow.show();
};

Scene_ATGrowing.prototype.onwakeOk = function() {
    var index = this._wakeWindow._index;
    var actor = this._wakeWindow._actor;
    var point = $gameVariables._data[ATuseval][actor.actorId()];
    if(ATresettext && index == this._wakeWindow.maxItems() - 1){
        var sum = 0;
        for(var i = 0; i < index; i++){
            var value = actor.ATparamPlus(i);
            var up = this._wakeWindow.Upper(i);
            var cost = this._wakeWindow.CostOut(i);
            if(value <= 0 || up == 0) continue;
            value /= up;
            value *= cost;
            sum += value;
        }
        sum = Math.round(sum);
        $gameVariables._data[ATuseval][actor.actorId()] = point + sum;
        actor.clearParamPlus();
        actor.refresh();
    }else{
        var cost = this._wakeWindow.CostOut(index);
        var up = this._wakeWindow.Upper(index);
        up = Math.min(up, this._wakeWindow.Plusmax(index) - actor.ATparamPlus(index));
        $gameVariables._data[ATuseval][actor.actorId()] = point - cost;
        actor.addParam(index, up);
    }
    this._viewWindow.refresh();
    this._wakeWindow.activate();
    this._wakeWindow.refresh();
};

Scene_ATGrowing.prototype.onwakeRight = function() {
    var index = this._wakeWindow._index;
    var actor = this._wakeWindow._actor;
    var point = $gameVariables._data[ATuseval][actor.actorId()];
    var cost = this._wakeWindow.CostOut(index);
    var up = this._wakeWindow.Upper(index);
    up = Math.min(up, this._wakeWindow.Plusmax(index) - actor.ATparamPlus(index));
    $gameVariables._data[ATuseval][actor.actorId()] = point - cost;
    actor.addParam(index, up);
    this._viewWindow.refresh();
    this._wakeWindow.activate();
    this._wakeWindow.refresh();
};

Scene_ATGrowing.prototype.onwakeLeft = function() {
    // var index = this._wakeWindow._index;
    // var actor = this._wakeWindow._actor;
    // var point = $gameVariables._data[ATuseval][actor.actorId()];
    // var cost = this._wakeWindow.CostOut(index);
    // var up = this._wakeWindow.Upper(index);
    // up = Math.min(up, this._wakeWindow.Plusmax(index) - actor.ATparamPlus(index));
    // $gameVariables._data[ATuseval][actor.actorId()] = point + cost;
    // actor.addParam(index, -up);
    // this._viewWindow.refresh();
    // this._wakeWindow.activate();
    // this._wakeWindow.refresh();
};

var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('atgrow',   this.commandGrow.bind(this));
};

Scene_Menu.prototype.commandGrow = function() {
    SceneManager.push(Scene_ATGrowing);
};

//Window
Window_Base.prototype.ATdrawActorPoint = function(actor, x, y, width) {
    width = width || 160;
    this.changeTextColor(this.tpCostColor());
    this.drawText(ATsmiletext, x, y, width);
    this.resetTextColor();
    this.drawText($gameVariables._data[ATuseval][actor.actorId()], x + 50, y, width);
};

Window_Base.prototype.ATdrawCurrent = function(current, max, x, y, width) {
    this.resetTextColor();
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    this.drawText(current, x3, y, valueWidth, 'right');
    this.drawText('/', x2, y, slashWidth, 'right');
    this.drawText(max, x1, y, valueWidth, 'right');
};

var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if(this.isATGrowDisplay()){
       var enabled = this.isATGrowEnabled();
       this.addCommand(ATcomtext, 'atgrow', enabled);
    }
};

Window_MenuCommand.prototype.isATGrowDisplay = function() {
    return $gameSwitches.value(ATdisplay) > 0; //つまりスイッチの真偽を返す。
};

Window_MenuCommand.prototype.isATGrowEnabled = function() {
    return $gameParty.size() > 0;
};

function Window_ATSelAct() {
    this.initialize.apply(this, arguments);
}

Window_ATSelAct.prototype = Object.create(Window_Selectable.prototype);
Window_ATSelAct.prototype.constructor = Window_ATSelAct;

Window_ATSelAct.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
};

Window_ATSelAct.prototype.maxItems = function() {
    return $gameParty.size();
};

Window_ATSelAct.prototype.itemHeight = function() {
    return 48;
};

Window_ATSelAct.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._list[this._index]); //indexのactorを取得
};

Window_ATSelAct.prototype.isEnabled = function(actor) {
    return actor.isAlive();
};

Window_ATSelAct.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var actor = this._list[index];
    this.changePaintOpacity(this.isEnabled(actor));
    this.drawActorCharacter(actor, rect.x + 48, rect.y + 48);
    this.drawActorName(actor, rect.x + 120, rect.y);
    this.drawActorLevel(actor, rect.x + 320, rect.y);
    this.ATdrawActorPoint(actor, rect.x + 520, rect.y);
    this.changePaintOpacity(1);
};

Window_ATSelAct.prototype.updateHelp = function() {
    this.setHelpWindowItem($dataSkills[AThelptext]);
};

Window_ATSelAct.prototype.refresh = function() {
    var i,actor;
    this._list = [];
    for(i = 0; i < $gameParty.size(); i++){
        actor = $gameParty.members()[i];
        this._list.push(actor);
    }
    this.createContents();
    this.drawAllItems();
};

function Window_ViewAct() {
    this.initialize.apply(this, arguments);
}

Window_ViewAct.prototype = Object.create(Window_Base.prototype);
Window_ViewAct.prototype.constructor = Window_ViewAct;

Window_ViewAct.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.hide();
};

Window_ViewAct.prototype.setActor = function(actor) {
    if(this._actor !== actor){
      this._actor = actor;
      this.refresh();
    }
};

Window_ViewAct.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_ViewAct.prototype.windowHeight = function() {
    return this.fittingHeight(2);
};

Window_ViewAct.prototype.refresh = function() {
    var x = this.textPadding();
    var actor = this._actor;
    this.contents.clear();
    this.drawActorCharacter(actor, x + 48, 56);
    this.drawActorName(actor, x + 120, 16);
    this.drawActorLevel(actor, x + 320, 16);
    this.ATdrawActorPoint(actor, x + 520, 16);
};


function Window_Wake() {
    this.initialize.apply(this, arguments);
}

Window_Wake.prototype = Object.create(Window_Selectable.prototype);
Window_Wake.prototype.constructor = Window_Wake;

Window_Wake.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.hide();
};

Window_Wake.prototype.setActor = function(actor) {
    if(this._actor !== actor){
       this._actor = actor;
       this.select(0);
       this.height = this.fittingHeight(this.maxRows());
       this.refresh();
    }
};

Window_Wake.prototype.maxItems = function() {
    if(!this._actor) return 1; //必要な時に更新される。
    var a = ATresettext ? 1 : 0;
    return Math.min(ATplusup.length, 8) + a;
};

Window_Wake.prototype.maxCols = function() {
   return 1;
};

Window_Wake.prototype.maxRows = function() {
   return this.maxItems();
};

Window_Wake.prototype.isCurrentItemEnabled = function() {
    var index = this._index;
    return this.isEnabled(this._actor, index);
};

Window_Wake.prototype.isEnabled = function(actor, index) {
    if(ATresettext && index == this.maxItems() - 1) return true;
    var point = $gameVariables._data[ATuseval][actor.actorId()];
    return this.CostOut(index) <= point && this.ATnomax(index, actor);
};

Window_Wake.prototype.Upper = function(index) {
    return ATplusup[index];
};

Window_Wake.prototype.CostOut = function(index) {
    return ATpluscost[index];
};

Window_Wake.prototype.Plusmax = function(index) {
    return ATplusmax[index];
};

Window_Wake.prototype.ATnomax = function(index, actor) {
    return this.Plusmax(index) > actor.ATparamPlus(index);
};

Window_Wake.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var actor = this._actor;
    if(ATresettext && index == this.maxItems() - 1){
        this.changeTextColor(this.mpGaugeColor2());
        this.drawText(ATresettext, rect.x, rect.y, this.width);
        this.resetTextColor();
    }else{
        this.paramWrite(rect, actor, index);
        this.paramCost(rect, actor, index);
    }
};

Window_Wake.prototype.paramWrite = function(rect, actor, index) {
    var x = rect.x;
    var y = rect.y;
    var ww = 140;
    var value = actor.param(index);
    var newvalue = this.Upper(index);
    newvalue = Math.min(newvalue, this.Plusmax(index) - actor.ATparamPlus(index))
    this.changePaintOpacity(this.isEnabled(actor, index));
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(index), x, y, ww);
    this.resetTextColor();
    this.drawText(value, x + ww, y, 48, 'right');
    this.drawText('+', x + ww + 80, y, 32, 'center');
    if(this.ATnomax(index, actor)){
        this.drawText(newvalue, x + ww + 128, y, 48, 'right');
    }else{
        this.drawText(0, x + ww + 128, y, 48, 'right');
    }
    this.changePaintOpacity(1);
};

Window_Wake.prototype.paramCost = function(rect, actor, index) {
    var x = rect.x + 380;
    var y = rect.y;
    var ww = 128;
    var current = actor.ATparamPlus(index);
    var max = this.Plusmax(index);
    var rate = current / max;
    rate = rate.clamp(0, 1);
    this.changeTextColor(this.mpGaugeColor2());
    if(this.ATnomax(index, actor)){
        this.drawText(ATsmiletext + ' ' + this.CostOut(index), x, y, ww);
    }else{
        this.drawText(ATmaxtext, x, y, ww);
    }
    this.drawGauge(x + ww, y, ww, rate, this.tpGaugeColor1(), this.tpGaugeColor1());
    this.ATdrawCurrent(current, max, x + ww, y, ww);
};

Window_Wake.prototype.refresh = function() {
    this._list = [];
    this.createContents();
    this.drawAllItems();
};

Window_Wake.prototype.playOkSound = function() {
    AudioManager.playStaticSe(ATplayok);
};

Window_Wake.prototype.cursorRight = function(wrap) {
    this.callHandler('right');
};

Window_Wake.prototype.cursorLeft = function(wrap) {
    this.callHandler('left');
};

})();
