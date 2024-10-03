import React, { useState, useEffect } from 'react';
import '../css/Chat.css';

const fakeChat = [
  {
    "text": "Tja tja, hur mår du?",
    "avatar": "https://i.pravatar.cc/100?img=14",
    "username": "Johnny",
    "userId": "fakeUser1",
  },
  {
    "text": "Hallå!! Svara då!!",
    "avatar": "https://i.pravatar.cc/100?img=14",
    "username": "Johnny",
    "userId": "fakeUser1",
  },
  {
    "text": "Sover du eller?! 😴",
    "avatar": "https://i.pravatar.cc/100?img=14",
    "username": "Johnny",
    "userId": "fakeUser1",
  }
];

const sanitizeMessage = (message) => {
  const tempElement = document.createElement('div');
  tempElement.innerText = message;
  return tempElement.innerHTML;
};

const Chat = ({ authToken, userId, csrfToken }) => {

  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
      console.log('Meddelanden sparade i localStorage:', chatMessages); 
    }
  }, [chatMessages]);

  useEffect(() => {
    console.log('Användarens authToken:', authToken); 
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const messagesData = await response.json();
        const sanitizedMessages = messagesData.map((msg, index) => ({
          ...msg,
          userId: msg.userId || `temp-${index}`
        }));

        const combinedMessages = [...fakeChat, ...sanitizedMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setChatMessages(combinedMessages);
      } catch (error) {
        setErrorMessage('Kunde inte hämta meddelanden. Vänligen försök igen senare.');
        console.error('Fel vid hämtning av meddelanden:', error);
      }
    };

    fetchChatMessages();
  }, [authToken]);

  const handleSendChatMessage = async () => {
    if (!inputMessage.trim()) return;
    console.log('Användarens authToken:', authToken); 
    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          text: sanitizeMessage(inputMessage),
          userId: userId, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error Details:', errorData);
        throw new Error('Meddelandet kunde inte skickas. Vänligen försök igen.');
      }

      const newMessage = await response.json();
      setChatMessages((prevMessages) => [...prevMessages, { ...newMessage.latestMessage, userId }]);
      setInputMessage(''); 
    } catch (error) {
      setErrorMessage('Meddelandet kunde inte skickas. Vänligen försök igen.');
      console.error('Fel vid sändning av meddelande:', error);
    }
  };

  const handleDeleteChatMessage = async (msgId) => {
    console.log('Deleting message with ID:', msgId); 
    console.log('Användarens authToken:', authToken);

    try {
      if (!msgId) {
        throw new Error('Meddelandets ID är ogiltigt eller saknas.');
      }

      const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error Details:', errorData); 
        throw new Error('Meddelandet kunde inte raderas. Vänligen försök igen.');
      }

      setChatMessages((prevMessages) => prevMessages.filter((message) => message.id !== msgId));
    } catch (error) {
      console.error('Fel vid radering:', error);
      setErrorMessage(error.message || 'Meddelandet kunde inte raderas. Vänligen försök igen.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="messages">
          {chatMessages.map((message, index) => {
            const key = message.id || `temp-${index}`;
            const isCurrentUserMessage = message.userId === userId;

            console.log(`Message ID: ${key}, Message User ID: ${message.userId}, Current User ID: ${userId}`); // Logga meddelande och användar-ID

            const messageClass = isCurrentUserMessage ? 'chat-right' : 'chat-left';

            return (
              <div key={key} className={`message ${messageClass}`}>
                <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="avatar" />
                <div className="message-content">
                  <div className="username">{message.username}</div>
                  <p dangerouslySetInnerHTML={{ __html: sanitizeMessage(message.text) }}></p>
                  {isCurrentUserMessage && (
                    <button onClick={() => handleDeleteChatMessage(message.id)}>Radera</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Skriv ett meddelande..."
          />
          <button onClick={handleSendChatMessage}>Skicka</button>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Chat;

