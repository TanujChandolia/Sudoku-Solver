let values = [[4, 8, 9,   0, 0, 0,   0, 0, 0],
              [0, 3, 0,   0, 0, 0,   1, 6, 0],
              [0, 6, 7,   0, 3, 5,   0, 0, 4],
              
              [6, 0, 8,   1, 2, 0,   9, 0, 0],
              [0, 9, 0,   0, 8, 0,   0, 3, 0],
              [0, 0, 2,   0, 7, 9,   8, 0, 6],
              
              [8, 0, 0,   6, 9, 0,   3, 5, 0],
              [0, 2, 6,   0, 0, 0,   0, 9, 0],
              [0, 0, 0,   0, 0, 0,   0, 0, 0] ];

let blocks = [];
let usedRow = [];
let usedCol = [];
let initial = [];

let size = 10;

function setup() {
  createCanvas(800,800); 
  
  blocks = new Array(size);
  usedRow = new Array(size);
  usedCol = new Array(size);
  initial = new Array(size);
  
  var i,j; 
  for(i = 0; i < size; i++){
    blocks[i] = new Array(size);
    usedRow[i] = new Array(size);
    usedCol[i] = new Array(size);
    initial[i] = new Array(size);
  }
  
  for( i = 0; i < size; i++){
     for(j = 0; j < size; j++){
         blocks[i][j] = 0;
         usedRow[i][j] = 0;
         usedCol[i][j] = 0;
     }
  }

  for(i = 0; i < 9; i++){
      for(j = 0; j < 9; j++){
          if(values[i][j] != 0)
              initial[i][j] = 1;
          else
              initial[i][j] = 0;
        
      }
  }
  
  background(51);
  grid();
  fillGrid();
  
  solveSudoku();
}

function cantPlace(i,x,y){
   var k = floor(x/3)*3 + floor(y/3);
    
   var m;   
   if(blocks[k][i] == 1 || usedRow[x][i] == 1 || usedCol[y][i] == 1)
       m = 1;
     
   else 
       m = 0;
   return m;
    
}

async function recSudoku(x,y){
   if(x == 9) return 1;
   
   var k = floor(x/3)*3 + floor(y/3);
  
   if(values[x][y] != 0){
      if(y + 1 == 9){
         if(await recSudoku(x+1,0) == 1)
            return 1;
      }
      else{
          if(await recSudoku(x,y + 1) == 1)
              return 1;
      }
   }
  
  else{
      for(var i = 1; i <= 9; i++){
           values[x][y] = i;
           await sleep(1);
           if(cantPlace(i,x,y) == 0) {
              blocks[k][i] = 1;
              usedRow[x][i] = 1;
              usedCol[y][i] = 1;
              values[x][y] = i;
              
              if(y + 1 == 9){
                if(await recSudoku(x+1,0) == 1)
                     return 1;
              }            
              else{ 
                if(await recSudoku(x,y+1) == 1)
                     return 1;
              }
              blocks[k][i] = 0;
              usedRow[x][i] = 0;
              usedCol[y][i] = 0;
              values[x][y] = 0;
           }
         else{
             values[x][y] = 0;
         }
      }
  }
  return 0;
}

function draw() {
  background(50);
  grid();
  fillGrid();
}


function fillBlocks(){
   var i,j;
   for(i = 0; i < 9; i++){
      for(j = 0; j < 9; j++){
        if(values[i][j] != 0){
           var num = values[i][j];
           var k = floor(i/3)*3 + floor(j/3);
           blocks[k][num] = 1;
           usedRow[i][num] = 1;
           usedCol[j][num] = 1;
        }
      }
   }
}

function solveSudoku(){
   fillBlocks();
   recSudoku(0,0);
}


function grid(){
   var w = 800;
   var h = 800;
   stroke(255);
   for(var i = 0; i <= 9; i++){
       if(i == 0 || i == 3 || i == 6|| i == 9)
           strokeWeight(7);
       else
           strokeWeight(1);
       line(i*(w/9), 0, i*(w/9), h);
       line(0,i*(h/9), w, i*h/9);
   }
     
}

function fillGrid(){
  let w = 800/9;
  let h = 800/9;
  textSize(70);
  textStyle(BOLD);
  textFont("Arial");
  stroke(0);
  
  
  for(var i = 0; i < 9; i++){
     for(var j = 0; j < 9; j++){
        if(values[i][j] != 0 && initial[i][j] == 1){
            fill(146,40,215);
            text(values[i][j],j*w + w/3.4, i*h + h/1.3 );
          }
        else if(values[i][j] != 0){
           fill(255,127,0);
           text(values[i][j],j*w + w/3.4, i*h + h/1.3 );
        }
      }
    }
}


function sleep(ms){
   return new Promise(resolve => setTimeout(resolve,ms)); 
}

/*
3 0 0 0 0 0 0 0 0
5 2 9 1 3 4 7 6 8
4 8 7 6 2 9 5 3 1

2 6 3 4 1 5 9 8 7
9 7 4 8 6 3 1 2 5
8 5 1 7 9 2 6 4 3

1 3 8 9 4 7 2 5 6
6 9 2 3 5 1 8 7 4
7 4 5 2 8 6 3 1 9
*/
