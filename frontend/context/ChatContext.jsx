import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      // console.log("hello this is users: ",data.user);
      
      if (data.success) {
        setUsers(data.user);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch messages");
    }
  };

  const sendMessage = async (messageData) => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    }
  };

const subscribeToMessages = () => {
  if (!socket) return;

  // Prevent multiple subscriptions (optional but recommended)
  socket.off("newMessage");

  socket.on("newMessage", async (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;

      setMessages((prev) => [...prev, newMessage]);

      try {
        await axios.put(`/api/messages/mark/${newMessage._id}`);
      } catch (err) {
        console.error("Failed to mark message as seen", err);
      }
    } else {
      setUnseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: prev?.[newMessage.senderId]
          ? prev[newMessage.senderId] + 1
          : 1,
      }));
    }
  });
};

  const unsubscribeFromMessages = () => {
    socket?.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const two = 3;
  const value = {
    two,
    users,
    messages,
    selectedUser,
    unseenMessages,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
