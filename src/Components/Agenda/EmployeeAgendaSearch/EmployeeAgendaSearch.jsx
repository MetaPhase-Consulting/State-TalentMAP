// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picky from 'react-picky';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { flatten, get, has, isEmpty, sortBy, uniqBy } from 'lodash';
import FA from 'react-fontawesome';
import { filtersFetchData } from 'actions/filters/filters';
import PositionManagerSearch from 'Components/BureauPage/PositionManager/PositionManagerSearch';
import Spinner from 'Components/Spinner';
import ListItem from 'Components/BidderPortfolio/BidControls/BidCyclePicker/ListItem';
import ProfileSectionTitle from '../../ProfileSectionTitle';


const EmployeeAgendaSearch = () => {
  const dispatch = useDispatch();

  const filterData = useSelector(state => state.filters);
  const filtersIsLoading = useSelector(state => state.filtersIsLoading);

  const isLoading = filtersIsLoading;

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

  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [ordering, setOrdering] = useState();
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

  // ADD get agents call to fill out agents menu

  useEffect(() => {
    dispatch(filtersFetchData(filterData, {}));
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

  return (
    <div className="usa-grid-full profile-content-inner-container employee-search-filters-container results-search-bar-container">
      { isLoading ?
        <Spinner type="bureau-filters" size="small" /> :
        <>
          <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
          <PositionManagerSearch
            id="bureau-search-keyword-field"
            label="Keywords"
            labelSrOnly
            noButton
            noForm
            onChangeText={() => {}}
            onClear={() => {}}
            placeholder="Type keywords here"
            showClear
            submitText="Search"
            type="medium"
          />
          <div className="filterby-container">
            <div className="filterby-label">Filter by:</div>
            <div className="filterby-clear">
              {
                clearFilters &&
                <button className="unstyled-button" onClick={resetFilters}>
                  <FA name="times" />
                      Clear Filters
                </button>
              }
            </div>
          </div>
          <div className="usa-width-five-sixths empl-filters">
            <div className="filter-div">
              <div className="label">Cycle:</div>
              <Picky
                placeholder="Select cycle(s)"
                value={selectedCycles}
                options={cycleOptions}
                onChange={setSelectedCycles}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="id"
                labelKey="custom_description"
                includeSelectAll
              />
            </div>
            <div className="filter-div">
              <div className="label">TOD:</div>
              <Picky
                placeholder="Select TOD(s)"
                value={selectedTODs}
                options={todOptions}
                onChange={setSelectedTODs}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="long_description"
                includeSelectAll
              />
            </div>
            <div className="filter-div split-filter-div">
              <div className="label">Location:</div>
              <Picky
                placeholder="Current"
                value={selectedCurrentPosts}
                options={postOptions}
                onChange={setSelectedCurrentPosts}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="custom_description"
              />
              <Picky
                placeholder="Ongoing"
                value={selectedOngoingPosts}
                options={postOptions}
                onChange={setSelectedOngoingPosts}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="custom_description"
              />
            </div>
            <div className="filter-div split-filter-div">
              <div className="label">Bureau:</div>
              <Picky
                placeholder="Current"
                value={selectedCurrentBureaus.filter(f => f)}
                options={bureauOptions}
                onChange={setSelectedCurrentBureaus}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="long_description"
                includeSelectAll
              />
              <Picky
                placeholder="Ongoing"
                value={selectedOngoingBureaus.filter(f => f)}
                options={bureauOptions}
                onChange={setSelectedOngoingBureaus}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="long_description"
                includeSelectAll
              />
            </div>
            <div className="filter-div handshake-filter-div">
              <div className="label">Handshake:</div>
              <Picky
                placeholder="Select Handshake Register Status"
                value={selectedHandshakeStatus}
                options={fsbidHandshakeStatusOptions}
                onChange={setSelectedHandshakeStatus}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="code"
                labelKey="description"
                includeSelectAll
              />
            </div>
            <div className="filter-div">
              <div className="label">CDO:</div>
              <Picky
                placeholder="Select CDO(s)"
                value={selectedCycles}
                options={cycleOptions}
                onChange={setSelectedCycles}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="id"
                labelKey="custom_description"
                includeSelectAll
              />
            </div>
            <div className="filter-div">
              <div className="label">Creator:</div>
              <Picky
                placeholder="Select Creator(s)"
                value={selectedCycles}
                options={cycleOptions}
                onChange={setSelectedCycles}
                numberDisplayed={2}
                multiple
                includeFilter
                dropdownHeight={255}
                renderList={renderSelectionList}
                valueKey="id"
                labelKey="custom_description"
                includeSelectAll
              />
            </div>
            <div className="filter-div">
              <div className="label">TED:</div>
              <DateRangePicker
                onChange={setSelectedTED}
                value={selectedTED}
              />
            </div>
          </div>
        </>
      }
    </div>
  );
};

EmployeeAgendaSearch.propTypes = {

};

EmployeeAgendaSearch.defaultProps = {

};

export default EmployeeAgendaSearch;
