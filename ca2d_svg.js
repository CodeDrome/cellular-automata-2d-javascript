
class CellularAutomaton2DSVG
{
    constructor(SVGID, CA)
    {
        this._SVGID = SVGID;
        this._CA = CA;
        this._CellSize = 8;
        this._CellZeroColor = "#000000";
        this._CellOneColor = "#FFFFFF";
        this._GridColor = "#FF0000";
        this._ShowGrid = false;
        this._Width = 0;
        this._Height = 0;
        this._CellElements = null;

        this._CA.StateChangedEventHandlers.push((changed) =>
        {
            this._DrawState(changed);
        });

        this._CA.NumberOfColumnsOrRowsChangedEventHandlers.push(() =>
        {
            this._SetHeightAndWidth(this._CellSize * this._CA.NumberOfRows, this._CellSize * this._CA.NumberOfColumns);
            this._DrawGridAndCells();
        });
    }

    //---------------------------------------------------
    // PROPERTIES
    //---------------------------------------------------

	get CellSize() { return this._CellSize; }
	set CellSize(CellSize) { this._CellSize = CellSize; }

	get CellZeroColor() { return this._CellZeroColor; }
	set CellZeroColor(CellZeroColor) { this._CellZeroColor = CellZeroColor; }

	get CellOneColor() { return this._CellOneColor; }
	set CellOneColor(CellOneColor) { this._CellOneColor = CellOneColor; }

	get GridColor() { return this._GridColor; }
	set GridColor(GridColor) { this._GridColor = GridColor; }

	get ShowGrid() { return this._ShowGrid; }
	set ShowGrid(ShowGrid) { this._ShowGrid = ShowGrid; }

    //---------------------------------------------------
    // METHODS
    //---------------------------------------------------

    _DrawState(changed)
    {
        for(let i = 0, l = changed.length; i < l; i++)
        {
        	if(changed[i].State === 0)
        	{
        		this._CellElements[changed[i].c][changed[i].r].setAttributeNS(null, 'style', "fill:" + this._CellZeroColor + "; stroke:" + this._CellZeroColor + ";");
        	}
        	else if(changed[i].State === 1)
        	{
        		this._CellElements[changed[i].c][changed[i].r].setAttributeNS(null, 'style', "fill:" + this._CellOneColor + "; stroke:" + this._CellOneColor + ";");
        	}
        }
    }

    _DrawGridAndCells()
    {
    	this._MoveToCentre();

    	// Variable declarations
        let x = 0;
        let y = 0;
        let line;

        // Create and initialize CellElements array
        this._CellElements = [];
        for(let c = 0; c < this._CA.NumberOfColumns; c++)
        {
        	this._CellElements[c] = [];
        }

        // Remove existing stuff
        document.getElementById(this._SVGID).innerHTML = "";

        if(this._ShowGrid === true)
        {
        	// Vertical lines
        	for (let v = 0; v <= this._CA.NumberOfColumns; v++)
        	{
            	line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    			line.setAttributeNS(null, "x1", x);
    			line.setAttributeNS(null, "y1", 0);
    			line.setAttributeNS(null, "x2", x);
    			line.setAttributeNS(null, "y2", Height);

    			line.setAttributeNS(null, "style", "fill:" + this._GridColor + "; stroke:" + this._GridColor + "; stroke-width: 1px;");

    			document.getElementById(this._SVGID).appendChild(line);

    			x += this._CellSize;
        	}

        	// Horizontal lines
        	for (let h = 0; h <= this._CA.NumberOfRows; h++)
        	{
            	line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    			line.setAttributeNS(null, "x1", 0);
    			line.setAttributeNS(null, "y1", y);
    			line.setAttributeNS(null, "x2", Width);
    			line.setAttributeNS(null, "y2", y);

    			line.setAttributeNS(null, "style", "fill:" + this._GridColor + "; stroke:" + this._GridColor + "; stroke-width: 1px;");

    			document.getElementById(this._SVGID).appendChild(line);

    			y += this._CellSize;
        	}
        }

        x = 0;
        y = 0;

        let GridSpacing;
        if(this._ShowGrid)
        	GridSpacing = 1;
        else
        	GridSpacing = 0;

        // Cells
        for(let c = 0; c < this._CA.NumberOfColumns; c++)
        {
        	for(let r = 0; r < this._CA.NumberOfRows; r++)
        	{
        		this._CellElements[c][r] = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    			this._CellElements[c][r].setAttributeNS(null, 'x', x + GridSpacing);
    			this._CellElements[c][r].setAttributeNS(null, 'y', y + GridSpacing);
    			this._CellElements[c][r].setAttributeNS(null, 'height', this._CellSize - (GridSpacing * 2));
    			this._CellElements[c][r].setAttributeNS(null, 'width', this._CellSize - (GridSpacing * 2));
    			this._CellElements[c][r].setAttributeNS(null, "style", "fill:" + this._CellZeroColor + "; stroke:" + this._CellZeroColor	 + "; stroke-width: 1px;");

    			this._CellElements[c][r].setAttributeNS(null, "class", "CACell");
    			this._CellElements[c][r].setAttributeNS(null, "data-row", r);
    			this._CellElements[c][r].setAttributeNS(null, "data-column", c);

    			document.getElementById(this._SVGID).appendChild(this._CellElements[c][r]);

    			y += this._CellSize;
        	}

        	x += this._CellSize;
        	y = 0;
        }

        let cells = document.getElementsByClassName("CACell");
        for(let i = 0, l = cells.length; i < l; i++)
        {
            cells[i].onclick = function()
            {
        	    let Row = this.getAttribute("data-row");
        	    let Column = this.getAttribute("data-column");

        	    FireCellClickedEvent(Row, Column);
            };
        }
    }

    _SetHeightAndWidth(height, width)
    {
    	this._Height = height;
        document.getElementById(this._SVGID).setAttribute("height", height);

    	this._Width = width;
        document.getElementById(this._SVGID).setAttribute("width", width);
    }

    _MoveToCentre(height, width)
    {
        let SVGDivWidth = document.getElementById("svgdiv").offsetWidth;
        let SVGDivHeight = document.getElementById("svgdiv").offsetHeight;

        let SVGDivLeft = (SVGDivWidth / 2) - (this._Width / 2);
        let SVGDivTop = (SVGDivHeight / 2) - (this._Height / 2);

        document.getElementById(this._SVGID).style.top = SVGDivTop + 'px';
        document.getElementById(this._SVGID).style.left = SVGDivLeft + 'px';
    }
}
