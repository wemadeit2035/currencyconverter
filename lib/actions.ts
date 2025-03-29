"use server"

// This is a server action to fetch currency conversion rates
export async function convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
  try {
    // Using ExchangeRate-API for free currency conversion
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    if (!data.rates || !data.rates[toCurrency]) {
      throw new Error(`Exchange rate not available for ${toCurrency}`)
    }

    const rate = data.rates[toCurrency]
    const result = amount * rate

    return {
      result,
      rate,
      timestamp: data.time_last_updated,
    }
  } catch (error) {
    console.error("Currency conversion error:", error)
    throw new Error("Failed to convert currency")
  }
}

