function handle_ai_turn() {
	if (board.is_game_finished(ai_turn)) {
		if(learn_mode)
			return
		displayMessage(BEFORE_MAKING_MOVE);
		//return;
		
		if(AutoAI)
				return;
	}

	if (understanding_mode && !AutoAI) {
		console.log("press AI-move button to proceed");
		showPoints();
	} else {
		console.log("AI's turn");
		blacksMove = alpha_beta(board, board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true);
		AImove(blacksMove);

		ai_turn = true; // FIXME: ai_turn was becoming false . So this hack
		if (board.is_game_finished_after_making_move(ai_turn)) {
			if(learn_mode)
				return
			displayMessage(AFTER_MAKING_MOVE);
			//return;
			if(AutoAI)
				return;
		}

		ai_turn = false;
		startGame = true;
		$("#RedTurn").css("opacity", "1.0");
		$("#BlackTurn").css("opacity", "0.5");
	}

	ai_turn = false;
}
// For AutoAI mode
function MakeAIMove() {
	if (startGame) {
		if (board.is_game_finished(ai_turn)) {
			console.log("before")
			console.log(ai_turn)
			displayMessage(BEFORE_MAKING_MOVE);
			//return;
			if(AutoAI)
				return;
		}
		console.log("AutoAI's turn");
		if (board.is_ai_red) {

			//board.print_board();
			console.log("AutoRed's Turn");
			redsMove = alpha_beta(board, board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true);
			//board.print_board();
			//setTimeout(() => {  AImove(redsMove); }, 2000);
			AImove(redsMove);
			board.is_ai_red = !board.is_ai_red;



		}
		else {
			//board.print_board();
			console.log("AutoBlack's Turn");
			blacksMove = alpha_beta(board, board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true);
			//setTimeout(() => {  AImove(blacksMove); }, 2000);
			AImove(blacksMove);

			board.is_ai_red = !board.is_ai_red;

		}
		//board.print_board();
		//displayMessage();
		if (board.is_game_finished_after_making_move(ai_turn)) {
			console.log("after making move")
			console.log(ai_turn)
			displayMessage(AFTER_MAKING_MOVE);
			if(AutoAI)
				return;
		}
		// ai_turn = board.is_ai_red;
		$("#RedTurn").css("opacity", "1.0");
		$("#BlackTurn").css("opacity", "0.5");
		//ai_turn = false;
		showPoints()
	}
	else{
		alert("Press \"Play\" button to start the game ");
	}
}


function AImove(move) {

	var from_id = (parseInt(move.from_row, 10) * 10) + (parseInt(move.from_col, 10));
	var to_id = (parseInt(move.to_row, 10) * 10) + (parseInt(move.to_col, 10));
	if (prevPossibleMove != currentCapturesAndMoves) {
		hidePrevPossibleMove(prevPossibleMove);
		render_board(board);
	}

	var AIcaptures = decodeCaptures(move.captures);
	//finding out intermediate cells (when multiple captures)

	var intermediateCells = [];

	if (AIcaptures.length) {
		intermediateCells = decodeCaptures(get_path(move.from_row, move.from_col, move.captures, move.captures.length - 1));
		showIntermediate(intermediateCells);
	}
	console.log("showd intermediate cells")

	//WHY THIS CONDITION BEEN CHECKED??
	//Shouldn't it be from_row and from_col

	if (board.is_king_piece(move.to_row, move.to_col)) {

		board.board[(move.from_row)][(move.from_col)] = 0;
		if (board.is_ai_red)
			board.board[(move.to_row)][(move.to_col)] = 2;
		else
			board.board[(move.to_row)][(move.to_col)] = -2;
		render_board(board);
	}
	else {

		board.board[(move.from_row)][(move.from_col)] = 0;
		if (board.is_ai_red)
			board.board[(move.to_row)][(move.to_col)] = 1;
		else
			board.board[(move.to_row)][(move.to_col)] = -1;
		render_board(board);

	}

	//check if this piece has become a king piece
	if (board.is_king_piece(move.to_row, move.to_col) && board.is_black_piece(move.to_row, move.to_col)) {

		board.board[(move.to_row)][(move.to_col)] = -2;
		render_board(board);
	}
	if (board.is_king_piece(move.to_row, move.to_col) && board.is_red_piece(move.to_row, move.to_col)) {

		board.board[(move.to_row)][(move.to_col)] = 2;
		render_board(board);
	}




	if (AIcaptures.length) {
		setTimeout(() => { displayRedCaptures(AIcaptures, intermediateCells); }, 500);
		displayRedCaptures(AIcaptures, intermediateCells);
		hideIntermediate(intermediateCells);
	}




};
function decodeCaptures(possibleCaptures) {
	var captures = [];
	//displayMessage();
	if (possibleCaptures.length) {
		var i; var temp;
		for (i = 0; i < possibleCaptures.length; i++) {
			temp = (possibleCaptures[i][0]) * 10 + possibleCaptures[i][1];
			captures.push(temp);
			console.log(captures[i]);
		}
	}
	else {
		ai_turn = false;  // FIXME: this should not be present?
		//setTimeout(() => {  displayMessage(); }, 1000);
	}
	return captures;

};



function displayRedCaptures(captures, intermediate) {

	if (captures.length) {
		var id; var curr_i; var curr_j;
		for (i = 0; i < captures.length; i++) {
			id = captures[i];
			curr_i = Math.floor(id / 10);
			curr_j = id % 10;
			board.board[curr_i][curr_j] = 0;

		}
	}

};

function showIntermediate(intermediate) {
	if (intermediate.length) {
		var ID;
		for (i = 0; i < intermediate.length; i++) {
			ID = intermediate[i];
			$("#" + ID).fadeOut(1000);
			$("#" + ID).fadeIn();
		}

	}

};

function hideIntermediate(intermediate) {
	syncWait(200);
	if (intermediate.length) {
		var ID;
		for (i = 0; i < intermediate.length; i++) {
			ID = intermediate[i];
			$("#" + ID).toggleClass("showPath");

		}
	}
};



