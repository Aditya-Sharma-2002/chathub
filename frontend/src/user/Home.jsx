import Sidebar from "./Sidebar";
import "./Home.css";
import { io } from "socket.io-client";
import { API } from "../core/api";
import { useEffect, useState, useRef } from "react";
import {
  fetchMessages as fetchMessagesAPI,
  sendMessage as sendMessageAPI,
  getChat,
} from "./apiUser.jsx";

const socket = io(`${API.replace("/api", "")}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId] = useState(
    JSON.parse(localStorage.getItem("token")).user._id
  );
  const [receiverId, setReceiverId] = useState("");
  const [receiver, setReceiver] = useState();
  const [chatId, setChatId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const chatBodyRef = useRef(null);
  const chatEndRef = useRef(null);
  const isFetching = useRef(false);

  // Load chat and then fetch messages
  useEffect(() => {
    const loadChatAndMessages = async () => {
      if (!receiverId) return;

      setMessages([]);
      setPage(1);
      setHasMore(true);

      const chatRes = await getChat(senderId, receiverId);
      if (chatRes.error || !chatRes.chat) {
        console.log("No chat yet between you and this user");
        return;
      }

      setChatId(chatRes.chat._id);
      await loadMessages(chatRes.chat._id, 1);
    };

    loadChatAndMessages();
  }, [receiverId]);

  const loadMessages = async (chatId, pageNum = 1) => {
    if (!chatId || isFetching.current || !hasMore) return;
    isFetching.current = true;

    try {
      const res = await fetchMessagesAPI(chatId, pageNum, 20);
      await console.log(res);
      if (res.error) {
        console.error(res.error);
        return;
      }

      const newMsgs = res.messages.reverse().map((msg) => ({
        ...msg,
        self: msg.sender._id === senderId,
      }));

      if (newMsgs.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const filtered = newMsgs.filter((m) => !existingIds.has(m._id));
        return [...filtered, ...prev];
      });

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

    const newMsg = {
      _id: Date.now().toString(), // temp id for deduplication
      sender: { _id: senderId },
      content: message,
      chat: chatId,
      self: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    try {
      const res = await sendMessageAPI(senderId, receiverId, message);
      if (res.error) console.error("Send message failed:", res.error);
      else if (res.message?.chat) setChatId(res.message.chat);
    } catch (err) {
      console.error("Send message error:", err);
    }

    socket.emit("message", newMsg);
  };

  // Socket listener
  useEffect(() => {
    const tokenUser = JSON.parse(localStorage.getItem("token")).user;

    socket.on("connect", () => {
      socket.emit("join", tokenUser._id);
    });

    /*socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        // skip duplicates by _id
        if (data._id && prev.some((m) => m._id === data._id)) return prev;

        return [
          ...prev,
          {
            ...data,
            self: data.senderId === senderId,
          },
        ];
      });
    });*/

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev; // avoid duplicates
        return [...prev, { ...data, self: data.senderId === senderId }];
      });
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

  // Infinite scroll for older messages
  const handleScroll = () => {
    if (chatBodyRef.current.scrollTop === 0 && hasMore && chatId) {
      loadMessages(chatId, page + 1);
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
                key={msg._id || index}
                className={`chat-message ${msg.self ? "sent" : "received"}`}
              >
                {msg.content}
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
