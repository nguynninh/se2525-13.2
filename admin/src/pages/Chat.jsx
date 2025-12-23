import React from 'react';

const Chat = () => {
  const contacts = [];
  const messages = [];
  const activeContact = contacts[0];

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No contacts yet.</div>
          ) : (
            contacts.map((contact, index) => (
              <div
                key={index}
                className={`flex items-center p-4 cursor-pointer ${
                  contact.active ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-xs text-gray-500">{contact.time}</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center">
          {activeContact ? (
            <>
              <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <h3 className="font-semibold">{activeContact.name}</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">Select a contact to start chatting.</p>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {!activeContact ? (
            <div className="text-sm text-gray-600">No conversation selected.</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-gray-600">No messages yet.</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg p-3 rounded-lg ${
                    message.sender === 'me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'} text-right`}>{message.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              placeholder={activeContact ? "Type a message..." : "Select a contact to start chatting"}
              disabled={!activeContact}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={!activeContact}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
