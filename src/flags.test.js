import { omit } from 'lodash';
import { getFlags, mapFlags } from './flags';
import { bidderUserObject } from './__mocks__/userObject';

const user = bidderUserObject;

const mock = {
  api_url: 'https://test.com/api/v1/',
  flags: {
    bidding: true,
    projected_vacancy: true,
    static_content: true,
  },
  flags_overrides: [
    {
      flag: 'bidding',
      override: false,
      property: 'grade',
      value: '03',
      order: 100,
    },
    {
      flag: 'bidding',
      override: true,
      property: 'permission_groups',
      value: ['bidder', 'bidcycle_admin'],
      order: 200,
    },
    {
      flag: 'projected_vacancy',
      override: false,
      property: 'id',
      value: [2, 3],
      order: 300,
    },
  ],
};

it('maps flags correctly', () => {
  const mock$ = { ...mock };
  const result = mapFlags(user, mock$);
  expect(result.bidding).toBe(false);
  expect(result.projected_vacancy).toBe(mock$.flags.projected_vacancy);
  expect(result.static_content).toBe(mock$.flags.static_content);
});

it('maps flags correctly when id matches user id', () => {
  const mock$ = { ...mock };
  const user$ = { ...user };
  mock$.flags_overrides[2].value = user$.id;
  const result = mapFlags(user$, mock$);
  expect(result.bidding).toBe(false);
  expect(result.projected_vacancy).toBe(false);
  expect(result.static_content).toBe(mock$.flags.static_content);
});

it('maps flags correctly when flags_overrides is undefined', () => {
  const mock$ = omit({ ...mock }, 'flags_overrides');
  const result = mapFlags(user, mock$);
  expect(result.bidding).toBe(mock$.flags.bidding);
  expect(result.projected_vacancy).toBe(mock$.flags.projected_vacancy);
  expect(result.static_content).toBe(mock$.flags.static_content);
});

it('catches errors with the session storage value', () => {
  sessionStorage.setItem('config', '{');
  expect(getFlags()).toEqual({});
});
