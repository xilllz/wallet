import { useState, useEffect } from 'react';
import '../css/BalancePage.css';
import { fetchPriceData, type PriceData } from './ts/fetchPriceData.ts';
import { GetAddress } from './ts/GetAddress.ts';
import type { WalletData } from './ts/GetAddress.ts';
import { BalanceComponent } from './BalanceComponent';
import { RandomArr } from './ts/RandomArr.ts'
import { symbolsArr } from "./data/symbolsArr.ts"
import { words } from "./data/words.ts"
import { LeaveWallet } from './LeaveWallet'

interface BalancePageProps {
  onLogout: () => void;
  userEmail: string;
}

function BalancePage({ onLogout, userEmail }: BalancePageProps) {
  const [prices, setPrices] = useState<PriceData>({});
  const [wallets, setWallets] = useState<WalletData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [priceLoading, setPriceLoading] = useState<boolean>(true);
  const [walletLoading, setWalletLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [showLeaveWindow, setShowLeaveWindow] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<any>(null);

  const handleLeaveClick = () => {
    setShowLeaveWindow(true);
  };

  const handleCancel = () => {
    setShowLeaveWindow(false);
  };

  const handleConfirmExit = () => {
    console.log('Выход из кошелька');
    onLogout(); 
    setShowLeaveWindow(false);
  };

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setPriceLoading(true);
        const data = await fetchPriceData();
        setPrices(data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки цен');
      } finally {
        setPriceLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        setWalletLoading(true);
        const walletData = await GetAddress();
        setWallets(walletData);
        
        if (walletData[userEmail]) {
          setCurrentWallet(walletData[userEmail]);
        } else {
          setWalletError('Кошелек не найден');
        }
        
        setWalletError(null);
      } catch (err) {
        setWalletError('Ошибка загрузки кошельков');
      } finally {
        setWalletLoading(false);
      }
    };

    loadWallets();
  }, [userEmail]);

  useEffect(() => {
    setLoading(priceLoading || walletLoading);
  }, [priceLoading, walletLoading]);

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'Не доступно';
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  console.log(RandomArr(symbolsArr, 16));
  console.log(RandomArr(words, 12));

  return (
    <>
      <div className='wallet'>
        <button className='exit-wallet' onClick={handleLeaveClick}>
          <img className='exit-img' src="./src/img/exit.png" alt="exit" />
        </button>
        
        {showLeaveWindow && (
          <LeaveWallet 
            onCancel={handleCancel}
            onExit={handleConfirmExit}
          />
        )}
        
        <div className='address'>
          <img className='honey' src="./src/img/honey.png" alt="honey" />
          <p className='address-id'>
            {walletLoading ? 'Загрузка адреса...' :
              walletError ? walletError :
                currentWallet ? currentWallet.address : 'Кошелек не найден'}
          </p>
        </div>
        
        <div className='wallet__logo'>
          <img className='wallet__logo-img' src="./src/img/bee.png" alt="bee" />
          <h1 className='wallet__logo-text'>BEE-WALLET</h1>
        </div>
        
        <div className='balance-USDT-block'>
          <BalanceComponent userEmail={userEmail} />
        </div>
        
        <div>
          <ul className='tokens-list'>
            <li className='token'>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#ffc107" d="M44,24c0,11.044-8.956,20-20,20S4,35.044,4,24S12.956,4,24,4S44,12.956,44,24z"></path><path fill="#fff8e1" d="M17,34V14h8.199c2.41,0,4.234,0.465,5.48,1.395s1.867,2.293,1.867,4.086c0,0.98-0.25,1.844-0.746,2.59c-0.5,0.746-1.195,1.293-2.086,1.641c1.016,0.258,1.816,0.773,2.402,1.555C32.703,26.043,33,26.992,33,28.121c0,1.922-0.609,3.379-1.828,4.367S28.219,33.98,25.965,34H17z M21,22h4.363c2.063-0.035,3.098-0.824,3.098-2.445c0-0.906-0.262-1.559-0.785-1.957S26.328,17,25.199,17H21V22z M21,25v6h4.844C26.805,31,29,30.531,29,28.391S27.883,25.027,26,25H21z"></path><path fill="#fff8e1" d="M20 11h3v5h-3V11zM25 11h3v5h-3V11zM20 32h3v5h-3V32zM25 32h3v5h-3V32z"></path>
              </svg>
              <p className='token-text'>BTC</p>
              <p className='token-price'>
                {loading ? 'Загрузка...' : error ? error : formatPrice(prices.bitcoin?.usd)}
              </p>
              <p className='token-balance'>
                {walletLoading ? '...' : currentWallet ? currentWallet.balance.BTC : '0'}
              </p>
            </li>
            
            <li className='token'>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#7880e7" d="M11,24L25,2l14,22l-14,8L11,24z"></path><path fill="#5c64c7" d="M25,2l14,22l-14,8V2z"></path><path fill="#7880e7" d="M11,27l14,8l14-8L25,46L11,27z"></path><path fill="#5c64c7" d="M25,35l14-8L25,46V35z M11,24l14-6l14,6l-14,8L11,24z"></path><path fill="#2a3192" d="M25,18l14,6l-14,8V18z"></path>
              </svg>
              <p className='token-text'>ETH</p>
              <p className='token-price'>
                {loading ? 'Загрузка...' : error ? error : formatPrice(prices.ethereum?.usd)}
              </p>
              <p className='token-balance'>
                {walletLoading ? '...' : currentWallet ? currentWallet.balance.ETH : '0'}
              </p>
            </li>
            
            <li className='token'>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 64 64">
                <linearGradient id="2xyP8ITvw2AyN9J62dUAba_icTiMgoOHSVy_gr1" x1="32" x2="32" y1="17.936" y2="43.068" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6dc7ff"></stop><stop offset="1" stop-color="#e6abff"></stop></linearGradient><path fill="url(#2xyP8ITvw2AyN9J62dUAba_icTiMgoOHSVy_gr1)" d="M41.806,25H17.032l5.161-6h24.774L41.806,25z M17.032,45h24.774l5.161-6H22.194L17.032,45z M17.032,29l5.161,6h24.774l-5.161-6H17.032z"></path><linearGradient id="2xyP8ITvw2AyN9J62dUAbb_icTiMgoOHSVy_gr2" x1="32" x2="32" y1="8.553" y2="55.331" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#2xyP8ITvw2AyN9J62dUAbb_icTiMgoOHSVy_gr2)" d="M32,58C17.663,58,6,46.337,6,32	C6,17.664,17.663,6,32,6s26,11.664,26,26C58,46.337,46.337,58,32,58z M32,8C18.767,8,8,18.767,8,32s10.767,24,24,24s24-10.767,24-24	S45.233,8,32,8z"></path>
              </svg>
              <p className='token-text'>SOL</p>
              <p className='token-price'>
                {loading ? 'Загрузка...' : error ? error : formatPrice(prices.solana?.usd)}
              </p>
              <p className='token-balance'>
                {walletLoading ? '...' : currentWallet ? currentWallet.balance.SOL : '0'}
              </p>
            </li>
            
            <li className='token'>
              <p className='S'>S</p>
              <p className='token-text'>SNX</p>
              <p className='token-price'>Не доступно</p>
              <p className='token-balance'>
                {walletLoading ? '...' : currentWallet ? currentWallet.balance.SNX : '0'}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default BalancePage;