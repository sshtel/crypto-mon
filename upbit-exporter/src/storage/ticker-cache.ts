
import * as _ from 'lodash';
import * as redis from 'redis-bluebird';
import { TickerCacheValue } from '../interface';
import { getPreRedisKey } from '../util/redis-key';
import * as TIME from '../util/time-unit';

export class TickerCache {
  private client: redis.RedisClient;
  private host = process.env.REDIS_HOST || 'localhost';
  private port = +(process.env.REDIS_PORT || 6379);

  constructor() {
    this.client = redis.createClient(this.port, this.host);
  }

  public update(market: string, value: TickerCacheValue) {
    const key = getPreRedisKey(market);
    this.client.hset(key, 'trade_price', value.tradePrice + '');
    this.client.hset(key, 'candle_acc_trade_price', value.accTradePrice + '');
    this.client.hset(key, 'acc_ask_volume', value.acc_ask_volume + '');
    this.client.hset(key, 'acc_bid_volume', value.acc_bid_volume + '');
    this.client.expire(key, TIME.TEN_MINUTE_MS);
  }

  public async get(market: string): Promise<TickerCacheValue | undefined> {
    const key = getPreRedisKey(market);
    try {
      let tradePrice: number | undefined = +(await this.client.hgetAsync(key, 'trade_price'));
      let accTradePrice: number | undefined = +(await this.client.hgetAsync(key, 'candle_acc_trade_price'));
      let acc_ask_volume: number | undefined = +(await this.client.hgetAsync(key, 'acc_ask_volume'));
      let acc_bid_volume: number | undefined = +(await this.client.hgetAsync(key, 'acc_bid_volume'));
      if (_.isNaN(tradePrice)) tradePrice = undefined;
      if (_.isNaN(accTradePrice)) accTradePrice = undefined;
      if (_.isNaN(acc_ask_volume)) acc_ask_volume = undefined;
      if (_.isNaN(acc_bid_volume)) acc_bid_volume = undefined;

      return {
        tradePrice,
        accTradePrice,
        acc_ask_volume,
        acc_bid_volume
      };
    } catch (e) {
      console.error(e);
    }
  }

}
