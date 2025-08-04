import Sidebar from "./Sidebar";
import "./Home.css";
import { io } from "socket.io-client";
import { API } from "../core/api";
import { useEffect, useState, useRef } from "react";
import { fetchMessages as fetchMessagesAPI, sendMessage as sendMessageAPI } from "./apiUser.jsx";

const socket = io.connect(`${API}`);

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiver, setReceiver] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const chatBodyRef = useRef(null);
  const chatEndRef = useRef(null);
  const isFetching = useRef(false);

  const loadMessages = async (chatId, pageNum = 1) => {
    if (!chatId || isFetching.current || !hasMore) return;
    isFetching.current = true;

    try {
      const res = await fetchMessagesAPI(chatId, pageNum, 20);

      if (res.error) {
        console.error(res.error);
        return;
      }

      const newMsgs = res.messages.reverse(); 
      if (newMsgs.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => [...newMsgs, ...prev]);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      isFetching.current = false;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.length || !receiverId) return;

    const newMsg = { senderId, receiverId, text: message, self: true };
    setMessages((prev) => [...prev, newMsg]);

    // send to server DB
    const res = await sendMessageAPI(senderId, receiverId, message);
    if (res.error) {
      console.error("Send message failed:", res.error);
    }

    // also via socket
    socket.emit("message", newMsg);

    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      const tokenUser = JSON.parse(localStorage.getItem("token")).user;
      socket.emit("join", tokenUser._id);
      setSenderId(tokenUser._id);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { ...data, self: false }]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (receiverId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      loadMessages(receiverId, 1);
    }
  }, [receiverId]);

  const handleScroll = () => {
    if (chatBodyRef.current.scrollTop === 0 && hasMore) {
      loadMessages(receiverId, page + 1);
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar
        receiverId={receiverId}
        setReceiverId={setReceiverId}
        receiver={receiver}
        setReceiver={setReceiver}
      />

      {receiver ? (
        <div className="chat-container">
          <div className="chat-header">
            <h3 id="receiver-name">{receiver.name}</h3>
          </div>
          <div
            className="chat-body"
            ref={chatBodyRef}
            onScroll={handleScroll}
            style={{ overflowY: "auto", height: "80vh" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.self ? "sent" : "received"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
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
        </div>
      )}
    </div>
  );
}

export default Home;
