var the_code;

window.onload = function(){

	/*
	 * This hook adds autosizing functionality
	 * to your textarea
	 */
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