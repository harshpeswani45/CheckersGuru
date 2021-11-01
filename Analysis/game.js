const State = require('./state.js')
const Play = require('./play.js')
const Board_Class= require('./board.js')

var Board=new Board_Class(true,false)
const board=Board.board
//console.log(Board.print_board())
//onsole.log("-------------------------------------------")

class Game {
    /** Generate and return the initial game state. */
    start() {
      let newBoard =new Board_Class(true,false)
      Board.copyOf(newBoard)
      return new State(newBoard,1,[])
    }
    /** Return the current player’s legal moves from given state. */
   /* legalPlays(state) {
      

      var legal_moves=[]
      let newBoard = state.board.map((row) => row.slice())
      for(var i=0;i<3;i++){
          for(var j=0;j<3;j++){
              if(newBoard[i][j]==0){
                legal_moves.push(new Play(i,j))
              }
          }
      }
      return legal_moves
    }*/
    legalPlays(state) {
      if(state.player==1){
        var all_moves = new Array();
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 8; j++) {
                if (state.board.is_red_piece(i, j))  {
                    var moves = state.board.get_moves_of_piece(i, j);
                    //console.log(moves)

                    if (moves.length != 0) {
                      for(var k=0;k<moves.length;k++){
                        var dict=new Play(i,j,moves[k].to_row,moves[k].to_col,moves[k].captures)
                        //var dict = {'from_row': i, 'from_col' : j, 'moves': moves};
                        all_moves.push(dict);
                      }
                        
                    }
                }    
            }
        }
        return all_moves

      }else{
        var all_moves = new Array();
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 8; j++) {
                if (state.board.is_black_piece(i, j))  {
                    var moves = state.board.get_moves_of_piece(i, j);
                    //console.log(moves)

                    if (moves.length != 0) {
                      for(var k=0;k<moves.length;k++){
                        var dict=new Play(i,j,moves[k].to_row,moves[k].to_col,moves[k].captures)
                        //var dict = {'from_row': i, 'from_col' : j, 'moves': moves};
                        all_moves.push(dict);
                      }
                        
                    }
                }    
            }
        }
        return all_moves

      }
    }
    /** Advance the given state and return it. */
    /*nextState(state, play) {
      var child_history_list=state.playHistory.slice()
      child_history_list.push(play)
      let newBoard = state.board.map((row) => row.slice())
      newBoard[play.row][play.col]=state.player
      var new_player=-state.player
      return new State(newBoard,new_player,child_history_list)
    }*/
    nextState(state, play) {
      var child_history_list=state.playHistory.slice()
      child_history_list.push(play)
      var newBoard=new Board_Class(true,false)
      state.board.copyOf(newBoard)
      newBoard.make_move(play)
      //newBoard.print_board()
      //console.log("------------------------------")
      //Board.print_board()
      var new_player=-state.player
      return new State(newBoard,new_player,child_history_list)
    }
    /** Return the winner of the game. */
    winner(state){
      //Check if 1 wins
      //console.log(state.board.has_won())
        if(state.board.is_game_finished_after_making_move(1)){
          return -1
        }else if((state.board.is_game_finished(1))){
          return 1
        }else{
          return null
        }
    }
      
  }

  /*winner(state) {
    //check 1 wins
    var flag=1
    for(var i=0;i<3;i++){
      flag=1
      for(var j=0;j<3;j++){
        if(state.board[i][j]==1){
          
        }else{
          flag=0
          break
        }
      }
      if(flag==1){
        return 1
      }
    }

    for(var i=0;i<3;i++){
      flag=1
      for(var j=0;j<3;j++){
        if(state.board[j][i]==1){
          
        }else{
          flag=0
          break
        }
      }
      if(flag==1){
        return 1
      }
    }

    for(var i=0;i<3;i++){
      flag=1
      
        if(state.board[i][i]==1){
          
        }else{
          flag=0
          break
        }
      
    }
    if(flag==1){
      return 1
    }

    for(var i=0;i<3;i++){
      flag=1
      
        if(state.board[i][2-i]==1){
          
        }else{
          flag=0
          break
        }
      
    }
    if(flag==1){
      return 1
    }

    //-1 WINS

    var flag=1
    for(var i=0;i<3;i++){
      flag=1
      for(var j=0;j<3;j++){
        if(state.board[i][j]==-1){
          
        }else{
          flag=0
          break
        }
      }
      if(flag==1){
        return -1
      }
    }

    for(var i=0;i<3;i++){
      flag=1
      for(var j=0;j<3;j++){
        if(state.board[j][i]==-1){
          
        }else{
          flag=0
          break
        }
      }
      if(flag==1){
        return -1
      }
    }

    for(var i=0;i<3;i++){
      flag=1
      
        if(state.board[i][i]==-1){
          
        }else{
          flag=0
          break
        }
      
    }
    if(flag==1){
      return -1
    }

    for(var i=0;i<3;i++){
      flag=1
      
        if(state.board[i][2-i]==-1){
          
        }else{
          flag=0
          break
        }
      
    }
    if(flag==1){
      return -1
    }

    if(this.legalPlays(state).length==0){
      return 0
    }
    
    return null
  }
}*/



  module.exports = Game