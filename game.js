//2/2015 semester Webprogramming project
//NAME: Gabor Endre Szabo
//NK: I3J3ZO

function $(id){
	return document.getElementById(id);
}

window.onload = init;

var points;
var robotPiece;
var tp;

function init(){
	$('generate').addEventListener('click', clickInit);
	points = 0;
	robotPiece = 0;
	tp = 0;
	document.addEventListener('keyup', move);
	$('pts').innerHTML = points;
	$('rob').innerHTML = robotPiece;
	$('tel').innerHTML = tp;
}


/////////////////////
//GLOBAL VARIABLE//
/////////////////////
var gnome = {
	X: 0,
	Y: 0,
    life: 1,
    level: 1
};

var robots = []; // empty array
var tableSizeN;
var tableSizeM;


////////////////////////////////////////////////
//GENERATING ROBOTS --> only 1 robot in 1 cell//
////////////////////////////////////////////////
function nicePlace(x, y){
    var j=0;
    //console.log(x+" "+y);
    while(j<robots.length && !(x == robots[j].X && y == robots[j].Y)){
         j++;       
    }
    return j<robots.length;
}
function clickInit(){
	points= 0;
	tableGenerate();
	$('pts').innerHTML = points;
	$('rob').innerHTML = robotPiece;
	$('tel').innerHTML = tp;
}



////////////////////////////////////
//TABLE, ROBOTS AND GNOME GENERATE//
////////////////////////////////////
function tableGenerate(){
    robots.length = 0;
	robotPiece=10*gnome.level;
	tp = $('teleport').value;
	console.log(tp);
	tableSizeN = $('tableSizeN').value; //line ==> y
	tableSizeM = $('tableSizeM').value;	//column ==> x

	gnome.X = Math.floor(Math.random()*tableSizeM);
	gnome.Y = Math.floor(Math.random()*tableSizeN);

	var tableObj = document.createElement('table');
	var tBody = document.createElement('tbody');
	
	if($('gameTable')){
		var gameTable = $('gameTable');
		gameTable.parentNode.removeChild(gameTable);
	}
	//Generating NxM sized table
	for(var i=0; i<tableSizeN; ++i){
		var tRow = document.createElement ('tr');
		
		for(var j=0; j<tableSizeM; ++j){
			var tCell = document.createElement('td');
			tCell.setAttribute('style', 'width: 25px; height: 25px; border: 1px solid maroon;');
			tCell.setAttribute('id', 'cell_'+i+'_'+j); //cell_line_column
			tRow.appendChild(tCell);
		}
		tBody.appendChild(tRow);
	}
	tableObj.appendChild(tBody);
	tableObj.setAttribute('id', 'gameTable');
	$('placeHolder').appendChild(tableObj);
	var gnomeImg = "<img src='gnome.png' id='gnome1' style='width:20px; height: 20px;'/>";
    document.getElementById("cell_"+gnome.Y+"_"+gnome.X).innerHTML=gnomeImg;
	
	for(var i=0; i<10*gnome.level; ++i){
		var robotImg = "<img src='robot.png' id='robot"+i+"' style='width:20px; height: 20px;'/>";
        var robotx;
        var roboty;

        do{
            robotx=Math.floor(Math.random()*tableSizeM);
            roboty=Math.floor(Math.random()*tableSizeN);
        }while((2 > Math.abs(gnome.X-robotx) && 2 > Math.abs(gnome.Y-roboty)) || nicePlace(robotx, roboty) );
        robots.push({
            X: robotx,
            Y: roboty,
            status: 0,
        });
		document.getElementById("cell_"+robots[i].Y+"_"+robots[i].X).innerHTML=robotImg;
		
	}
	
}



///////////////
//GNOME DEATH//
///////////////
function gnomeDeath(){
    var j=0;
    
    while(j<robots.length && !(gnome.X == robots[j].X && gnome.Y == robots[j].Y)){
        j++;
        //console.log(gnome.X +" "+ robot[j].X +" "+  gnome.Y +" "+ robot[j].Y);
    }
    return j<robots.length;
}



////////////
//TELEPORT//
////////////
function teleport(x, y){
	var j=0;
	while(j<robots.length && !(1 >= Math.abs(x-robots[j].X) &&  1 >= Math.abs(y-robots[j].Y))){
		j++;
	}
	return j<robots.length;
}



////////////////////
//ROBOTS MOVEMENTS//
////////////////////
function robotsMoves(){
	var rnd = Math.floor(Math.random()*2);
	for(var j=0; j<robots.length; j++){
		if( robots[j].status == 0 ){
			var robotImg = "<img src='robot.png' id='robot"+j+"' style='width:20px; height: 20px;'/>";
			var explosionImg = "<img src='explosion.png' id='explosion' style='width:20px; height: 20px;'/>";
			 document.getElementById("cell_"+robots[j].Y+"_"+robots[j].X).innerHTML='';
			if((gnome.X >= robots[j].X) && (Math.abs(robots[j].X - gnome.X) >= (Math.abs(robots[j].Y - gnome.Y)))){
				robots[j].X++;
			}
			else if((gnome.X < robots[j].X) && (Math.abs(robots[j].X - gnome.X) >= (Math.abs(robots[j].Y - gnome.Y)))){
				robots[j].X--;
			}
			else if((gnome.Y <= robots[j].Y) && (Math.abs(robots[j].X - gnome.X) <= (Math.abs(robots[j].Y - gnome.Y)))){
				robots[j].Y--;
			}
			else if((gnome.Y > robots[j].Y) && (Math.abs(robots[j].X - gnome.X) <= (Math.abs(robots[j].Y - gnome.Y)))){
				robots[j].Y++;
			}
			var explosionPiece =explosion(robots[j].X, robots[j].Y);
			if(explosionPiece>1){

				for(var i=0; i<robots.length; ++i){
					if(robots[j].X == robots[i].X  && robots[j].Y == robots[i].Y ){
						
						if(robots[i].status == 0){
							--robotPiece;
							robots[i].status = 1;
							points = points + 20;
						}
						//alert(robotPiece);
					}
				}
				document.getElementById("cell_"+robots[j].Y+"_"+robots[j].X).innerHTML=explosionImg;
				
			}else{
				document.getElementById("cell_"+robots[j].Y+"_"+robots[j].X).innerHTML=robotImg;	
			}
			
		}
		
	}
}

function explosion(x,y){
	var piece = 0;
	for(var i=0; i<robots.length; ++i){
		if(x == robots[i].X  && y == robots[i].Y ){
			++piece;
		}
	}
    return piece;
}



/////////
//MOVES//
/////////
function move(e){
	var kod=e.which;
    document.getElementById("cell_"+gnome.Y+"_"+gnome.X).innerHTML='';
	//space
	if(kod == 32){
		gnome.X;
		gnome.Y;
		robotsMoves();
	}
	//left arrow, numpad 4
	else if((kod == 37 || kod == 100) && gnome.X > 0 ) {
		gnome.X--;
		robotsMoves();
		--points;
	}
	//right arrow, numpad 6
	else if((kod == 39 || kod == 102) && gnome.X < tableSizeM-1) {
		gnome.X++;
		robotsMoves();
		--points;
	}
	//up arrow, numpad 8
	else if((kod == 38 || kod == 104) && gnome.Y > 0) {
		gnome.Y--;
		robotsMoves();
		--points;
	}
	//down arrow, numpad 2
	else if((kod == 40 || kod == 98) && gnome.Y < tableSizeN-1) {
		gnome.Y++;
		robotsMoves();
		--points;
	}
	//numpad 1
	else if(kod == 97 && gnome.Y < tableSizeN-1 && gnome.X > 0){
		gnome.Y++;
		gnome.X--;
		robotsMoves();
		--points;
		
	}
	//numpad 3
	else if(kod == 99 && gnome.X < tableSizeM-1 && gnome.Y < tableSizeN-1){
		gnome.Y++;
		gnome.X++;
		robotsMoves();
		--points;
	}
	//numpad 7
	else if(kod == 103 && gnome.X > 0 && gnome.Y > 0){
		gnome.Y--;
		gnome.X--;
		robotsMoves();
		--points;
	}
	//numpad 9
	else if(kod == 105 && gnome.Y > 0 && gnome.X < tableSizeM-1){
		gnome.Y--;
		gnome.X++;
		robotsMoves();
		--points;
	}
	else if(kod == 84 && tp>0) {
		tp--;
		console.log(tp);
		do{
			gnome.X = Math.floor(Math.random()*tableSizeM);
			gnome.Y = Math.floor(Math.random()*tableSizeN);
		}while(teleport(gnome.X, gnome.Y));
		points = points - 100;
		robotsMoves();
	}
	//alert(gnome.X+" "+gnome.Y);
    //console.log(gnome.X+" "+gnome.Y+" "+"cell"+gnome.Y+gnome.X);
	var gnomeImg = "<img src='gnome.png' id='gnome1' style='width:20px; height: 20px;'/>";
	document.getElementById("cell_"+gnome.Y+"_"+gnome.X).innerHTML=gnomeImg;
    if(gnomeDeath()){
        //alert("Jé Bazdmeg (JB)");
        gnome.level = 1;
        gameTable.parentNode.removeChild(gameTable);
    }
	if(robotPiece == 0){
		++gnome.level;
		tp = $('teleport').value;
		tableGenerate();
	}
	$('pts').innerHTML = points;
	$('rob').innerHTML = robotPiece;
	$('tel').innerHTML = tp;
}

