'use client';
import { useEffect, useRef } from 'react';

type TelegramUser = Record<string, string | number | boolean>;

declare global {
    interface Window {
        onTelegramAuth?: (user: TelegramUser) => void;
    }
}

export default function TelegramAuthPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        // Chống React hydrate render script 2 lần
        if (containerRef.current.innerHTML.trim() !== '') return;

        // Bắt sự kiện đăng nhập thành công để ném về Tool Go
        window.onTelegramAuth = function(user: TelegramUser) {
            const params = new URLSearchParams(
                Object.entries(user).map(([key, value]) => [key, String(value)]),
            ).toString();
            window.location.href = "http://127.0.0.1:8123/callback?" + params;
        };

        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', 'flashflow_auth_bot'); // NHỚ ĐỔI ĐÚNG TÊN BOT NẾU CẦN
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        
        containerRef.current.appendChild(script);
    }, []);

    return (
        <div style={{ backgroundColor: '#0B0F19', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '-8px' }}>
            <div style={{ background: '#131824', padding: '40px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <h2 style={{ marginTop: 0 }}>Đăng nhập Bảng Vàng FlashFlow</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Nhấp vào nút bên dưới để cấp quyền kết nối</p>
                {/* Nút Telegram sẽ xuất hiện trong div này */}
                <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }}></div>
            </div>
        </div>
    );
}
