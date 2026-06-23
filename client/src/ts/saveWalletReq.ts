export async function saveWalletRequest(
    email: string,
    password: string,
    address: string,
    sidPhrase: string[]
) {
    const response = await fetch(
        "http://localhost:3001/api/wallet/save",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                address,
                sidPhrase
            })
        }
    );

    return await response.json();
}