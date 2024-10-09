/*
############################################
	作者: COBRA
	改造や配布好き勝手にしても大丈夫だよ
	寧ろ積極的に配布して皆のゲーム快適にして
############################################
*/

/*:
* @plugindesc オプションにプレイヤー移動速度を追加します
* @author COBRA
* @help
* ver 1.000
*
* それだけ
* ダッシュ速度も個別に変更しようかと思ったけど計算面倒だからコメントにしました
*/

(function(){
	var _Window_Options_makeCommandList =Window_Options.prototype.makeCommandList;
	Window_Options.prototype.makeCommandList = function(){
		_Window_Options_makeCommandList.call(this);
		this.CBR_addMoveOptions();
	};

	Window_Options.prototype.CBR_addMoveOptions = function(){
		this.addCommand('移動速度', '_CBR_move');
		//this.addCommand('ダッシュ速度', '_CBR_moveDash');
	};

	Window_Options.prototype.CBR_isMoveSymbol = function(symbol){//_CBR_moveが一致したらってことで
		return symbol.contains('_CBR_move');
	};
	Window_Options.prototype.CBR_moveStatusText = function(value){//valueのテキスト
		return value;
	};

	var _CBR_Window_Options_statusText = Window_Options.prototype.statusText;
	Window_Options.prototype.statusText = function(index){//テキスト描写
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		if(this.isVolumeSymbol(symbol)){
			return this.volumeStatusText(value);
		}else if(this.CBR_isMoveSymbol(symbol)){
			return this.CBR_moveStatusText(value);
		}else{
			return _CBR_Window_Options_statusText.call(this, index);
		}
	};

	var _CBR_Window_Options_processOk = Window_Options.prototype.processOk;
	Window_Options.prototype.processOk = function(){//決定ボタン
		var index = this.index();
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		if(this.CBR_isMoveSymbol(symbol)){
			value++;
			if(value > 5){
				value = 1;
			}
			value = value.clamp(1, 5);
			this.changeValue(symbol, value);
		}else{
			_CBR_Window_Options_processOk.call(this);
		}
	};

	var _CBR_Window_Options_cursorRight = Window_Options.prototype.cursorRight;
	Window_Options.prototype.cursorRight = function(wrap){//右
		var index = this.index();
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		if(this.CBR_isMoveSymbol(symbol)){
			value++;
			value = value.clamp(1, 5);
			this.changeValue(symbol, value);
		}else{
			_CBR_Window_Options_cursorRight.call(this,wrap);
		}

	};

	var _CBR_Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
	Window_Options.prototype.cursorLeft = function(wrap){
		var index = this.index();
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		if(this.CBR_isMoveSymbol(symbol)){
			value--;
			value = value.clamp(1, 5);
			this.changeValue(symbol, value);
		}else{
			_CBR_Window_Options_cursorLeft.call(this,wrap);
		}
	};

	//必要ない気もするけど念の為
	var _CBR_ConfigManager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var temp = _CBR_ConfigManager_makeData.call(this);
		temp._CBR_move = this._CBR_move;
		//temp._CBR_moveDash = this._CBR_moveDash;
		return temp;
	};

	var ConfigManager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		ConfigManager_applyData.call(this,config);
		this._CBR_move = this.CBR_readMove(config, '_CBR_move');
		//this._CBR_moveDash = this.readVolume(config, '_CBR_moveDash');
	};
	ConfigManager.CBR_readMove = function(config, name) {//保存した値の取得
		var value = config[name];
		if (value !== undefined) {
			return Number(value).clamp(0, 5);
		} else {
			return 2;
		}
	};
	ConfigManager._CBR_move = 2;
	//ConfigManager._CBR_moveDash = 2;

	Game_Player.prototype.realMoveSpeed = function() {//2^(n+dash)
	    return this._moveSpeed + (this.isDashing() ? 1 : 0);
	};

	Game_Player.prototype.distancePerFrame = function() {//通常の歩行速度 計算式をオプションでやっちゃった方が負荷が少ない
		var x = Math.pow(2, this.realMoveSpeed()) / (256 - ((ConfigManager._CBR_move - 2) * 64));
		return x;
	};

	Game_Follower.prototype.realMoveSpeed = function() {//2^(n+dash)
	    return this._moveSpeed + (this.isDashing() ? 1 : 0);
	};

	Game_Follower.prototype.distancePerFrame = function() {//通常の歩行速度 計算式をオプションでやっちゃった方が負荷が少ない
		var x = Math.pow(2, this.realMoveSpeed()) / (256 - ((ConfigManager._CBR_move - 2) * 64));
		return x;
	};
})();