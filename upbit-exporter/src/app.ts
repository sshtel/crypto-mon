import * as express from 'express';
import { UpbitCron } from './cronjob/upbit-cron';
import { UpbitProcessor } from './processor/upbit.processor';
import { WsTickerProcessor } from './processor/ws-ticker-processor';
import { constant } from './util/constant';

import * as _ from 'lodash';

const app = express();
const upbit = UpbitProcessor.getObject();

upbit.getMarketAllFromServer().then(v => {
  constant.updateFromMarketAll(v);
  const AllMarket = constant.UPBIT_ALL_MARKET_LIST;
  console.log(AllMarket);
  const ticker = new WsTickerProcessor(AllMarket);
  ticker.test();

}).catch(e => {
  console.error(e);
  process.exit(1);
});
app.get('/metrics', async (req, res) => {
  res.send(await upbit.getExchangeGauge().getMetrics());
});

app.get('/console', async (req, res) => {
  console.log(await upbit.getExchangeGauge().getMetrics());
});

async function start() {
  const port = 3001;

  // Listen the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

  const cron = new UpbitCron();
  cron.register(() => {
    const tickerCache = UpbitProcessor.getTickerCache();
    tickerCache.updateAllKrwAltcoinData();
  });
  cron.run();
}
start();
