import {CardLevel, CardRarity, SeriesType, WireCardDef, WireLevelDef} from './card_types';


export const seriesTypeByIndex: SeriesType[] = [
   undefined,
   SeriesType.FAMILY_GUY,
   SeriesType.AMERICAN_DAD,
   SeriesType.BOBS_BURGERS,
   SeriesType.KING_OF_THE_HILL,
   SeriesType.FUTURAMA
];

export class CardType
{
   id: number;
   name: string;
   type: SeriesType;
   rarity: CardRarity;
   traits: ReadonlyArray<string>;
   levels: ReadonlyArray<CardLevel>;

   //  public asset_bundle: string[];
   //  public attack: string[];
   //  public health: string[];
   //  public id: string[];
   //  public name: string[];
   //  public picture: string[];
   //  public rarity: string[];
   //  public release_time: string[];
   //  public set: string[];
   //  public skill: Inst<CombatSkill>[];
   //  public trait: string[];
   //  public type: string[];
   //  public upgrade: string[];

   constructor(definition: WireCardDef)
   {
      this.id = parseInt(definition.id[0]);
      this.name = definition.name[0];
      this.type = seriesTypeByIndex[parseInt(definition.type[0])];

      // TODO: Clone traits array...
      this.traits = definition.trait;
      this.rarity = definition.rarity[0] === 'COMMON' ? CardRarity.COMMON : CardRarity.EPIC;

      const levels = [
         CardType.processLevelDef({
            level: ['1'],
            attack: definition.attack,
            health: definition.health,
            skill: definition.skill
         })
      ];

      if (definition.upgrade) {
         let lastCardLevel = levels[0];
         for (let nextLevelDef of definition.upgrade) {
            const nextCardUpgrade = CardType.processLevelDef(nextLevelDef);
            const nextCardSkills = {
               ...lastCardLevel.skills,
               ...nextCardUpgrade.skills
            };
            const nextCardLevel = {
               ...lastCardLevel,
               ...nextCardUpgrade,
               skills: nextCardSkills
            };

            levels.push(nextCardLevel);
            lastCardLevel = nextCardLevel;
         }
      }

      this.levels = levels;
   }

   private static processLevelDef(levelDef: WireLevelDef): CardLevel
   {
      // const blanks = {
      //    leech: undefined,
      //    poison: undefined,
      //    outlast: undefined,
      //    shrapnel: undefined,
      //    inspire: undefined,
      //    berserk: undefined,
      //    invigorate: undefined,
      //    heal: undefined,
      //    pierce: undefined,
      //    rallyall: undefined,
      //    strike: undefined,
      //    counter: undefined,
      //    weakenall: undefined,
      //    healall: undefined,
      //    weaken: undefined,
      //    barrier: undefined,
      //    armored: undefined,
      //    rally: undefined
      // };

      const retVal: CardLevel = {
         level: parseInt(levelDef.level[0]),
         attack: parseInt(levelDef.attack ? levelDef.attack[0] : undefined),
         health: parseInt(levelDef.health ? levelDef.health[0] : undefined),
         skills: levelDef.skill ? levelDef.skill.map(function (value) {
            return value['$'];
         })
            .reduce(function (agg, item) {
               agg[item.id] = item;
               return agg;
            }, {}) : {}
      };

      if (!retVal.attack) {
         delete retVal.attack;
      }
      if (!retVal.health) {
         delete retVal.health;
      }
      if (!retVal.skills) {
         delete retVal.skills;
      }

      return retVal;
   }

   // public getUnit(cardRef: CardRef): CardUnit
   // {
   //    console.log("Level: ", cardRef.level);
   //    const cardType = this.levels[cardRef.level - 1];
   //
   // { health, attack, skills } = unit.upgrades[level - 2];
   // console.log("RetVal: ", unit, ", Upgrades: ", unit.upgrades[unit.level - 2]);
   // unit = {
   //    ...unit,
   //    ...unit.upgrades[unit.level - 2]
   // };
   // delete unit.upgrades;
   // }
}
