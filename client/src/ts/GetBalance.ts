import { GetAddress } from '../ts/GetAddress';
import { fetchPriceData } from './fetchPriceData';

export interface BalanceResult {
    totalUSDT: number;
    balances: {
        BTC: {
            amount: number;
            priceUSD: number;
            valueUSD: number;
        };
        ETH: {
            amount: number;
            priceUSD: number;
            valueUSD: number;
        };
        SOL: {
            amount: number;
            priceUSD: number;
            valueUSD: number;
        };
        SNX: {
            amount: number;
            priceUSD: number;
            valueUSD: number;
        };
    };
}

export async function GetBalance(userEmail: string): Promise<BalanceResult> {
    try {
        const [walletData, priceData] = await Promise.all([
            GetAddress(),
            fetchPriceData()
        ]);

        const wallet = walletData[userEmail];

        if (!wallet) {
            throw new Error(`Wallet with email ${userEmail} not found`);
        }

        const { BTC: btcAmount, ETH: ethAmount, SOL: solAmount, SNX: snxAmount } = wallet.balance;

        const btcPrice = priceData.bitcoin?.usd || 0;
        const ethPrice = priceData.ethereum?.usd || 0;
        const solPrice = priceData.solana?.usd || 0;
        const snxPrice = 0;

        const btcValueUSD = btcAmount * btcPrice;
        const ethValueUSD = ethAmount * ethPrice;
        const solValueUSD = solAmount * solPrice;
        const snxValueUSD = snxAmount * snxPrice;

        const totalUSDT = btcValueUSD + ethValueUSD + solValueUSD + snxValueUSD;

        return {
            totalUSDT,
            balances: {
                BTC: {
                    amount: btcAmount,
                    priceUSD: btcPrice,
                    valueUSD: btcValueUSD
                },
                ETH: {
                    amount: ethAmount,
                    priceUSD: ethPrice,
                    valueUSD: ethValueUSD
                },
                SOL: {
                    amount: solAmount,
                    priceUSD: solPrice,
                    valueUSD: solValueUSD
                },
                SNX: {
                    amount: snxAmount,
                    priceUSD: snxPrice,
                    valueUSD: snxValueUSD
                }
            }
        };

    } catch (error) {
        console.error('Ошибка при расчете баланса:', error);
        throw error;
    }
}