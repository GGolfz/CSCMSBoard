import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
let socket;
const Home = () => {
  const router = useRouter();
  useEffect(() => {
    socket = io();
    socket.on("create-success", (room) => {
      router.push(`/${room}`);
    });
    socket.on("already", () => {
      alert("Already have room");
    });
  }, []);
  const [data, setData] = useState({
    room: "",
    key: "",
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleJoinRoom = () => {
    if (data.key != "" && data.room != "") {
      socket.emit("create-room", data);
    }
  };
  return (
    <Fragment>
      <div className="container">
          <div className="title">
              Create New Room
          </div>
        <label>Room</label>
        <input
          type="text"
          onChange={handleChange}
          value={data.room}
          name="room"
        /><br/>
        <label>Key</label>
        <input
          type="text"
          onChange={handleChange}
          value={data.key}
          name="key"
        /><br/>
        <button onClick={handleJoinRoom}>Create</button>
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
