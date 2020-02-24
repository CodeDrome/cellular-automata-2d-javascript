
class CellularAutomaton2D
{
    constructor()
    {
        this._CurrentState; // [row][column]
        this._NumberOfColumns = 128;
        this._NumberOfRows = 128;
        this._RuleTable = null;
        this._Initialized = false;
        this._Running = false;
	    this._Timer = null;
	    this._Generation = null;
	    this._SVG = null;
        this._StateChangedEventHandlers = [];
        this._GenerationChangedEventHandlers = [];
        this._NumberOfColumnsOrRowsChangedEventHandlers = [];

        this._InitializeRuleTable();
    }

    //---------------------------------------------------
    // PROPERTIES
    //---------------------------------------------------

	get StateChangedEventHandlers() { return this._StateChangedEventHandlers; }

	get GenerationChangedEventHandlers() { return this._GenerationChangedEventHandlers; }

	get NumberOfColumnsOrRowsChangedEventHandlers() { return this._NumberOfColumnsOrRowsChangedEventHandlers; }

	get RuleTable() { return this._RuleTable; }

	get NumberOfRows() { return this._NumberOfRows; }

	get NumberOfColumns() { return this._NumberOfColumns; }

    //---------------------------------------------------
    // METHODS
    //---------------------------------------------------

    _FireStateChangedEvent(changed)
    {
        this._StateChangedEventHandlers.every(function (Handler) { Handler(changed); });
    }

    _FireGenerationChangedEvent(GenerationDetails)
    {
        this._GenerationChangedEventHandlers.every(function (Handler) { Handler(GenerationDetails); });
    }

    _FireNumberOfColumnsOrRowsChangedEvent()
    {
        this._NumberOfColumnsOrRowsChangedEventHandlers.every(function (Handler) { Handler(); });
    }

    _InitializeArrays()
    {
    	this._CurrentState = [];

    	for(let r = 0; r < this._NumberOfRows; r++)
    	{
    		this._CurrentState[r] = [];

    		for(let c = 0; c < this._NumberOfColumns; c++)
    		{
    			this._CurrentState[r][c] = 0;
    		}
    	}

    	this._Initialized = true;
    }

    _InitializeRuleTable()
    {
    	this._RuleTable = [];

    	this._RuleTable[0] =  {Neighbours: 0, Current: 0, Next: 0};
    	this._RuleTable[1] =  {Neighbours: 1, Current: 0, Next: 0};
    	this._RuleTable[2] =  {Neighbours: 2, Current: 0, Next: 0};
    	this._RuleTable[3] =  {Neighbours: 3, Current: 0, Next: 0};
    	this._RuleTable[4] =  {Neighbours: 4, Current: 0, Next: 0};
    	this._RuleTable[5] =  {Neighbours: 5, Current: 0, Next: 0};
    	this._RuleTable[6] =  {Neighbours: 6, Current: 0, Next: 0};
    	this._RuleTable[7] =  {Neighbours: 7, Current: 0, Next: 0};
    	this._RuleTable[8] =  {Neighbours: 8, Current: 0, Next: 0};

    	this._RuleTable[9] =  {Neighbours: 0, Current: 1, Next: 0};
    	this._RuleTable[10] = {Neighbours: 1, Current: 1, Next: 0};
    	this._RuleTable[11] = {Neighbours: 2, Current: 1, Next: 0};
    	this._RuleTable[12] = {Neighbours: 3, Current: 1, Next: 0};
    	this._RuleTable[13] = {Neighbours: 4, Current: 1, Next: 0};
    	this._RuleTable[14] = {Neighbours: 5, Current: 1, Next: 0};
    	this._RuleTable[15] = {Neighbours: 6, Current: 1, Next: 0};
    	this._RuleTable[16] = {Neighbours: 7, Current: 1, Next: 0};
    	this._RuleTable[17] = {Neighbours: 8, Current: 1, Next: 0};
    }

    _GetNeighbourCount(Row, Column)
    {
    	let NeighbourCount = 0;

    	let RollaroundColumn;
    	let RollaroundRow;

    	for(let r = (Row - 1); r <= (Row + 1); r++)
    	{
    		for(let c = (Column - 1); c <= (Column + 1); c++)
    		{
    			RollaroundColumn = c;
    			RollaroundRow = r;

    			if(RollaroundRow < 0) RollaroundRow = this._NumberOfRows - 1;
    			if(RollaroundRow > (this._NumberOfRows - 1)) RollaroundRow = 0;
    			if(RollaroundColumn < 0) RollaroundColumn = this._NumberOfColumns - 1;
    			if(RollaroundColumn > (this._NumberOfColumns - 1)) RollaroundColumn = 0;

    			if( !(r == Row && c == Column) )
    			{
    				if(this._CurrentState[RollaroundRow][RollaroundColumn] == 1)
    				{
    					NeighbourCount++;
    				}
    			}
    		}
    	}

    	return NeighbourCount;
    }

    SetNumberOfRowsAndColumns(rows, columns)
    {
    	this._NumberOfRows = rows;
    	this._NumberOfColumns = columns;

        this._InitializeArrays();

        this._FireNumberOfColumnsOrRowsChangedEvent();
    }

    InitializeToPercentage(Percentage)
    {
        let NumberToInitialize = Math.round((this._NumberOfRows * this._NumberOfColumns) * (Percentage / 100));

        this.InitializeToCount(NumberToInitialize);
    }

    InitializeToPattern(Pattern)
    {
        let Columns = Pattern[0].length;
		let Rows = Pattern.length;

        if(Columns <= this._NumberOfColumns && Rows <= this._NumberOfRows)
        {
        	let ChangedCells = [];

        	this.InitializeToZero();

			let StartRow = Math.round((this._NumberOfRows / 2) - (Rows / 2));
			let StartColumn = Math.round((this._NumberOfColumns / 2) - (Columns / 2));

			for(let r = 0; r < Rows; r++)
			{
				for(let c = 0; c < Columns; c++)
				{
					this._CurrentState[r + StartRow][c + StartColumn] = Pattern[r][c];

					ChangedCells.push({c:c + StartColumn, r:r + StartRow, State:Pattern[r][c]});
				}
			}

        	this._FireStateChangedEvent(ChangedCells);

        	Generation = 0;

        	this._FireGenerationChangedEvent({Generation: Generation, Born:0, Died:0});
        }
        else
        {
        	alert("Pattern of " + Columns + " columns and " + Rows + " rows is too large for current cellular automaton size");
        }
    }

    InitializeToCount(NumberToInitialize)
    {
        let ChangedCells = [];

        let c;
        let r;

        this._InitializeArrays();

        while(NumberToInitialize > 0)
        {
        	c = Math.floor(Math.random() * this._NumberOfColumns);
        	r = Math.floor(Math.random() * this._NumberOfRows);

        	if(this._CurrentState[r][c] === 0)
        	{
        		this._CurrentState[r][c] = 1;

        		ChangedCells.push({c:c, r:r, State:1});

        		NumberToInitialize--;
        	}
        }

        this._FireStateChangedEvent(ChangedCells);

        this._Generation = 0;

        this._FireGenerationChangedEvent({Generation: this._Generation, Born:0, Died:0});
    }

    _CalculateNextState()
    {
        let ChangedCells = [];

        let NeighbourCount;
        let RuleTableIndex;
        let NextState;

        let Born = 0;
        let Died = 0;

        for(let r = 0; r < this._NumberOfRows; r++)
        {
        	for(let c = 0; c < this._NumberOfColumns; c++)
        	{
        		NeighbourCount = this._GetNeighbourCount(r, c);

        		for(RuleTableIndex = 0; RuleTableIndex <= 17; RuleTableIndex++)
        		{
        			if(this._RuleTable[RuleTableIndex].Neighbours == NeighbourCount && this._RuleTable[RuleTableIndex].Current == this._CurrentState[r][c])
        			{
        				NextState = this._RuleTable[RuleTableIndex].Next;

        				if(NextState != this._CurrentState[r][c])
        				{
        					ChangedCells.push({c:c, r:r, State:NextState});

        					if(NextState === 0)
        					{
        						Died++;
        					}
        					else
        					{
        						Born++;
        					}
        				}
        			}
        		}
        	}
        }

        this._FireStateChangedEvent(ChangedCells);

        this._Generation++;

        this._FireGenerationChangedEvent({Generation: this._Generation, Born: Born, Died: Died});

        if(Born === 0 && Died === 0)
        {
        	clearInterval(this._Timer);
        }

        for(let i = 0, l = ChangedCells.length; i < l; i++)
        {
        	this._CurrentState[ ChangedCells[i].r ][ ChangedCells[i].c ] = ChangedCells[i].State;
        }
    }

    StartStop(DelayInMilliseconds)
    {
    	if(this._Initialized === true)
    	{
    		if(this._Running === false)
    		{
    			let THIS = this;

        		this._Timer = setInterval(function(){ THIS._CalculateNextState(); }, DelayInMilliseconds);

        		this._Running = true;
        	}
        	else
        	{
        		clearInterval(this._Timer);

        		this._Running = false;
        	}
        }
        else
        {
        	alert("Cellular Automaton is not initialized");
        }
    }

    Step()
    {
    	if(this._Initialized === true)
    	{
    		this._CalculateNextState();
        }
        else
        {
        	alert("Cellular Automaton is not initialized");
        }
    }
}
