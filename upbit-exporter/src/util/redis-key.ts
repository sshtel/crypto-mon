export function getPreRedisKey(market: string) {
  return `UPBIT:${market}`;
}

export function getPreRedisKeySpecialAltcoin() {
  return `UPBIT:ALT`;
}
