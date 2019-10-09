import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as redis from 'redis';
import { Upbit } from 'upbit-js';
import { PriceGauge } from '../prometheus/price-gauge';
import { constant } from '../util/constant';
import { getPreRedisKey } from '../util/redis-key';

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
  public static getRedis() {
    return UpbitProcessor.getObject().redisClient;
  }
  private static upbitProcessor: UpbitProcessor | undefined = undefined;
  private upbit: Upbit = new Upbit();
  private priceGauge: PriceGauge;
  private redisClient;
  private host = process.env.REDIS_HOST || 'localhost';
  private port = +(process.env.REDIS_PORT || 6379);

  constructor() {
    this.redisClient = redis.createClient(this.port, this.host);
    console.log('constructor.......');
  }

  public allJobs() {
    return [ UpbitProcessor.getObject().updatePriceJob ];
  }

  public setPriceGauge(priceGauge: PriceGauge) {
    this.priceGauge = priceGauge;
  }

  public async updatePriceJob() {
    const lists = constant.UPBIT_KRW_MARKET_SQUADS[0];
    const unit = 1;
    const count = 1;
    const to = undefined;
    const client = UpbitProcessor.getRedis();
    const priceGauge = UpbitProcessor.getObject().priceGauge;
    for (const market of lists) {
      await Bluebird.delay(100);
      try {
        const res = await UpbitProcessor.getUpbit().candlesMinutes( { unit, market, count, to});
        const obj = res[0];
        const key = getPreRedisKey(market);
        client.hmset(key, 'trade_price', obj.trade_price);
        priceGauge.setMetric(market, +obj.trade_price);
      } catch (e) {
        console.error(e);
      }
    }

  }

}
