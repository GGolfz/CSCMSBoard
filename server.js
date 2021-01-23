const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
let port = 3000;
const boardData = Object();
io.on("connect", (socket) => {
  socket.on("join-room", async (room) => {
    if (Object.keys(boardData).includes(room)) {
      socket.join(room);
      socket.emit("room-joined", { room: room, data: boardData[room].data });
    } else {
      socket.emit("not-found");
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("force-disconnect", () => {
    socket.disconnect();
  });
  socket.on("create-room", (data) => {
    if (Object.keys(boardData).includes(data.room)) {
      socket.emit("already");
    } else {
      boardData[data.room] = { data: [], key: data.key };
      socket.emit("create-success", data.room);
    }
  });
  socket.on("clear-board", (data) => {
    if (Object.keys(boardData).includes(data.room)) {
      if (boardData[data.room].key === data.key) {
        boardData[data.room].data = [];
        socket.to(room).emit("update-board", []);
      }
    }
  });
  socket.on("post-board", (data) => {
    const { room } = data;
    boardData[room].data.push(data);
    console.log(boardData[room].data);
    io.to(room).emit("update-board", boardData[room].data);
  });
});
nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
