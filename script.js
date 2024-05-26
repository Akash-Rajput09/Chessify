let chesspieces = {
  1: "whiteking",
  2: "whitequeen",
  3: "whiterook",
  4: "whitebishop",
  5: "whiteknight",
  6: "whitepawn",
  7: "blackking",
  8: "blackqueen",
  9: "blackrook",
  10: "blackbishop",
  11: "blackknight",
  12: "blackpawn",
};

let board = [
  9, 11, 10, 8, 7, 10, 11, 9, 12, 12, 12, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  6, 6, 6, 6, 6, 6, 6, 6, 3, 5, 4, 2, 1, 4, 5, 3,
];

let allmoves = [
  "9,11,10,8,7,10,11,9,12,12,12,12,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,3,5,4,2,1,4,5,3",
];

let dropdownToggle = document.getElementById("customizedrop");
let dropdownMenu = document.querySelector(".dropdown-menu");
let selecteddesign = "default";
dropdownMenu.addEventListener("click", function (event) {
  if (event.target.classList.contains("dropdown-item")) {
    selecteddesign = event.target.dataset.design;

    createboard(board, selecteddesign);
  }
});
let themetoggle = document.getElementById("theme");
let menu = document.getElementById("thememenu");

menu.addEventListener("click", function (event) {
  if (event.target.classList.contains("dropdown-item")) {
    selecteddesign = event.target.dataset.theme;

    if (selecteddesign == "dark") {
      changethemedark();
    } else {
      changethemelight();
    }
  }
});

createboard(board, "default");

// 0 for white and 1 for black
let whosemove = 0;
let totalmoves = 0;
let lastmove = [0, 0, 0];

// for castling purposes
let blackkingmoves = false;
let whitekingmoves = false;
let whiterookamove = false;
let whiterookhmove = false;
let blackrookamove = false;
let blackrookhmove = false;

// creating a chess board

function createboard(board, design) {
  let chessboard = document.getElementById("chessboard");
  chessboard.innerHTML = "";

  for (i = 0; i < 64; i++) {
    let square = document.createElement("div");
    const row = Math.floor(i / 8);
    const col = i % 8;

    if ((row + col) % 2 === 0) {
      square.classList.add("white");
    } else {
      square.classList.add("black");
    }

    let piece = board[i];
    if (piece != 0) {
      const pieceImg = document.createElement("img");
      if (design == "default") {
        pieceImg.src = `images/${chesspieces[piece]}.png`;
      } else if (design == "wooden") {
        pieceImg.src = `images/wooden/${chesspieces[piece]}.png`;
      }

      square.appendChild(pieceImg);
    }
    square.dataset.index = i;
    square.addEventListener("click", onPieceClick);

    chessboard.appendChild(square);
  }
}

let selectedPiece = null;
let selectedPieceIndex = -1;
let movefrom = -1;
let moveto = -1;
function onPieceClick() {
  let index = parseInt(event.currentTarget.dataset.index); // it is deprecated but that doesn't matters
  let piece = board[index];
  // console.log(piece);

  if (whosemove == 0) {
    if (piece != 0 && piece < 7) {
      if (selectedPieceIndex !== -1) {
        let previousSelectedSquare = document.querySelector(
          `[data-index="${selectedPieceIndex}"]`
        );
        previousSelectedSquare.classList.remove("selected");
        document.querySelectorAll(".selected").forEach((element) => {
          element.classList.remove("selected");
        });
      }
      selectedPiece = piece;
      selectedPieceIndex = index;
      movefrom = selectedPieceIndex;
      event.currentTarget.classList.add("selected");
      showAllMoves(index);
    } else if (piece > 6 || piece == 0) {
      selectedPieceIndex = index;
      moveto = selectedPieceIndex;
      if (isValidMove(movefrom, moveto)) {
        movePiece(movefrom, moveto);
      }
    }
  } else {
    if (piece != 0 && piece > 6) {
      if (selectedPieceIndex !== -1) {
        var previousSelectedSquare = document.querySelector(
          `[data-index="${selectedPieceIndex}"]`
        );
        previousSelectedSquare.classList.remove("selected");
        document.querySelectorAll(".selected").forEach((element) => {
          element.classList.remove("selected");
        });
      }
      selectedPiece = piece;
      selectedPieceIndex = index;
      movefrom = selectedPieceIndex;
      showAllMoves(index);
      event.currentTarget.classList.add("selected");
    } else if (piece < 7 || piece == 0) {
      selectedPieceIndex = index;
      moveto = selectedPieceIndex;
      if (isValidMove(movefrom, moveto)) {
        movePiece(movefrom, moveto);
      }
    }
  }
}

// this might look useless but don't remove or castle will be messed up
let qsbsc = false;
let qsblc = false;
let qswsc = false;
let qswlc = false;

function movePiece(movefrom, moveto, castle = false) {
  let anykingcheck = false;
  let movenotpawnorcapture = 0;
  // console.log("movepiece called");
  let piece = board[movefrom];
  if (piece == 1) {
    whitekingmoves = true;
  }
  if (piece == 7) {
    blackkingmoves = true;
  }
  if (piece == 3) {
    if (movefrom == 56) {
      whiterookamove = true;
    }
    if (movefrom == 63) {
      whiterookhmove = true;
     
    }
  }
  if (piece == 9) {
    if (movefrom == 0) {
      blackrookamove = true;
    }
    if (movefrom == 7) {
      blackrookhmove = true;
    }
  }

  board[moveto] = piece;
  board[movefrom] = 0;

  let sourceSquare = document.querySelector(`[data-index="${movefrom}"]`);
  let targetSquare = document.querySelector(`[data-index="${moveto}"]`);

  if (sourceSquare.firstElementChild) {
    targetSquare.innerHTML = "";
    targetSquare.appendChild(sourceSquare.firstElementChild);
    selectedPiece = null;
    selectedPieceIndex = -1;
    sourceSquare.classList.remove("selected");
  }
  let promotedpiece = -1;
  if (piece == 6 && Math.floor(moveto / 8) == 0) {
    let userchoice = prompt("Queen -> q, Rook -> r,Bishop -> b,Knight -> k");
    if (userchoice == "q") {
      promotedpiece = 2;
    }
    if (userchoice == "r") {
      promotedpiece = 3;
    }
    if (userchoice == "b") {
      promotedpiece = 4;
    }
    if (userchoice == "k") {
      promotedpiece = 5;
    } else {
      promotedpiece = 2;
    }
    board[moveto] = promotedpiece;
    // console.log("white promoted");
    createboard(board, selecteddesign);
  }
  if (piece == 12 && Math.floor(moveto / 8) == 7) {
    let userchoice = prompt("Queen -> q, Rook -> r,Bishop -> b,Knight -> k");
    if (userchoice == "q") {
      promotedpiece = 8;
    }
    if (userchoice == "r") {
      promotedpiece = 9;
    }
    if (userchoice == "b") {
      promotedpiece = 10;
    }
    if (userchoice == "k") {
      promotedpiece = 11;
    } else {
      promotedpiece = 8;
    }
    board[moveto] = promotedpiece;
    createboard(board, selecteddesign);
    // console.log("black promoted");
  }

  let wqueen = -1;
  let bqueen = -1;
  for(let i = 0; i< 64; i++){
    if(board[i] == 2){
      wqueen = i;
    }
  }
  for(let i = 0; i< 64; i++){
    if(board[i] == 8){
      bqueen = i;
    }
  }


  if(isValidMove(wqueen,5,true,true) || isValidMove(wqueen,6,true,true)){
    qsbsc = true;
  } else {
    qsbsc = false;
  }
  if(isValidMove(wqueen,2,true,true) || isValidMove(wqueen,3,true,true)){
    qsblc = true;
  } else {
    qsblc = false;
  }
  if(isValidMove(bqueen,61,true,true) || isValidMove(bqueen,62,true,true)){
    qswsc = true;
  } else {
    qswsc = false;
  }
  if(isValidMove(bqueen,58,true,true) || isValidMove(bqueen,59,true,true)){
    qswlc = true;
  } else {
    qswlc = false;
  }

  let audio = new Audio("sounds/move-self.mp3");
  audio.play();
  let result = "none";

  if (castle == false) {
    if (whosemove == 0) {
      if (kingincheck(1)) {
        anykingcheck = true;
        let audio = new Audio("sounds/move-check.mp3");
        audio.play();
        if (isCheckmate(1)) {
          result = "White wins By Checkmate!";
        }
        // console.log("black in check");
      }
      whosemove = 1;
    } else {
      if (kingincheck(0)) {
        anykingcheck = true;
        let audio = new Audio("sounds/move-check.mp3");
        audio.play();
        if (isCheckmate(0)) {
          result = "Black Wins By Checkmate!";
        }
        // console.log("white in check");
      }
      whosemove = 0;
    }
    totalmoves += 1;
    
    lastmove = [movefrom, moveto, piece];
    // document.querySelectorAll(".selected").forEach((element) => {
    //   element.classList.remove("selected");
    // });
    let destination = board[moveto];
    if(piece == 6 || piece == 12 || destination != 0){
      movenotpawnorcapture = 0;
    } else{
      movenotpawnorcapture ++;
    }
  }

 if(castle != false){
  totalmoves += 1;
  lastmove = [movefrom, moveto, piece];
 }
  // console.log(lastmove);
  document.querySelectorAll(".highlight").forEach((element) => {
    element.classList.remove("highlight");
  });

  let movestring = board.join(',');
  allmoves.push(movestring);

  if (!anykingcheck) {
    let issm = isCheckmate(whosemove);
    if (issm) {
      result = "Draw By Stalemate!";
    }
  }

  // checking for three fold
  let count = 0;
  for(let i = 0; i< allmoves.length; i++){
    if(allmoves[i] == movestring){
      count++;
    }
  }
  if(count >= 3){
    result = "Draw by Repetetion!";
  }

  if(movenotpawnorcapture >= 50){
    result = "Draw by 50 move rule!S";
  }

  if(isInsufficientMaterial()){
    result = "Draw by insufficient materials!";
  }

  if (result !== "none") {
    setTimeout(() => {
      isGameOver(result);
    }, 100);
  }
}

let moveno = 0;
function isValidMove(
  movefrom,
  moveto,
  showingmoves = false,
  checkingforcheck = false
) {
  let piece = board[movefrom];
  let piecerow = Math.floor(movefrom / 8);
  let piececol = movefrom % 8;
  let targetrow = Math.floor(moveto / 8);
  let targetcol = moveto % 8;

  if (willKingBeAttacked()) {
    return false;
  }

  // console.log(piecerow,piececol,targetrow,targetcol);
  if (piece <= 0) {
    return false;
  }

  //   for pawns
  if (piece == 6 || piece == 12) {
    let enpassantdone = false;
    let blackenpassantdone = false;
    // if there is something blocking the path
    if (targetcol == piececol) {
      if (board[moveto] != 0) {
        return false;
      }
    }
    if (piece == 6) {
      // if in starting position
      if (piecerow == 6) {
        if (targetcol == piececol) { // Ensure the pawn moves straight ahead
          if (targetrow == 5) { // One square forward
            if (board[targetrow * 8 + targetcol] == 0) { // Target square must be empty
              return true;
            }
          } else if (targetrow == 4) { // Two squares forward
            // Check if both the target square and the intermediate square are empty
            if (board[5 * 8 + piececol] == 0 && board[4 * 8 + piececol] == 0) {
              moveno = totalmoves;
              return true;
            }
          }
        }
      }

      // for enpassant

      if (piecerow == 3) {
        if (targetrow == piecerow - 1) {
          if (targetcol == piececol + 1 && board[movefrom + 1] == 12) {
            if (
              Math.floor(lastmove[0] / 8) == piecerow - 2 &&
              lastmove[1] == movefrom + 1
            ) {
              if (showingmoves) {
                return true;
              }
              board[movefrom + 1] = 0;
              enpassantdone = true;
              let toremove = document.querySelector(
                `[data-index="${movefrom + 1}"]`
              );
              toremove.innerHTML = "";
              movePiece(movefrom, moveto);
            }
          } else if (targetcol == piececol - 1 && board[movefrom - 1] == 12) {
            if (
              Math.floor(lastmove[0] / 8) == piecerow - 2 &&
              lastmove[1] == movefrom - 1
            ) {
              if (showingmoves) {
                return true;
              }
              board[movefrom - 1] = 0;
              enpassantdone = true;
              let toremove = document.querySelector(
                `[data-index="${movefrom - 1}"]`
              );
              toremove.innerHTML = "";
              movePiece(movefrom, moveto);
            }
          }
        }
      }

      // for white enpassant
      if (!enpassantdone) {
        if (targetrow == piecerow - 1 && targetcol == piececol) {
          return true;
        } else if (
          targetrow == piecerow - 1 &&
          (targetcol == piececol + 1 || targetcol == piececol - 1)
        ) {
          if (board[moveto] != 0) {
            return true;
          } else {
            return false;
          }
        }
      }

      //for everything else
    } else {
      if (piecerow == 1) {
        if (piecerow == 1) { // Black pawn initial position
          if (targetcol == piececol) { // Ensure the pawn moves straight ahead
            if (targetrow == 2) { // One square forward
              if (board[targetrow * 8 + targetcol] == 0) { // Target square must be empty
                return true;
              }
            } else if (targetrow == 3) { // Two squares forward
              // Check if both the target square and the intermediate square are empty
              if (board[2 * 8 + piececol] == 0 && board[3 * 8 + piececol] == 0) {
                moveno = totalmoves;
                return true;
              }
            }
          }
        }
        
      }

      // for black enpassant
      if (piecerow == 4) {
        if (targetrow == piecerow + 1) {
          if (targetcol == piececol + 1 && board[movefrom + 1] == 6) {
            if (
              Math.floor(lastmove[0] / 8) == piecerow + 2 &&
              lastmove[1] == movefrom + 1
            ) {
              if (showingmoves) {
                return true;
              }
              board[movefrom + 1] = 0;
              blackenpassantdone = true;
              let toremove = document.querySelector(
                `[data-index="${movefrom + 1}"]`
              );
              toremove.innerHTML = "";
              movePiece(movefrom, moveto);
            }
          } else if (targetcol == piececol - 1 && board[movefrom - 1] == 6) {
            if (
              Math.floor(lastmove[0] / 8) == piecerow + 2 &&
              lastmove[1] == movefrom - 1
            ) {
              if (showingmoves) {
                return true;
              }
              board[movefrom - 1] = 0;
              blackenpassantdone = true;
              let toremove = document.querySelector(
                `[data-index="${movefrom - 1}"]`
              );
              toremove.innerHTML = "";
              movePiece(movefrom, moveto);
            }
          }
        }
      }
      //if not in starting position

      if (!blackenpassantdone) {
        if (targetrow == piecerow + 1 && targetcol == piececol) {
          return true;
        } else if (
          targetrow == piecerow + 1 &&
          (targetcol == piececol + 1 || targetcol == piececol - 1)
        ) {
          if (board[moveto] != 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }
  }

  //   pawns over

  
  if (piece == 2 || piece == 8) {
    return (rookmovement() || bishopmovement());
  }
  //for knight
  if (piece == 5 || piece == 11) {
    // both negative and positive value will become positive
    rowdist = Math.abs(targetrow - piecerow);
    coldist = Math.abs(targetcol - piececol);

    if ((rowdist == 2 && coldist == 1) || (rowdist == 1 && coldist == 2)) {
      return true;
    } else {
      return false;
    }
  }

  // for bishops
  if (piece == 4 || piece == 10) {
    return bishopmovement();
  }

  // for rooks
  if (piece == 3 || piece == 9) {
    return rookmovement();
  }
  function rookmovement() {
    if (piecerow == targetrow || piececol == targetcol) {
      if (piecerow == targetrow) {
        let startcol = Math.min(piececol, targetcol);
        let endcol = Math.max(piececol, targetcol);
        for (let col = startcol + 1; col < endcol; col++) {
          if (board[piecerow * 8 + col] != 0) {
            return false;
          }
        }
      } else if (piececol == targetcol) {
        let startrow = Math.min(piecerow, targetrow);
        let endrow = Math.max(piecerow, targetrow);
        for (let row = startrow + 1; row < endrow; row++) {
          if (board[row * 8 + piececol] != 0) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  function bishopmovement() {
    rowdist = Math.abs(targetrow - piecerow);
    coldist = Math.abs(targetcol - piececol);

    if (rowdist == coldist) {
      if (targetrow > piecerow) {
        rowdir = 1; // here we will move in increment
      } else {
        rowdir = -1;
      }
      if (targetcol > piececol) {
        coldir = 1; // here we will move in increment
      } else {
        coldir = -1;
      }

      // because we want to start with one diagonal after the current piece row
      let row = piecerow + rowdir;
      let col = piececol + coldir;
      while (row != targetrow && col != targetcol) {
        if (board[row * 8 + col] != 0) {
          return false;
        }
        row += rowdir;
        col += coldir;
      }
      return true;
    } else {
      return false;
    }
  }

  // for queen
 

  // for king

  if (piece == 1 || piece == 7) {

    if (!checkingforcheck) {
      if (piece == 1) {
        if (
          movefrom == 60 &&
          moveto == 58 &&
          whitekingmoves == false &&
          whiterookhmove == false &&
          qswlc == false &&
          kingincheck(0) == false
        ) {
          let squareunderattack = false;
          for (i = 58; i <= 60; i++) {
            // console.log(i,"under attack",issquareunderattack(i,1));
            // console.log(i);
            if (issquareunderattack(i, 1) == true) {
              squareunderattack = true;
            }
          }
          if (
            !squareunderattack &&
            board[59] == 0 &&
            board[58] == 0 &&
            board[57] == 0
          ) {
            if (showingmoves) {
              return true;
            }
            movePiece(60, 58, true);
            movePiece(56, 59);
          }
        }
  
        if (
          movefrom == 60 &&
          moveto == 62 &&
          whitekingmoves == false &&
          whiterookhmove == false &&
          qswsc == false &&
          kingincheck(0) == false
        ) {
          let squareunderattack = false;
          for (i = 60; i <= 62; i++) {
            // console.log(i);
            // console.log(i,"under attack",issquareunderattack(i,1))
            if (issquareunderattack(i, 1) == true) {
              squareunderattack = true;
            }
          }
          if (!squareunderattack && board[61] == 0 && board[62] == 0) {
            if (showingmoves) {
              return true;
            }
            movePiece(60, 62, true);
            movePiece(63, 61);
          }
        }
      }
  
      if (piece == 7) {
        if (
          movefrom == 4 &&
          moveto == 2 &&
          blackkingmoves == false &&
          blackrookamove == false &&
          qsblc == false &&
          kingincheck(1) == false
        ) {
          let squareunderattack = false;
          for (let i = 2; i <= 4; i++) {
            // console.log(i,"under attack",issquareunderattack(i,0))
            // console.log(i);
            if (issquareunderattack(i, 0) == true) {
              squareunderattack = true;
            }
          }
          if (
            !squareunderattack &&
            board[1] == 0 &&
            board[2] == 0 &&
            board[3] == 0
          ) {
            if (showingmoves) {
              return true;
            }
            movePiece(4, 2, true);
            movePiece(0, 3);
          }
        }
  
        if (
          movefrom == 4 &&
          moveto == 6 &&
          blackkingmoves == false &&
          blackrookhmove == false &&
          qsbsc == false &&
          kingincheck(1) == false
        ) {
          let squareunderattack = false;
          for (let i = 5; i <= 6; i++) {
            // console.log(i,"under attack",issquareunderattack(i,0))
            // console.log(i);
            if (issquareunderattack(i, 0) == true) {
              squareunderattack = true;
            }
          }
          if (!squareunderattack && board[5] == 0 && board[6] == 0) {
            if (showingmoves) {
              return true;
            }
            movePiece(4, 6, true);
            movePiece(7, 5);
          }
        }
      }
    }


    let diffofrow = Math.abs(piecerow - targetrow);
    let diffofcol = Math.abs(piececol - targetcol);

    if (diffofrow <= 1 && diffofcol <= 1) {
      return true;
    }

   
  }
  function willKingBeAttacked() {
    let currentmovefrom = board[movefrom];
    let currentmoveto = board[moveto];
    let result = false;
    board[moveto] = board[movefrom];
    board[movefrom] = 0;
    if (kingincheck(whosemove)) {
      result = true;
    }
    board[moveto] = currentmoveto;
    board[movefrom] = currentmovefrom;
    return result;
  }

  return false;
}

function kingincheck(color) {
  let kingpos = -1;
  for (let i = 0; i < 64; i++) {
    if (color == 0 && board[i] == 1) {
      return issquareunderattack(i, 1);
      kingpos = i;
    }
    if (color == 1 && board[i] == 7) {
      return issquareunderattack(i, 0);
      kingpos = i;
    }
  }
}

function issquareunderattack(square, attackcolor) {
  for (let i = 0; i < 64; i++) {
    let piece = board[i];
    if (attackcolor == 1) {
      // console.log(square);
      if (piece != 0 && piece >= 7) {
        if (isValidMove(i, square, true, true)) {
          return true;
        }
      }
    } else if (attackcolor == 0) {
      // console.log(square);
      if (piece != 0 && piece < 7) {
        if (isValidMove(i, square, true, true)) {
          return true;
        }
      }
    }
  }
  return false;
}

function showAllMoves(movefrom) {
  document.querySelectorAll(".highlight").forEach((element) => {
    element.classList.remove("highlight");
  });

  for (i = 0; i < 64; i++) {
// because castling is not showing

let piece = board[movefrom];
if (piece == 1) {
  if (
    movefrom == 60 &&
    i == 58 &&
    whitekingmoves == false &&
    whiterookhmove == false &&
    qswlc == false &&
    kingincheck(0) == false
  ) {
    let squareunderattack = false;
    for (let j = 58; j <= 60; j++) {
      // console.log(i,"under attack",issquareunderattack(i,1));
      // console.log(i);
      if (issquareunderattack(j, 1) == true) {
        squareunderattack = true;
      }
    }
    if (
      !squareunderattack &&
      board[59] == 0 &&
      board[58] == 0 &&
      board[57] == 0
    ) {
      let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
      // white can castle long
    }
  }

  if (
    movefrom == 60 &&
    i == 62 &&
    whitekingmoves == false &&
    whiterookhmove == false &&
    qswsc == false &&
    kingincheck(0) == false
  ) {
    let squareunderattack = false;
    for (let j = 60; j <= 62; j++) {
      // console.log(i);
      // console.log(i,"under attack",issquareunderattack(i,1))
      if (issquareunderattack(j, 1) == true) {
        squareunderattack = true;
      }
    }
    if (!squareunderattack && board[61] == 0 && board[62] == 0) {
      // white can castle short
      let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
  }
 }
}

if (piece == 7) {
  if (
    movefrom == 4 &&
    i == 2 &&
    blackkingmoves == false &&
    blackrookamove == false &&
    qsblc == false &&
    kingincheck(1) == false
  ) {
    let squareunderattack = false;
    for (let j = 2; j <= 4; j++) {
      // console.log(i,"under attack",issquareunderattack(i,0))
      // console.log(i);
      if (issquareunderattack(j, 0) == true) {
        squareunderattack = true;
      }
    }
    if (
      !squareunderattack &&
      board[1] == 0 &&
      board[2] == 0 &&
      board[3] == 0
    ) {
      let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
      // black can castle long
    }
  }

  if (
    movefrom == 4 &&
    i == 6 &&
    blackkingmoves == false &&
    blackrookhmove == false &&
    qsbsc == false &&
    kingincheck(1) == false
  ) {
    let squareunderattack = false;
    for (let j = 5; j <= 6; j++) {
      // console.log(i,"under attack",issquareunderattack(i,0))
      // console.log(i);
      if (issquareunderattack(j, 0) == true) {
        squareunderattack = true;
      }
    }
    if (!squareunderattack && board[5] == 0 && board[6] == 0) {
     // black can castle short
     let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
    }
  }
}


    if (isValidMove(movefrom, i, true, true)) {
      let currentpiece = board[movefrom];
      let destination = board[i];
      if (currentpiece < 7 && (destination >= 7 || destination == 0)) {
        let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
      }

      if (currentpiece >= 7 && (destination < 7 || destination == 0)) {
        let square = document.querySelector(`[data-index="${i}"]`);
        square.classList.add("highlight");
      }
    }
  }
}
function isCheckmate(color) {
  for (let i = 0; i < 64; i++) {
    let piece = board[i];
    if (color == 0 && piece > 0 && piece < 7) {
      // White pieces
      for (let j = 0; j < 64; j++) {
        if (i !== j && (board[j] == 0 || board[j] >= 7)) {
          if (isValidMove(i, j, true, true)) {
            let tempPiece = board[j];
            board[j] = board[i];
            board[i] = 0;

            let inCheck = kingincheck(color);

            board[i] = board[j];
            board[j] = tempPiece;

            if (!inCheck) {
              return false;
            }
          }
        }
      }
    } else if (color == 1 && piece >= 7) {
      // Black pieces
      for (let j = 0; j < 64; j++) {
        if (i !== j && (board[j] == 0 || board[j] < 7)) {
          if (isValidMove(i, j, true, true)) {
            let tempPiece = board[j];
            board[j] = board[i];
            board[i] = 0;

            let inCheck = kingincheck(color);

            board[i] = board[j];
            board[j] = tempPiece;

            if (!inCheck) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
}

function isInsufficientMaterial() {
  let whitePieces = [];
  let blackPieces = [];
  
  for (let i = 0; i < 64; i++) {
    let piece = board[i];
    if (piece > 0 && piece < 7) {
      whitePieces.push(piece);
    } else if (piece >= 7) {
      blackPieces.push(piece);
    }
  }
  
  if (whitePieces.length === 1 && blackPieces.length === 1) {
    return true;
  }
  
  if (whitePieces.length === 2 && (whitePieces.includes(4) || whitePieces.includes(5)) && blackPieces.length === 1) {
    return true;
  }
  if (blackPieces.length === 2 && (blackPieces.includes(10) || blackPieces.includes(11)) && whitePieces.length === 1) {
    return true;
  }
  
  if (whitePieces.length === 2 && blackPieces.length === 2) {
    if ((whitePieces.includes(4) && blackPieces.includes(10)) || (whitePieces.includes(4) && blackPieces.includes(10))) {
      return true;
    }
  }
  
  return false;
}


function isGameOver(result) {
  let gameoversound = new Audio("sounds/gameover.mp3");
  gameoversound.play();
  setTimeout(() => {
    window.alert(result);
    board = [9, 11, 10, 8, 7, 10, 11, 9, 12, 12, 12, 12, 12, 12, 12, 12, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      6, 6, 6, 6, 6, 6, 6, 6, 3, 5, 4, 2, 1, 4, 5, 3,];
  
     whosemove = 0; 
     allmoves = [
      "9,11,10,8,7,10,11,9,12,12,12,12,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,3,5,4,2,1,4,5,3",
    ];
    createboard(board,selecteddesign);
  },100);

 
  
  
}

function changethemedark() {
  document.body.style.backgroundColor = "#121212";
  document.getElementById("chessboard").style.backgroundColor = "#FFFFFF";
  document.getElementById("chessboard").style.border = "5px solid #D1D1CF";
}

function changethemelight() {
  document.body.style.backgroundColor = "white";
  document.getElementById("chessboard").style.backgroundColor = "#FFFFFF";
  document.getElementById("chessboard").style.border = "5px solid black";
}
