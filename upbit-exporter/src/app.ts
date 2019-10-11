import * as express from 'express';
import { UpbitCron } from './cronjob/upbit-cron';
import { UpbitProcessor } from './processor/upbit.processor';

const app = express();
const upbit = UpbitProcessor.getObject();
app.get('/metrics', (req, res) => {
  res.send(upbit.getExchangeGauge().getMetrics());
});

app.get('/console', (req, res) => {
  console.log(upbit.getExchangeGauge().getMetrics());
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
