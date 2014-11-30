var the_code;

window.onload = function(){

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
	
};

// Fucntion generates Script Generator
function Generate_Script_Editor ( data ) {

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

	//initialize button functions
	initialize_Editor_Button_Actions();
}

// functions for save, cancel, reset on script editor
function initialize_Editor_Button_Actions(){
	function Script_Editor_Cancel () {
		$(".script-editor").remove();
	};
	function Script_Editor_Save (argument) {
		alert("clicked Save");
	};
	function Script_Editor_Reset (argument) {
		$(".form-control").val("");
		$("#scriptArea").val("");	
	};
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
        console.log("Storage Aagayo");
    });

});

document.getElementById('clickme').addEventListener('click', hello);
document.getElementById('AddNewScript').addEventListener('click', Generate_Script_Editor);