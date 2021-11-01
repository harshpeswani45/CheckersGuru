const Game_C4 = require('./game.js')


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

    ucb_node(biasParam=1.5){
        return (this.n_wins / this.n_plays) + Math.sqrt(biasParam * Math.log(this.parent.n_plays) / this.n_plays)
    }
}

module.exports=monte_carlo_node