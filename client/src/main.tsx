import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/index.css'
import BalancePage from './BalancePage.tsx'
import { LogPage } from './LogPage.tsx'
import { GetAddress } from './ts/GetAddress.ts'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const checkAuthState = async () => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedLoginState = localStorage.getItem('isLoggedIn');
      
      if (savedUser && savedLoginState === 'true') {
        const wallets = await GetAddress();
        
        if (wallets[savedUser]) {
          setIsLoggedIn(true);
          setCurrentUser(savedUser);
        } else {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('isLoggedIn');
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuthState();
}, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const wallets = await GetAddress();
      
      if (wallets[email]) {
        if (wallets[email].password === password) {
          setIsLoggedIn(true);
          setCurrentUser(email);
          
          localStorage.setItem('currentUser', email);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          alert('Неверный пароль');
        }
      } else {
        alert('Пользователь с таким email не найден');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка при загрузке данных');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <StrictMode>
      {isLoggedIn ? (
        <BalancePage onLogout={handleLogout} userEmail={currentUser} />
      ) : (
        <LogPage onLogin={handleLogin} />
      )}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<App />);