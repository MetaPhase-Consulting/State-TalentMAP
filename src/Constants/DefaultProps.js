export { initialState as DEFAULT_HIGHLIGHT_POSITION } from '../reducers/highlightPosition';

export const ACCORDION_SELECTION = { main: '', sub: '' };

export const DEFAULT_USER_PROFILE = {
  user: {
    username: '',
    first_name: '',
    last_name: '',
  },
  display_name: '...', // show '...' when loading
  initials: '',
  favorite_positions: [],
};

export const POSITION_RESULTS_OBJECT = {
  results: [],
};

export const DEFAULT_FAVORITES_COUNTS = {
  favorites: 0,
  favoritesPV: 0,
  favoritesTandem: 0,
  favoritesPVTandem: 0,
  all: 0,
};

export const DEFAULT_FAVORITES = {
  favorites: [],
  favoritesPV: [],
  favoritesTandem: [],
  favoritesPVTandem: [],
  counts: DEFAULT_FAVORITES_COUNTS,
};

export const PROFILE_MENU_SECTION_EXPANDED_OBJECT = {
  title: '',
  display: false,
};

export default ACCORDION_SELECTION;

export const DEFAULT_HOME_PAGE_RECOMMENDED_POSITIONS = {
  positions: [],
  name: '',
};

export const DEFAULT_HOME_PAGE_FEATURED_POSITIONS = {
  positions: [],
  name: '',
};

export const DEFAULT_TOD_REFERENCE = [
  {
    code: '1',
    long_description: '1 YR (3 R & R)',
    months: 12,
    short_description: '1Y3RR',
  },
  {
    code: '2',
    long_description: '1 YR(3R&R)/HL/1 YR(3R&R)',
    months: 25,
    short_description: '1Y3RR/HL/1Y3RR',
  },
  {
    code: 'A',
    long_description: '18 MOS',
    months: 18,
    short_description: '18M',
  },
  {
    code: 'B',
    long_description: '18 MOS/HL/18 MOS',
    months: 37,
    short_description: '18M/HL/18M',
  },
  {
    code: 'C',
    long_description: '1 YEAR',
    months: 12,
    short_description: '1Y',
  },
  {
    code: 'D',
    long_description: '2 YRS (1 R & R)',
    months: 24,
    short_description: '2YRR',
  },
  {
    code: 'E',
    long_description: '2 YRS/TRANSFER',
    months: 24,
    short_description: '2Y/T',
  },
  {
    code: 'F',
    long_description: '2 YRS (2 R & R)',
    months: 24,
    short_description: '2Y2RR',
  },
  {
    code: 'H',
    long_description: '1 YR (1 R & R)',
    months: 12,
    short_description: '1Y1RR',
  },
  {
    code: 'I',
    long_description: '3 YRS (2 R & R)',
    months: 36,
    short_description: '3Y2RR',
  },
  {
    code: 'J',
    long_description: '3 YRS/TRANSFER',
    months: 36,
    short_description: '3Y/T',
  },
  {
    code: 'N',
    long_description: '2 YEAR (R&R)/HLRT/2 YEAR (R&R)',
    months: 49,
    short_description: '2YRR/HL/2YRR',
  },
  {
    code: 'O',
    long_description: '1 YR (2 R & R)',
    months: 12,
    short_description: '1Y2RR',
  },
  {
    code: 'P',
    long_description: '3 YRS (3 R & R)',
    months: 36,
    short_description: '3Y3RR',
  },
  {
    code: 'Q',
    long_description: '2 YRS (4 R & R)',
    months: 24,
    short_description: '2Y4RR',
  },
  {
    code: 'R',
    long_description: '2 YRS (3 R & R)',
    months: 24,
    short_description: '2Y3RR',
  },
  {
    code: 'S',
    long_description: '2 YRS/HLRT/2 YRS',
    months: 48,
    short_description: '2Y/HL/2Y',
  },
  {
    code: 'T',
    long_description: '10 MOS',
    months: 10,
    short_description: '10M',
  },
  {
    code: 'U',
    long_description: '14MOS/HL/2 YEAR (R&R)',
    months: 39,
    short_description: '14M/HL/2YRR',
  },
  {
    code: 'V',
    long_description: '1 YEAR(2R&R)/HL/1 YEAR(2R&R)',
    months: 25,
    short_description: '1Y2RR/HL/1Y2RR',
  },
  {
    code: 'W',
    long_description: '4 YRS/TRANSFER',
    months: 48,
    short_description: '4Y/T',
  },
  {
    code: 'X',
    long_description: 'OTHER',
    months: 0,
    short_description: 'OTHER',
  },
  {
    code: 'Y',
    long_description: 'INDEFINITE',
    months: 0,
    short_description: 'IND',
  },
  {
    code: 'Z',
    long_description: 'NOT APPLICABLE',
    months: 0,
    short_description: 'NA',
  },
];
