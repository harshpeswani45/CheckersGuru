function showRules(id1, id2) {
	var e = document.getElementById(id1);
	var s = document.getElementById(id2)
	if (e.style.display == 'block') {
		e.style.display = 'none';
		s.innerHTML = "Display Rules"
	}
	else {
		e.style.display = 'block';
		s.innerHTML = "Hide Rules"
	}
};

function hideRules(id1)
{
	var e = document.getElementById(id1);
	var s = document.getElementById("showRules");
	e.style.display = 'none';
	s.innerHTML = "Display Rules"
}
function changeAItoRed() {

	console.log("here AI can become Red");
	//console.log(board.is_ai_red);
	board.is_ai_red = true;
	//console.log(board.is_ai_red);
	ai_turn = true;
	console.log(ai_turn)
	//board.is_red_top = false;
	//ai_class = "redPiece";
	//player_Class = "blackPiece";
	//ai_turn = true;
	
}
function changeAItoBlue() {
	console.log("here AI can become Blue");
	board.is_ai_red = false;
	ai_turn = true;
	console.log(ai_turn)
	//board.is_ai_red = !board.is_ai_red;
	//board.is_red_top = true;
	//ai_class = "blackPiece";
	//player_Class = "redPiece";
	//ai_turn = true;
	
}
function showHA(id) {
	document.getElementById(id).style.display = 'block';
}
function showAA(id) {
	document.getElementById(id).style.display = 'block';
}
function hideHA(id) {
	document.getElementById(id).style.display = 'none';
}
function hideAA(id) {
	document.getElementById(id).style.display = 'none';
}


function showTable(id1) {
	var e = document.getElementById(id1);
	e.style.display = 'block';
	understanding_mode = true;
};
function hideTable(id1) {
	var e = document.getElementById(id1);
	e.style.display = 'none';

}
function hidePlay(id) {
	document.getElementById(id).disabled = false;
}

function hideUnderstand(id) {
	document.getElementById(id).disabled = false;
	understanding_mode = false;
}

function disableModes(id1, id2, id3) {
	document.getElementById(id1).disabled = true;
	document.getElementById(id2).disabled = true;
	document.getElementById(id3).disabled = true;
}

function disableAImoveBtn(id) 
{ 

	
		board.is_ai_red = false;
		if (id.checked)
		{
			//document.getElementById("AIMove").innerHTML = "AI-Move";
			document.getElementById("AIMove").disabled = true;
			AutoAI = true;
			console.log("AutoAI : "+AutoAI);
		}
		else 
		{
			//document.getElementById("AIMove").innerHTML = "AI-Move";
			document.getElementById("AIMove").disabled = false;
			document.getElementById("RedAIMove").disabled = false;
		
			AutoAI = false;
			console.log("AutoAI : "+AutoAI);
		}

		if(AIvsAI && AutoAI)
		{	
		
			document.getElementById("AIMove").disabled = true;
			document.getElementById("RedAIMove").disabled = true;
			var i = 2000;
			while(i)
			{	
				console.log("Before : "+board.is_ai_red);
				setTimeout(() => {  MakeAIMove(); }, 2000);

				console.log("After : "+board.is_ai_red);
				i= i-1;

			}
		}
		


}
function disableAImoveBtnAA(id) {
	
	board.is_ai_red = false;
	if (id.checked){
		document.getElementById("AIMove").disabled = false;
		//document.getElementById("AIMove").innerHTML = "AI(B)Move";
		AIvsAI = true;
		console.log("AIvsAI : "+AIvsAI);
		//document.getElementById("AIAutoMove").disabled = true;
		//AutoAI = true;
	}
	else {
		//document.getElementById("AIMove").disabled = true;
		//document.getElementById("AIMove").innerHTML = "AI-Move";
		AIvsAI = false;
		console.log("AIvsAI : "+AIvsAI);
		//document.getElementById("AIAutoMove").disabled = false;
		//AutoAI = false;
	}
	if(AIvsAI && AutoAI)
	{	
		
		document.getElementById("AIMove").disabled = true;
		document.getElementById("RedAIMove").disabled = true;
		var i = 10;
			while(i)
			{	
				console.log("Before : "+board.is_ai_red);
				setTimeout(() => {  MakeAIMove(); }, 2000);
				console.log("After : "+board.is_ai_red);
				i= i-1;

			}
		
	}
}
function showAIBlueBtn(id) {
	if (id.checked) {
		document.getElementById("RedAIMove").style.display = 'block';
		//AutoAI = true;
	}
	else {
		document.getElementById("RedAIMove").style.display = 'none';
		//AutoAI = false;
	}
}


function cellVisibility(id) {


	var id;
	if (id.checked) {
		for (var i = 1; i <= 8; i++) {
			for (var j = 1; j <= 8; j++) {

				id = i * 10 + j;
				document.getElementById("cell" + id).style.visibility = "visible";


			}
		}
	}
	else {
		for (var i = 1; i <= 8; i++) {
			for (var j = 1; j <= 8; j++) {

				id = i * 10 + j;
				document.getElementById("cell" + id).style.visibility = "hidden";


			}
		}
	}

};

function difficultyLevel(id) {
	//MAX_DEPTH=1;
	console.log(board.MAX_DEPTH)

	var d = document.getElementById(id);
	id1 = d.options[d.selectedIndex].id;
	console.log(id1)
	if (id1 == "Medium") {
		if (!understanding_mode)
			board.heuristic = 6;
		board.MAX_DEPTH = 4;
		console.log(board.MAX_DEPTH, board.heuristic);
	}
	else if (id1 == "Hard") {
		if (!understanding_mode)
			board.heuristic = 7;
		board.MAX_DEPTH = 5;
		console.log(board.MAX_DEPTH, board.heuristic);
	}
	else {
		if (!understanding_mode)
			board.heuristic = 4;
		board.MAX_DEPTH = 2;
		console.log(board.MAX_DEPTH, board.heuristic);
	}
	console.log(board.MAX_DEPTH);
}
function setTurn(id){
	var d = document.getElementById(id);
	var id1 = d.options[d.selectedIndex].id;
	console.log(id1)
	if (id1 == "You") {
		user_is_first = true;
		ai_is_first = false;
		console.log("Your turn");
	}
	else if (id1 == "AI") {
		user_is_first = false;
		ai_is_first = true;
		console.log("AI's turn");
	}
	else if(id1 == "Random") {
		setRandomTurn();
	}
	else{
		console.log("Redundant option")
		user_is_first = false
		ai_is_first = false
	}
}
function setRandomTurn(){
		var turns = ['You','AI']
		var val =turns[Math.floor(Math.random() * (turns.length))];
		console.log("inside random turn")
		console.log("====="+val)
		if(val == "You")
		{ user_is_first = true; ai_is_first = false; console.log("Your turn");}
		else
		{ user_is_first = false; ai_is_first = true; console.log("AI's turn"); }
}
//============================== Learn Mode functions ===============
function proficiencyLevel(id){
	var d = document.getElementById(id);
	var id1 = d.options[d.selectedIndex].id;
	//console.log(id1)
	if (id1 == "Medium") {
		proficiency = 2
		console.log(proficiency);
	}
	else if (id1 == "Hard") {
		proficiency = 3
		console.log(proficiency);
	}
	else {
		proficiency = 1
		console.log(proficiency);
	}
	//console.log(proficiency);
}

function disableShuffle()
{
	$("#shuffle").prop("disabled",true);
}
function learn_mode_board()
{
	learn_mode = true;
	board.clear_board();
	render_board(board);
}
function learnModePlay()
{
	if(shuffled)
	 { 
		 alert("Remember: You will get only ONE move ");
		 GameStarted();
		 disableShuffle();
		 disableModes('play','understand','learn')
	 }
	 else{
		 alert("Shuffle the board at least one before starting the game ");
	 }
}
function originalBoard()
{
	learn_mode = false;
	board.reset_board(newBoard.board)
	render_board(board);
}
//===========================================================================
function setHeuristic(id) {
	//MAX_DEPTH=1;
	console.log("Hii Heuristic value updated");
	console.log(board.heuristic)
	var d = document.getElementById(id);
	id1 = d.options[d.selectedIndex].id;
	var a = document.getElementById("heuristic_id");
	console.log(a)
	if(id1=="M1")
		{ use_monte_carlo = true; console.log("heuristic set to monte carlo"); }
	else
		use_monte_carlo = false;
	
	if (id1 == "H1") {
		board.heuristic = 1;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 2 * (my_king_pieces - opp_king_pieces)";
		console.log(board.heuristic);
	}
	else if (id1 == "H2") {
		board.heuristic = 2;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.75* (my_king_pieces - opp_king_pieces)";
		console.log(board.heuristic);
	}
	else if (id1 == "H3") {
		board.heuristic = 3;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces)";
		console.log(board.heuristic);
	}
	else if (id1 == "H4") {
		board.heuristic = 4;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.25 * (my_king_pieces - opp_king_pieces)";
		console.log(board.heuristic);
	}
	else if (id1 == "H5") {
		board.heuristic = 5;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1 * (my_king_pieces - opp_king_pieces)";
		console.log(board.heuristic);
	}
	else if (id1 == "H6") {
		board.heuristic = 6;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces) + 0.2 * (my_corner_pieces - opp_corner_pieces)";
		console.log(board.heuristic);
	}
	else {
		board.heuristic = 7;
		a.innerHTML = "<h3>Selected Heuristic Function is </h3>(my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces) + 0.4 * (my_corner_pieces - opp_corner_pieces)";
		console.log(board.heuristic);
	}

}

function showPoints() {
	//Score will come in values variable
	var values = board.show_gains_util();
	console.log(values);
	//Implement this
	var tables = document.getElementById('show_table');
	//tables.innerHTML = "<tr><td class ='show_points'><button class="button button1" id="refresh_gains" onclick="refreshGains()">Refresh</button></td></tr>";
	tables.innerHTML = "<tr><td class='show_points'>From Cell</td><td class='show_points'>Gain</td></tr>";
	
	for (var i = 0; i < values.length; i++) {
		var from_id = values[i].from_row.toString() + values[i].from_col.toString()
		//var to_id=values[i].from_row.toString()+values[i].to_col.toString()
		var gain = values[i].gain.toString()
		// tables.innerHTML += "<tr><td class='show_points'>"+from_id+"</td><td class='show_points'>" + gain + "</td></tr>";
		tables.innerHTML += "<tr><td class='show_points'><button class='showMoveSequenceButton' onclick='showMoveSeq("+from_id+")'>" + from_id + "</button></td><td class='show_points'>" + gain + "</td></tr>";
	}


}

var last_refresh = false;
function refreshGains(){
	var tmp = board.is_ai_red;
	board.is_ai_red = !last_refresh;
	var values = board.show_gains_util();
	board.is_ai_red = tmp;
	last_refresh = !last_refresh;
	console.log(values);
	//Implement this
	var tables = document.getElementById('show_table');
	//tables.innerHTML = "<tr><td class ='show_points'><button class="button button1" id="refresh_gains" onclick="refreshGains()">Refresh</button></td></tr>";
	tables.innerHTML = "<tr><td class='show_points'>From Cell</td><td class='show_points'>Gain</td></tr>";
	
	for (var i = 0; i < values.length; i++) {
		var from_id = values[i].from_row.toString() + values[i].from_col.toString()
		//var to_id=values[i].from_row.toString()+values[i].to_col.toString()
		var gain = values[i].gain.toString()
		tables.innerHTML += "<tr><td class='show_points'><button class='showMoveSequenceButton' onclick='showMoveSeq("+from_id+")'>" + from_id + "</button></td><td class='show_points'>" + gain + "</td></tr>";
	}
}
/* ========================== Some vars============*/
var duplicateBoard = new Board(true, false);

/*================================ show Move Sequence modal (Understanding Mode) ===================== */
var moveSeq = []
var moveSeqIndex = -1;

function showMoveSeq(id) {
	var modal = document.getElementById("modalMoveSeq");
	moveSeq = board.show_gains_of_piece_util(Math.floor(id/10), id%10, true)[0];
	moveSeq.pop(); // last element is not a move 

	$("#modalBodyMoveSeq").empty();
	var modalBoard = $("#checkers").clone();
	$("#modalBodyMoveSeq").append(modalBoard);
	modal.style.display = "block";

	$("#reviewMoveSeq").prop("disabled", true);
	$("#prevMoveOfSeq").prop("disabled", true);
	$("#nextMoveOfSeq").prop("disabled", false);
	
	duplicateBoard.reset_board(board.board);
}

function nextMoveOfSeq() {
	moveSeqIndex++;
	if (moveSeqIndex < moveSeq.length) {
		var move = moveSeq[moveSeqIndex];
		var captures = move.captures;
		console.log("Next Move index", moveSeqIndex)

		moveSeq[moveSeqIndex].piece_val = board.board[move.from_row][move.from_col]; // store the piece for prev button (since piece can become king piece)

		for (var i = 0; i < captures.length; i++) {
			moveSeq[moveSeqIndex].captures[i][2] = board.board[captures[i][0]][captures[i][1]]; // store the piece for prev button
		}

		board.make_move(move);
		render_board(board);

		$("#modalBodyMoveSeq").empty();
		var modalBoard = $("#checkers").clone();
		$("#modalBodyMoveSeq").append(modalBoard);

		$("#prevMoveOfSeq").prop("disabled", false);
		$("#reviewMoveSeq").prop("disabled", false);
	}

	if (moveSeq.length-1 == moveSeqIndex)
		$("#nextMoveOfSeq").prop("disabled", true);
}

function prevMoveOfSeq() {
	if (moveSeqIndex >= 0) {
		var move = moveSeq[moveSeqIndex];
		console.log("Prev Move index", moveSeqIndex)

		// since doing undo. `from` becomes `to`
		var to_row = move.from_row;
		var to_col = move.from_col;
		var from_row = move.to_row;
		var from_col = move.to_col;
		var piece_val = move.piece_val;
		var captures = move.captures;

		board.board[to_row][to_col] = piece_val;
		board.board[from_row][from_col] = 0;

		for (var i = 0; i < captures.length; i++) {
			board.board[captures[i][0]][captures[i][1]] = captures[i][2]; // restore the captured piece
		}

		render_board(board);
		$("#modalBodyMoveSeq").empty();
		var modalBoard = $("#checkers").clone();
		$("#modalBodyMoveSeq").append(modalBoard);
		$("#nextMoveOfSeq").prop("disabled", false);

		moveSeqIndex--;
	}

	if (moveSeqIndex == -1) {
		$("#reviewMoveSeq").prop("disabled", true);
		$("#prevMoveOfSeq").prop("disabled", true);
	}
}

function reviewMoveSeq() {
	moveSeqIndex = -1;

	$("#prevMoveOfSeq").prop("disabled", true);
	$("#nextMoveOfSeq").prop("disabled", false);
	$("#reviewMoveSeq").prop("disabled", true);

	// FIXME render_board bug
	board.clear_board();
	render_board(board);
	board.reset_board(duplicateBoard.board);
	render_board(board);

	$("#modalBodyMoveSeq").empty();
	var modalBoard = $("#checkers").clone();
	$("#modalBodyMoveSeq").append(modalBoard);
}

function closeModalMoveSeq() {
	moveSeq = [];
	moveSeqIndex = -1;

	board.clear_board();
	render_board(board);
	board.reset_board(duplicateBoard.board);
	render_board(board);
	var modal = document.getElementById("modalMoveSeq");
	modal.style.display = "none";
}

/*================================ show Hint modal ===================== */

function showHint() {
	// make a copy of original board and make changes in the cloned board

	var modal = document.getElementById("modalMoveSeq");
	moveSeq = board.show_user_hint();

	$("#modalBodyMoveSeq").empty();
	var modalBoard = $("#checkers").clone();
	$("#modalBodyMoveSeq").append(modalBoard);
	modal.style.display = "block";

	$("#reviewMoveSeq").prop("disabled", true);
	$("#prevMoveOfSeq").prop("disabled", true);
	$("#nextMoveOfSeq").prop("disabled", false);
	
	duplicateBoard.reset_board(board.board);
}

/*================ undo button ========================= */
function undoMove() {

	if (board.prev_boards.length > 0) {
		var lastState = board.prev_boards.pop();
		board.clear_board();
		render_board(board);
		board.reset_board(lastState);
		render_board(board);
	}
	else {
		console.log("that't it!!!");
	}
}
/*================ win Message Modal ==================== */
function closeWinMessage() {
	/*
	var newBoard = new Board(true, false);
	newBoard.copyOf(board);
	render_board(board);
	var modal = document.getElementById("winMessageModal");
	modal.style.display = "none";
	*/
	window.location.reload();
	
}
function revertBack(){
	if(life>0)
	{
		undoMove();
		life--;
		var modal = document.getElementById("winMessageModal");
		modal.style.display = "none";
		
	}
	else{
		$("#win").text("Oops! You are out of Lives :(");
		$("#win_undo").prop("disabled",true);
		var modal = document.getElementById("winMessageModal");
		modal.style.display = "block";
	}
}

/*============================== Analyse modal =================== */
var mistakeList = [];
var mistakeIndex = 0;
var from_id, to_id, best_id, best_gain, user_gain;

function analyseGame(flag=0) {

	
	//if(!learn_mode)
		mistakeList = board.get_mistakes();

	console.log("No of mistakes", mistakeList.length);
	if (mistakeList.length == 0) {
		console.log("Nothing to Review. You played well!");
		$("#win").text("Nothing to Review. You played well!");
		var modal = document.getElementById("winMessageModal");
		$("#analyse").hide();
		modal.style.display = "block";
	} else {
		var modal = document.getElementById("winMessageModal");
		modal.style.display = "none";
		var modal1 = document.getElementById("analyseModal");
		modal1.style.display = "block";
		
		$("#review_mistake").prop("disabled", true);
		$("#prev_move").prop("disabled", true);
		$("#prev_mistake").prop("disabled", true);
		
		if (mistakeList.length == 1)
			$("#next_mistake").prop("disabled", true);

		var move = mistakeList[0].move;
		var user_gain_lost = mistakeList[0].gain_lost;
		var board_matrix = mistakeList[0].board;

		from_id = move.from_row * 10 + move.from_col;
		to_id = move.to_row * 10 + move.to_col;

		board.clear_board();
		render_board(board);
		board.reset_board(board_matrix);
		render_board(board);
		board.copyOf(duplicateBoard);

		moveSeq = board.show_user_hint();
		moveSeqIndex = -1;

		console.log(moveSeq.length);
		
		var best_move = moveSeq[0];
		best_id = best_move.to_row * 10 + best_move.to_col;

		best_gain = best_move.val - (-1) * board.evaluate_board(); // board.evaluate_board() is wrt. AI. So * (-1) 
		user_gain = best_gain - user_gain_lost;

		displayCell(from_id, to_id, best_id, user_gain, best_gain);

		$("#analyseBody").empty();
		var modalBoard = $("#checkers").clone();
		$("#analyseBody").append(modalBoard);
	}
}

function closeAnalyseModal() {
	window.location.reload();
}

function nextMoveFromAnalysis() {
	moveSeqIndex++;
	if (moveSeqIndex == 0)
		resetCell(from_id, to_id, best_id);
	
	if (moveSeqIndex < moveSeq.length) {
		var move = moveSeq[moveSeqIndex];
		var captures = move.captures;
		console.log("Next Move index", moveSeqIndex);
		
		moveSeq[moveSeqIndex].piece_val = board.board[move.from_row][move.from_col]; // store the piece for prev button (since piece can become king piece)

		for (var i = 0; i < captures.length; i++) {
			moveSeq[moveSeqIndex].captures[i][2] = board.board[captures[i][0]][captures[i][1]]; // store the piece for prev button
		}

		board.make_move(move);	
		render_board(board);

		$("#analyseBody").empty();
		var modalBoard = $("#checkers").clone();
		$("#analyseBody").append(modalBoard);

		$("#prev_move").prop("disabled", false);
		$("#review_mistake").prop("disabled", false);
	}

	if (moveSeq.length-1 == moveSeqIndex)
		$("#next_move").prop("disabled", true);
}

function prevMoveFromAnalysis() {
	if (moveSeqIndex >= 0) {
		var move = moveSeq[moveSeqIndex];
		console.log("Prev Move index", moveSeqIndex)

		// since doing undo. `from` becomes `to`
		var to_row = move.from_row;
		var to_col = move.from_col;
		var from_row = move.to_row;
		var from_col = move.to_col;
		var piece_val = move.piece_val;
		var captures = move.captures;

		board.board[to_row][to_col] = piece_val;
		board.board[from_row][from_col] = 0;

		for (var i = 0; i < captures.length; i++) {
			board.board[captures[i][0]][captures[i][1]] = captures[i][2]; // restore the captured piece
		}

		render_board(board);
		$("#analyseBody").empty();
		var modalBoard = $("#checkers").clone();
		$("#analyseBody").append(modalBoard);
		$("#next_move").prop("disabled", false);

		moveSeqIndex--;
	}

	if (moveSeqIndex == -1) {
		$("#review_mistake").prop("disabled", true);
		$("#prev_move").prop("disabled", true);
	}
}

function reviewMistake() {
	moveSeqIndex = -1;

	$("#prev_move").prop("disabled", true);
	$("#next_move").prop("disabled", false);
	$("#review_mistake").prop("disabled", true);

	board.clear_board();
	render_board(board);
	board.reset_board(duplicateBoard.board);

	displayCell(from_id, to_id, best_id, user_gain, best_gain);
	render_board(board);

	$("#analyseBody").empty();
	var modalBoard = $("#checkers").clone();
	$("#analyseBody").append(modalBoard);
}

function prevMistake() 
{
	var modal1 = document.getElementById("analyseModal");
	modal1.style.display = "block";
	
	mistakeIndex--;

	$("#review_mistake").prop("disabled", true);
	$("#prev_move").prop("disabled", true);
	$("#next_move").prop("disabled", false);
	
	if (mistakeIndex == 0) 
		$("#prev_mistake").prop("disabled", true);
	else
		$("#prev_mistake").prop("disabled", false);

	if (mistakeList.length-1 == mistakeIndex)
		$("#next_mistake").prop("disabled", true);
	else
		$("#next_mistake").prop("disabled", false);

	var move = mistakeList[mistakeIndex].move;
	var user_gain_lost = mistakeList[mistakeIndex].gain_lost;
	var board_matrix = mistakeList[mistakeIndex].board;

	if (moveSeqIndex == -1)
		resetCell(from_id, to_id, best_id);

	from_id = move.from_row * 10 + move.from_col;
	to_id = move.to_row * 10 + move.to_col;

	board.clear_board();
	render_board(board);
	board.reset_board(board_matrix);
	render_board(board);
	board.copyOf(duplicateBoard);

	moveSeq = board.show_user_hint();
	moveSeqIndex = -1;
	
	var best_move = moveSeq[0];
	best_id = best_move.to_row * 10 + best_move.to_col;

	best_gain = best_move.val - (-1) * board.evaluate_board(); // board.evaluate_board() is wrt. AI. So * (-1) 
	user_gain = best_gain - user_gain_lost;

	displayCell(from_id, to_id, best_id, user_gain, best_gain);

	$("#analyseBody").empty();
	var modalBoard = $("#checkers").clone();
	$("#analyseBody").append(modalBoard);
}

function nextMistake() {
	var modal1 = document.getElementById("analyseModal");
	modal1.style.display = "block";
	
	mistakeIndex++;
	$("#mistake_id").text("Analyze mistake "+(mistakeIndex+1));
	$("#review_mistake").prop("disabled", true);
	$("#prev_move").prop("disabled", true);
	$("#next_move").prop("disabled", false);
	
	if (mistakeIndex == 0) 
		$("#prev_mistake").prop("disabled", true);
	else
		$("#prev_mistake").prop("disabled", false);

	if (mistakeList.length-1 == mistakeIndex)
		$("#next_mistake").prop("disabled", true);
	else
		$("#next_mistake").prop("disabled", false);

	var move = mistakeList[mistakeIndex].move;
	var user_gain_lost = mistakeList[mistakeIndex].gain_lost;
	var board_matrix = mistakeList[mistakeIndex].board;

	if (moveSeqIndex == -1)
		resetCell(from_id, to_id, best_id);

	from_id = move.from_row * 10 + move.from_col;
	to_id = move.to_row * 10 + move.to_col;
		
	board.clear_board();
	render_board(board);
	board.reset_board(board_matrix);
	render_board(board);
	board.copyOf(duplicateBoard);

	moveSeq = board.show_user_hint();
	moveSeqIndex = -1;
	
	var best_move = moveSeq[0];
	best_id = best_move.to_row * 10 + best_move.to_col;

	best_gain = best_move.val - (-1) * board.evaluate_board(); // board.evaluate_board() is wrt. AI. So * (-1) 
	user_gain = best_gain - user_gain_lost;

	displayCell(from_id, to_id, best_id, user_gain, best_gain);

	$("#analyseBody").empty();
	var modalBoard = $("#checkers").clone();
	$("#analyseBody").append(modalBoard);
}

function resetCell(from_id, to_id, best_id) {
	$("#" + from_id).css("background", "black");
	
	$("#" + to_id).css("border", "2px solid black");
	$("#" + best_id).css("border", "2px solid black");

	$("#" + to_id).children("p").text(" ");
	$("#" + best_id).children("p").text(" ");

	$("#" + to_id).prop("title","");
	$("#" + best_id).prop("title","");
	
}

function displayCell(from_id, to_id, best_id, to_gain, best_gain) {
	
	$("#" + from_id).css("background", "#6df736");

	$("#" + to_id).css("border", "7px solid #f25207");
	$("#" + best_id).css("border", "7px solid #f5f233");

	$("#" + to_id).children("p").text("Your move");
	$("#" + best_id).children("p").text("Best move");
	//var text=""+
	$("#" + to_id).prop("title","gain"+to_gain);
	$("#" + best_id).prop("title","gain"+best_gain);
}


