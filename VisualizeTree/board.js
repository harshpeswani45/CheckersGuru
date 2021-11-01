const WIN_GAIN = 100;
const LOSE_GAIN = (-1) * WIN_GAIN;
const DRAW_GAIN = 0;
const AI_TURN = true;
const FOR_SINGLE_PIECE = true;
const DUMMY_ROW = 0;
const DUMMY_COL = 0;
const ONLY_BEST = true;
const USE_CUSTOM_MAX_DEPTH = true;
const THRESHOLD_NO_OF_MOVES_FOR_DRAW = 20;

class Board {
    constructor(is_red_top, is_ai_red) {
        /*
            Argument:
                is_red_top (boolean) : whether red pieces will be present in the top of the board
                is_ai_red (boolean) : whether AI player has red pieces
        */

        /*
            we will use 1-based indexing for knowing the cell state of the 8X8 board like board[1][1]
            Following numbers are used to define state of a particular cell of the board
             0 empty cell  
            -1 black piece
             1 red piece
            -2 black king piece
             2 red king piece
             3 restricted cell
        */
        this.board = new Array(9); 
        this.is_red_top = is_red_top;
        this.is_ai_red = is_ai_red;
        this.heuristic = 1; // default: 1; Possible heuristic: {1, 2, 3, 4, 5, 6, 7}
        this.MAX_DEPTH = 2;
        this.DEPTH_FOR_USER_HINT = 4;
        this.mistakes = new Array(); // store only 5 top mistakes
        this.prev_boards = new Array(); // store only 5 previous board states
        this.no_of_moves_since_both_have_only_one_king_piece = 0;

        for (var i = 0; i < 9; i++) 
            this.board[i] = new Array(9);

        for (var i = 0; i < 9; i++) 
            for (var j = 0; j < 9; j++) 
                this.board[i][j] = 0;

        this.init_game_board();
    }

    init_game_board() {
        
        var reverse = 1;
        if (!this.is_red_top) 
            reverse = -1;

        for (var i = 1; i <= 4; i++) {
            // put red pieces
            this.board[1][2*i] = 1 * reverse;
            this.board[2][2*i-1] = 1 * reverse;
            this.board[3][2*i] = 1 * reverse;

            // put black pieces
            this.board[6][2*i-1] = -1 * reverse;
            this.board[7][2*i] = -1 * reverse;
            this.board[8][2*i-1] = -1 * reverse;
        }

        // Restricted Cells
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 8; j++) {
                if ((i + j) % 2 == 0)
                    this.board[i][j] = 3;
            }
        }
    }

    clear_board() {
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++) 
                if (this.board[i][j] != 3)
                    this.board[i][j] = 0;
    } 

    print_board() {
        for (var i = 1; i <= 8; i++) {
            var x = "";
            for (var j = 1; j <= 8; j++) {
                var cell;
                if (this.board[i][j] == 1)
                    cell = "r";
                else if (this.board[i][j] == 2)
                    cell = "R";
                else if (this.board[i][j] == -1)
                    cell = "b";
                else if (this.board[i][j] == -2)
                    cell = "B";
                else if (this.board[i][j] == 0)
                    cell = "_";
                else 
                    cell = "x";

                x = x + " " + cell;
            }
            console.log(x);
        }
    }

    evaluate_board(ai_turn=true) {
        var gain = 0;

        if (ai_turn && this.has_no_piece())
            gain = LOSE_GAIN;
        else if (ai_turn && this.has_no_move())
            gain = LOSE_GAIN;
        else if (!ai_turn && this.opponent_has_no_piece())
            gain = WIN_GAIN;
        else if (!ai_turn && this.opponent_has_no_move())
            gain = WIN_GAIN;
        else if (this.has_drawn()) 
            gain = DRAW_GAIN;

        if (this.is_ai_red) 
            return gain + this.heuristic_function(this.count_red_pieces(), this.count_red_king_pieces(), this.count_red_corner_pieces(), this.count_black_pieces(), this.count_black_king_pieces(), this.count_black_corner_pieces());
        else
            return gain + this.heuristic_function(this.count_black_pieces(), this.count_black_king_pieces(), this.count_black_corner_pieces(), this.count_red_pieces(), this.count_red_king_pieces(), this.count_red_corner_pieces());          
    }

    heuristic_function(my_pieces, my_king_pieces, my_corner_pieces, opp_pieces, opp_king_pieces, opp_corner_pieces) {
        // default: 1; Possible heuristics: {1, 2, 3, 4, 5, 6, 7}

        if (this.heuristic == 1)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 2 * (my_king_pieces - opp_king_pieces);
        else if (this.heuristic == 2)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.75 * (my_king_pieces - opp_king_pieces);
        else if (this.heuristic == 3)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces);
        else if (this.heuristic == 4)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.25 * (my_king_pieces - opp_king_pieces);
        else if (this.heuristic == 5)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1 * (my_king_pieces - opp_king_pieces);
        else if (this.heuristic == 6)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces) + 0.2 * (my_corner_pieces - opp_corner_pieces);
        else if (this.heuristic == 7)
            return (my_pieces - my_king_pieces) - (opp_pieces - opp_king_pieces) + 1.5 * (my_king_pieces - opp_king_pieces) + 0.4 * (my_corner_pieces - opp_corner_pieces);
        }

    count_black_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_black_piece(i, j))
                    cnt++;

        return cnt;
    }

    count_black_king_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_king_piece(i, j) && this.is_black_piece(i, j))
                    cnt++;

        return cnt;
    }

    count_red_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_red_piece(i, j))
                    cnt++;

        return cnt;
    }

    count_red_king_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_king_piece(i, j) && this.is_red_piece(i, j))
                    cnt++;

        return cnt;
    }

    count_red_corner_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_corner_piece(i, j) && this.is_red_piece(i, j))
                    cnt++;

        return cnt;
    }

    count_black_corner_pieces() {
        var cnt = 0;
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++)
                if (this.is_corner_piece(i, j) && this.is_black_piece(i, j))
                    cnt++;

        return cnt;
    }

    is_king_piece(row, col) {
        if (row < 1 || col < 1 || row > 8 || col > 8)
            return false;

        return this.board[row][col] == 2 || this.board[row][col] == -2;
    }

    is_piece(row, col) {
        if (row < 1 || col < 1 || row > 8 || col > 8)
            return false;

        return this.board[row][col] == 1 || this.board[row][col] == -1 || this.is_king_piece(row, col);
    }

    is_red_piece(row, col) {
        if (row < 1 || col < 1 || row > 8 || col > 8)
            return false;

        return this.is_piece(row, col) && this.board[row][col] > 0;
    }

    is_black_piece(row, col) {
        if (row < 1 || col < 1 || row > 8 || col > 8)
            return false;

        return this.is_piece(row, col) && this.board[row][col] < 0;
    }

    is_corner_piece(row, col) {
        if (row == 1 || row == 8 || col == 1 || col == 8)
            return true;
        
        return false;
    }

    is_empty_cell(row, col) {
        if (row < 1 || col < 1 || row > 8 || col > 8)
            return false;

        return this.board[row][col] == 0;
    }

    has_no_move() {
        var all_moves = this.get_all_moves();
        return all_moves.length == 0;
    }

    opponent_has_no_move() {
        var all_moves = this.get_all_opponent_moves();
        return all_moves.length == 0;
    }

    get_all_moves() {
        var all_moves = new Array();
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 8; j++) {
                if ((this.is_ai_red && this.is_red_piece(i, j)) || (!this.is_ai_red && this.is_black_piece(i, j))) {
                    var moves = this.get_moves_of_piece(i, j);
                    if (moves.length != 0) {
                        var dict = {'from_row': i, 'from_col' : j, 'moves': moves};
                        all_moves.push(dict);
                        dict = null;
                    }

                    moves = null;
                }    
            }
        }

        return all_moves;
    }

    get_all_opponent_moves() {
        // invert the colour of the AI player. Hence, opposite player's color will be AI player's colour 
        this.is_ai_red = !this.is_ai_red;
        var all_moves = this.get_all_moves();
        //revert the change
        this.is_ai_red = !this.is_ai_red;
        return all_moves;
    }

    get_moves_of_piece(row, col,rec_call=0) {
        /*
            Arguments:
                row (int) : row no of the piece
                col (int) : col no of the piece
                rec_call  : 0 if it's not a recursive call
                            1 if it's a recursive call from a red piece
                            2 if it's a recursive call from a black piece
            Returns:
                Array of dictionaries
                each dictionary is of the following format : {'to_row': , 'to_col': , 'captures': [[row, col], ...]]
        */
        if(row <= 0 || row > 8 || col <= 0 || col > 8)
            return -1;

        if (rec_call == 0 && !this.is_piece(row, col)) 
            return new Array();

        var i=row;
        var j=col;
        var moves_lst=[];
        if (!this.is_king_piece(row, col) && (rec_call!=3 && rec_call !=4) ) {
            if (this.is_red_piece(row, col) || rec_call == 1) {
                // move downward direction
                if (this.is_red_top) {
                    // Left
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1,j-1)){
                            moves_lst.push({'to_row':i+1,'to_col':j-1, 'captures': []});
                        }
                        else if(this.is_red_piece(i+1, j-1)){
                            // do_nothing
                        }
                    }
                    if(this.is_black_piece(i+1, j-1) && this.is_empty_cell(i+2, j-2)){
                        // black piece at (i+1, j-1) will be captured. So, add in the `captures` list

                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j-1];
                        this.board[i+1][j-1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j-2,1);
                        
                        this.board[i+1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j-2, 'captures': [[i+1, j-1]]});
                        } else{
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                    }

                    // Right
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1, j+1)){
                            moves_lst.push({'to_row':i+1,'to_col':j+1, 'captures': []});
                        }
                        else if(this.is_red_piece(i+1, j+1)){
                            // do_nothing
                        }
                    }

                    if(this.is_black_piece(i+1, j+1) && this.is_empty_cell(i+2, j+2)){
                        // black piece at (i+1, j+1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;
                       
                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j+1];
                        this.board[i+1][j+1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j+2,1);
                        
                        this.board[i][j] = this_cell;
                        this.board[i+1][j+1]=tmp_cell;
                        
                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j+2, 'captures': [[i+1, j+1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                        //moves_lst.push(this.get_moves_of_piece(i+2,j+2,1));
                    }
                } else { // TODO: move upward direction
                    
                }
            } else if (this.is_black_piece(row, col) || rec_call == 2) {
                // move upward direction
                if (this.is_red_top) {
                    
                    // move in Left diagonal 
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j-1)) {
                            moves_lst.push({'to_row':i-1,'to_col':j-1, 'captures': []});
                        } else if(this.is_black_piece(i-1,j-1)) {
                            // do_nothing
                        }
                    }

                    if(this.is_red_piece(i-1,j-1) && this.is_empty_cell(i-2, j-2)){
                        // red piece at (i-1, j-1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j-1];
                        this.board[i-1][j-1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j-2,2);
                        
                        this.board[i-1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length==0){
                            moves_lst.push({'to_row':i-2,'to_col':j-2, 'captures': [[i-1, j-1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }

                    // move in Right diagonal
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j+1)){
                            moves_lst.push({'to_row':i-1,'to_col':j+1, 'captures': []});
                        } else if(this.is_black_piece(i-1,j+1)) {
                            // do nothing
                        }
                    }

                    if(this.is_red_piece(i-1,j+1) && this.is_empty_cell(i-2,j+2)){
                        // red piece at (i-1, j+1) will be captured. So, add in the `captures` list

                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j+1];
                        this.board[i-1][j+1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j+2,2);
                        
                        this.board[i-1][j+1]=tmp_cell;
                        this.board[i][j] = this_cell;
                        
                        if(tmp.length==0) {
                            moves_lst.push({'to_row':i-2,'to_col':j+2, 'captures': [[i-1, j+1]]})
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }
                }
            } 
        } else {
            if (this.is_red_piece(row, col) || rec_call == 3) {
                // move downward direction
                if (this.is_red_top) {
                    // Left
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1,j-1)){
                            moves_lst.push({'to_row':i+1,'to_col':j-1, 'captures': []});
                        }
                        else if(this.is_red_piece(i+1, j-1)){
                            // do_nothing
                        }
                    }
                    if(this.is_black_piece(i+1, j-1) && this.is_empty_cell(i+2, j-2)){
                        // black piece at (i+1, j-1) will be captured. So, add in the `captures` list

                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j-1];
                        this.board[i+1][j-1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j-2,3);
                        
                        this.board[i+1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j-2, 'captures': [[i+1, j-1]]});
                        } else{
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                    }

                    // Right
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1, j+1)){
                            moves_lst.push({'to_row':i+1,'to_col':j+1, 'captures': []});
                        }
                        else if(this.is_red_piece(i+1, j+1)){
                            // do_nothing
                        }
                    }

                    if(this.is_black_piece(i+1, j+1) && this.is_empty_cell(i+2, j+2)){
                        // black piece at (i+1, j+1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j+1];
                        this.board[i+1][j+1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j+2,3);

                        this.board[i+1][j+1]=tmp_cell;
                        this.board[i][j] = this_cell;
                        
                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j+2, 'captures': [[i+1, j+1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                        //moves_lst.push(this.get_moves_of_piece(i+2,j+2,1));
                    }
                    // move in Left diagonal 
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j-1)) {
                            moves_lst.push({'to_row':i-1,'to_col':j-1, 'captures': []});
                        } else if(this.is_red_piece(i-1,j-1)) {
                            // do_nothing
                        }
                    }

                    if(this.is_black_piece(i-1,j-1) && this.is_empty_cell(i-2, j-2)){
                        // red piece at (i-1, j-1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;
                       
                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j-1];
                        this.board[i-1][j-1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j-2,3);
                        
                        this.board[i-1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length==0){
                            moves_lst.push({'to_row':i-2,'to_col':j-2, 'captures': [[i-1, j-1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }

                    // move in Right diagonal
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j+1)){
                            moves_lst.push({'to_row':i-1,'to_col':j+1, 'captures': []});
                        } else if(this.is_red_piece(i-1,j+1)) {
                            // do nothing
                        }
                    }

                    if(this.is_black_piece(i-1,j+1) && this.is_empty_cell(i-2,j+2)){
                        // red piece at (i-1, j+1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;
                        
                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j+1];
                        this.board[i-1][j+1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j+2,3);
                        
                        this.board[i-1][j+1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length==0) {
                            moves_lst.push({'to_row':i-2,'to_col':j+2, 'captures': [[i-1, j+1]]})
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }
                } else { // TODO: move upward direction
                    
                }
                
            } else if (this.is_black_piece(row, col) || rec_call == 4) {
                // move upward direction
                if (this.is_red_top) {
                    
                    // move in Left diagonal 
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j-1)) {
                            moves_lst.push({'to_row':i-1,'to_col':j-1, 'captures': []});
                        } else if(this.is_black_piece(i-1,j-1)) {
                            // do_nothing
                        }
                    }

                    if(this.is_red_piece(i-1,j-1) && this.is_empty_cell(i-2, j-2)){
                        // red piece at (i-1, j-1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j-1];
                        this.board[i-1][j-1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j-2,4);
                        
                        this.board[i-1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length==0){
                            moves_lst.push({'to_row':i-2,'to_col':j-2, 'captures': [[i-1, j-1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }

                    // move in Right diagonal
                    if(rec_call == 0){
                        if(this.is_empty_cell(i-1,j+1)){
                            moves_lst.push({'to_row':i-1,'to_col':j+1, 'captures': []});
                        } else if(this.is_black_piece(i-1,j+1)) {
                            // do nothing
                        }
                    }

                    if(this.is_red_piece(i-1,j+1) && this.is_empty_cell(i-2,j+2)){
                        // red piece at (i-1, j+1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;
                        
                        // fix for back & forth king jump
                        var tmp_cell = this.board[i-1][j+1];
                        this.board[i-1][j+1]=0;

                        var tmp = this.get_moves_of_piece(i-2,j+2,4);
                        
                        this.board[i-1][j+1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length==0) {
                            moves_lst.push({'to_row':i-2,'to_col':j+2, 'captures': [[i-1, j+1]]})
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i-1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }

                        tmp = null;
                    }
                    
                    // Left
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1,j-1)){
                            moves_lst.push({'to_row':i+1,'to_col':j-1, 'captures': []});
                        }
                        else if(this.is_black_piece(i+1, j-1)){
                            // do_nothing
                        }
                    }
                    if(this.is_red_piece(i+1, j-1) && this.is_empty_cell(i+2, j-2)){
                        // black piece at (i+1, j-1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;

                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j-1];
                        this.board[i+1][j-1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j-2,4)
                        
                        this.board[i+1][j-1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j-2, 'captures': [[i+1, j-1]]});
                        } else{
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j-1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                    }

                    // Right
                    if(rec_call==0){
                        if(this.is_empty_cell(i+1, j+1)){
                            moves_lst.push({'to_row':i+1,'to_col':j+1, 'captures': []});
                        }
                        else if(this.is_black_piece(i+1, j+1)){
                            // do_nothing
                        }
                    }

                    if(this.is_red_piece(i+1, j+1) && this.is_empty_cell(i+2, j+2)){
                        // black piece at (i+1, j+1) will be captured. So, add in the `captures` list
                        
                        // fix for closed path move of King piece (coming back to the starting position)
                        var this_cell = this.board[i][j];
                        this.board[i][j] = 0;
                        
                        // fix for back & forth king jump
                        var tmp_cell = this.board[i+1][j+1];
                        this.board[i+1][j+1]=0;

                        var tmp=this.get_moves_of_piece(i+2,j+2,4)
                        
                        this.board[i+1][j+1]=tmp_cell;
                        this.board[i][j] = this_cell;

                        if(tmp.length == 0) {
                            moves_lst.push({'to_row':i+2,'to_col':j+2, 'captures': [[i+1, j+1]]});
                        } else {
                            for (var x = 0; x < tmp.length; x++) {
                                tmp[x]['captures'].push([i+1, j+1]);
                            }
                            moves_lst = moves_lst.concat(tmp);
                        }
                        //moves_lst.push(this.get_moves_of_piece(i+2,j+2,1));
                    }

                }
            }
        }
        return moves_lst;
    }

    make_move(move) {
        /*
            Argument:
                move : Dictionary with following keys
                        from_row : int
                        from_col : int
                        to_row : int
                        to_col : int
                        captures : Array of Arrays. Each internal array has two elements [row, col] 

        */
        var from_row = move['from_row'];
        var from_col = move['from_col'];
        var to_row = move['to_row'];
        var to_col = move['to_col'];
        var captures = move['captures'];
        
        this.board[to_row][to_col] = this.board[from_row][from_col];

        // piece comes back to it's last position due to diamond shape jump
        // don't make the previous cell (cell from where piece startd move) empty
        //                      .
        //                    b x b  
        //                  R x   x . 
        //                    b x b
        //                      .
        if (!(from_col == to_col && from_row == to_row))
            this.board[from_row][from_col] = 0;

        for (var i=0; i < captures.length; i++) {
            var row = captures[i][0];
            var col = captures[i][1];

            // if a (not crowned) piece captures opponent's piece of 7th or 2nd row (should be in the opposite side), it becomes a crowned piece
            if (!this.is_king_piece(to_row, to_col) && this.is_red_top && this.is_black_piece(row, col) && row == 7) 
                this.board[to_row][to_col] = 2; // red king piece
            
            if (!this.is_king_piece(to_row, to_col) && this.is_red_top && this.is_red_piece(row, col) && row == 2) 
                this.board[to_row][to_col] = -2; // black king piece
            
            if (!this.is_king_piece(to_row, to_col) && !this.is_red_top && this.is_black_piece(row, col) && row == 2) 
                this.board[to_row][to_col] = 2; // red king piece
            
            if (!this.is_king_piece(to_row, to_col) && !this.is_red_top && this.is_red_piece(row, col) && row == 7) 
                this.board[to_row][to_col] = -2; // black king piece

            // capture the piece by making the cell empty
            this.board[row][col] = 0;
        }

        if (!this.is_king_piece(to_row, to_col) && this.is_red_top && this.is_black_piece(to_row, to_col) && to_row == 1)
            this.board[to_row][to_col] = -2; // black king piece

        if (!this.is_king_piece(to_row, to_col) && this.is_red_top && this.is_red_piece(to_row, to_col) && to_row == 8)
            this.board[to_row][to_col] = 2; // red king piece

        if (!this.is_king_piece(to_row, to_col) && !this.is_red_top && this.is_black_piece(to_row, to_col) && to_row == 8)
            this.board[to_row][to_col] = -2; // black king piece

        if (!this.is_king_piece(to_row, to_col) && !this.is_red_top && this.is_red_piece(to_row, to_col) && to_row == 1)
            this.board[to_row][to_col] = 2; // red king piece
            
        // keeping count for draw condition
        if (this.both_have_only_one_king_piece()) {
            this.no_of_moves_since_both_have_only_one_king_piece++;
        }

        // just for sanity
        if (!this.both_have_only_one_king_piece() && this.no_of_moves_since_both_have_only_one_king_piece > 0)
            this.no_of_moves_since_both_have_only_one_king_piece = 0;
        
    }

    both_have_only_one_king_piece() {
        return this.count_black_pieces() == 1 && this.count_black_king_pieces() == 1 && this.count_red_pieces() == 1 && this.count_red_king_pieces() == 1;
    }
 
    has_drawn() {
        if (this.both_have_only_one_king_piece() && this.no_of_moves_since_both_have_only_one_king_piece > THRESHOLD_NO_OF_MOVES_FOR_DRAW)
            return true;

        return false;
    }

    has_no_piece() {
        return (this.is_ai_red && this.count_red_pieces() == 0) || (!this.is_ai_red && this.count_black_pieces() == 0);
    }

    opponent_has_no_piece() {
        return (this.is_ai_red && this.count_black_pieces() == 0) || (!this.is_ai_red && this.count_red_pieces() == 0);
    }

    is_game_finished(ai_turn) {
        return this.has_drawn() || (ai_turn && (this.has_no_piece() || this.has_no_move()) || (!ai_turn && (this.opponent_has_no_piece() || this.opponent_has_no_move())));
    }

    is_game_finished_after_making_move(ai_turn) {
        return this.has_drawn() || (ai_turn && (this.opponent_has_no_move() || this.opponent_has_no_piece())) || (!ai_turn && (this.has_no_move() || this.has_no_piece()));
    }

    copyOf(obj) {
        /*
            Create copy of `this` board object to `obj`
        */
        for (var i = 1; i <= 8; i++)
            for (var j = 1; j <= 8; j++) 
                obj.board[i][j] = this.board[i][j];

        for (var i = 0; i < this.mistakes.length; i++) 
            obj.mistakes.push(this.mistakes[i]);
        
        for (var i = 0; i < this.prev_boards.length; i++) 
            obj.prev_boards.push(this.prev_boards[i]);

        obj.is_ai_red = this.is_ai_red;
        obj.is_red_top = this.is_red_top;
        obj.MAX_DEPTH = this.MAX_DEPTH;
        obj.heuristic = this.heuristic;
        obj.DEPTH_FOR_USER_HINT = this.DEPTH_FOR_USER_HINT;
        obj.no_of_moves_since_both_have_only_one_king_piece = this.no_of_moves_since_both_have_only_one_king_piece;

        return obj;
    }

    show_user_hint() {
        /*
            Returns:

                best_move_sequence : Dictionary with following keys
                    from_row : int
                    from_col : int
                    to_row : int
                    to_col : int
                    captures : array of captured cells [row, col]
                    gain : int
                    val : board evaluation value after making MAX_DEPTH moves (AI & USER) 

            Returns the best move sequence of the user
        */  
        
        // Make the user AI. So that minimax can be called by the user
        this.is_ai_red = ! this.is_ai_red;

        // var best_move_sequence = this.show_gains_of_pieces(this, this.DEPTH_FOR_USER_HINT, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, false, 0, 0, true, USE_CUSTOM_MAX_DEPTH, this.DEPTH_FOR_USER_HINT);
        var best_move_sequence = this.show_move_sequence_with_max_gain_with_custom_depth(this.DEPTH_FOR_USER_HINT, Number.NEGATIVE_INFINITY);
        best_move_sequence.pop()

        // Revert back the change
        this.is_ai_red = ! this.is_ai_red;
        return best_move_sequence;
    }

    show_move_sequence_with_max_gain_with_custom_depth(depth) {
        /*
            Returns the move sequence with maximum gain
        */
        var gains = this.show_gains_of_pieces(this, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, !FOR_SINGLE_PIECE, DUMMY_ROW, DUMMY_COL, ONLY_BEST, USE_CUSTOM_MAX_DEPTH, depth);
        var max_gain_move_sequence;
        var max_gain = Number.NEGATIVE_INFINITY;

        // Since, `gains` can be an array not (array of array) due to the base condition
        if (!Array.isArray(gains[0])) {
            return gains;
        }

        for (var i = 0; i < gains.length; i++) {
            var gain = gains[i][0].val - this.evaluate_board(AI_TURN); 
            if (gain > max_gain) {
                max_gain_move_sequence = gains[i];
                max_gain = gain;
            }
        }
        
        return max_gain_move_sequence;
    }

    show_max_gain_util() {
        /*
            Returns the piece with maximum gain

            move : Dictionary with following keys
                    from_row : int
                    from_col : int
                    gain : int
        */
        var gains = this.show_gains_of_pieces(this, this.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        var max_gain_move;
        var max_gain = Number.NEGATIVE_INFINITY;

        for (var i = 0; i < gains.length; i++) {
            var gain = gains[i][0].val - this.evaluate_board(AI_TURN); 
            if (gain > max_gain) {
                max_gain_move = gains[i];
                max_gain = gain;
            }
        }

        // return the piece which has best move and gain
        var ret = {
            'from_row': max_gain_move[0].from_row, 
            'from_col': max_gain_move[0].from_col, 
            'gain' : max_gain
        };
        
        return ret; 
    }

    show_gains_util() {
        /*

            Returns an array dictionary. Each dictionary has following keys:
                    from_row : int
                    from_col : int
                    gain : int

        */
        var gains = this.show_gains_of_pieces(this, this.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, false, null, null, true);
        var arr = [];
        for (var i = 0; i < gains.length; i++) {
            var gain = gains[i][0].val - this.evaluate_board(AI_TURN); 
            var from_row =  gains[i][0].from_row;
            var from_col =  gains[i][0].from_col;

            var dict = {
                'from_row': from_row,
                'from_col': from_col,
                'gain': gain
            };
            arr.push(dict);
        }

        return arr;
    }

    show_gains_of_piece_util(row, col, only_best) {
        /*
            Arguments:
                row : should be present
                col : should be present
                only_best (boolean)  : for showing only the best move (with value of gain)

            Returns an array of move sequences. Each move sequence is an array of consecutive moves (first move 
            starts from the (row, col)). Each move is a dictionary with following keys:
                    from_row : int
                    from_col : int
                    to_row : int
                    to_col : int
                    captures : array of captured cells [row, col]
                    gain : int
                    val : board evaluation value after making MAX_DEPTH moves (AI & USER) 

        */
        return this.show_gains_of_pieces(this, this.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true, row, col, only_best);
    }
    
    show_gains_of_piece_with_custom_depth_util(row, col, depth, only_best) {
        /*
            Arguments:
                row : should be present
                col : should be present
                depth: should be present
                only_best (boolean)  : for showing only the best move (with value of gain)

            Returns an array of move sequences. Each move sequence is an array of consecutive moves (first move 
            starts from the (row, col)). Each move is a dictionary with following keys:
                    from_row : int
                    from_col : int
                    to_row : int
                    to_col : int
                    captures : array of captured cells [row, col]
                    gain : int
                    val : board evaluation value after making MAX_DEPTH moves (AI & USER) 

        */
        return this.show_gains_of_pieces(this, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, true, row, col, only_best, true, depth);
    }
    
    show_gains_of_pieces(board, depth, alpha, beta, maximizer, for_single_piece, row, col, only_best, use_custom_max_depth, max_depth) {
        // alpha_beta() function reused
        
        /*
            Arguments:
                board : board object
                depth : current depth (should be called with depth=board.MAX_DEPTH)
                alpha : should be called with alpha=Number.NEGATIVE_INFINITY
                beta : should be called with alpha=Number.POSITIVE_INFINITY
                maximizer : should be called with maximizer=true

                Optional:
                for_single_piece (boolean)
                row : should be present if for_single_piece is true
                col : should be present if for_single_piece is true
                only_best (boolean)  
                use_custom_max_depth (boolean)
                max_depth : should be present if use_custom_max_depth is true

            Returns:
            Returns an array of move sequences. Each move sequence is an array of consecutive moves (first move 
            starts from the (row, col)). Each move is a dictionary with following keys:
                    from_row : int
                    from_col : int
                    to_row : int
                    to_col : int
                    captures : array of captured cells [row, col]
                    gain : int
                    val : board evaluation value after making MAX_DEPTH moves (AI & USER) 

            Description:
                show gains of all the moves of the piece (row, col)      if for_single_piece is true
                show gains of the best move of all the pieces            if only_best is true
                show gain of the best move of the piece (row, col)       if for_single_piece and only_best are true            
                show gains of all the moves of all the pieces            otherwise 
                
                all the moves of a piece?
                --> if a piece has 3 choices in the "first" move, then 3 move sequence will be returned for that piece

        */
        if (depth == 0 || board.is_game_finished(maximizer)) {
            // NO MOVE depicted by (-1, -1) to (-1, -1)
            var best_next_move = {};
            best_next_move.from_row = -1;
            best_next_move.from_col = -1;
            best_next_move.to_row = -1;
            best_next_move.to_col = -1;
            best_next_move.captures = [];
            best_next_move.gain = 0;
            best_next_move.val = board.evaluate_board(maximizer);
            return [best_next_move];
        }
    
        if (maximizer) {
            var max_val = Number.NEGATIVE_INFINITY;
            var moves;
            if (! for_single_piece)
                moves = board.get_all_moves();
            else {
                console.log("Showing gains for the piece", row, col);
                moves = board.get_moves_of_piece(row, col);
                if (moves.length != 0) {
                    var dict = {'from_row': row, 'from_col' : col, 'moves': moves};
                    moves = [dict];
                } else 
                    moves = [];
            }
                
            var best_move = {};
            var best_next_move_sequence = [];
            var store_gains = [];

            for (var i = 0; i < moves.length; i++) {
                var loop_max_val = Number.NEGATIVE_INFINITY;
                var loop_best_move = {};
                var loop_best_next_move_sequence = [];

                for (var j = 0; j < moves[i]['moves'].length; j++) {
                    var this_move = {};

                    var board_copy = new Board();
                    board.copyOf(board_copy);
    
                    var move = {
                        'from_row': moves[i]['from_row'],
                        'from_col': moves[i]['from_col'],
                        'to_row': moves[i]['moves'][j]['to_row'],
                        'to_col': moves[i]['moves'][j]['to_col'],
                        'captures': moves[i]['moves'][j]['captures']
                    };
                    
                    board_copy.make_move(move);
                    var next_move_sequence = this.show_gains_of_pieces(board_copy, depth-1, alpha, beta, false, false, 0, 0, false, use_custom_max_depth, max_depth);
                    var val = next_move_sequence[0].val;

                    this_move.from_row = move['from_row'];
                    this_move.from_col = move['from_col'];
                    this_move.to_row = move['to_row'];
                    this_move.to_col = move['to_col'];
                    this_move.captures = move['captures'];
                    this_move.gain = board_copy.evaluate_board(maximizer) - board.evaluate_board(!maximizer);
                    this_move.val = val;

                    var this_move_sequence = [this_move];
                    this_move_sequence = this_move_sequence.concat(next_move_sequence)


                    if (((!use_custom_max_depth && depth == board.MAX_DEPTH) || (use_custom_max_depth && depth == max_depth)) && !only_best) {
                        store_gains = store_gains.concat([this_move_sequence]);
                    }

                    if (val > max_val) {
                        max_val = val;
                        best_move.from_row = move['from_row'];
                        best_move.from_col = move['from_col'];
                        best_move.to_row = move['to_row'];
                        best_move.to_col = move['to_col'];
                        best_move.captures = move['captures'];
                        best_move.gain = board_copy.evaluate_board(maximizer) - board.evaluate_board(!maximizer);
                        best_move.val = val;

                        best_next_move_sequence = next_move_sequence;
                    }
                    
                    if (val > loop_max_val) {
                        loop_max_val = val;
                        loop_best_move.from_row = move['from_row'];
                        loop_best_move.from_col = move['from_col'];
                        loop_best_move.to_row = move['to_row'];
                        loop_best_move.to_col = move['to_col'];
                        loop_best_move.captures = move['captures'];
                        loop_best_move.gain = board_copy.evaluate_board(maximizer) - board.evaluate_board(!maximizer);
                        loop_best_move.val = val;

                        loop_best_next_move_sequence = next_move_sequence;
                    }

                    next_move_sequence = null;
                    move = null;
                    this_move = null;
                    board_copy = null;

                    if (val > alpha)
                        alpha = val;
    
                    if (alpha >= beta)
                        break;
                }

                if (((!use_custom_max_depth && depth == board.MAX_DEPTH) || (use_custom_max_depth && depth == max_depth)) && only_best) {
                    var best_move_sequence = [loop_best_move];
                    best_move_sequence = best_move_sequence.concat(loop_best_next_move_sequence);
                    store_gains = store_gains.concat([best_move_sequence]);
                }
            }

            moves = null;
            
            if (((!use_custom_max_depth && depth != board.MAX_DEPTH) || (use_custom_max_depth && depth != max_depth))) {
                var best_move_sequence = [best_move];
                best_move_sequence = best_move_sequence.concat(best_next_move_sequence);
                return best_move_sequence;
            } else {
                return store_gains;
            }

        } else {
            var min_val = Number.POSITIVE_INFINITY;
            var moves = board.get_all_opponent_moves();
            var best_move = {};
            var best_next_move_sequence = [];
    
            for (var i = 0; i < moves.length; i++) {
                for (var j = 0; j < moves[i]['moves'].length; j++) {
                    var board_copy = new Board();
                    board.copyOf(board_copy);
    
                    var move = {
                        'from_row': moves[i]['from_row'],
                        'from_col': moves[i]['from_col'],
                        'to_row': moves[i]['moves'][j]['to_row'],
                        'to_col': moves[i]['moves'][j]['to_col'],
                        'captures': moves[i]['moves'][j]['captures']
                    };
    
                    board_copy.make_move(move);
                    var next_move_sequence = this.show_gains_of_pieces(board_copy, depth-1, alpha, beta, true, false, 0, 0, false, use_custom_max_depth, max_depth); 
                    var val = next_move_sequence[0].val;

                    if (val < min_val) {
                        min_val = val;

                        best_move.from_row = move['from_row'];
                        best_move.from_col = move['from_col'];
                        best_move.to_row = move['to_row'];
                        best_move.to_col = move['to_col'];
                        best_move.captures = move['captures'];
                        best_move.gain = board_copy.evaluate_board(maximizer) - board.evaluate_board(!maximizer);
                        best_move.val = val;

                        best_next_move_sequence = next_move_sequence;
                    }
    
                    next_move_sequence = null;
                    move = null;
                    board_copy = null;

                    if (val < beta)
                        beta = val;
    
                    if (alpha >= beta)
                        break;
                }
            }

            moves = null;

            var best_move_sequence = [best_move];
            best_move_sequence = best_move_sequence.concat(best_next_move_sequence);
            
            return best_move_sequence;
        }
    }

    reset_board(board) {
        /*
            Reset the board with the given board state
        */
        for (var i = 0; i <= 8; i++)
            for (var j = 0; j <= 8; j++) 
                this.board[i][j] = board[i][j];
    }

    user_moved(move, board) {
        /*
            Arguments:
                move (dictionary): user's move
                board (arr[9][9]): board state before the user moved
        */
        var board_copy = new Board();
        this.copyOf(board_copy);
        board_copy.reset_board(board);

        // Store previous board states for Undo button
        if (this.prev_boards.length >= 5){
            this.prev_boards.shift();
            this.prev_boards.push(board_copy.board);
        } else{
            this.prev_boards.push(board_copy.board);
        }
        
        // make the user the AI
        board_copy.is_ai_red = !board_copy.is_ai_red;

        // find the maximum gain if the user had not made the move
        var best_move_sequence = board_copy.show_move_sequence_with_max_gain_with_custom_depth(board_copy.DEPTH_FOR_USER_HINT);
        var max_gain = best_move_sequence[0].val - board_copy.evaluate_board(AI_TURN);

        // find the maximum gain considering AI's move (i.e. find the best move sequence following the user move)
        var best_move_sequence_after_user_move = this.show_move_sequence_with_max_gain_with_custom_depth(this.DEPTH_FOR_USER_HINT-1);

        // revert back the USER from AI
        board_copy.is_ai_red = !board_copy.is_ai_red;

        var max_gain_after_user_move = best_move_sequence_after_user_move[0].val - board_copy.evaluate_board(AI_TURN); // evaluate wrt. the AI
        max_gain_after_user_move = (-1) * max_gain_after_user_move; // evaluate wrt. the User

        console.log("User gain: " + max_gain_after_user_move + ", Max Gain: ", max_gain);
        if (max_gain > max_gain_after_user_move) {
            this.mistakes.push({'move': move, 'board': board_copy.board, 'gain_lost': max_gain-max_gain_after_user_move});
            console.log("======================");
            console.log("Mistakes:")
            console.log(this.mistakes[this.mistakes.length-1])
            console.log("======================");
        }

        if (this.mistakes.length > 5) {
            this.mistakes.sort(function(a, b) {return b.gain_lost - a.gain_lost}); // descending order
            this.mistakes.pop();
        }

        board_copy = null;
    }

    get_mistakes () {
        return this.mistakes;
    }

    test() {
        this.board=[[4,4,4,4,4,4,4,4,4],
                    [4,3,1,3,1,3,1,3,1],
                    [4,1,3,1,3,1,3,1,3],
                    [4,3,1,3,1,3,1,3,1],
                    [4,0,3,0,3,0,3,0,3],
                    [4,3,0,3,0,3,0,3,0],
                    [4,-1,3,-1,3,-1,3,-1,3],
                    [4,3,-1,3,-1,3,-1,3,-1],
                    [4,-1,3,-1,3,-1,3,-1,3]];

        this.board=[[4,4,4,4,4,4,4,4,4],
                    [4,3,1,3,1,3,0,3,1],
                    [4,0,3,1,3,0,3,1,3],
                    [4,3,1,3,1,3,1,3,1],
                    [4,0,3,-2,3,0,3,0,3],
                    [4,3,0,3,1,3,1,3,0],
                    [4,-1,3,-1,3,0,3,1,3],
                    [4,3,-1,3,-1,3,0,3,-1],
                    [4,-1,3,-1,3,0,3,-1,3]];

        this.print_board();

        console.log(this.show_max_gain_util());
        var x = this.show_gains_of_piece_util(4, 3);
        console.log("Board eval", this.evaluate_board());
        for (var i = 0; i < x.length; i++) {
            console.log("\n");
            console.log("New State eval: ", x[i][0].val, "Total Gain: ", x[i][0].val - this.evaluate_board());
            for (var j = 0; j < x[i].length; j++) {
                console.log("From (", x[i][j].from_row, x[i][j].from_col, ") To (", x[i][j].to_row, x[i][j].to_col, ") Gain", x[i][j].gain);
            }
        }
        // var row = 4, col = 3;
        // var moves = this.get_moves_of_piece(row, col);
        // for (var i = 0; i < moves.length; i++) {
        //     console.log(moves[i].to_row, moves[i].to_col, moves[i].captures);
        //     console.log(get_path(row, col, moves[i].captures, moves[i].captures.length-1));
        // }
        // console.log(this.evaluate_board());
        // console.log('--------------------');
        // alpha_beta(this, MAX_DEPTH, Number.MIN_VALUE, Number.MAX_VALUE, true);
        // this.print_board();
        // console.log(this.evaluate_board());
    }
}

//var board  = new Board(true, false);
//board.test();


function get_path(from_row, from_col, captures_array, captures_index) {
    /*
        Arguments:
            from_row (int) : row no of the previous cell (where the piece was present before capturing the last piece)
            from_col (int) : col no of the previous cell (where the piece was present before capturing the last piece)
            captures_array (array of arrays) : array containing all the [row, col] of captured pieces (in reverse order as returned by the get_move_of_piece())
            captures_index : the index of the captured piece (in the captures_array) which will be jumped now
        
        Returns:
            Array of Arrays. Each internal array of the format [row, col]

            The returned array contains [row, col] of all the intermediate cells (i.e. start & final cell are not included in the array)
    */
    if (captures_index <= 0 || captures_index >= captures_array.length)
        return new Array();

    var row = captures_array[captures_index][0];
    var col = captures_array[captures_index][1];

    var next_cell;

    // moving downward right diagonal
    if ((from_row + 1) == row && (from_col + 1) == col)
        next_cell = [from_row + 2, from_col + 2];
    // moving downward left diagonal
    else if ((from_row + 1) == row && (from_col - 1) == col)
        next_cell = [from_row + 2, from_col - 2];
    // moving upward right diagonal
    else if ((from_row - 1) == row && (from_col + 1) == col)
        next_cell = [from_row - 2, from_col + 2];
    // moving upward left diagonal
    else if ((from_row - 1) == row && (from_col - 1) == col)
        next_cell = [from_row - 2, from_col - 2];
    
    var arr = get_path(next_cell[0], next_cell[1], captures_array, captures_index - 1);
    return [next_cell].concat(arr);
}


// function alpha_beta(board, depth, alpha, beta, maximizer, make_move) {
    
//     if (depth == 0 || board.is_game_finished(maximizer)) 
//         return board.evaluate_board(maximizer);

//     if (maximizer) {
//         var max_val = Number.NEGATIVE_INFINITY;
//         var moves = board.get_all_moves();
//         var best_move = {};

//         for (var i = 0; i < moves.length; i++) {
//             for (var j = 0; j < moves[i]['moves'].length; j++) {
//                 var board_copy = new Board();
//                 board.copyOf(board_copy);

//                 var move = {
//                     'from_row': moves[i]['from_row'],
//                     'from_col': moves[i]['from_col'],
//                     'to_row': moves[i]['moves'][j]['to_row'],
//                     'to_col': moves[i]['moves'][j]['to_col'],
//                     'captures': moves[i]['moves'][j]['captures']
//                 };
                
//                 board_copy.make_move(move);
//                 var val = alpha_beta(board_copy, depth-1, alpha, beta, false, make_move);

//                 if (val > max_val) {
//                     max_val = val;
//                     best_move = JSON.parse(JSON.stringify(move));
//                 }

//                 if (val == max_val && move.captures.length > best_move.captures.length)
//                     best_move = JSON.parse(JSON.stringify(move));

//                 if (val == max_val && move.captures.length == best_move.captures.length) {
//                     var toss = Math.round(Math.random());
//                     if (toss == 1) {
//                         best_move = JSON.parse(JSON.stringify(move));
//                     }
//                 }

//                 board_copy = null;
//                 move = null;

//                 if (val > alpha)
//                     alpha = val;

//                 if (alpha >= beta)
//                     break;
//             }
//         }

//         moves = null;

//         if (depth == board.MAX_DEPTH && make_move) {
//             board.make_move(best_move);
//             return best_move;
//         } else if (depth == board.MAX_DEPTH && !make_move) {
//             return best_move;
//         }
        
//         return max_val;
//     } else {
//         var min_val = Number.POSITIVE_INFINITY;
//         var moves = board.get_all_opponent_moves();

//         for (var i = 0; i < moves.length; i++) {
//             for (var j = 0; j < moves[i]['moves'].length; j++) {
//                 var board_copy = new Board();
//                 board.copyOf(board_copy);

//                 var move = {
//                     'from_row': moves[i]['from_row'],
//                     'from_col': moves[i]['from_col'],
//                     'to_row': moves[i]['moves'][j]['to_row'],
//                     'to_col': moves[i]['moves'][j]['to_col'],
//                     'captures': moves[i]['moves'][j]['captures']
//                 };

//                 board_copy.make_move(move);
//                 var val = alpha_beta(board_copy, depth-1, alpha, beta, true, make_move); // don't make the move

//                 board_copy = null;
//                 move = null;

//                 if (val < min_val)
//                     min_val = val;

//                 if (val < beta)
//                     beta = val;

//                 if (alpha >= beta)
//                     break;
//             }
//         }
        
//         moves = null;
//         return min_val;
//     }
// }
function alpha_beta(board, depth, alpha, beta, maximizer, make_move, parent_node_seq_of_indices) {
    
    if (depth == 0 || board.is_game_finished(maximizer)) 
        return board.evaluate_board(maximizer);

    if (maximizer) {
        var max_val = Number.NEGATIVE_INFINITY;
        var moves = board.get_all_moves();
        var best_move = {};

        for (var i = 0; i < moves.length; i++) {
            for (var j = 0; j < moves[i]['moves'].length; j++) {
                var from_id =  moves[i]['from_row'] * 10 +  moves[i]['from_col'];
                var to_id =  moves[i]['moves'][j]['to_row'] * 10 + moves[i]['moves'][j]['to_col'];
                var board_copy = new Board();
                board.copyOf(board_copy);

                var move = {
                    'from_row': moves[i]['from_row'],
                    'from_col': moves[i]['from_col'],
                    'to_row': moves[i]['moves'][j]['to_row'],
                    'to_col': moves[i]['moves'][j]['to_col'],
                    'captures': moves[i]['moves'][j]['captures']
                };

                board_copy.make_move(move);
                var current_node_seq_of_indices = update_visualization_before_calling_recursion((i==0 && j==0 && depth == board.MAX_DEPTH), parent_node_seq_of_indices, from_id, to_id, maximizer, depth, board.MAX_DEPTH, alpha, beta);
                var val = alpha_beta(board_copy, depth-1, alpha, beta, false, make_move, current_node_seq_of_indices);              

                if (val > max_val) {
                    max_val = val;
                    best_move = JSON.parse(JSON.stringify(move));
                }

                if (val == max_val && move.captures.length > best_move.captures.length)
                    best_move = JSON.parse(JSON.stringify(move));

                if (val == max_val && move.captures.length == best_move.captures.length) {
                    var toss = Math.round(Math.random());
                    if (toss == 1) {
                        best_move = JSON.parse(JSON.stringify(move));
                    }
                }

                board_copy = null;
                move = null;

                if (val > alpha)
                    alpha = val;
                
                update_visualization_after_calling_recursion(current_node_seq_of_indices, alpha, beta); // TODO: gain is not passed

                if (alpha >= beta)
                    break;
            }
        }

        moves = null;

        if (depth == board.MAX_DEPTH && make_move) {
            update_visualization_tree();
            board.make_move(best_move);
            return best_move;
        } else if (depth == board.MAX_DEPTH && !make_move) {
            return best_move;
        }
        
        return max_val;
    } else {
        var min_val = Number.POSITIVE_INFINITY;
        var moves = board.get_all_opponent_moves();

        for (var i = 0; i < moves.length; i++) {
            for (var j = 0; j < moves[i]['moves'].length; j++) {
                var from_id =  moves[i]['from_row'] * 10 +  moves[i]['from_col'];
                var to_id =  moves[i]['moves'][j]['to_row'] * 10 + moves[i]['moves'][j]['to_col'];
                var board_copy = new Board();
                board.copyOf(board_copy);

                var move = {
                    'from_row': moves[i]['from_row'],
                    'from_col': moves[i]['from_col'],
                    'to_row': moves[i]['moves'][j]['to_row'],
                    'to_col': moves[i]['moves'][j]['to_col'],
                    'captures': moves[i]['moves'][j]['captures']
                };

                board_copy.make_move(move);
                var current_node_seq_of_indices = update_visualization_before_calling_recursion(false, parent_node_seq_of_indices, from_id, to_id, maximizer, depth, board.MAX_DEPTH, alpha, beta);
                var val = alpha_beta(board_copy, depth-1, alpha, beta, true, make_move, current_node_seq_of_indices); // don't make the move

                board_copy = null;
                move = null;

                if (val < min_val)
                    min_val = val;

                if (val < beta)
                    beta = val;

                update_visualization_after_calling_recursion(current_node_seq_of_indices, alpha, beta);

                if (alpha >= beta)
                    break;
            }
        }
        
        moves = null;
        return min_val;
    }
}