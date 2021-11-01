/*
Proficiency:
Easy = 1
medium = 2
Hard = 3
*/

var proficiency = 1;
// data = [{"from_row":4,"from_col":5,"to_row":8,"to_col":5,"captures":[[7,4],[5,4]],"gain":2.9000000000000004,"val":9,"board":[[0,0,0,0,0,0,0,0,0],[0,3,1,3,1,3,1,3,1],[0,1,3,1,3,-1,3,1,3],[0,3,0,3,0,3,0,3,1],[0,1,3,0,3,1,3,0,3],[0,3,0,3,-1,3,0,3,2],[0,0,3,0,3,0,3,-1,3],[0,3,0,3,-1,3,0,3,-1],[0,-1,3,-1,3,0,3,-1,3]]}]
// console.log(data.length)

var hard = []
var medium =[]
var easy =[]
var i;
for (i = 0; i < 146; i++) {
  hard.push(i);
} 
i = 146
for (i = 146; i < 292; i++) {
  medium.push(i)
} 

i=292
for (i = 292; i < data.length; i++) {
  easy.push(i)
} 
var shuffled = false
var shuffledState;
var odd = true;
var index;
function shuffleBoard()
{
    shuffled = true;
    console.log("Shuffling......")
    
    if(proficiency==1)
    {
        index = easy[Math.floor(Math.random() * easy.length)];
        console.log(index)
        shuffledState = data[index];
        console.log("Easy proficiency level")
        console.log(shuffledState.board)
        displayShuffledBoard(shuffledState.board)
    }
    else if(proficiency == 2)
    {
        index = medium[Math.floor(Math.random() * medium.length)];
        console.log(index)
        shuffledState = data[index];
        console.log("Medium proficiency level")
        displayShuffledBoard(shuffledState.board)
    }
    else if(proficiency == 3)
    {
        index = hard[Math.floor(Math.random() * hard.length)];
        console.log(index)
        shuffledState = data[index];
        console.log("Hard proficiency level")
        displayShuffledBoard(shuffledState.board)
    }
}
function displayShuffledBoard(shuffledboard)
{
    $("#checkers").fadeOut();
    $("#checkers").fadeIn();
    setTimeout(() => {board.reset_board(shuffledboard); render_board(board); }, 500);
   
}
function reviewUserMove(userTo, userFrom)
{
    console.log("reviewing user's move")
    var bestFrom = parseInt(shuffledState.from_row,10)*10 + shuffledState.from_col;
    var bestTo = parseInt(shuffledState.to_row,10)*10 + shuffledState.to_col;
    console.log("user from: "+userFrom)
    console.log("User to: "+userTo)
    console.log("Best from: "+bestFrom)
    console.log("Best to:", bestTo)
    actualMistakeList = board.get_mistakes()
    if((userFrom == bestFrom && userTo == bestTo) || actualMistakeList.length==0)
    {
        $('#win').text("Correct move")
        text = "Summary= gain: "+shuffledState.gain;
        var btn = document.getElementById("analyse")
        btn.style.display = "none";
    }
    else
    {   
        $('#win').text("Wrong move")
        // text = "Summary= gain: "+shuffledState.gain;
        text = "";
        //prepare mistake summary
        console.log("inside else")
        console.log(index)
        var move_dict ={ 
        from_row: shuffledState.from_row, 
        from_col: shuffledState.from_col, 
        to_row: shuffledState.to_row, 
        to_col: shuffledState.to_col, 
        captures: shuffledState.captures
        };
        mistakeList = [{'move': move_dict ,'board':shuffledState.board, 'gain_lost': shuffledState.gain }];
        console.log("inside reviewUSer move")
        
        if(mistakeList.length == actualMistakeList.length)
            console.log(mistakeList.length)
            console.log(mistakeList)
    }
   
    $('#winbody').children("p").text(text)
    var btn = document.getElementById("win_undo")
    btn.style.display = "none";

    var modal = document.getElementById("winMessageModal");
	modal.style.display = "block";
    
}