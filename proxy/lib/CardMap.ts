import {Parser} from 'xml2js';
import {inspect} from 'util';
import {readFile} from 'fs';
import {CardUnit} from './CardUnit';
import {CardType} from './CardType';
import {WireCardDef, CardRef} from './card_types';

export class CardMap
{
   private mapPromise: Promise<CardMapData>;

   constructor()
   {
      this.mapPromise = new Promise<CardMapData>(function (
         resolve: (value?: CardMapData | PromiseLike<CardMapData>) => void,
         reject: (reason?: any) => void)
      {
         let results = [];

         function doParseXml(err: NodeJS.ErrnoException, data: Buffer)
         {
            if (err) {
               console.error(err);
               return;
            }
            const xmlParser = new Parser();
            xmlParser.parseString(data, function (err: any, result: any) {
               if (err) {
                  console.error(err);
                  return reject(err);
               }

               results.push(
                  result.root.unit.reduce(
                     function (agg: CardMapData, item: WireCardDef) {
                        // console.log('Resolve From Definition: ', inspect(item, false, 5, true));
                        let combo_card_id = parseInt(item.combo_card_id ? item.combo_card_id[0] : '-1');
                        console.log("(id: {}, combo_id: {}) => {}", item.id[0], combo_card_id, item.name[0]);
                        agg[item.id[0]] = new CardType(item);
                        // console.log('Resolve To Type: ', inspect(agg[item.id[0]], false, 5, true));
                        return agg;
                     }, {} as CardMapData
                  )
               );

               console.log('Tag');

               if (results.length === 2) {
                  return resolve({
                     ...results[0],
                     ...results[1]
                  })
               }
            });

            console.log('doParse');
         }

         try {
            readFile(__dirname + '/../cards_finalform.xml', doParseXml);
            readFile(__dirname + '/../cards.xml', doParseXml);
            // readFile(__dirname + '/../combos.xml', doParseXml);
         } catch (e) {
            return reject(e);
         }
      });
   }

   public lookupCard( cardRef: CardRef ): Promise<CardUnit> {
      console.log('Lookup: ', cardRef.unit_id, cardRef.level);

      return this.mapPromise.then( ( units: CardMapData ) => {
         // console.log(id, level, units);
         // let {name, health, attack, type, skills, trait}  = unit;
         // let retVal = { name, type, trait, health, attack, skills };
         // if (unit.rarity) {
         //    retVal.rarity = unit.rarity;
         // }

         const type: CardType = units[cardRef.unit_id];
         const retVal: CardUnit = new CardUnit(type, parseInt(cardRef.level));
         console.log('Found: ', type.name, retVal);
         return retVal;
      } );
   }
}

interface CardMapData
{
   [K: string]: CardType;
}

