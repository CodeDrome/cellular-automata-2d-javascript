
class CellularAutomaton2DRules
{
    constructor()
    {
        this._Rules = [];

        this._InitializeRules();
    }

    //---------------------------------------------------
    // PROPERTIES
    //---------------------------------------------------

    get Rules() { return this._Rules; }

    //---------------------------------------------------
    // METHODS
    //---------------------------------------------------

    _InitializeRules()
    {
        // NEIGHBOURS                                                         0 1 2 3 4 5 6 7 8   0 1 2 3 4 5 6 7 8
        // CURRENT                                                            0 0 0 0 0 0 0 0 0   1 1 1 1 1 1 1 1 1
        this._Rules.push({Name: "[no rule]",               			 Pattern:[0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0]});
        this._Rules.push({Name: "Game of Life B3/S23",               Pattern:[0,0,0,1,0,0,0,0,0,  0,0,1,1,0,0,0,0,0]});
        this._Rules.push({Name: "Diamoeba B35678/S34678",            Pattern:[0,0,0,1,0,1,1,1,1,  0,0,0,1,1,0,1,1,1]});
        this._Rules.push({Name: "Seeds B2/S",                        Pattern:[0,0,1,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0]});
        this._Rules.push({Name: "Anneal B4678/S35678",               Pattern:[0,0,0,0,1,0,1,1,1,  0,0,0,1,0,1,1,1,1]});
        this._Rules.push({Name: "Replicator B1357/S1357",            Pattern:[0,1,0,1,0,1,0,1,0,  0,1,0,1,0,1,0,1,0]});
        this._Rules.push({Name: "B25/S4",                            Pattern:[0,0,1,0,0,1,0,0,0,  0,0,0,0,1,0,0,0,0]});
        this._Rules.push({Name: "Life Without Death B3/S012345678",  Pattern:[0,0,0,1,0,0,0,0,0,  1,1,1,1,1,1,1,1,1]});
        this._Rules.push({Name: "34 Life B34/S34",                   Pattern:[0,0,0,1,1,0,0,0,0,  0,0,0,1,1,0,0,0,0]});
        this._Rules.push({Name: "2x2 B36/S125",                      Pattern:[0,0,0,1,0,0,1,0,0,  0,1,1,0,0,1,0,0,0]});
        this._Rules.push({Name: "HighLife B36/S23",                  Pattern:[0,0,0,1,0,0,1,0,0,  0,0,1,1,0,0,0,0,0]});
        this._Rules.push({Name: "Day and Night B3678/S34678",        Pattern:[0,0,0,1,0,0,1,1,1,  0,0,0,1,1,0,1,1,1]});
        this._Rules.push({Name: "Morley B368/S245",                  Pattern:[0,0,0,1,0,0,1,0,1,  0,0,1,0,1,1,0,0,0]});
    }
}
