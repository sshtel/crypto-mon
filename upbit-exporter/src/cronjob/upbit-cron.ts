export class UpbitCron {
  private handlers: Object[] = [];

  private isRun = false;
  private period;

  constructor() {
    this.period = +(process.env.CRON_PERIOD || 5000);
    console.log('period...........' + this.period);
  }

  public async run() {
    if (this.isRun) return;
    this.isRun = true;
    await this.task();
  }

  public stop() {
    this.isRun = false;
  }

  public register(handler: Object) {
    this.handlers.push(handler);
  }

  public setPeriod(period: number) {
    if (period < 10) return;
    this.period = period;
  }

  private async task() {
    if (!this.isRun) return;
    for (const handler of this.handlers) {
      if (typeof handler === 'function') await handler();
    }
    setTimeout(() => {
      this.task();
    }, this.period);
  }

}
