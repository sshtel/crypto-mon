import * as _ from 'lodash';
import * as client from 'prom-client';
import { UpbitProcessor } from '../processor/upbit.processor';
import { constant } from '../util/constant';
export class ExchangeGauge {
  private gauge: client.Gauge;
  constructor(name: string, help: string) {
    this.gauge = new client.Gauge({
      name,
      help,
      labelNames: ['market', 'info']
    });
    client.register.registerMetric(this.gauge);
  }

  public setMetric(
    market: string,
    { tradePrice,
      acc_trade_price,
      acc_ask_volume,
      acc_bid_volume }:
       { tradePrice?: number,
         acc_trade_price?: number,
         acc_ask_volume?: number,
         acc_bid_volume?: number
        }) {
    if (tradePrice) this.gauge.set({market, info: 'trade_price'}, tradePrice);
    if (acc_trade_price) this.gauge.set({market, info: 'acc_trade_price'}, acc_trade_price);
    if (acc_ask_volume) this.gauge.set({market, info: 'acc_ask_volume'}, acc_ask_volume);
    if (acc_bid_volume) this.gauge.set({market, info: 'acc_bid_volume'}, acc_bid_volume);
  }

  public async getMetrics() {
    client.register.resetMetrics();
    // console.log(client.register.metrics());
    const lists = constant.UPBIT_ALL_MARKET_LIST;
    const tickerCache = UpbitProcessor.getTickerCache();

    for (const market of lists) {
      try {
        const value = await tickerCache.get(market);
        if (!value) return;
        if (value.tradePrice) this.gauge.set({market, info: 'trade_price'}, value.tradePrice);
        if (value.accTradePrice) this.gauge.set({market, info: 'candle_acc_trade_price'}, value.accTradePrice);
        if (value.acc_ask_volume) this.gauge.set({market, info: 'acc_ask_volume'}, value.acc_ask_volume);
        if (value.acc_bid_volume) this.gauge.set({market, info: 'acc_bid_volume'}, value.acc_bid_volume);
      } catch (e) {
        console.error(e);
      }
    }
    return client.register.metrics();
  }

  // getSampleRegistries() {
  //   const gauges = [];

  //   gauge.set(Math.floor(Math.random() * 1000000));
  //   // gauge.set({mylabel1: '1', mylabel2: '2'}, Math.floor(Math.random() * 1000000), new Date());
  //   const registry = new client.Registry();
  //   registry.registerMetric(gauge);
  //   gauges.push(registry);

  //   return gauges;
  // }

}
