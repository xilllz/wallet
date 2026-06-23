import '../css/LogPage.css'
import { useState } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { CreateWalletForm } from './CreateWalletForm'

interface LogPageProps {
    onLogin: (email: string, password: string) => void;
}

export function LogPage({ onLogin }: LogPageProps) {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showCreateWallet, setShowCreateWallet] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = () => {
        if (showLoginForm && email && password) {
            onLogin(email, password);
        } else {
            setShowLoginForm(true);
        }
    };

    const handleForgotPassword = () => {
        if (!email) {
            alert('Введите email сначала');
            return;
        }
        setShowForgotPassword(true);
    };

    const handleCreateWallet = () => {
        setShowCreateWallet(true);
    };

    const handleWalletCreated = async (newEmail: string, newPassword: string, address: string, sidPhrase: string[]) => {
        try {
            const walletData = {
                address: address,
                balance: {
                    BTC: 0,
                    ETH: 0,
                    SOL: 0,
                    SNX: 0
                },
                password: newPassword,
                sidPhrase: sidPhrase
            };

            const existingWallets = JSON.parse(localStorage.getItem('wallets') || '{}');
            existingWallets[newEmail] = walletData;
            localStorage.setItem('wallets', JSON.stringify(existingWallets));

            alert(`Кошелек для ${newEmail} создан успешно!`);
            setShowCreateWallet(false);
            setEmail(newEmail);
            setPassword(newPassword);
            setShowLoginForm(true);

        } catch (error) {
            console.error('Ошибка при создании кошелька:', error);
            alert('Ошибка при создании кошелька');
        }
    };

    return (
        <div className='wallet'>
            <div className='wallet__logo'>
                <img className='wallet__logo-img' src="./src/img/bee.png" alt="bee" />
                <h1 className='wallet__logo-text'>BEE-WALLET</h1>
            </div>

            {showLoginForm ? (
                <div className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button
                        type="button"
                        className="forgot-btn"
                        onClick={handleForgotPassword}
                    >
                        Забыли пароль?
                    </button>
                </div>
            ) : null}

            <div className="btn-block">
                <button className="create-btn" onClick={handleCreateWallet}>
                    Создать кошелек
                </button>
                <button className="enter-btn" onClick={handleLoginClick}>
                    {showLoginForm ? 'Войти' : 'Войти в кошелек'}
                </button>
            </div>

            {showForgotPassword && (
                <ForgotPasswordForm
                    userEmail={email}
                    onCancel={() => setShowForgotPassword(false)}
                />
            )}

            {showCreateWallet && (
                <CreateWalletForm
                    onCancel={() => setShowCreateWallet(false)}
                    onCreate={handleWalletCreated}
                />
            )}
        </div>
    )
}