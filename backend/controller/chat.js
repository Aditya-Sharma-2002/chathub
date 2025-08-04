exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;  // default page 1
    const limit = parseInt(req.query.limit) || 20; // default 20 messages
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name username profile')
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

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // find or create chat between two users
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

    // create message
    const message = new Message({
      sender: senderId,
      content: text,
      chat: chat._id
    });

    await message.save();

    chat.latestMessage = message._id;
    await chat.save();

    // populate sender for response
    const populatedMessage = await message.populate("sender", "name email");

    // emit via socket.io
    req.io.to(receiverId).emit("receiveMessage", {
      senderId,
      text
    });

    return res.status(201).json({ message: populatedMessage });
  } catch (err) {
    console.error("Send Message Error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};