import { setupAsyncMocks } from '../testUtilities/testUtilities';
import * as actions from './highlightPosition';

const { mockStore, mockAdapter } = setupAsyncMocks();

describe('GET all highlighted position actions - /cycleposition/highlighted', () => {
  beforeEach(() => {
    mockAdapter.onGet('/cycleposition/highlighted/').reply(200, {});
    mockAdapter.onGet('/cycleposition/highlighted/').reply(200, {});
  });

  it('can get highlight positions', (done) => {
    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.highlightPositionFetchData());
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });

  it('can get highlight positions - handle error', (done) => {
    mockAdapter.onGet('/cycleposition/highlighted/').reply(500);

    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.highlightPositionFetchData());
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });
});

describe('GET single highlighted position actions - position/:id/highlight/', () => {
  const positionID = 42;

  beforeEach(() => {
    mockAdapter.onGet(`/cycleposition/${positionID}/highlight/`).reply(200, {});
    mockAdapter.onGet(`/cycleposition/${positionID}/highlight/`).reply(200, {});
  });

  it('can get a single highlight position', (done) => {
    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.getHighlightedPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });

  it('can get a single highlight position - handle error', (done) => {
    mockAdapter.onGet(`/cycleposition/${positionID}/highlight/`).reply(500);

    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.getHighlightedPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });
});

describe('PUT single highlighted position actions - /cycleposition/:id/highlight/', () => {
  const positionID = 42;

  beforeEach(() => {
    mockAdapter.onPut(`/cycleposition/${positionID}/highlight/`).reply(200, {});
    mockAdapter.onPut(`/cycleposition/${positionID}/highlight/`).reply(200, {});
  });

  it('can put a highlight position', (done) => {
    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.putHighlightedPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });

  it('can put a highlight position - handle error', (done) => {
    mockAdapter.onPut(`/cycleposition/${positionID}/highlight/`).reply(500);

    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.putHighlightedPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });
});

describe('DELETE single highlighted position actions - /cycleposition/:id/highlight/', () => {
  const positionID = 42;

  beforeEach(() => {
    mockAdapter.onDelete(`position/${positionID}/highlight/`).reply(200, {});
    mockAdapter.onDelete(`position/${positionID}/highlight/`).reply(200, {});
  });

  it('can delete a highlight position', (done) => {
    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.deleteHighlightPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });

  it('can delete a highlight position - handle error', (done) => {
    mockAdapter.onDelete(`position/${positionID}/highlight/`).reply(500);

    const store = mockStore({ results: [] });

    const f = () => {
      setTimeout(() => {
        store.dispatch(actions.deleteHighlightPosition(positionID));
        store.dispatch(actions.highlightPositionIsLoading(false));
        done();
      }, 0);
    };
    f();
  });
});
