import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { Upbit } from 'upbit-js';
import { ExchangeGauge } from '../prometheus/exchange-gauge';
import { TickerCache } from '../storage/ticker-cache';
import { constant } from '../util/constant';

interface CandlesMinutes {
    market?: string;
    candle_date_time_utc?: string;
    candle_date_time_kst?: string;
    opening_price?: number;
    high_price?: number;
    low_price?: number;
    trade_price?: number;
    timestamp?: number;
    candle_acc_trade_price?: number;
    candle_acc_trade_volume?: number;
    unit?: number;
}

export class UpbitProcessor {

  public static getObject(): UpbitProcessor {
    if (!UpbitProcessor.upbitProcessor) {
      UpbitProcessor.upbitProcessor = new UpbitProcessor();
    }
    return UpbitProcessor.upbitProcessor;
  }

  public static getUpbit(): Upbit {
    return UpbitProcessor.getObject().upbit;
  }
  public static getTickerCache() {
    return UpbitProcessor.getObject().tickerCache;
  }
  private static upbitProcessor: UpbitProcessor | undefined = undefined;
  private upbit: Upbit = new Upbit();
  private exchangeGauge: ExchangeGauge = new ExchangeGauge('exchg_upbit', 'upbit exchange metric');
  private tickerCache: TickerCache;
  constructor() {
    this.tickerCache = new TickerCache();
  }

  public getExchangeGauge() {
    return this.exchangeGauge;
  }

  public async updateCandleJob(lists: string[]) {
    // const lists = constant.UPBIT_KRW_MARKET_SQUADS[0];
    // const lists = constant.UPBIT_KRW_MARKET_BTC_ONLY;

    const unit = 1;
    const count = 2;
    const to = undefined;
    const tickerCache = UpbitProcessor.getTickerCache();
    const exchangeGauge = UpbitProcessor.getObject().getExchangeGauge();
    for (const market of lists) {
      await Bluebird.delay(200);
      try {
        const res: CandlesMinutes[] = await UpbitProcessor.getUpbit().candlesMinutes( { unit, market, count, to});
        const curr = res[0];
        const prev = res[1];

        if (curr && curr.trade_price &&
            prev && prev.candle_acc_trade_price)
          tickerCache.update(market, { tradePrice: curr.trade_price, accTradePrice: prev.candle_acc_trade_price });

        exchangeGauge.setMetric(market, { tradePrice: curr.trade_price, volume: prev.candle_acc_trade_price});
      } catch (e) {
        console.error(e);
      }
    }
  }

  public async updateKrwMarketCandleJob() {
    await UpbitProcessor.getObject().updateCandleJob(constant.UPBIT_ALL_KRW_MARKET_LIST);
  }

  public async updateBtcMarketCandleJob() {
    await UpbitProcessor.getObject().updateCandleJob(constant.UPBIT_ALL_BTC_MARKET_LIST);
  }

}
