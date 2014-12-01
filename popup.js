var the_code;

function ActivateEditor () {
	BehaveHooks.add(['keydown'], function(data){
		var numLines = data.lines.total,
			fontSize = parseInt( getComputedStyle(data.editor.element)['font-size'] ),
			padding = parseInt( getComputedStyle(data.editor.element)['padding'] );
		data.editor.element.style.height = (((numLines*fontSize)+padding+5))+'px';
	});

	var editor = new Behave({
		textarea: 	document.getElementById('scriptArea'),		
		replaceTab: 	true,
		softTabs: 	true,
		tabSize: 	4,
		autoOpen: 	true,
		overwrite: 	true,
		autoStrip: 	true,
		autoIndent: 	true
	});
}

function Script_Editor_Cancel () {
	$(".script-editor").remove();
};

function Script_Editor_Save () {

	if ( $(".form-control").val().length > 0 && $("#scriptArea").val().length >0 ) {
		var unique_ID = Math.round(+new Date()/1000);		

		var insert_Position = $(this).attr("position");
		// alert("clicked Save");
		var ScriptObject = {};
		ScriptObject["name"] = $(".form-control").val();
		ScriptObject["script"] = $("#scriptArea").val();

		chrome.storage.local.get(null,function (obj){
			console.log(JSON.stringify(obj));
			console.log(obj);
			if(obj.expressions == undefined){
				obj.expressions = {};
			}
			if( insert_Position != "new" ){
				obj.expressions[insert_Position] =ScriptObject;
			}else{
				obj.expressions[unique_ID]=ScriptObject;
				Generate_DashBoard_Entry(ScriptObject["name"], unique_ID);
			}
			
			document.getElementById('storageArea').value = JSON.stringify(obj);
			chrome.storage.local.set(obj,function (){
				console.log(ScriptObject);
				console.log("Storage Hogayo");
			});
		});
		Script_Editor_Cancel();		
	}else{
		var error_Script_Editor = document.createElement("div");
		error_Script_Editor.setAttribute("class", "alert-stuff alert alert-danger");
		error_Script_Editor.setAttribute("id", "error-script-alert");

		if( $(".form-control").val().length == 0 && $("#scriptArea").val().length ==0){
			error_Script_Editor.innerHTML = "<strong>Darn it!</strong> missing script a name, content";
		}else if($(".form-control").val().length ==0){
			error_Script_Editor.innerHTML = "<strong>Darn it!</strong> give script a name";
		}else if ( $("#scriptArea").val().length == 0 ) {
			error_Script_Editor.innerHTML = "<strong>Darn it!</strong> cannot save empty script";
		};

		$('.script-editor').prepend(error_Script_Editor);
		setTimeout(function (argument) {
			$('#error-script-alert').remove()
		}, 3000);		
	}

};
function Script_Editor_Reset (argument) {
	$(".form-control").val("");
	$("#scriptArea").val("");
};

function Unit_Expression_Run (data) {
	var Script_Location_Key = $(this).attr('id').split('run_exp_')[1];
	console.log(Script_Location_Key);
	var code_2_Run ;
	chrome.storage.local.get(null,function (obj){
		console.log(obj);
		code_2_Run = obj.expressions[ Script_Location_Key ]["script"];

		chrome.tabs.executeScript( {file: "jquery.js"}, function(){
			chrome.tabs.executeScript({file: "track.js"}, function(){
				chrome.tabs.executeScript({code: code_2_Run
				});
			});
		});		

	});	
};

function Unit_Expression_Remove (data) {
	console.log( "removing "+"#unit_exp_"+$(this).attr('id').split('remove_exp_')[1]);
	var Script_Location_Key = $(this).attr('id').split('remove_exp_')[1];
	$("#unit_exp_"+$(this).attr('id').split('remove_exp_')[1]).remove();
	//pass new chrome set storage api after deleting and remove all the dashboard items/recreate them
	chrome.storage.local.get(null,function (obj){
		console.log(JSON.stringify(obj));
		console.log(obj);
		delete obj.expressions[Script_Location_Key]
		document.getElementById('storageArea').value = JSON.stringify(obj);
		chrome.storage.local.set(obj,function (){
			console.log("Storage Hogayo");
		});
	});	
};

window.onload = function(){
	ActivateEditor();
};

//Function generates new entry on dashboard
function Generate_DashBoard_Entry ( Script_Name, serial_number ) {
	var Unit_Expression_Container = document.createElement("div");
	Unit_Expression_Container.setAttribute("class", "unit-exp");
	Unit_Expression_Container.setAttribute("id","unit_exp_"+serial_number);

	var Unit_Expression_Label_Container = document.createElement("span");
	Unit_Expression_Label_Container.setAttribute("class", "label label-default");
	Unit_Expression_Label_Container.innerText = Script_Name;

	var Unit_Expression_Button_Container = document.createElement("p");

	var Unit_Expression_Button_Remove_Container = document.createElement("button");
	Unit_Expression_Button_Remove_Container.setAttribute("class", "action-button pull-right btn btn-xs btn-danger");
	Unit_Expression_Button_Remove_Container.setAttribute("id","remove_exp_"+serial_number);
	Unit_Expression_Button_Remove_Container.innerHTML = "&#9747";

	var Unit_Expression_Button_Edit_Container = document.createElement("button");
	Unit_Expression_Button_Edit_Container.setAttribute("class", "action-button pull-right btn btn-xs btn-primary");
	Unit_Expression_Button_Edit_Container.setAttribute("id", "edit_exp_"+serial_number);
	Unit_Expression_Button_Edit_Container.setAttribute("position", serial_number);
	Unit_Expression_Button_Edit_Container.innerHTML = "&#9776";

	var Unit_Expression_Button_Run_Container = document.createElement("button");
	Unit_Expression_Button_Run_Container.setAttribute("class", "action-button pull-right btn btn-xs btn-success");
	Unit_Expression_Button_Run_Container.setAttribute("id", "run_exp_"+serial_number);
	Unit_Expression_Button_Run_Container.innerHTML = "&#8635";

	//add to button
	Unit_Expression_Button_Container.appendChild(Unit_Expression_Button_Remove_Container);
	Unit_Expression_Button_Container.appendChild(Unit_Expression_Button_Edit_Container);
	Unit_Expression_Button_Container.appendChild(Unit_Expression_Button_Run_Container);

	Unit_Expression_Container.appendChild(Unit_Expression_Label_Container);
	Unit_Expression_Container.appendChild(Unit_Expression_Button_Container);

	document.getElementsByClassName('dashboard-exp')[0].appendChild(Unit_Expression_Container);

	//calling neccesary event listeners on these
	document.getElementById("run_exp_"+serial_number).addEventListener('click', Unit_Expression_Run);
	document.getElementById("edit_exp_"+serial_number).addEventListener('click', Generate_Script_Editor);
	document.getElementById("remove_exp_"+serial_number).addEventListener('click', Unit_Expression_Remove);

}

//Fucntion generates Script Generator
function Generate_Script_Editor ( data ) {
	var position_creation = $(this).attr("position");

	var script_Editor_Container = document.createElement("div");
	script_Editor_Container.setAttribute("class", "script-editor");

	//script name
	var script_Editor_Title_Container = document.createElement("div");
	script_Editor_Title_Container.setAttribute("class", "script-title-name input-group");

	var script_Editor_Title_addon_Container = document.createElement("span")
	script_Editor_Title_addon_Container.setAttribute("class","input-group-addon");
	script_Editor_Title_addon_Container.innerText = "@";

	var script_Editor_Title_Name_Container = document.createElement("input");
	script_Editor_Title_Name_Container.setAttribute("class","form-control");
	script_Editor_Title_Name_Container.setAttribute("type", "text");
	script_Editor_Title_Name_Container.setAttribute("maxlength", 20);
	script_Editor_Title_Name_Container.setAttribute("placeholder", "Script Name");

	script_Editor_Title_Container.appendChild(script_Editor_Title_addon_Container);
	script_Editor_Title_Container.appendChild(script_Editor_Title_Name_Container);

	//script editor area
	var script_Editor_Area_Container = document.createElement("div");
	script_Editor_Area_Container.setAttribute("class", "script-content input-group");

	var script_Editor_Text_Area_Container = document.createElement("textarea");
	script_Editor_Text_Area_Container.setAttribute("class", "scripter");
	script_Editor_Text_Area_Container.setAttribute("id","scriptArea");
	script_Editor_Text_Area_Container.setAttribute("type", "text");
	script_Editor_Text_Area_Container.setAttribute("placeholder", "write your javascript code...");

	script_Editor_Area_Container.appendChild(script_Editor_Text_Area_Container);

	//script editor actions
	var script_Editor_Action_Container = document.createElement("div");
	script_Editor_Action_Container.setAttribute("class", "script-actions");

	var script_Editor_Save_Action_Container = document.createElement("button");
	script_Editor_Save_Action_Container.setAttribute("class", "btn btn-sm btn-success");
	script_Editor_Save_Action_Container.setAttribute("id", "Script_Editor_Save");
	script_Editor_Save_Action_Container.setAttribute("position", "new");
	script_Editor_Save_Action_Container.innerText = "Save";

	var script_Editor_Cancel_Action_Container = document.createElement("button");
	script_Editor_Cancel_Action_Container.setAttribute("class", "btn btn-sm btn-primary");
	script_Editor_Cancel_Action_Container.setAttribute("id", "Script_Editor_Cancel");
	script_Editor_Cancel_Action_Container.innerText = "Cancel";

	var script_Editor_Reset_Action_Container = document.createElement("button");
	script_Editor_Reset_Action_Container.setAttribute("class", "btn btn-sm btn-danger");
	script_Editor_Reset_Action_Container.setAttribute("id", "Script_Editor_Reset");
	script_Editor_Reset_Action_Container.innerText = "Reset";

	script_Editor_Action_Container.appendChild(script_Editor_Save_Action_Container);
	script_Editor_Action_Container.appendChild(script_Editor_Cancel_Action_Container);
	script_Editor_Action_Container.appendChild(script_Editor_Reset_Action_Container);

	//add all of it
	script_Editor_Container.appendChild(script_Editor_Title_Container);
	script_Editor_Container.appendChild(script_Editor_Area_Container);
	script_Editor_Container.appendChild(script_Editor_Action_Container);

	document.body.appendChild(script_Editor_Container);
	chrome.storage.local.get(null,function (obj){		
		
		if( position_creation != "new" ){
			$(".form-control").val(obj.expressions[ position_creation ]["name"]);
			$("#scriptArea").val(obj.expressions[ position_creation ]["script"]);
			$("#Script_Editor_Save").attr("position", position_creation );
		}
	});
	//initialize button functions
	initialize_Editor_Button_Actions(data);
	
}

// functions for save, cancel, reset on script editor
function initialize_Editor_Button_Actions(data){

	ActivateEditor();
	
	document.getElementById('Script_Editor_Save').addEventListener('click', Script_Editor_Save);
	document.getElementById('Script_Editor_Reset').addEventListener('click', Script_Editor_Reset);
	document.getElementById('Script_Editor_Cancel').addEventListener('click', Script_Editor_Cancel);
}

function hello() {
	the_code = document.getElementById('scriptArea').value;
	chrome.storage.local.get(null,function (obj){
		console.log(JSON.stringify(obj));
		console.log(obj);
		if(obj.expressions == undefined){
			obj.expressions = [];
		}
		obj.expressions.push(the_code);
		document.getElementById('storageArea').value = JSON.stringify(obj);
		chrome.storage.local.set(obj,function (){
			console.log("Storage Hogayo");
		});
	});



	chrome.tabs.executeScript( {file: "jquery.js"}, function(){

		chrome.tabs.executeScript({file: "track.js"}, function(){

			chrome.tabs.executeScript({code: the_code

			});
		});
	});

}

document.addEventListener("DOMContentLoaded",function (){
    //Fetch all contents
    chrome.storage.local.get(null,function (obj){
        console.log(JSON.stringify(obj));
        document.getElementById('storageArea').value = JSON.stringify(obj);
        //call function to load all DB scripts
        $('.dashboard-exp').empty();
        for( var ScriptObject in obj.expressions){
        	Generate_DashBoard_Entry( obj.expressions[ScriptObject]["name"], ScriptObject )
        }
        console.log("Storage Aagayo");
    });

});

function clearChromeStorage () {
    chrome.storage.local.clear(function (){
        console.log("Storage Nikalgaya");
    });
    // Math.round(+new Date()/1000);
}

document.getElementById('AddNewScript').addEventListener('click', Generate_Script_Editor);
document.getElementById('clearStorage').addEventListener('click', clearChromeStorage);