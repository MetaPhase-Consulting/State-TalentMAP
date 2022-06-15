export function agendaItemSaveErrored(state = false, action) {
  switch (action.type) {
    case 'AGENDA_ITEM_SAVE_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function agendaItemSaveLoading(state = false, action) {
  switch (action.type) {
    case 'AGENDA_ITEM_SAVE_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function agendaItemSave(state = {}, action) {
  switch (action.type) {
    case 'AGENDA_ITEM_SAVE_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
