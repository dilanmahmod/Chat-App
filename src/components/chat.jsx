import React, { useState, useEffect } from 'react';
import '../css/Chat.css';

const sanitizeMessage = (message) => {
  const tempElement = document.createElement('div');
  tempElement.innerText = message;
  return tempElement.innerHTML;
};

const Chat = ({ authToken, userId, csrfToken }) => {

  const [fakeChat] = useState([
    {
      "text": "Tja tja, hur mår du?",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "userId": "fakeUser1",
      "conversationId": "fakeConversation1"
    },
    {
      "text": "Hallå!! Svara då!!",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "userId": "fakeUser1",
      "conversationId": "fakeConversation1"
    },
    {
      "text": "Sover du eller?! 😴",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "userId": "fakeUser1",
      "conversationId": "fakeConversation1"
    }
  ]);

  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(localStorage.getItem('currentConversationId') || '');
  const [conversationList, setConversationList] = useState([]);

  useEffect(() => {
    console.log('Props till Chat:', { authToken, userId, csrfToken, selectedConversation });
  }, [authToken, userId, csrfToken, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) {
      setChatMessages(fakeChat);
      return;
    }

    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${selectedConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const messagesData = await response.json();
        console.log('Fetched messages:', messagesData);

        const sanitizedMessages = messagesData.map((msg, index) => ({
          ...msg,
          userId: msg.userId || `temp-${index}`
        }));

        const combinedMessages = [...fakeChat, ...sanitizedMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setChatMessages(combinedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(combinedMessages));
      } catch (error) {
        setErrorMessage('Kunde inte hämta meddelanden. Vänligen försök igen senare.');
        console.error('Fel vid hämtning av meddelanden:', error);
      }
    };

    fetchChatMessages();
  }, [selectedConversation, authToken, fakeChat]);

  const handleSendChatMessage = async () => {
    if (!inputMessage.trim()) return;

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
          conversationId: selectedConversation,
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
      setErrorMessage(error.message || 'Meddelandet kunde inte raderas. Vänligen försök igen.');
      console.error('Fel vid radering:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="messages">
          {chatMessages.map((message, index) => {
            console.log(`Med användar-id: ${message.userId}, Inloggad användare-id: ${userId}, Meddelande-ID: ${message.id || 'temp-' + index}`);

            const isFakeMessage = message.conversationId === "fakeConversation1";
            const key = isFakeMessage ? `fake-${index}` : message.id || `temp-${index}`;
            const showDeleteButton = !isFakeMessage && message.userId === userId;

            return (
              <div
                key={key}
                className={message.userId === userId ? 'message sent' : 'message received'}
              >
                <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="avatar" />
                <div className="message-content">
                  <div className="username">{message.username}</div>
                  <p dangerouslySetInnerHTML={{ __html: sanitizeMessage(message.text) }}></p>
                  {showDeleteButton && (
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
