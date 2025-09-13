import { useState, useEffect, useRef } from 'react';
import socketService from '../utils/socket';
import { useAuth } from '../hooks/useAuth.jsx';

const Chat = ({ arenaId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    socketService.socket?.on('chat_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socketService.onUserTyping((data) => {
      if (data.userId !== (user?.userId || user?._id)) {
        if (data.isTyping) {
          setTypingUsers(prev => {
            if (!prev.find(u => u.userId === data.userId)) {
              return [...prev, data];
            }
            return prev;
          });
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }
      }
    });

    return () => {
      socketService.socket?.off('chat_message');
      socketService.socket?.off('user_typing');
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketService.sendMessage(
      arenaId,
      user?.userId || user?._id,
      user?.username || 'Anonymous',
      newMessage
    );
    
    // Stop typing indicator
    socketService.stopTyping(
      arenaId,
      user?.userId || user?._id,
      user?.username || 'Anonymous'
    );
    
    setNewMessage('');
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator
    socketService.startTyping(
      arenaId,
      user?.userId || user?._id,
      user?.username || 'Anonymous'
    );
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      socketService.stopTyping(
        arenaId,
        user?.userId || user?._id,
        user?.username || 'Anonymous'
      );
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-80 flex flex-col">
      <div className="bg-primary text-secondary p-3 rounded-t-lg">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="text-xs text-muted">{msg.username}</div>
            <div className="text-sm">{msg.message}</div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="mb-2 text-xs text-muted italic flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            {typingUsers[0].username} is typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:border-primary"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-secondary px-4 py-2 rounded-r-lg hover:bg-accent hover:text-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;