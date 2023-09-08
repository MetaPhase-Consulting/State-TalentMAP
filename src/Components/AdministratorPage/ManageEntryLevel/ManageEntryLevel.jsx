import { useEffect, useState } from 'react';
import Picky from 'react-picky';
import FA from 'react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { get, has, includes, sortBy, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import { useDataLoader } from 'hooks';
import { onEditModeSearch } from 'utilities';
import { filtersFetchData } from 'actions/filters/filters';
import { entryLevelFetchData, saveEntryLevelSelections } from 'actions/entryLevel';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import ListItem from 'Components/BidderPortfolio/BidControls/BidCyclePicker/ListItem';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import api from '../../../api';
import EntryLevelCard from './EntryLevelCard';
import CheckBox from '../../CheckBox/CheckBox';

const ManageEntryLevel = () => {
  const dispatch = useDispatch();

  const userSelections = useSelector(state => state.entryLevelSelections);
  const dummyPositionDetails = useSelector(state => state.entryLevel);
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

  const dummyid = dummyPositionDetails?.id;
  const dummyIds = [...Array(10).keys()].map(k => dummyid + k);

  const genericFilters$ = get(genericFilters, 'filters') || [];
  const tps = genericFilters$.find(f => get(f, 'item.description') === 'tp');
  const tpsOptions = uniqBy(sortBy(get(tps, 'data'), [(b) => b.short_description]));
  const bureaus = genericFilters$.find(f => get(f, 'item.description') === 'region');
  const bureausOptions = uniqBy(sortBy(get(bureaus, 'data'), [(b) => b.short_description]));
  const grades = genericFilters$.find(f => get(f, 'item.description') === 'grade');
  const gradesOptions = uniqBy(get(grades, 'data'), 'code');
  const skills = genericFilters$.find(f => get(f, 'item.description') === 'skill');
  const skillsOptions = uniqBy(sortBy(get(skills, 'data'), [(s) => s.description]), 'code');
  const jobs = genericFilters$.find(f => get(f, 'item.description') === 'bidCycle');
  const jobsOptions = uniqBy(sortBy(get(jobs, 'data'), [(c) => c.description]), 'job');
  const languages = genericFilters$.find(f => get(f, 'item.description') === 'language');
  const languagesOptions = uniqBy(sortBy(get(languages, 'data'), [(c) => c.custom_description]), 'custom_description');

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
    dispatch(saveEntryLevelSelections(getCurrentInputs()));
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
    dispatch(entryLevelFetchData(getQuery()));
    dispatch(saveEntryLevelSelections(getCurrentInputs()));
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

  function renderSelectionList({ items, selected, ...rest }) {
    let codeOrText = 'code';

    if (has(items[0], 'text')) {
      codeOrText = 'text';
    }
    // only Item Actions/Statuses need to use 'desc_text'
    if (has(items[0], 'desc_text')) {
      codeOrText = 'desc_text';
    }
    if (has(items[0], 'abbr_desc_text') && items[0].code === 'V') {
      codeOrText = 'abbr_desc_text';
    }
    // only Categories need to use 'mic_desc_text'
    if (has(items[0], 'mic_desc_text')) {
      codeOrText = 'mic_desc_text';
    }
    let queryProp = 'description';
    if (get(items, '[0].custom_description', false)) queryProp = 'custom_description';
    else if (get(items, '[0].long_description', false)) queryProp = 'long_description';
    else if (codeOrText === 'text') queryProp = 'text';
    else if (codeOrText === 'desc_text') queryProp = 'desc_text';
    else if (codeOrText === 'abbr_desc_text') queryProp = 'abbr_desc_text';
    else if (codeOrText === 'mic_desc_text') queryProp = 'mic_desc_text';
    else if (has(items[0], 'name')) queryProp = 'name';
    return items.map((item, index) => {
      const keyId = `${index}-${item}`;
      return (<ListItem
        item={item}
        {...rest}
        key={keyId}
        queryProp={queryProp}
      />);
    });
  }

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };

  return (isLoading ?
    <Spinner type="bureau-filters" size="small" /> :
    <div className="position-search">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Manage Entry Level" icon="keyboard-o" className="xl-icon" />
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
          <div className="usa-width-one-whole position-search--filters--pv-man results-dropdown">
            <div className="filter-div">
              <div className="label">TP:</div>
              <Picky
                {...pickyProps}
                placeholder="Select TP(s)"
                value={selectedTps}
                options={tpsOptions}
                onChange={setSelectedTps}
                valueKey="id"
                labelKey="name"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Bureau:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Bureau(s)"
                value={selectedBureaus}
                options={bureausOptions}
                onChange={setSelectedBureaus}
                valueKey="code"
                labelKey="long_description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Organization:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Organization(s)"
                value={selectedOrgs}
                options={organizationOptions}
                onChange={setSelectedOrgs}
                valueKey="code"
                labelKey="name"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Grade:</div>
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
            <div className="filter-div">
              <div className="label">Skills:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Skill(s)"
                value={selectedSkills}
                options={skillsOptions}
                onChange={setSelectedSkills}
                valueKey="code"
                labelKey="custom_description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Job Categories:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Categories(s)"
                value={selectedJobs}
                options={jobsOptions}
                onChange={setSelectedJobs}
                valueKey="code"
                labelKey="custom_description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Language:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Language(s)"
                value={selectedLanguages}
                options={languagesOptions}
                onChange={setSelectedLanguages}
                valueKey="code"
                labelKey="custom_description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <CheckBox
                id="overseas"
                label="Overseas"
                value={overseas}
                onChange={setOverseas}
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <CheckBox
                id="domestic"
                label="Domestic"
                value={domestic}
                onChange={setDomestic}
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
          {dummyIds.map(k => (
            <EntryLevelCard
              id={k}
              key={k}
              result={dummyPositionDetails}
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


ManageEntryLevel.propTypes = {
  bureauFiltersIsLoading: PropTypes.bool,
};

ManageEntryLevel.defaultProps = {
  bureauFilters: { filters: [] },
  bureauPositions: { results: [] },
  bureauFiltersIsLoading: false,
  bureauPositionsIsLoading: false,
};

export default ManageEntryLevel;
