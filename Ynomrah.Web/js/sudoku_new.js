window.Sudoku = new window.Object();

window.Sudoku.TwoTupleOfIntegers = function(x, y) {
  this.x = x;
  this.y = y;
}

window.Sudoku.ThreeTupleOfIntegers = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

window.Sudoku.ArrayList = function() {
    this.v = [];
}

window.Sudoku.ArrayList.prototype.Add = function (n) {
    this.v.push(n);
}

window.Sudoku.ArrayList.prototype.Index = function (i) {
    return this.v[i];
}

window.Sudoku.ArrayList.prototype.IndexOf = function (itemValue) {
    return this.v.indexOf(itemValue);
}

window.Sudoku.ArrayList.prototype.Clear = function () {
    this.v = [];
}

window.Sudoku.ArrayList.prototype.Remove = function (itemValue) {
    var index = this.v.indexOf(itemValue);
    this.v.splice(index, 1);
}

window.Sudoku.ArrayList.prototype.Count = function () {
    return this.v.length;
}

window.Sudoku.ArrayList.prototype.RemoveAt = function (index) {
    this.v.splice(index, 1);
}

window.Sudoku.Result = function(errorMessage, solvedAlready, partiallySolved, nothingSolved, solved, setData) {
    this.errorMessage = errorMessage;
    this.solvedAlready = solvedAlready;
    this.partiallySolved = partiallySolved;
    this.nothingSolved = nothingSolved;
    this.solved = solved;
    this.setData = setData;
}

window.Sudoku.Cell = function(position, itemValue, originalData) {
    this.position = position;
    this.itemValue = itemValue;
    this.originalData = originalData;
    this.possibleItemValuesToSet = new Sudoku.ArrayList();
}

window.Sudoku.Random = function() {
    this.Next = function (maxExcluded) {
        var n = Math.round(Math.random() * maxExcluded);

        if (n === maxExcluded) {
            n = 0;
        }

        return n;
    }
}

window.Sudoku.IntegerDivision = function (a, b) {
    var n = 1;

    while ((n * b) <= a) {
        n++;
    }

    return n - 1;
}

window.Sudoku.SudokuBoard = function() {
    var i, j;

    this._cells = [[], [], [], [], [], [], [], [], []];
    this._numberOfItemsPossibleToSetRow = [[], [], [], [], [], [], [], [], []];
    this._numberOfItemsPossibleToSetColumn = [[], [], [], [], [], [], [], [], []];
    this._numberOfItemsPossibleToSetSquare = [[], [], [], [], [], [], [], [], []];
    this._squareIndex = [[], [], [], [], [], [], [], [], []];
    this._random = new Sudoku.Random();
    this._cellsRemainToSet = new Sudoku.ArrayList();
    this._dataSetBeforeSimulationHasBeenDone = new Sudoku.ArrayList();
    this._simulationHasBeenDone = false;

    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            this._cells[i].push(new Sudoku.Cell(new Sudoku.TwoTupleOfIntegers(i, j), 0, false));
            this._numberOfItemsPossibleToSetRow[i].push(0);
            this._numberOfItemsPossibleToSetColumn[i].push(0);
            this._numberOfItemsPossibleToSetSquare[i].push(0);
            this._squareIndex[i].push(new Sudoku.TwoTupleOfIntegers((3 * Sudoku.IntegerDivision(i, 3)) + Sudoku.IntegerDivision(j, 3), (3 * (i % 3)) + (j % 3)));
        }
    }

    this.RowHasItemValueInAnyCell = function(fixedRowIndex, itemValue) {
        var returnValue = false;
        var variableColumnIndex = 0;

        while ((!returnValue) && (variableColumnIndex < 9)) {
            if (this._cells[fixedRowIndex][variableColumnIndex].itemValue == itemValue) {
                returnValue = true;
            }
            else {
                variableColumnIndex++;
            }
        }

        return returnValue;
    }

    this.ColumnHasItemValueInAnyCell = function(fixedColumnIndex, itemValue) {
        var returnValue = false;
        var variableRowIndex = 0;

        while ((!returnValue) && (variableRowIndex < 9)) {
            if (this._cells[variableRowIndex][fixedColumnIndex].itemValue == itemValue) {
                returnValue = true;
            }
            else {
                variableRowIndex++;
            }
        }

        return returnValue;
    }

    this.SquareHasItemValueInAnyCell = function(fixedSquareIndex, itemValue) {
        var returnValue = false;
        var variableRowIndex, variableColumnIndex, variableSquareSequenceIndex = 0;

        while ((!returnValue) && (variableSquareSequenceIndex < 9)) {
            variableRowIndex = this._squareIndex[fixedSquareIndex][variableSquareSequenceIndex].x;
            variableColumnIndex = this._squareIndex[fixedSquareIndex][variableSquareSequenceIndex].y;

            if (this._cells[variableRowIndex][variableColumnIndex].itemValue == itemValue) {
                returnValue = true;
            }
            else {
                variableSquareSequenceIndex++;
            }
        }

        return returnValue;
    }

    this.UpdateStructure = function(rowIndex, columnIndex, squareIndex, itemValue) {
        var i, j, rowIdx, colIdx, sqIdx;

        for (i = 0; i < this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count(); i++) {

            this._numberOfItemsPossibleToSetRow[rowIndex][this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(i) - 1]--;
            this._numberOfItemsPossibleToSetColumn[columnIndex][this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(i) - 1]--;
            this._numberOfItemsPossibleToSetSquare[squareIndex][this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(i) - 1]--;
            this._totalNumberOfItemsPossibleToSet--;
        }

        this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Clear();

        for (i = 0; i < 9; i++) {
            if (this._cells[rowIndex][i].itemValue == 0) {
                for (j = 0; j < this._cells[rowIndex][i].possibleItemValuesToSet.Count(); j++) {
                    if (this._cells[rowIndex][i].possibleItemValuesToSet.IndexOf(itemValue) >= 0) {
                        this._cells[rowIndex][i].possibleItemValuesToSet.Remove(itemValue);
                        this._totalNumberOfItemsPossibleToSet--;
                        sqIdx = (3 * Sudoku.IntegerDivision(rowIndex, 3)) + Sudoku.IntegerDivision(i, 3);
                        this._numberOfItemsPossibleToSetRow[rowIndex][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetColumn[i][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetSquare[sqIdx][itemValue - 1]--;
                    }
                }
            }
        }

        for (i = 0; i < 9; i++) {
            if ((i != rowIndex) && (this._cells[i][columnIndex].itemValue == 0)) {
                for (j = 0; j < this._cells[i][columnIndex].possibleItemValuesToSet.Count(); j++) {
                    if (this._cells[i][columnIndex].possibleItemValuesToSet.IndexOf(itemValue) >= 0) {
                        this._cells[i][columnIndex].possibleItemValuesToSet.Remove(itemValue);
                        this._totalNumberOfItemsPossibleToSet--;
                        sqIdx = (3 * Sudoku.IntegerDivision(i, 3)) + Sudoku.IntegerDivision(columnIndex, 3);
                        this._numberOfItemsPossibleToSetRow[i][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetColumn[columnIndex][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetSquare[sqIdx][itemValue - 1]--;
                    }
                }
            }
        }

        for (i = 0; i < 9; i++) {
            rowIdx = this._squareIndex[squareIndex][i].x;
            colIdx = this._squareIndex[squareIndex][i].y;

            if ((rowIdx != rowIndex) && (colIdx != columnIndex) && (this._cells[rowIdx][colIdx].itemValue == 0)) {
                for (j = 0; j < this._cells[rowIdx][colIdx].possibleItemValuesToSet.Count(); j++) {
                    if (this._cells[rowIdx][colIdx].possibleItemValuesToSet.IndexOf(itemValue) >= 0) {
                        this._cells[rowIdx][colIdx].possibleItemValuesToSet.Remove(itemValue);
                        this._totalNumberOfItemsPossibleToSet--;
                        this._numberOfItemsPossibleToSetRow[rowIdx][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetColumn[colIdx][itemValue - 1]--;
                        this._numberOfItemsPossibleToSetSquare[squareIndex][itemValue - 1]--;
                    }
                }
            }
        }
    }

    this.Init = function() {
        var i, j, rowIndex, columnIndex, squareIndex, itemValue;

        for (rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (columnIndex = 0; columnIndex < 9; columnIndex++) {
                squareIndex = (3 * Sudoku.IntegerDivision(rowIndex, 3)) + Sudoku.IntegerDivision(columnIndex, 3);

                this._cells[rowIndex][columnIndex].itemValue = 0;
                this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Clear();

                for (itemValue = 1; itemValue <= 9; itemValue++) {
                    this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Add(itemValue);
                }
            }
        }

        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                this._numberOfItemsPossibleToSetRow[i][j] = 9;
                this._numberOfItemsPossibleToSetColumn[i][j] = 9;
                this._numberOfItemsPossibleToSetSquare[i][j] = 9;
            }
        }

        this._totalNumberOfItemsPossibleToSet = (81 * 9);
    }

    this.SetCell = function (rowIndex, columnIndex, itemValue, originalData) {
        var squareIndex = (3 * Sudoku.IntegerDivision(rowIndex, 3)) + Sudoku.IntegerDivision(columnIndex, 3);
        var row = rowIndex + 1;
        var column = columnIndex + 1;
        var square = squareIndex + 1;

        if (this.RowHasItemValueInAnyCell(rowIndex, itemValue)) {
            return "Number " + itemValue.toString() + " appears more than once in row " + row.toString() + "!";
        }

        if (this.ColumnHasItemValueInAnyCell(columnIndex, itemValue)) {
            return "Number " + itemValue.toString() + " appears more than once in row " + column.toString() + "!";
        }

        if (this.SquareHasItemValueInAnyCell(squareIndex, itemValue)) {
            return "Number " + itemValue.toString() + " appears more than once in row " + square.toString() + "!";
        }

        this._cells[rowIndex][columnIndex].itemValue = itemValue;
        this._cells[rowIndex][columnIndex].originalData = originalData;
        this.UpdateStructure(rowIndex, columnIndex, squareIndex, itemValue);

        return null;
    }

    this.SetData = function(data) {
        var i;
        var returnValue = null;

        i = 0;
        while ((i < data.Count()) && (returnValue == null)) {
            returnValue = this.SetCell(data.Index(i).position.x, data.Index(i).position.y, data.Index(i).itemValue, data.Index(i).originalData);
            i++;
        }

        return returnValue;
    }

    this.FillCellsRemainToSet = function() {
        var i, j;

        this._cellsRemainToSet.Clear();

        for (i = 0; i < 9; i++)
        {
            for (j = 0; j < 9; j++)
            {
                if (this._cells[i][j].itemValue == 0) {
                    this._cellsRemainToSet.Add(new Sudoku.TwoTupleOfIntegers(i, j));
                }
            }
        }
    }

    this.ReturnData = function(originalData) {
        var data = new Sudoku.ArrayList();
        var threeTupleOfIntegers;
        var position;
        var itemValue;
        var i;

        for (i = 0; i < originalData.Count(); i++)
        {
            threeTupleOfIntegers = originalData.Index(i);
            position = new Sudoku.TwoTupleOfIntegers(threeTupleOfIntegers.x, threeTupleOfIntegers.y);
            itemValue = threeTupleOfIntegers.z;
            data.Add(new Sudoku.Cell(position, itemValue, true));
        }

        return data;
    }

    this.LoopThroughListWithCellsThatRemainToSet = function() {
        var i, j, itemValue = 0, rowIndex, columnIndex, squareIndex;
        var findItemToSet, atLeastOneItemSet;

        i = 0;
        atLeastOneItemSet = false;

        while (i < this._cellsRemainToSet.Count()) {
            findItemToSet = false;
            rowIndex = this._cellsRemainToSet.Index(i).x;
            columnIndex = this._cellsRemainToSet.Index(i).y;
            squareIndex = (3 * Sudoku.IntegerDivision(rowIndex, 3)) + Sudoku.IntegerDivision(columnIndex, 3);

            if (this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() == 1) {
                findItemToSet = true;
                itemValue = this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(0);
            }
            else {
                j = 0;
                while ((j < this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count()) && (!findItemToSet)) {
                    itemValue = this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(j);

                    if ((this._numberOfItemsPossibleToSetRow[rowIndex][itemValue - 1] == 1) || (this._numberOfItemsPossibleToSetColumn[columnIndex][itemValue - 1] == 1) || (this._numberOfItemsPossibleToSetSquare[squareIndex][itemValue - 1] == 1)) {
                        findItemToSet = true;
                    }
                    else {
                        j++;
                    }
                }
            }

            if (findItemToSet) {
                this.SetCell(rowIndex, columnIndex, itemValue, false);

                if (!this._simulationHasBeenDone) {
                    this._dataSetBeforeSimulationHasBeenDone.Add(new Sudoku.Cell(new Sudoku.TwoTupleOfIntegers(rowIndex, columnIndex), itemValue, false));
                }

                atLeastOneItemSet = true;

                this._cellsRemainToSet.RemoveAt(i);
            }
            else {
                i++;
            }
        }

        return atLeastOneItemSet;
    }

    this.SimulateOneItem = function () {
        var i, rowIndex, columnIndex, minNumberPossibleToSetItems, randomNumber, n, index, itemValue;
        var numberPossibleToSetItems = [];

        for (i = 0; i < 8; i++) {
            numberPossibleToSetItems.push(0);
        }

        minNumberPossibleToSetItems = 10;

        for (i = 0; i < this._cellsRemainToSet.Count(); i++) {
            rowIndex = this._cellsRemainToSet.Index(i).x;
            columnIndex = this._cellsRemainToSet.Index(i).y;

            if ((this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() > 1) && (this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() <= minNumberPossibleToSetItems)) {
                if (this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() < minNumberPossibleToSetItems) {
                    minNumberPossibleToSetItems = this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count();
                }

                numberPossibleToSetItems[this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() - 2]++;
            }
        }

        n = 0;
        i = 0;
        randomNumber = 1 + this._random.Next(numberPossibleToSetItems[minNumberPossibleToSetItems - 2]);

        while (n < randomNumber) {
            rowIndex = this._cellsRemainToSet.Index(i).x;
            columnIndex = this._cellsRemainToSet.Index(i).y;

            if (this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Count() == minNumberPossibleToSetItems) {
                n++;
            }

            if (n == randomNumber) {
                index = this._random.Next(minNumberPossibleToSetItems);
                itemValue = this._cells[rowIndex][columnIndex].possibleItemValuesToSet.Index(index);
                this.SetCell(rowIndex, columnIndex, itemValue, false);
                this._simulationHasBeenDone = true;            
                this._cellsRemainToSet.RemoveAt(i);
            }

            i++;
        }
    }

    this.ReturnArrayListWithSetData = function() {
        var i, j;
        var v = new Sudoku.ArrayList();

        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                if ((this._cells[i][j].itemValue != 0) && (!this._cells[i][j].originalData)) {
                    v.Add(new Sudoku.ThreeTupleOfIntegers(i, j, this._cells[i][j].itemValue));
                }
            }
        }

        return v;
    }

    this.Process = function(originalData, maxNumberOfTries) {
        var data;
        var numberOfTries = 0, maxNumberOfItemsSetInATry = 0;
        var atLeastOneItemSet;
        var errorMessage;
        var setData = null;

        data = this.ReturnData(originalData);
        
        this.Init();
        errorMessage = this.SetData(data);

        if (errorMessage != null)
            return new Result(errorMessage, false, false, true, false, null);

        if (data.Count() == 81)
            return new Result(null, true, false, true, true, null);

        if (this._totalNumberOfItemsPossibleToSet == 0)
            return new Result(null, false, false, true, false, null);

        this.FillCellsRemainToSet();

        while (((originalData.Count() + maxNumberOfItemsSetInATry) < 81) && (numberOfTries < maxNumberOfTries)) {
            numberOfTries++;

            if (numberOfTries > 1) {
                this.Init();
                this.SetData(data);
                this.SetData(this._dataSetBeforeSimulationHasBeenDone);
                this.FillCellsRemainToSet();
            }

            atLeastOneItemSet = true;

            while ((this._cellsRemainToSet.Count() > 0) && atLeastOneItemSet) {
                atLeastOneItemSet = this.LoopThroughListWithCellsThatRemainToSet();

                if (!atLeastOneItemSet && (this._totalNumberOfItemsPossibleToSet > 0)) {
                    this.SimulateOneItem();
                    atLeastOneItemSet = true;
                }
            }
              
            if ((81 - originalData.Count() - this._cellsRemainToSet.Count()) > maxNumberOfItemsSetInATry) {
                maxNumberOfItemsSetInATry = 81 - originalData.Count() - this._cellsRemainToSet.Count();
                setData = this.ReturnArrayListWithSetData();
            }
        }
        
        if ((originalData.Count() + maxNumberOfItemsSetInATry) < 81) {
            return new Sudoku.Result(null, false, true, false, false, setData);
        }
        else {
            return new Sudoku.Result(null, false, false, false, true, setData);
        }
    }
}

window.Sudoku.makeSudokuSquares = function () {
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

window.Sudoku.solve = function () {
    var errorNotFound, r, c, n, selector, errorMessage, sudokuBoard, result;

    window.Sudoku.originalData = new Sudoku.ArrayList();

    errorNotFound = true;
    r = 1;
    while ((r <= 9) && errorNotFound) {
        c = 1;
        while ((c <= 9) && errorNotFound) {
            selector = "#sqr" + r.toString() + "c" + c.toString();
            str = $(selector).val().trim();

            if (str === "") {
                n = 0;
            }
            else if ((str !== "") && (window.isNaN(str))) {
                errorMessage = "The value given in row " + r.toString() + " and column " + c.toString() + " is not an integer between 1 and 9!";
                errorNotFound = false;
            }
            else {
                n = window.parseFloat(str);

                if ((n < 1) || (n > 9) || (Math.ceil(n) != n)) {
                    errorMessage = "The value given in row " + r.toString() + " and column " + c.toString() + " is not an integer between 1 and 9!";
                    errorNotFound = false;
                }
                else {
                    window.Sudoku.originalData.Add(new Sudoku.ThreeTupleOfIntegers(r - 1, c - 1, n));
                }
            }
            c++;
        }
        r++
    }

    if (errorNotFound) {
        sudokuBoard = new window.Sudoku.SudokuBoard();
        result = sudokuBoard.Process(window.Sudoku.originalData, 25);

        if (result.errorMessage != null) {
            alert(result.errorMessage);
        }
        else if (result.nothingSolved) {
            alert("Unable to solve this sudoku!");
        }
        else if (result.solvedAlready) {
            alert("Solved already!");
        }
        else {
            for (i = 0; i < window.Sudoku.originalData.Count(); i++) {
                r = 1 + window.Sudoku.originalData.Index(i).x;
                c = 1 + window.Sudoku.originalData.Index(i).y;
                $("#sqr" + r.toString() + "c" + c.toString()).addClass("startInteger");
            }

            for (i = 0; i < result.setData.Count(); i++) {
                r = 1 + result.setData.Index(i).x;
                c = 1 + result.setData.Index(i).y;
                n = result.setData.Index(i).z;
                $("#sqr" + r.toString() + "c" + c.toString()).val(n.toString());
            }

            if (result.partiallySolved) {
                alert("Unable to completely solve this sudoku!");
            }
            /*else {
                alert("Sudoku solved!");
            }*/

            $("#solveButton").prop("disabled", true);
            $("#solveButton").addClass("greyFontColor");
            $("#newSudokuButton").prop("disabled", false);
            $("#newSudokuButton").removeClass("greyFontColor");
        }
    }
    else {
        alert(errorMessage);
    }
}

window.Sudoku.newSudoku = function () {
    var r, c, element, selector;

    for (i = 0; i < window.Sudoku.originalData.Count(); i++) {
        r = 1 + window.Sudoku.originalData.Index(i).x;
        c = 1 + window.Sudoku.originalData.Index(i).y;
        $("#sqr" + r.toString() + "c" + c.toString()).removeClass("startInteger");
    }

    for (r = 1; r <= 9; r++) {
        for (c = 1; c <= 9; c++) {
            selector = "#sqr" + r.toString() + "c" + c.toString();
            element = $(selector);
            element.prop("readonly", false);
            element.val("");
        }
    }

    $("#newSudokuButton").prop("disabled", true);
    $("#solveButton").prop("disabled", false);

    $("#newSudokuButton").addClass("greyFontColor");
    $("#solveButton").removeClass("greyFontColor");
}