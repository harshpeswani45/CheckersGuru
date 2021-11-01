//'use strict'

//const util = require('util')
//const Game_C4 = require('./game.js')
//const State= require('./state.js')
//const Board_Class= require('./board.js')
//const MonteCarlo = require('./monte_carlo_gen.js')
//const { stat } = require('fs')



//console.log(Board.print_board())
//onsole.log("-------------------------------------------")

class Game {
    /** Generate and return the initial game state. */
    start() {
      let newBoard =new Board(true,false)
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
      var newBoard=new Board(true,false)
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




class monte_carlo_gen{
    constructor(game){
        this.game=game
        this.nodes=new Map()
    }

    make_root_node(state,parent=null,play=null){
        if(this.nodes.has(state.hash())){
        
        }else{
            var all_plays=this.game.legalPlays(state).slice()
            var new_node=new monte_carlo_node(parent,play,state,all_plays)
            this.nodes.set(state.hash(),new_node)
        }
    }

    select(state){
        
        var curr_node=this.nodes.get(state.hash())
        
       //curr_node.is_fully_expanded()==0 && curr_node.is_leaf_node()==0
        while(curr_node.is_fully_expanded() && !curr_node.is_leaf_node()){
            var all_plays_node=curr_node.all_plays()
            var select_node=curr_node
            var ucb_max=-1
            for(var play of all_plays_node){
                var childnode=curr_node.child_node(play)
                
                var temp=childnode.ucb_node()
                if(temp>ucb_max){
                    ucb_max=temp
                    select_node=childnode
                }
            }
            
            curr_node=select_node
        }
        return curr_node
    }

   /* select(state) {
        let node = this.nodes.get(state.hash())
        while(node.is_fully_expanded() && !node.is_leaf_node()) {
          let plays = node.all_plays()
          let bestPlay
          let bestUCB1 = -Infinity
          for (let play of plays) {
            let childUCB1 = node.child_node(play).ucb_node()
            if (childUCB1 > bestUCB1) {
              bestPlay = play
              bestUCB1 = childUCB1
            }
          }
          node = node.child_node(bestPlay)
        }
        return node
      }*/

      /*expand(node) {

        let plays = node.unexpanded_plays()
        let index = Math.floor(Math.random() * plays.length)
        let play = plays[index]
    
        let childState = this.game.nextState(node.state, play)
        let childUnexpandedPlays = this.game.legalPlays(childState)
        let childNode = node.expand(play, childState, childUnexpandedPlays)
        this.nodes.set(childState.hash(), childNode)
    
        return childNode
      }*/
    
    expand(node){
        var all_possible_plays=node.unexpanded_plays()
        var random_play_index=Math.floor(Math.random()*all_possible_plays.length)
        var random_play=all_possible_plays[random_play_index]
        var child_state=this.game.nextState(node.state,random_play)
        var unexpanded_plays=this.game.legalPlays(child_state)
        var new_expanded_node=node.expand(random_play,child_state,unexpanded_plays)
        this.nodes.set(child_state.hash(),new_expanded_node)
        return new_expanded_node
    }
    test(){
      while(1);
    }

    simulate(node){
        var state=node.state
        var winner=this.game.winner(state)
        //var cnt=0
        while(winner==null){
          //cnt++
          
         // console.log("---------------------------------------")
           // state.board.print_board()
            var all_possible_plays=this.game.legalPlays(state)
            
            var random_play_index=Math.floor(Math.random()*all_possible_plays.length)
            var random_play=all_possible_plays[random_play_index]
            state=this.game.nextState(state,random_play)
            
            winner=this.game.winner(state)

        }
        return winner
    }

    /*backpropogate(node, winner) {

        while (node != null) {
          node.n_plays += 1
          // Parent's choice
          if (node.state.isPlayer(-winner)) {
            node.n_wins += 1
          }
          node = node.parent
        }
      }*/
    backpropogate(node,win){
        var curr_node=node
        while(curr_node!=null){
            var curr_state=curr_node.state
            var player=curr_state.isPlayer(win)
            if(player==0){
                curr_node.n_wins++
            }
            curr_node.n_plays++
            curr_node=curr_node.parent
        }
      }

     
    run_algo(state,time_to_run=1){
        this.make_root_node(state)

        var end_time=Date.now()+time_to_run*1000
        var cnt=1000
        while(Date.now()<=end_time){
        // while(cnt>0){
            cnt-- 
            var selected_node=this.select(state)
            //console.log(selected_node)
            if(selected_node.is_leaf_node()==0 && this.game.winner(selected_node.state)==null){
                
                var selected_node=this.expand(selected_node)
                //console.log(expanded_node)
                var vir_winner=this.simulate(selected_node)
                //console.log(vir_winner)
            }

            this.backpropogate(selected_node,vir_winner)
           
        }
        return { runtime: time_to_run, simulations: 0, draws: 0 }
    }

    select_best_play(state){
        this.make_root_node(state)
        var curr_node=this.nodes.get(state.hash())
        var all_plays=curr_node.all_plays()
        var max_n_plays=-1
        var best_play
        for( var play of all_plays){
            var child=curr_node.child_node(play)
            if(child.n_plays>max_n_plays){
                max_n_plays=child.n_plays
                best_play=play
            }
        }
        return best_play

    }

    getStats(state) {
        let node = this.nodes.get(state.hash())
        let stats = { n_plays: node.n_plays, n_wins: node.n_wins, children: [] }
        for (let child of node.children.values()) {
          if (child.node === null) stats.children.push({ play: child.play, n_plays: null, n_wins: null})
          else stats.children.push({ play: child.play, n_plays: child.node.n_plays, n_wins: child.node.n_wins})
        }
        return stats
      }


}



class monte_carlo_node{

    constructor(parent,play,state,all_plays){
        this.parent=parent
        this.play=play
        this.state=state
        this.n_wins=0
        this.n_plays=1
        this.children=new Map()
        for(var play in all_plays){
            play=all_plays[play]
            this.children.set(play.hash(),{play:play,node:null})
        }
    }

    child_node(play){
       // console.log(play)
        return this.children.get(play.hash()).node
    }

    expand(play,child_state,unexpanded_plays){
        var ret_child_node=new monte_carlo_node(this,play,child_state,unexpanded_plays)
        this.children.set(play.hash(),{play:play,node:ret_child_node})
        return ret_child_node
    }

    all_plays(){
        var ret_play=[]
        for( var child of this.children.values()){
    
            ret_play.push(child.play)
        }
        return ret_play
    }

    unexpanded_plays(){
        var all_unexpanded_plays=[]
        for( var child of this.children.values()){
            if(child.node==null)
                all_unexpanded_plays.push(child.play)
        }
        return all_unexpanded_plays
    }

    is_fully_expanded(){
        var flag=1
        for(var child of this.children.values()){
            if(child.node==null){
                return 0
            }
        }
        return flag
    }

    is_leaf_node(){
        var children=0
        for(var child of this.children.values()){
            children=1
        }
        if(children==0){
            return 1
        }
        return 0
    }

    ucb_node(biasParam=1){
        return (this.n_wins / this.n_plays) + Math.sqrt(biasParam * Math.log(this.parent.n_plays) / this.n_plays)
    }
}







class Play {
    constructor(from_row,from_col,to_row,to_col,captures) {
      this.from_row=from_row
      this.from_col=from_col
      this.to_row =to_row
      this.to_col =to_col
      this.captures=captures
    }
  //May contain bug
    hash() {
      return this.from_row.toString() + "," + this.from_col.toString()+","+this.to_row.toString() + "," + this.to_col.toString()
    }

    
  }
  

class State{

    constructor(board, player,playHistory){
      this.board = board
      this.player = player
      this.playHistory=playHistory
    }
  
    isPlayer(player) {
      return (player === this.player)
    }
   
    hash() {
      return JSON.stringify(this.playHistory)
    }
  }

function next_move(board){
    let game = new Game()
    let mcts = new monte_carlo_gen(game)
    var state=new State(board,-1,[])
    mcts.run_algo(state, board.MAX_DEPTH/2)
    let play = mcts.select_best_play(state)
    //state = game.nextState(state, play)
    board.make_move(play)
    console.log(play.captures)
    console.log(play)
    
    //state.board.print_board()
    return play
    //return state.board // or return play 
}


//var Board1=new Board(true,false)
//const board=Board1.board


//var board_1=new Board(true,false)
//next_move(board_1)    