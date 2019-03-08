export enum CardFlavorKind {
   SWAP_TWO_CHITS,
   SWAP_TWO_SELECTORS,
   SHIFT_ONE_CHIT,
   SHIFT_ONE_SELECTOR,
   PLACE_ONE_SELECTOR,
   SWAP_ALL_SELECTORS,
   ROTATE_BOTH_CHITS,
   ROTATE_ONE_OF_TWO,
   ROTATE_ONE_CHIT,
   // UNDO_PREVIOUS_SWAP,
   // UNDO_PREVIOUS_PLACE,
   // UNDO_PREVIOUS_ROTATE,
   // REPLAY_LAST_FOUR,
   // SKIP_ONE,
   // SKIP_TWO
}

export enum ComparableChitTrait {
   SHAPE_AND_SHADE,
   FACE_COLOR,
   SHAPE,
   SHADE,
   SUIT
}

export enum CompareGoal {
   MUST_MATCH,
   MUST_NOT_MATCH
}

export enum PickFirstBy {
   SHAPE_SHADE_SUIT,
   SELECTOR_INDEX,
   SLOT_INDEX,
}

export enum PickSecondBy {
   NEXT_ROW,
   FOUR_AHEAD,
   FOUR_BEHIND,
   SLOT_INDEX,
   SELECTOR_INDEX,
   SHAPE_AND_SUIT,
   SHADE_AND_SUIT
}

export interface SwapTwoChitsDef
{
   readonly kind: CardFlavorKind.SWAP_TWO_CHITS;

   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;

   readonly pickFirstBy: PickFirstBy;
   readonly pickSecondBy: PickSecondBy;

   readonly firstIndex: number;
   readonly secondIndex: number;
}

export interface SwapTwoSelectorsDef
{
   readonly kind: CardFlavorKind.SWAP_TWO_SELECTORS;

   readonly firstIndex: number;
   readonly secondIndex: number;
   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;
}


export interface ShiftOneChitDef
{
   readonly kind: CardFlavorKind.SHIFT_ONE_CHIT;

   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;
   readonly firstIndex: number;
   readonly ahead: boolean;
   readonly stepCount: number;
}

export interface SwapAllSelectors
{
   readonly kind: CardFlavorKind.SWAP_ALL_SELECTORS;
   readonly ahead: boolean;
}

export interface ShiftOneSelector
{
   readonly kind: CardFlavorKind.SHIFT_ONE_SELECTOR;
   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;
   readonly firstIndex: number;
   readonly ahead: boolean;
   readonly stepCount: number;
}

export interface PlaceOneSelector
{
   readonly kind: CardFlavorKind.PLACE_ONE_SELECTOR;
   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;
   readonly firstIndex: number;
   readonly slotIndex: number;
}

export interface RotateBothChitsDef
{
   readonly kind: CardFlavorKind.ROTATE_BOTH_CHITS;

   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;

   readonly pickFirstBy: PickFirstBy;
   readonly pickSecondBy: PickSecondBy;

   readonly firstIndex: number;
   readonly secondIndex: number;

   readonly clockwise: boolean;
}

export interface RotateEitherChitDef
{
   readonly kind: CardFlavorKind.ROTATE_ONE_OF_TWO;

   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;

   readonly pickFirstBy: PickFirstBy;
   readonly pickSecondBy: PickSecondBy;

   readonly firstIndex: number;
   readonly secondIndex: number;

   readonly clockwise: boolean;
}

export interface RotateOneChitDef
{
   readonly kind: CardFlavorKind.ROTATE_ONE_CHIT;

   readonly conditionType: ComparableChitTrait;
   readonly conditionGoal: CompareGoal;

   readonly pickFirstBy: PickFirstBy;
   readonly firstIndex: number;

   readonly clockwise: boolean;
}
