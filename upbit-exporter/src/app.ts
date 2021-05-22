import * as express from 'express';
// import { UpbitCron } from './cronjob/upbit-cron';
import { UpbitProcessor } from './processor/upbit.processor';
import { WsTickerProcessor } from './processor/ws-ticker-processor';
import { constant } from './util/constant';

const app = express();
const upbit = UpbitProcessor.getObject();

upbit.getMarketAllFromServer().then(v => {
  constant.updateFromMarketAll(v);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

const ticker = new WsTickerProcessor(constant.UPBIT_ALL_KRW_MARKET_LIST);
ticker.test();
app.get('/metrics', async (req, res) => {
  res.send(await upbit.getExchangeGauge().getMetrics());
});

app.get('/console', async (req, res) => {
  console.log(await upbit.getExchangeGauge().getMetrics());
});

async function start() {
  const port = 3001;
  // const cron = new UpbitCron();
  // cron.register(UpbitProcessor.getObject().updateKrwMarketCandleJob);
  // cron.register(UpbitProcessor.getObject().updateBtcMarketCandleJob);
  // cron.run();

  // Listen the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

}
start();
