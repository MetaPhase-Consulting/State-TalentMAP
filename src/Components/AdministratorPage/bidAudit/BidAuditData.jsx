import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Picky from 'react-picky';
import FA from 'react-fontawesome';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import BackButton from 'Components/BackButton';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import { bidAuditGetAuditFetchData } from 'actions/bidAudit';
import { formatDate, renderSelectionList } from 'utilities';
import { history } from '../../../store';

const BidAuditData = (props) => {
  const dispatch = useDispatch();

  const routeCycleID = props?.match.params.cycleId;
  const routeAuditID = props?.match.params.auditId;

  const bidAuditData = useSelector(state => state.bidAuditGetAuditFetchDataSuccess);
  const bidAuditDataFetchLoading = useSelector(state => state.bidAuditGetAuditFetchDataLoading);
  const bidAuditDataFetchError = useSelector(state => state.bidAuditGetAuditFetchDataErrored);

  // Initial Render
  useEffect(() => {
    dispatch(bidAuditGetAuditFetchData(routeCycleID, routeAuditID));
  }, []);

  const tableHeaderNames = [
    'Location (Org) / Bidder',
    'Org Code', 'Position',
    'Skill / Title',
    'Grade', 'Language',
    'Incumbent',
    'Handshake (Other)',
    'TED',
    'Bid Count T(G/C)B',
    'HTF',
  ];

  const onShuffleAudit = (auditNum) => {
    if (auditNum) {
      history.push(`/profile/administrator/bidaudit/data/${routeCycleID}/${auditNum}/`);
    }
  };


  // ======================================================================================= Filters;
  // Use this state variable to render the data filtered by the Picky Dropdown
  const [auditPositionFilterableData$, setAuditPositionFilterableData$] = useState(bidAuditData?.audit_data || []);

  const [selectedPositionGrades, setSelectedPositionGrades] = useState([]);
  const [selectedPositionSkills, setSelectedPositionSkills] = useState([]);
  const [selectedPositionOrgs, setSelectedPositionOrgs] = useState([]);
  const [selectedPositionHTF, setSelectedPositionHTF] = useState([]);
  const [selectedPositionNumber, setSelectedPositionNumber] = useState([]);

  const [clearFilters, setClearFilters] = useState(false);

  const noFiltersSelected = [
    selectedPositionGrades,
    selectedPositionSkills,
    selectedPositionOrgs,
    selectedPositionHTF,
    selectedPositionNumber].flat().length === 0;

  const resetFilters = () => {
    setSelectedPositionGrades([]);
    setSelectedPositionSkills([]);
    setSelectedPositionOrgs([]);
    setSelectedPositionHTF([]);
    setSelectedPositionNumber([]);
    setClearFilters(false);
  };

  const filterData = () => {
    if (noFiltersSelected) return bidAuditData?.audit_data;
    let filteredData = bidAuditData?.audit_data;

    if (selectedPositionGrades.length > 0) {
      filteredData = filteredData.filter(data =>
        selectedPositionGrades.some(grade => grade.code === data?.position_info?.position_grade),
      );
    }
    if (selectedPositionSkills.length > 0) {
      filteredData = filteredData.filter(data =>
        selectedPositionSkills.some(skill => skill.code === data?.position_info?.position_skill),
      );
    }
    if (selectedPositionOrgs.length > 0) {
      filteredData = filteredData.filter(data =>
        selectedPositionOrgs.some(org => org.code === data?.position_info?.org_code),
      );
    }
    if (selectedPositionHTF.length > 0) {
      filteredData = filteredData.filter(data =>
        selectedPositionHTF.some(pos => pos.code === data?.position_info?.hard_to_fill_ind),
      );
    }
    if (selectedPositionNumber.length > 0) {
      filteredData = filteredData.filter(data =>
        selectedPositionNumber.some(pos => pos.code === data?.position_info?.position_number),
      );
    }
    return filteredData;
  };

  // When a filter is selected, update the filtered data

  useEffect(() => {
    setAuditPositionFilterableData$(filterData);
    if (noFiltersSelected) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  }, [
    selectedPositionGrades,
    selectedPositionSkills,
    selectedPositionOrgs,
    selectedPositionHTF,
    selectedPositionNumber,
    bidAuditData,
  ]);

  // Pass in a value, and return an array of unique objects for the Picky Dropdown
  const getUniqData = (value, desc) => {
    const uniqFormattedPositionData = bidAuditData?.audit_data?.reduce((acc, curr) => {
      const keyValue = curr.position_info[value];
      const isDuplicate = acc.some(x => x.code === keyValue);
      if (!isDuplicate) {
        if (desc) {
          acc.push({
            code: curr.position_info[value],
            text: curr.position_info[value] ? `(${curr.position_info[value]}) ${curr.position_info[desc]}` : 'None Listed',
          });
        } else acc.push({ code: curr.position_info[value], text: curr.position_info[value] || 'None Listed' });
      }
      return acc;
    }, []);
    return uniqFormattedPositionData;
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


  const noResults = auditPositionFilterableData$?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (bidAuditDataFetchLoading) {
      overlay = <Spinner type="bureau-results" class="homepage-position-results" size="big" />;
    } else if (bidAuditDataFetchError) {
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
        <ProfileSectionTitle title="Bid Audit - Bid Book" icon="keyboard-o" className="xl-icon" />

        <div className="filterby-container" >
          <div className="filterby-label">Filter by:</div>
          <span className="filterby-clear">
            {clearFilters &&
                  <button className="unstyled-button" onClick={resetFilters}>
                    <FA name="times" />
                  Clear Filters
                  </button>
            }
          </span>
        </div>

        <div className="usa-width-one-whole position-search--filters--cm">
          <div className="filter-div">
            <div className="ba-label">Position Number:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Number"
              options={getUniqData('position_number')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionNumber}
              value={selectedPositionNumber}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Grade:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Grade"
              options={getUniqData('position_grade')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionGrades}
              value={selectedPositionGrades}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Skill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Skill"
              options={getUniqData('position_skill', 'position_title')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionSkills}
              value={selectedPositionSkills}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Location(Org):</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position Org"
              options={getUniqData('org_code', 'org_short_desc')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionOrgs}
              value={selectedPositionOrgs}
            />
          </div>
          <div className="filter-div">
            <div className="ba-label">Position Hard to Fill:</div>
            <Picky
              {...pickyProps}
              placeholder="Select Position HTF"
              options={getUniqData('hard_to_fill_ind')}
              valueKey="code"
              labelKey="text"
              onChange={setSelectedPositionHTF}
              value={selectedPositionHTF}
            />
          </div>
        </div>
      </div>

      <div className="bid-data-heading">
        <span>
          <a
            role="button"
            tabIndex={0}
            onClick={() => onShuffleAudit(bidAuditData?.ref_data?.prev_audit_number)}
            className={bidAuditData?.ref_data?.prev_audit_number ? 'bid-data-shuffle' : 'bid-data-shuffle-disabled'}
          >
            <FA name="chevron-left" />
            {' Previous Audit'}
          </a>
        </span>
        <span>
          Cycle: {bidAuditData?.ref_data?.cycle_name || '--'}
        </span>
        <span>
          Audit Num: {bidAuditData?.ref_data?.audit_number || '--'}
        </span>
        <span>
          Description: {bidAuditData?.ref_data?.audit_desc || '--'}
        </span>
        <span>
          Audit Date: {bidAuditData?.ref_data?.audit_date ? formatDate(bidAuditData?.ref_data?.audit_date) : '--'}
        </span>
        <span>
          <a
            role="button"
            tabIndex={0}
            onClick={() => onShuffleAudit(bidAuditData?.ref_data?.next_audit_number)}
            className={bidAuditData?.ref_data?.next_audit_number ? 'bid-data-shuffle' : 'bid-data-shuffle-disabled'}
          >
            {'Next Audit '}
            <FA name="chevron-right" />
          </a>
        </span>
      </div>

      <div className="usa-width-one-whole bid-data--results">
        {getOverlay() ||
        <div className="bid-data-scroll-container">
          <table className="bid-data-custom-table">
            <thead>
              <tr>
                {
                  tableHeaderNames.map((item) => (
                    <th key={item}>{item}</th>
                  ))
                }
              </tr>
            </thead>

            <tbody>
              {
                auditPositionFilterableData$?.map(data => {
                  const { position_info: pos, bidders } = data;
                  return (
                    <>
                      <tr key={pos.position_number} className="position-row">
                        <td>{pos.org_short_desc}</td>
                        <td>{pos.org_code}</td>
                        <td>{pos.position_number}</td>
                        <td>{`(${pos.position_skill}) ${pos.position_title}`}</td>
                        <td>{pos.position_grade}</td>
                        <td>{pos.position_lang}</td>
                        <td>{pos.position_incumbent_name}</td>
                        <td>--</td>
                        <td>{pos.position_incumbent_ted}</td>
                        <td>{`${pos.count_total_bidders}(${pos.count_at_grade}/${pos.count_in_category})${pos.count_at_grade_in_category}`}</td>
                        <td>{pos.hard_to_fill_ind}</td>
                      </tr>
                      {
                        bidders?.map(bid => (
                          <tr key={bid.bidder_name}>
                            <td>{bid.bidder_name}</td>
                            <td>{bid.bidder_org_desc}</td>
                            <td>{bid.bidder_position_number}</td>
                            <td>{`(${bid.bidder_skill}) ${bid.bidder_position_title}`}</td>
                            <td>{bid.bidder_grade}</td>
                            <td>{bid.bidder_lang}</td>
                            <td>--</td>
                            <td>{bid.bidder_cats || '--'}</td>
                            <td>{bid.bidder_ted}</td>
                            <td>{`(${bid.bidder_is_at_grade}/${bid.bidder_is_in_category})`}</td>
                            <td>--</td>
                          </tr>
                        ))
                      }
                    </>
                  );
                })
              }
            </tbody>

          </table>
        </div>
        }
      </div>
    </div>
  );
};


BidAuditData.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      cycleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      auditId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

BidAuditData.defaultProps = {
  match: {},
};

export default withRouter(BidAuditData);
