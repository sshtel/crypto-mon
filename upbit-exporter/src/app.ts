import * as express from 'express';
import { UpbitCron } from './cronjob/upbit-cron';
import { UpbitProcessor } from './processor/upbit.processor';

const app = express();
const upbit = UpbitProcessor.getObject();
app.get('/metrics', async (req, res) => {
  res.send(await upbit.getExchangeGauge().getMetrics());
});

app.get('/console', async (req, res) => {
  console.log(await upbit.getExchangeGauge().getMetrics());
});

async function start() {
  const port = 3001;
  const cron = new UpbitCron();
  cron.register(UpbitProcessor.getObject().updateKrwMarketCandleJob);
  cron.register(UpbitProcessor.getObject().updateBtcMarketCandleJob);
  cron.run();

  // Listen the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

}
start();
