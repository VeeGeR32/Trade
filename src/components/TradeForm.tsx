import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Percent, DollarSign, LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import type { Trade, TradeType } from '../types/trade';

interface TradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
}

const LEVERAGE_OPTIONS = [1, 2, 3, 4, 5, 10, 20, 50, 100, 150];
const ASSETS = ['BTC/EUR', 'ETH/EUR', 'BNB/EUR', 'SOL/EUR', 'ADA/EUR'];

export function TradeForm({ onSubmit }: TradeFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    entryPrice: '',
    takeProfit: '',
    stopLoss: '',
    leverage: '1',
    asset: 'BTC/EUR',
    type: 'long' as TradeType
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { entryPrice, takeProfit, stopLoss, type } = formData;
    const entry = Number(entryPrice);
    const tp = Number(takeProfit);
    const sl = Number(stopLoss);

    if (type === 'long') {
      if (tp <= entry) {
        newErrors.takeProfit = 'Le Take Profit doit être supérieur au prix d\'entrée';
      }
      if (sl >= entry) {
        newErrors.stopLoss = 'Le Stop Loss doit être inférieur au prix d\'entrée';
      }
      if (tp <= sl) {
        newErrors.general = 'Le Take Profit doit être supérieur au Stop Loss';
      }
    } else {
      if (tp >= entry) {
        newErrors.takeProfit = 'Le Take Profit doit être inférieur au prix d\'entrée';
      }
      if (sl <= entry) {
        newErrors.stopLoss = 'Le Stop Loss doit être supérieur au prix d\'entrée';
      }
      if (tp >= sl) {
        newErrors.general = 'Le Take Profit doit être inférieur au Stop Loss';
      }
    }

    // Vérification de la distance minimale
    const minDistance = entry * 0.001; // 0.1% minimum de distance
    if (Math.abs(tp - sl) < minDistance) {
      newErrors.general = 'La distance entre TP et SL doit être d\'au moins 0.1%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      amount: Number(formData.amount),
      entryPrice: Number(formData.entryPrice),
      takeProfit: Number(formData.takeProfit),
      stopLoss: Number(formData.stopLoss),
      leverage: Number(formData.leverage),
      asset: formData.asset,
      type: formData.type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg animate-fade">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2 flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'long' }))}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors duration-200 ${
              formData.type === 'long'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Long
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'short' }))}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors duration-200 ${
              formData.type === 'short'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Short
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Montant (€)
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="input-field"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <LineChart className="inline w-4 h-4 mr-1" />
            Prix d'entrée
          </label>
          <input
            type="number"
            value={formData.entryPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
            className="input-field"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <ArrowUpCircle className="inline w-4 h-4 mr-1 text-green-500" />
            Take Profit
          </label>
          <input
            type="number"
            value={formData.takeProfit}
            onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: e.target.value }))}
            className={`input-field ${errors.takeProfit ? 'border-red-500' : ''}`}
            required
            min="0"
            step="0.01"
          />
          {errors.takeProfit && (
            <p className="text-red-500 text-sm mt-1">{errors.takeProfit}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <ArrowDownCircle className="inline w-4 h-4 mr-1 text-red-500" />
            Stop Loss
          </label>
          <input
            type="number"
            value={formData.stopLoss}
            onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
            className={`input-field ${errors.stopLoss ? 'border-red-500' : ''}`}
            required
            min="0"
            step="0.01"
          />
          {errors.stopLoss && (
            <p className="text-red-500 text-sm mt-1">{errors.stopLoss}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Percent className="inline w-4 h-4 mr-1" />
            Effet de levier
          </label>
          <select
            value={formData.leverage}
            onChange={(e) => setFormData(prev => ({ ...prev, leverage: e.target.value }))}
            className="input-field"
          >
            {LEVERAGE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Asset
          </label>
          <select
            value={formData.asset}
            onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
            className="input-field"
          >
            {ASSETS.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 ease-in-out font-medium"
      >
        Calculer
      </button>
    </form>
  );
}