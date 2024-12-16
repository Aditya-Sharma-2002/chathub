import Sidebar from "./Sidebar";
import "../index.css";
import { logout } from "./apiUser";
import { io } from 'socket.io-client';
import { API } from "../core/api";
import { useEffect } from "react";
const socket = io(`${API}`);

function Home() {
  useEffect(() => {
    // socket.on('connect', () => {
      // console.log(`Socket conected`);
      socket.on('message', (data) => {
        console.log('Message received: ', data);
      });

      return () => {
        socket.off('message');
      }
    // })
    // socket.emit('message', {text : 'Hello World!'});
  },[]);

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome!</h1>
        <p>This is your main content area beside the sidebar.</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
