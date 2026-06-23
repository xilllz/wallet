import { useState } from 'react';
import '../css/CreateWalletForm.css';
import { RandomArr } from './ts/RandomArr.ts'
import { symbolsArr } from "./data/symbolsArr.ts"
import { words } from "./data/words.ts"
import { GetAddress } from './ts/GetAddress.ts'
import { saveWalletRequest } from './ts/saveWalletReq.ts';

interface CreateWalletFormProps {
  onCancel: () => void;
  onCreate: (email: string, password: string, address: string, sidPhrase: string[]) => void;
}

export function CreateWalletForm({ onCancel, onCreate }: CreateWalletFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState<string[]>([]);
  const [generatedAddress, setGeneratedAddress] = useState('');

  const checkExistingUser = async (email: string): Promise<boolean> => {
    try {
      const wallets = await GetAddress();
      return !!wallets[email];
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error);
      return false;
    }
  };

  const generateUniqueAddress = async (): Promise<string> => {
    try {
      const wallets = await GetAddress();
      let address: string;
      let isUnique = false;

      while (!isUnique) {
        address = RandomArr(symbolsArr, 16).join('');
        const existingAddresses = Object.values(wallets).map(wallet => wallet.address);
        isUnique = !existingAddresses.includes(address);

        if (isUnique) {
          return address;
        }
      }

      return RandomArr(symbolsArr, 16).join('');
    } catch (error) {
      console.error('Ошибка при генерации адреса:', error);
      return RandomArr(symbolsArr, 16).join('');
    }
  };

  const handleFirstSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    const userExists = await checkExistingUser(email);
    if (userExists) {
      setError('Пользователь с таким email уже существует');
      return;
    }

    const address = await generateUniqueAddress();
    const seedPhrase = RandomArr(words, 12);

    setGeneratedSeedPhrase(seedPhrase);
    setGeneratedAddress(address);
    setShowSeedPhrase(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const result = await saveWalletRequest(
        email,
        password,
        generatedAddress,
        generatedSeedPhrase
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      onCreate(
        email,
        password,
        generatedAddress,
        generatedSeedPhrase
      );

      console.log("Кошелек сохранен");
    } catch (error) {
      console.error(error);
      setError("Ошибка соединения с сервером");
    }
  };

  if (showSeedPhrase) {
    return (
      <div className="create-wallet-overlay">
        <div className="create-wallet-form">
          <h3>Запишите сид-фразу</h3>
          <p className="seed-warning">Сохраните эту фразу в надежном месте! Она нужна для восстановления доступа.</p>

          <div className='sid-phrase__block'>
            {generatedSeedPhrase.map((word, index) => (
              <p key={index} className="sid-word">
                {index + 1}. {word}
              </p>
            ))}
          </div>

          <div className="address-preview">
            <strong>Адрес кошелька:</strong>
            <span className="address-text">{generatedAddress}</span>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={() => setShowSeedPhrase(false)}
              className="back-btn"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="create-submit-btn"
            >
              Подтвердить создание
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-wallet-overlay">
      <div className="create-wallet-form">
        <h3>Создание кошелька</h3>

        <form onSubmit={handleFirstSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте пароль"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Подтвердите пароль:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="create-submit-btn"
            >
              Продолжить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}