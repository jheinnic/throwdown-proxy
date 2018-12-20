   'use strict';
   const Membrane = require('es-membrane').Membrane;

   const rvMembrane = new Membrane({
   });

const Canvas =  require('canvas').Canvas;
const canvas = new Canvas(100, 100);

      const wet2 = rvMembrane.getHandlerByName('wet', {mustCreate: true});
      const dry2 = rvMembrane.getHandlerByName('dry', {mustCreate: true});
/*
      const wetListen = rvMembrane.modifyRules.createDistortionsListener();
      wetListen.addListener(canvas, 'value', {
         'filterOwnKeys': [],
         'proxyTraps': [
            'getPrototypeOf',
            'isExtensible',
            'getOwnPropertyDescriptor',
            'defineProperty',
            'has',
            'get',
            'set',
            'deleteProperty',
            'ownKeys',
            'apply',
            'construct'
         ],
         'storeUnknownAsLocal': true,
         'requireLocalDelete': true,
         'useShadowTarget': false
      });
const ch = rvMembrane.modifyRules.createChainHandler();
*/

const alt = rvMembrane.convertArgumentToProxy(wet, dry, canvas);
wet.revokeEverything();
const ctx = alt.getContext('2d')
ctx.fillStyle = '#88da10';
ctx.fillRect(30, 30, 50, 50);
dry.revokeEverything();
console.log(canvas.toDataURL());
ctx.fillRec(70,20, 10, 10);
console.log(canvas.toDataURL());

