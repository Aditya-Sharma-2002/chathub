import Sidebar from "./Sidebar";
import "../index.css";
import { logout } from "./apiUser";
import { io } from 'socket.io-client';
// import { API } from "../core/api";
import { useEffect, useState } from "react";
const socket = io.connect(`http://localhost:8000`);

function Home() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [socketID, setSocketID] = useState('');
  const [receiver, setReceiver] = useState({});
  
  const sendMessage = (e) => {
    e.preventDefault();
    if(!message.length)
      return;
    // console.log(`Room : ${room}\nMessage : ${message}`);    
    socket.emit('message', {room, message});
    // setMessage('');
  }

  useEffect(() => {
      socket.on('connection', () => {
        setSocketID(socket.id);
        // console.log(`Socket id : ${socketID}`);
      });

      socket.on('receiveMessage', (message) => {
        console.log(`Message Received : ${message}\nRoom : ${socket.id}`);
      })

      return () => {
        socket.disconnect();
      }
  },[]);

  return (
    <div>
      <Sidebar receiver={receiver} setReceiver={setReceiver}/>
      <div className="main-content">
        <h1>{socketID}</h1>
        {receiver ? <h4>{receiver.name}</h4> : ''}

        Enter Room :<input type="text" placeholder="Enter room" onChange={(e) => setRoom(e.target.value)}/><br/><br/>
        Enter Text :<input type="text" placeholder="Enter text" onChange={(e) => setMessage(e.target.value)}/><br/>
        <button onClick={(e) => sendMessage(e)}>Send Text</button>
        <p>This is your main content area beside the sidebar.</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
