const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let game ={
  players:{},
  rooms:{}
}

const http = require("http").Server(app);
const cors = require("cors");

const sockets = require("socket.io")(http, {
  cors: {
    origin: "<http://localhost:3000>"
  }
});

sockets.on("connection", (socket) => {
  console.log(socket.id + 'connectouu')

  refreshRooms()

  socket.on('createRoom', ()=>{
    socket.join(socket.id)

    game.rooms[socket.id] = {
      nameRoom : `Sala #${Math.trunc((Math.random()*100000))}`,
      roomId:socket.id,
      createBy:socket.id,
      player1:socket.id,
      player2:null
    }
    refreshRooms()
    // console.log(socket.rooms)
    // console.log(game.rooms)
  })

  socket.on('joinRoom', (roomId) =>{
    if(roomId===socket.id){
      console.log("Cliente não pode dar joinn em sala criada por ele!!")
      refreshRooms()
    }
    else{
      
      const position = game.rooms[roomId]?.player1 ? '2' : '1';
      game.rooms[roomId][`player${position}`] = socket.id;
    
      // console.log(game.rooms)d
      socket.join(roomId)
      refreshRooms()
      console.log(socket.rooms)
      // console.log(game.rooms)
    }
  })

  socket.on('leaveRoom', (roomId, player)=>{
    console.log('-------')
    console.log(roomId)
    console.log(player)
    console.log('-------')
    socket.leave(roomId)

    console.log(socket.rooms)

    refreshRooms()
    refreshClientsConnected() 
  })

  socket.on('disconnect', () =>{
    delete game.players[socket.id]
    delete game.rooms[socket.id]
    refreshClientsConnected()
    refreshRooms()
    console.log("Usuário se desconectou...")
  });
});


function refreshRooms(){
  sockets.emit('Rooms', game.rooms)
}
function refreshClientsConnected(){
  sockets.emit("PlayersConnect", game.players);
}


app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Worldsd")
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
