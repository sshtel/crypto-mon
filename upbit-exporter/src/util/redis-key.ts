import { constant } from './constant';

export function getPreRedisKey(market: string) {
  return `UPBIT:${market}`;
}

export function getPreRedisKeySpecialKrwAllAlt() {
  return `UPBIT:${constant.UPBIT_KRW_ALLALT_SPECIAL}`;
}
