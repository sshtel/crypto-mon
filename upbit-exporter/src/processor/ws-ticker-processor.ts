import { WsTicker } from 'upbit-js';
import { TickerCache } from '../storage/ticker-cache';
import { UpbitProcessor } from './upbit.processor';

export class WsTickerProcessor {
  private ticker: WsTicker;
  constructor(codes: string[]) {
    this.ticker = new WsTicker(codes, { open: this.open, close: this.close, message: this.message });
  }

  public test() {
    console.log(this.ticker.getObject('KRW-BTC'));
  }
  private open() {
    console.log('open');
  }
  private close() {
    console.log('close');
  }

  private message(value) {
    const obj = JSON.parse(value);
    const tickerCache: TickerCache = UpbitProcessor.getTickerCache();
    if (tickerCache !== undefined ) {
      tickerCache.update(obj.code, {
        tradePrice: obj.trade_price,
        accTradePrice: obj.acc_trade_price,
        acc_ask_volume: obj.acc_ask_volume,
        acc_bid_volume: obj.acc_bid_volume
      } );
    }
  }

}
