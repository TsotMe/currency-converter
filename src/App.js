import { useEffect, useState, useRef } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useState(amount);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(Number(amount));
    }, 300);

    return () => clearInterval(timer);
  }, [amount]);

  useEffect(() => {
    async function convert() {
      setIsLoading(true);
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${debouncedAmount}&from=${from}&to=${to}`
      );

      const data = await res.json();

      setOutput(data.rates[to]);
      setIsLoading(false);
    }

    if (from === to) {
      return setOutput(debouncedAmount);
    }

    convert();
  }, [debouncedAmount, from, to]);

  const amountInputRef = useRef(null);
  useEffect(() => {
    amountInputRef.current.focus();
  }, []);

  return (
    <div>
      <input
        type="text"
        ref={amountInputRef}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{isLoading || !debouncedAmount ? "..." : `${output} ${to}`}</p>
    </div>
  );
}
