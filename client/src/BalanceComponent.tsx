import { useState, useEffect } from 'react';
import { GetBalance, type BalanceResult } from '../src/ts/GetBalance';
import '../css/BalanceComponent.css'

interface BalanceComponentProps {
    userEmail: string;
}

export function BalanceComponent({ userEmail }: BalanceComponentProps) {
    const [balance, setBalance] = useState<BalanceResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                setLoading(true);
                const balanceData = await GetBalance(userEmail);
                setBalance(balanceData);
                setError(null);
            } catch (err) {
                setError('Ошибка загрузки баланса');
            } finally {
                setLoading(false);
            }
        };

        loadBalance();
    }, [userEmail]);

    if (loading) {
        return <div className="balance-usdt">Загрузка...</div>;
    }

    if (error) {
        return <div className="balance-usdt">{error}</div>;
    }

    if (!balance) {
        return <div className="balance-usdt">Баланс не найден</div>;
    }

    return (
        <p className="balance-USDT">
            {balance.totalUSDT.toFixed(2)}
            <span className='balance-USDT-text'> USDT</span>
        </p>
    );
}
