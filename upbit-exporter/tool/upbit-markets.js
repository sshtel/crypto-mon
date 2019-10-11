const Upbit = require('upbit-js').Upbit;
const upbit = new Upbit();

// const upbit = new Upbit();
upbit.marketAll().then( value => {
  value.forEach( item => {
    if(item.market.includes('USDT-')) {
      console.log(`'${item.market}',`);
    }

  });
});
