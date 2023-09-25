import { useEffect, useState } from 'react';
import Picky from 'react-picky';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { get, includes, sortBy, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import { useDataLoader } from 'hooks';
import { onEditModeSearch, renderSelectionList } from 'utilities';
import { filtersFetchData } from 'actions/filters/filters';
import { bidAuditFetchData, saveBidAuditSelections } from 'actions/bidAudit';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import api from '../../../api';
import BidAuditCard from './BidAuditCard';

const BidAudit = () => {
  const dispatch = useDispatch();

  const userSelections = useSelector(state => state.bidAuditSelections);
  const dummyPositionDetails = useSelector(state => state.bidAudit);

  const [cardsInEditMode, setCardsInEditMode] = useState([]);
  const genericFiltersIsLoading = useSelector(state => state.filtersIsLoading);
  const genericFilters = useSelector(state => state.filters);

  const [selectedTps, setSelectedTps] = useState(userSelections?.selectedTps || []);
  const [selectedBureaus, setSelectedBureaus] = useState(userSelections?.selectedBureaus || []);
  const [selectedOrgs, setSelectedOrgs] = useState(userSelections?.selectedOrgs || []);
  const [selectedGrades, setSelectedGrades] = useState(userSelections?.selectedGrade || []);
  const [selectedSkills, setSelectedSkills] = useState(userSelections?.selectedSkills || []);
  const [selectedJobs, setSelectedJobs] = useState(userSelections?.selectedJobs || []);
  const [selectedLanguages, setSelectedLanguages] =
    useState(userSelections?.selectedLanguage || []);
  const [overseas, setOverseas] = useState(userSelections?.overseas || false);
  const [domestic, setDomestic] = useState(userSelections?.domestic || false);
  const [clearFilters, setClearFilters] = useState(false);

  const genericFilters$ = get(genericFilters, 'filters') || [];
  const tps = genericFilters$.find(f => get(f, 'item.description') === 'tp');
  const tpsOptions = uniqBy(sortBy(get(tps, 'data'), [(b) => b.short_description]));
  const bureaus = genericFilters$.find(f => get(f, 'item.description') === 'region');
  const bureausOptions = uniqBy(sortBy(get(bureaus, 'data'), [(b) => b.short_description]));
  const grades = genericFilters$.find(f => get(f, 'item.description') === 'grade');
  const gradesOptions = uniqBy(get(grades, 'data'), 'code');

  const { data: orgs, loading: orgsLoading } = useDataLoader(api().get, '/fsbid/agenda_employees/reference/current-organizations/');
  const organizationOptions = sortBy(get(orgs, 'data'), [(o) => o.name]);

  const entryLevelFiltersIsLoading = includes([orgsLoading], true);

  const isLoading = genericFiltersIsLoading || entryLevelFiltersIsLoading;
  const disableSearch = cardsInEditMode.length > 0;
  const disableInput = isLoading || disableSearch;

  const getQuery = () => ({
    'el-tps': selectedTps.map(tpObject => (tpObject?.code)),
    'el-bureaus': selectedBureaus.map(bureauObject => (bureauObject?.code)),
    'el-orgs': selectedOrgs.map(orgObject => (orgObject?.code)),
    'el-grades': selectedGrades.map(gradeObject => (gradeObject?.code)),
    'el-skills': selectedSkills.map(skillObject => (skillObject?.code)),
    'el-jobs': selectedJobs.map(jobObject => (jobObject?.id)),
    'el-language': selectedLanguages.map(langObject => (langObject?.code)),
  });

  const resetFilters = () => {
    setSelectedTps([]);
    setSelectedBureaus([]);
    setSelectedOrgs([]);
    setSelectedGrades([]);
    setSelectedSkills([]);
    setSelectedJobs([]);
    setSelectedLanguages([]);
    setOverseas(false);
    setDomestic(false);
    setClearFilters(false);
  };

  const getCurrentInputs = () => ({
    selectedTps,
    selectedBureaus,
    selectedOrgs,
    selectedGrade: selectedGrades,
    selectedSkills,
    selectedJobs,
    selectedLanguage: selectedLanguages,
    overseas,
    domestic,
  });

  useEffect(() => {
    dispatch(saveBidAuditSelections(getCurrentInputs()));
    dispatch(filtersFetchData(genericFilters));
  }, []);

  const fetchAndSet = () => {
    const filters = [
      selectedTps,
      selectedBureaus,
      selectedOrgs,
      selectedGrades,
      selectedSkills,
      selectedJobs,
      selectedLanguages,
      overseas,
      domestic,
    ];
    if (filters.flat().length === 0) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
    dispatch(bidAuditFetchData(getQuery()));
    dispatch(saveBidAuditSelections(getCurrentInputs()));
  };

  useEffect(() => {
    fetchAndSet();
  }, [
    selectedTps,
    selectedBureaus,
    selectedOrgs,
    selectedGrades,
    selectedSkills,
    selectedJobs,
    selectedLanguages,
    overseas,
    domestic,
  ]);

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };

  const onAddClick = (e) => {
    e.preventDefault();
  };

  return (isLoading ?
    <Spinner type="bureau-filters" size="small" /> :
    <div className="position-search">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Bid Audit" icon="keyboard-o" className="xl-icon" />
        <div className="results-search-bar pt-20">
          <div className="filterby-container">
            <div className="filterby-label">Filter by:</div>
            <div className="filterby-clear">
              {clearFilters &&
                <button
                  className="unstyled-button"
                  onClick={resetFilters}
                  disabled={disableSearch}
                >
                  <FA name="times" />
                  Clear Filters
                </button>
              }
            </div>
          </div>
          <div className="usa-width-one-whole position-search--filters--el results-dropdown">
            <div className="filter-div">
              <div className="label">Assignment Cycle:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Assignment Cycle(s)"
                value={selectedTps}
                options={tpsOptions}
                onChange={setSelectedTps}
                valueKey="id"
                labelKey="name"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Audit Number:</div>
              <Picky
                {...pickyProps}
                placeholder="Enter Audit Number"
                value={selectedBureaus}
                options={bureausOptions}
                onChange={setSelectedBureaus}
                valueKey="code"
                labelKey="long_description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Audit Description:</div>
              <Picky
                {...pickyProps}
                placeholder="Enter Audit Description"
                value={selectedOrgs}
                options={organizationOptions}
                onChange={setSelectedOrgs}
                valueKey="code"
                labelKey="name"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Posted By Date:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Grade(s)"
                value={selectedGrades}
                options={gradesOptions}
                onChange={setSelectedGrades}
                valueKey="code"
                labelKey="custom_description"
                disabled={disableInput}
              />
            </div>
          </div>
        </div>
      </div>
      {disableSearch &&
        <Alert
          type="warning"
          title={'Edit Mode (Search Disabled)'}
          customClassName="mb-10"
          messages={[{
            body: 'Discard or save your edits before searching. ' +
              'Filters and Pagination are disabled if any cards are in Edit Mode.',
          }]}
        />
      }
      <div className="usa-width-one-whole position-search--results">
        <div className="usa-grid-full position-list">
          <p className="add-at">
            <FA name="plus" />
            <Link
              to="#"
              onClick={onAddClick}
            >
              Create New Audit Cycle
            </Link>
          </p>
          {dummyPositionDetails.map(k => (
            <BidAuditCard
              id={k.id}
              key={k.id}
              result={k}
              onEditModeSearch={(editMode, id) =>
                onEditModeSearch(editMode, id, setCardsInEditMode, cardsInEditMode)
              }
            />
          ))}
        </div>
      </div>
      {disableSearch &&
        <div className="disable-react-paginate-overlay" />
      }
    </div>
  );
};


BidAudit.propTypes = {
  bureauFiltersIsLoading: PropTypes.bool,
};

BidAudit.defaultProps = {
  bureauFilters: { filters: [] },
  bureauPositions: { results: [] },
  bureauFiltersIsLoading: false,
  bureauPositionsIsLoading: false,
};

export default BidAudit;
