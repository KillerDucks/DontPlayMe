// This Logic file will handle all game logic and alert the `EventBus` when a change occurs

class GameLogic {
    constructor(_Config = {})
    {
        if(_Config == null || _Config == undefined || _Config.AddonFolder == undefined)
        {
            this._Config = {};
            this.GameBoard = {};
            this._Config.LogXYZEnable = false;

            this._Config.Addon_Local_Load = true; // This is a true JSON file not a module.exports file
            this._Config.Addon_Remote_Load = true; // Remote File must be JSON compliant
            this._Config.Addon_Base_URL = "https://gist.github.com/killerducks/...." // This is the URL of the Base Addon if a local copy does not exist

            this._Config.AddonFolder = "./Addons"; // We will check for existence of the folder in the loader function 
            this._Config.Load_NonBase_Addons = false; // Any Addons that are not `Base` addons will not be loaded if this is false

            // Added other GameBoard Settings [Feature]
            this.GameBoard.Size = 6;

            // Add default configs for remote server stuff

            // console.log(this._Config)
        }
        else
        {
            this._Config = _Config;
        }

        this.Init();
    }

    Init()
    {
        // Chain Load
        this.LoadAddons(); // Change [TODO] [Possible_Okay]
        this.CreateInitBoard();
        // Check if the board is built correctly
        if(this.GameBoard.Size == -1)
        {
            console.log("\n\n\nFailed to Init Board!!!!!!!!!!!!!!!!!!!!!\n\n\n");
            // Just die here [TODO]
            process.exit(0);
        }
        // Populate the Board with tiles
        this.PopulateBoard();
    }

    LoadAddons()
    {
        // Fixes these Metrics [TODO]
        let loadStatus = {
            "Number_Of_Addons_Loaded" : 0,
            "Number_Of_Addons_Failed": 0,
            "Name_Of_Loaded_Addons": []
        };

        let tiles = [];

        // Load Addons from the chosen media
        if(this._Config.Addon_Local_Load)
        {
            const fs = require('fs');
            // Check if the dir exists
            if(fs.existsSync(this._Config.AddonFolder))
            {
                // Folder Exists
                console.log("Addons Folder Found\n");
                // Check for JSON files
                let scanForFolders = fs.readdirSync(this._Config.AddonFolder + '/');
                // console.log("Addon Packs Found:" + scanForFolders)
                let files = new Array();
                if(scanForFolders.length != 0)
                {
                    // Scan for Addon Packs
                    for (const folder in scanForFolders) {
                        let scanForFile = fs.readdirSync(this._Config.AddonFolder + '/' + scanForFolders[folder]);
                        // Load Full Paths for Addon Files
                        scanForFile.forEach((file) => {
                            files.push(`${this._Config.AddonFolder}/${scanForFolders[folder]}/${file}`);
                        });
                    }
                    // console.log("Addons Preparing to load: " + files);

                    // Attempt to read the JSON
                    files.forEach((file) =>{
                        try {
                            let addonTiles = fs.readFileSync(file, { encoding: "utf-8"});
                            // console.log("Loaded:\t" + file)
                            // Try to Parse into JSON
                            try {
                                addonTiles = JSON.parse(addonTiles);
                                console.log(`Successfully Loaded the Data from Addon File ${file}`);
                                console.log(`Addon Author: ${addonTiles.Metadata.Author}\n`);
                                // At some point check Addon Signatures [TODO]

                                // Push the Loaded Tiles on to the Stack
                                addonTiles.Tiles.forEach((tile) => {
                                    tiles.push(tile); 
                                });                                
                                loadStatus.Number_Of_Loaded_Addons++;
                            } catch (err)
                            {
                                if(err)
                                {
                                    // console.log(`Could not Load the Data from Addon File ${file}\n`);
                                    loadStatus.Number_Of_Addons_Failed++;
                                }
                            }
                        } catch (error) {
                            // console.log(`Could not Read the Addon File ${file}\n`);
                            loadStatus.Number_Of_Addons_Failed++;
                        }
                    });
                }
                else
                {
                    // No Addons Exist
                    console.log("No Addons Found");
                    return -1;
                }
            }
            else
            {
                // Folder does not exist
                console.log("Folder Not Found");
            }
        }

        if(this._Config.Addon_Remote_Load)
        {
            // Feature to be implemented [TODO] [Feature]
        }

        this.GameBoard.Tiles = tiles;

        // console.log(`Total Loaded Addons: ${loadStatus.Number_Of_Addons_Loaded}`) // Part of the Metrics Fix [TODO]
        return (tiles.length == 0) ? -1 : tiles;
    }

    CreateInitBoard()
    {
        const gameBoardSize = this.GameBoard.Size;
        let gameBoard = new Array();
        for (let i = 0; i < gameBoardSize; i++) {
            gameBoard[i] = new Array();
            for (let x = 0; x < gameBoardSize; x++) {
                // Initialize Each Tile
                gameBoard[i][x] = {
                    ID: `[${i}][${x}]`,
                    UUID: this.GenerateUID(),
                    Tile: {
                        Type: "Blank_Space",
                        ID: "0",
                        Populated: false,
                        Players: null
                    }
                };
            }
        }

        // Scope the Board to the Class instance
        (gameBoard.length == 0) ? this.GameBoard.Board = -1 : this.GameBoard.Board = gameBoard;
        console.log("Board Built");
        return (gameBoard.length == 0) ? -1 : 1; // Sort out a consistent exit status [TODO]
    }

    PopulateBoard()
    {
        // See how many tiles we have
        console.debug("Number of Tiles Available:\t" + this.GameBoard.Tiles.length); // [DEBUG]
        console.debug("Number of Board Tiles:\t" + this.GameBoard.Board.length * this.GameBoard.Size); // [DEBUG]
        // Simple Population
        this.GameBoard.Board.forEach((col) =>{
            // Get Board Elements
            col.forEach((element) => {
                // console.log(element) // [DEBUG]
                // console.log('\n'); // [DEBUG]
                // Populate Current Element
                let sticky = this.GameBoard.Tiles[this.RandomNumber()];

                element.Tile.Type = sticky.Type;
                element.Tile.ID = sticky.ID;
                // console.log(element); // [DEBUG]
                // console.log('\n'); // [DEBUG]
            });
        });

        console.log("The Board has been populated");
    }

    // Utils [TODO] Possibly Move to a new file
    GenerateUID()
    {
        let result, i, j;
        result = '';
        for(j=0; j<32; j++) {
            if( j == 8 || j == 12 || j == 16 || j == 20) 
            result = result;
            i = Math.floor(Math.random()*16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    }

    RandomNumber()
    {
        // This will generate a random number with a max of the current loaded tiles
        // [TODO] Move this to a Dedicated RNG Server?
        return Math.floor(Math.random() * (+ this.GameBoard.Tiles.length - +1)) + +1; // Change Min to `1` to prevent generation of blank spaces
    }
}

module.exports = GameLogic; 