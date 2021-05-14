import { setupAsyncMocks } from '../testUtilities/testUtilities';
import * as actions from './selectedAccordion';

const { mockStore } = setupAsyncMocks();

describe('selected accordion', () => {
  it('can fetch selected accordion', () => {
    const store = mockStore({ accordion: '' });
    store.dispatch(actions.setSelectedAccordion(''));
  });
});
