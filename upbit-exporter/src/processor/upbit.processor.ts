import * as _ from 'lodash';
import { Upbit } from 'upbit-js';
import { ExchangeGauge } from '../prometheus/exchange-gauge';
import { TickerCache } from '../storage/ticker-cache';

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

  public async getMarketAllFromServer() {
    this.upbit.updateMarketAll();
    const marketList =  await this.upbit.marketAll();
    return marketList;
  }

}
