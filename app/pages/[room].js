import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import Paper from "../components/paper";
import { useRouter } from "next/router";
let socket;

const Room = ({ room }) => {
  const router = useRouter();
  const [zoom,setZoom] = useState(1)
  useEffect(() => {
    socket = io();
    socket.emit("join-room", room);
    socket.on("room-joined",(data)=>{
        setData(data.data)
    })
    socket.on("update-board", (data) => {
      setData(data);
    });
    socket.on("not-found", () => {
      alert("Room Not Found");
      router.push("/");
    });
  }, []);
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({
    title: "",
    description: "",
    sender: "",
  });
  const [curPos, setCurPos] = useState({
    posX: 50,
    posY: 50,
  });
  const [create, setCreate] = useState(false);
  const onEdit = () => {
    setCreate(false);
    socket.emit("post-board", {
      sender: current.sender,
      room: room,
      title: current.title,
      description: current.description,
      sendTime: new Date().getTime(),
      posX: curPos.posX,
      posY: curPos.posY,
    });
    setCurrent({
      title: "",
      description: "",
      sender: "",
    });
  };
  const handleChange = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value);
  };
  const createPaper = (e) => {
    console.log(e.target.className);
    if (e.target.className.indexOf("board") != -1) {
      let bounds = e.target.getBoundingClientRect();
      setCurPos({
        posX: e.clientX - bounds.left,
        posY: e.clientY - bounds.top,
      });
      setCreate(true);
    }
  };
  const clearBoard = () => {
    const key = prompt("Please Enter room key");
    socket.emit("clear-board", {key,room});
    setData([])
  };
  const changeZoom = (val) => {
    if(zoom+val >= 0.1 && zoom+val <= 2){
      setZoom(zoom+val);
    }
  }
  return (
    <Fragment>
      <div className="container">
        <div className="roomTitle">Room: {room}</div>
        <div onClick={()=>{changeZoom(0.1)}}>+</div>
        <div onClick={()=>{changeZoom(-0.1)}}>-</div>
        <div onClick={clearBoard}>Clear</div>
        <div className="preview-board">
          <div className="board" style={{transform:`scale(${zoom})`,height:`${100/zoom}%`,width:`${100/zoom}%`}} onClick={createPaper}>
            {create ? (
              <Paper
                data={current}
                posX={curPos.posX}
                posY={curPos.posY}
                onEdit={onEdit}
                canModify={true}
                handleChange={handleChange}
              />
            ) : null}
            {data.map((el) => {
              return (
                <Paper
                  data={el}
                  posX={el.posX}
                  posY={el.posY}
                  canModify={false}
                />
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-flow: column;
            padding: 2rem;
          }
          .roomTitle {
            font-size: 1.5em;
            text-align: center;
          }
          .preview-board {
            overflow: auto;
            flex: 1;
            padding: 2rem;
            background: grey;
            width: 100%;
            border: 1px solid black;
          }
          .board {
            position: relative;
          }
        `}
      </style>
    </Fragment>
  );
};
export async function getServerSideProps(ctx) {
  return { props: { room: ctx.query.room } };
}

export default Room;
