import { useState } from 'react';
import { GetAddress } from './ts/GetAddress';
import '../css/ForgotPasswordForm.css';

interface ForgotPasswordFormProps {
  userEmail: string;
  onCancel: () => void;
  onSuccess?: () => void; 
}

export function ForgotPasswordForm({ userEmail, onCancel }: ForgotPasswordFormProps) {
    const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(12).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userPassword, setUserPassword] = useState('');

    const handleInputChange = (index: number, value: string) => {
        const newSeedPhrase = [...seedPhrase];
        newSeedPhrase[index] = value.toLowerCase().trim();
        setSeedPhrase(newSeedPhrase);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserPassword('');
        setShowPassword(false);

        try {
            const wallets = await GetAddress();
            const wallet = wallets[userEmail];

            if (!wallet) {
                setError('Кошелек не найден');
                return;
            }

            const isCorrect = seedPhrase.every((word, index) =>
                word === wallet.sidPhrase[index]
            );

            if (isCorrect) {
                setUserPassword(wallet.password);
                setShowPassword(true);
            } else {
                setError('Неверная сид-фраза');
            }
        } catch (err) {
            setError('Ошибка при проверке сид-фразы');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(userPassword);
        alert('Пароль скопирован в буфер обмена');
    };

    return (
        <div className="forgot-password-overlay">
            <div className="forgot-password-form">
                <h3>Восстановление доступа</h3>
                <p>Введите вашу сид-фразу (12 слов)</p>

                <form onSubmit={handleSubmit}>
                    <div className="seed-phrase-grid">
                        {seedPhrase.map((word, index) => (
                            <div key={index} className="seed-word-input">
                                <label>{index + 1}.</label>
                                <input
                                    type="text"
                                    value={word}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder={`Слово ${index + 1}`}
                                    disabled={loading || showPassword}
                                />
                            </div>
                        ))}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {showPassword && (
                        <div className="password-reveal">
                            <h4>Ваш пароль:</h4>
                            <div className="password-display">
                                <span className="password-text">{userPassword}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyPassword}
                                    className="copy-btn"
                                >
                                    📋
                                </button>
                            </div>
                            <p className="password-note">
                                Сохраните пароль в надежном месте!
                            </p>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="cancel-btn"
                        >
                            {showPassword ? 'Закрыть' : 'Отмена'}
                        </button>

                        {!showPassword && (
                            <button
                                type="submit"
                                disabled={loading || seedPhrase.some(word => word === '')}
                                className="submit-btn"
                            >
                                {loading ? 'Проверка...' : 'Проверить'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}