import React, { useState, useEffect } from 'react';
import '../css/Chat.css';

// Funktion för att sanera meddelandetext
const sanitizeMessage = (message) => {
  const tempElement = document.createElement('div');
  tempElement.innerText = message;
  return tempElement.innerHTML;
};

const Chat = ({ authToken }) => {
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('chatMessages')) || []);
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(localStorage.getItem('currentConversationId') || '');
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUsername') || '');
  const [userIdentifier] = useState(localStorage.getItem('currentUserId') || '');
  const [userList, setUserList] = useState([]);
  const [conversationList, setConversationList] = useState(JSON.parse(localStorage.getItem('conversationList')) || []);

  const [fakeChat] = useState([
    {
      "text": "Tja tja, hur mår du?",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "conversationId": null
    },
    {
      "text": "Hallå!! Svara då!!",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "conversationId": null
    },
    {
      "text": "Sover du eller?! 😴",
      "avatar": "https://i.pravatar.cc/100?img=14",
      "username": "Johnny",
      "conversationId": null
    }
  ]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch('https://chatify-api.up.railway.app/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta användare');

        const usersData = await response.json();
        setUserList(usersData);
      } catch (error) {
        setErrorMessage('Kunde inte hämta användare');
        console.error(error); // Logga felet
      }
    };

    fetchUserList();
  }, [authToken]);

  useEffect(() => {
    if (!selectedConversation) return;

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
        setChatMessages(messagesData);
        localStorage.setItem('chatMessages', JSON.stringify(messagesData));

        const conversationExists = conversationList.some((convo) => convo.id === selectedConversation);
        if (!conversationExists) {
          const newConversation = {
            id: selectedConversation,
            name: 'Ny konversation',
          };
          const updatedConversations = [...conversationList, newConversation];
          setConversationList(updatedConversations);
          localStorage.setItem('conversationList', JSON.stringify(updatedConversations));
        }
      } catch (error) {
        setErrorMessage('Kunde inte hämta meddelanden');
        console.error(error); // Logga felet
      }
    };

    fetchChatMessages();
  }, [selectedConversation, authToken, conversationList]);

  const handleSendChatMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sanitizeMessage(inputMessage),
          conversationId: selectedConversation,
        }),
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte skickas');

      const { latestMessage } = await response.json();
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...latestMessage, userId: userIdentifier, username: currentUser }];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setInputMessage('');
    } catch (error) {
      setErrorMessage('Meddelandet kunde inte skickas');
      console.error(error); // Logga felet
    }
  };

  const handleDeleteChatMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte raderas');

      setChatMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((message) => message.id !== messageId);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setErrorMessage('Meddelandet kunde inte raderas');
      console.error(error); // Logga felet
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation.id);
    localStorage.setItem('currentConversationId', conversation.id);
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Användare</h3>
        <ul>
          {userList.map((user) => (
            <li key={user.userId}>{user.username}</li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        <h2>Chat: {conversationList.find((convo) => convo.id === selectedConversation)?.name || ''}</h2>
        <div className="messages">
          {/* Visa mockade chattmeddelanden */}
          {fakeChat.map((message, index) => (
            <div key={index} className={message.userId?.toString() === userIdentifier?.toString() ? 'message sent' : 'message received'}>
              <img src={message.avatar} alt="avatar" className="avatar" />
              <div className="message-content">
                <div className="username">{message.username}</div>
                <p dangerouslySetInnerHTML={{ __html: sanitizeMessage(message.text) }}></p>
              </div>
            </div>
          ))}
          {/* Visa riktiga chattmeddelanden */}
          {chatMessages.map((message) => (
            <div key={message.id} className={message.userId?.toString() === userIdentifier?.toString() ? 'message sent' : 'message received'}>
              <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="avatar" />
              <div className="message-content">
                <div className="username">{message.username}</div>
                <p dangerouslySetInnerHTML={{ __html: sanitizeMessage(message.text) }}></p>
              </div>
            </div>
          ))}
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
