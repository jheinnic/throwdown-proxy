export declare interface WireInst<T extends any>
{
   '$': T
}

export declare type Record<T extends Object, K extends string = string> = {
   [P in K]: T
}

export declare interface CardRef
{
   unit_id: string;
   level: string;
}

export declare interface WireCombatSkill
{
   id: SkillNames;
   x?: string;
   y?: string;
   z?: string;
}

export declare interface WireLevelDef
{
   level: string[];
   attack: string[];
   health: string[];
   skill: WireInst<WireCombatSkill>[];
}

export declare interface WireCardDef
{
   id: string[];
   combo_card_id?: string[];
   name: string[];
   picture: string[];
   asset_bundle: string[];
   rarity?: string[];
   set: string[];
   type: string[];
   attack: string[];
   health: string[];
   skill: WireInst<WireCombatSkill>[];
   trait: string[];
   upgrade: WireLevelDef[];
   release_time: string[];
}

export declare type SkillNames =
   'leech'
   | 'poison'
   | 'outlast'
   | 'shrapnel'
   | 'inspire'
   | 'berserk'
   | 'invigorate'
   | 'heal'
   | 'pierce'
   | 'rallyall'
   | 'strike'
   | 'counter'
   | 'weakenall'
   | 'healall'
   | 'weaken'
   | 'barrier'
   | 'armored'
   | 'rally';

// export declare type CombatSkills<S extends SkillNames = SkillNames> = {
//    [K in S]: CombatSkill
// }

export declare type CombatSkills =
   { } |
   { leech: CombatSkill } |
   { poison: CombatSkill } |
   { outlast: CombatSkill } |
   { shrapnel: CombatSkill } |
   { inspire: CombatSkill } |
   { berserk: CombatSkill } |
   { invigorate: CombatSkill } |
   { heal: CombatSkill } |
   { pierce: CombatSkill } |
   { rallyall: CombatSkill } |
   { strike: CombatSkill } |
   { counter: CombatSkill } |
   { weakenall: CombatSkill } |
   { healall: CombatSkill } |
   { weaken: CombatSkill } |
   { barrier: CombatSkill } |
   { armored: CombatSkill } |
   { rally: CombatSkill };

export declare interface CombatSkill
{
   x?: string;
   y?: string;
   z?: string;
}

export declare interface CardLevel
{
   level: number;
   attack: number;
   health: number;
   skills: CombatSkills;
}

export declare const enum CardRarity
{
   COMMON = 'COMMON',
   RARE = 'RARE',
   EPIC = 'EPIC',
   EPIC_POWER = 'EPIC_POWER',
   LEGENDARY = 'LEGENDARY',
   LEGENDARY_POWER = 'LEGENDARY_POWER',
   MYTHIC = 'MYTHIC'
}

export declare const enum SeriesType
{
   FAMILY_GUY = 'Family Guy',
   AMERICAN_DAD = 'American Dad',
   BOBS_BURGERS = 'Bob\'s Burgers',
   KING_OF_THE_HILL = 'King of the Hill',
   FUTURAMA = 'Futurama'
}

