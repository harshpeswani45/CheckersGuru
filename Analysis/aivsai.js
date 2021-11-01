var Board=require('./board.js')
var game=require('./game');
const Game = require('./game');
const fs = require('fs')

var number_of_saves=1000
var best_gains_saves=[]


function red_move(board){
        board.is_ai_red = ! board.is_ai_red;
        var tmp_cnd=(board.is_ai_red ? board.count_black_pieces(): board.count_red_pieces())

        var best_move = alpha_beta(board,board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, false);
        //calculate gains of the best_move
        var gain_array=board.show_gains_of_piece_util(best_move.from_row,best_move.from_col, true)
        var best_move_caplen=best_move.captures.length
        
        if(tmp_cnd==best_move_caplen){
            board.is_ai_red = !board.is_ai_red;
            return best_move
        }

        gain_array[0][0].board=JSON.parse(JSON.stringify(board.board))
        if(best_gains_saves.length>=number_of_saves){
            best_gains_saves.pop()
            best_gains_saves.push(gain_array[0][0])
        }else{
           // console.log(gain_array)
            best_gains_saves.push(gain_array[0][0])
        }

        best_gains_saves.sort((a, b) => (a.gain < b.gain) ? 1 : -1)
        board.is_ai_red = !board.is_ai_red;
        return best_move
}

function black_move(board){
    var best_move = alpha_beta(board,board.MAX_DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, false);
    return best_move
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

function simulate_play(depth1,heuristic1,depth2,heuristic2){
     var board_red=new Board(true,false)
     var board_black=new Board(true,false)
     var real_board=new Board(true,false)
     var prev_board=new Board(true,false)

     board_red.MAX_DEPTH=depth1
     board_black.MAX_DEPTH=depth2
     board_red.heuristic=heuristic1
     board_black.heuristic=heuristic2
     board_black.is_ai_red=false
     cnt=20
     var toss_red=0
     var toss_black=0
     var win_red=0
     var win_black=0
     var draw=0
     var data=[{Toss_Result:'Player 0', Winner:'Player 0', Total_turns:27}]
     
     while(cnt){
       
        real_board.init_game_board()
        board_black.init_game_board()
        board_red.init_game_board()
     
        var toss=Math.floor(Math.random() * 2)+1
        //var toss=1
        if(toss==1){
            toss_red++
        }else{
            toss_black++
        }
        var total_turns=1
        var winner=is_winner(real_board)
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
                for (var i = 1; i <= 8; i++){
                    for (var j = 1; j <= 8; j++){ 
                        board_red.board[i][j] = real_board.board[i][j];
                    }
                }
                
                var best_red_move=red_move(board_red)
                if(best_red_move.from_row == undefined || best_red_move.from_col==undefined){
                    console.log(board_red.print_board())
                    console.log("Not GOOd ,1")
                }
                real_board.make_move(best_red_move)

                // if(total_turns>=100){
                    
                //     console.log("-----------------------------"+cnt+" "+total_turns)
                //     console.log("Red Moves")
                //     real_board.print_board()
                //     //return 2
                //  }
                

                winner=is_winner(real_board)
                if(winner!=null){
                    continue
                }
                //console.log("-----------------------------")
                //real_board.print_board()
                //real_board.print_board()
                for (var i = 1; i <= 8; i++){
                    for (var j = 1; j <= 8; j++){ 
                        board_black.board[i][j] = real_board.board[i][j];
                    }
                }
                
                var best_black_move=black_move(board_black)
                if(best_black_move.from_row == undefined || best_black_move.from_col==undefined){
                    console.log(board_black.print_board())
                    console.log("Not GOOd, 2")
                }
                
                real_board.make_move(best_black_move)
                winner=is_winner(real_board)
                if(winner!=null){
                    continue
                }
                
                winner=is_winner(real_board)
                //console.log("-----------------------------")
                //real_board.print_board()
            }else{
                for (var i = 1; i <= 8; i++){
                    for (var j = 1; j <= 8; j++){ 
                        board_black.board[i][j] = real_board.board[i][j];
                    }
                }
                var best_black_move=black_move(board_black)
                if(best_black_move.from_row == undefined || best_black_move.from_col==undefined){
                    console.log(board_black.print_board())
                    console.log("Not GOOd, 3")
                }
                real_board.make_move(best_black_move)
                winner=is_winner(real_board)
                if(winner!=null){
                    continue
                }
                

                for (var i = 1; i <= 8; i++){
                    for (var j = 1; j <= 8; j++){ 
                        board_red.board[i][j] = real_board.board[i][j];
                    }
                }


                var best_red_move=red_move(board_red)
                if(best_red_move.from_row == undefined || best_red_move.from_col==undefined){
                    console.log(board_red.print_board())
                    console.log("Not GOOd, 4")
                }
                real_board.make_move(best_red_move)
                winner=is_winner(real_board)
                if(winner!=null){
                    continue
                }
                winner=is_winner(real_board)

            }
            

         }
         if(winner==1){
            win_red++
        }else if(winner==-1){
            win_black++
        }else{
            draw++
        }
        if(winner==-1){
            winner=2
        }
        
        //Total Turns, Total Time per player.
        var result={'Toss_Result':"Player: "+toss,'Winner':"Player: "+winner,'Total_turns':total_turns}
        if(winner==3){
            result={'Toss_Result':"Player: "+toss,'Winner':"Draw",'Total_turns':total_turns}
        }
        data.push(result)
         cnt--
         //console.log(total_turns)
         
     }
    // console.log(win_red)
       // console.log(cnt)
        
     return data
    


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

var best_gains_saves=[]

try{
var read_file=fs.readFileSync('best_moves.json')
best_gains_saves=JSON.parse(read_file)
//console.log(best_gains_saves)
} catch(err){
   // console.log("Hello")
}
var cnt7=0
// while(1){
    
//     var items=simulate_play(1,6,1,6)
    
//     console.log("Hello"+cnt7)
// }
var win_heuristic=[0,0,0,0,0,0,0,0]
for(var depth1=5;depth1<=5;depth1++){
    for(var depth2=1;depth2<=1;depth2++){
        for(var heuristic1=7;heuristic1<=7;heuristic1++){
            for(var heuristic2=7;heuristic2<=7;heuristic2++){
                //console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
                var items=simulate_play(depth1,heuristic1,depth2,heuristic2)
                //console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
                for(var l=0;l<items.length;l++){
                    if(items[l].Winner=="Player: 1"){
                        win_heuristic[heuristic1]++
                    }else if(items[l].Winner=="Player: 2"){
                        win_heuristic[heuristic2]++
                    }
                }
                //console.log(items)
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
                console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
                
                fs.writeFileSync('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString()+'.csv',csv)
            }
        }
    }
}

console.log("Heuristic wins: "+win_heuristic)
let max_heuristic_number = win_heuristic.indexOf(Math.max(...win_heuristic));
console.log("Index of Win Heuristic: "+max_heuristic_number)

// for(var depth1=1;depth1<=6;depth1++){
//     for(var depth2=1;depth2<=6;depth2++){
//         for(var heuristic1=max_heuristic_number;heuristic1<=max_heuristic_number;heuristic1++){
//             for(var heuristic2=max_heuristic_number;heuristic2<=max_heuristic_number;heuristic2++){
//                 //console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
//                 var items=simulate_play(depth1,heuristic1,depth2,heuristic2)
//                 //console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
               
//                 //console.log(items)
//                 var csv=""
                
//                 //items=[{'Toss Result':1,'Winner':2},{'Toss Result':2,'Winner':2},{'Toss Result':1,'Winner':1}]
//                 for(let row = 0; row < items.length; row++){
//                     let keysAmount = Object.keys(items[row]).length
//                     let keysCounter = 0

//                     // If this is the first row, generate the headings
//                     if(row === 0){

//                     // Loop each property of the object
//                     for(let key in items[row]){

//                                         // This is to not add a comma at the last cell
//                                         // The '\n' adds a new line
//                         csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
//                         keysCounter++
//                     }
//                     }else{
//                     for(let key in items[row]){
//                         csv += items[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
//                         keysCounter++
//                     }
//                     }

//                     keysCounter = 0
//                 }
//                 //console.log(csv)
//                 console.log('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString())
                
//                 fs.writeFileSync('result'+depth1.toString()+heuristic1.toString()+depth2.toString()+heuristic2.toString()+'.csv',csv)
//             }
//         }
//     }
// }


    const json = JSON.stringify(best_gains_saves);

        fs.writeFile('./best_moves.json', json, 'utf8', function(err){
                if(err){ 
                    console.log(err); 
                } else {
                    //Everything went OK!
                }});

//save best games in json format
