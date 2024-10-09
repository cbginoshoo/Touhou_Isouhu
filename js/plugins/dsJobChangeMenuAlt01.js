//==============================================================================
// dsJobChangeMenuAlt01.js
// Copyright (c) 2015 - 2018 DOURAKU
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc ジョブチェンジメニュー変更01 ver1.1.0
 * @author 道楽
 */

var Imported = Imported || {};
Imported._dsTemplate = true;

(function (exports) {
	'use strict';

	//--------------------------------------------------------------------------
	/** Game_Actor */
	Game_Actor.prototype.forceClearEquipments = function()
	{
		var equips = this.equips();
		for ( var ii = 0; ii < equips.length; ii++ )
		{
			this._equips[ii].setObject(null);
		}
		this.refresh();
	};

	//--------------------------------------------------------------------------
	/** Window_JobStatus */
	dsJobChange.Window_JobStatus.prototype.windowHeight = function()
	{
		return this.fittingHeight(2);
	};

	dsJobChange.Window_JobStatus.prototype.refresh = function()
	{
		this.contents.clear();
		if ( this._actor )
		{
			var statusWidth = 162 + 180 + 168;
			var w = this.width - this.padding * 2;
			var h = this.height - this.padding * 2;
			var width = w - 162 - this.textPadding();
			var x = (w - statusWidth) / 2;
			this.drawActorFace(this._actor, x, 0, 144, h);
			this.drawActorSimpleStatus(this._actor, x+162, 0, width);
		}
	};

	dsJobChange.Window_JobStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width)
	{
		var lineHeight = this.lineHeight();
		var x2 = x + 180;
		this.drawActorLevel(actor, x, y);
		this.drawActorName(actor, x, y + lineHeight * 1);
		this.drawActorClass(actor, x2, y);
	};

	//--------------------------------------------------------------------------
	/** Window_JobParameter */
	exports.Window_JobParameter = (function() {

		function Window_JobParameter()
		{
			this.initialize.apply(this, arguments);
		}

		Window_JobParameter.prototype = Object.create(Window_Base.prototype);
		Window_JobParameter.prototype.constructor = Window_JobParameter;

		Window_JobParameter.prototype.initialize = function(x, y, width, height)
		{
			Window_Base.prototype.initialize.call(this, x, y, width, height);
			this._actor = null;
			this._tempActor = null;
			this.refresh();
		};

		Window_JobParameter.prototype.setActor = function(actor)
		{
			if ( this._actor !== actor )
			{
				this._actor = actor;
				this.refresh();
			}
		};

		Window_JobParameter.prototype.setTempActor = function(tempActor)
		{
			if ( this._tempActor !== tempActor )
			{
				this._tempActor = tempActor;
				this.refresh();
			}
		};

		Window_JobParameter.prototype.refresh = function()
		{
			this.contents.clear();
			if ( this._actor )
			{
				var actor = (this._tempActor) ? this._tempActor : this._actor;
				var lineHeight = this.lineHeight();
				this.drawActorHp(actor, 0, lineHeight * 0, 188);
				this.drawActorMp(actor, 0, lineHeight * 1, 188);
				for ( var ii = 0; ii < 6; ii++ )
				{
					var y = lineHeight * (2.5 + ii);
					this.drawItem(0, y, 2 + ii);
				}
				if ( Imported.YEP_JobPoints )
				{
					var classId = actor.currentClass().id;
					this.drawActorJp(actor, classId, 0, lineHeight * 9, 188, 'right');
				}
			}
		};

		Window_JobParameter.prototype.drawItem = function(x, y, paramId)
		{
			this.drawParamName(x, y, paramId);
			var width = this.contentsWidth() - 64;
			if ( this._tempActor )
			{
				var newValue = this._tempActor.param(paramId);
				var diffvalue = newValue - this._actor.param(paramId);
				this.changeTextColor(this.paramchangeTextColor(diffvalue));
				this.drawText(newValue, x + width, y, 64, 'right');
			}
			else
			{
				if ( this._actor )
				{
					this.resetTextColor();
					this.drawText(this._actor.param(paramId), x + width, y, 64, 'right');
				}
			}
		};

		Window_JobParameter.prototype.drawParamName = function(x, y, paramId)
		{
			this.changeTextColor(this.systemColor());
			this.drawText(TextManager.param(paramId), x, y, 140);
		};

		return Window_JobParameter;
	})();

	//--------------------------------------------------------------------------
	/** Window_JobChange */
	dsJobChange.Window_JobChange.prototype.setParameterWindow = function(parameterWindow)
	{
		this._parameterWindow = parameterWindow;
		this.callUpdateHelp();
	};

	var _Window_JobChange_initMember = dsJobChange.Window_JobChange.prototype.initMember;
	dsJobChange.Window_JobChange.prototype.initMember = function()
	{
		_Window_JobChange_initMember.call(this);
		this._parameterWindow = null;
	};

	var _Window_JobChange_updateHelp = dsJobChange.Window_JobChange.prototype.updateHelp;
	dsJobChange.Window_JobChange.prototype.updateHelp = function()
	{
		_Window_JobChange_updateHelp.call(this);
		if ( this._actor && this._parameterWindow )
		{
			if ( this.index() >= 0 )
			{
				var classId = this._classIdTable[this.index()];
				var actor = JsonEx.makeDeepCopy(this._actor);
				actor.forceClearEquipments();
				actor.changeClassEx(classId, dsJobChange.Param.KeepLevel);
				this._parameterWindow.setTempActor(actor);
			}
			else
			{
				this._parameterWindow.setTempActor(null);
			}
		}
	};

	//--------------------------------------------------------------------------
	/** Scene_JobChange */
	dsJobChange.Scene_JobChange.prototype.create = function()
	{
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createStatusWindow();
		this.createJobChangeWindow();
		this.createParameterWindow();
		this.createDialogWindow();
		this.refreshActor();
	};

	dsJobChange.Scene_JobChange.prototype.createJobChangeWindow = function()
	{
		var wx = 0;
		var wy = this._statusWindow.y + this._statusWindow.height;
		var ww = Graphics.boxWidth - 224;
		var wh = Graphics.boxHeight - wy;
		this._jobWindow = new dsJobChange.Window_JobChange(wx, wy, ww, wh);
		this._jobWindow.setHelpWindow(this._helpWindow);
		this._jobWindow.setHandler('ok',       this.onJobChange.bind(this));
		this._jobWindow.setHandler('cancel',   this.popScene.bind(this));
		this._jobWindow.setHandler('pagedown', this.nextActor.bind(this));
		this._jobWindow.setHandler('pageup',   this.previousActor.bind(this));
		this._jobWindow.activate();
		this.addWindow(this._jobWindow);
	};

	dsJobChange.Scene_JobChange.prototype.createParameterWindow = function()
	{
		var wx = this._jobWindow.width;
		var wy = this._statusWindow.y + this._statusWindow.height;
		var ww = Graphics.boxWidth - this._jobWindow.width;
		var wh = Graphics.boxHeight - wy;
		this._parameterWindow = new exports.Window_JobParameter(wx, wy, ww, wh);
		this.addWindow(this._parameterWindow);
		this._jobWindow.setParameterWindow(this._parameterWindow);
	};

	var _Scene_JobChange_refreshActor = dsJobChange.Scene_JobChange.prototype.refreshActor;
	dsJobChange.Scene_JobChange.prototype.refreshActor = function()
	{
		_Scene_JobChange_refreshActor.call(this);
		var actor = JsonEx.makeDeepCopy(this._actor);
		actor.forceClearEquipments();
		this._parameterWindow.setActor(actor);
	};

	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------

	if ( Imported.dsSVActorForMenu )
	{
		//----------------------------------------------------------------------
		/** Window_JobStatus */
		var _Window_JobStatus_initialize = dsJobChange.Window_JobStatus.prototype.initialize;
		dsJobChange.Window_JobStatus.prototype.initialize = function(x, y)
		{
			_Window_JobStatus_initialize.call(this, x, y);
			this.createActorSprites();
		};

		var _Window_JobStatus_update = dsJobChange.Window_JobStatus.prototype.update;
		dsJobChange.Window_JobStatus.prototype.update = function()
		{
			_Window_JobStatus_update.call(this);
			this.updateSprites();
		};

		dsJobChange.Window_JobStatus.prototype.createActorSprites = function()
		{
			this._actorSprite = new dsSVActorForMenu.Sprite_ActorMenu;
			this._actorSprite.setBattler(this._actor);
			this.addChild(this._actorSprite);
		};

		dsJobChange.Window_JobStatus.prototype.updateSprites = function()
		{
			var bitmap = ImageManager.loadSvActor(this._actor.battlerName());
			var cw = bitmap.width / 9;
			var ch = bitmap.height / 6;
			var cx = this.standardPadding() + 120 + 144 / 2;
			var cy = this.standardPadding() + 4 + ch;
			this._actorSprite.setBattler(this._actor);
			this._actorSprite.setHome(cx, cy);
			this._actorSprite.startIdleMotion();
		};

		dsJobChange.Window_JobStatus.prototype.refresh = function()
		{
			this.contents.clear();
			if ( this._actor )
			{
				var statusWidth = 162 + 180 + 168;
				var w = this.width - this.padding * 2;
				var h = this.height - this.padding * 2;
				var width = w - 162 - this.textPadding();
				var x = (w - statusWidth) / 2;
				this.drawActorSimpleStatus(this._actor, x+162, 0, width);
			}
		};

	} // Imported.dsSVActorForMenu

	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------

	if ( Imported.YEP_JobPoints )
	{
		//----------------------------------------------------------------------
		/** Window_JobStatus */
		var _Window_JobStatus_drawActorSimpleStatus = dsJobChange.Window_JobStatus.prototype.drawActorSimpleStatus;
		dsJobChange.Window_JobStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width)
		{
			_Window_JobStatus_drawActorSimpleStatus.call(this, actor, x, y, width);
			var lineHeight = this.lineHeight();
			var classId = actor.currentClass().id;
			this.drawActorJp(actor, classId, x + 180, y + lineHeight, 188, 'right');
		};

		//----------------------------------------------------------------------
		/** Window_JobParameter */
		var _Window_JobParameter_refresh = exports.Window_JobParameter.prototype.refresh;
		exports.Window_JobParameter.prototype.refresh = function()
		{
			_Window_JobParameter_refresh.call(this);
			if ( this._actor )
			{
				var actor = (this._tempActor) ? this._tempActor : this._actor;
				var lineHeight = this.lineHeight();
				var classId = actor.currentClass().id;
				this.drawActorJp(actor, classId, 0, lineHeight * 9, 188, 'right');
			}
		};

	} // Imported.YEP_JobPoints

}((this.dsJobChangeMenuAlt01 = this.dsJobChangeMenuAlt01 || {})));
