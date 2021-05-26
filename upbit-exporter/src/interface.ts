export interface TickerCacheValue {
  tradePrice?: number;
  accTradePrice?: number;
  acc_ask_volume?: number;
  acc_bid_volume?: number;
}

/*
// Source message
{ type: 'ticker',
  code: 'KRW-ETH',
  opening_price: 3315000,
  high_price: 3439000,
  low_price: 3214000,
  trade_price: 3438000,
  prev_closing_price: 3316000,
  acc_trade_price: 165517266387.9698,
  change: 'RISE',
  change_price: 122000,
  signed_change_price: 122000,
  change_rate: 0.0367913148,
  signed_change_rate: 0.0367913148,
  ask_bid: 'ASK',
  trade_volume: 0.14912019,
  acc_trade_volume: 49693.22506728,
  trade_date: '20210526',
  trade_time: '022829',
  trade_timestamp: 1621996109000,
  acc_ask_volume: 25003.87864188,
  acc_bid_volume: 24689.3464254,
  highest_52_week_price: 5410000,
  highest_52_week_date: '2021-05-12',
  lowest_52_week_price: 240000,
  lowest_52_week_date: '2020-05-26',
  trade_status: null,
  market_state: 'ACTIVE',
  market_state_for_ios: null,
  is_trading_suspended: false,
  delisting_date: null,
  market_warning: 'NONE',
  timestamp: 1621996109778,
  acc_trade_price_24h: 1087249958864.9503,
  acc_trade_volume_24h: 341913.53393546,
  stream_type: 'REALTIME' }
*/
