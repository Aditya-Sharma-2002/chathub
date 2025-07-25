import Sidebar from "./Sidebar";
import "./Home.css";
import { logout } from "./apiUser";
import { io } from 'socket.io-client';
import { API } from "../core/api";
import { useEffect, useState } from "react";
const socket = io.connect(`${API}`);

function Home() {
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [receiver, setReceiver] = useState();

  const sendMessage = (e) => {
    e.preventDefault();
    if(!message.length || !receiverId)
      return;
    socket.emit('message', {senderId, receiverId, message});
    setMessage('');
  }

  useEffect(() => {
      socket.on('connect');
      setSenderId(socket.id);
      socket.on('receiveMessage', (message) => {
        console.log(`Message Received : ${message}\nRoom : ${socket.id}`);
      });
      return () => {
        socket.off('connect');
        socket.off('receiveMessage');
      }
  },[]);

  return (
  <div className="app-wrapper">
    <Sidebar receiverId={receiverId} setReceiverId={setReceiverId} receiver={receiver} setReceiver={setReceiver}/>
    {receiver ? (
      <div className="chat-container">
        <div className="chat-header">
          <h3 id="receiver-name">{receiver.name}</h3>
        </div>
        <div className="chat-body" id="chat-body">
          {/* Messages will go here */}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    ) : (
      <div className="chat-container">
        <p>Let's Chat 😊</p>
        <button onClick={logout}>Logout</button>
      </div>
    )}
  </div>
);
}

export default Home;
