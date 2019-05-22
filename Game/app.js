// [Load] the Modules
const Logger = require("logxyz");
const express = require('express');
const wss = require('ws');

// [Setup] LogXYZ
const LoggerX = new Logger({_Type: Logger.StorageType().ConsoleOnly, _Connection: null});

// [Load] Game Logic
const GL = require("./Logic/GameLogic");
const Game = new GL();

// [Load] Routes
const API_Route = require('./Routes/API');

// [Setup] Express
const app = express();
app.use('/api', API_Route);
app.use(express.static("./Views/"));

// [Setup] WebSocket Server
const wsServer = new wss.Server({
    port: 9000 /* Change to a ENV later **/
})
wsServer.on("connection", HandleWSConnection.bind(this));

// [Setup] TCP Socket Server

// [WebSocket] Handle Connections
function HandleWSConnection(ws)
{
    Game.Tick.on("Update", () =>{
        // Package GameBoard
        let packBoard = {
            GameBoard: Game.GameBoard.Board,
            Signature: null
        }
        ws.send(JSON.stringify(packBoard));
    });

    ws.on("message", (data) => {
        LoggerX.Log({Namespace: "WebSocketServer", Info:`Client Message: ${data}`});
        if(data == "GET_BOARD")
        {
            // Package GameBoard
            let packBoard = {
                GameBoard: Game.GameBoard.Board,
                Signature: null
            }
            ws.send(JSON.stringify(packBoard));
        }
    })
}

// [Express] Game Dashboard Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/Views/dashboard.html");
});

app.get('/debug', (req, res) => {
    res.sendFile(__dirname + "/Views/debugBoard.html");
});

// [Express] Listen
app.listen((process.env.GAME_PORT == undefined) ? 8080 : process.env.GAME_PORT, () => {
    console.log(`Game Dashboard is serving on port: ${(process.env.GAME_PORT == undefined) ? 8080 : process.env.GAME_PORT}`);
});