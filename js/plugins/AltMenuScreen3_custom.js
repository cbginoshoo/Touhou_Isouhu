//=============================================================================
// AltMenuScreen3_custom.js
// Version
// 1.0.1 2016/07/22 リザーブメンバーの立ち絵が初回表示時に正しく表示されない問題の修正
//                  スクロール可能であることを示す矢印スプライトの向きがおかしい問題の修正
//=============================================================================

/*:
 * @plugindesc Yet Another menu screen layout.
 * @author Sasuke KANNAZUKI, Yoji Ojima
 *
 * @default
 * @param bgBitmapMenu
 * @desc background bitmap file at menu scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapItem
 * @desc background bitmap file at item scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapSkill
 * @desc background bitmap file at skill scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapEquip
 * @desc background bitmap file at equip scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapStatus
 * @desc background bitmap file at status scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapOptions
 * @desc background bitmap file at option scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapFile
 * @desc background bitmap file at save/load scene. put at img/pictures.
 * @default
 *
 * @param bgBitmapGameEnd
 * @desc background bitmap file at gameEnd scene. put at img/pictures.
 * @default
 *
 * @param maxColsMenu
 * @desc max column at menu window
 * @default 4
 *
 * @param commandRows
 * @desc number of visible rows at command window
 * @default 2
 *
 * @param isDisplayStatus
 * @desc whether display status or not. (1 = yes, 0 = no)
 * @default 1
 *
 * @help This plugin does not provide plugin commands.
 *  The differences with AltMenuscreen are follows:
 *   - windows are transparent at all menu scene.
 *   - it can set the background bitmap for each scenes at menu.
 *   - picture is actors' original
 *
 * Actor' note:
 * <stand_picture:filename> set actor's standing picture at menu.
 *   put file at img/pictures.
 *
 * preferred size of actor's picture:
 * width: 174px(maxColsMenu=4), 240px(maxColsMenu=3)
 * height: 408px(commandRows=2), 444px(commandRows=1)
 */

/*:ja
 * @plugindesc レイアウトの異なるメニュー画面
 * @author 神無月サスケ, Yoji Ojima
 *
 * @param bgBitmapMenu
 * @text メニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc メニュー背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityMenu
 * @text メニュー不透明度
 * @type number
 * @desc メニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapItem
 * @text アイテムメニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc アイテム画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityItem
 * @text アイテムメニュー不透明度
 * @type number
 * @desc アイテムメニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapSkill
 * @text スキルメニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc スキル画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacitySkill
 * @text スキルメニュー不透明度
 * @type number
 * @desc スキルメニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapEquip
 * @text 装備メニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc 装備画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityEquip
 * @text 装備メニュー不透明度
 * @type number
 * @desc 装備メニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapStatus
 * @text ステータスメニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc ステータス画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityStatus
 * @text ステータスメニュー不透明度
 * @type number
 * @desc ステータスメニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapOptions
 * @text オプションメニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc オプション画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityOptions
 * @text オプションメニュー不透明度
 * @type number
 * @desc オプションメニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapFile
 * @text セーブメニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc セーブ／ロード画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityFile
 * @text セーブメニュー不透明度
 * @type number
 * @desc セーブメニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param bgBitmapGameEnd
 * @text ゲーム終了メニュー背景画像
 * @type file
 * @require 1
 * @dir img/pictures
 * @desc ゲーム終了画面背景にするpngファイルです。
 * img/pictures に置いてください。
 * @default
 *
 * @param bgOpacityGameEnd
 * @text ゲーム終了メニュー不透明度
 * @type number
 * @desc ゲーム終了メニューウィンドウの不透明度です。0で完全に透明になります。(0-255)
 * @default 255
 *
 * @param maxColsMenu
 * @text アクター表示数
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @type number
 * @min 0
 * @decimals 0
 * @default 4
 *
 * @param commandRows
 * @text コマンドウィンドウ行数
 * @desc コマンドウィンドウの行数です。
 * @type number
 * @min 1
 * @decimals 0
 * @default 2
 *
 * @param isDisplayStatus
 * @text ステータス表示切替
 * @desc ステータスを表示するかしないかを選びます。(1 = yes, 0 = no)
 * @type select
 * @option 1
 * @option 0
 * @default 1
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  AltMenuscreen との違いは以下です:
 *  - メニュー画面すべてのウィンドウに対し不透明度が設定できます。
 *  - メニューそれぞれのシーンに背景ビットマップを付けることが出来ます。
 *  - アクターに立ち絵を利用します。
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture_75:ファイル名> アクターのHPが75%以上のときに表示する立ち絵になります。
 * <stand_picture_50:ファイル名> アクターのHPが50%以上のときに表示する立ち絵になります。
 * <stand_picture_25:ファイル名> アクターのHPが25%以上のときに表示する立ち絵になります。
 * <stand_picture_0:ファイル名>  アクターのHPが25%未満のときに表示する立ち絵になります。
 *   ファイル名が、そのアクターの立ち絵になります。
 *   ファイルは img/pictures に置いてください。
 *
 * 望ましいアクター立ち絵のサイズ：
 * 幅：3列:240px, 4列：174px
 * 高さ： コマンドウィンドウ 1行:444px 2行:408px
 *
 */


(function() {
    'use strict';

    var paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    var paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    var Parameters = paramParse(PluginManager.parameters('AltMenuScreen3_custom'));

    // set parameters
    var parameters = PluginManager.parameters('AltMenuScreen3_custom');
    var bgBitmapMenu = parameters['bgBitmapMenu'] || '';
    var bgOpacityMenu = Number(parameters['bgOpacityMenu']);
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgOpacityItem = Number(parameters['bgOpacityItem']);
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgOpacitySkill = Number(parameters['bgOpacitySkill']);
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgOpacityEquip = Number(parameters['bgOpacityEquip']);
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgOpacityStatus = Number(parameters['bgOpacityStatus']);
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgOpacityOptions = Number(parameters['bgOpacityOptions']);
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgOpacityFile = Number(parameters['bgOpacityFile']);
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var bgOpacityGameEnd = Number(parameters['bgOpacityGameEnd']);
    var maxColsMenuWnd = Number(parameters['maxColsMenu'] || 4);
    var rowsCommandWnd = Number(parameters['commandRows'] || 2);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);

   //
   // make transparent windows for each scenes in menu.
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this._statusWindow.x = 0;
        this._statusWindow.y = this._commandWindow.height;
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        // make transparent for all windows at menu scene.
        this._statusWindow.opacity = bgOpacityMenu;
        this._goldWindow.opacity = bgOpacityMenu;
        this._commandWindow.opacity = bgOpacityMenu;
    };

    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._helpWindow.opacity = bgOpacityItem;
        this._categoryWindow.opacity = bgOpacityItem;
        this._itemWindow.opacity = bgOpacityItem;
        this._actorWindow.opacity = bgOpacityItem;
    };

    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._helpWindow.opacity = bgOpacitySkill;
        this._skillTypeWindow.opacity = bgOpacitySkill;
        this._statusWindow.opacity = bgOpacitySkill;
        this._itemWindow.opacity = bgOpacitySkill;
        this._actorWindow.opacity = bgOpacitySkill;
    };

    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._helpWindow.opacity = bgOpacityEquip;
        this._statusWindow.opacity = bgOpacityEquip;
        this._commandWindow.opacity = bgOpacityEquip;
        this._slotWindow.opacity = bgOpacityEquip;
        this._itemWindow.opacity = bgOpacityEquip;
    };

    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.call(this);
        this._statusWindow.opacity = bgOpacityStatus;
    };

    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.opacity = bgOpacityOptions;
    };

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._helpWindow.opacity = bgOpacityFile;
        this._listWindow.opacity = bgOpacityFile;
    };

    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.call(this);
        this._commandWindow.opacity = bgOpacityGameEnd;
    };

    //
    // load bitmap that set in plugin parameter
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapMenu);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Menu_createBackground.call(this);
    };

    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function(){
        if(bgBitmapItem){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Item_createBackground.call(this);
    };

    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function(){
        if(bgBitmapSkill){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Skill_createBackground.call(this);
    };

    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function(){
        if(bgBitmapEquip){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Equip_createBackground.call(this);
    };

    var _Scene_Status_createBackground =
     Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function(){
        if(bgBitmapStatus){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Status_createBackground.call(this);
    };

    var _Scene_Options_createBackground =
     Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function(){
        if(bgBitmapOptions){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Options_createBackground.call(this);
    };

    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_File_createBackground.call(this);
    };

    var _Scene_GameEnd_createBackground =
     Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function(){
        if(bgBitmapGameEnd){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_GameEnd_createBackground.call(this);
    };

    //
    // alt menu screen processes
    //
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 4;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return rowsCommandWnd;
    };

    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        var h1 = this.fittingHeight(1);
        var h2 = this.fittingHeight(rowsCommandWnd);
        return Graphics.boxHeight - h1 - h2;
    };

    Window_MenuStatus.prototype.maxCols = function() {
        return maxColsMenuWnd;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    var _Window_MenuStatus_drawItem = Window_MenuStatus.prototype.drawItem;
    Window_MenuStatus.prototype.drawItem = function(index) {
        var actor = $gameParty.members()[index];
        var hpRate = actor.hpRate();
        var bitmapName = null;
        var meta = $dataActors[actor.actorId()].meta;
        if(hpRate >= 0.75 && meta.stand_picture_75) {
            bitmapName = meta.stand_picture_75;
        } else if(hpRate >= 0.5 && meta.stand_picture_50) {
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_50;
        } else if(hpRate >= 0.25 && meta.stand_picture_25) {
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_25;
        } else if(meta.stand_picture_0){
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_0;
        }
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        if (bitmap && !bitmap.isReady()) {
            bitmap.addLoadListener(_Window_MenuStatus_drawItem.bind(this, index));
        } else {
            _Window_MenuStatus_drawItem.apply(this, arguments);
        }
    };

    Window_MenuStatus.prototype._refreshArrows = function() {
        Window.prototype._refreshArrows.call(this);
        var w = this._width;
        var h = this._height;
        var p = 24;
        var q = p / 2;

        this._downArrowSprite.rotation = 270 * Math.PI / 180;
        this._downArrowSprite.move(w - q, h / 2);
        this._upArrowSprite.rotation = 270 * Math.PI / 180;
        this._upArrowSprite.move(q, h / 2);
    };

    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var hpRate = actor.hpRate();
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = null;
        var meta = $dataActors[actor.actorId()].meta;
        if(hpRate >= 0.75 && meta.stand_picture_75) {
            bitmapName = meta.stand_picture_75;
        } else if(hpRate >= 0.5 && meta.stand_picture_50) {
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_50;
        } else if(hpRate >= 0.25 && meta.stand_picture_25) {
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_25;
        } else if(meta.stand_picture_0){
            bitmapName = $dataActors[actor.actorId()].meta.stand_picture_0;
        }
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if(bitmap){
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);
    };

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        if(!isDisplayStatus){
            return;
        }
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevel(actor, x, y + lineHeight * 1, width);
        this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
        this.drawActorInfoBgs(actor, x, bottom - lineHeight * 3, width, lineHeight * 3);
        this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
        this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
        this.drawActorIconBgs(actor, x, bottom - lineHeight * 1, width);
        this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
    };

    Window_Base.prototype.drawActorInfoBgs = function(actor, x, y, width, height) {
        width = width || 144;
        height = height || this.lineHeight();
        this.contents.blt(this.windowskin, 0, 0, 96, 96, x, y + 4, width, height);
    };

    Window_Base.prototype.drawActorIconBgs = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        for (var i = 0; i < icons.length; i++) {
            var bitmap = ImageManager.loadSystem('IconSet');
            var pw = Window_Base._iconWidth;
            var ph = Window_Base._iconHeight;
            var sx = 16 % 16 * pw;
            var sy = Math.floor(16 / 16) * ph;
            this.contents.blt(bitmap, sx, sy, pw, ph, x + Window_Base._iconWidth * i, y + 2);
        }
    };

    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = this.fittingHeight(2);
    };

})();
