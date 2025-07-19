import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/chat-app-assets/assets";
import { formatMessageTime } from "../lib/utils.js";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    users = [],
    selectedUser,
    unseenMessages,
    getUsers,
    getMessages,
    sendMessage,
    messages,
    setSelectedUser,
    setUnseenMessages,
    setMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  const handleSendMessages = async (e) => {
    try {
      e.preventDefault();
      if (input.trim() === "") return;
      await sendMessage({ text: input.trim() });
      setInput("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Select a valid image file");
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await sendMessage({ image: reader.result });
        e.target.value = "";
      } catch (err) {
        toast.error("Failed to send image");
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      
      

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-24">
 {messages.map((msg, i) => {
  const isSender = msg.senderId === authUser._id;

  return (
    <div
      key={i}
      className={`flex items-end gap-2 mb-3 ${
        isSender ? "flex-row-reverse" : ""
      }`}
    >
      {/* avatar */}
      <img
        src={
          isSender
            ? authUser?.profilePic || assets.avatar_icon
            : selectedUser?.profilePic || assets.avatar_icon
        }
        alt="avatar"
        className="w-7 rounded-full self-end"
      />

      {/* bubble */}
      <div className="max-w-[60%]">
        {msg.image ? (
          <img
            src={msg.image}
            alt="msg"
            className="w-full rounded-lg border border-gray-700"
          />
        ) : (
          <p
            className={`p-2 rounded-lg break-words text-white ${
              isSender
                ? "bg-violet-500/30 rounded-br-none"
                : "bg-gray-700 rounded-bl-none"
            }`}
          >
            {msg.text}
          </p>
        )}
        {/* timestamp */}
        <p
          className={`mt-1 text-[10px] text-gray-400 ${
            isSender ? "text-right" : "text-left"
          }`}
        >
          {formatMessageTime(msg.createdAt)}
        </p>
      </div>
    </div>
  );
})}


        <div ref={scrollEnd}></div>
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-0  left-0 right-0 flex items-center gap-3 p-3 bg-black">
        <div className="flex-1 flex items-center  bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessages(e) : null
            }
            type="text"
            placeholder="Send the message"
            className="flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image" title="Upload Image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt="gallery"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessages}
          src={assets.send_button}
          className="w-7 cursor-pointer"
          alt="send"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col text-gray-500 bg-white/10 max-md:hidden gap-2 items-center justify-center">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">
        Chat anytime, anywhere
      </p>
    </div>
  );
};

export default ChatContainer;
