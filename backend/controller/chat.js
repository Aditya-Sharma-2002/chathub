const Message = require('../model/message');
const Chat = require('../model/chat');
const User = require('../model/user');
let io;
exports.initIO = (ioInstance) => io = ioInstance;

exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log(chatId);
    const page = parseInt(req.query.page) || 1;  // default page 1
    const limit = parseInt(req.query.limit) || 20; // default 20 messages
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name username profile')
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ chat: chatId });
    console.log(messages);
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

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 1. Find or create chat between the two users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
        isGroupChat: false
      });
    }

    // 2. Create and save message
    const message = await Message.create({
      sender: senderId,
      content: text,
      chat: chat._id,
    });

    // 3. Update latest message in chat
    chat.latestMessage = message._id;
    await chat.save();

    // 4. Add each other as friends (no duplicates thanks to $addToSet)
    await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
    await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });

    // 5. Populate sender for client response
    const populatedMessage = await message.populate("sender", "name email profile");

    // 6. Emit message via socket.io if io is attached to req
    if (req.io) {
      [receiverId, senderId].forEach(id => {
        req.io.to(id).emit("receiveMessage", {
          senderId,
          text,
          createdAt: message.createdAt,
          chatId: chat._id
        });
      });
    }

    return res.status(201).json({ message: populatedMessage });
  } catch (err) {
    console.error("Send Message Error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};