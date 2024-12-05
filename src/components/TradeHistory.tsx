import React from 'react';
import { format } from 'date-fns';
import { History, Trash2, AlertTriangle } from 'lucide-react';
import type { Trade } from '../types/trade';

interface TradeHistoryProps {
  trades: Trade[];
  onDelete: (id: string) => void;
}

function calculateRiskRatio(trade: Trade): number {
  const { entryPrice, takeProfit, stopLoss, type } = trade;
  const isLong = type === 'long';
  const multiplier = isLong ? 1 : -1;
  
  const potentialProfit = Math.abs(multiplier * (takeProfit - entryPrice));
  const potentialLoss = Math.abs(multiplier * (stopLoss - entryPrice));
  
  return Number((potentialProfit / potentialLoss).toFixed(2));
}

function getRiskColor(ratio: number, leverage: number): string {
  const adjustedRatio = ratio * (1 / leverage);
  
  if (leverage >= 50 || adjustedRatio <= 0.5) return 'text-red-600';
  if (leverage >= 20 || adjustedRatio <= 1) return 'text-orange-600';
  if (adjustedRatio <= 2) return 'text-yellow-600';
  return 'text-green-600';
}

export function TradeHistory({ trades, onDelete }: TradeHistoryProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <History className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Historique des Trades</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix d'entrée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Take Profit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Loss</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Levier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Ratio R/R</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.map((trade) => {
              const riskRatio = calculateRiskRatio(trade);
              const riskColor = getRiskColor(riskRatio, trade.leverage);
              
              return (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(trade.timestamp, 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.asset}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    trade.type === 'long' ? 'bg-green-100 text-green-800' : trade.type === 'short' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {trade.type ? trade.type.toUpperCase() : 'LONG'}
                  </span>

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.amount} €</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.entryPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{trade.takeProfit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{trade.stopLoss}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.leverage}x</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`${riskColor} font-semibold`}>1:{riskRatio}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onDelete(trade.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}