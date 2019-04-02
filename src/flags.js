import { get, includes, intersection, isArray, isEqual, isNumber, isString, orderBy } from 'lodash';
// import { store } from './store';

export const BASE_FLAGS = {
  bidding: false,
  projected_vacancy: false,
  static_content: false,
};

const getUserProfileByEnv = (userProfile) => {
  if (process.env.NODE_ENV === 'test') {
    return userProfile || {};
  }
  // eslint-disable-next-line
  const store = require('./store').store;
  return userProfile || store.getState({}, {}).userProfile || {};
};

export const getFlags = () => {
  let flagsSs = sessionStorage.getItem('config');

  if (flagsSs) {
    try {
      flagsSs = JSON.parse(flagsSs);
    } catch (e) {
      flagsSs = {};
    }
  }
  return flagsSs || {};
};

// map flags object against user properties
export const mapFlags = (userProfile, flagConfig) => {
  const userProfile$ = getUserProfileByEnv(userProfile);
  const flagConfig$ = flagConfig || getFlags() || {};
  const flags$ = { flags: BASE_FLAGS, flags_overrides: [], ...flagConfig$ };

  const flags$$ = { ...flags$, ...flags$.flags };
  const flagsOverrides$ = flags$.flags_overrides;

  orderBy(flagsOverrides$, 'order').forEach((m) => {
    const m$ = m || {};

    const prop = get(m$, 'property');
    const override = get(m$, 'override');
    const flag = get(m$, 'flag');
    const newValue = get(m$, 'value');
    const value = get(userProfile$, prop);

    // prop must be a string
    if (isString(prop)) {
      // user property value is a string or number
      if (isNumber(value) || isString(value)) {
        if (isArray(newValue)) {
          if (includes(newValue, value)) {
            flags$$[flag] = override;
          }
        } else if (isEqual(value, newValue)) {
          flags$$[flag] = override;
        }
      // user property value is an array
      } else if (isArray(value)) {
        if (isArray(newValue)) {
          if (intersection(newValue, value).length) {
            flags$$[flag] = override;
          }
        } else if (isNumber(newValue) || isString(newValue)) {
          if (intersection([newValue], value).length) {
            flags$$[flag] = override;
          }
        }
      }
    }
  });

  return flags$$;
};

// path is a string path to check
export const checkFlag = (path) => {
  const flags = mapFlags();
  const value = get(flags, path, false);
  return value;
};

export default getFlags;
