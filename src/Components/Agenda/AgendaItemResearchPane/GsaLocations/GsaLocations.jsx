import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import PaginationWrapper from 'Components/PaginationWrapper/PaginationWrapper';
import InteractiveElement from 'Components/InteractiveElement';
import Alert from 'Components/Alert/Alert';
import { usePrevious } from 'hooks';
import { gsaLocationsFetchData } from 'actions/gsaLocations';
import Spinner from 'Components/Spinner';
import PropTypes from 'prop-types';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { ifEnter } from '../../../../utilities';

const GsaLocations = ({ setLocation, activeAIL }) => {
  const dispatch = useDispatch();
  const locations = useSelector(state => state.gsaLocations);
  const locationsLoading = useSelector(state => state.gsaLocationsFetchDataLoading);
  const locationsErrored = useSelector(state => state.gsaLocationsFetchDataErrored);
  const [city, setCity] = useState();
  const [countryState, setCountryState] = useState();
  const [country, setCountry] = useState();
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const prevPage = usePrevious(page);

  const getInuts = () => ({
    city,
    countryState,
    country,
    page,
    limit: 10,
  });

  const isEnabled = !!activeAIL;

  const handleSearch = () => {
    dispatch(gsaLocationsFetchData(getInuts()));
  };

  useEffect(() => {
    if (page === prevPage) setPage(1);
    handleSearch();
  }, [page, isSearching]);

  const locationResults = locations?.results || [];

  const headers = [
    <FA name="globe" className={isEnabled ? 'active-globe' : ''} />,
    'Code',
    'City',
    'State',
    'Country',
    'Status',
  ];


  const getMessage = () => {
    const message = [
      { body: 'Search text must be in ALL CAPS.' },
      { body: 'State and Country must be in abbreviated code (e.g. VA, USA).' },
    ];
    if (isEnabled) {
      message.push({ body: 'Hover on a search result and click the add button beneath the glowing globe icon.' });
    }
    return message;
  };

  return (
    <div className="search-locations-container">
      <Alert type="info" title="Separation Locations" messages={getMessage()} />
      <div className="search-locations-filters">
        <div className="filter">
          <label htmlFor="citySearch">City:</label>
          <input
            type="search"
            id="citySearch"
            name="city"
            placeholder="Search city"
            onChange={(e) => setCity(e.target.value)}
            onKeyUp={(e) => { if (ifEnter(e)) setIsSearching(!isSearching); }}
            value={city}
          />
          <FA name={city && 'close'} onClick={() => setCity('')} />
        </div>
        <div className="filter">
          <label htmlFor="stateSearch">State:</label>
          <input
            type="search"
            id="stateSearch"
            name="state"
            placeholder="Search state"
            onChange={(e) => setCountryState(e.target.value)}
            onKeyUp={(e) => { if (ifEnter(e)) setIsSearching(!isSearching); }}
            value={countryState}
          />
          <FA name={countryState && 'close'} onClick={() => setCountryState('')} />
        </div>
        <div className="filter">
          <label htmlFor="countrySearch">Country:</label>
          <input
            type="search"
            id="countrySearch"
            name="country"
            placeholder="Search country"
            onChange={(e) => setCountry(e.target.value)}
            onKeyUp={(e) => { if (ifEnter(e)) setIsSearching(!isSearching); }}
            value={country}
          />
          <FA name={country && 'close'} onClick={() => setCountry('')} />
        </div>
        <button onClick={() => setIsSearching(!isSearching)}>
          Search
        </button>
      </div>
      {
        locationsLoading &&
        <Spinner type="gsa-location-results" size="small" />
      }
      {
        locationsErrored &&
        <Alert type="error" title="An error occured loading locations" />
      }
      {
        !(locationsLoading || locationsErrored) &&
        <div className="frequent-positions-table">
          <table className="gsa-locations">
            <thead>
              <tr>
                {headers.map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {
                !!locationResults?.length && locationResults.map(l => (
                  <tr key={l.code}>
                    <td>
                      <InteractiveElement
                        className={isEnabled ? '' : 'hide'}
                        onClick={isEnabled ? () => setLocation(l) : () => { }}
                        title="Add to Agenda Item"
                      >
                        <FA
                          name="plus-circle"
                          className="fa-enabled"
                        />
                      </InteractiveElement>
                    </td>
                    <td>{l.code}</td>
                    <td>{l.city}</td>
                    <td>{l.state}</td>
                    <td>{l.country}</td>
                    <td>{l.status}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div className="usa-grid-full react-paginate">
            <PaginationWrapper
              pageSize={10}
              onPageChange={(p) => setPage(p.page)}
              forcePage={page}
              totalResults={locations?.count}
            />
          </div>
        </div>
      }
    </div>
  );
};

GsaLocations.propTypes = {
  activeAIL: PropTypes.string,
  setLocation: PropTypes.func,
};

GsaLocations.defaultProps = {
  activeAIL: '',
  setLocation: EMPTY_FUNCTION,
};

export default GsaLocations;
