function buildMembrane(___utilities___) {
   "use strict";

   const rvMembrane = new Membrane({
      logger: (___utilities___.logger || null),
      passThroughFilter: (function() {
         const items = Membrane.Primordials.slice(0);

         {
            const s = new Set(items);
            return s.has.bind(s);
         }
      })(),

   });

   {
      const ___graph___ = rvMembrane.getHandlerByName(Symbol("wet"), { mustCreate: true });
      ___graph___.passThroughFilter = (function() {
         const items = Membrane.Primordials.slice(0);

         {
            const s = new Set(items);
            return s.has.bind(s);
         }
      })()
      ;
      const ___listener___ = rvMembrane.modifyRules.createDistortionsListener();
      ___listener___.addListener(canvasOne, "value", {
         "filterOwnKeys": [],
         "proxyTraps": [
            "getPrototypeOf",
            "isExtensible",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "get",
            "set",
            "deleteProperty",
            "ownKeys",
            "apply",
            "construct"
         ],
         "storeUnknownAsLocal": true,
         "requireLocalDelete": true,
         "useShadowTarget": false
      });

      ___listener___.addListener(canvasTwo, "value", {
         "filterOwnKeys": [],
         "proxyTraps": [
            "getPrototypeOf",
            "isExtensible",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "get",
            "set",
            "deleteProperty",
            "ownKeys",
            "apply",
            "construct"
         ],
         "storeUnknownAsLocal": true,
         "requireLocalDelete": true,
         "useShadowTarget": false
      });

      ___listener___.bindToHandler(___graph___);
   }

   {
      const ___graph___ = rvMembrane.getHandlerByName(Symbol("dry"), { mustCreate: true });
      ___graph___.passThroughFilter = (function() {
         const items = Membrane.Primordials.slice(0);

         {
            const s = new Set(items);
            return s.has.bind(s);
         }
      })()
      ;
      const ___listener___ = rvMembrane.modifyRules.createDistortionsListener();
      ___listener___.addListener(ResourceAdapter, "value", {
         "filterOwnKeys": [
            "arguments",
            "caller",
            "length",
            "name",
            "prototype"
         ],
         "proxyTraps": [
            "getPrototypeOf",
            "isExtensible",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "get",
            "set",
            "deleteProperty",
            "ownKeys",
            "apply",
            "construct"
         ],
         "storeUnknownAsLocal": true,
         "requireLocalDelete": true,
         "useShadowTarget": false,
         "truncateArgList": false
      });

      ___listener___.addListener(ResourceAdapter, "prototype", {
         "filterOwnKeys": [
            "constructor",
            "reserve",
            "release",
            "getReservation"
         ],
         "proxyTraps": [
            "getPrototypeOf",
            "isExtensible",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "get",
            "set",
            "deleteProperty",
            "ownKeys",
            "apply",
            "construct"
         ],
         "storeUnknownAsLocal": true,
         "requireLocalDelete": true,
         "useShadowTarget": false
      });

      ___listener___.addListener(ResourceAdapter.prototype.getReservation, "value", {
         "filterOwnKeys": [
            "arguments",
            "caller",
            "length",
            "name",
            "prototype"
         ],
         "proxyTraps": [
            "getPrototypeOf",
            "isExtensible",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "get",
            "set",
            "deleteProperty",
            "ownKeys",
            "apply",
            "construct"
         ],
         "storeUnknownAsLocal": true,
         "requireLocalDelete": true,
         "useShadowTarget": false,
         "truncateArgList": false
      });

      ___listener___.bindToHandler(___graph___);
   }

   return rvMembrane;
}
