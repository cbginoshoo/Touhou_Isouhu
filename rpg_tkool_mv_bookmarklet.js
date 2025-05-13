
 (function(){
	try {
		if( window.localStorage ){
			if(    document.referrer.match(/^https?\:\/\/game\.nicovideo\.jp\/atsumaru\//i) 
			 || window.location.href.match(/^https?\:\/\/game\.nicovideo\.jp\/atsumaru\//i) 
			){
				alert('CAUTION : Unsupported Server Save\n\n'+ window.location.href );
				return false;
			}else{
			};
				setRpgTkoolMvSaveData();
		}else{
				alert('CAUTION : Unsupported LocalStorage');
		};
	} catch ( err ){
				alert('ERROR : '+ err );
	} finally {
	};
 })();

 function setRpgTkoolMvSaveData(){
	var div=document.createElement('div');
	div.id='id_rpg_tkool_mv_save';
	document.body.appendChild(div);

	var id=document.getElementById('id_rpg_tkool_mv_save');
	var html='<div id="" class="" style="position:fixed; z-index:9999; right:8px; top:0px;">';
	html +='    <span style="display:inline-block; background-color:aliceblue; background-color:rgba(230,240,250,0.8); border-radius:0px 0px 5px 5px; margin:0px; padding:4px; padding-top:0px; color:aliceblue; font-size:14px; font-weight:bold; line-height:150%;">';
	html +='	<span class="extension_block_1" style="border-top:0px; border-radius:0px 0px 4px 4px;">';
	html +='		<span style="font-size:16px; font-family:Bookman Old Style,IMPACT,Meiryo;">';
	html +='		<nobr>RPG MAKER MV SAVE DATA</nobr><br><span style="display:block; text-align:center;"><nobr>INPUT / OUTPUT SYSTEM</nobr><br></span>';
	html +='		</span>';
	html +='		<span style="display:block; text-align:right; color:rgb(160,180,250);">HTML5 ver.<br></span>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_2" style="">';
	html +='		SELECT<br>';
	html +='		<form style="display:block; margin:0px; padding:0px;">';
	html +='		<select id="id_rpg_tkool_mv_save_select" name="rpg_tkool_mv_save_select" style="color:#000000; background-color:#FFFFFF; background-color:rgba(250,250,255,0.9); border:1px solid; width:100%; height:38px; margin:0px; padding:0px; padding-left:4px; font-weight:bold;">';
	html +='		<option class="" value="RPG File1" selected>RPG File1</option>';
	for( var i=2; i<=20; i++ ){
	html +='		<option class="" value="RPG File'+ i +'" >RPG File'+ i +'</option>';
	};
	html +='		<option class="" value="RPG Global">RPG Global</option>';
	html +='		</select><br>';
	html +='		</form>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_2" style="">';
	html +='		INPUT<br>';
	html +='		<form action="" method="" target="" id="" name="" enctype="multipart/form-data" style="display:block; margin:0px; padding:0px;">';
	html +='		<input type="file" id="id_rpg_tkool_mv_save_input" name="files[]" onChange=";" style="cursor:pointer;">';
	html +='		</form>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_2" style="">';
	html +='		OUTPUT<br>';
	html +='		<button type="button" onclick="setRpgTkoolMvSaveDataOutput();" style="display:block; text-align:center; width:100%; height:38px; cursor:pointer;">';
	html +='		<nobr>OUTPUT</nobr>';
	html +='		</button>';
	html +='		<form action="http://web.save-editor.com/tool/rpg_tkool_mv_bookmarklet_output.cgi" method="post" target="_blank" id="id_rpg_tkool_mv_save_output_form" name="rpg_tkool_mv_save_output_form" style="margin:0px; padding:0px;">';
	html +='		<input type="hidden" id="id_rpg_tkool_mv_save_output_name" name="file_name" value="">';
	html +='		<input type="hidden" id="id_rpg_tkool_mv_save_output_data" name="file_data" value="">';
	html +='		</form>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_2" style="">';
	html +='		DELETE<br>';
	html +='		<button type="button" onclick="setRpgTkoolMvSaveDataDelete();" style="display:block; text-align:center; width:100%; height:32px; cursor:pointer;">';
	html +='		<nobr>DELETE</nobr>';
	html +='		</button>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_1" style="text-align:center;">';
	html +='		<nobr><a href="http://web.save-editor.com/tool/rpg_tkool_mv.html" target="_blank" style="cursor:pointer;">RPG MAKER MV SAVE EDITOR</a></nobr><br>';
	html +='	</span>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='	<span class="extension_block_1" style="text-align:right;">';
	html +='		<span onclick="document.getElementById(\'id_rpg_tkool_mv_save\').innerHTML=\'\'; return false;" style="display:inline-block; cursor:pointer;">× [ <a href="#" style="letter-spacing:1px; cursor:pointer;">CLOSE</a> ]</span>';
	html +='	</span>';
	html +='    </span>';
	html +='    <br>';
	html +='		<span style="display:block; height:4px;"></span>';
	html +='    <span class="save_editor_com" style="display:block; text-align:right; margin:0px; padding:0px; padding-right:6px;"><span style="display:inline-block; text-align:left; color:black; background-color:rgba(250,250,255,0.8); border-radius:4px; margin:0px; padding:4px; white-space:nowrap;">(C) <a href="http://web.save-editor.com/" target="_blank" style="color:black; cursor:pointer;">SAVE-EDITOR.com</a></span></span>';
	html +='</div>';
	html +='<style type=text/css><!--';
	html +=' #id_rpg_tkool_mv_save {';
	html +='	text-align:left; color:aliceblue; font-size:14px; font-weight:bold; line-height:150%; font-family:Meiryo;';
	html +=' }';
	html +=' #id_rpg_tkool_mv_save a {';
	html +='	color:aliceblue;';
	html +='	margin:0px; padding:0px;';
	html +='	text-decoration:underline;';
	html +='	cursor:pointer;';
	html +=' }';
	html +=' #id_rpg_tkool_mv_save a:hover {';
	html +='	color:red; text-decoration:none;';
	html +=' }';
	html +=' #id_rpg_tkool_mv_save .extension_block_1 {';
	html +='	display:block; background-color:royalblue; background-color:rgba(40,60,200,0.8); border:2px solid blue; border-radius:4px; margin:0px; padding:6px;';
	html +=' }';
	html +=' #id_rpg_tkool_mv_save .extension_block_2 {';
	html +='	display:block; background-color:royalblue; background-color:rgba(80,120,240,0.8); border:2px solid blue; border-radius:4px; margin:0px; padding:6px;';
	html +=' }';
	html +='//--></style>';
	id.innerHTML=html;
 };

 function getRpgTkoolMvSaveDataSelect(){
	var id ='id_rpg_tkool_mv_save_select';
	var value = document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
	return value;
 };

 function setRpgTkoolMvSaveDataInput( data ){
	var select = getRpgTkoolMvSaveDataSelect();
	if( data ){
		localStorage.setItem( select, data );
		alert('INPUT COMPLETE');
	}else{
		alert('INPUT ERROR');
	};
 };

 function setRpgTkoolMvSaveDataOutput(){
	var select = getRpgTkoolMvSaveDataSelect();
	var get = localStorage.getItem( select );
	if( get ){
		document.getElementById('id_rpg_tkool_mv_save_output_data').value=get;
		document.getElementById('id_rpg_tkool_mv_save_output_name').value=select;
		document.rpg_tkool_mv_save_output_form.submit();
	}else{
		alert('OUTPUT ERROR : NO FILE ('+ select +')');
	};
 };

 function setRpgTkoolMvSaveDataDelete(){
	var select = getRpgTkoolMvSaveDataSelect();
	if( window.confirm( select +' Delete ?') ){
	}else{
		return false;
	};
	var get = localStorage.getItem( select );
	if( get ){
		localStorage.removeItem( select );
		alert('DELETE COMPLETE');
	}else{
		alert('DELETE ERROR : NO FILE ('+ select +')');
	};
 };

 document.getElementById("id_rpg_tkool_mv_save_input").addEventListener("change", function(){
	var fileData = document.getElementById("id_rpg_tkool_mv_save_input").files[0];
	var reader = new FileReader();
	reader.onload = function(evt){
		var data = evt.target.result;
		setRpgTkoolMvSaveDataInput( data );
	}
	reader.readAsText(fileData, "utf-8");// 文字コードをUTF-8として読み込む
 }, true)

