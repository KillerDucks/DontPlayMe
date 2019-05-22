// This is a Browser JS File
// [TODO] Fix the Player image sticking on Tiles a Player has died

$(() => {
    const socket = new WebSocket("ws://localhost:9000");
    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('HELLO_SERVER');
        socket.send('GET_BOARD');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        if(event.data.substr(0, 1) == "{")
        {
            // console.log(JSON.parse(event.data).GameBoard);
            let packedBoard = JSON.parse(event.data);
            // Use Detection later
            // Create a table !!!!
            let htmlTable = CreateTable(packedBoard.GameBoard);
            console.info("Table Rendered");
            // $(".GameBoard").;
            $(".GameBoard").html(htmlTable);
        }
        else
        {
            $(".Transcript").append("<div id='event'>" + event.data + "</div>");
            // let elem = document.getElementsByClassName('Transcript');
            // elem.scrollTop = elem.scrollHeight;
            // scroll();
            let pbox = $('.Transcript');
            var height = pbox.scrollTop() + pbox.height() + $('Transcript').filter('.event:last').scrollTop();
            pbox.animate({'scrollTop' : height}, 500);
            console.log(event.data);
        }
    });

    function CreateTable(GameBoard)
    {
        let tableGen = ""
        GameBoard.forEach(col => {
            // console.log(`Column: ${col[0].ID.substr(1,1)}`);
            tableGen += `<tr>`;
            col.forEach(row => {
                // console.log(row.Tile.Players.length);
                if(row.Tile.Players.length == 0)
                {
                    tableGen += `<td><img src="./IMG/${row.Tile.Type}_${row.Tile.ID}.jpg"></td>`;
                }
                else
                {
                    tableGen += `<td><img src="./IMG/Player_0.jpg"></td>`;
                }
            });
            tableGen += "</tr>";
        });
        // console.log(`<table>${tableGen}</table>`)
        console.info("Table Built");
        return `<table align="center" class="table">${tableGen}</table>`;
    }
})