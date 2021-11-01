'use strict'

const monte_carlo_node = require('./monte_carlo_node.js')
const { exit } = require('process')

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

module.exports=monte_carlo_gen