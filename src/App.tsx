import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

interface Message {
  id: number;
  username: string;
  text: string;
  timestamp: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (username) {
      socketRef.current = io();

      socketRef.current.on('connect', () => {
        console.log('Socket.IO connected');
      });

      socketRef.current.on('chat message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [username]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && socketRef.current) {
      const newMessage: Message = {
        id: Date.now(),
        username,
        text: inputMessage.trim(),
        timestamp: Date.now(),
      };
      socketRef.current.emit('chat message', newMessage);
      setInputMessage('');
    }
  };

  if (!username) {
    return (
      <div className="App">
        <div className="chat-header">
          <h1>Enter your username</h1>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button onClick={() => setUsername(username.trim())}>Join Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.username === username ? 'sent' : 'received'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;