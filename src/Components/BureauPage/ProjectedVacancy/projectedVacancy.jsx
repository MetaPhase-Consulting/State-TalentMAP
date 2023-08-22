import { useEffect, useState } from 'react';
import SelectForm from 'Components/SelectForm';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import { PUBLISHABLE_POSITIONS_PAGE_SIZES, PUBLISHABLE_POSITIONS_SORT } from 'Constants/Sort';
import { projectedVacancyAddToProposedCycle, projectedVacancyFetchData, saveProjectedVacancySelections } from 'actions/projectedVacancy';
import Spinner from 'Components/Spinner';
import ListItem from 'Components/BidderPortfolio/BidControls/BidCyclePicker/ListItem';
import Alert from 'Components/Alert';
import { onEditModeSearch } from 'utilities';
import { get, has, includes, sortBy, uniqBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useDataLoader } from 'hooks';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import Picky from 'react-picky';
import { filtersFetchData } from 'actions/filters/filters';
import api from '../../../api';
import ScrollUpButton from '../../ScrollUpButton';
import ProjectedVacancyCard from '../../ProjectedVacancyCard/ProjectedVacancyCard';

const ProjectedVacancy = ({ isAO }) => {
  const dispatch = useDispatch();

  const userSelections = useSelector(state => state.projectedVacancySelections);
  const positions = useSelector(state => state.projectedVacancy);
  const positions$ = positions?.results;
  const [limit, setLimit] = useState(get(userSelections, 'limit') || PUBLISHABLE_POSITIONS_PAGE_SIZES.defaultSize);
  const [ordering, setOrdering] = useState(get(userSelections, 'ordering') || PUBLISHABLE_POSITIONS_SORT.defaultSort);
  const [cardsInEditMode, setCardsInEditMode] = useState([]);

  const genericFiltersIsLoading = useSelector(state => state.filtersIsLoading);
  const genericFilters = useSelector(state => state.filters);

  const [selectedBureaus, setSelectedBureaus] = useState(userSelections?.selectedBureaus || []);
  const [selectedOrgs, setSelectedOrgs] = useState(userSelections?.selectedOrgs || []);
  const [selectedGrades, setSelectedGrades] = useState(userSelections?.selectedGrade || []);
  const [selectedSkills, setSelectedSkills] = useState(userSelections?.selectedSkills || []);
  const [selectedLanguages, setSelectedLanguages] =
    useState(userSelections?.selectedLanguage || []);
  const [selectedBidCycles, setSelectedBidCycles] =
    useState(userSelections?.selectedBidCycle || []);
  const [clearFilters, setClearFilters] = useState(false);

  const [includedPositions, setIncludedPositions] = useState([]);

  useEffect(() => {
    if (positions$) {
      setIncludedPositions(positions$.map(k => k.id));
    }
  }, [positions]);

  const genericFilters$ = get(genericFilters, 'filters') || [];
  const bureaus = genericFilters$.find(f => get(f, 'item.description') === 'region');
  const bureausOptions = uniqBy(sortBy(get(bureaus, 'data'), [(b) => b.short_description]));
  const grades = genericFilters$.find(f => get(f, 'item.description') === 'grade');
  const gradesOptions = uniqBy(get(grades, 'data'), 'code');
  const skills = genericFilters$.find(f => get(f, 'item.description') === 'skill');
  const skillsOptions = uniqBy(sortBy(get(skills, 'data'), [(s) => s.description]), 'code');
  const languages = genericFilters$.find(f => get(f, 'item.description') === 'language');
  const languagesOptions = uniqBy(sortBy(get(languages, 'data'), [(c) => c.custom_description]), 'custom_description');
  const cycles = genericFilters$.find(f => get(f, 'item.description') === 'bidCycle');
  const cycleOptions = uniqBy(sortBy(get(cycles, 'data'), [(c) => c.custom_description]), 'custom_description');

  const { data: orgs, loading: orgsLoading } = useDataLoader(api().get, '/fsbid/agenda_employees/reference/current-organizations/');
  const organizationOptions = sortBy(get(orgs, 'data'), [(o) => o.name]);

  const projectVacancyFiltersIsLoading =
    includes([orgsLoading], true);

  const pageSizes = PUBLISHABLE_POSITIONS_PAGE_SIZES;
  const sorts = PUBLISHABLE_POSITIONS_SORT;
  const isLoading = genericFiltersIsLoading || projectVacancyFiltersIsLoading;
  const disableSearch = cardsInEditMode.length > 0;
  const disableInput = isLoading || disableSearch;

  const getQuery = () => ({
    limit,
    ordering,
    // User Filters
    position__bureau__code__in: selectedBureaus.map(bureauObject => (bureauObject?.code)),
    position__org__code__in: selectedOrgs.map(orgObject => (orgObject?.code)),
    is_available_in_bidcycle: selectedBidCycles.map(cycleObject => (cycleObject?.id)),
    language_codes: selectedLanguages.map(langObject => (langObject?.code)),
    position__grade__code__in: selectedGrades.map(gradeObject => (gradeObject?.code)),
    position__skill__code__in: selectedSkills.map(skillObject => (skillObject?.code)),
  });

  const resetFilters = () => {
    setSelectedBureaus([]);
    setSelectedOrgs([]);
    setSelectedGrades([]);
    setSelectedLanguages([]);
    setSelectedSkills([]);
    setSelectedBidCycles([]);
    setClearFilters(false);
  };

  const getCurrentInputs = () => ({
    selectedBureaus,
    selectedOrgs,
    selectedGrade: selectedGrades,
    selectedLanguage: selectedLanguages,
    selectedSkills,
    selectedBidCycle: selectedBidCycles,
  });

  useEffect(() => {
    dispatch(saveProjectedVacancySelections(getCurrentInputs()));
    dispatch(filtersFetchData(genericFilters));
  }, []);

  const fetchAndSet = () => {
    const filters = [
      selectedBureaus,
      selectedOrgs,
      selectedGrades,
      selectedLanguages,
      selectedSkills,
      selectedBidCycles,
    ];
    if (filters.flat().length === 0) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
    dispatch(projectedVacancyFetchData(getQuery()));
    dispatch(saveProjectedVacancySelections(getCurrentInputs()));
  };

  useEffect(() => {
    fetchAndSet();
  }, [
    limit,
    ordering,
    selectedBureaus,
    selectedOrgs,
    selectedGrades,
    selectedLanguages,
    selectedSkills,
    selectedBidCycles,
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

  const onIncludedUpdate = (id, include) => {
    if (include) {
      setIncludedPositions([...includedPositions, id]);
    } else {
      setIncludedPositions(includedPositions.filter(x => x !== id));
    }
  };

  const addToProposedCycle = () => {
    dispatch(projectedVacancyAddToProposedCycle());
  };

  return (
    isLoading ?
      <Spinner type="bureau-filters" size="small" /> :
      <div className="position-search">
        <div className="usa-grid-full position-search--header">
          <ProfileSectionTitle title="Projected Vacancy Management" icon="keyboard-o" className="xl-icon" />
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
                <div className="label">Bid Cycle:</div>
                <Picky
                  {...pickyProps}
                  placeholder="Select Bid Cycle(s)"
                  value={selectedBidCycles}
                  options={cycleOptions}
                  onChange={setSelectedBidCycles}
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
            </div>
          </div>
        </div>
        {
          <div className="position-search-controls--results padding-top results-dropdown">
            <SelectForm
              id="projected-vacancy-sort-results"
              options={sorts.options}
              label="Sort by:"
              defaultSort={ordering}
              onSelectOption={value => setOrdering(value.target.value)}
              disabled={disableSearch}
            />
            <SelectForm
              id="projected-vacancy-num-results"
              options={pageSizes.options}
              label="Results:"
              defaultSort={limit}
              onSelectOption={value => setLimit(value.target.value)}
              disabled={disableSearch}
            />
            <ScrollUpButton />
          </div>
        }
        {
          disableSearch &&
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
          <div className="proposed-cycle-banner">
            {includedPositions.length} {includedPositions.length === 1 ? 'Position' : 'Positions'} Selected
            {
              isAO &&
              <button className="usa-button-secondary" onClick={addToProposedCycle} disabled={!includedPositions.length}>Add to Proposed Cycle</button>
            }
          </div>
          <div className="usa-grid-full position-list">
            {positions$ && positions$.map(k => (
              <ProjectedVacancyCard
                result={k}
                key={k.id}
                id={k.id}
                updateIncluded={onIncludedUpdate}
                onEditModeSearch={(editMode, id) =>
                  onEditModeSearch(editMode, id, setCardsInEditMode, cardsInEditMode)}
              />
            ))}
          </div>
        </div>
        {/* placeholder for when we put in pagination */}
        {
          disableSearch &&
          <div className="disable-react-paginate-overlay" />
        }
      </div>
  );
};


ProjectedVacancy.propTypes = {
  bureauFiltersIsLoading: PropTypes.bool,
  isAO: PropTypes.bool.isRequired,
};

ProjectedVacancy.defaultProps = {
  bureauFilters: { filters: [] },
  bureauPositions: { results: [] },
  bureauFiltersIsLoading: false,
  bureauPositionsIsLoading: false,
};

export default ProjectedVacancy;
