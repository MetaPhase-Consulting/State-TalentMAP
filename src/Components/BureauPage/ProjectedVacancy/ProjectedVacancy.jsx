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
import { onEditModeSearch, renderSelectionList, userHasPermissions } from 'utilities';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import ScrollUpButton from 'Components/ScrollUpButton';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import ProjectedVacancyCard from '../../ProjectedVacancyCard/ProjectedVacancyCard';

const enableCycleImport = () => checkFlag('flags.projected_vacancy_cycle_import');

const ProjectedVacancy = () => {
  const dispatch = useDispatch();

  const userProfile = useSelector(state => state.userProfile);
  const isAo = userHasPermissions(['ao_user'], userProfile?.permission_groups);
  const isBureau = userHasPermissions(['bureau_user'], userProfile?.permission_groups);

  const userSelections = useSelector(state => state.projectedVacancySelections);
  const filters = useSelector(state => state.projectedVacancyFilters) || [];
  const filtersLoading = useSelector(state => state.projectedVacancyFiltersLoading);
  const filtersErrored = useSelector(state => state.projectedVacancyFiltersErrored);
  const languageOffsetOptions = useSelector(state => state.projectedVacancyLangOffsetOptions) || [];
  const languageOffsetOptionsLoading =
    useSelector(state => state.projectedVacancyLangOffsetOptionsLoading);
  const languageOffsetOptionsErrored =
    useSelector(state => state.projectedVacancyLangOffsetOptionsErrored);
  const positionsData = useSelector(state => state.projectedVacancy);
  const positionsLoading = useSelector(state => state.projectedVacancyFetchDataLoading);
  const positionsErrored = useSelector(state => state.projectedVacancyFetchDataErrored);
  const positions = positionsData?.length ? positionsData : [];
  const languageOffsets = useSelector(state => state.projectedVacancyLangOffsets) || [];
  const languageOffsetsLoading = useSelector(state => state.projectedVacancyLangOffsetsLoading);
  const languageOffsetsErrored = useSelector(state => state.projectedVacancyLangOffsetsErrored);

  const [includedPositions, setIncludedPositions] = useState([]);
  const [importedPositions, setImportedPositions] = useState([]);
  const [cardsInEditMode, setCardsInEditMode] = useState([]);
  const [includedInEditMode, setIncludedInEditMode] = useState(false);
  const [importInEditMode, setImportInEditMode] = useState(false);
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
  const [selectedCycle, setSelectedCycle] =
    useState(userSelections?.selectedCycle || null);

  const bureaus = sortBy(filters?.bureaus || [], [o => o.description]);
  const grades = sortBy(filters?.grades || [], [o => o.code]);
  const skills = sortBy(filters?.skills || [], [o => o.description]);
  const languages = sortBy(filters?.languages || [], [o => o.description]);
  const bidSeasons = sortBy(filters?.bid_seasons || [], [o => o.description]);
  const organizations = sortBy(filters?.organizations || [], [o => o.description]);
  const statuses = sortBy(filters?.statuses || [], [o => o.description]);
  // TODO: Include Cycle

  const resultsLoading = positionsLoading || languageOffsetsLoading || languageOffsetOptionsLoading;
  const resultsErrored =
    filtersErrored || languageOffsetOptionsErrored || positionsErrored || languageOffsetsErrored;
  const disableSearch = cardsInEditMode?.length > 0 || includedInEditMode || importInEditMode;
  const disableInput = filtersLoading || resultsLoading || disableSearch;

  const originalIncluded = positions?.filter(
    p => p.future_vacancy_exclude_import_indicator === 'N',
  )?.map(
    k => k.future_vacancy_seq_num,
  ) || [];

  // TODO: Use real field for cycle import in this function
  const originalImport = positions?.filter(
    p => p.future_vacancy_exclude_import_indicator === 'N',
  )?.map(
    k => k.future_vacancy_seq_num,
  ) || [];

  const getQuery = () => ({
    bureaus: selectedBureaus?.map(o => o?.code),
    organizations: selectedOrganizations?.map(o => o?.short_description),
    bidSeasons: selectedBidSeasons?.map(o => o?.code),
    languages: selectedLanguages?.map(o => o?.code),
    grades: selectedGrades?.map(o => o?.code),
    skills: selectedSkills?.map(o => o?.code),
    cycle: selectedCycle?.code,
  });

  const resetFilters = () => {
    setSelectedBureaus([]);
    setSelectedOrganizations([]);
    setSelectedGrades([]);
    setSelectedLanguages([]);
    setSelectedSkills([]);
    setSelectedBidSeasons([]);
    setSelectedCycle(null);
    setClearFilters(false);
  };

  const getCurrentInputs = () => ({
    selectedBureaus,
    selectedOrganizations,
    selectedGrades,
    selectedLanguages,
    selectedSkills,
    selectedBidSeasons,
    selectedCycle,
  });

  const filterSelectionValid = () => {
    // valid if: at least two distinct filters
    const fils = [
      selectedBureaus,
      selectedOrganizations,
      selectedGrades,
      selectedLanguages,
      selectedSkills,
      selectedBidSeasons,
    ];
    const a = [];
    fils.forEach(f => { if (f.length) { a.push(true); } });
    if (selectedCycle) {
      a.push(true);
    }
    return a.length > 1;
  };

  const getOverlay = () => {
    let overlay;
    if (resultsLoading) {
      overlay = <Spinner type="standard-center" class="homepage-position-results" size="big" />;
    } else if (positionsData?.length >= 500) {
      overlay = <Alert type="error" title="Result Load Reached Limit" messages={[{ body: 'The number of searched projected vacancies is too high to be displayed. Please refine the filter criteria.' }]} />;
    } else if (resultsErrored) {
      overlay = <Alert type="error" title="Error displaying Projected Vacancies" messages={[{ body: 'Please try again.' }]} />;
    } else if (!filterSelectionValid()) {
      overlay = <Alert type="info" title="Select Filters" messages={[{ body: 'Please select at least 2 distinct filters to search.' }]} />;
    } else if (!positionsData?.length) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'No projected vacancies for filter inputs.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

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
      setIncludedPositions(originalIncluded);
      setImportedPositions(originalImport);
      const posNums = positions?.map(o => o.position_number);
      const uniqPosNums = [...new Set(posNums)];
      dispatch(projectedVacancyLangOffsets({
        position_numbers: uniqPosNums || [],
      }));
    }
  }, [positions]);

  useEffect(() => {
    const diffExists = originalIncluded?.sort().join(',') !== includedPositions?.sort().join(',');
    if (diffExists) {
      setIncludedInEditMode(true);
    } else {
      setIncludedInEditMode(false);
    }
  }, [includedPositions]);

  useEffect(() => {
    const diffExists = originalImport?.sort().join(',') !== importedPositions?.sort().join(',');
    if (diffExists) {
      setImportInEditMode(true);
    } else {
      setImportInEditMode(false);
    }
  }, [importedPositions]);

  const fetchAndSet = () => {
    const f = [
      selectedBureaus,
      selectedOrganizations,
      selectedGrades,
      selectedLanguages,
      selectedSkills,
      selectedBidSeasons,
    ];
    if (f.flat()?.length === 0 && !selectedCycle) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
    if (filterSelectionValid()) {
      dispatch(projectedVacancyFetchData(getQuery()));
      dispatch(saveProjectedVacancySelections(getCurrentInputs()));
    }
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
    selectedCycle,
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

  const onImportUpdate = (id, imported) => {
    if (imported) {
      setImportedPositions([...importedPositions, id]);
    } else {
      setImportedPositions(importedPositions?.filter(x => x !== id));
    }
  };

  const markAsIncluded = () => {
    const updatedPvs = [];
    positions.forEach(p => {
      const include = includedPositions.find(o => o === p.future_vacancy_seq_num);
      const currentValue = p.future_vacancy_exclude_import_indicator;
      const needsUpdate = (currentValue === 'Y' && include) || (currentValue === 'N' && !include);

      // Exclude is NULL when Status: Expired, Inactive, Proposed
      let excludeIndicator = null;
      let statusCode = p.future_vacancy_status_code;

      if (include) {
        // Exclude is N when Status: Active
        excludeIndicator = 'N';
        statusCode = 'A';
      } else if (statusCode === 'X') {
        // Exclude is Y when Status: Excluded
        excludeIndicator = 'Y';
      }

      if (needsUpdate) {
        const overrideTED = p.future_vacancy_override_tour_end_date;
        updatedPvs.push({
          ...p,
          future_vacancy_override_tour_end_date: overrideTED ?
            new Date(overrideTED).toISOString().substring(0, 10) : null,
          future_vacancy_exclude_import_indicator: excludeIndicator,
          future_vacancy_status_code: statusCode,
        });
      }
    });
    const editData = { projected_vacancy: updatedPvs };
    dispatch(projectedVacancyEdit(getQuery(), editData));
  };

  const addToProposedCycle = () => {
    const updatedPvs = [];
    positions.forEach(p => {
      const imported = importedPositions.find(o => o === p.future_vacancy_seq_num);
      const currentValue = p.future_vacancy_exclude_import_indicator;
      const needsUpdate = (currentValue === 'Y' && imported) || (currentValue === 'N' && !imported);

      if (needsUpdate) {
        const overrideTED = p.future_vacancy_override_tour_end_date;
        updatedPvs.push({
          ...p,
          future_vacancy_override_tour_end_date: overrideTED ?
            new Date(overrideTED).toISOString().substring(0, 10) : null,
          // TODO: Change proposed cycle field
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
                valueKey="short_description"
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
            <div className="filter-div">
              <div className="label">Cycle:</div>
              <Picky
                {...pickyProps}
                multiple={false}
                placeholder="Select Cycle"
                value={selectedCycle}
                options={languages}
                onChange={setSelectedCycle}
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
          title="Edit Mode"
          customClassName="mb-10"
          messages={[{
            body: 'Discard or save your edits before searching, marking for include, adding to proposed cycle, or editing other projected vacancies. ' +
              'Filters, "Included" checkboxes, "Import" checkboxes, and other edit buttons are disabled if one card is in Edit Mode.',
          }]}
        />
      }
      {getOverlay() ||
        <div className="usa-width-one-whole position-search--results mt-20">
          <div className="double-action-banner">
            <div className="selected-submission-row">
              <span>
                {includedPositions?.length} {includedPositions?.length === 1 ? 'Position' : 'Positions'} Marked as Included
              </span>
              {(isBureau && includedInEditMode) &&
                <div>
                  <button
                    onClick={() => {
                      setIncludedInEditMode(false);
                      setIncludedPositions(originalIncluded);
                    }}
                    disabled={!includedPositions?.length}
                  >
                    Cancel
                  </button>
                  <button
                    className="usa-button-secondary"
                    onClick={markAsIncluded}
                    disabled={!includedPositions?.length}
                  >
                    Mark as Included
                  </button>
                </div>
              }
            </div>
            {enableCycleImport() &&
              <div className="selected-submission-row">
                <span>
                  {importedPositions?.length} {importedPositions?.length === 1 ? 'Position' : 'Positions'} Selected for Import
                </span>
                {(isAo && importInEditMode) &&
                  <div>
                    <button
                      onClick={() => {
                        setImportInEditMode(false);
                        setImportedPositions(originalImport);
                      }}
                      disabled={!importedPositions?.length}
                    >
                      Cancel
                    </button>
                    <button
                      className="usa-button-secondary"
                      onClick={addToProposedCycle}
                      disabled={!importedPositions?.length}
                    >
                      Add to Proposed Cycle
                    </button>
                  </div>
                }
              </div>
            }
          </div>
          <div className="usa-grid-full position-list">
            {positions?.map(k => (
              <ProjectedVacancyCard
                key={k.future_vacancy_seq_num}
                result={k}
                languageOffsets={
                  (languageOffsets?.length &&
                    languageOffsets?.find(o => o?.position_number === k?.position_number)
                  ) || {}
                }
                updateIncluded={onIncludedUpdate}
                disableIncluded={cardsInEditMode?.length > 0 || !isBureau || importInEditMode}
                updateImport={onImportUpdate}
                disableImport={cardsInEditMode?.length > 0 || !isAo || !selectedCycle || includedInEditMode || !enableCycleImport()}
                disableEdit={includedInEditMode || importInEditMode || disableSearch}
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
};

ProjectedVacancy.defaultProps = {
  bureauFilters: { filters: [] },
  bureauPositions: { results: [] },
  bureauFiltersIsLoading: false,
  bureauPositionsIsLoading: false,
};

export default ProjectedVacancy;

