export interface PriceData {
  bitcoin?: {
    usd: number;
    last_updated_at: number;
  };
  ethereum?: {
    usd: number;
    last_updated_at: number;
  };
  solana?: {
    usd: number;
    last_updated_at: number;
  };
  [key: string]: {
    usd: number;
    last_updated_at: number;
  } | undefined;
}

export async function fetchPriceData(): Promise<PriceData> {
  try {
    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_last_updated_at=true'
    );

    if (!priceResponse.ok) {
      throw new Error(`HTTP error! status: ${priceResponse.status}`);
    }

    const priceData: PriceData = await priceResponse.json();
    console.log(priceData);
    return priceData;

  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error; 
  }
}