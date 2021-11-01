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
  
  module.exports = State
  