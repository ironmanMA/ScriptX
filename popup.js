var the_code;

function hello() {
	the_code = document.getElementById('scriptArea').value;

	chrome.tabs.executeScript( {file: "jquery.js"}, function(){
		chrome.tabs.executeScript({file: "track.js"}, function(){
			chrome.tabs.executeScript({code: the_code
			});
		});
	});

	// chrome.tabs.executeScript(
	// 	{
	// 		file: 'jquery.js'
	// 	},
		
	// 	function (argument) {
	// 		chrome.tabs.executeScript(
	// 			{
	// 				file: 'track.js'
	// 			},

	// 			function (argument) {
	// 				chrome.tabs.executeScript({
	// 						code: the_code
	// 			});
	// 		}); 
	// 	}); 

}
 
document.getElementById('clickme').addEventListener('click', hello);