import * as bluebird from 'bluebird';
import * as redisOrigin from 'redis';
export const redis = bluebird.promisifyAll(redisOrigin);
