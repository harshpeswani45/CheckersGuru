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
  
  module.exports = Play
  