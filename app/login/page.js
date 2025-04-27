'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 使用 Firebase Authentication 進行登入
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // 登入成功，直接跳轉到首頁
            router.push('/');
        } catch (error) {
            // 處理錯誤
            let errorMessage = '登入失敗，請稍後再試';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = '無效的電子郵件格式';
                    break;
                case 'auth/user-disabled':
                    errorMessage = '此帳號已被停用';
                    break;
                case 'auth/user-not-found':
                    errorMessage = '找不到此帳號';
                    break;
                case 'auth/wrong-password':
                    errorMessage = '密碼錯誤';
                    break;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>登入帳號</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">電子郵件</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="請輸入電子郵件"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">密碼</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="請輸入密碼"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={`${styles.submitButton} ${styles.yellowButton}`}
                        disabled={loading}
                    >
                        {loading ? '登入中...' : '登入'}
                    </button>
                </form>
            </div>
        </div>
    );
}
