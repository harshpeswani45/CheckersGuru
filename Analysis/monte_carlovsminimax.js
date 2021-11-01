var mcts_next_move=require('./next_move_api_nodejs')
var Board=require('./board');
const next_move = require('./next_move_api_nodejs');
var fs=require('fs')

function red_move(board){
    board.is_ai_red = ! board.is_ai_red;
    
    var best_move = alpha_beta(board,board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, false);
    //calculate gains of the best_move
    // var gain_array=board.show_gains_of_piece_util(best_move.from_row,best_move.from_col, true)

    // gain_array[0][0].board=board.board
    // if(best_gains_saves.length>=number_of_saves){
    //     best_gains_saves.pop()
    //     best_gains_saves.push(gain_array[0][0])
    // }else{
    //    // console.log(gain_array)
    //     best_gains_saves.push(gain_array[0][0])
    // }

    //best_gains_saves.sort((a, b) => (a.gain < b.gain) ? 1 : -1)
    board.is_ai_red = !board.is_ai_red;
    return best_move
}

function is_winner(board){
    //Check if 1 wins
    //console.log(state.board.has_won())
    if(board.is_game_finished_after_making_move(1)){
        return -1
      }else if((board.is_game_finished(1))){
        return 1
      }else{
        return null
      }
}


function equal_twod(listoflist1,listoflist2){
    for(var i=1;i<=8;i++){
        for(var j=1;j<=8;j++){
            if(listoflist1[i][j]!=listoflist2[i][j]){
                return 0
            }
        }
    }
    return 1
}

function alpha_beta(board, depth, alpha, beta, maximizer, make_move) {
    
    if (depth == 0 || board.is_game_finished(maximizer)) 
        return board.evaluate_board(maximizer);

    if (maximizer) {
        var max_val = Number.NEGATIVE_INFINITY;
        var moves = board.get_all_moves();
        var best_move = {};

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
                var val = alpha_beta(board_copy, depth-1, alpha, beta, false, make_move);

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

                if (alpha >= beta)
                    break;
            }
        }

        moves = null;

        if (depth == board.MAX_DEPTH && make_move) {
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
                var val = alpha_beta(board_copy, depth-1, alpha, beta, true, make_move); // don't make the move

                board_copy = null;
                move = null;

                if (val < min_val)
                    min_val = val;

                if (val < beta)
                    beta = val;

                if (alpha >= beta)
                    break;
            }
        }
        
        moves = null;
        return min_val;
    }
}

for(var depth=5; depth<=5;depth++){
    for(var heuristic=7;heuristic<=7;heuristic++){
        var cnt=1
        var data=[{Toss_Result:'Player 0', Winner:'Player 0', Total_turns:27}]

        while(cnt--){
            var real_board=new Board(true,false)
            var total_turns=1
            var toss=Math.floor(Math.random() * 2)+1
            toss=1
            var winner=is_winner(real_board)
            var prev_board=new Board(true,false)
            while(winner==null){
                total_turns++
                
                if(total_turns%100==0){
                    // console.log("-----------------------------"+cnt+" "+total_turns)
                    // real_board.print_board()
                    // console.log("-----------------------------")
                    // prev_board.print_board()
                     if(equal_twod(prev_board.board,real_board.board)){
                         draw++
                         winner=3
                         continue
                     }
                     var prev_board=real_board.copyOf(prev_board)
    
                    
                 }
                if(toss==1){
                    winner=is_winner(real_board)
                    if(winner!=null){
                        continue
                    }
                    console.log("-----------------")
                    real_board.print_board()
                    var best_red_move=red_move(real_board)
                    real_board.make_move(best_red_move)
                    console.log("-----------------")
                    real_board.print_board()
                    winner=is_winner(real_board)
                    if(winner!=null){
                        continue
                    }

                    real_board=next_move(real_board)

                    winner=is_winner(real_board)
                    if(winner!=null){
                        continue
                    }
                }else{

                    winner=is_winner(real_board)
                    if(winner!=null){
                        continue
                    }

                    real_board=next_move(real_board)
                    
                    winner=is_winner(real_board)
                    if(winner!=null){
                        continue
                    }

                    var best_red_move=red_move(real_board)
                    real_board.make_move(best_red_move)
                    

                }
                winner=is_winner(real_board)
            }

            if(winner==3){
                data.push({Toss_Result:'Player '+toss, Winner:'Draw', Total_turns:total_turns})
            }else{
                data.push({Toss_Result:'Player '+toss, Winner:'Player '+winner, Total_turns:total_turns})
            }
        }
        var items=data
        var csv=""
                
                //items=[{'Toss Result':1,'Winner':2},{'Toss Result':2,'Winner':2},{'Toss Result':1,'Winner':1}]
                for(let row = 0; row < items.length; row++){
                    let keysAmount = Object.keys(items[row]).length
                    let keysCounter = 0

                    // If this is the first row, generate the headings
                    if(row === 0){

                    // Loop each property of the object
                    for(let key in items[row]){

                                        // This is to not add a comma at the last cell
                                        // The '\n' adds a new line
                        csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
                        keysCounter++
                    }
                    }else{
                    for(let key in items[row]){
                        csv += items[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
                        keysCounter++
                    }
                    }

                    keysCounter = 0
                }
                //console.log(csv)
                console.log('result_minimaxvsmcts'+depth.toString()+heuristic.toString())
                
                fs.writeFileSync('result_minimaxvsmcts'+depth.toString()+heuristic.toString()+'.csv',csv)


    }
}