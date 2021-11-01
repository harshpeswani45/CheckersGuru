//import Board  from "board.js";
var life=3;
var prevClicked;
var prevClick;
var PossibleMove = [];
var currentCapturesAndMoves = [];
var prevPossibleMove = [];
var thisClick = 0;
var capture = [];
var move = [];
var AutoAI = false;
var AIvsAI = false;

var ai_is_first = false;
var user_is_first = false;

var understanding_mode = false;
var learn_mode = false;
var startGame = false;
var quitGame = false;
const BEFORE_MAKING_MOVE = false;
const AFTER_MAKING_MOVE = true;

var board = new Board(true, false);
var newBoard = new Board(true, false);


// board.board[4][3] = 1;
// board.board[5][4] = -1;
// board.board[6][5] = 0;
// board.board[7][6] = -1;

// board.board[1][2] = 0;
// board.board[1][4] = 0;
// board.board[1][6] = 0;
// board.board[1][8] = 0;

// board.board[2][1] = 0;
// board.board[2][3] = 0;
// board.board[2][5] = 0;
// board.board[2][7] = 0;

// board.board[3][2] = 0;
// board.board[3][4] = 0;
// board.board[3][6] = 0;
// board.board[3][8] = 0;

// board.board[8][7] = 0;

// board.board[3][6] =1;
// board.board[5][8] =1;
// board.board[6][7] =0;
// board.board[1][2] =1;
// board.board[1][4] =1;

// board.board[5][4] = -1;



board.print_board();

var ai_class = "blackPiece"; var player_class = "redPiece";
var is_red_top = true;
var ai_turn = false;

if (board.is_ai_red) {
	ai_class = "redPiece";
	player_Class = "blackPiece";
	ai_turn = true;
}

//to check the condition for game finished, has anyone won the match?
displayMessage();

$(document).ready(function () {
	render_board(board);
	//below function to hide and show the options on a perticular mode
	/*
	$('input[type="radio"]').click(function () {
		var inputValue = $(this).attr("value");
		//console.log(inputValue);
		var targetBox = $("." + inputValue + "_1");
		//console.log(targetBox);
		$(".box").not(targetBox).hide();
		$(targetBox).show();
	});
	//to make the pieces clickable
	*/
	$("td").click(clickable);
	//$("td").click(clickable);

});



function render_board(board) {
	//to render the board 

	/*
	we will use 1-based indexing for knowing the cell state of the 8X8 board like board[1][1]
	Following numbers are used to define state of a particular cell of the board
	 0 empty cell(having no piece)  
	-1 black piece
	 1 red piece
	-2 black king piece
	 2 red king piece
	 3 restricted cell(pieces can't jump on)
	 4 possible Moves cell(cell having no piece but)
	 */
	//board.print_board();

	for (var i = 1; i <= 8; i++) {
		var x = i;
		for (var j = 1; j <= 8; j++) {
			var y = j;
			cell = x * 10 + y;
			//console.log(board[i][j]);
			if ((i + j) % 2 != 0) {
				//red piece
				if (board.board[i][j] == 1) {

					var pieceClass = $("#" + cell).children("p").attr('class');
					if (pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove") {
						$("#" + cell).children("p").addClass("redPiece");
						$("#" + cell).children("p").removeClass("noPiece possibleMove");


					}

					else {
						$("#" + cell).children("p").removeClass("noPiece");
						$("#" + cell).children("p").addClass("redPiece");
					}
				}

				//red king piece

				else if (board.board[i][j] == 2) {
					//if condition to hide the possible moves if clicked anywhere else
					var pieceClass = $("#" + cell).children("p").attr('class');
					if (pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove") {
						$("#" + cell).children("p").addClass("redKingPiece");
						$("#" + cell).children("p").removeClass("noPiece possibleMove");


					}
					else {
						$("#" + cell).children("p").removeClass("noPiece");
						$("#" + cell).children("p").addClass("redKingPiece");
					}

				}

				//black piece
				else if (board.board[i][j] == -1) {
					//console.log("red");
					var pieceClass = $("#" + cell).children("p").attr('class');
					if (pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove") {
						$("#" + cell).children("p").addClass("blackPiece");
						$("#" + cell).children("p").removeClass("noPiece possibleMove");

					}
					else {
						$("#" + cell).children("p").removeClass("noPiece");
						$("#" + cell).children("p").addClass("blackPiece");
					}
				}

				//black king piece
				//showing possible moves for the AI is not required for now
				//so not covered
				else if (board.board[i][j] == -2) {
					$("#" + cell).children("p").removeClass("noPiece");
					$("#" + cell).children("p").addClass("blackKingPiece");


				}

				//no Piece or empty cell
				else if (board.board[i][j] == 0) {
					//console.log("no");
					var pieceClass = $("#" + cell).children("p").attr('class');

					if (pieceClass == "redPiece") {
						$("#" + cell).children("p").removeClass("redPiece");
						$("#" + cell).children("p").addClass("noPiece");
					}
					else if (pieceClass == "redKingPiece") {
						$("#" + cell).children("p").removeClass("redKingPiece");
						$("#" + cell).children("p").addClass("noPiece");
					}
					else if (pieceClass == "blackKingPiece") {
						$("#" + cell).children("p").removeClass("blackKingPiece");
						$("#" + cell).children("p").addClass("noPiece");
					}
					else if (pieceClass == "blackPiece") {
						$("#" + cell).children("p").removeClass("blackPiece");
						$("#" + cell).children("p").addClass("noPiece");

					}
				}
				else
					continue;

			}
		}
	}
};

function clickable() {
	// ai_turn=false implies its user's turn

	if (board.is_game_finished(ai_turn)) {
		displayMessage(BEFORE_MAKING_MOVE);
		return;
	} else if (startGame && !ai_turn) {

		prevPossibleMove = 0;

		if (thisClick == 0) {
			thisClick = this;
			var i = Math.floor(thisClick.id / 10);
			var j = thisClick.id % 10;

			if (board.is_red_piece(i, j)) {
				currentCapturesAndMoves = board.get_moves_of_piece(i, j);
				PossibleMove = decodeMoves(currentCapturesAndMoves);

				displaypossibleMove(PossibleMove);
				render_board(board);
			}
		} else {
			prevClick = thisClick;
			prevPossibleMove = currentCapturesAndMoves;
			thisClick = this;
			var curr_i = Math.floor(thisClick.id / 10);
			var curr_j = thisClick.id % 10;
			var prev_i = Math.floor(prevClick.id / 10);
			var prev_j = prevClick.id % 10;
			var move = { from_row: prev_i, from_col: prev_j, to_row: curr_i, to_col: curr_j, captures: 0 };

			if (PossibleMove.includes(parseInt(this.id, 10))) {
				var temp_captures = [];
				for (var i = 0; i < currentCapturesAndMoves.length; i++) {
					if (currentCapturesAndMoves[i]['to_row'] == curr_i && currentCapturesAndMoves[i]['to_col'] == curr_j) {
						if (temp_captures.length < currentCapturesAndMoves[i].captures.length)
							temp_captures = currentCapturesAndMoves[i].captures;
					}
				}

				hidePrevPossibleMove(prevPossibleMove);
				move = { from_row: prev_i, from_col: prev_j, to_row: curr_i, to_col: curr_j, captures: temp_captures };

				PossibleMove = [];
				newBoard.reset_board(board.board);
				board.make_move(move);
				
				hideCapturedPiece(temp_captures);
				render_board(board);
				//board.user_moved(move, newBoard.board);

				if (board.is_game_finished_after_making_move(ai_turn)) {
					displayMessage(AFTER_MAKING_MOVE);
					//return;
				}

				ai_turn = true;
				// setTimeout(() => {  handle_ai_turn(); board.user_moved(move,newBoard.board);},1000);
				setTimeout(() => { handle_ai_turn(); }, 1000);
			} else if (board.is_red_piece(curr_i, curr_j)) {
				hidePrevPossibleMove(prevPossibleMove);
				render_board(board);

				currentCapturesAndMoves = board.get_moves_of_piece(curr_i, curr_j);
				PossibleMove = decodeMoves(currentCapturesAndMoves);

				displaypossibleMove(PossibleMove);
				render_board(board);
			} else if (!board.is_red_piece(curr_i, curr_j)) {
				hidePrevPossibleMove(prevPossibleMove);
				render_board(board);
				PossibleMove = [];
			}

			if (ai_turn) {
				$("#RedTurn").css("opacity", ".5");
				$("#BlackTurn").css("opacity", "1.0");
			}
		}
	} else if (!startGame) {
		alert("Press \"Play\" button to start the game ");
	}
}

function displayMessage(after_making_move) {

	if (after_making_move && board.is_game_finished_after_making_move(ai_turn)) {
		syncWait(100);
		var text = "";

		if (board.has_drawn())
			text = "Game Drawn!";
		else {
			if (AIvsAI) {
				if (!board.is_ai_red)
					text = "AI-(R) Won!";
				else
					text = "AI-(B) Won!";
			} else {
				if (ai_turn)
					text = "AI Won!";
				else
					text = "You Won!";
			}
		}

		console.log(text + " after making move");
		$("#win").text(text);
		// if(!text.localeCompare("AI won!"))
		// 	$("#win_undo").prop("disabled",false);
		var modal = document.getElementById("winMessageModal");
		modal.style.display = "block";
		
	} else if (!after_making_move && board.is_game_finished(ai_turn)) {
		syncWait(100);

		var text = "";
		if (board.has_drawn())
			text = "Game Drawn!";
		else if (ai_turn && board.has_no_move()) // board.has_no_piece() will never arise
			if (AIvsAI)
				{
					if(board.is_ai_red)
						text = "AI-(R) Won!";
					else
						text = "AI-(B) won!"
				}
			else
				text = "You Won!";
		else if (!ai_turn && board.opponent_has_no_move()) // board.opponent_has_no_piece() will never arise
				text = "AI Won!";

		console.log(text + " before making move");
		$("#win").text(text);
		var modal = document.getElementById("winMessageModal");
		modal.style.display = "block";
		
	}
}
