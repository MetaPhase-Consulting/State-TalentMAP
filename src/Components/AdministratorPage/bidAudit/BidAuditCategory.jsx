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
import BidAuditCategoryCard from './BidAuditCategoryCard';

const BidAuditCategory = (props) => {
  const dispatch = useDispatch();

  const routeCycleID = props?.match.params.cycleId;
  const routeAuditID = props?.match.params.auditId;

  const bidAuditCategoryData = useSelector(state => state.bidAuditSecondFetchData);
  const bidAuditCategoryFetchLoading = useSelector(state => state.bidAuditSecondFetchDataLoading);
  const bidAuditCategoryFetchError = useSelector(state => state.bidAuditSecondFetchDataErrored);

  const [cardsInEditMode, setCardsInEditMode] = useState([]);
  const disableSearch = cardsInEditMode.length > 0;

  useEffect(() => {
    dispatch(bidAuditSecondFetchData(routeCycleID, routeAuditID, 'category'));
  }, []);

  const onBidAuditCategoryEdit = (editMode, id) => {
    if (editMode) {
      setCardsInEditMode([id]);
    } else {
      setCardsInEditMode(cardsInEditMode.filter(x => x !== id));
    }
  };

  // ======================================================================================= Filters
  const [bidAuditCategoryData$, setBidAuditCategoryData$] = useState(bidAuditCategoryData?.in_categories);
  const [clearFilters, setClearFilters] = useState(false);
  const [selectedPositionSkills, setSelectedPositionSkills] = useState([]);
  const [selectedEmployeeSkills, setSelectedEmployeeSkills] = useState([]);

  const noFiltersSelected = [
    selectedPositionSkills,
    selectedEmployeeSkills].flat().length === 0;

  const resetFilters = () => {
    setSelectedPositionSkills([]);
    setSelectedEmployeeSkills([]);
    setClearFilters(false);
  };

  const filterData = () => {
    if (noFiltersSelected) return bidAuditCategoryData?.in_categories;
    let skillCategories = bidAuditCategoryData?.in_categories;
    if (selectedPositionSkills.length > 0) {
      skillCategories = skillCategories.filter(category =>
        selectedPositionSkills.some(skill => skill.code === category.position_skill_code),
      );
    }
    if (selectedEmployeeSkills.length > 0) {
      skillCategories = skillCategories.filter(category =>
        selectedEmployeeSkills.some(skill => skill.code === category.employee_skill_code),
      );
    }
    return skillCategories;
  };

  useEffect(() => {
    setBidAuditCategoryData$(filterData);
    if (noFiltersSelected) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  }, [
    selectedPositionSkills,
    selectedEmployeeSkills,
    bidAuditCategoryData,
  ]);

  const getUniqData = (value, desc) => {
    const uniqFormattedCategoryData = bidAuditCategoryData?.in_categories?.reduce((acc, curr) => {
      const keyValue = curr[value];
      const isDuplicate = acc.some(x => x.code === keyValue);
      if (!isDuplicate) {
        acc.push({
          code: curr[value],
          text: curr[value] ? `(${curr[value]}) ${curr[desc]}` : 'None Listed',
        });
      }
      return acc;
    }, []);
    return uniqFormattedCategoryData;
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


  const onInCategoriesSave = () => {
    swal.close();
  };

  const mockCategoryData = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];
  const onNewInCateogries = () => {
    swal({
      title: 'Add New In Category',
      button: false,
      closeOnEsc: true,
      content: (
        <div className="position-form bid-audit-form-modal">
          <div className="filter-div-modal">
            <div className="label">Position Skill Code - Description:</div>
            <select>
              {mockCategoryData.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {mockCategoryData.map(grade => (
                <option value={grade.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={onInCategoriesSave}>Save</button>
            <button onClick={() => swal.close()}>Cancel</button>
          </div>
        </div>
      ),
    });
  };


  const noResults = bidAuditCategoryData$?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (bidAuditCategoryFetchLoading) {
      overlay = <Spinner type="bureau-results" class="homepage-position-results" size="big" />;
    } else if (bidAuditCategoryFetchError) {
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
        <ProfileSectionTitle title="Bid Audit - In Skill Category" icon="keyboard-o" className="xl-icon" />

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
            <div className="ba-label">Position Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Skill"
              options={getUniqData('position_skill_code', 'position_skill_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionSkills}
              value={selectedPositionSkills}
              disabled={disableSearch}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Employee Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Employee Skill"
              options={getUniqData('employee_skill_code', 'employee_skill_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedEmployeeSkills}
              value={selectedEmployeeSkills}
              disabled={disableSearch}
            />
          </div>
        </div>
      </div>

      {getOverlay() ||
        <div className="usa-width-one-whole position-search--results ">

          <span className="ba-subheading">
            <div className="ba-audit-info">{`Cycle Name: ${bidAuditCategoryData?.audit_info?.cycle_name}`}</div>
            <div className="ba-audit-info">{`Positions Posted by: ${bidAuditCategoryData?.audit_info?.posted_by_date}`}</div>
            <div className="ba-audit-info">{`Audit Number: ${bidAuditCategoryData?.audit_info?.audit_number}`}</div>
            <div className="ba-audit-info">{`Audit Description: ${bidAuditCategoryData?.audit_info?.audit_desc}`}</div>
            <div className="icon-text-link ml-10">
              <a role="button" tabIndex={0} onClick={() => onNewInCateogries()} >
                <FA name="plus" />Add New In Skill-Category</a>
            </div>
          </span>
          <span className="ba-subheading">
            <div className="ba-audit-sub-info">Employee Skills considered In-Skill-Category for Positions, this Cycle</div>
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
              bidAuditCategoryData$?.map(positionData => (
                <BidAuditCategoryCard
                  data={positionData}
                  key={positionData.id}
                  isOpen={cardsInEditMode?.includes(positionData?.id)}
                  onEditModeSearch={(editMode, id) =>
                    onBidAuditCategoryEdit(editMode, id)}
                />
              ))
            }
          </div>
        </div>
      }
    </div>
  );
};

BidAuditCategory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      cycleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      auditId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

BidAuditCategory.defaultProps = {
  match: {},
};

export default withRouter(BidAuditCategory);
