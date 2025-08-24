const Message = require('../model/message');
const Chat = require('../model/chat');
const User = require('../model/user');
let io;
exports.initIO = (ioInstance) => io = ioInstance;

exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;  // default page 1
    const limit = parseInt(req.query.limit) || 20; // default 20 messages
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name username')
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ chat: chatId });
    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // find or create chat between two users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
        isGroupChat: false,
      });
      await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
      await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });
    }

    // create and save message
    const message = await Message.create({
      sender: senderId,
      content: text,
      chat: chat._id,
    });

    // update latest message in chat
    chat.latestMessage = message._id;
    await chat.save();

    // populate sender for frontend convenience
    const populatedMsg = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");

    // emit to the whole chat room (one emit for both users)
    if (req.io) {
      req.io.to(chat._id.toString()).emit("receiveMessage", {
        _id: populatedMsg._id,
        senderId,
        text,
        createdAt: populatedMsg.createdAt,
        chatId: chat._id,
      });
    }

    res.status(201).json(populatedMsg);

  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Look for existing chat
    const chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, friendId] }
    })
    .populate("users", "name username")
    .populate("latestMessage");

     /*if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
        isGroupChat: false
      });
    }*/

    if (!chat) {
      return res.status(404).json({ error: "No chat found" });
    }
    res.json({ chat });
  } catch (err) {
    console.error("Get Chat Error:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};