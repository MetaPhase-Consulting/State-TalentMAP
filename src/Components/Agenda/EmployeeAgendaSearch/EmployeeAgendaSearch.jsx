import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picky from 'react-picky';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { flatten, get, has, isEmpty, sortBy, uniqBy } from 'lodash';
import FA from 'react-fontawesome';
import { filtersFetchData } from 'actions/filters/filters';
import { bidderPortfolioCDOsFetchData } from 'actions/bidderPortfolio';
import PositionManagerSearch from 'Components/BureauPage/PositionManager/PositionManagerSearch';
import Spinner from 'Components/Spinner';
import TotalResults from 'Components/TotalResults';
import PaginationWrapper from 'Components/PaginationWrapper';
import ExportButton from 'Components/ExportButton';
import SelectForm from 'Components/SelectForm';
import CDOAutoSuggest from 'Components/BidderPortfolio/CDOAutoSuggest/CDOAutoSuggest';
import ListItem from 'Components/BidderPortfolio/BidControls/BidCyclePicker/ListItem';
import EmployeeAgendaSearchCard from '../EmployeeAgendaSearchCard/EmployeeAgendaSearchCard';
import EmployeeAgendaSearchRow from '../EmployeeAgendaSearchRow/EmployeeAgendaSearchRow';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import ResultsViewBy from '../../ResultsViewBy/ResultsViewBy';


const EmployeeAgendaSearch = ({ isCDO }) => {
  const dispatch = useDispatch();

  const filterData = useSelector(state => state.filters);
  const filtersIsLoading = useSelector(state => state.filtersIsLoading);
  const cdosIsLoading = useSelector(state => state.bidderPortfolioCDOsIsLoading);

  const isLoading = filtersIsLoading || cdosIsLoading;

  const filters = filterData.filters;

  const tods = filters.find(f => f.item.description === 'tod');
  const todOptions = uniqBy(tods.data, 'code');
  const bureaus = filters.find(f => f.item.description === 'region');
  const bureauOptions = uniqBy(sortBy(bureaus.data, [(b) => b.long_description]), 'long_description');
  // To-Do: Missing org/post data - using location as placeholder
  // To-Do: Missing CDO agents data
  const posts = filters.find(f => f.item.description === 'post');
  const postOptions = uniqBy(sortBy(posts.data, [(p) => p.city]), 'code');
  const cycles = filters.find(f => f.item.description === 'bidCycle');
  const cycleOptions = uniqBy(sortBy(cycles.data, [(c) => c.custom_description]), 'custom_description');
  const fsbidHandshakeStatus = filters.find(f => f.item.description === 'handshake');
  const fsbidHandshakeStatusOptions = uniqBy(fsbidHandshakeStatus.data, 'code');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [ordering, setOrdering] = useState();
  const [selectedCurrentPosts, setSelectedCurrentPosts] = useState([]);
  const [selectedOngoingPosts, setSelectedOngoingPosts] = useState([]);
  const [selectedTODs, setSelectedTODs] = useState([]);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [selectedCurrentBureaus, setSelectedCurrentBureaus] = useState([]);
  const [selectedOngoingBureaus, setSelectedOngoingBureaus] = useState([]);
  const [selectedHandshakeStatus, setSelectedHandshakeStatus] = useState([]);
  const [selectedTED, setSelectedTED] = useState([new Date(), new Date()]);
  // const [textSearch, setTextSearch] = useState('');
  // const [textInput, setTextInput] = useState('');
  const [clearFilters, setClearFilters] = useState(false);
  const [cardView, setCardView] = useState(true);

  const view = cardView ? 'card' : 'row';


  useEffect(() => {
    dispatch(filtersFetchData(filterData, {}));
    dispatch(bidderPortfolioCDOsFetchData());
  }, []);

  useEffect(() => {
    const filters$ = [
      selectedCurrentPosts,
      selectedOngoingPosts,
      selectedTODs,
      selectedCurrentBureaus,
      selectedOngoingBureaus,
      selectedHandshakeStatus,
      selectedTED,
    ];
    if (isEmpty(flatten(filters$))) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  }, [
    selectedCurrentPosts,
    selectedOngoingPosts,
    selectedTODs,
    selectedCurrentBureaus,
    selectedOngoingBureaus,
    selectedHandshakeStatus,
    selectedTED,
  ]);


  const renderSelectionList = ({ items, selected, ...rest }) => {
    let codeOrID = 'code';
    // only Cycle needs to use 'id'
    if (!has(items[0], 'code')) {
      codeOrID = 'id';
    }
    const getSelected = item => !!selected.find(f => f[codeOrID] === item[codeOrID]);
    let queryProp = 'description';
    if (get(items, '[0].custom_description', false)) queryProp = 'custom_description';
    else if (get(items, '[0].long_description', false)) queryProp = 'long_description';
    return items.map(item =>
      (<ListItem
        key={item[codeOrID]}
        item={item}
        {...rest}
        queryProp={queryProp}
        getIsSelected={getSelected}
      />),
    );
  };

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };

  const resetFilters = () => {
    setSelectedCurrentPosts([]);
    setSelectedOngoingPosts([]);
    setSelectedTODs([]);
    setSelectedCycles([]);
    setSelectedCurrentBureaus([]);
    setSelectedOngoingBureaus([]);
    setSelectedHandshakeStatus([]);
    setSelectedTED([new Date(), new Date()]);
    setClearFilters(false);
  };

  const data = [
    {
      agendaStatus: 'Complete',
      author: 'Abella, Hewett S',
      bidder: 'Townpost, Jenny Y',
      cdo: 'Shadtrach, Leah',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true, // for testing only
      hs_status: 'Accepted', // for testing only
      initials: 'JT',
      panelDate: '12/25/2021',
      ted: '04/2022',
    },
    {
      agendaStatus: 'Complete',
      author: 'Crackel, Pooh M',
      bidder: 'Rehman, Tarek A',
      cdo: 'Shadtrach, Leah',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Offered',
      initials: 'TR',
      panelDate: '12/25/2021',
      ted: '04/2025',
    },
    {
      agendaStatus: 'Complete',
      author: 'Graham, Aubrey D',
      bidder: 'Bayliss, Jaye Y',
      cdo: 'NA',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Extended',
      initials: 'JB',
      panelDate: '12/25/2021',
      ted: '09/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Tinman, Chanda R',
      bidder: 'Malpass, Izzy A',
      cdo: 'MacMaster, Massimiliano M',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true,
      hs_status: 'Accepted',
      initials: 'IM',
      panelDate: '12/25/2021',
      ted: '11/2022',
    },
    {
      agendaStatus: 'Complete',
      author: 'Lempel, Mandie B',
      bidder: 'Jikovsky, Lelia D',
      cdo: 'Peters, Jeremy W',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Accepted',
      initials: 'LG',
      panelDate: '12/25/2021',
      ted: '07/2024',
    },
    {
      agendaStatus: 'Complete',
      author: 'Swift, Taylor A',
      bidder: 'Jessep, Des D',
      cdo: 'NA',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Offered',
      initials: 'DJ',
      panelDate: '12/25/2021',
      ted: '09/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Hallworth, Terrence L',
      bidder: 'Franies, Normie G',
      cdo: 'Alesi, Reina W',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Extended',
      initials: 'NF',
      panelDate: '12/25/2021',
      ted: '03/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Fronsek, Ahmad M',
      bidder: 'Drakes, Price P',
      cdo: 'Ranns, Natty L',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true,
      hs_status: 'Accepted',
      initials: 'PD',
      panelDate: '12/25/2021',
      ted: '06/2023',
    },
  ];

  return (
    isLoading ?
      <Spinner type="bureau-filters" size="small" /> :
      <>
        <div className="empl-search-page">
          <div className="usa-grid-full empl-search-upper-section">
            <div className="results-search-bar padded-main-content results-single-search homepage-offset">
              <div className="usa-grid-full results-search-bar-container">
                <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
                <PositionManagerSearch
                  id="bureau-search-keyword-field"
                  labelSrOnly
                  noButton
                  noForm
                  onChangeText={() => {}}
                  onClear={() => {}}
                  placeholder="Type keywords here"
                  showClear
                  submitText="Search"
                  type="medium"
                  label="Search for an Employee"
                />
                <div className="filterby-container">
                  <div className="filterby-label">Filter by:</div>
                  <div className="filterby-clear">
                    {clearFilters &&
                        <button className="unstyled-button" onClick={resetFilters}>
                          <FA name="times" />
                              Clear Filters
                        </button>
                    }
                  </div>
                </div>
                <div className="usa-width-one-whole empl-search-filters results-dropdown">
                  <div className="filter-div">
                    <div className="label">Cycle:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Select Cycle(s)"
                      value={selectedCycles}
                      options={cycleOptions}
                      onChange={setSelectedCycles}
                      valueKey="id"
                      labelKey="custom_description"
                    />
                  </div>
                  <div className="filter-div">
                    <div className="label">Panel:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Select Panel Date(s)"
                      value={selectedTODs}
                      options={todOptions}
                      onChange={setSelectedTODs}
                      valueKey="code"
                      labelKey="long_description"
                    />
                  </div>
                  <div className="filter-div split-filter-div">
                    <div className="label">Post:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Current"
                      value={selectedCurrentPosts}
                      options={postOptions}
                      onChange={setSelectedCurrentPosts}
                      valueKey="code"
                      labelKey="custom_description"
                    />
                    <Picky
                      {...pickyProps}
                      placeholder="Ongoing"
                      value={selectedOngoingPosts}
                      options={postOptions}
                      onChange={setSelectedOngoingPosts}
                      valueKey="code"
                      labelKey="custom_description"
                    />
                  </div>
                  <div className="filter-div split-filter-div">
                    <div className="label">Bureau:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Current"
                      value={selectedCurrentBureaus.filter(f => f)}
                      options={bureauOptions}
                      onChange={setSelectedCurrentBureaus}
                      valueKey="code"
                      labelKey="long_description"
                    />
                    <Picky
                      placeholder="Ongoing"
                      value={selectedOngoingBureaus.filter(f => f)}
                      options={bureauOptions}
                      onChange={setSelectedOngoingBureaus}
                      valueKey="code"
                      labelKey="long_description"
                    />
                  </div>
                  <div className="filter-div handshake-filter-div">
                    <div className="label">Handshake:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Select Handshake Register Status"
                      value={selectedHandshakeStatus}
                      options={fsbidHandshakeStatusOptions}
                      onChange={setSelectedHandshakeStatus}
                      valueKey="code"
                      labelKey="description"
                    />
                  </div>
                  <div className="filter-div">
                    <div className="label">CDO:</div>
                    <CDOAutoSuggest />
                  </div>
                  <div className="filter-div">
                    <div className="label">Creator:</div>
                    <Picky
                      {...pickyProps}
                      placeholder="Select Creator(s)"
                      value={selectedCycles}
                      options={cycleOptions}
                      onChange={setSelectedCycles}
                      valueKey="id"
                      labelKey="custom_description"
                    />
                  </div>
                  <div className="filter-div">
                    <div className="label">TED:</div>
                    <DateRangePicker
                      onChange={setSelectedTED}
                      value={selectedTED}
                      maxDetail="month"
                      calendarIcon={null}
                      showLeadingZeros
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="usa-width-one-whole results-dropdown empl-search-controls-container">
            <TotalResults
              total={10}
              pageNumber={1}
              pageSize={10}
              suffix="Results"
              isHidden={isLoading}
            />
            <div className="empl-search-controls-right">
              <ResultsViewBy initial={view} onClick={() => setCardView(!cardView)} />
              <div className="empl-search-results-controls">
                <SelectForm
                  id="empl-search-num-results"
                  options={[]}
                  label="Sort by:"
                  defaultSort={ordering}
                  onSelectOption={value => setOrdering(value.target.value)}
                  disabled={isLoading}
                />
                <SelectForm
                  id="empl-search-num-results"
                  options={[]}
                  label="Results:"
                  defaultSort={limit}
                  onSelectOption={value => setLimit(value.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="export-button-container">
                <ExportButton
                  onClick={() => {}}
                  isLoading={isLoading}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="usa-width-one-whole empl-search-lower-section results-dropdown">
            {
              cardView &&
          <div className="employee-agenda-card">
            {data.map(result => (
              // TODO: include React keys once we have real data
              <EmployeeAgendaSearchCard result={result} isCDO={isCDO} />
            ))}
          </div>
            }
            {
              !cardView &&
          <div className="employee-agenda-row">
            {data.map(result => (
              // TODO: include React keys once we have real data
              <EmployeeAgendaSearchRow result={result} isCDO={isCDO} />
            ))}
          </div>
            }
          </div>
          <div className="usa-grid-full react-paginate empl-search-pagination-controls">
            <PaginationWrapper
              pageSize={limit}
              onPageChange={p => setPage(p.page)}
              forcePage={page}
              totalResults={10}
            />
          </div>
        </div>
      </>
  );
};

EmployeeAgendaSearch.propTypes = {
  isCDO: PropTypes.bool,
};

EmployeeAgendaSearch.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearch;
