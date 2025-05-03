'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ChatRoom = () => {
    // 控制聊天室顯示狀態
    const [isOpen, setIsOpen] = useState(false);
    // 儲存聊天訊息
    const [messages, setMessages] = useState([]);
    // 儲存輸入框的值
    const [inputValue, setInputValue] = useState('');

    // 添加加載狀態的顯示。以下是修改建議：
    const [isLoading, setIsLoading] = useState(false);

    // 處理發送訊息
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) {
            return;
        }

        const now = new Date();
        const userMessage = {
            text: trimmedInput,
            sender: 'user',
            timestamp: now.toLocaleDateString('zh-TW') + ' ' + now.toLocaleTimeString()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');
        setIsLoading(true); // 開始加載

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: "user",
                        content: trimmedInput
                    }]
                })
            });

            const data = await response.json();

            if (response.ok) {
                const aiMessage = {
                    text: data.message,
                    sender: 'ai',
                    timestamp: new Date().toLocaleDateString('zh-TW') + ' ' + new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } else {
                const errorMessage = {
                    text: `錯誤: ${data.error}`,
                    sender: 'system',
                    timestamp: new Date().toLocaleDateString('zh-TW') + ' ' + new Date().toLocaleTimeString(),
                    isError: true
                };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                text: `網絡錯誤: ${error.message}`,
                sender: 'system',
                timestamp: new Date().toLocaleDateString('zh-TW') + ' ' + new Date().toLocaleTimeString(),
                isError: true
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false); // 結束加載
        }
    };

    return (
        <>
            {/* 聊天室按鈕 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg 
                     bg-gradient-to-r from-yellow-400 to-pink-500 
                     hover:from-yellow-500 hover:to-pink-600 
                     transition-all duration-300 ease-in-out
                     flex items-center justify-center
                     transform hover:scale-110 z-[100]"
                aria-label="開啟聊天室"
            >
                <FontAwesomeIcon
                    icon={faRobot}
                    className="text-white text-2xl"
                />
            </button>

            {/* 聊天室界面 */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-[99]">
                    {/* 聊天室標題 */}
                    <div className="p-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-t-lg">
                        <h2 className="text-white font-semibold">聊天室</h2>
                    </div>

                    {/* 聊天訊息區域 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
                                    } mb-4`}
                            >
                                {/* 訊息內容 */}
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                                        ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white'
                                        : message.isError
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100'
                                        }`}
                                >
                                    <div className="break-words">{message.text}</div>
                                </div>

                                {/* 時間戳 */}
                                <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                    {message.timestamp}
                                </div>
                            </div>
                        ))}

                        {/* 加載中的提示 */}
                        {isLoading && (
                            <div className="flex items-start mb-4">
                                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            className="animate-spin text-gray-500"
                                        />
                                        <span className="text-gray-500">AI 正在思考中...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 輸入區域 */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="輸入訊息..."
                                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 
                                         hover:from-yellow-500 hover:to-pink-600 
                                         flex items-center justify-center text-white
                                         transition-all duration-300 ease-in-out"
                                disabled={!inputValue.trim()}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatRoom;