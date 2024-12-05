export type TradeType = 'long' | 'short';
export type RiskLevel = 'very_high' | 'high' | 'medium' | 'low' | 'very_low';

export interface Trade {
  id: string;
  amount: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  leverage: number;
  timestamp: number;
  asset: string;
  type: TradeType;
}

export interface TradeCalculation {
  potentialProfit: number;
  potentialLoss: number;
  profitPercentage: number;
  lossPercentage: number;
  riskRewardRatio: number;
  riskLevel: RiskLevel;
}