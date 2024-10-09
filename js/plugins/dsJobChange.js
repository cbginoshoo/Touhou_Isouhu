//==============================================================================
// dsJobChange.js
// Copyright (c) 2015 - 2018 DOURAKU
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc ジョブチェンジシステム ver1.11.5
 * @author 道楽
 *
 * @noteParam faceName
 * @noteRequire 1
 * @noteDir img/faces/
 * @noteType file
 * @noteData classes
 *
 * @noteParam characterName
 * @noteRequire 1
 * @noteDir img/characters/
 * @noteType file
 * @noteData classes
 *
 * @noteParam battlerName
 * @noteRequire 1
 * @noteDir img/sv_actors/
 * @noteType file
 * @noteData classes
 *
 * @param Menu Command Enable
 * @desc メニューにコマンドを表示するか
 * @default true
 *
 * @param Command Name
 * @desc ジョブチェンジコマンドの名称
 * @default ジョブチェンジ
 *
 * @param Effect Animation Id
 * @desc 演出用アニメーション番号
 * @default 52
 *
 * @param Optimize Equip Enable
 * @desc ジョブチェンジ後に最強装備にするか
 * @default true
 *
 * @param Optimize Equip Text
 * @desc ジョブチェンジ後の最強装備にした際に表示されるメッセージ
 * @default 最強装備します
 *
 * @param Keep Exp
 * @desc ジョブチェンジ後も経験値を維持するか
 * @default false
 *
 * @help
 * このプラグインは以下のメモタグの設定ができます。
 *
 * -----------------------------------------------------------------------------
 * アクターに設定するメモタグ
 *
 * <ignoreChangeImage>
 *   ジョブチェンジしても見た目が変更されないようになります。
 *
 * <classLevel[職業番号]:[初期レベル]>
 *   職業の初期レベルを設定します。
 *  [職業番号]   - 0001～9999までの4桁の数値が設定できます。(数字)
 *                 データベースの職業タブで表示されている番号になります。
 *  [初期レベル] - 職業の初期レベル。(数字)
 *
 * -----------------------------------------------------------------------------
 * 職業に設定するメモタグ
 *
 * <faceName:[ファイル名],[番号]>
 *  ジョブチェンジした時に使用される顔画像を設定します。
 *  [ファイル名] - 顔画像のファイル名。(文字列)
 *  [番号]       - ファイル内の画像番号。(数字)
 *                 0 1 2 3
 *                 4 5 6 7
 *
 * <faceName[アクター番号]:[ファイル名],[番号]>
 *  アクターがジョブチェンジした時に使用される専用顔画像を設定します。
 *  [アクター番号] - 0001～9999までの4桁の数値が設定できます。(数字)
 *                   データベースのアクタータブで表示されている番号になります。
 *  [ファイル名]   - 顔画像のファイル名。(文字列)
 *  [番号]         - ファイル内の画像番号。(数字)
 *                   0 1 2 3
 *                   4 5 6 7
 *
 * <characterName:[ファイル名],[番号]>
 *  ジョブチェンジした時に使用される歩行キャラ画像を設定します。
 *  [ファイル名] - 歩行キャラ画像のファイル名。(文字列)
 *  [番号]       - ファイル内の画像番号。(数字)
 *                 0 1 2 3
 *                 4 5 6 7
 *
 * <characterName[アクター番号]:[ファイル名],[番号]>
 *  アクターがジョブチェンジした時に使用される専用歩行キャラ画像を設定します。
 *  [アクター番号] - 0001～9999までの4桁の数値が設定できます。(数字)
 *                   データベースのアクタータブで表示されている番号になります。
 *  [ファイル名]   - 歩行キャラ画像のファイル名。(文字列)
 *  [番号]         - ファイル内の画像番号。(数字)
 *                   0 1 2 3
 *                   4 5 6 7
 *
 * <battlerName:[ファイル名]>
 *  ジョブチェンジした時に使用される戦闘キャラ画像を設定します。
 *  このタグが設定されていない場合は転職できません。
 *  [ファイル名] - 戦闘キャラ画像のファイル名。(文字列)
 *
 * <battlerName[アクター番号]:[ファイル名]>
 *  アクターがジョブチェンジした時に使用される専用戦闘キャラ画像を設定します。
 *  [アクター番号] - 0001～9999までの4桁の数値が設定できます。(数字)
 *                   データベースのアクタータブで表示されている番号になります。
 *  [ファイル名]   - 戦闘キャラ画像のファイル名。(文字列)
 *
 * <jobInfo:[説明文]>
 *  画面上部のヘルプウィンドウに表示される説明文を設定します。
 *  [説明文] - ヘルプウィンドウに表示する文章。(文字列)
 *
 * <changeableActor:[アクター番号,...]>
 *  ジョブチェンジできるアクター番号を設定します。
 *  このタグが設定されていない場合は全てのアクターがジョブチェンジできます。
 *  [アクター番号] - ジョブチェンジできるアクター番号。(数字)
 *                   「,」区切りで複数設定することも出来ます。
 *
 * <requirement[条件番号]:[条件],[引数,...]>
 *  ジョブチェンジできる条件を設定します。
 *  [条件番号]   - 00～09までの2桁の数値が設定できます。
 *                 なお、ひとつの職業に同じ条件番号を複数設定出来ません。
 *  [条件][引数] - 下記に定義されている条件と引数の組み合わせ。
 *  ・level,[職業番号],[必要なレベル]
 *     設定した職業のレベルが数値以上必要になります。
 *     [職業番号]に「0」を設定した場合は現在の職業のレベルとなります。
 *
 *  ・mhp,[必要な能力値]
 *     設定した数値以上の最大ＨＰが必要になります。
 *
 *  ・mmp,[必要な能力値]
 *     設定した数値以上の最大ＭＰが必要になります。
 *
 *  ・atk,[必要な能力値]
 *     設定した数値以上の攻撃力が必要になります。
 *
 *  ・def,[必要な能力値]
 *     設定した数値以上の防御力が必要になります。
 *
 *  ・mat,[必要な能力値]
 *     設定した数値以上の魔法力が必要になります。
 *
 *  ・mdf,[必要な能力値]
 *     設定した数値以上の魔法防御が必要になります。
 *
 *  ・agi,[必要な能力値]
 *     設定した数値以上の敏捷性が必要になります。
 *
 *  ・luk,[必要な能力値]
 *     設定した数値以上の運が必要になります。
 *
 *  ・switch,[スイッチ番号]
 *     設定した番号のスイッチがONにする必要があります。
 *
 * 使用例)
 *  ・職業0001のレベルが10以上で最大ＨＰが1000以上ならジョブチェンジできる
 *     <requirement00:level,1,10>
 *     <requirement01:mhp,1000>
 *
 *  ・スイッチ20がONの状態で現在のレベルが20以上ならジョブチェンジできる
 *     <requirement00:switch,20>
 *     <requirement01:level,0,20>
 *
 * <displayStats:[表示方法]>
 *  条件を満たしていない場合の表示方法を設定します。
 *  このタグが設定されていない場合は「gray」と同じ扱いになります。
 *  [表示方法] - 下記に定義された表示方法を現す文字列。(文字列)
 *  ・gray - グレー表示となり、設定できなくなります。
 *  ・hide - 表示されなくなります。
 *  ・both - いずれかのアクターが条件を満たしている場合にグレー表示となります。
 *
 * -----------------------------------------------------------------------------
 * プラグインコマンド
 *
 * ジョブチェンジメニューを開くコマンド
 *   OpenJobChangeMenu memberIndex changeActor
 *  memberIndex - ジョブチェンジの対象となるパーティメンバーの番号(0が先頭キャラ)
 *  changeActor - メニュー内でアクターの切り替えができるか(true できる / false できない)
 *
 * 使用例)
 *  ・先頭のアクターを対象にジョブチェンジメニューを開く
 *     OpenJobChangeMenu 0 false
 */

var Imported = Imported || {};
Imported.dsJobChange = true;

(function (exports) {
	'use strict';

	exports.Param = (function() {
		var ret = {};
		var parameters = PluginManager.parameters('dsJobChange');
		ret.MenuCommandEnable = Boolean(parameters['Menu Command Enable'] === 'true' || false);
		ret.CommandName = String(parameters['Command Name']);
		ret.EffectAnimationId = Number(parameters['Effect Animation Id']);
		ret.OptimizeEquipEnable = Boolean(parameters['Optimize Equip Enable'] === 'true' || false);
		ret.OptimizeEquipText = String(parameters['Optimize Equip Text']);
		ret.KeepExp = Boolean(parameters['Keep Exp'] === 'true' || false);
		ret.RequirementsMax = 10;
		return ret;
	})();

	//--------------------------------------------------------------------------
	/** Utility */
	function Utility() {}

	Utility.normRad = function(rad)
	{
		var PI2 = Math.PI * 2;
		var div = Math.floor(rad / PI2);
		rad -= div * PI2;
		if ( rad < 0.0 )
		{
			rad += PI2;
		}
		if ( rad > Math.PI )
		{
			rad -= PI2;
		}
		return rad;
	};

	Utility.characterName = function(actor, data)
	{
		if ( actor )
		{
			var characterName = 'characterName' + ('0000'+actor.actorId()).slice(-4);
			if ( data.meta[characterName] )
			{
				return data.meta[characterName];
			}
		}
		return data.meta.characterName;
	};

	Utility.faceName = function(actor, data)
	{
		if ( actor )
		{
			var faceName = 'faceName' + ('0000'+actor.actorId()).slice(-4);
			if ( data.meta[faceName] )
			{
				return data.meta[faceName];
			}
		}
		return data.meta.faceName;
	};

	Utility.battlerName = function(actor, data)
	{
		if ( actor )
		{
			var battlerName = 'battlerName' + ('0000'+actor.actorId()).slice(-4);
			if ( data.meta[battlerName] )
			{
				return data.meta[battlerName];
			}
		}
		return data.meta.battlerName;
	};

	Utility.jobChangeEnable = function(data)
	{
		var result = false;
		if ( data.meta.battlerName )
		{
			result = true;
		}
		else
		{
			$dataActors.some(function(actorData) {
				if ( actorData )
				{
					var battlerName = 'battlerName' + ('0000'+actorData.id).slice(-4);
					if ( data.meta[battlerName] )
					{
						result = true;
						return true;
					}
				}
				return false;
			});
		}
		return result;
	};

	//--------------------------------------------------------------------------
	/** SceneManager */
	SceneManager.isCurrentScene = function(sceneClass)
	{
		return this._scene && this._scene.constructor === sceneClass;
	};

	//--------------------------------------------------------------------------
	/** Game_Temp */
	var _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function()
	{
		_Game_Temp_initialize.call(this);
		this._changeActorForJobChange = true;
	};

	Game_Temp.prototype.setChangeActorForJobChange = function(changeActor)
	{
		this._changeActorForJobChange = changeActor;
	};

	Game_Temp.prototype.changeActorForJobChange = function()
	{
		return this._changeActorForJobChange;
	};

	//--------------------------------------------------------------------------
	/** Game_Interpreter */
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if ( command === 'OpenJobChangeMenu' )
		{
			var memberIndex = Number(args[0]);
			var changeActor = Boolean(args[1] === 'true' || false);
			var actor = $gameParty.allMembers()[memberIndex];
			this.openJobChangeMenu(actor, changeActor);
		}
	};

	Game_Interpreter.prototype.openJobChangeMenu = function(actor, changeActor)
	{
		$gameParty.setMenuActor(actor);
		$gameTemp.setChangeActorForJobChange(changeActor);
		SceneManager.push(exports.Scene_JobChange);
	};

	//--------------------------------------------------------------------------
	/** Game_Actor */
	var _Game_Actor_initExp = Game_Actor.prototype.initExp;
	Game_Actor.prototype.initExp = function()
	{
		_Game_Actor_initExp.call(this);
		var actor = this.actor();
		$dataClasses.forEach(function(classData, idx) {
			if ( classData )
			{
				var tag = 'classLevel' + ('0000'+idx).slice(-4);
				if ( actor.meta[tag] )
				{
					var level = Number(actor.meta[tag]);
					this._exp[idx] = this.expForLevelEx(idx, level);
					if ( this._classId === idx )
					{
						this._level = level;
					}
				}
			}
		}, this);
	};

	var _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
	Game_Actor.prototype.initSkills = function()
	{
		_Game_Actor_initSkills.call(this);
		if ( !Imported.dsUnsharedLearningSkill )
		{
			var backupClassId = this._classId;
			var backupLevel = this._level;
			var actor = this.actor();
			$dataClasses.forEach(function(classData, idx) {
				if ( classData )
				{
					var tag = 'classLevel' + ('0000'+idx).slice(-4);
					if ( actor.meta[tag] )
					{
						this._classId = idx;
						this._level = Number(actor.meta[tag]);
						classData.learnings.forEach(function(learning) {
							if ( learning.level <= this._level )
							{
								this.learnSkill(learning.skillId);
							}
						}, this);
					}
				}
			}, this);
			this._classId = backupClassId;
			this._level = backupLevel;
		}
	};

	Game_Actor.prototype.isSpriteVisible = function()
	{
		if ( !SceneManager.isCurrentScene(Scene_Battle) )
		{
			return true;
		}
		return $gameSystem.isSideView();
	};

	Game_Actor.prototype.expForLevelEx = function(classId, level)
	{
		var c = $dataClasses[classId];
		var basis = c.expParams[0];
		var extra = c.expParams[1];
		var acc_a = c.expParams[2];
		var acc_b = c.expParams[3];
		return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
				(level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
	};

	Game_Actor.prototype.classExp = function(classId)
	{
		return this._exp[classId];
	};

	Game_Actor.prototype.calcClassLevel = function(classId)
	{
		var exp = this.classExp(classId);
		var level = 1;
		while ( level < this.maxLevel() && this.classExp(classId) >= this.expForLevelEx(classId, level + 1) )
		{
			level++;
		}
		return level;
	};

	Game_Actor.prototype.changeClassEx = function(classId, keepExp)
	{
		if ( !this.isIgnoreChangeImage() )
		{
			var data = $dataClasses[classId];
			var metaCharacterName = Utility.characterName(this, data);
			if ( metaCharacterName )
			{
				var metaData = metaCharacterName.split(',');
				var characterName = String(metaData[0]);
				var characterIndex = Number(metaData[1]);
				this.setCharacterImage(characterName, characterIndex);
				$gamePlayer.refresh();
			}
			var metaFaceName = Utility.faceName(this, data);
			if ( metaFaceName )
			{
				var metaData = metaFaceName.split(',');
				var faceName = String(metaData[0]);
				var faceIndex = Number(metaData[1]);
				this.setFaceImage(faceName, faceIndex);
			}
			var metaBattlerName = Utility.battlerName(this, data);
			if ( metaBattlerName )
			{
				this.setBattlerImage(metaBattlerName);
			}
		}
		var hpRate = this.hpRate();
		var mpRate = this.mpRate();
		var tpRate = this.tpRate();
		this.changeClass(classId, keepExp);
		if ( !this.isDead() )
		{
			this.setHp(Math.max(Math.floor(this.mhp * hpRate), 1));
			this.setMp(Math.max(Math.floor(this.mmp * mpRate), 1));
			this.setTp(Math.max(Math.floor(this.maxTp() * tpRate), 1));
		}
	};

	Game_Actor.prototype.isIgnoreChangeImage = function(classId)
	{
		var actor = this.actor();
		if ( actor.meta.ignoreChangeImage )
		{
			return true;
		}
		return false;
	};

	Game_Actor.prototype.isClassChangeEnable = function(classId)
	{
		if ( this.isClass($dataClasses[classId]) )
		{
			return false;
		}
		return true;
	};

	Game_Actor.prototype.meetsRequirements = function(classId)
	{
		var data = $dataClasses[classId];
		for ( var ii = 0; ii < exports.Param.RequirementsMax; ii++ )
		{
			var requirement = 'requirement' + ('0'+ii).slice(-2);
			if ( data.meta[requirement] )
			{
				if ( !this.checkRequirement(data.meta[requirement]) )
				{
					return false;
				}
			}
		}
		return true;
	};

	Game_Actor.prototype.checkRequirement = function(condition)
	{
		var result = true;
		var metaData = condition.split(',');
		switch ( metaData[0] )
		{
		case 'level':
			if ( Number(metaData[1]) === 0 )
			{
				if ( this.level < Number(metaData[2]) )
				{
					result = false;
				}
			}
			else
			{
				if ( this.calcClassLevel(Number(metaData[1])) < Number(metaData[2]) )
				{
					result = false;
				}
			}
			break;
		case 'mhp':
			if ( this.mhp < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'mmp':
			if ( this.mmp < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'atk':
			if ( this.atk < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'def':
			if ( this.def < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'mat':
			if ( this.mat < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'mdf':
			if ( this.mdf < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'agi':
			if ( this.agi < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'luk':
			if ( this.luk < Number(metaData[1]) )
			{
				result = false;
			}
			break;
		case 'switch':
			if ( !$gameSwitches.value(Number(metaData[1])) )
			{
				result = false;
			}
			break;
		}
		return result;
	};

	//--------------------------------------------------------------------------
	/** Sprite_ActorFace */
	exports.Sprite_ActorFace = (function() {

		function Sprite_ActorFace()
		{
			this.initialize.apply(this, arguments);
		}

		Sprite_ActorFace.prototype = Object.create(Sprite.prototype);
		Sprite_ActorFace.prototype.constructor = Sprite_ActorFace;

		Sprite_ActorFace._faceWidth  = 144;
		Sprite_ActorFace._faceHeight = 144;

		Sprite_ActorFace.prototype.initialize = function()
		{
			Sprite.prototype.initialize.call(this);
			this.initMembers();
		};

		Sprite_ActorFace.prototype.initMembers = function()
		{
			this._actor = null;
			this._faceName = '';
			this._faceIndex = 0;
			this._drawRect = new Rectangle();
		};

		Sprite_ActorFace.prototype.setActor = function(actor)
		{
			this._actor = actor;
		};

		Sprite_ActorFace.prototype.setDrawRect = function(x, y, width, height)
		{
			this._drawRect.x = x;
			this._drawRect.y = y;
			this._drawRect.width = width || Sprite_ActorFace._faceWidth;
			this._drawRect.height = height || Sprite_ActorFace._faceHeight;
		};

		Sprite_ActorFace.prototype.update = function()
		{
			Sprite.prototype.update.call(this);
			if ( this._actor )
			{
				this.updateMain();
			}
			else
			{
				this.bitmap = null;
			}
		};

		Sprite_ActorFace.prototype.updateMain = function()
		{
			this.updateBitmap();
			this.updateFrame();
			this.updatePosition();
		};

		Sprite_ActorFace.prototype.updateBitmap = function()
		{
			var name = this._actor.faceName();
			var index = this._actor.faceIndex();
			if ( this._faceName !== name || this._faceIndex !== index )
			{
				this._faceName = name;
				this._faceIndex = index;
				this.bitmap = ImageManager.loadFace(name);
			}
		};

		Sprite_ActorFace.prototype.updateFrame = function()
		{
			if ( this.bitmap )
			{
				var pw = Sprite_ActorFace._faceWidth;
				var ph = Sprite_ActorFace._faceHeight;
				var sw = Math.min(this._drawRect.width, pw);
				var sh = Math.min(this._drawRect.height, ph);
				var sx = this._faceIndex % 4 * pw + (pw - sw) / 2;
				var sy = Math.floor(this._faceIndex / 4) * ph + (ph - sh) / 2;
				this.setFrame(sx, sy, sw, sh);
			}
		};

		Sprite_ActorFace.prototype.updatePosition = function()
		{
			var pw = Sprite_ActorFace._faceWidth;
			var ph = Sprite_ActorFace._faceHeight;
			this.x = Math.floor(this._drawRect.x + Math.max(this._drawRect.width - pw, 0) / 2);
			this.y = Math.floor(this._drawRect.y + Math.max(this._drawRect.height - ph, 0) / 2);
		};

		return Sprite_ActorFace;
	})();

	//--------------------------------------------------------------------------
	/** Sprite_ActorJob */
	exports.Sprite_ActorJob = (function() {

		function Sprite_ActorJob()
		{
			this.initialize.apply(this, arguments);
		}

		Sprite_ActorJob.prototype = Object.create(Sprite_Actor.prototype);
		Sprite_ActorJob.prototype.constructor = Sprite_ActorJob;

		Sprite_ActorJob.prototype.setBattler = function(battler)
		{
			Sprite_Battler.prototype.setBattler.call(this, battler);
			var changed = (battler !== this._actor);
			if ( changed )
			{
				this._actor = battler;
				this._stateSprite.setup(battler);
				this.startIdleMotion();
			}
		};

		Sprite_ActorJob.prototype.startMove = function(x, y, duration)
		{
		};

		Sprite_ActorJob.prototype.moveToStartPosition = function()
		{
		};

		Sprite_ActorJob.prototype.startIdleMotion = function()
		{
			this.startMotion('walk');
		};

		return Sprite_ActorJob;
	})();

	//--------------------------------------------------------------------------
	/** Sprite_Job */
	exports.Sprite_Job = (function() {

		function Sprite_Job()
		{
			this.initialize.apply(this, arguments);
		}

		Sprite_Job.prototype = Object.create(Sprite.prototype);
		Sprite_Job.prototype.constructor = Sprite_Job;

		Sprite_Job.prototype.initialize = function(classId)
		{
			Sprite.prototype.initialize.call(this);
			this.initMembers();
			this.setJob(classId);
			this.updateBitmap();
		};

		Sprite_Job.prototype.initMembers = function()
		{
			this.anchor.x = 0.5;
			this.anchor.y = 1;
			this._classId = 0;
			this._battlerName = '';
			this._motion = { index: 0, loop: true };
			this._motionCount = 0;
			this._pattern = 0;
			this._rootX = 0;
			this._rootY = 0;
			this._offsetX = 0;
			this._offsetY = 0;
			this._selection = false;
			this._selectionEffectCount = 0;
			this._changeEnable = true;
			this._scissorRect = null;
			this._actor = null;
		};

		Sprite_Job.prototype.setJob = function(classId)
		{
			this._classId = classId;
		};

		Sprite_Job.prototype.setBattler = function(battler)
		{
			this._actor = battler;
		};

		Sprite_Job.prototype.setRoot = function(x, y)
		{
			this._rootX = x;
			this._rootY = y;
		};

		Sprite_Job.prototype.setOffset = function(x, y)
		{
			this._offsetX = x;
			this._offsetY = y;
		};

		Sprite_Job.prototype.setSelection = function(selection)
		{
			this._selection = selection;
		};

		Sprite_Job.prototype.setChangeEnable = function(enable)
		{
			this._changeEnable = enable;
		};

		Sprite_Job.prototype.setScissoring = function(x, y, width, height)
		{
			this._scissorRect = new Rectangle();
			this._scissorRect.x = x;
			this._scissorRect.y = y;
			this._scissorRect.width = width;
			this._scissorRect.height = height;
		};

		Sprite_Job.prototype.update = function()
		{
			Sprite.prototype.update.call(this);
			if ( this._classId !== 0 )
			{
				this.updatePosition();
				this.updateBitmap();
				this.updateFrame();
				this.updateMotion();
				this.updateSelectionEffect();
			}
			else
			{
				this.bitmap = null;
			}
		};

		Sprite_Job.prototype.updatePosition = function()
		{
			this.x = this._rootX + this._offsetX;
			this.y = this._rootY + this._offsetY;
		};

		Sprite_Job.prototype.updateBitmap = function()
		{
			if ( this._classId !== 0 )
			{
				var name = Utility.battlerName(this._actor, $dataClasses[this._classId]);
				if ( name )
				{
					if ( this._battlerName !== name )
					{
						this._battlerName = name;
						this.bitmap = ImageManager.loadSvActor(name);
					}
				}
			}
		};

		Sprite_Job.prototype.updateFrame = function()
		{
			var bitmap = this.bitmap;
			if ( bitmap )
			{
				var motionIndex = this._motion ? this._motion.index : 0;
				var pattern = this._pattern < 3 ? this._pattern : 1;
				var cw = bitmap.width / 9;
				var ch = bitmap.height / 6;
				var cx = Math.floor(motionIndex / 6) * 3 + pattern;
				var cy = motionIndex % 6;
				var rect = this.applyScissoring(cx * cw, cy * ch, cw, ch);
				this.setFrame(rect.x, rect.y, rect.width, rect.height);
			}
		};

		Sprite_Job.prototype.updateMotion = function()
		{
			if ( this._motion && ++this._motionCount >= this.motionSpeed() )
			{
				if ( this._motion.loop )
				{
					this._pattern = (this._pattern + 1) % 4;
				}
				else if ( this._pattern < 2 )
				{
					this._pattern++;
				}
				this._motionCount = 0;
			}
		};

		Sprite_Job.prototype.updateSelectionEffect = function()
		{
			if ( this._selection )
			{
				this._selectionEffectCount++;
				if ( this._selectionEffectCount % 30 < 15 )
				{
					var color = this._changeEnable ? [255, 255, 255, 64] : [96, 96, 96, 160];
					this.setBlendColor(color);
				}
				else
				{
					var color = this._changeEnable ? [0, 0, 0, 0] : [64, 64, 64, 160];
					this.setBlendColor(color);
				}
			}
			else
			{
				this._selectionEffectCount = 0;
				var color = this._changeEnable ? [0, 0, 0, 0] : [64, 64, 64, 160];
				this.setBlendColor(color);
			}
		};

		Sprite_Job.prototype.applyScissoring = function(x, y, w, h)
		{
			var rect = new Rectangle;
			rect.x = x;
			rect.y = y;
			rect.width = w;
			rect.height = h;
			if ( this._scissorRect )
			{
				var x1 = this.x - rect.width * this.anchor.x - this._rootX;
				var x2 = this.x + rect.width * (1.0 - this.anchor.x) - this._rootX;
				var y1 = this.y - rect.height * this.anchor.y - this._rootY;
				var y2 = this.y + rect.height * (1.0 - this.anchor.y) - this._rootY;
				var sx1 = this._scissorRect.x;
				var sx2 = this._scissorRect.x + this._scissorRect.width;
				var sy1 = this._scissorRect.y;
				var sy2 = this._scissorRect.y + this._scissorRect.height;
				if ( x2 < sx1 || sx2 < x1 )
				{
					rect.width = 0.0;
				}
				else if ( y2 < sy1 || y1 > sy2 )
				{
					rect.height = 0.0;
				}
				else
				{
					if ( x1 < sx1 )
					{
						var xx = Math.max(Math.min(Math.floor(sx1 - x1), w), 0);
						rect.x += xx;
						rect.width -= xx;
						this.x += xx * (1.0 - this.anchor.x);
					}
					else if ( x2 > sx2 )
					{
						var xx = Math.max(Math.min(Math.floor(x2 - sx2), w), 0);
						rect.width -= xx;
						this.x -= xx * this.anchor.x;
					}
					if ( y1 < sy1 )
					{
						var yy = Math.max(Math.min(Math.floor(sy1 - y1), h), 0);
						rect.y += yy;
						rect.height -= yy;
						this.y += yy * (1.0 - this.anchor.y);
					}
					else if ( y2 > sy2 )
					{
						var yy = Math.max(Math.min(Math.floor(y2 - sy2), h), 0);
						rect.height -= yy;
						this.y -= yy * this.anchor.y;
					}
				}
			}
			return rect;
		};

		Sprite_Job.prototype.motionSpeed = function()
		{
			return 12;
		};

		Sprite_Job.prototype.startIdleMotion = function()
		{
			this.startMotion(gActorMotionIdle);
		};

		Sprite_Job.prototype._onBitmapLoad = function()
		{
			if ( this._frame.width === 0 && this._frame.height === 0 )
			{
				this._frame.width = this._bitmap.width / 9;
				this._frame.height = this._bitmap.height / 6;
			}
			this._refresh();
		};

		Sprite_Job.prototype._createTinter = function(w, h)
		{
			var cw = this._bitmap.width / 9;
			var ch = this._bitmap.height / 6;
			Sprite.prototype._createTinter.call(this, cw, ch);
		};

		return Sprite_Job;
	})();

	//--------------------------------------------------------------------------
	/** Window_JobStatus */
	exports.Window_JobStatus = (function() {

		function Window_JobStatus()
		{
			this.initialize.apply(this, arguments);
		}

		Window_JobStatus.prototype = Object.create(Window_Selectable.prototype);
		Window_JobStatus.prototype.constructor = Window_JobStatus;

		Window_JobStatus.prototype.initialize = function(x, y)
		{
			var width = this.windowWidth();
			var height = this.windowHeight();
			Window_Selectable.prototype.initialize.call(this, x, y, width, height);
			this.createFaceSprite();
			this._actor = null;
			this._touchEnable = true;
		};

		Window_JobStatus.prototype.windowWidth = function()
		{
			return Graphics.boxWidth;
		};

		Window_JobStatus.prototype.windowHeight = function()
		{
			return this.fittingHeight(3);
		};

		Window_JobStatus.prototype.setActor = function(actor)
		{
			if ( this._actor !== actor )
			{
				this._actor = actor;
				this._faceSprite.setActor(actor);
				this.refresh();
			}
		};

		Window_JobStatus.prototype.setTouchEnable = function(enable)
		{
			this._touchEnable = enable;
		};

		Window_JobStatus.prototype.createFaceSprite = function()
		{
			var h = this.height - this.padding * 2;
			this._faceSprite = new exports.Sprite_ActorFace();
			this._faceSprite.setDrawRect(this.padding + 120, this.padding, 144, h);
			this.addChild(this._faceSprite);
		};

		Window_JobStatus.prototype.update = function()
		{
			Window_Selectable.prototype.update.call(this);
			this.updateFaceSprite();
		};

		Window_JobStatus.prototype.updateFaceSprite = function()
		{
			this._faceSprite.visible = this.isOpen();
		};

		Window_JobStatus.prototype.touchGuide = function(triggered)
		{
			var execTouch = false;
			var lastIndex = this.index();
			var x = this.canvasToLocalX(TouchInput.x);
			var y = this.canvasToLocalY(TouchInput.y);
			if ( this.isContentsArea(x, y) )
			{
	            if ( triggered && this.isTouchOkEnabled() )
				{
					var cx = x - this.padding;
					var cy = y - this.padding;
					if ( cx < 128 )
					{
						if ( this.isHandled('pageup') )
						{
							this.processPageup();
							execTouch = true;
						}
					}
					else if ( cx > this.contentsWidth() - 128 )
					{
						if ( this.isHandled('pagedown') )
						{
							this.processPagedown();
							execTouch = true;
						}
					}
				}
			}
			return execTouch;
		};

		Window_JobStatus.prototype.onTouch = function(triggered)
		{
			if ( this._touchEnable )
			{
				if ( !this.touchGuide(triggered) )
				{
					Window_Selectable.prototype.onTouch.call(this, triggered);
				}
			}
		};

		Window_JobStatus.prototype.isOpenAndActive = function()
		{
			return this.isOpen();
		};

		Window_JobStatus.prototype.isOkEnabled = function()
		{
			return true;
		};

		Window_JobStatus.prototype.processOk = function()
		{
		};

		Window_JobStatus.prototype.processPageup = function()
		{
			SoundManager.playCursor();
			this.updateInputData();
			this.callHandler('pageup');
		};

		Window_JobStatus.prototype.processPagedown = function()
		{
			SoundManager.playCursor();
			this.updateInputData();
			this.callHandler('pagedown');
		};

		Window_JobStatus.prototype.refresh = function()
		{
			this.contents.clear();
			if ( this._actor )
			{
				var w = this.width - this.padding * 2;
				var h = this.height - this.padding * 2;
				var y = h / 2 - this.lineHeight() * 1.5;
				var width = w - (162 + (120 * 2)) - this.textPadding();
				this.drawActorFace(this._actor, 120, 0, 144, h);
				this.drawActorSimpleStatus(this._actor, 120+162, y, width);
			}
		};

		return Window_JobStatus;
	})();

	//--------------------------------------------------------------------------
	/** Window_JobChange */
	exports.Window_JobChange = (function() {

		function Window_JobChange()
		{
			this.initialize.apply(this, arguments);
		}

		Window_JobChange.prototype = Object.create(Window_Selectable.prototype);
		Window_JobChange.prototype.constructor = Window_JobChange;

		Window_JobChange.prototype.initialize = function(x, y, width, height)
		{
			this.initMember();
			Window_Selectable.prototype.initialize.call(this, x, y, width, height);
			this.resetScroll();
			this.createActorSprite();
			this.createJobSprite();
		};

		Window_JobChange.prototype.setActor = function(actor)
		{
			if ( this._actor !== actor )
			{
				this._actor = actor;
				this._actorSprite.setBattler(this._actor);
				this._jobSprite.forEach(function(sprite) {
					if ( sprite )
					{
						sprite.setBattler(this._actor);
					}
				}, this);
				this.setupChangeableClasses(actor);
				this.selectActorClass(actor);
				this.refresh();
			}
		};

		Window_JobChange.prototype.startClassChange = function()
		{
			if ( exports.Param.EffectAnimationId !== 0 )
			{
				var animation = $dataAnimations[exports.Param.EffectAnimationId];
				this._actorSprite.startAnimation(animation, false, 0);
			}
		};

		Window_JobChange.prototype.initMember = function()
		{
			this._actor = null;
			this._actorSprite = null;
			this._jobSprite = [];
			this._introRotation = 0.0;
			this._introDistance = 0.0;
			this._rotation = this.currentRotation();
			this._classIdTable = [];
			this._waitForReady = false;
		};

		Window_JobChange.prototype.createActorSprite = function()
		{
			var rootX = this.rootX();
			var rootY = this.rootY();
			this._actorSprite = new exports.Sprite_ActorJob;
			this._actorSprite.setHome(rootX, rootY);
			this.addChild(this._actorSprite);
		};

		Window_JobChange.prototype.createJobSprite = function()
		{
			var mergin = 5;
			var rootX = this.rootX();
			var rootY = this.rootY();
			var scissorX = 0.0 - rootX + mergin;
			var scissorY = 0.0 - rootY + mergin;
			var scissorW = this.width - mergin * 2;
			var scissorH = this.height - mergin * 2;
			var classesNum = $dataClasses.length;
			for ( var ii = 1; ii < classesNum; ii++ )
			{
				if ( Utility.jobChangeEnable($dataClasses[ii]) )
				{
					var sprite = new exports.Sprite_Job(ii);
					sprite.setRoot(rootX, rootY);
					sprite.setScissoring(scissorX, scissorY, scissorW, scissorH);
					this._jobSprite[ii] = sprite;
					this.addChild(this._jobSprite[ii]);
				}
			}
			this.updateJobPosition();
		};

		Window_JobChange.prototype.maxCols = function()
		{
			return Math.max(this._classIdTable.length, 1);
		};

		Window_JobChange.prototype.maxItems = function()
		{
			return this._classIdTable.length;
		};

		Window_JobChange.prototype.maxPageRows = function()
		{
			return 1;
		};

		Window_JobChange.prototype.isReady = function()
		{
			return ImageManager.isReady();
		};

		Window_JobChange._introRotationMax = Math.PI * 0.8;
		Window_JobChange._introDistanceMax = 250.0;

		Window_JobChange.prototype.rootX = function()
		{
			return Math.floor(this.width * 0.5);
		};

		Window_JobChange.prototype.rootY = function()
		{
			return Math.floor(this.height * 0.35);
		};

		Window_JobChange.prototype.radiusX = function()
		{
			return Math.floor(this.width * 0.4) + this._introDistance;
		};

		Window_JobChange.prototype.radiusY = function()
		{
			return Math.floor(this.height * 0.4) + this._introDistance;
		};

		Window_JobChange.prototype.currentRotation = function()
		{
			var rot = this._introRotation;
			if ( this.index() >= 0 )
			{
				var unitRot = (Math.PI * 2) / this._classIdTable.length;
				rot += unitRot * this.index();
			}
			return Utility.normRad(rot);
		};

		Window_JobChange.prototype.isCurrentItemEnabled = function()
		{
			if ( this._actor )
			{
				if ( this.index() >= 0 )
				{
					var classId = this._classIdTable[this.index()];
					return this.isClassChangeEnable(classId);
				}
			}
			return false;
		};

		Window_JobChange.prototype.isClassChangeEnd = function()
		{
			if ( !ImageManager.isReady() )
			{
				return false;
			}
			if ( this._actorSprite.isAnimationPlaying() )
			{
				return false;
			}
			return true;
		};

		Window_JobChange.prototype.update = function()
		{
			this.updateIntro();
			this.updateJobRotation();
			this.updateJobPosition();
			this.updateJobSelection();
			Window_Selectable.prototype.update.call(this);
		};

		Window_JobChange.prototype.updateIntro = function()
		{
			if ( this._waitForReady )
			{
				if ( this.isReady() )
				{
					this._waitForReady = false;
				}
			}
			else
			{
				var rot = Window_JobChange._introRotationMax / 15.0;
				var dist = Window_JobChange._introDistanceMax / 15.0;
				this._introRotation = Math.max( this._introRotation - rot, 0.0 );
				this._introDistance = Math.max( this._introDistance - dist, 0.0 );
			}
		};

		Window_JobChange.prototype.updateJobRotation = function()
		{
			var rotSpeed = (Math.PI / 180.0) * 10;
			var currentRotation = this.currentRotation();
			var diff = Utility.normRad(currentRotation - this._rotation);
			if ( diff < 0.0 )
			{
				this._rotation += Math.max(-rotSpeed, diff);
			}
			else if ( diff > 0.0 )
			{
				this._rotation += Math.min(rotSpeed, diff);
			}
			this._rotation = Utility.normRad(this._rotation);
		};

		Window_JobChange.prototype.updateJobPosition = function()
		{
			var radiusX = this.radiusX();
			var radiusY = this.radiusY();
			var rotation = this._rotation;
			var num = this._classIdTable.length;
			for ( var ii = 0; ii < num; ii++ )
			{
				var classId = this._classIdTable[ii];
				var sprite = this._jobSprite[classId];
				var offsetX = Math.cos(rotation) * 0 - Math.sin(rotation) * 1;
				var offsetY = Math.sin(rotation) * 0 + Math.cos(rotation) * 1;
				sprite.setOffset(offsetX * radiusX, offsetY * radiusY);
				rotation -= (Math.PI * 2) / num;
			}
		};

		Window_JobChange.prototype.updateJobSelection = function()
		{
			var num = this._classIdTable.length;
			for ( var ii = 0; ii < num; ii++ )
			{
				var classId = this._classIdTable[ii];
				var selection = (ii == this.index()) ? true : false;
				var enable = this.isClassChangeEnable(classId);
				this._jobSprite[classId].setSelection(selection);
				this._jobSprite[classId].setChangeEnable(enable);
			}
		};

		Window_JobChange.prototype.updateHelp = function()
		{
			if ( this.index() >= 0 )
			{
				var classId = this._classIdTable[this.index()];
				var data = $dataClasses[classId];
				if ( data.meta.jobInfo )
				{
					this._helpWindow.setText(data.meta.jobInfo);
				}
				else
				{
					this._helpWindow.clear();
				}
			}
			else
			{
				this._helpWindow.clear();
			}
		};

		Window_JobChange.prototype.resetIntro = function()
		{
			this._introRotation = Window_JobChange._introRotationMax;
			this._introDistance = Window_JobChange._introDistanceMax;
			this._waitForReady = true;
		};

		Window_JobChange.prototype.setupChangeableClasses = function(actor)
		{
			this._classIdTable = [];
			var classesNum = $dataClasses.length;
			for ( var ii = 1; ii < classesNum; ii++ )
			{
				if ( Utility.jobChangeEnable($dataClasses[ii]) )
				{
					if ( actor.isClass($dataClasses[ii]) )
					{
						this._classIdTable.push(ii);
						this._jobSprite[ii].visible = true;
					}
					else
					{
						if ( Utility.jobChangeEnable($dataClasses[ii]) )
						{
							if ( this.isShowChangeableClass(actor, ii) )
							{
								this._classIdTable.push(ii);
								this._jobSprite[ii].visible = true;
							}
							else
							{
								this._jobSprite[ii].visible = false;
							}
						}
					}
				}
			}
		};

		Window_JobChange.prototype.selectActorClass = function(actor)
		{
			var num = this._classIdTable.length;
			for ( var ii = 0; ii < num; ii++ )
			{
				var classId = this._classIdTable[ii];
				if ( actor.isClass($dataClasses[classId]) )
				{
					this.select(ii);
				}
			}
			this.resetIntro();
			this._rotation = this.currentRotation();
			this.updateJobPosition();
			this.updateJobSelection();
		};

		Window_JobChange.prototype.selectedClassId = function()
		{
			if ( this.index() >= 0 )
			{
				return this._classIdTable[this.index()];
			}
			return 0;
		};

		Window_JobChange.prototype.selectedJobName = function()
		{
			if ( this.index() >= 0 )
			{
				var classId = this._classIdTable[this.index()];
				return $dataClasses[classId].name;
			}
			return '';
		};

		Window_JobChange.prototype.isShowChangeableClass = function(actor, classId)
		{
			var result = false;
			var data = $dataClasses[classId];
			if ( data.meta.displayStats )
			{
				if ( data.meta.displayStats === 'hide' ) // 条件を満たしていない場合は非表示
				{
					if ( !actor.meetsRequirements(classId) )
					{
						return false;
					}
				}
				else if ( data.meta.displayStats === 'both' ) // 誰一人条件を満たしていない場合は非表示
				{
					$dataActors.forEach(function(actorData) {
						if ( actorData )
						{
							var actor = $gameActors.actor(actorData.id);
							if ( actor.meetsRequirements(classId) )
							{
								result = true;
							}
						}
					});
					if ( !result )
					{
						return false;
					}
				}
			}
			if ( data.meta.changeableActor )
			{
				var metaData = data.meta.changeableActor.split(',');
				metaData.forEach(function(actorId) {
					if ( Number(actorId) === actor.actorId() )
					{
						result = true;
					}
				}, this);
			}
			else
			{
				result = true;
			}
			return result;
		};

		Window_JobChange.prototype.isAnimationEnd = function()
		{
			if ( this._introDistance <= 0.0 )
			{
				var currentRotation = this.currentRotation();
				var diff = Utility.normRad(currentRotation - this._rotation);
				if ( diff === 0.0 )
				{
					return true;
				}
			}
			return false;
		};

		Window_JobChange.prototype.isOkEnabled = function()
		{
			if ( this.isAnimationEnd() )
			{
				return Window_Selectable.prototype.isOkEnabled.call(this);
			}
			return false;
		};

		Window_JobChange.prototype.isCursorMovable = function()
		{
			if ( this.isAnimationEnd() )
			{
				return Window_Selectable.prototype.isCursorMovable.call(this);
			}
			return false;
		};

		Window_JobChange.prototype.isClassChangeEnable = function(classId)
		{
			if ( this._actor )
			{
				if ( !this._actor.meetsRequirements(classId) )
				{
					return false;
				}
				return this._actor.isClassChangeEnable(classId);
			}
			return false;
		};

		Window_JobChange.prototype.refresh = function()
		{
			this.contents.clear();
			var width = 224;
			var x = (this.contentsWidth() - width) * 0.5;
			var y = this.rootY() + this.radiusY() - this._introDistance - this.standardPadding();
			this.drawText(this.selectedJobName(), x, y+24, width, 'center');
			if ( !exports.Param.KeepExp )
			{
				if ( this._actor )
				{
					if ( this.index() >= 0 )
					{
						var classId = this._classIdTable[this.index()];
						var level = TextManager.levelA + ' ' + this._actor.calcClassLevel(classId);
						var backupFontSize = this.contents.fontSize;
						this.contents.fontSize = 18;
						this.drawText(level, x, y, width, 'center');
						this.contents.fontSize = backupFontSize;
					}
				}
			}
		};

		var _Window_JobChange_cursorRight = Window_JobChange.prototype.cursorRight;
		Window_JobChange.prototype.cursorRight = function(wrap)
		{
			_Window_JobChange_cursorRight.call(this, true);
		};

		var _Window_JobChange_cursorLeft = Window_JobChange.prototype.cursorLeft;
		Window_JobChange.prototype.cursorLeft = function(wrap)
		{
			_Window_JobChange_cursorLeft.call(this, true);
		};

		Window_JobChange.prototype.itemRect = function(index)
		{
			var rect = new Rectangle();
			if ( this._jobSprite.length > 0 )
			{
				var classId = this._classIdTable[index];
				var sprite = this._jobSprite[classId];
				rect.x = sprite.x - (sprite.width * sprite.anchor.x) - this.standardPadding();
				rect.y = sprite.y - (sprite.height * sprite.anchor.y) - this.standardPadding();
				rect.width = sprite.width;
				rect.height = sprite.height;
			}
			return rect;
		};

		Window_JobChange.prototype.setCursorRect = function(x, y, width, height)
		{
		};

		var _Window_JobChange_select = Window_JobChange.prototype.select;
		Window_JobChange.prototype.select = function(index)
		{
			_Window_JobChange_select.call(this, index);
			this.refresh();
		};

		return Window_JobChange;
	})();

	//--------------------------------------------------------------------------
	/** Window_JobDialog */
	exports.Window_JobDialog = (function() {

		function Window_JobDialog()
		{
			this.initialize.apply(this, arguments);
		}

		Window_JobDialog.prototype = Object.create(Window_Base.prototype);
		Window_JobDialog.prototype.constructor = Window_JobDialog;

		Window_JobDialog.prototype.initialize = function(x, y)
		{
			var width = this.windowWidth();
			var height = this.windowHeight();
			Window_Base.prototype.initialize.call(this, x, y, width, height);
			this.openness = 0;
			this.margin = 0;
			this._showTimer = 0;
			this.refresh();
		};

		Window_JobDialog.prototype.windowWidth = function()
		{
			return 360;
		};

		Window_JobDialog.prototype.windowHeight = function()
		{
			return this.fittingHeight(1);
		};

		Window_JobDialog.prototype.backColor = function()
		{
			return '#000000';
		};

		var _Window_JobDialog_open = Window_JobDialog.prototype.open;
		Window_JobDialog.prototype.open = function()
		{
			_Window_JobDialog_open.call(this);
			this._showTimer = 60;
		};

		Window_JobDialog.prototype.update = function()
		{
			Window_Base.prototype.update.call(this);
			if ( this.isOpen() )
			{
				this._showTimer--;
				if ( this._showTimer <= 0 )
				{
					this.close();
				}
			}
		};

		Window_JobDialog.prototype.refresh = function()
		{
			this.contents.clear();
			var width = this.contentsWidth();
			this.drawText(exports.Param.OptimizeEquipText, 0, 0, width, 'center');
		};

		Window_JobDialog.prototype._refreshBack = function()
		{
			var m = this._margin;
			var w = this._width + m * 2;
			var h = this._height + m * 2;
			var bitmap = new Bitmap(w, h);

			this._windowBackSprite.bitmap = bitmap;
			this._windowBackSprite.setFrame(0, 0, w, h);
			this._windowBackSprite.move(m, m);

			if ( w > 0 && h > 0 )
			{
				bitmap.fillRect(0, 0, w, h, this.backColor());
				var tone = this._colorTone;
				bitmap.adjustTone(tone[0], tone[1], tone[2]);
			}
		};

		Window_JobDialog.prototype._refreshFrame = function()
		{
		};

		return Window_JobDialog;
	})();

	//--------------------------------------------------------------------------
	/** Window_MenuCommand */
	var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function()
	{
		_Window_MenuCommand_addOriginalCommands.call(this);
		if ( exports.Param.MenuCommandEnable )
		{
			this.addCommand(exports.Param.CommandName, 'jobChange', true);
		}
	};

	//--------------------------------------------------------------------------
	/** Scene_JobChange */
	exports.Scene_JobChange = (function() {

		function Scene_JobChange()
		{
			this.initialize.apply(this, arguments);
		}

		Scene_JobChange.prototype = Object.create(Scene_MenuBase.prototype);
		Scene_JobChange.prototype.constructor = Scene_JobChange;

		Scene_JobChange.prototype.initialize = function()
		{
			this._changeActorEnable = $gameTemp.changeActorForJobChange();
			Scene_MenuBase.prototype.initialize.call(this);
		};

		Scene_JobChange.prototype.create = function()
		{
			Scene_MenuBase.prototype.create.call(this);
			this.createHelpWindow();
			this.createStatusWindow();
			this.createJobChangeWindow();
			this.createDialogWindow();
			this.refreshActor();
		};

		Scene_JobChange.prototype.createStatusWindow = function()
		{
			var wx = 0;
			var wy = this._helpWindow.height;
			this._statusWindow = new exports.Window_JobStatus(wx, wy);
			if ( this._changeActorEnable )
			{
				this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
				this._statusWindow.setHandler('pageup',   this.previousActor.bind(this));
			}
			this.addWindow(this._statusWindow);
		};

		Scene_JobChange.prototype.createJobChangeWindow = function()
		{
			var wx = 0;
			var wy = this._statusWindow.y + this._statusWindow.height;
			var ww = Graphics.boxWidth;
			var wh = Graphics.boxHeight - wy;
			this._jobWindow = new exports.Window_JobChange(wx, wy, ww, wh);
			this._jobWindow.setHelpWindow(this._helpWindow);
			this._jobWindow.setHandler('ok',       this.onJobChange.bind(this));
			this._jobWindow.setHandler('cancel',   this.popScene.bind(this));
			if ( this._changeActorEnable )
			{
				this._jobWindow.setHandler('pagedown', this.nextActor.bind(this));
				this._jobWindow.setHandler('pageup',   this.previousActor.bind(this));
			}
			this._jobWindow.activate();
			this.addWindow(this._jobWindow);
		};

		Scene_JobChange.prototype.createDialogWindow = function()
		{
			var wx = (Graphics.boxWidth - 360) * 0.5;
			var wy = Graphics.boxHeight * 0.5 - 40;
			this._dialogWindow = new exports.Window_JobDialog(wx, wy);
			this.addWindow(this._dialogWindow);
		};

		Scene_JobChange.prototype.start = function()
		{
			this._jobWindow.resetIntro();
			this._statusWindow.refresh();
		};

		Scene_JobChange.prototype.update = function()
		{
			Scene_MenuBase.prototype.update.call(this);
			if ( !this._jobWindow.active )
			{
				if ( this._jobWindow.isClassChangeEnd() )
				{
					this._jobWindow.activate();
					this._statusWindow.setTouchEnable(true);
					if ( exports.Param.OptimizeEquipEnable )
					{
						this._dialogWindow.open();
					}
				}
			}
		};

		Scene_JobChange.prototype.nextActor = function()
		{
			Scene_MenuBase.prototype.nextActor.call(this);
		};

		Scene_JobChange.prototype.previousActor = function()
		{
			Scene_MenuBase.prototype.previousActor.call(this);
		};

		Scene_JobChange.prototype.onJobChange = function()
		{
			var actor = this.actor();
			if ( actor )
			{
				var classId = this._jobWindow.selectedClassId();
				actor.changeClassEx(classId, exports.Param.KeepExp);
				if ( exports.Param.OptimizeEquipEnable )
				{
					actor.optimizeEquipments();
				}
				this._jobWindow.startClassChange();
				this._statusWindow.setTouchEnable(false);
			}
			this._statusWindow.refresh();
		};

		Scene_JobChange.prototype.onActorChange = function()
		{
			this.refreshActor();
			this._jobWindow.activate();
		};

		Scene_JobChange.prototype.refreshActor = function()
		{
			var actor = this.actor();
			this._statusWindow.setActor(actor);
			this._jobWindow.setActor(actor);
		};

		return Scene_JobChange;
	})();

	//--------------------------------------------------------------------------
	/** Scene_Menu */
	var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function()
	{
		_Scene_Menu_createCommandWindow.call(this);
		if ( exports.Param.MenuCommandEnable )
		{
			this._commandWindow.setHandler('jobChange', this.commandPersonal.bind(this));
		}
	};

	var _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function()
	{
		switch ( this._commandWindow.currentSymbol() )
		{
		case 'jobChange':
			$gameTemp.setChangeActorForJobChange(true);
			SceneManager.push(exports.Scene_JobChange);
			break;
		default:
			_Scene_Menu_onPersonalOk.call(this);
			break;
		}
	};

	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------

	if ( Imported.YEP_X_VisualHpGauge )
	{
		//----------------------------------------------------------------------
		/** Sprite_ActorJob */
		exports.Sprite_ActorJob.prototype.update = function()
		{
			Sprite_Actor.prototype.update.call(this);
			if ( this._visualHpGauge )
			{
				this._visualHpGauge.hide();
			}
		};

	} // Imported.YEP_X_VisualHpGauge

}((this.dsJobChange = this.dsJobChange || {})));
