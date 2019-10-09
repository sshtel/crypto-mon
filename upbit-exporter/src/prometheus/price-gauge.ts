import * as _ from 'lodash';
import * as client from 'prom-client';
import { RedisClient } from 'redis';
import { UpbitProcessor } from '../processor/upbit.processor';
import { constant } from '../util/constant';
import { getPreRedisKey } from '../util/redis-key';
export class PriceGauge {
  private register;
  private gauge;

  constructor() {
    this.register = new client.Registry();
    this.gauge = new client.Gauge({
      name: 'my_metric_name',
      help: 'my_metric_help',
      labelNames: ['market', 'info']
    });
    this.register.registerMetric(this.gauge);

  }

  public setMetric(market: string, tradePrice: number) {
    this.gauge.set({market, info: 'trade_price'}, tradePrice);
  }

  public getMetrics() {
    // client.register.clear();
    // client.register.resetMetrics();
    // client.Registry.merge(this.getSampleRegistries());
    const lists = constant.UPBIT_KRW_MARKET_SQUADS[0];
    const redisClient: RedisClient = UpbitProcessor.getRedis();
    for (const market of lists) {
      const key = getPreRedisKey(market);
      try {
        redisClient.hget(key, 'trade_price', (err, value) => {
          let num = +(value || NaN);
          if (_.isNaN(num)) num = 0;
          this.gauge.set({market, info: 'trade_price'}, num);
        });
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
