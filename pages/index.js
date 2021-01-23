import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
let socket;
const Home = () => {
  const router = useRouter();
  useEffect(() => {
    socket = io();
    socket.on("room-joined", (data) => {
      router.push(`/${data.room}`);
    });
  }, []);
  const [room, setRoom] = useState("");
  const handleChange = (e) => {
    setRoom(e.target.value);
  };
  const handleJoinRoom = () => {
    if (room != "") {
      socket.emit("join-room", room);
    }
  };
  return (
    <Fragment>
      <div className="container">
        <div className="title">Join Room</div>
        <input type="text" onChange={handleChange} value={room} name="room" /><br/>
        <button onClick={handleJoinRoom}>JOIN</button>
      </div>

      <style jsx>
        {`
          .container {
            padding: 3rem;
          }
          .title {
            font-size: 2rem;
          }
        `}
      </style>
    </Fragment>
  );
};
export default Home;
