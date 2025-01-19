import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from '@heroicons/react/outline';
import io from "socket.io-client";

const socket = io("http://localhost:5000");
// const socket = io(process.env.REACT_APP_BACKEND_URL);

const App = () => {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Listening for incoming messages
  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off("received-message");
  }, []);

  const handleStartChat = () => {
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }
    setChatActive(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }

    const messageData = {
      message: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  const handleBack = () => {
    setChatActive(false);
    setMessages([]);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      {chatActive ? (
        // Chat Room Section
        <div className="rounded-md p-2 w-full md:w-[80vw] lg:w-[40vw] mx-auto">
          <button
            className="absolute top-3 left-3 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={handleBack}
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <div>
            <div className="overflow-scroll h-[80vh] lg:h-[60vh]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex rounded-md shadow-md my-5 w-fit ${username === message.user && "ml-auto"
                    }`}
                >
                  <div className="bg-purple-500 flex justify-center items-center rounded-l-md">
                    <h3 className="font-bold text-lg px-2">
                      {message.user.charAt(0).toUpperCase()}
                    </h3>
                  </div>
                  <div className="px-2 bg-white rounded-md">
                    <span className="font-bold text-sm block">
                      {message.user}
                    </span>
                    <p className="text-base">{message.message}</p>
                    <h3 className="text-xs text-right">{message.time}</h3>
                  </div>
                </div>
              ))}
            </div>

            <form
              className="flex gap-2 md:gap-3 justify-between"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                placeholder="Write Something..."
                className="w-full rounded-md border-2 outline-none px-3 py-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-700 text-white rounded-md font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Landing Page Section
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl font-semibold">Hello There!👋</h1>
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="textbox" className="font-semibold">

            </label>
            <input
              type="text"
              name="textbox"
              id="textbox"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-center px-4 py-2 border-2 rounded-md outline-none w-72"
              placeholder="Username*"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded-md font-semibold"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
