	
function displaypossibleMove(curr)
{

	if(curr.length)
	{
		var id; 
		for(i=0;i<curr.length;i++)
		{ 
			//console.log("insisde displaypossibleMove");
			//console.log(curr[i]);
			id  = curr[i];
			$("#"+id).children("p").removeClass("noPiece");
			$("#"+id).children("p").addClass("possibleMove");
					
		
		}
	}

};
function decodeMoves(allPossibleMoves)
		{
			//format of  allPossibleMoves : [ [{'to_row':1 , 'to_col':2},{'to_row':3,'to_col':4},{'captures':[]}] ];
			var moves =[]; var allMoves=[]
			if(allPossibleMoves.length)
			{
				var i; var temp;
				for(i=0;i<allPossibleMoves.length;i++)
				{ 
					temp = (allPossibleMoves[i].to_row)*10 + allPossibleMoves[i].to_col; 
					moves.push(temp);

				}
				allMoves.push(moves);
			}
			//console.log(allMoves);
			return moves;
		};


function hidePrevPossibleMove(prev)
{
	if(prev.length)
	{

		for(i=0;i<prev.length;i++)
		{ 
			
			id = parseInt([prev[i].to_row]*10,10) + parseInt([prev[i].to_col],10);
			$("#"+id).children("p").removeClass("possibleMove");
			$("#"+id).children("p").addClass("noPiece");	
			

		}
	}

};


function hideCapturedPiece(possibleCaptures)
{
	
	if(possibleCaptures.length)
	{
		var i; var temp;
		if(possibleCaptures.length == 1)
		{	
			for(i=0;i<possibleCaptures.length;i++)
			{ 
			
				board.board[(possibleCaptures[i][0])][(possibleCaptures[i][1])]=0;
			
			}
		}
		else if(possibleCaptures.length > 1)
		{
			for(i=0;i<possibleCaptures.length;i++)
			{ 
			
				ID = possibleCaptures[i][0]*10 + possibleCaptures[i][1];
				$("#"+ID).fadeOut(10);
				$("#"+ID).fadeIn();
				
				board.board[(possibleCaptures[i][0])][(possibleCaptures[i][1])]=0;
			
			}	
		}	

	}
	
};





function disableAImoveBtn(id)
{
	if(id.checked)
	{
		document.getElementById("AIMove").disabled = true;
		AutoAI = true;
	}
	else
	{
		document.getElementById("AIMove").disabled = false;	
		AutoAI = false;
	}
}

function GameStarted()
{
	if(!user_is_first && !ai_is_first)
	{
		setRandomTurn();
	}
	if(user_is_first)
		startGame = true;	
	else
		handle_ai_turn();

	$("#Play_u").attr("disabled",true);
	$("#Play_p").attr("disabled",true);
	$("#BlackTurn").css("opacity","0.5");
};


function GameStopped()
{
	quitGame = true;
	window.location.reload();
};
		
const syncWait = ms => 
{
	const end = Date.now() + ms
	while (Date.now() < end) continue
}		



