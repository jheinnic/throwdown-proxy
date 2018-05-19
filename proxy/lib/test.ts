import {proxyClient} from 'mockserver-client';
import {writeFileSync} from 'fs';
import {CardMap} from './CardMap';
import {CardUnit} from './CardUnit';
import {CardRef, WireCardDef} from './card_types';

interface MatchData
{
   battle_id: string
   enemy_name: string;
   enemy_guild_name: string;
   enemy_max_health: number;
   enemy_deck_count: number;
   player_deck_count: number;
   enemy_deck?: CardUnit[];
   player_deck?: CardUnit[];
}

const requestDef = {
   path: '/api.php',
   method: 'POST',
   queryStringParameters: {
      message: ['fightGuildWar']
   }
};

const proxyControl = proxyClient('localhost', 1090);
const cardMap: CardMap = new CardMap();

function handleGameHandshake(recordedResponse): void
{
   if (recordedResponse) {
      let jsonMessage: { battle_data: any };
      try {
         jsonMessage = JSON.parse(recordedResponse[0].httpResponse.body);
         console.log("Handle: ", jsonMessage);

         let {
            battle_id,
            card_map,
            enemy_name,
            defender_deck_count,
            attacker_deck_count,
            attack_deck,
            enemy_max_health,
            enemy_guild_name
         } = jsonMessage.battle_data;

         const matchData: MatchData = {
            battle_id,
            enemy_name,
            enemy_guild_name,
            enemy_max_health,
            enemy_deck_count: defender_deck_count,
            player_deck_count: attacker_deck_count,
         };

         console.log('Extract: ', matchData);
         attack_deck = Object.values(attack_deck);
         card_map = Object.values(card_map)
            .slice(attacker_deck_count);

         const cardRefs: CardRef[] = attack_deck.concat(card_map) as CardRef[];
         const deckPromise: Promise<CardUnit[]> = Promise.all(
            cardRefs.map(function(cardRef) {
               return cardMap.lookupCard(cardRef);
            }));

         deckPromise
            .catch(console.error)
            .then(function (resolvedCards: CardUnit[]) {
               console.log("Resolve: ", resolvedCards);

               matchData.player_deck = resolvedCards.splice(0, matchData.player_deck_count);
               matchData.enemy_deck = resolvedCards;

               writeFileSync(
                  __dirname + '/../matchDecks/' + matchData.battle_id + '.json',
                  JSON.stringify(matchData));
            });
      } catch (e) {
         console.error(e);
      }
   // } else {
   //    console.error('No response after {} tries...  Exiting!');
   //    return;
   }

   scheduleCheck();
}

function doCheck()
{
   // console.log('doCheck');
   proxyControl.retrieveRecordedExpectations(requestDef)
      // .catch(handleError)
      .then(handleGameHandshake)
      .done();
   // console.log('didCheck');
}

function scheduleCheck()
{
   // console.log('scheduleCheck');
   proxyControl.reset();
   setTimeout(doCheck, 1000);
}

function doSetup()
{
   // console.log('doSetup');
   proxyControl.verify(requestDef);
   scheduleCheck();
}

console.log('Run');

const foo3 = require('./foo3');
const recordedResponse = [{
   httpResponse: {
      body: JSON.stringify(foo3)
   }
}];
handleGameHandshake(recordedResponse);

console.log('Ran');

