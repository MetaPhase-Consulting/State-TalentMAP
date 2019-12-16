import { filter } from 'lodash';

// BEGIN: KEEP THESE CONSTANTS TOGETHER IN THIS ORDER
const POSITION_SEARCH_SORTS$ = {
  options: [
    { value: '', text: 'Sort option', disabled: true },
    { value: 'position__title', text: 'Position title: A-Z' },
    { value: '-position__grade', text: 'Grade: Low to high' }, // sort by grade "ranking"
    { value: '-position__bureau', text: 'Bureau: A-Z' }, // numbers first, then A-Z
    { value: '-posted_date', text: 'Posted date: Most recent', availableOnly: true }, // sort by soonest posted_date
    { value: 'posted_date', text: 'Posted date: Oldest', availableOnly: true }, // sort by oldest posted_date
    { value: 'ted', text: 'TED: Soonest' },
    { value: 'position__position_number', text: 'Position number: Low to high' }, // numbers first, then A-Z
    { value: '-position__post__has_service_needs_differential', text: 'Featured positions', availableOnly: true }, // sort by service needs first
  ],
};

POSITION_SEARCH_SORTS$.defaultSort = POSITION_SEARCH_SORTS$.options.find(o =>
  o.value === 'ted',
).value;

export const POSITION_SEARCH_SORTS = POSITION_SEARCH_SORTS$;

export const POSITION_SEARCH_SORTS_DYNAMIC = {
  ...POSITION_SEARCH_SORTS,
  options: [
    ...POSITION_SEARCH_SORTS.options.map((m) => {
      const obj = { ...m };
      if (obj.value === '-position__bureau') {
        obj.value = 'position__bureau';
      }
      return obj;
    }),
  ],
};
// END: KEEP THESE CONSTANTS TOGETHER IN THIS ORDER

export const filterPVSorts = (sorts) => {
  const v = { ...sorts };
  v.options = filter(v.options, f => !f.availableOnly);
  return v;
};

export const POSITION_PAGE_SIZES = {
  options: [
    { value: 5, text: '5' },
    { value: 10, text: '10' },
    { value: 25, text: '25' },
    { value: 50, text: '50' },
    { value: 100, text: '100' },
  ],
};

POSITION_PAGE_SIZES.defaultSort = POSITION_PAGE_SIZES.options[1].value;

export const BID_PORTFOLIO_SORTS = {
  options: [
    { value: '', text: 'Default sorting' },
    { value: 'date_of_birth', text: 'Age' },
    { value: 'bid_statistics__handshake_offered', text: 'Priority Need' },
  ],
};

BID_PORTFOLIO_SORTS.defaultSort = BID_PORTFOLIO_SORTS.options[0].value;

export const SAVED_SEARCH_SORTS = {
  options: [
    { value: '', text: 'Sort option', disabled: true },
    { value: 'name', text: 'Name: A-Z' },
    { value: '-date_updated', text: 'Date created: Most recent' },
  ],
};

SAVED_SEARCH_SORTS.defaultSort = SAVED_SEARCH_SORTS.options[0].value;

export const POSITION_SEARCH_SORTS_TYPE = 'POSITION_SEARCH_SORTS';
export const POSITION_PAGE_SIZES_TYPE = 'POSITION_PAGE_SIZES';
export const BID_PORTFOLIO_SORTS_TYPE = 'BID_PORTFOLIO_SORTS';
export const SAVED_SEARCH_SORTS_TYPE = 'SAVED_SEARCH_SORTS';

const SORT_OPTIONS = [
  [POSITION_SEARCH_SORTS, POSITION_SEARCH_SORTS_TYPE],
  [POSITION_PAGE_SIZES, POSITION_PAGE_SIZES_TYPE],
  [BID_PORTFOLIO_SORTS, BID_PORTFOLIO_SORTS_TYPE],
  [SAVED_SEARCH_SORTS, SAVED_SEARCH_SORTS_TYPE],
];

// sort config based on SORT_OPTIONS
export default Object.assign(
  {},
  ...SORT_OPTIONS.map(p => (
    { [p[1]]: { key: p[1], defaultSort: p[0].defaultSort, options: p[0].options } }
  )),
);
