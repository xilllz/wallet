import fs from "fs";
import path from "path";

const WALLET_FILE = path.join(process.cwd(), "data", "wallets.json");

export function saveWalletData(
    email: string,
    password: string,
    address: string,
    sidPhrase: string[]
) {
    try {
        let wallets: Record<string, any> = {};

        if (fs.existsSync(WALLET_FILE)) {
            const content = fs.readFileSync(WALLET_FILE, "utf8");
            wallets = content ? JSON.parse(content) : {};
        }

        wallets[email] = {
            address,
            balance: {
                BTC: 0,
                ETH: 0,
                SOL: 0,
                SNX: 0
            },
            password,
            sidPhrase
        };

        fs.writeFileSync(
            WALLET_FILE,
            JSON.stringify(wallets, null, 4),
            "utf8"
        );

        return {
            success: true,
            message: "Wallet saved"
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Failed to save wallet"
        };
    }
}