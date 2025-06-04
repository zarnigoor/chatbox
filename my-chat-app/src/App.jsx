
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const savedUsername = localStorage.getItem('chatUsername');
    
    if (savedMessages.length > 0) {
      const last20Messages = savedMessages.slice(-20);
      setMessages(last20Messages);
    }
    
    if (savedUsername) {
      setUsername(savedUsername);
      setJoined(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleJoin = () => {
    if (username.trim()) {
      setJoined(true);
      localStorage.setItem('chatUsername', username);
      
      const joinMessage = { 
        type: 'join', 
        text: `${username} joined the chat`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        id: Date.now()
      };
      
      setMessages(prev => {
        const newMessages = [...prev, joinMessage];
        return newMessages.slice(-20);
      });
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { 
        type: 'user', 
        text: input, 
        sender: username,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        id: Date.now()
      };
      
    
      setMessages(prev => [...prev, newMessage]);      
      setInput('');
    }
  };

  // Chat ni tozalash funksiyasi
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const leaveChat = () => {
    setJoined(false);
    setUsername('');
    localStorage.removeItem('chatUsername');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userMessageCount = messages.filter(m => m.type === 'user').length;

  return (
    <div className="app-container">
      <div className="chat-wrapper">
        {!joined ? (
          <div className="join-section">
            <h2 className="join-title">Enter your name</h2>
            <div className="join-input-container">
              <input
                type="text"
                placeholder="Your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="join-input"
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              />
              <button onClick={handleJoin} className="join-button">
                Join Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3 className="chat-header-title">
                Chat Room ({userMessageCount})
              </h3>
              <div className="chat-header-controls">
                <span className="chat-header-user">Welcome, {username}!</span>
                <button onClick={clearChat} className="control-button clear-btn">
                  Clear
                </button>
                <button onClick={leaveChat} className="control-button leave-btn">
                  Leave
                </button>
              </div>
            </div>
            
            <div className="chat-box" ref={chatBoxRef}>
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  msg.type === 'join' ? (
                    <div key={msg.id} className="join-message">
                      <span className="join-message-text">{msg.text}</span>
                      <span className="join-message-time">{msg.time}</span>
                    </div>
                  ) : (
                    <div key={msg.id} className="message-container">
                      <div className="message-bubble">
                        <div className="message-header">
                          <span className="message-sender">{msg.sender}</span>
                          <span className="message-time">{msg.time}</span>
                        </div>
                        <div className="message-text">{msg.text}</div>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
            
            <div className="input-section">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                />
                <button 
                  onClick={handleSend} 
                  className={`send-button ${input.trim() ? 'active' : ''}`}
                  disabled={!input.trim()}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="send-icon"
                  >
                    <path 
                      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
