'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function Register() {
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
            // 使用 Firebase Authentication 創建用戶
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // 註冊成功，顯示提示並跳轉
            alert('註冊成功！');
            router.push('/');
        } catch (error) {
            // 處理錯誤
            let errorMessage = '註冊失敗，請稍後再試';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = '此電子郵件已被註冊';
                    break;
                case 'auth/invalid-email':
                    errorMessage = '無效的電子郵件格式';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = '此操作不被允許';
                    break;
                case 'auth/weak-password':
                    errorMessage = '密碼強度太弱';
                    break;
            }

            setError(errorMessage);
            alert(errorMessage);
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
                <h1 className={styles.title}>註冊帳號</h1>
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
                            placeholder="請輸入密碼（至少6個字元）"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={`${styles.submitButton} ${styles.yellowButton}`}
                        disabled={loading}
                    >
                        {loading ? '註冊中...' : '註冊'}
                    </button>
                </form>
            </div>
        </div>
    );
}