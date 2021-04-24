'use strict';

module.exports = {
   networks: {
      local: {
         host: 'localhost',
         port: 8545,
         gas: 5000000,
         from: '0x13b285a259f914f257ee899e67bdb5f4171134a7',
         network_id: '36680110'
      },
      docker: {
         host: 'localhost',
         port: 8546,
         gas: 5000000,
         from: '0x13b285a259f914f257ee899e67bdb5f4171134a7',
         network_id: '3668100'
      }
   }
};
