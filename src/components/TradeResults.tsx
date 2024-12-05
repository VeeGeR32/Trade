import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import type { TradeCalculation } from '../types/trade';

interface TradeResultsProps {
  calculation: TradeCalculation;
}

const getRiskLevelInfo = (riskLevel: string) => {
  switch (riskLevel) {
    case 'very_high':
      return { color: 'red-600', bg: 'red-50', text: 'Très risqué' };
    case 'high':
      return { color: 'orange-600', bg: 'orange-50', text: 'Risqué' };
    case 'medium':
      return { color: 'yellow-600', bg: 'yellow-50', text: 'Moyen' };
    case 'low':
      return { color: 'green-600', bg: 'green-50', text: 'Modéré' };
    case 'very_low':
      return { color: 'emerald-600', bg: 'emerald-50', text: 'Très modéré' };
    default:
      return { color: 'gray-600', bg: 'gray-50', text: 'Non défini' };
  }
};

export function TradeResults({ calculation }: TradeResultsProps) {
  const {
    potentialProfit,
    potentialLoss,
    profitPercentage,
    lossPercentage,
    riskRewardRatio,
    riskLevel,
  } = calculation;

  const riskInfo = getRiskLevelInfo(riskLevel);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ArrowUpCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium text-green-700">Profit Potentiel</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">{potentialProfit.toFixed(2)} €</p>
          <p className="text-sm text-green-600">+{profitPercentage.toFixed(2)}%</p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ArrowDownCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-medium text-red-700">Perte Potentielle</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">{potentialLoss.toFixed(2)} €</p>
          <p className="text-sm text-red-600">{lossPercentage.toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-blue-700">Ratio Risque/Rendement</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">1:{riskRewardRatio.toFixed(2)}</p>
        </div>

        <div className={`p-4 bg-${riskInfo.bg} rounded-lg`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`w-5 h-5 text-${riskInfo.color}`} />
            <h3 className={`text-lg font-medium text-${riskInfo.color}`}>Niveau de Risque</h3>
          </div>
          <p className={`mt-2 text-2xl font-bold text-${riskInfo.color}`}>{riskInfo.text}</p>
        </div>
      </div>
    </div>
  );
}