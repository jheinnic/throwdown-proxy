import { createSelector } from '@ngrx/store';
// import { Book } from './book.models';
// import * as BookAction from './book.actions';
// import * as BookCollectionAction from './book-collection.actions';
//
export interface State {
  ids: string[];
//   entities: { [id: string]: Book };
//   selectedBookId: string | null;
}
//
// export const initialState: State = {
//   ids: [],
//   entities: {},
//   selectedBookId: null,
// };
//
// export function reducer(
//   state = initialState,
//   action: BookAction.ActionType | BookCollectionAction.ActionType
// ): State {
//   switch (action.type) {
//     case BookAction.SEARCH_COMPLETE:
//     case BookCollectionAction.LOAD_SUCCESS: {
//       const books = action.payload;
//       const newBooks = books.filter(book => !state.entities[book.id]);
//
//       const newBookIds = newBooks.map(book => book.id);
//       const newBookEntities = newBooks.reduce(
//         (entities: { [id: string]: Book }, book: Book) => {
//           return Object.assign(entities, {
//             [book.id]: book,
//           });
//         },
//         {}
//       );
//
//       return {
//         ids: [...state.ids, ...newBookIds],
//         entities: Object.assign({}, state.entities, newBookEntities),
//         selectedBookId: state.selectedBookId,
//       };
//     }
//     case BookAction.LOAD: {
//       const book = action.payload;
//
//       if (state.ids.indexOf(book.id) > -1) {
//         return state;
//       }
//
//       return {
//         ids: [...state.ids, book.id],
//         entities: Object.assign({}, state.entities, {
//           [book.id]: book,
//         }),
//         selectedBookId: state.selectedBookId,
//       };
//     }
//
//     case BookAction.SELECT: {
//       return {
//         ids: state.ids,
//         entities: state.entities,
//         selectedBookId: action.payload,
//       };
//     }
//
//     default: {
//       return state;
//     }
//   }
// }
//
// /**
//  * Because the data structure is defined within the reducer it is optimal to
//  * locate our selector functions at this level. If store is to be thought of
//  * as a database, and reducers the tables, selectors can be considered the
//  * queries into said database. Remember to keep your selectors small and
//  * focused so they can be combined and composed to fit each particular
//  * use-case.
//  */
//
// export const getBookEntities = (state: State) => state.entities;
//
// export const getBookIds = (state: State) => state.ids;
//
// export const getSelectedBookId = (state: State) => state.selectedBookId;
//
// export const getSelectedBook = createSelector(
//   getBookEntities,
//   getSelectedBookId,
//   (entities, selectedId) => {
//     return entities[selectedId];
//   }
// );
//
// export const getAllBooks = createSelector(getBookEntities, getBookIds, (entities, ids) => {
//   return ids.map(id => entities[id]);
// });
