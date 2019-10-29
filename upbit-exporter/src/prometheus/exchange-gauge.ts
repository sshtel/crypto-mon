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

  public setMetric(market: string, { tradePrice, volume }: { tradePrice?: number, volume?: number}) {
    if (tradePrice) this.gauge.set({market, info: 'trade_price'}, tradePrice);
    if (volume) this.gauge.set({market, info: 'volume'}, volume);
  }

  public async getMetrics() {
    client.register.resetMetrics();
    console.log(client.register.metrics());
    const lists = constant.UPBIT_ALL_KRW_MARKET_LIST;
    const tickerCache = UpbitProcessor.getTickerCache();

    for (const market of lists) {
      try {
        const value = await tickerCache.get(market);
        if (value && value.tradePrice) this.gauge.set({market, info: 'trade_price'}, value.tradePrice);
        if (value && value.accTradePrice) this.gauge.set({market, info: 'candle_acc_trade_price'}, value.accTradePrice);
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
