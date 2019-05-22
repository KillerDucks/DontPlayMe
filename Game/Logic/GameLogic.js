// This Logic file will handle all game logic and alert the `EventBus` when a change occurs

const EventEmitter = require('events');

class GameLogic extends EventEmitter{
    constructor(_Config = {})
    {
        super();
        if(_Config == null || _Config == undefined || _Config.AddonFolder == undefined)
        {
            this._Config = {};
            this.GameBoard = {};
            this.Players = [];

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
        // Initialise Player
        this.CreatePlayer();
        // Kick off the Server Ticks
        this.ServerTick();
    }

    ServerTick()
    {
        setInterval(() => {
            // Do Stuff ???? [TODO]
            // Move Players for now (no interaction with chests, damage, etc....);
            this.MovePlayers();
            // Update Board
            this.UpdateBoard();
        }, 1000);
    }

    MovePlayers()
    {
        // Move the player with the appropriate speed [TODO] Single Movement right now
        this.Players.forEach((player) => {

            switch (this.RandomDirection()) {
                case 0:
                    // False move Y
                    // Edge Detection
                    if(player.Position.Y + 1 != this.GameBoard.Size)
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;                      
                        player.Position.Y++;
                    }
                    else
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                    }
                    break;

                case 1:
                    // True move X
                    // Edge Detection
                    if(player.Position.X + 1 != this.GameBoard.Size)
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;        
                        player.Position.X++;
                    }
                    else
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                    }
                    break;

                case 2:
                    // True move X & Y
                    // Edge Detection
                    if(player.Position.X + 1 != this.GameBoard.Size && player.Position.Y + 1 != this.GameBoard.Size)
                    {
                        
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                        player.Position.X++;
                        player.Position.Y++;
                    }
                    else
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                    }
                    break;

                case 3:
                        // False move Y
                        // Edge Detection
                        if(player.Position.Y - 1 != -1)
                        {
                            player.Position.Old[0] = player.Position.X;
                            player.Position.Old[1] = player.Position.Y;
                            player.Position.Y--;
                        }
                        else
                        {
                            player.Position.Old[0] = player.Position.X;
                            player.Position.Old[1] = player.Position.Y;
                        }
                        break;

                case 4:
                    // True move X
                    // Edge Detection
                    if(player.Position.X - 1 != -1)
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;                        
                        player.Position.X--;
                    }
                    else
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                    }
                    break;

                case 5:
                    // True move X & Y
                    // Edge Detection
                    if(player.Position.X - 1 != -1 && player.Position.Y - 1 != -1)
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                        player.Position.X--;
                        player.Position.Y--;
                    }
                    else
                    {
                        player.Position.Old[0] = player.Position.X;
                        player.Position.Old[1] = player.Position.Y;
                    }
                    break;
            
                default:
                    console.log("WOW A RANDOM NUMBER????")
                    break;
            }
        });

    }

    CreatePlayer()
    {
        // This will create a player and will store the player in the Instance of the Class
        let tPlayer = {
            Name: "Elite_Player_" + this.Players.length,
            UUID: this.GenerateUID,
            Position: {
                X: 0,
                Y: 0,
                Old: [0, 0]
            },
            Stats: {
                Health: 100, // Possible to go over 100 :D
                Speed: 1 // This refers to speed per second, so a speed of 1 will mean the player will move 1 tile per second
            },
            Items: [
                {
                    Type: "Weapon",
                    Damage: 10
                }
            ],
            HomeServer: null // This will be populated on a future release [TODO] [Feature]
        }
        console.log(`Player ${tPlayer.Name} Created`);
        this.emit("Transcript", `Player ${tPlayer.Name} Created`);
        this.Players.push(tPlayer);
        // Update the Board with a new Player
        this.UpdateBoard();
    }

    UpdateBoard()
    {
        // This will update the board (Not Generate new sections)
        // Simple implementation [TODO]
        for (let i = 0; i < this.GameBoard.Size; i++) {
            for (let x = 0; x < this.GameBoard.Size; x++) {
                // Check Tile
                this.Players.forEach((player) => {
                    if(player.Position.X == i && player.Position.Y == x)
                    {
                        // Check to see if the player has moved
                        if(player.Position.X == player.Position.Old[0] && player.Position.Y == player.Position.Old[1])
                        {
                            // Player is in the same position
                            console.log(`${player.Name} has not moved from Position (${i},${x})`);
                            this.emit("Transcript", `${player.Name} has not moved from Position (${i},${x})`);
                        }
                        else
                        {
                            // Update the board transcript & the tile
                            this.GameBoard.Board[player.Position.Old[0]][player.Position.Old[1]].Tile.Players.pop();

                            // Check if the player has moved to a interaction tile
                            switch (this.GameBoard.Board[i][x].Tile.ID) {
                                case 1:
                                    // Generate
                                    break;

                                case 2:
                                    // Death
                                    // Kill and Create Player
                                    console.log(`${player.Name} has been killed ☠️`);
                                    this.emit("Transcript", `${player.Name} has been killed ☠️`);
                                    this.Players.pop();
                                    this.GameBoard.Board[i][x].Tile.Players.pop();
                                    this.CreatePlayer();
                                    break;

                                case 3:
                                    // Damage
                                    let damageTaken = this.RandomNumber()
                                    console.log(`${player.Name} has been damaged ⚔️ for ${damageTaken}`);
                                    this.emit("Transcript", `${player.Name} has been damaged ⚔️ for ${damageTaken}`);
                                    player.Stats.Health = player.Stats.Health - damageTaken;
                                    if(player.Stats.Health >= 0)
                                    {
                                        // Kill and Create Player
                                        console.log(`${player.Name} has been killed ☠️`);
                                        this.emit("Transcript", `${player.Name} has been killed ☠️`);
                                        this.Players.pop();
                                        this.GameBoard.Board[i][x].Tile.Players.pop();
                                        this.CreatePlayer();
                                    }
                                    break;

                                case 4:
                                    // Chest
                                    console.log(`${player.Name} has found a chest 📦`);
                                    this.emit("Transcript", `${player.Name} has found a chest 📦`);
                                    break;
                            
                                default:
                                    break;
                            }
                            console.log(`${player.Name} has moved to ${this.GameBoard.Board[i][x].Tile.Type} @ Position (${i},${x})`);
                            this.emit("Transcript", `${player.Name} has moved to ${this.GameBoard.Board[i][x].Tile.Type} @ Position (${i},${x})`);

                            this.GameBoard.Board[i][x].Tile.Players.push(player);
                            this.emit("Update");
                        }                    
                    }
                });
            }
        }
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
                        Players: []
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
                element.Tile.Populated = true;
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

    RandomDirection()
    {
        // This will generate a random number [0 - 6] to decide which direction the player moves
        // [TODO] Move this to a Dedicated RNG Server?
        return Math.floor(Math.random() * (+ 6 - +0)) + +0;
    }

}

module.exports = GameLogic; 