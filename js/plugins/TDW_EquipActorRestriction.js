//=============================================================================
// TDW_EquipActorRestriction.js
//=============================================================================

/*:
 * @plugindesc Allows you to set Armor and Weapons to only be equipable by
 * certain Actors.
 * @author Tyler Wright
 * @help
Place the following tags in Armor or Weapon note boxes:

<actorRestriction: x>
Restricts the equip to only be equipped by actor with ID of x.

<actorRestriction: x y z>
Restricts the equip to only be equipped by actor with ID of x, y, and z.
You can place as many ID's in the tag, as long as they are all integers and
have spaces between them.

<actorRestriction: Bob>
Restricts the equip to only be equipped by actor named Bob.

<actorRestriction: Bob Mary Joe>
Restricts the equip to only be equipped by actors named Bob, Mary, and Joe.
You can place as many names in the tag, as long as they are all single words
and have spaces between them.

You can also do any combination of names and ID numbers, as long as there are spaces between each.
Example:

<actorRestriction: Bob 1 Joe 3> will work just fine for actors Bob and Joe, as well as actors with
ids of 1 and 3.

 */
 (function() {

	var _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
	 Game_BattlerBase.prototype.canEquipWeapon = function(item) {
		if (item.meta.actorRestriction != undefined){
			return this.equipActorCheck(item) && this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
		}
		//return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
		return _Game_BattlerBase_canEquipWeapon.call(this, item);
	};
	var _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
	Game_BattlerBase.prototype.canEquipArmor = function(item) {
		if (item.meta.actorRestriction != undefined){
			return this.equipActorCheck(item) && this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
		}
		//return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
		return _Game_BattlerBase_canEquipArmor.call(this, item);
	};

    Game_BattlerBase.prototype.equipActorCheck = function(item) {
		var tag = String(item.meta.actorRestriction).split(" ");
		// console.log(tag);
		var status = false;
		for (i=0; i<tag.length; i++) {
			if (isNaN(tag[i])) {
				//console.log("NaN");
				var name = tag[i].toLowerCase();
				//console.log(name);
				//console.log(this.name().toLowerCase() === name);
				if (this.name().toLowerCase() === name) {status = true;}
			}else{
				var id = Number(tag[i]);
				if (this._actorId === id){status = true;}
			}
		}
		return status;
	};

 })();