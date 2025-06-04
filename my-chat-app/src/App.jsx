// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import './App.css';

// // Backend URL - sizning Render deploy qilgan URL
// const socket = io('https://chatbox-3.onrender.com');

// function App() {
//   const [username, setUsername] = useState('');
//   const [joined, setJoined] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const chatBoxRef = useRef(null);

//   const scrollToBottom = () => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
//     const savedUsername = localStorage.getItem('chatUsername');
    
//     if (savedMessages.length > 0) {
//       const last20Messages = savedMessages.slice(-20);
//       setMessages(last20Messages);
//     }
    
//     if (savedUsername) {
//       setUsername(savedUsername);
//       setJoined(true);
//     }

//     // Socket connection events
//     socket.on('connect', () => {
//       console.log('Connected to server');
//       setIsConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//       setIsConnected(false);
//     });

//     // Listen for incoming messages
//     socket.on('message', (msg) => {
//       console.log('Received message:', msg);
//       setMessages(prev => {
//         const newMessages = [...prev, { ...msg, id: Date.now() + Math.random() }];
//         return newMessages.slice(-50); // Keep last 50 messages
//       });
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('message');
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem('chatMessages', JSON.stringify(messages));
//     }
//   }, [messages]);

//   const handleJoin = () => {
//     if (username.trim()) {
//       setJoined(true);
//       localStorage.setItem('chatUsername', username);
      
//       // Send join event to server
//       socket.emit('join', username);
//     }
//   };

//   const handleSend = () => {
//     if (input.trim() && joined) {
//       const newMessage = { 
//         type: 'message', 
//         text: input, 
//         sender: username,
//         time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
//       };
      
//       // Send message to server
//       socket.emit('message', newMessage);
//       setInput('');
//     }
//   };

//   // Chat ni tozalash funksiyasi
//   const clearChat = () => {
//     setMessages([]);
//     localStorage.removeItem('chatMessages');
//   };

//   const leaveChat = () => {
//     setJoined(false);
//     setUsername('');
//     localStorage.removeItem('chatUsername');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const userMessageCount = messages.filter(m => m.type === 'message').length;

//   return (
//     <div className="app-container">
//       <div className="chat-wrapper">
//         {!joined ? (
//           <div className="join-section">
//             <h2 className="join-title">Enter your name</h2>
//             <div className="connection-status">
//               {/* {isConnected ? (
//                 <span className="status-connected">🟢 connecte</span>
//               ) : (
//                 <span className="status-disconnected">🔴 </span>
//               )} */}
//             </div>
//             <div className="join-input-container">
//               <input
//                 type="text"
//                 placeholder="Your name..."
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="join-input"
//                 onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
//                 disabled={!isConnected}
//               />
//               <button 
//                 onClick={handleJoin} 
//                 className="join-button"
//                 disabled={!isConnected || !username.trim()}
//               >
//                 Join Chat
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="chat-header">
//               <h3 className="chat-header-title">
//                 Chat Room ({userMessageCount})
//               </h3>
//               <div className="chat-header-controls">
//                 <span className="connection-indicator">
//                   {isConnected ? '🟢' : '🔴'}
//                 </span>
//                 <span className="chat-header-user">Welcome, {username}!</span>
//                 <button onClick={clearChat} className="control-button clear-btn">
//                   Clear
//                 </button>
//                 <button onClick={leaveChat} className="control-button leave-btn">
//                   Leave
//                 </button>
//               </div>
//             </div>
            
//             <div className="chat-box" ref={chatBoxRef}>
//               {messages.length === 0 ? (
//                 <div className="empty-chat">
//                   <p>No messages yet. Start the conversation!</p>
//                 </div>
//               ) : (
//                 messages.map((msg) => (
//                   msg.type === 'join' ? (
//                     <div key={msg.id || Math.random()} className="join-message">
//                       <span className="join-message-text">{msg.text}</span>
//                       <span className="join-message-time">{msg.time}</span>
//                     </div>
//                   ) : (
//                     <div key={msg.id || Math.random()} className="message-container">
//                       <div className="message-bubble">
//                         <div className="message-header">
//                           <span className="message-sender">{msg.sender}</span>
//                           <span className="message-time">{msg.time}</span>
//                         </div>
//                         <div className="message-text">{msg.text}</div>
//                       </div>
//                     </div>
//                   )
//                 ))
//               )}
//             </div>
            
//             <div className="input-section">
//               <div className="input-container">
//                 <input
//                   type="text"
//                   placeholder={isConnected ? "Type a message..." : "Connecting..."}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="message-input"
//                   disabled={!isConnected}
//                 />
//                 <button 
//                   onClick={handleSend} 
//                   className={`send-button ${input.trim() && isConnected ? 'active' : ''}`}
//                   disabled={!input.trim() || !isConnected}
//                 >
//                   <svg 
//                     width="20" 
//                     height="20" 
//                     viewBox="0 0 24 24" 
//                     fill="none" 
//                     className="send-icon"
//                   >
//                     <path 
//                       d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
//                       stroke="currentColor" 
//                       strokeWidth="2" 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;








import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Backend URL - sizning Render deploy qilgan URL
const socket = io('https://chatbox-3.onrender.com');

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
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

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
      setMessages(prev => {
        const newMessages = [...prev, { ...msg, id: Date.now() + Math.random() }];
        return newMessages.slice(-50);
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
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
      socket.emit('join', username);
    }
  };

  const handleSend = () => {
    if (input.trim() && joined) {
      const newMessage = {
        type: 'message',
        text: input,
        sender: username,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('message', newMessage);
      setInput('');
    }
  };

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

  const userMessageCount = messages.filter(m => m.type === 'message').length;

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
                disabled={!isConnected}
              />
              <button
                onClick={handleJoin}
                className="join-button"
                disabled={!isConnected || !username.trim()}
              >
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
                <span className="connection-indicator">
                  {isConnected ? '🟢' : '🔴'}
                </span>
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
                    <div key={msg.id || Math.random()} className="join-message">
                      <span className="join-message-text">{msg.text}</span>
                      <span className="join-message-time">{msg.time}</span>
                    </div>
                  ) : (
                    <div
                      key={msg.id || Math.random()}
                      className={`message-container ${msg.sender === username ? 'own-message' : 'other-message'}`}
                    >
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
                  placeholder={isConnected ? "Type a message..." : "Connecting..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                  disabled={!isConnected}
                />
                <button
                  onClick={handleSend}
                  className={`send-button ${input.trim() && isConnected ? 'active' : ''}`}
                  disabled={!input.trim() || !isConnected}
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
