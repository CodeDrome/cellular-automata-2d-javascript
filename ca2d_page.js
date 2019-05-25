
let APP =
{
	ca2d: null,
	casvg2d: null,
	ca2drules: null,
	ca2dpatterns: null,
	IsRunning2D: false,
	PresetRulesDropdown: null,
	PresetPatternsDropdown: null
};


window.onload = function()
{
	APP.ca2d = new CellularAutomaton2D();
	APP.casvg2d = new CellularAutomaton2DSVG("CASVG", APP.ca2d);
	APP.ca2drules = new CellularAutomaton2DRules();
	APP.ca2dpatterns = new CellularAutomaton2DPatterns();

	APP.ca2d.SVG = APP.casvg2d;

	PopulateRulesDropdown();

	PopulatePatternsDropdown();

    SetEventHandlers();
};


function PopulateRulesDropdown()
{
	APP.PresetRulesDropdown = new CiJSListBox('PresetRulesDropdown');

	for(let i = 0, l = APP.ca2drules.Rules.length; i < l; i++)
	{
		APP.PresetRulesDropdown.AddItemToEnd(APP.ca2drules.Rules[i].Name, i);
	}
}


function PopulatePatternsDropdown()
{
	APP.PresetPatternsDropdown = new CiJSListBox('PresetPatternsDropdown');

	for(let i = 0, l = APP.ca2dpatterns.Patterns.length; i < l; i++)
	{
		APP.PresetPatternsDropdown.AddItemToEnd(APP.ca2dpatterns.Patterns[i].Name, i);
	}
}


function SetEventHandlers()
{
    document.getElementById("btnInitializeToCount").onclick = function(){InitializeToCount();};
    document.getElementById("btnInitializeToPercentage").onclick = function(){InitializeToPercentage();};
    document.getElementById("btnStartStop").onclick = function(){StartStop();};
    document.getElementById("btnStep").onclick = function(){Step();};

    document.getElementById("colBackgroundColor").onchange = function()
    {
    	document.getElementById("svgdiv").style.background = document.getElementById("colBackgroundColor").value;
    };

    APP.ca2d.GenerationChangedEventHandlers[0] = function (GenerationDetails)
    {
        document.getElementById("GenerationDiv").innerHTML = GenerationDetails.Generation;
        document.getElementById("BornDiv").innerHTML = GenerationDetails.Born;
        document.getElementById("DiedDiv").innerHTML = GenerationDetails.Died;
    };

    document.getElementById("PresetPatternsDropdown").onchange = function()
    {
    	SetPattern();
    };

    document.getElementById("PresetRulesDropdown").onchange = function()
    {
    	SetRule();
    };
}


function SetPropertiesFromForm()
{
	document.getElementById("svgdiv").style.background = document.getElementById("colBackgroundColor").value;

    // CellZeroColor
    let NewCellZeroColor = document.getElementById("colCellZeroColor").value;
    if (NewCellZeroColor !== APP.casvg2d.CellZeroColor)
    {
        APP.casvg2d.CellZeroColor = NewCellZeroColor;
    }

    // CellOneColor
    let NewCellOneColor = document.getElementById("colCellOneColor").value;
    if (NewCellOneColor !== APP.casvg2d.CellOneColor)
    {
        APP.casvg2d.CellOneColor = NewCellOneColor;
    }

    // GridColor
    let NewGridColor = document.getElementById("colGridColor").value;
    if (NewGridColor !== APP.casvg2d.GridColor)
    {
        APP.casvg2d.GridColor = NewGridColor;
    }

    // CellSize
    let NewCellSize = parseInt(document.getElementById("udCellSize").value);
    if(NewCellSize !== APP.casvg2d.CellSize)
    {
        APP.casvg2d.CellSize = NewCellSize;
    }

    // Show Grid
    APP.casvg2d.ShowGrid = document.getElementById('chkShowGrid').checked;

    // Number of rows and columns
    let NewNumberOfColumns = parseInt(document.getElementById("udNumberOfColumns").value);
    let NewNumberOfRows = parseInt(document.getElementById("udNumberOfRows").value);
	APP.ca2d.SetNumberOfRowsAndColumns(NewNumberOfRows, NewNumberOfColumns);

    // DelayInMilliseconds
    let NewDelayInMilliseconds = parseInt(document.getElementById("udDelayInMilliseconds").value);

    if(NewDelayInMilliseconds !== APP.casvg2d.DelayInMilliseconds)
    {
        APP.ca2d.DelayInMilliseconds = NewDelayInMilliseconds;
    }
}


function InitializeToCount()
{
	SetPropertiesFromForm();

	let count = document.getElementById("udInitializeCount").value;

	APP.ca2d.InitializeToCount(count);
}


function InitializeToPercentage()
{
	SetPropertiesFromForm();

	let count = document.getElementById("udInitializePercentage").value;

	APP.ca2d.InitializeToPercentage(count);
}


function SetRule()
{
	let SelectedRuleIndex = APP.PresetRulesDropdown.GetSelectedIndex();

	for(let i = 0; i < 18; i++)
	{
		APP.ca2d.RuleTable[i].Next = APP.ca2drules.Rules[SelectedRuleIndex].Pattern[i];
	}
}


function SetPattern()
{
	SetPropertiesFromForm();

	let SelectedPatternIndex = APP.PresetPatternsDropdown.GetSelectedIndex();

	APP.ca2d.InitializeToPattern(APP.ca2dpatterns.Patterns[SelectedPatternIndex].Pattern);
}


function StartStop()
{
	let delay = document.getElementById("udDelayInMilliseconds").value;

	APP.ca2d.StartStop(delay);
}


function Step()
{
	APP.ca2d.Step();
}
