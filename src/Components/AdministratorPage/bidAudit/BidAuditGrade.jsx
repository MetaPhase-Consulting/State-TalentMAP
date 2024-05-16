import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import FA from 'react-fontawesome';
import Picky from 'react-picky';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import BackButton from 'Components/BackButton';
import { bidAuditSecondFetchData } from 'actions/bidAudit';
import { renderSelectionList } from 'utilities';
import BidAuditGradeCard from './BidAuditGradeCard';

const BidAuditGrade = (props) => {
  const dispatch = useDispatch();

  const routeCycleID = props?.match.params.cycleId;
  const routeAuditID = props?.match.params.auditId;

  const bidAuditGradeData = useSelector(state => state.bidAuditSecondFetchData);
  const bidAuditGradeFetchLoading = useSelector(state => state.bidAuditSecondFetchDataLoading);
  const bidAuditGradeFetchError = useSelector(state => state.bidAuditSecondFetchDataErrored);

  const [cardsInEditMode, setCardsInEditMode] = useState([]);
  const disableSearch = cardsInEditMode.length > 0;

  useEffect(() => {
    dispatch(bidAuditSecondFetchData(routeCycleID, routeAuditID, 'grade'));
  }, []);

  const onBidAuditGradeEdit = (editMode, id) => {
    if (editMode) {
      setCardsInEditMode([id]);
    } else {
      setCardsInEditMode(cardsInEditMode.filter(x => x !== id));
    }
  };

  // ======================================================================================= Filters
  const [bidAuditGradeData$, setBidAuditGradeData$] = useState(bidAuditGradeData?.in_categories);
  const [clearFilters, setClearFilters] = useState(false);

  const [selectedPositionSkillCodes, setSelectedPositionSkillCodes] = useState([]);
  const [selectedPositionSkillDesc, setSelectedPositionSkillDesc] = useState([]);
  const [selectedPositionGrades, setSelectedPositionGrades] = useState([]);
  const [selectedEmployeeGrades, setSelectedEmployeeGrades] = useState([]);
  const [selectedEmployeeSkillDescs, setSelectedEmployeeSkillDescs] = useState([]);
  const [selectedEmployeeSkillCodes, setSelectedEmployeeSkillCodes] = useState([]);
  const [selectedEmployeeTenureCodes, setSelectedEmployeeTenureCodes] = useState([]);
  const [selectedEmployeeTenureDescs, setSelectedEmployeeTenureDescs] = useState([]);

  const noFiltersSelected = [
    selectedPositionSkillCodes,
    selectedPositionSkillDesc,
    selectedPositionGrades,
    selectedEmployeeGrades,
    selectedEmployeeSkillDescs,
    selectedEmployeeSkillCodes,
    selectedEmployeeTenureCodes,
    selectedEmployeeTenureDescs].flat().length === 0;

  const resetFilters = () => {
    setSelectedPositionSkillCodes([]);
    setSelectedPositionSkillDesc([]);
    setSelectedPositionGrades([]);
    setSelectedEmployeeGrades([]);
    setSelectedEmployeeSkillDescs([]);
    setSelectedEmployeeSkillCodes([]);
    setSelectedEmployeeTenureCodes([]);
    setSelectedEmployeeTenureDescs([]);
    setClearFilters(false);
  };

  const filterData = () => {
    if (noFiltersSelected) return bidAuditGradeData?.at_grades;
    let filteredData = bidAuditGradeData?.at_grades;
    if (selectedPositionGrades.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedPositionGrades.some(descriptions => descriptions.code === category.position_grade_code),
      );
    }
    if (selectedPositionSkillCodes.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedPositionSkillCodes.some(codes => codes.code === category.position_skill_code),
      );
    }
    if (selectedPositionSkillDesc.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedPositionSkillDesc.some(descriptions => descriptions.code === category.position_skill_desc),
      );
    }
    if (selectedEmployeeGrades.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedEmployeeGrades.some(codes => codes.code === category.employee_grade_code),
      );
    }
    if (selectedEmployeeSkillDescs.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedEmployeeSkillDescs.some(codes => codes.code === category.employee_skill_desc),
      );
    }
    if (selectedEmployeeSkillCodes.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedEmployeeSkillCodes.some(descriptions => descriptions.code === category.employee_skill_code),
      );
    }
    if (selectedEmployeeTenureCodes.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedEmployeeTenureCodes.some(descriptions => descriptions.code === category.employee_tenure_code),
      );
    }
    if (selectedEmployeeTenureDescs.length > 0) {
      filteredData = filteredData.filter(category =>
        selectedEmployeeTenureDescs.some(codes => codes.code === category.employee_tenure_desc),
      );
    }
    return filteredData;
  };

  useEffect(() => {
    setBidAuditGradeData$(filterData);
    if (noFiltersSelected) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  }, [
    selectedPositionSkillCodes,
    selectedPositionSkillDesc,
    selectedPositionGrades,
    selectedEmployeeGrades,
    selectedEmployeeSkillDescs,
    selectedEmployeeSkillCodes,
    selectedEmployeeTenureCodes,
    selectedEmployeeTenureDescs,
    bidAuditGradeData,
  ]);

  const getUniqData = (value) => {
    const gradeData = bidAuditGradeData?.at_grades?.map(atGradeData => atGradeData[value]);
    const uniq = [...new Set(gradeData)];
    const uniqObj = uniq?.map(x => ((!x || x === ' ') ? { code: x, text: 'None Listed' } : { code: x, text: x }));
    return uniqObj;
  };

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };
  // ======================================================================================= Filters


  const onAtGradeSave = () => {
    swal.close();
  };

  const gradeOptions = [
    { code: 1, name: '01' },
    { code: 2, name: '02' },
    { code: 3, name: '03' },
    { code: 4, name: '04' },
    { code: 5, name: '05' },
    { code: 6, name: '06' },
  ];

  const skillCode = [
    { code: 1, name: '2044' },
    { code: 2, name: '2045' },
    { code: 3, name: '2046' },
    { code: 4, name: '2047' },
    { code: 5, name: '2048' },
    { code: 6, name: '2049' },
  ];

  const tenureCode = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];

  const onNewAtGrade = () => {
    swal({
      title: 'Add New At Grade',
      button: false,
      closeOnEsc: true,
      content: (
        <div className="position-form bid-audit-form-modal">
          <div className="filter-div-modal">
            <div className="label">Position Grade:</div>
            <select disabled>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade?.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Position Skill Code - Description:</div>
            {/* these disabled dropdowns probably dont need to be dropdowns will fix in next PR */}
            <select disabled>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Employee Grade:</div>
            <select>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Tenure Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={onAtGradeSave}>Save</button>
            <button onClick={() => swal.close()}>Cancel</button>
          </div>
        </div>
      ),
    });
  };

  const noResults = bidAuditGradeData$?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (bidAuditGradeFetchLoading) {
      overlay = <Spinner type="bureau-results" class="homepage-position-results" size="big" />;
    } else if (bidAuditGradeFetchError) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else if (noResults) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'Please broaden your search criteria and try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    <div className="position-search bid-audit-page">
      <div className="usa-grid-full position-search--header">
        <BackButton />
        <ProfileSectionTitle title="Bid Audit - At Grade" icon="keyboard-o" className="xl-icon" />

        <div className="filterby-container" >
          <div className="filterby-label">Filter by:</div>
          <span className="filterby-clear">
            {clearFilters &&
                  <button className="unstyled-button" onClick={resetFilters} disabled={disableSearch}>
                    <FA name="times" />
                  Clear Filters
                  </button>
            }
          </span>
        </div>

        <div className="usa-width-one-whole position-search--filters--cm">
          <div className="filter-div">
            <div className="ba-label">Position Grade:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Skill Code"
              options={getUniqData('position_grade_code')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionGrades}
              value={selectedPositionGrades}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Skill Code:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Skill Code"
              options={getUniqData('position_skill_code')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionSkillCodes}
              value={selectedPositionSkillCodes}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Skill"
              options={getUniqData('position_skill_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionSkillDesc}
              value={selectedPositionSkillDesc}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Grade:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Grade"
              options={getUniqData('employee_grade_code')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeGrades}
              value={selectedEmployeeGrades}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Skill Code:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Skill Code"
              options={getUniqData('employee_skill_code')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeSkillCodes}
              value={selectedEmployeeSkillCodes}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Skill"
              options={getUniqData('employee_skill_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeSkillDescs}
              value={selectedEmployeeSkillDescs}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Tenure Code:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Tenure Code"
              options={getUniqData('employee_tenure_code')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeTenureCodes}
              value={selectedEmployeeTenureCodes}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Tenure:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Skill"
              options={getUniqData('employee_tenure_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeTenureDescs}
              value={selectedEmployeeTenureDescs}
              disabled={disableSearch}
            />
          </div>
        </div>
      </div>

      {getOverlay() ||
        <div className="usa-width-one-whole position-search--results ">

          <span className="ba-subheading">
            <div className="ba-audit-info">{`Cycle Name: ${bidAuditGradeData?.audit_info?.cycle_name}`}</div>
            <div className="ba-audit-info">{`Posted by Date: ${bidAuditGradeData?.audit_info?.posted_by_date}`}</div>
            <div className="ba-audit-info">{`Audit Number: ${bidAuditGradeData?.audit_info?.audit_number}`}</div>
            <div className="icon-text-link ml-10">
              <a role="button" tabIndex={0} onClick={() => onNewAtGrade()} >
                <FA name="plus" />Add New At Grade</a>
            </div>
          </span>
          <span className="ba-subheading">
            <div className="ba-audit-sub-info">Employee Grades, Skills and Tenures considered At-Grade for Positions in a Bid Cycle</div>
          </span>

          {
            disableSearch &&
            <Alert
              type="warning"
              title={'Edit Mode (Search Disabled)'}
              messages={[{
                body: 'Discard or save your edits before searching. ' +
                  'Filters are disabled if any cards are in Edit Mode.',
              },
              ]}
            />
          }

          <div className="usa-grid-full position-list ba-scroll-container">
            {
              bidAuditGradeData$?.map(positionData => (
                <BidAuditGradeCard
                  data={positionData}
                  key={positionData.id}
                  isOpen={cardsInEditMode?.includes(positionData?.id)}
                  onEditModeSearch={(editMode, id) =>
                    onBidAuditGradeEdit(editMode, id)}
                />
              ))
            }
          </div>
        </div>
      }
    </div>
  );
};

BidAuditGrade.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      cycleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      auditId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

BidAuditGrade.defaultProps = {
  match: {},
};

export default withRouter(BidAuditGrade);
