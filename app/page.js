'use client';

import { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '@/services/firebase';
import { onAuthStateChange } from '@/services/firebase';
import Link from 'next/link';

export default function Home() {
    // 定義筆記狀態
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, noteId: null });

    // 監聽登入狀態
    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 從 Firestore 讀取資料並監聽變化
    useEffect(() => {
        if (!user) return;

        // 建立查詢，使用新的集合路徑並按建立時間排序
        const userNotesRef = collection(db, `user-list/${user.uid}/note-list`);
        const q = query(userNotesRef, orderBy("createdAt", "desc"));

        // 設定即時監聽
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notes: ", error);
            setLoading(false);
        });

        // 清理函數
        return () => unsubscribe();
    }, [user]);

    // 處理完成狀態更新
    const handleCompleteToggle = async (noteId, currentStatus) => {
        try {
            const noteRef = doc(db, `user-list/${user.uid}/note-list/${noteId}`);
            await updateDoc(noteRef, {
                completed: !currentStatus
            });
        } catch (error) {
            console.error("Error updating note status: ", error);
        }
    };

    // 處理表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newNote = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date'),
            content: formData.get('content'),
            createdAt: new Date().toISOString(),
            userId: user.uid,
            completed: false // 新增完成狀態欄位
        };

        try {
            // 將筆記儲存到新的集合路徑
            await addDoc(collection(db, `user-list/${user.uid}/note-list`), newNote);

            // 重置表單
            e.target.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // 格式化時間函數
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 按分類分組筆記
    const categorizedNotes = {
        'important-urgent': notes.filter(note => note.category === 'important-urgent'),
        'important-not-urgent': notes.filter(note => note.category === 'important-not-urgent'),
        'normal-urgent': notes.filter(note => note.category === 'normal-urgent'),
        'normal-not-urgent': notes.filter(note => note.category === 'normal-not-urgent')
    };

    // 分類標題
    const categoryTitles = {
        'important-urgent': '重要緊急',
        'important-not-urgent': '重要不緊急',
        'normal-urgent': '普通緊急',
        'normal-not-urgent': '普通不緊急'
    };

    // 分類顏色
    const categoryColors = {
        'important-urgent': 'bg-red-100 text-red-800',
        'important-not-urgent': 'bg-yellow-100 text-yellow-800',
        'normal-urgent': 'bg-blue-100 text-blue-800',
        'normal-not-urgent': 'bg-gray-100 text-gray-800'
    };

    // 處理刪除筆記
    const handleDelete = async (noteId) => {
        try {
            const noteRef = doc(db, `user-list/${user.uid}/note-list/${noteId}`);
            await deleteDoc(noteRef);
            setDeleteModal({ show: false, noteId: null });
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    // 未登入時的歡迎頁面
    if (!user && !loading) {
        return (
            <main className="pt-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* 筆記圖示 */}
                        <div className="mb-8">
                            <svg
                                width="120"
                                height="120"
                                viewBox="0 0 120 120"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto"
                            >
                                {/* 筆記本背景 */}
                                <rect
                                    x="20"
                                    y="10"
                                    width="80"
                                    height="100"
                                    rx="8"
                                    fill="#FEF3C7"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                />
                                {/* 筆記本線條 */}
                                <line
                                    x1="30"
                                    y1="30"
                                    x2="90"
                                    y2="30"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="30"
                                    y1="45"
                                    x2="90"
                                    y2="45"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="30"
                                    y1="60"
                                    x2="90"
                                    y2="60"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1="30"
                                    y1="75"
                                    x2="90"
                                    y2="75"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                {/* 筆記本裝飾 */}
                                <circle
                                    cx="60"
                                    cy="90"
                                    r="5"
                                    fill="#F59E0B"
                                />
                                <path
                                    d="M55 90L65 90"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M60 85L60 95"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-6 text-gray-800">
                            讓你的筆記更有條理
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            使用我們的筆記軟體，輕鬆管理你的重要事項。無論是工作計劃、學習筆記還是生活瑣事，都能一目了然。
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/login" className="bg-yellow-400 text-black py-3 px-8 rounded-md hover:bg-yellow-500 transition-colors duration-300">
                                登入
                            </Link>
                            <Link href="/register" className="bg-gray-800 text-white py-3 px-8 rounded-md hover:bg-gray-700 transition-colors duration-300">
                                註冊
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // 登入後的主頁面
    return (
        <>
            {/* 主內容區域 */}
            <main className="pt-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* 左側：筆記表單卡片 */}
                        <div className="lg:w-[400px] shrink-0">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">新增筆記</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* 標題輸入 */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            標題
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="輸入標題"
                                            required
                                        />
                                    </div>

                                    {/* 分類下拉選單 */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            分類
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            required
                                        >
                                            <option value="">選擇分類</option>
                                            <option value="important-urgent">重要緊急</option>
                                            <option value="important-not-urgent">重要不緊急</option>
                                            <option value="normal-urgent">普通緊急</option>
                                            <option value="normal-not-urgent">普通不緊急</option>
                                        </select>
                                    </div>

                                    {/* 日期選擇器 */}
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                            日期
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            required
                                        />
                                    </div>

                                    {/* 詳細內容 */}
                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                            詳細內容
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="輸入詳細內容"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* 提交按鈕 */}
                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        建立筆記
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* 右側：筆記清單 */}
                        <div className="flex-1">
                            {loading ? (
                                <p className="text-gray-500 text-center py-8">載入中...</p>
                            ) : notes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">尚未建立任何筆記</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {Object.entries(categorizedNotes).map(([category, categoryNotes]) => (
                                        categoryNotes.length > 0 && (
                                            <div key={category} className="bg-white rounded-lg shadow">
                                                <div className={`${category === 'important-urgent' ? 'bg-red-50' :
                                                    category === 'important-not-urgent' ? 'bg-yellow-50' :
                                                        category === 'normal-urgent' ? 'bg-blue-50' :
                                                            'bg-gray-50'
                                                    } px-4 py-2 rounded-t-lg border-b`}>
                                                    <h3 className="text-base font-medium">
                                                        {categoryTitles[category]}
                                                    </h3>
                                                </div>
                                                <div className="p-4 space-y-4">
                                                    {categoryNotes.map((note) => (
                                                        <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 bg-white relative">
                                                            <button
                                                                onClick={() => setDeleteModal({ show: true, noteId: note.id })}
                                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={note.completed || false}
                                                                    onChange={() => handleCompleteToggle(note.id, note.completed || false)}
                                                                    className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                                                                />
                                                                <h4 className={`font-medium ${note.completed ? 'line-through text-gray-500' : ''}`}>
                                                                    {note.title}
                                                                </h4>
                                                            </div>
                                                            <div className="flex flex-col space-y-1 text-xs text-gray-500 mb-2">
                                                                <p>日期：{new Date(note.date).toLocaleDateString()}</p>
                                                                <p>建立時間：{formatDate(note.createdAt)}</p>
                                                            </div>
                                                            <p className={`text-gray-700 ${note.completed ? 'text-gray-500' : ''}`}>
                                                                {note.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* 刪除確認彈窗 */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">確認刪除</h3>
                        <p className="text-gray-600 mb-6">確定要刪除這則筆記嗎？此操作無法復原。</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteModal({ show: false, noteId: null })}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.noteId)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                            >
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
