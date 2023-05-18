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
    todcode: '1',
    toddesctext: '1 YR (3 R & R)',
    todmonthsnum: 12,
    todshortdesc: '1Y3RR',
  },
  {
    todcode: '2',
    toddesctext: '1 YR(3R&R)/HL/1 YR(3R&R)',
    todmonthsnum: 25,
    todshortdesc: '1Y3RR/HL/1Y3RR',
  },
  {
    todcode: 'A',
    toddesctext: '18 MOS',
    todmonthsnum: 18,
    todshortdesc: '18M',
  },
  {
    todcode: 'B',
    toddesctext: '18 MOS/HL/18 MOS',
    todmonthsnum: 37,
    todshortdesc: '18M/HL/18M',
  },
  {
    todcode: 'C',
    toddesctext: '1 YEAR',
    todmonthsnum: 12,
    todshortdesc: '1Y',
  },
  {
    todcode: 'D',
    toddesctext: '2 YRS (1 R & R)',
    todmonthsnum: 24,
    todshortdesc: '2YRR',
  },
  {
    todcode: 'E',
    toddesctext: '2 YRS/TRANSFER',
    todmonthsnum: 24,
    todshortdesc: '2Y/T',
  },
  {
    todcode: 'F',
    toddesctext: '2 YRS (2 R & R)',
    todmonthsnum: 24,
    todshortdesc: '2Y2RR',
  },
  {
    todcode: 'H',
    toddesctext: '1 YR (1 R & R)',
    todmonthsnum: 12,
    todshortdesc: '1Y1RR',
  },
  {
    todcode: 'I',
    toddesctext: '3 YRS (2 R & R)',
    todmonthsnum: 36,
    todshortdesc: '3Y2RR',
  },
  {
    todcode: 'J',
    toddesctext: '3 YRS/TRANSFER',
    todmonthsnum: 36,
    todshortdesc: '3Y/T',
  },
  {
    todcode: 'N',
    toddesctext: '2 YEAR (R&R)/HLRT/2 YEAR (R&R)',
    todmonthsnum: 49,
    todshortdesc: '2YRR/HL/2YRR',
  },
  {
    todcode: 'O',
    toddesctext: '1 YR (2 R & R)',
    todmonthsnum: 12,
    todshortdesc: '1Y2RR',
  },
  {
    todcode: 'P',
    toddesctext: '3 YRS (3 R & R)',
    todmonthsnum: 36,
    todshortdesc: '3Y3RR',
  },
  {
    todcode: 'Q',
    toddesctext: '2 YRS (4 R & R)',
    todmonthsnum: 24,
    todshortdesc: '2Y4RR',
  },
  {
    todcode: 'R',
    toddesctext: '2 YRS (3 R & R)',
    todmonthsnum: 24,
    todshortdesc: '2Y3RR',
  },
  {
    todcode: 'S',
    toddesctext: '2 YRS/HLRT/2 YRS',
    todmonthsnum: 48,
    todshortdesc: '2Y/HL/2Y',
  },
  {
    todcode: 'T',
    toddesctext: '10 MOS',
    todmonthsnum: 10,
    todshortdesc: '10M',
  },
  {
    todcode: 'U',
    toddesctext: '14MOS/HL/2 YEAR (R&R)',
    todmonthsnum: 39,
    todshortdesc: '14M/HL/2YRR',
  },
  {
    todcode: 'V',
    toddesctext: '1 YEAR(2R&R)/HL/1 YEAR(2R&R)',
    todmonthsnum: 25,
    todshortdesc: '1Y2RR/HL/1Y2RR',
  },
  {
    todcode: 'W',
    toddesctext: '4 YRS/TRANSFER',
    todmonthsnum: 48,
    todshortdesc: '4Y/T',
  },
  {
    todcode: 'X',
    toddesctext: 'OTHER',
    todmonthsnum: 0,
    todshortdesc: 'OTHER',
  },
  {
    todcode: 'Y',
    toddesctext: 'INDEFINITE',
    todmonthsnum: 0,
    todshortdesc: 'IND',
  },
  {
    todcode: 'Z',
    toddesctext: 'NOT APPLICABLE',
    todmonthsnum: 0,
    todshortdesc: 'NA',
  },
];
