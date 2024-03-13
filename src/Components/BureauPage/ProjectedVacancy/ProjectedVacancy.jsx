import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Picky from 'react-picky';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  projectedVacancyEdit, projectedVacancyFetchData, projectedVacancyFilters,
  projectedVacancyLangOffsetOptions, projectedVacancyLangOffsets, saveProjectedVacancySelections,
} from 'actions/projectedVacancy';
import { onEditModeSearch, renderSelectionList } from 'utilities';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import ScrollUpButton from 'Components/ScrollUpButton';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import ProjectedVacancyCard from '../../ProjectedVacancyCard/ProjectedVacancyCard';

const ProjectedVacancy = ({ isAO }) => {
  const dispatch = useDispatch();

  const userSelections = useSelector(state => state.projectedVacancySelections);
  const filters = useSelector(state => state.projectedVacancyFilters) || [];
  const filtersLoading = useSelector(state => state.projectedVacancyFiltersLoading);
  const languageOffsetOptions = useSelector(state => state.projectedVacancyLangOffsetOptions) || [];
  const languageOffsetOptionsLoading =
    useSelector(state => state.projectedVacancyLangOffsetOptionsLoading);
  const positionsData = useSelector(state => state.projectedVacancy);
  const positionsLoading = useSelector(state => state.projectedVacancyFetchDataLoading);
  const positions = positionsData?.length ? positionsData : [];
  const languageOffsets = useSelector(state => state.projectedVacancyLangOffsets) || [];

  const [includedPositions, setIncludedPositions] = useState([]);
  const [cardsInEditMode, setCardsInEditMode] = useState([]);
  const [clearFilters, setClearFilters] = useState(false);
  const [selectedBureaus, setSelectedBureaus] =
    useState(userSelections?.selectedBureaus || []);
  const [selectedOrganizations, setSelectedOrganizations] =
    useState(userSelections?.selectedOrganizations || []);
  const [selectedGrades, setSelectedGrades] =
    useState(userSelections?.selectedGrade || []);
  const [selectedSkills, setSelectedSkills] =
    useState(userSelections?.selectedSkills || []);
  const [selectedLanguages, setSelectedLanguages] =
    useState(userSelections?.selectedLanguage || []);
  const [selectedBidSeasons, setSelectedBidSeasons] =
    useState(userSelections?.selectedBidSeasons || []);

  const bureaus = sortBy(filters?.bureaus || [], [o => o.description]);
  const grades = sortBy(filters?.grades || [], [o => o.code]);
  const skills = sortBy(filters?.skills || [], [o => o.description]);
  const languages = sortBy(filters?.languages || [], [o => o.description]);
  const bidSeasons = sortBy(filters?.bid_seasons || [], [o => o.description]);
  const organizations = sortBy(filters?.organizations || [], [o => o.description]);
  const statuses = sortBy(filters?.statuses || [], [o => o.description]);

  const resultsLoading = positionsLoading || languageOffsetOptionsLoading;
  const disableSearch = cardsInEditMode?.length > 0;
  const disableInput = filtersLoading || resultsLoading || disableSearch;

  const getQuery = () => ({
    bureaus: selectedBureaus?.map(o => o?.code),
    organizations: selectedOrganizations?.map(o => o?.code),
    bidSeasons: selectedBidSeasons?.map(o => o?.code),
    languages: selectedLanguages?.map(o => o?.code),
    grades: selectedGrades?.map(o => o?.code),
    skills: selectedSkills?.map(o => o?.code),
  });

  const resetFilters = () => {
    setSelectedBureaus([]);
    setSelectedOrganizations([]);
    setSelectedGrades([]);
    setSelectedLanguages([]);
    setSelectedSkills([]);
    setSelectedBidSeasons([]);
    setClearFilters(false);
  };

  const getCurrentInputs = () => ({
    selectedBureaus,
    selectedOrganizations,
    selectedGrades,
    selectedLanguages,
    selectedSkills,
    selectedBidSeasons,
  });

  const submitEdit = (editData, onSuccess) => {
    dispatch(projectedVacancyEdit(getQuery(), editData, onSuccess));
  };

  useEffect(() => {
    dispatch(saveProjectedVacancySelections(getCurrentInputs()));
    dispatch(projectedVacancyFilters());
    dispatch(projectedVacancyLangOffsetOptions());
  }, []);

  useEffect(() => {
    if (positions.length) {
      setIncludedPositions(
        positions?.filter(
          p => p.future_vacancy_exclude_import_indicator === 'N',
        )?.map(
          k => k.future_vacancy_seq_num,
        ),
      );
      dispatch(projectedVacancyLangOffsets({
        position_numbers: positions?.map(o => o.position_number) || [],
      }));
    }
  }, [positions]);

  const fetchAndSet = () => {
    const f = [
      selectedBureaus,
      selectedOrganizations,
      selectedGrades,
      selectedLanguages,
      selectedSkills,
      selectedBidSeasons,
    ];
    if (f.flat()?.length === 0) {
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
    selectedBureaus,
    selectedOrganizations,
    selectedGrades,
    selectedLanguages,
    selectedSkills,
    selectedBidSeasons,
  ]);

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
      setIncludedPositions(includedPositions?.filter(x => x !== id));
    }
  };

  const addToProposedCycle = () => {
    const updatedPvs = [];
    positions.forEach(p => {
      const include = includedPositions.find(o => o === p.future_vacancy_seq_num);
      const currentValue = p.future_vacancy_exclude_import_indicator;
      const needsUpdate = (currentValue === 'Y' && include) || (currentValue === 'N' && !include);
      if (needsUpdate) {
        updatedPvs.push({
          ...p,
          future_vacancy_exclude_import_indicator: include ? 'Y' : 'N',
        });
      }
    });
    const editData = { projected_vacancy: updatedPvs };
    dispatch(projectedVacancyEdit(getQuery(), editData));
  };

  return (filtersLoading ?
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
              <div className="label">Bid Season:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Bid Season(s)"
                value={selectedBidSeasons}
                options={bidSeasons}
                onChange={setSelectedBidSeasons}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Bureau:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Bureau(s)"
                value={selectedBureaus}
                options={bureaus}
                onChange={setSelectedBureaus}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Organization:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Organization(s)"
                value={selectedOrganizations}
                options={organizations}
                onChange={setSelectedOrganizations}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Skills:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Skill(s)"
                value={selectedSkills}
                options={skills}
                onChange={setSelectedSkills}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Grade:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Grade(s)"
                value={selectedGrades}
                options={grades}
                onChange={setSelectedGrades}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
            <div className="filter-div">
              <div className="label">Language:</div>
              <Picky
                {...pickyProps}
                placeholder="Select Language(s)"
                value={selectedLanguages}
                options={languages}
                onChange={setSelectedLanguages}
                valueKey="code"
                labelKey="description"
                disabled={disableInput}
              />
            </div>
          </div>
        </div>
      </div>
      <ScrollUpButton />
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
      {resultsLoading ?
        <Spinner type="standard-center" size="small" /> :
        <div className="usa-width-one-whole position-search--results mt-20">
          <div className="proposed-cycle-banner">
            {includedPositions?.length} {includedPositions?.length === 1 ? 'Position' : 'Positions'} Selected
            {isAO &&
              <button
                className="usa-button-secondary"
                onClick={addToProposedCycle}
                disabled={!includedPositions?.length}
              >
                Add to Proposed Cycle
              </button>
            }
          </div>
          <div className="usa-grid-full position-list">
            {positions?.map(k => (
              <ProjectedVacancyCard
                result={k}
                languageOffsets={
                  (languageOffsets?.length &&
                    languageOffsets?.find(o => o?.position_number === k?.position_number)
                  ) || {}
                }
                key={k.future_vacancy_seq_num}
                updateIncluded={onIncludedUpdate}
                onEditModeSearch={(editMode, id) =>
                  onEditModeSearch(editMode, id, setCardsInEditMode, cardsInEditMode)
                }
                onSubmit={editData => submitEdit(editData)}
                selectOptions={{
                  languageOffsets: languageOffsetOptions,
                  bidSeasons,
                  statuses,
                }}
              />
            ))}
          </div>
        </div>
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

