import { stringify } from 'query-string';
import { subDays } from 'date-fns';
import api from '../api';

export const getTitle = (string = '', isUnique = false) => `${isUnique ? 'Unique' : 'Total'} logins in the past ${string}`;

export function statsHasErrored(bool) {
  return {
    type: 'STATS_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function statsIsLoading(bool) {
  return {
    type: 'STATS_IS_LOADING',
    isLoading: bool,
  };
}

export function statsSuccess(count) {
  return {
    type: 'STATS_SUCCESS',
    count,
  };
}

export const fetchStats = ({ route, options = {} }) => {
  const options$ = { ...options, limit: 1 };
  const options$$ = stringify(options$);
  return (
    api().get(`/stats/${route}/?${options$$}`)
      .then(({ data }) => data)
      .then(client => client)
      .catch(error => error)
  );
};

export function getLoginStats() {
  return (dispatch) => {
    dispatch(statsIsLoading(true));
    const today = new Date();

    const past24hrs = subDays(today, 1).toJSON();
    const past3days = subDays(today, 3).toJSON();
    const pastWeek = subDays(today, 7).toJSON();
    const past30days = subDays(today, 30).toJSON();
    const today$ = today.toJSON();

    const promTypes = [
      { title: getTitle('24 hours'), type: 'total', route: 'logins', options: { date_of_login__gt: past24hrs, date_of_login__lte: today$ } },
      { title: getTitle('3 days'), type: 'total', route: 'logins', options: { date_of_login__gt: past3days, date_of_login__lte: today$ } },
      { title: getTitle('7 days'), type: 'total', route: 'logins', options: { date_of_login__gt: pastWeek, date_of_login__lte: today$ } },
      { title: getTitle('30 days'), type: 'total', route: 'logins', options: { date_of_login__gt: past30days, date_of_login__lte: today$ } },

      { title: getTitle('24 hours', true), type: 'unique', route: 'distinctlogins', options: { date_of_login__gt: past24hrs, date_of_login__lte: today$ } },
      { title: getTitle('3 days', true), type: 'unique', route: 'distinctlogins', options: { date_of_login__gt: past3days, date_of_login__lte: today$ } },
      { title: getTitle('7 days', true), type: 'unique', route: 'distinctlogins', options: { date_of_login__gt: pastWeek, date_of_login__lte: today$ } },
      { title: getTitle('30 days', true), type: 'unique', route: 'distinctlogins', options: { date_of_login__gt: past30days, date_of_login__lte: today$ } },
    ];

    const proms = promTypes.map(m => fetchStats({ route: m.route, options: m.options }));

    Promise.all(proms)
      .then((results) => {
        let proms$ = [...promTypes];
        proms$ = proms$.map((m, i) => ({ ...m, count: results[i].count }));
        console.log(proms$);
        dispatch(statsSuccess(proms$));
        dispatch(statsHasErrored(false));
        dispatch(statsIsLoading(false));
      })
      .catch(() => {
        dispatch(statsHasErrored(true));
        dispatch(statsIsLoading(false));
      });
  };
}
