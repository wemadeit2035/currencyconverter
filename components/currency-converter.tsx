"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { convertCurrency } from "@/lib/actions"

// Comprehensive list of world currencies with their codes, names, and symbols (sorted alphabetically by name)
const currencies = [
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs." },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "DOP", name: "Dominican Peso", symbol: "RD$" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K" },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/." },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "₲" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "лв" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [rate, setRate] = useState<number | null>(null)

  // Add state for search queries
  const [fromSearch, setFromSearch] = useState<string>("")
  const [toSearch, setToSearch] = useState<string>("")

  // Filter currencies based on search queries
  const filteredFromCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
      currency.name.toLowerCase().includes(fromSearch.toLowerCase()),
  )

  const filteredToCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(toSearch.toLowerCase()) ||
      currency.name.toLowerCase().includes(toSearch.toLowerCase()),
  )

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    // Reset search when swapping
    setFromSearch("")
    setToSearch("")
  }

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await convertCurrency(fromCurrency, toCurrency, Number(amount))
      setResult(data.result)
      setRate(data.rate)
    } catch (err) {
      setError("Failed to convert currency. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSymbol = (code: string) => {
    return currencies.find((c) => c.code === code)?.symbol || code
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Convert Currency</CardTitle>
        <CardDescription>Get real-time exchange rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="text-lg"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <div className="space-y-2">
            <label htmlFor="from-currency" className="text-sm font-medium">
              From
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency} onOpenChange={() => setFromSearch("")}>
              <SelectTrigger id="from-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <div className="sticky top-0 bg-background p-2">
                  <Input
                    placeholder="Search currencies..."
                    className="h-8"
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                  />
                </div>
                {filteredFromCurrencies.length > 0 ? (
                  filteredFromCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">No currencies found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" onClick={handleSwap} className="mt-6" aria-label="Swap currencies">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <label htmlFor="to-currency" className="text-sm font-medium">
              To
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency} onOpenChange={() => setToSearch("")}>
              <SelectTrigger id="to-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <div className="sticky top-0 bg-background p-2">
                  <Input
                    placeholder="Search currencies..."
                    className="h-8"
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                  />
                </div>
                {filteredToCurrencies.length > 0 ? (
                  filteredToCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">No currencies found</div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result !== null && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-lg font-medium">
              {amount} {fromCurrency} =
            </p>
            <p className="text-2xl font-bold">
              {getSymbol(toCurrency)}
              {result.toFixed(2)} {toCurrency}
            </p>
            {rate && (
              <p className="text-sm text-muted-foreground mt-2">
                1 {fromCurrency} = {getSymbol(toCurrency)}
                {rate.toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleConvert} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

