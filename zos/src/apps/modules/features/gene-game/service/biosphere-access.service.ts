const deck = {
   'ALTER_MAINTENANCE_CYCLE_INTERVAL': { weight: 120 },
   'ALTER_MAINTENANCE_CYCLE_DURATION': { weight: 120 },
   'ALTER_ROW_MAJOR_MOVEMENT_INTERVAL': { weight: 250 },
   'ALTER_ROW_MAJOR_MOVEMENT_DISTANCE': { weight: 250 },
   'ALTER_COLUMN_MAJOR_MOVEMENT_INTERVAL': { weight: 250 },
   'ALTER_COLUMN_MAJOR_MOVEMENT_DISTANCE': { weight: 250 },
   'ALTER_SOURCE_DEPLETED_EVENT_POLICY': { weight: 100 },
   'ALTER_TRANSFER_FLOW_INCREASE_INTERVAL': { weight: 100 },
   'ALTER_TRANSFER_FLOW_INCREASE_DEGREE': { weight: 80 },
   'ALTER_MAXIMUM_TRANSFER_FLOW': { weight: 80 },
   'ALTER_TRANSFER_FLOW_OVER_LIMIT_POLICY': { weight: 100 },
   'ALTER_TRANSFER_FLOW_DECREASE_INTERVAL': { weight: 180 },
   'ALTER_TRANSFER_FLOW_DECREASE_DEGREE': { weight: 120 },
   'ALTER_MINIMUM_TRANSFER_FLOW': { weight: 120 },
   'ALTER_TRANSFER_FLOW_BELOW_LIMIT_POLICY': { weight: 100 },
   'TRIGGER_FLOW_REVERSAL_EVENT': { weight: 120 },
   'TRIGGER_INTER_PREFIX_ROW_SWAP_EVENT': { weight: 100 },
   'TRIGGER_INTER_PREFIX_COL_SWAP_EVENT': { weight: 100 },
   'TRIGGER_INTER_SUFFIX_ROW_SWAP_EVENT': { weight: 100 },
   'TRIGGER_INTER_SUFFIX_COL_SWAP_EVENT': { weight: 100 },
   'TRIGGER_PREFIX_SUFFIX_ROW_SWAP_EVENT': { weight: 50 },
   'TRIGGER_PREFIX_SUFFIX_COL_SWAP_EVENT': { weight: 50 },
   'TRIGGER_SKIP_PEER_TURNS_EVENT': { weight: 50 },
   'TRIGGER_REPEAT_PEER_TURNS_EVENT': { weight: 120 },
   'TRIGGER_IMMEDIATE_MAINTENANCE_EVENT': { weight: 100 },
   'TRIGGER_IMMEDIATE_MOVEMENT_EVENT': { weight: 100 },
   'TRIGGER_PREFIX_SUFFIX_SWAP': { weight: 50 }
};

// @ts-ignore
import HashRing from 'hashring';

const hr1 = new HashRing(deck);

const sequence: number[] = [];
for (let ii=0; ii< 185; ii++) {
   if (ii == 0) { continue }

   const from = sequence[ii-1];
   const to = sequence[ii];
   const path = from + " => " + to;
   const source = from + "::" + (ii-1);
   const dest = to + "::" + ii;

   const pathHand = hr1.range(path, 3);
   const sourceHand = hr1.range(source, 3);
   const destHand = hr1.range(dest, 3);

   console.log(ii, path, pathHand, source, sourceHand, dest, destHand);
}

