import {CardRarity, CombatSkill, CombatSkills, SkillNames} from './card_types';
import {CardType} from './CardType';

export class CardUnit
{
   public readonly id: number;
   public readonly name: string;
   public readonly rarity: CardRarity;
   public readonly traits: ReadonlyArray<string>;
   public readonly type: string;
   public readonly level: number;
   public readonly attack: number;
   public readonly health: number;
   public readonly skills: CombatSkills;

   constructor(type: CardType, level: number) {
      this.id = type.id;
      this.name = type.name;
      this.rarity = type.rarity;
      this.traits = type.traits;
      this.type = type.type;
      this.level = level;

      console.log('Level ' + level + ' is a ' + typeof(level));

      const cardLevel = type.levels[level - 1];
      if (cardLevel) {
         this.attack = cardLevel.attack;
         this.health = cardLevel.health;
         this.skills = cardLevel.skills;
      } else {
         this.attack = -1;
         this.health = -1;
         this.skills = undefined;
      }
   }
}