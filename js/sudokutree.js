
/* Initialize */

var mySudokuJS = $("#mainBoard").sudokuJS({ boardName: "mainBoard" });
mySudokuJS.generateBoard("medium");
var temp = mySudokuJS.getBoard();

var tree = {"board": trimBoard(temp), "prev": [], "children":[]};
tree.prev = tree.board;
var currentNode = tree;

function trimBoard(oldBoard){
	var newBoard = [];
	for(var i=0; i<81; i++){
		if(i in oldBoard && oldBoard[i].val != null) newBoard[i] = oldBoard[i].val;
	}
	
	return newBoard;
}

$(document).on("updateEvent", function(){
	var board = mySudokuJS.getBoard();
	for(x in board){
		if(board[x].val != null && board[x].val != '' && board[x].val != currentNode.board[x]){
			var j = currentNode.children.length;
			currentNode.children[j] = {"board": trimBoard(board), "prev": currentNode.board, "children":[]};
			currentNode = currentNode.children[j];
			return;
		}
	}
});

function createMainBoard(node){
	currentNode = node;
	$("#history").empty();
	document.getElementById("main").innerHTML = '<div id="mainBoard" class="sudoku-board"></div><br>\
	<button type="button" class="btn btn-primary btn-lg btn-block js-solve-step-btn btn-custom">Get Help from AI</button><br>\
	<button type="button" class="btn btn-primary btn-lg btn-block js-checkpoint-btn btn-custom">Create Checkpoint</button><br>\
	<button type="button" class="btn btn-primary btn-lg btn-block js-history-btn btn-custom">View History</button>';
	
	var tempBoard = jQuery.extend([], node.board);
	if(!(80 in tempBoard)) tempBoard[80] = undefined;
	
	mySudokuJS = $("#mainBoard").sudokuJS({
		board: tempBoard,
		boardName: "mainBoard"
	});
	
	for(var i=0; i<81; i++){
		if(!(i in tree.prev) && i in node.board){
			$("#input-mainBoard"+i).addClass("highlight-val");
			// console.log("sdffewf");
		}
	}
	
	activateButtons();
}


/* Buttons */
function activateButtons(){
	$(".js-solve-step-btn").on("click", mySudokuJS.solveStep);
	$(".js-checkpoint-btn").on("click", function(){ $(document).trigger("updateEvent"); });
	$(".js-history-btn").on("click", function(){

		$(document).trigger("updateEvent");

		mySudokuJS = null;
		$("#mainBoard").remove();
		$("#main").empty();

		document.getElementById("history").innerHTML = '<table class="table-bordered"><tbody><tr><td>\
		<br><center><div id="board" class="sudoku-board"></div>\
		<br><button type="button" class="btn btn-primary btn-lg btn-block btn-custom js-view-board">View Position</button></center>\
		<br><br><table id="tableboard" class="table table-bordered table-condensed"><tbody><tr></tr></tbody></table>\
		</td></tr></tbody></table>';
		
		$(".js-view-board").on("click", function(){ createMainBoard(tree); });
		
		var tempBoard = jQuery.extend([], tree.board);
		if(!(80 in tempBoard)) tempBoard[80] = undefined;
		
		$("#board").sudokuJS({
			board: tempBoard,
			boardName: "board"
		});
		
		for(x in tree.children) recursiveDraw(tree.children[x], "board");

	});
}

activateButtons();


/* Draw */
function recursiveDraw(node, boardName){
	
	var row = document.getElementById("table" + boardName).rows[0];
	var i = row.cells.length;
	var cell = row.insertCell(i);
	var newBoardName = boardName + i + "-";

	cell.innerHTML = '<br><center><div id="' + newBoardName + '" class="sudoku-board"></div>\
	<br><button type="button" class="btn btn-primary btn-lg btn-block btn-custom js-view-' + newBoardName + '">View Position</button></center>\
	<br><br><table id="table' + newBoardName + '" class="table-bordered"><tbody><tr></tr></tbody></table>';
	
	$(".js-view-"+newBoardName).on("click", function(){ createMainBoard(node); });
	
	var tempBoard = jQuery.extend([], node.board);
	if(!(80 in tempBoard)) tempBoard[80] = undefined;
	
	$("#"+newBoardName).sudokuJS({
		board: tempBoard,
		boardName: newBoardName
	});
	
	updateColors(node, newBoardName);
	
	for(x in node.children) recursiveDraw(node.children[x], newBoardName);
	
}

function updateColors(node, boardName){
	for(var i=0; i<81; i++){
		if(i in node.prev && !(i in node.board)){
			$("#input-"+boardName+i).addClass("board-cell--remove");
			// console.log("sdffewf");
		}
		else if(i in node.board){
			if((i in node.prev && node.board[i] != node.prev[i])){
				$("#input-"+boardName+i).addClass("board-cell--edit");
				// console.log("hhrter");
			}
			else if(!(i in node.prev)){
				$("#input-"+boardName+i).addClass("board-cell--add");
				// console.log("hhrter");
			}
		}
	}
}