import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();
  const typingTimeoutRef = useRef(null);

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      // socket.emit("sendMessage", {
      //   receiverId: chat.receiver.id,
      //   data: res.data,
      // });
    } catch (err) {
      console.log(err);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      // socket.emit("typing", {
      //   receiverId: chat.receiver.id,
      //   senderId: currentUser.id,
      // });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // socket.emit("stopTyping", {
      //   receiverId: chat.receiver.id,
      //   senderId: currentUser.id,
      // });
    }, 1000);
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    // if (chat && socket) {
    //   socket.on("getMessage", (data) => {
    //     if (chat.id === data.chatId) {
    //       setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
    //       read();
    //     }
    //   });
    // 
    //   socket.on("userTyping", (userId) => {
    //     if (userId === chat.receiver.id) {
    //       setTyping(true);
    //     }
    //   });
    // 
    //   socket.on("userStoppedTyping", (userId) => {
    //     if (userId === chat.receiver.id) {
    //       setTyping(false);
    //     }
    //   });
    // }
    // return () => {
    //   socket.off("getMessage");
    //   socket.off("userTyping");
    //   socket.off("userStoppedTyping");
    // };
  }, [socket, chat]);

  return (
    <div className="flex gap-5 h-full min-h-[500px] bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Left: chat list */}
      <div className="flex-1 p-5 overflow-y-auto border-r border-gray-100">
        <h1 className="text-2xl mb-5 text-[#2c3e50] font-semibold">Messages</h1>
        {chats?.length > 0 ? (
          chats.map((c) => (
            <div
              className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 relative mb-2.5 hover:bg-gray-50 hover:-translate-y-0.5"
              key={c.id}
              style={{ backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id ? 'white' : '#fecd514e' }}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" className="w-[50px] h-[50px] rounded-full object-cover" />
              <div className="flex-1 overflow-hidden">
                <span className="font-semibold text-[#2c3e50] block mb-1">{c.receiver.username}</span>
                <p className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{c.lastMessage}</p>
              </div>
              {!c.seenBy.includes(currentUser.id) && chat?.id !== c.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute top-4 right-4"></div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-300">
            <i className="fas fa-comments text-5xl mb-4"></i>
            <p className="text-lg">No messages yet</p>
          </div>
        )}
      </div>

      {/* Right: chat box */}
      {chat && (
        <div className="flex-[2] flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-semibold text-[#2c3e50]">{chat.receiver.username}</span>
            </div>
            <span className="cursor-pointer text-gray-400 hover:text-red-400 transition-colors" onClick={() => setChat(null)}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
            {chat.messages.length > 0 ? (
              chat.messages.map((message) => (
                <div
                  className={`max-w-[70%] p-3 rounded-[15px] flex flex-col gap-1 ${
                    message.userId === currentUser.id
                      ? 'self-end bg-blue-500 text-white rounded-br-[5px]'
                      : 'self-start bg-gray-50 rounded-bl-[5px]'
                  }`}
                  key={message.id}
                >
                  <p className="m-0 leading-[1.4]">{message.text}</p>
                  <span className={`text-xs self-end ${ message.userId === currentUser.id ? 'text-blue-200' : 'text-gray-400' }`}>{format(message.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <i className="fas fa-comments text-5xl mb-4"></i>
                <p className="text-lg">No messages in this chat yet</p>
              </div>
            )}
            {typing && (
              <div className="flex gap-1 p-3 bg-gray-100 rounded-2xl w-fit">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex gap-3">
            <textarea
              name="text"
              placeholder="Type a message..."
              onKeyDown={handleTyping}
              className="flex-1 p-3 border border-gray-200 rounded-lg resize-none h-12 focus:outline-none focus:border-blue-400"
            ></textarea>
            <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
