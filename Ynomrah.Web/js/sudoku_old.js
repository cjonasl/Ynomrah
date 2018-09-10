var maxNumberOfTriesToSolveSudoku = 100;
var debug = -1;  //Set to -1 if not debug.

var makeStatTables = false; //To make stat tables or not
var statArray; //For stat tables only
var numberOfTimesToTrySolveSudoku = 1;
var iterationNumber;
var tbodyStatTableElement;

//Needed for calculations
var sudokuRows;
var sudokuColumns;
var sudokuSquares;
var candidateIntegers;
var possibleRows;
var possibleColumns;
var possibleSquares;
var tmpKeepIntegerUpdateCandidateIntegers;
var cellsToCheckIfIntegerExistToKeepIntegerAsCandidate;
var integersWhereCandidateMustExistToBeKept;
var canSetIntegerInCell;
var startIntegers;
var numberOfIntegersSet;
var numberOfStartIntegers;
var distributionOfNumberOfCandidatesInCells;
var numberOfIntegersThatCanBeSet;
var continueIfNoCandidatesFoundInOneCell = false;

//Needed for debug only
var debugElementCurrentVisible;
var removedCandidates;
var debugCandidateExists;

function returnIntegerRandomNumber(minIncluded, maxExcluded) {
  var n = minIncluded + Math.round(Math.random() * (maxExcluded - minIncluded));

  if (n === maxExcluded) {
    n = minIncluded;
  }

  return n;
}

function mySortFunction(a, b) {
  if ((a === 0) && (b === 0)) {
    return 0;
  }
  else if ((a === 0) && (b > 0)) {
    return 1;
  }
  else if ((a > 0) && (b === 0)) {
    return -1;
  }
  else if ((a > 0) && (b > 0) && (a > b)) {
    return 1;
  }
  else {
    return -1;
  }
}

function returnArrayExcludeZeros(v) {
  var i, str = "";

  for (i = 0; i < 9; i++) {
    if (v[i] !== 0) {
      if (str !== "") {
        str += "," + v[i].toString();
      }
      else {
        str = v[i].toString();
      }
    }
  }

  return str;
}

function reset() {
  var r, c, s, n, i, idxInSquare;

  iterationNumber = 0;

  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      sudokuRows[r][c] = 0;
      sudokuColumns[r][c] = 0;
      sudokuSquares[r][c] = 0;
    }
  }

  for (i = 0; i < numberOfStartIntegers; i++) {
    r = startIntegers[i][0];
    c = startIntegers[i][1];
    n = startIntegers[i][2];
    s = returnSquare(r, c);
    sudokuRows[r - 1][c - 1] = n;
    sudokuColumns[c - 1][r - 1] = n;
    idxInSquare = (3 * ((r - 1) % 3)) + ((c - 1) % 3);
    sudokuSquares[s - 1][idxInSquare] = n;
  }

  numberOfIntegersSet = numberOfStartIntegers;

  if (debug >= 0) {
    for (r = 1; r <= 9; r++) {
      for (c = 1; c <= 9; c++) {
        selector = "#sqr" + r.toString() + "c" + c.toString();
        element = $(selector);
        if (sudokuRows[r - 1][c - 1] === 0) {
          element.text("");
        }
      }
    }
  }
}

function returnArrayWith9Zeros() {
  var v, i;

  v = [];

  for (i = 0; i < 9; i++) {
    v.push(0);
  }

  return v;
}

//Element looks like [[1,2], [3,4], [5,6], [4,5], [4,8], [7,9]]
function returnElementAsString(element) {
  var i, v, str;

  str = "["

  for (i = 0; i < 6; i++) {
    v = element[i];

    if (i === 0) {
      str += "[" + v[0].toString() + "," + v[1].toString() + "]";
    }
    else {
      str += ", [" + v[0].toString() + "," + v[1].toString() + "]";
    }
  }

  str += "]";

  return str;
}

function makeSudokuSquares() {
  var r, c, oc, or, element, l, t, str1, str2, sudokuSquareWidth = 40, offset = 3;

  element = $("#divSudokuSolver");

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      if (c < 4) {
        oc = 0;
      }
      else if ((c >= 4) && (c < 7)) {
        oc = offset;
      }
      else {
        oc = 2 * offset;
      }

      if (r < 4) {
        or = 0;
      }
      else if ((r >= 4) && (r < 7)) {
        or = offset;
      }
      else {
        or = 2 * offset;
      }

      l = sudokuSquareWidth * (c - 1) + 40 + oc;
      t = sudokuSquareWidth * (r - 1) + 170 + or;
      str1 = l.toString();
      str2 = t.toString();
      str3 = "<input type='text' id='sqr" + r.toString() + "c" + c.toString() + "' class='sudokuSquares' style='left: " + str1 + "px; top: " + str2 + "px;' />";
      element.append(str3);
    }
  }
}

function integerIsInRow(row, n) {
  var index, r;

  index = sudokuRows[row - 1].indexOf(n);

  if (index >= 0) {
    r = true;
  }
  else {
    r = false;
  }

  return r;
}

function integerIsInColumn(column, n) {
  var index, r;

  index = sudokuColumns[column - 1].indexOf(n);

  if (index >= 0) {
    r = true;
  }
  else {
    r = false;
  }

  return r;
}

function integerIsInSquare(square, n) {
  var index, r;

  index = sudokuSquares[square - 1].indexOf(n);

  if (index >= 0) {
    r = true;
  }
  else {
    r = false;
  }

  return r;
}

function returnSquare(row, column) {
  if ((row <= 3) && (column <= 3)) {
    return 1;
  }
  else if ((row <= 3) && (column >= 4) && (column <= 6)) {
    return 2;
  }
  if ((row <= 3) && (column >= 7)) {
    return 3;
  }
  if ((row >= 4) && (row <= 6) && (column <= 3)) {
    return 4;
  }
  else if ((row >= 4) && (row <= 6) && (column >= 4) && (column <= 6)) {
    return 5;
  }
  if ((row >= 4) && (row <= 6) && (column >= 7)) {
    return 6;
  }
  if ((row >= 7) && (column <= 3)) {
    return 7;
  }
  else if ((row >= 7) && (column >= 4) && (column <= 6)) {
    return 8;
  }
  else {
    return 9;
  }
}

function buildCandidateIntegers(r, c) {
  var n, b, s, i;

  i = 0;

  for (n = 1; n <= 9; n++) {
    b = integerIsInRow(r, n);

    if (!b) {
      b = integerIsInColumn(c, n);

      if (!b) {
        s = returnSquare(r, c);
        b = integerIsInSquare(s, n);

        if (!b) {
          candidateIntegers[r - 1][c - 1][i] = n;
          i++;
        }
      }
    }
  }
}

function setForeColorForstartIntegers() {
  var i, r, c;

  for (i = 0; i < numberOfStartIntegers; i++) {
    r = startIntegers[i][0];
    c = startIntegers[i][1];
    $("#sqr" + r.toString() + "c" + c.toString()).addClass("startInteger");
  }
}

function resetForeColorForStartIntegers() {
  var i, r, c;

  for (i = 0; i < numberOfStartIntegers; i++) {
    r = startIntegers[i][0];
    c = startIntegers[i][1];
    $("#sqr" + r.toString() + "c" + c.toString()).removeClass("startInteger");
  }
}

function readData() {
  var r, c, s, idxInSquare, n, str, selector, returnValue = true;

  r = 1;
  while ((r <= 9) && (returnValue)) {
    c = 1;
    while ((c <= 9) && (returnValue)) {
      s = returnSquare(r, c);
      selector = "#sqr" + r.toString() + "c" + c.toString();
      str = $(selector).val().trim();

      if (str === "") {
        n = 0;
      }
      else if ((str !== "") && (window.isNaN(str))) {
        alert("The value given in row " + r.toString() + " and column " + c.toString() + " is not an integer between 1 and 9!");
        returnValue = false;
      }
      else {
        n = window.parseFloat(str);

        if ((n < 1) || (n > 9) || (Math.ceil(n) != n)) {
          returnValue = false;
          alert("The value given in row " + r.toString() + " and column " + c.toString() + " is not an integer between 1 and 9!");
        }
        else {
          n = window.parseInt(str);
          if (sudokuRows[r - 1].indexOf(n) >= 0) {
            returnValue = false;
            alert("The given initial integers are incorrect! There are more than 1 occurence of integer " + n.toString() + " in row " + r.toString() + "!");
          }
          else if (sudokuColumns[c - 1].indexOf(n) >= 0) {
            returnValue = false;
            alert("The given initial integers are incorrect! There are more than 1 occurence of integer " + n.toString() + " in column " + c.toString() + "!");
          }
          else if (sudokuSquares[s - 1].indexOf(n) >= 0) {
            returnValue = false;
            alert("The given initial integers are incorrect! There are more than 1 occurence of integer " + n.toString() + " in square " + s.toString() + "!");
          }
          else {
            sudokuRows[r - 1][c - 1] = n;
            sudokuColumns[c - 1][r - 1] = n;
            idxInSquare = (3 * ((r - 1) % 3)) + ((c - 1) % 3);
            sudokuSquares[s - 1][idxInSquare] = n;
          }
        }
      }
      c++;
    }
    r++;
  }

  if (!returnValue) {
    for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        sudokuRows[r][c] = 0;
        sudokuColumns[r][c] = 0;
        sudokuSquares[r][c] = 0;
      }
    }
  }
  else {
    for (r = 1; r <= 9; r++) {
      for (c = 1; c <= 9; c++) {
        $("#sqr" + r.toString() + "c" + c.toString()).prop("readonly", true);
        if (sudokuRows[r - 1][c - 1] > 0) {
          numberOfIntegersSet++;
          startIntegers.push([r, c, sudokuRows[r - 1][c - 1]]);
        }
      }
    }

    numberOfStartIntegers = numberOfIntegersSet;
    setForeColorForstartIntegers();

    if (debug >= 0) {
      for (r = 1; r <= 9; r++) {
        for (c = 1; c <= 9; c++) {
          if (sudokuRows[r - 1][c - 1] > 0) {
            selector = "#debugDiv2r" + r.toString() + "c" + c.toString();
            element = $(selector);
            element.addClass("integerSetInSquare");
            element.text("[" + r.toString() + c.toString() + "]: " + sudokuRows[r - 1][c - 1].toString());

            selector = "#debugDiv4r" + r.toString() + "c" + c.toString();
            element = $(selector);
            element.addClass("integerSetInSquare");
            element.text("[" + r.toString() + c.toString() + "]: " + sudokuRows[r - 1][c - 1].toString());

            selector = "#debugDiv6r" + r.toString() + "c" + c.toString();
            element = $(selector);
            element.addClass("integerSetInSquare");
            element.text("[" + r.toString() + c.toString() + "]: " + sudokuRows[r - 1][c - 1].toString());
          }
          else {
            selector = "#debugDiv2r" + r.toString() + "c" + c.toString();
            element = $(selector);
            element.text("[" + r.toString() + c.toString() + "]:");
          }
        }
      }

      debug = 1;
    }
  }

  return returnValue;
}

function buildCellsToCheckIfIntegerExistToKeepIntegerAsCandidate() {
  var r, c, row, column, square, v, u1, u2, u3, u4;

  cellsToCheckIfIntegerExistToKeepIntegerAsCandidate = [];

  for (r = 0; r < 9; r++) {
    cellsToCheckIfIntegerExistToKeepIntegerAsCandidate.push(returnArrayWith9Zeros());
  }

  for (row = 1; row <= 9; row++) {
    for (column = 1; column <= 9; column++) {
      square = returnSquare(row, column);

      switch (square) {
        case 1:
          v = [2, 3, 4, 7];
          break;
        case 2:
          v = [1, 3, 5, 8];
          break;
        case 3:
          v = [1, 2, 6, 9];
          break;
        case 4:
          v = [1, 7, 5, 6];
          break;
        case 5:
          v = [2, 4, 6, 8];
          break;
        case 6:
          v = [3, 4, 5, 9];
          break;
        case 7:
          v = [1, 4, 8, 9];
          break;
        case 8:
          v = [2, 5, 7, 9];
          break;
        case 9:
          v = [3, 6, 7, 8];
          break;
      }


      u1 = [];
      u2 = [];
      u3 = [];
      u4 = [];

      for (r = 1; r <= 9; r++) {
        for (c = 1; c <= 9; c++) {
          if ((r !== row) && (c !== column)) {
            square = returnSquare(r, c);

            if (square === v[0]) {
              u1.push([r, c]);
            }
            else if (square === v[1]) {
              u2.push([r, c]);
            }
            else if (square === v[2]) {
              u3.push([r, c]);
            }
            else if (square === v[3]) {
              u4.push([r, c]);
            }
          }
        }
      }
      cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[row - 1][column - 1] = [u1, u2, u3, u4];
    }
  }
}

function returnLength(v) {
  var length, i, n;

  i = 0;
  n = v[i];

  if (n > 0) {
    length = 1;
    i++;

    while ((n > 0) && (i < 9)) {
      n = v[i];

      if (n > 0) {
        length++;
      }
      i++;
    }
  }
  else {
    length = 0;
  }

  return length;
}

function buildIntegersWhereCandidateMustExistToBeKept() {
  var r, c, i, j, k, l, v, p, n, length;

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      if (sudokuRows[r - 1][c - 1] === 0) {
        for (i = 0; i < 9; i++) {
          integersWhereCandidateMustExistToBeKept[r - 1][c - 1][0][i] = 0;
          integersWhereCandidateMustExistToBeKept[r - 1][c - 1][1][i] = 0;
          integersWhereCandidateMustExistToBeKept[r - 1][c - 1][2][i] = 0;
          integersWhereCandidateMustExistToBeKept[r - 1][c - 1][3][i] = 0;
        }

        for (i = 0; i < 4; i++) {
          v = cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[r - 1][c - 1][i];
          j = 0;

          for (k = 0; k < 6; k++) {
            p = v[k];
            n = sudokuRows[p[0] - 1][p[1] - 1];

            if ((n > 0) && (integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].indexOf(n) === -1)) {
              integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i][j] = n;
              j++;
            }
            else {
              length = returnLength(candidateIntegers[p[0] - 1][p[1] - 1]);

              for (l = 0; l < length; l++) {
                n = candidateIntegers[p[0] - 1][p[1] - 1][l];

                if (integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].indexOf(n) === -1) {
                  integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i][j] = n;
                  j++;
                }
              }
            }
          }
        }
      }
    }
  }

  if (debug >= 0) {
    for (r = 1; r <= 9; r++) {
      for (c = 1; c <= 9; c++) {
        if (sudokuRows[r - 1][c - 1] === 0) {
          for (i = 0; i < 4; i++) {
            integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].sort(mySortFunction);
            integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].sort(mySortFunction);
            integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].sort(mySortFunction);
            integersWhereCandidateMustExistToBeKept[r - 1][c - 1][i].sort(mySortFunction);
          }
        }
      }
    }
  }
}

function updateCandidateIntegers(r, c) {
  var length, v, i, j, n, keepInteger;

  v = integersWhereCandidateMustExistToBeKept[r - 1][c - 1];

  length = candidateIntegers[r - 1][c - 1].length;
  j = 0;

  for (i = 0; i < length; i++) {
    n = candidateIntegers[r - 1][c - 1][i];

    keepInteger = false;
    if (v[0].indexOf(n) >= 0) {
      if (v[1].indexOf(n) >= 0) {
        if (v[2].indexOf(n) >= 0) {
          if (v[3].indexOf(n) >= 0) {
            keepInteger = true;
          }
        }
      }
    }

    if (keepInteger) {
      tmpKeepIntegerUpdateCandidateIntegers[i] = n;
    }
    else {
      tmpKeepIntegerUpdateCandidateIntegers[i] = 0;

      if (debug >= 0) {
        removedCandidates[r - 1][c - 1][j] = n;
        j++;
      }
    }
  }

  j = 0;
  for (i = 0; i < length; i++) {
    n = tmpKeepIntegerUpdateCandidateIntegers[i];
    if (n > 0) {
      candidateIntegers[r - 1][c - 1][j] = n;
      j++;
    }
  }

  for (i = j; i < 9; i++) {
    candidateIntegers[r - 1][c - 1][i] = 0;
  }
}

function returnNextIdInCanSetIntegerInCell() {
  var id, i;

  id = -1;

  if (canSetIntegerInCell.length > 0) {
    i = 0;

    while ((i < canSetIntegerInCell.length) && (id === -1)) {
      if (canSetIntegerInCell[i][0] === 0) {
        id = i;
      }
      else {
        i++;
      }
    }
  }

  return id;
}

function addIntegerToArrayCanSetIntegerInCell(r, c, n) {
  var id;

  id = returnNextIdInCanSetIntegerInCell();

  if (id >= 0) {
    canSetIntegerInCell[id][0] = r;
    canSetIntegerInCell[id][1] = c;
    canSetIntegerInCell[id][2] = n;
  }
  else {
    canSetIntegerInCell.push([r, c, n]);
  }
}

function returndistributionOfNumberOfCandidatesInCellsAsString() {
  var i, str = "";

  for (i = 0; i < 10; i++) {
    str += ("[" + i.toString() + ":" + distributionOfNumberOfCandidatesInCells[i].toString() + "]");
  }

  return str;
}

function calculate() {
  var r, c, s, str, i, n, canSetInteger, length, canSetIntegerCase1, canSetIntegerCase2, canSetIntegerCase3, canSetIntegerCase4, totalNumberOfCandidates, a, b, cellFound, setIntegerAtRandom = "Not used", numberOfCellsWithNoCandidates = 0, strNumberOfCellsWithNoCandidates = " (";
  var distributionOfNumberOfCandidatesInCellsAsString, aRandomInteger, numberOfCandidatesInCells;
  var cellFoundWhereNoCandidatesExist = false;

  iterationNumber++;
  canSetIntegerCase1 = 0;
  canSetIntegerCase2 = 0;
  canSetIntegerCase3 = 0;
  canSetIntegerCase4 = 0;
  totalNumberOfCandidates = 0;
  numberOfIntegersThatCanBeSet = 0;

  for (i = 0; i < 10; i++) {
    distributionOfNumberOfCandidatesInCells[i] = 0;
  }

  for (i = 0; i < canSetIntegerInCell.length; i++) {
    canSetIntegerInCell[i][0] = 0;
    canSetIntegerInCell[i][1] = 0;
    canSetIntegerInCell[i][2] = 0;
  }

  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      possibleRows[r][c] = 0;
      possibleColumns[r][c] = 0;
      possibleSquares[r][c] = 0;
    }
  }

  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      for (s = 0; s < 9; s++) {
        candidateIntegers[r][c][s] = 0;
      }
    }
  }

  if (debug >= 0) {
    for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        for (s = 0; s < 9; s++) {
          removedCandidates[r][c][s] = 0;
        }
      }
    }
  }

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      if (sudokuRows[r - 1][c - 1] === 0) {
        buildCandidateIntegers(r, c);
      }
    }
  }

  buildIntegersWhereCandidateMustExistToBeKept();

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      if (sudokuRows[r - 1][c - 1] === 0) {
        updateCandidateIntegers(r, c);
      }
    }
  }

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      if (sudokuRows[r - 1][c - 1] === 0) {
        length = candidateIntegers[r - 1][c - 1].length;
        for (i = 0; i < length; i++) {
          possibleRows[r - 1][candidateIntegers[r - 1][c - 1][i] - 1]++;
          possibleColumns[c - 1][candidateIntegers[r - 1][c - 1][i] - 1]++;
          s = returnSquare(r, c);
          possibleSquares[s - 1][candidateIntegers[r - 1][c - 1][i] - 1]++;
        }
      }
    }
  }

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {

        //Set default values
        str = "";
        canSetInteger = false;

      if (sudokuRows[r - 1][c - 1] === 0) {
        length = returnLength(candidateIntegers[r - 1][c - 1]); //length might be 0

        totalNumberOfCandidates += length;

        distributionOfNumberOfCandidatesInCells[length]++;

        if (length === 0) {
          cellFoundWhereNoCandidatesExist = true;
          str = "No candidates!!!";

          numberOfCellsWithNoCandidates++;

          if (numberOfCellsWithNoCandidates === 1) {
            strNumberOfCellsWithNoCandidates += "row=" + r.toString() + " and column=" + c.toString();
          }
          else {
            strNumberOfCellsWithNoCandidates += ", row=" + r.toString() + " and column=" + c.toString();
          }
        }
        else if (length === 1) {
          canSetIntegerCase1++;
          canSetInteger = true;
          n = candidateIntegers[r - 1][c - 1][0];
          str = " [1]";
        }
        else {
          i = 0;
          s = returnSquare(r, c);

          while ((i < length) && (!canSetInteger)) {
            n = candidateIntegers[r - 1][c - 1][i];

            if (possibleRows[r - 1][n - 1] === 1) {
              canSetIntegerCase2++;
              canSetInteger = true;
              str = " (" + n.toString() + ")[2]";
            }
            else if (possibleColumns[c - 1][n - 1] === 1) {
              canSetIntegerCase3++;
              canSetInteger = true;
              str = " (" + n.toString() + ")[3]";
            }
            else if (possibleSquares[s - 1][n - 1] === 1) {
              canSetIntegerCase4++;
              canSetInteger = true;
              str = " (" + n.toString() + ")[4]";
            }
            else {
              i++;
            }
          }
        }

        if (canSetInteger) {
          addIntegerToArrayCanSetIntegerInCell(r, c, n);
          numberOfIntegersThatCanBeSet++;
        }

        if (debug >= 0) {
          $("#debugDiv2r" + r.toString() + "c" + c.toString()).text("[" + r.toString() + c.toString() + "]: " + returnArrayExcludeZeros(candidateIntegers[r - 1][c - 1]) + str);

          if (canSetInteger) {
            $("#debugDiv2r" + r.toString() + "c" + c.toString()).addClass("canSetInteger100PercentSure");
          }
          else if (length === 0) {
            $("#debugDiv2r" + r.toString() + "c" + c.toString()).addClass("noCandidatesInCell");
          }
        }
      } //if (sudokuRows[r - 1][c - 1] === 0) {
    } //for (c = 1; c <= 9; c++) {
  } //for (r = 1; r <= 9; r++) {


  if ((numberOfIntegersThatCanBeSet === 0) && (totalNumberOfCandidates > 0)) {
    i = 2;
    numberOfCandidatesInCells = distributionOfNumberOfCandidatesInCells[i];

    while (numberOfCandidatesInCells === 0) {
      i++;
      numberOfCandidatesInCells = distributionOfNumberOfCandidatesInCells[i];
    }

    //Choose at random one of the n cells
    if (numberOfCandidatesInCells > 1) {
      a = returnIntegerRandomNumber(1, numberOfCandidatesInCells + 1);
    }
    else {
      a = 1;
    }

    //Find cell
    cellFound = false;
    r = 1;
    b = 0;

    while ((r <= 9) && (!cellFound)) {
      c = 1;
      while ((c <= 9) && (!cellFound)) {
        if (sudokuRows[r - 1][c - 1] === 0) {
          length = returnLength(candidateIntegers[r - 1][c - 1]);
          if (length === i) { //Find an occurence
            b++; //b stands for number of occurences found
          }
          if (a === b) {
            cellFound = true;
            aRandomInteger = returnIntegerRandomNumber(0, i);
            n = candidateIntegers[r - 1][c - 1][aRandomInteger]; //Choose at random of of the i integers
            addIntegerToArrayCanSetIntegerInCell(r, c, n);
            numberOfIntegersThatCanBeSet = 1;

            if (debug >= 0) {
              $("#debugDiv2r" + r.toString() + "c" + c.toString()).text("[" + r.toString() + c.toString() + "]: " + returnArrayExcludeZeros(candidateIntegers[r - 1][c - 1]) + " (" + n.toString() + ")");
              $("#debugDiv2r" + r.toString() + "c" + c.toString()).addClass("randomSet");
            }

            if ((makeStatTables) || (debug >= 0)) {
              setIntegerAtRandom = "Integer " + n.toString() + " from a sample of " + i.toString() + " integers, a sample which existed in " + numberOfCandidatesInCells.toString() + " cell(s).";
            }
          }
        }
        c++;
      }
      r++;
    }
  }

  if ((totalNumberOfCandidates > 0) && ((!cellFoundWhereNoCandidatesExist) || continueIfNoCandidatesFoundInOneCell)) {
      return true;
  }
  else {
      return false;
  }
}

function everyRowColumnSquareHasAtMostOneOfTheIntegers1To9() {
    var i, n, r, c, index, fromIndex, str, returnValue = true; //Default

    i = 1;
    while ((i <= 9) && (returnValue)) {
        n = 1;
        while ((n <= 9) && (returnValue)) {
            index = sudokuRows[i - 1].indexOf(n);

            if ((index >= 0) && (index < 8)) {
                fromIndex = 1 + index;
                index = sudokuRows[i - 1].indexOf(n, fromIndex);

                if (index > 0) {
                    returnValue = true;
                    str = "There are more than 1 occurence of integer " + n.toString() + " in row " + i.toString() + "!!!";
                }
            }

            n++;
        }

        i++;
    }

    i = 1;
    while ((i <= 9) && (returnValue)) {
        n = 1;
        while ((n <= 9) && (returnValue)) {
            index = sudokuColumns[i - 1].indexOf(n);

            if ((index >= 0) && (index < 8)) {
                fromIndex = 1 + index;
                index = sudokuColumns[i - 1].indexOf(n, fromIndex);

                if (index > 0) {
                    returnValue = true;
                    str = "There are more than 1 occurence of integer " + n.toString() + " in column " + i.toString() + "!!!";
                }
            }

            n++;
        }

        i++;
    }

    i = 1;
    while ((i <= 9) && (returnValue)) {
        n = 1;
        while ((n <= 9) && (returnValue)) {
            index = sudokuSquares[i - 1].indexOf(n);

            if ((index >= 0) && (index < 8)) {
                fromIndex = 1 + index;
                index = sudokuSquares[i - 1].indexOf(n, fromIndex);

                if (index > 0) {
                    returnValue = true;
                    str = "There are more than 1 occurence of integer " + n.toString() + " in square " + i.toString() + "!!!";
                }
            }

            n++;
        }

        i++;
    }

    return returnValue
}

function realizeCalculation() {
    var returnValue, i, r, c, n, s, idxInSquare;

    numberOfIntegersSet += numberOfIntegersThatCanBeSet;

    for (i = 0; i < numberOfIntegersThatCanBeSet; i++) {
        r = canSetIntegerInCell[i][0];
        c = canSetIntegerInCell[i][1];
        n = canSetIntegerInCell[i][2];
        s = returnSquare(r, c);

        sudokuRows[r - 1][c - 1] = n;
        sudokuColumns[c - 1][r - 1] = n;
        idxInSquare = (3 * ((r - 1) % 3)) + ((c - 1) % 3);
        sudokuSquares[s - 1][idxInSquare] = n;
    }

    if (numberOfIntegersSet === 81) {
        returnValue = true;
    }
    else {
        returnValue = false;
    }

    return returnValue;
}

function newSudoku() {
  var r, c, element, selector;

  resetForeColorForStartIntegers();

  iterationNumber = 0;
  numberOfIntegersSet = 0;
  startIntegers = [];

  for (r = 1; r <= 9; r++) {
    for (c = 1; c <= 9; c++) {
      selector = "#sqr" + r.toString() + "c" + c.toString();
      element = $(selector);
      element.prop("readonly", false);
      element.val("");
      sudokuRows[r - 1][c - 1] = 0;
      sudokuColumns[r - 1][c - 1] = 0;
      sudokuSquares[r - 1][c - 1] = 0;
    }
  }

  $("#newSudokuButton").prop("disabled", true);
  $("#solveButton").prop("disabled", false);

  $("#newSudokuButton").addClass("greyFontColor");
  $("#solveButton").removeClass("greyFontColor");

  if (makeStatTables) {
    tbodyStatTableElement.html("");
  }
}

function init() {
  var i, j, r, c;

  sudokuRows = [];
  sudokuColumns = [];
  sudokuSquares = [];
  possibleRows = [];
  possibleColumns = [];
  possibleSquares = [];
  candidateIntegers = [];
  integersWhereCandidateMustExistToBeKept = [];
  tmpKeepIntegerUpdateCandidateIntegers = [];
  canSetIntegerInCell = [];
  iterationNumber = 0;
  numberOfIntegersSet = 0;
  startIntegers = [];
  distributionOfNumberOfCandidatesInCells = [];
  statArray = [];

  for (i = 0; i < 9; i++) {
    sudokuRows.push(returnArrayWith9Zeros());
    sudokuColumns.push(returnArrayWith9Zeros());
    sudokuSquares.push(returnArrayWith9Zeros());
    possibleRows.push(returnArrayWith9Zeros());
    possibleColumns.push(returnArrayWith9Zeros());
    possibleSquares.push(returnArrayWith9Zeros());
    candidateIntegers.push(returnArrayWith9Zeros());
    integersWhereCandidateMustExistToBeKept.push(returnArrayWith9Zeros());
    tmpKeepIntegerUpdateCandidateIntegers.push(0);
    distributionOfNumberOfCandidatesInCells.push(0);
    statArray.push(0);
  }

  distributionOfNumberOfCandidatesInCells.push(0);

  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      candidateIntegers[i][j] = returnArrayWith9Zeros();
      integersWhereCandidateMustExistToBeKept[i][j] = [returnArrayWith9Zeros(), returnArrayWith9Zeros(), returnArrayWith9Zeros(), returnArrayWith9Zeros()];
    }
  }

  buildCellsToCheckIfIntegerExistToKeepIntegerAsCandidate();

  if (debug >= 0) {
    debugCandidateExists = true;
    removedCandidates = [];

    for (i = 0; i < 9; i++) {
      removedCandidates.push(returnArrayWith9Zeros());
    }

    for (i = 0; i < 9; i++) {
      for (j = 0; j < 9; j++) {
        removedCandidates[i][j] = returnArrayWith9Zeros();
      }
    }

    initDebugDiv2();
    initDebugDiv3();
    initDebugDiv4();
    initDebugDiv5();
    initDebugDiv6();

    for (r = 1; r <= 9; r++) {
      for (c = 1; c <= 9; c++) {
        str = "[" + r.toString() + c.toString() + "]: " + returnElementAsString(cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[r - 1][c - 1][0]) + ",   " + returnElementAsString(cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[r - 1][c - 1][1]) + ",   " + returnElementAsString(cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[r - 1][c - 1][2]) + ",   " + returnElementAsString(cellsToCheckIfIntegerExistToKeepIntegerAsCandidate[r - 1][c - 1][3]);
        $("#debugDiv5r" + r.toString() + "c" + c.toString()).text(str);
      }
    }

    debugElementCurrentVisible = $("#debugDiv2");
  }

  if (makeStatTables) {
    tbodyStatTableElement = $("#tbodyStatTable");
  }
}

function verifySolution() {
  var i, str, ok = true;

  i = 1;
  while ((i <= 9) && (ok)) {
    sudokuRows[i - 1].sort();
    str = sudokuRows[i - 1].join(", ");

    if (str !== "1, 2, 3, 4, 5, 6, 7, 8, 9") {
      ok = false;
      alert("Row " + i.toString() + " is incorrect!!");
    }

    i++;
  }

  i = 1;
  while ((i <= 9) && (ok)) {
    sudokuColumns[i - 1].sort();
    str = sudokuColumns[i - 1].join(", ");

    if (str !== "1, 2, 3, 4, 5, 6, 7, 8, 9") {
      ok = false;
      alert("Column " + i.toString() + " is incorrect!!");
    }

    i++;
  }

  i = 1;
  while ((i <= 9) && (ok)) {
    sudokuSquares[i - 1].sort();
    str = sudokuSquares[i - 1].join(", ");

    if (str !== "1, 2, 3, 4, 5, 6, 7, 8, 9") {
      ok = false;
      alert("Square " + i.toString() + " is incorrect!!");
    }

    i++;
  }
}

function solve() {
    var sudokuSolved, returnValue, r, c, selector, element;

    if (readData()) {
        sudokuSolved = false;

        while ((!sudokuSolved) && (numberOfTimesToTrySolveSudoku <= maxNumberOfTriesToSolveSudoku)) {
            returnValue = calculate();

            if (returnValue) {
                sudokuSolved = realizeCalculation();
                rulesAreFullfiled = everyRowColumnSquareHasAtMostOneOfTheIntegers1To9();

                if (!rulesAreFullfiled) {
                    sudokuSolved = false;
                    reset();
                    numberOfTimesToTrySolveSudoku++;
                }
            }
            else {
                reset();
                numberOfTimesToTrySolveSudoku++;
            }
        }
    }
    else {
        return;
    }

    if (!sudokuSolved) {
        resetForeColorForStartIntegers();
        iterationNumber = 0;
        numberOfIntegersSet = 0;
        numberOfTimesToTrySolveSudoku = 1;
        startIntegers = [];

        for (r = 1; r <= 9; r++) {
            for (c = 1; c <= 9; c++) {
                selector = "#sqr" + r.toString() + "c" + c.toString();
                element = $(selector);
                element.prop("readonly", false);
                sudokuRows[r - 1][c - 1] = 0;
                sudokuColumns[r - 1][c - 1] = 0;
                sudokuSquares[r - 1][c - 1] = 0;
            }
        }

        alert("Sorry, unable to solve this sudoku!"); alert("Sorry, unable to solve this sudoku!");
    } else {
        for (r = 1; r <= 9; r++) {
            for (c = 1; c <= 9; c++) {
                selector = "#sqr" + r.toString() + "c" + c.toString();
                element = $(selector);
                if (!element.hasClass("startInteger")) {
                    element.val(sudokuRows[r - 1][c - 1].toString())
                }
            }
        }

        $("#solveButton").prop("disabled", true);
        $("#solveButton").addClass("greyFontColor");
        $("#newSudokuButton").prop("disabled", false);
        $("#newSudokuButton").removeClass("greyFontColor");
        verifySolution();
    }


}


