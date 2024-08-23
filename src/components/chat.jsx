import React, { useState, useEffect } from 'react';
import { fetchMessages, createMessage, deleteMessage } from '../services/apiService';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');
  const userId = 1; 

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(token);
      setMessages(fetchedMessages);
    };
    loadMessages();
  }, [token]);

  const handleCreateMessage = async () => {
    if (newMessage.trim()) {
      await createMessage(token, newMessage);
      setNewMessage('');
      const fetchedMessages = await fetchMessages(token);
      setMessages(fetchedMessages);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    await deleteMessage(token, msgId);
    const fetchedMessages = await fetchMessages(token);
    setMessages(fetchedMessages);
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start' }}>
            <p>{msg.content}</p>
            {msg.userId === userId && <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleCreateMessage}>Send</button>
    </div>
  );
}

export default Chat;
