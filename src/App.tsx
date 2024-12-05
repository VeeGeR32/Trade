import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TradeForm } from './components/TradeForm';
import { TradeResults } from './components/TradeResults';
import { TradeHistory } from './components/TradeHistory';
import type { Trade, TradeCalculation, RiskLevel } from './types/trade';
import { Calculator } from 'lucide-react';

function App() {
  const [trades, setTrades] = useLocalStorage<Trade[]>('trades', []);
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [calculation, setCalculation] = useState<TradeCalculation | null>(null);

  const calculateRiskLevel = (
    riskRewardRatio: number,
    leverage: number
  ): RiskLevel => {
    const adjustedRatio = riskRewardRatio * (1 / leverage);

    if (leverage >= 50) return 'very_high';
    if (leverage >= 20) return 'high';

    if (adjustedRatio <= 0.5) return 'very_high';
    if (adjustedRatio <= 1) return 'high';
    if (adjustedRatio <= 2) return 'medium';
    if (adjustedRatio <= 3) return 'low';
    return 'very_low';
  };

  const calculateTrade = (trade: Trade): TradeCalculation => {
    const { amount, entryPrice, takeProfit, stopLoss, leverage, type } = trade;

    const isLong = type === 'long';
    const multiplier = isLong ? 1 : -1;

    const potentialProfit =
      (multiplier * (takeProfit - entryPrice) * (amount * leverage)) /
      entryPrice;
    const potentialLoss =
      (multiplier * (stopLoss - entryPrice) * (amount * leverage)) / entryPrice;
    const profitPercentage =
      multiplier * ((takeProfit - entryPrice) / entryPrice) * 100 * leverage;
    const lossPercentage =
      multiplier * ((stopLoss - entryPrice) / entryPrice) * 100 * leverage;
    const riskRewardRatio = Math.abs(potentialProfit / potentialLoss);
    const riskLevel = calculateRiskLevel(riskRewardRatio, leverage);

    return {
      potentialProfit,
      potentialLoss,
      profitPercentage,
      lossPercentage,
      riskRewardRatio,
      riskLevel,
    };
  };

  const handleTradeSubmit = (tradeData: Omit<Trade, 'id' | 'timestamp'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setTrades((prev) => [newTrade, ...prev]);
    setCurrentTrade(newTrade);
    setCalculation(calculateTrade(newTrade));

    // Simuler l'historique des prix
    const history = [newTrade.entryPrice];
    for (let i = 1; i < 20; i++) {
      const lastPrice = history[i - 1];
      const change = (Math.random() - 0.5) * 2 * 0.01 * lastPrice;
      history.push(lastPrice + change);
    }
    setPriceHistory(history);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Calculateur de Trading
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Analysez vos trades et suivez vos performances
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <TradeForm onSubmit={handleTradeSubmit} />

          {calculation && <TradeResults calculation={calculation} />}
          {trades.length > 0 && (
            <TradeHistory trades={trades} onDelete={handleDeleteTrade} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
