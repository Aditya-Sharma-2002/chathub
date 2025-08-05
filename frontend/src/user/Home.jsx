import Sidebar from "./Sidebar";
import "./Home.css";
import { io } from "socket.io-client";
import { API } from "../core/api";
import { useEffect, useState, useRef } from "react";
import {
  fetchMessages as fetchMessagesAPI,
  sendMessage as sendMessageAPI,
} from "./apiUser.jsx";

const socket = io(`${API.replace("/api", "")}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState(
    JSON.parse(localStorage.getItem("token")).user._id
  );
  const [receiverId, setReceiverId] = useState("");
  const [receiver, setReceiver] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const chatBodyRef = useRef(null);
  const chatEndRef = useRef(null);
  const isFetching = useRef(false);

  // Fetch messages for pagination
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

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.length || !receiverId) return;

    const newMsg = { senderId, receiverId, text: message, self: true };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);

    try {
      // Save to DB
      const res = await sendMessageAPI(senderId, receiverId, message);
      if (res.error) {
        console.error("Send message failed:", res.error);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }

    // Send via socket
    socket.emit("message", newMsg);

    setMessage("");
  };

  // Setup socket connection
  useEffect(() => {
    const tokenUser = JSON.parse(localStorage.getItem("token")).user;

    socket.on("connect", () => {
      socket.emit("join", tokenUser._id);
      setSenderId(tokenUser._id);
    });

    socket.on("receiveMessage", (data) => {
      // Prevent duplicate self-messages (already optimistically added)
      if (data.senderId === senderId) return;

      setMessages((prev) => [
        ...prev,
        { ...data, self: data.senderId === senderId },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, [senderId]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when receiver changes
  useEffect(() => {
    if (receiverId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      loadMessages(receiverId, 1);
    }
  }, [receiverId]);

  // Infinite scroll for older messages
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
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
