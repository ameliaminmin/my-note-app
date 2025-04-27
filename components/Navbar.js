'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/services/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 直接使用 Firebase 的認證狀態監聽
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('用戶狀態更新：', user);
            setUser(user);
        });

        // 清理訂閱
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('登出失敗：', error);
        }
    };

    return (
        <nav className="bg-gray-100 text-black p-4 fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* 左側標題 */}
                <Link
                    href="/"
                    className={`text-2xl font-bold text-yellow-400 hover:text-yellow-500 transition-colors duration-300 ${pathname === '/' ? 'underline' : ''}`}
                >
                    Note App
                </Link>

                {/* 右側按鈕群組 */}
                <div className="space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                            >
                                登出
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition-colors duration-300 ${pathname === '/login' ? 'bg-yellow-400 text-black' : ''}`}
                            >
                                登入
                            </Link>
                            <Link
                                href="/register"
                                className={`px-4 py-2 rounded-md bg-yellow-400 text-black hover:bg-yellow-500 transition-colors duration-300 ${pathname === '/register' ? 'bg-yellow-500' : ''}`}
                            >
                                註冊
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
} 