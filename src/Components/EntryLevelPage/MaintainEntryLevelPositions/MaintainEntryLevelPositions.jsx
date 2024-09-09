import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import Picky from 'react-picky';
import { renderSelectionList } from 'utilities';
import PositionManagerSearch from 'Components/BureauPage/PositionManager/PositionManagerSearch';
import ProfileSectionTitle from 'Components/ProfileSectionTitle';
import CheckBox from 'Components/CheckBox';
import SelectForm from 'Components/SelectForm';
import { filter, flatten, isEmpty } from 'lodash';

const MaintainEntryLevelPositions = () => {
  const isLoading = useSelector(state => state.isLoading);
  const userSelections = useSelector(state => state.entryLevelSelections);
  const [selectedTps, setSelectedTps] = useState(userSelections?.selectedTps || []);
  const [selectedBureaus, setSelectedBureaus] = useState(userSelections?.selectedBureaus || []);
  const [selectedOrgs, setSelectedOrgs] = useState(userSelections?.selectedOrgs || []);
  const [selectedGrades, setSelectedGrades] = useState(userSelections?.selectedGrade || []);
  const [selectedSkills, setSelectedSkills] = useState(userSelections?.selectedSkills || []);
  const [selectedLanguages, setSelectedLanguages] = useState(userSelections?.selectedLanguage || []);
  const [overseas, setOverseas] = useState(userSelections?.overseas || false);
  const [domestic, setDomestic] = useState(userSelections?.domestic || false);
  const [selectedGridPreference, setSelectedGridPreference] = useState(userSelections?.gridPreference || '');
  const [textSearch, setTextSearch] = useState('');
  const [clearFilters, setClearFilters] = useState(false);

  // const elFiltersList = useSelector(state => state.entryLevelFilters);
  const tpFilters = []; // = elFiltersList?.tpFilters;
  const bureauFilters = []; // = elFiltersList?.bureauFilters;
  const orgFilters = []; // = elFiltersList?.orgFilters;
  const gradeFilters = []; // = elFiltersList?.gradeFilters;
  const skillsFilters = []; // = elFiltersList?.skillsFilters;
  const languageFilters = []; // = elFiltersList?.languageFilters;
  const gridPreferences = [{ value: '1', text: 'Grid 1' }, { value: '2', text: 'Grid 2' }];

  const childRef = useRef();

  const fetchAndSet = () => {
    const filters = [
      selectedTps,
      selectedBureaus,
      selectedOrgs,
      selectedGrades,
      selectedSkills,
      selectedLanguages,
    ];
    if (isEmpty(filter(flatten(filters))) && !overseas && !domestic && isEmpty(selectedGridPreference) && isEmpty(textSearch)) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  };

  const resetFilters = () => {
    setSelectedTps([]);
    setSelectedBureaus([]);
    setSelectedOrgs([]);
    setSelectedGrades([]);
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setOverseas(false);
    setDomestic(false);
    setSelectedGridPreference('');
    setClearFilters(false);
  };

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };

  useEffect(() => {
    fetchAndSet();
  }, [selectedTps, selectedBureaus, selectedOrgs, selectedGrades, selectedSkills, selectedLanguages, overseas, domestic, selectedGridPreference, textSearch]);

  return (
    <div className="entry-level-page position-search search-bar-container">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Maintain Entry Level Positions" icon="keyboard-o" />
        <PositionManagerSearch
          ref={childRef}
          placeHolder="Search using Position Number or Position Title"
          textSearch={textSearch}
          onChange={setTextSearch}
          noButton
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
        <div className="usa-width-one-whole position-search--filters--el results-dropdown">
          <div className="filter-div">
            <div className="label">Tracking Program:</div>
            <Picky
              {...pickyProps}
              placeholder="Select TP(s)"
              value={selectedTps}
              options={tpFilters}
              onChange={setSelectedTps}
              valueKey="code"
              labelKey="description"
            />
          </div>
          <div className="filter-div">
            <div className="label">Bureau:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Bureau(s)"
              value={selectedBureaus}
              options={bureauFilters}
              onChange={setSelectedBureaus}
              valueKey="code"
              labelKey="description"
            />
          </div>
          <div className="filter-div">
            <div className="label">Location/Org:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Organization(s)"
              value={selectedOrgs}
              options={orgFilters}
              onChange={setSelectedOrgs}
              valueKey="code"
              labelKey="description"
            />
          </div>
          <div className="filter-div">
            <div className="label">Grade:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Grade(s)"
              value={selectedGrades}
              options={gradeFilters}
              onChange={setSelectedGrades}
              valueKey="code"
              labelKey="description"
            />
          </div>
          <div className="filter-div">
            <div className="label">Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Skill(s)"
              value={selectedSkills}
              options={skillsFilters}
              onChange={setSelectedSkills}
              valueKey="code"
              labelKey="custom_description"
            />
          </div>
          <div className="filter-div">
            <div className="label">Languages:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Language(s)"
              value={selectedLanguages}
              options={languageFilters}
              onChange={setSelectedLanguages}
              valueKey="code"
              labelKey="description"
            />
          </div>
          <div className="filter-div">
            <CheckBox
              id="overseas"
              label="Overseas Only"
              value={overseas}
              onCheckBoxClick={e => setOverseas(e)}
              disabled={domestic}
            />
            <CheckBox
              id="domestic"
              label="Domestic Only"
              value={domestic}
              onCheckBoxClick={e => setDomestic(e)}
              disabled={overseas}
            />
          </div>
          <div className="filter-div">
            <div className="label">Grid Preferences:</div>
            <SelectForm
              id="grid-preference-filter"
              className={`select-filter ${selectedGridPreference === '' ? 'select-filter--disabled' : ''}`}
              options={gridPreferences}
              defaultSort={selectedGridPreference}
              onSelectOption={e => setSelectedGridPreference(e.target.value)}
              disabled={isLoading}
              includeFirstEmptyOption
              labelSrOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintainEntryLevelPositions;
