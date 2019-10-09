import * as express from 'express';
import { UpbitCron } from './cronjob/upbit-cron';
import { UpbitProcessor } from './processor/upbit.processor';
import { PriceGauge } from './prometheus/price-gauge';

const app = express();

const priceGauge = new PriceGauge();

UpbitProcessor.getObject().setPriceGauge(priceGauge);

app.get('/metrics', (req, res) => {
  res.send(priceGauge.getMetrics());
});

app.get('/console', (req, res) => {
  console.log(priceGauge.getMetrics());
});

async function start() {
  const port = 3001;
  const cron = new UpbitCron();
  cron.register(UpbitProcessor.getObject().updatePriceJob);
  cron.run();

  // Listen the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });

}
start();
