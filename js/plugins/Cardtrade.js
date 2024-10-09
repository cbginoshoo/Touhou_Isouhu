/*:
@plugindesc
メダルや貝殻など、特定のアイテムをお金の代わりに使えるショップを作成することができます

@author
シトラス

@param	　　　tradeShopSwitchId
@desc	　　　このスイッチがONの時にショップを起動すると
交換ショップになります
@type switch
@default	1

@param	　　　tradeItemId
@desc	　　　この番号のIDを持つアイテムを交換に使用します
@type num
@default	1

@param	　　　tradeItemTanni
@desc	　　　アイテムの単位（個、枚など、アイテムをどう数えるかです）
@default	枚

@help
注意点：
交換ショップのスイッチは、イベントが終わった後に自分でOFFしてください

■追加機能
交換アイテムのIDと単位をプラグインコマンドによって変更可能に。

Trade item [ID] [単位]

[例]
Trade item 12 枚 : トレード対象をID12番のアイテムにし、その単位を"枚"にする。

*/

var hoge = PluginManager.parameters("Cardtrade");

//このスイッチがONになっていれば、交換ショップとして扱う
var tradeShopSwitchId = Number(hoge.tradeShopSwitchId);

//交換に使うアイテムのID
var initTradeItemId = Number(hoge.tradeItemId);

//交換に使うアイテムの単位
var initTradeItemTanni = hoge.tradeItemTanni;


var _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_Game_System_initialize.call(this);
	this._tradeItemId = initTradeItemId;
	this._tradeItemUnit = initTradeItemTanni;
};

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	_Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === "Trade") {
		switch (args[0]) {
			case "item":
				$gameSystem.setTradeItemType(args[0]);
				$gameSystem.setTradeItemId(Number(args[1]));
				$gameSystem.setTradeItemUnit(args[2]);
				break;
			case "armor":
				$gameSystem.setTradeItemType(args[0]);
				$gameSystem.setTradeItemId(Number(args[1]));
				$gameSystem.setTradeItemUnit(args[2]);
				break;
		}
	}
};

Game_System.prototype.setTradeItemId = function(itemId) {
	this._tradeItemId = itemId;
};

Game_System.prototype.setTradeItemType = function(type) {
	this._tradeItemType = type;
};

Game_System.prototype.tradeItemId = function() {
	return this._tradeItemId;
};

Game_System.prototype.tradeItemType = function() {
	return this._tradeItemType;
};

Game_System.prototype.setTradeItemUnit = function(unit) {
	this._tradeItemUnit = unit;
};

Game_System.prototype.tradeItemUnit = function() {
	return this._tradeItemUnit;
};

Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
    this._goods = goods;
	if($gameSwitches.value(tradeShopSwitchId) ){
		this._purchaseOnly = true;
	}else{
		this._purchaseOnly = purchaseOnly;
	}
    this._item = null;
};

//購入を実行
Scene_Shop.prototype.doBuy = function(number) {
	if($gameSwitches.value(tradeShopSwitchId) ){
		switch ($gameSystem.tradeItemType()) {
			case "item":
				$gameParty.gainItem($dataItems[$gameSystem.tradeItemId()],-1*number*this.buyingPrice() );
				break;
			case "armor":
				$gameParty.gainItem($dataArmors[$gameSystem.tradeItemId()],-1*number*this.buyingPrice() );
				break;
			default:
				$gameParty.loseGold(number * this.buyingPrice());
				break;
		}
		// $gameParty.gainItem($dataItems[$gameSystem.tradeItemId()],-1*number*this.buyingPrice() );
	}else{
		$gameParty.loseGold(number * this.buyingPrice());
	}
    $gameParty.gainItem(this._item, number);
};

//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.
// ゴールドの表示ウィンドウを司るスクリプト

function Window_Gold() {
    this.initialize.apply(this, arguments);
}

Window_Gold.prototype = Object.create(Window_Base.prototype);
Window_Gold.prototype.constructor = Window_Gold;

Window_Gold.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

Window_Gold.prototype.windowWidth = function() {
    return 240;
};

Window_Gold.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_Gold.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();

	if($gameSwitches.value(tradeShopSwitchId) ){
		this.drawCurrencyValue(this.value(), $gameSystem.tradeItemUnit(), x, 0, width);
	}else{
		this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
	}
};

Window_Gold.prototype.value = function() {
	if($gameSwitches.value(tradeShopSwitchId) ){
		// return $gameParty.numItems($dataItems[$gameSystem.tradeItemId()]);
		switch ($gameSystem.tradeItemType()) {
			case "item":
				return $gameParty.numItems($dataItems[$gameSystem.tradeItemId()]);
			case "armor":
				return $gameParty.numItems($dataArmors[$gameSystem.tradeItemId()]);
			default:
				return $gameParty.gold();
		}
	}else{
		return $gameParty.gold();
	}
};

Window_Gold.prototype.currencyUnit = function() {
    return TextManager.currencyUnit;
};

Window_Gold.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

Window_ShopNumber.prototype.drawTotalPrice = function() {
    var total = this._price * this._number;
    var width = this.contentsWidth() - this.textPadding();

	if($gameSwitches.value(tradeShopSwitchId) ){
		this.drawCurrencyValue(total, $gameSystem.tradeItemUnit(), 0, this.priceY(), width);
	}else{
		this.drawCurrencyValue(total, this._currencyUnit, 0, this.priceY(), width);
	}
};