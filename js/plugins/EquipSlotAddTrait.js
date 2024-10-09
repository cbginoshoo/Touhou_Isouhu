//
//  装備スロット追加特徴 ver1.00
//
// author yana
//

var Imported = Imported || {};
Imported['EquipSlotAddTrait'] = 1.00;
/*:
 * @plugindesc ver1.00/装備スロットを追加する特徴を設定できるようにします。
 * @author Yana
 * 
 * @help ------------------------------------------------------
 * 使用方法
 * ------------------------------------------------------
 * 特徴を持ったオブジェクトのメモ欄に
 * <装備スロット:x+y>
 * または、
 * <AddEquipSlot:x+y>
 * と記述することで、xのスロットをy個増やします。
 * +を-にすることで減らすことも可能です。
 * 
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------ 
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.00:
 * 公開
 */
(function(){
	////////////////////////////////////////////////////////////////////////////////////
	
	var parameters = PluginManager.parameters('EquipSlotAddTrait');
	
	////////////////////////////////////////////////////////////////////////////////////
	
	DataManager.addEquipSlots = function(item) {
		if (!item){ return [] }
		if (item._addEquipSlots === undefined){
			item._addEquipSlots = [];
			var texts = item.note.split('\n');
			for (var i=0,max=texts.length;i<max;i++){
				var text = texts[i];
				if (text.match(/<(?:装備スロット|AddEquipSlot):(\d+)([+-]\d+)>/)){
					item._addEquipSlots.push([Number(RegExp.$1),Number(RegExp.$2)]);
				}
			}
		}
		return item._addEquipSlots;
	};
	
	var __DManager_loadGame = DataManager.loadGame;
	DataManager.loadGame = function(savefileId) {
		var result = __DManager_loadGame.call(this,savefileId);
		if (result){ $gameParty.allMembers().forEach(function(m){ m.refresh() })}
		return result;
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	var __GActor_equipSlots = Game_Actor.prototype.equipSlots;
	Game_Actor.prototype.equipSlots = function() {
		var slots = __GActor_equipSlots.call(this);
		var objects = this.traitObjects().clone();
		return objects.reduce(function(r,to){
			var addSlots = DataManager.addEquipSlots(to);
			for (var i=0,max=addSlots.length;i<max;i++){
				var addSlot = addSlots[i];
				for (var j=0;j<addSlot[1];j++){
					if (!this._equips[r.length]){
						this._equips[r.length] = new Game_Item();
					}
					r = r.concat(addSlot[0]);
				}
				for (var j=0;j<-addSlot[1];j++){
					var index = r.indexOf(addSlot[0]);
					if (index >= 0){ r.splice(index,1) }
				}
			}
			return r;
		}.bind(this),slots);
	};
	
	////////////////////////////////////////////////////////////////////////////////////
	
	var __WESlot_refresh = Window_EquipSlot.prototype.refresh;
	Window_EquipSlot.prototype.refresh = function(){
		if (this._actor){ this._actor.refresh() }
		__WESlot_refresh.call(this);
	};
}());