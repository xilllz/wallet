export interface WalletData {
    [email: string]: {
        address: string;
        balance: {
            BTC: number;
            ETH: number;
            SOL: number;
            SNX: number;
        };
        password: string;
        sidPhrase: string[];
    };
}

export async function GetAddress(): Promise<WalletData> {
    const response = await fetch(
        "http://localhost:3001/api/wallets"
    );

    if (!response.ok) {
        throw new Error("Ошибка загрузки кошельков");
    }

    return await response.json();
}