import { useState } from 'react';
import { withRouter } from 'react-router';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import BackButton from 'Components/BackButton';
import TabbedCard from 'Components/TabbedCard';
import swal from '@sweetalert/with-react';
import { Link } from 'react-router-dom';
import BidAuditSections from './BidAuditSections/BidAuditSections';

const dummyData = [
  {
    atGrades: [
      {
        header: 'Position',
        subHeader1: 'Grade',
        subHeader2: 'Skill Code',
        subHeader3: 'Description',
        row1data: '04',
        row2data: '2333',
        row3data: 'INFORMATION MANAGEMENT',
      },
      {
        header: 'Employee',
        subHeader1: 'Grade',
        subHeader2: 'Skill Code',
        subHeader3: 'Description',
        row1data: '04',
        row2data: '2333',
        row3data: 'INFORMATION MANAGEMENT',
      },
      {
        header: 'Tenure',
        subHeader1: 'Code',
        subHeader2: 'Description',
        row1data: '04',
        row2data: 'WW FS CAR-FA',
      },
    ],
  },
  {
    inCategories: [
      {
        header: 'Position',
        subHeader1: 'Grade',
        subHeader2: 'Skill Code',
        subHeader3: 'Description',
        row1data: '04',
        row2data: '2333',
        row3data: 'INFORMATION MANAGEMENT',
      },
      {
        header: 'Employee',
        subHeader1: 'Grade',
        subHeader2: 'Skill Code',
        subHeader3: 'Description',
        row1data: '04',
        row2data: '2333',
        row3data: 'INFORMATION MANAGEMENT',
      },
    ],
  },
  {
    bidAudit: [
      {
        cycle_name: 'Fall Cycle 2023',
        descriptionTitle: 'INFORMATION MANAGEMENT',
        code: 2003,
        id: 96,
        cycle_status: 'Proposed',
        cycle_category: 'Active',
        bid_audit_date_posted: '2023-09-01T21:12:12.854000Z',
        bid_audit_date: '2025-03-01T21:12:12.854000Z',
        cycle_excl_position: 'Y',
        cycle_post_view: 'Y',
        description: 'Test Fall Cycle 2023',
      },
      {
        cycle_name: 'Summer Cycle 2023',
        descriptionTitle: 'INFORMATION MANAGEMENT',
        id: 97,
        cycle_status: 'Complete',
        cycle_category: 'Active',
        bid_audit_date_posted: '2025-06-01T21:12:12.854000Z',
        bid_audit_date: '2025-03-01T21:12:12.854000Z',
        cycle_excl_position: 'Y',
        cycle_post_view: 'Y',
        description: 'Test Summer Cycle 2023',
      },
      {
        cycle_name: 'Spring Cycle 2023',
        descriptionTitle: 'INFORMATION MANAGEMENT',
        id: 98,
        cycle_status: 'Closed',
        cycle_category: 'Closed',
        bid_audit_date_posted: '2025-03-01T21:12:12.854000Z',
        bid_audit_date: '2025-03-01T21:12:12.854000Z',
        cycle_excl_position: 'Y',
        cycle_post_view: 'Y',
        description: 'Test Spring Cycle 2023',
      },
      {
        cycle_name: 'Winter Cycle 2023',
        id: 99,
        cycle_status: 'Merged',
        cycle_category: 'Active',
        bid_audit_date_posted: '2022-12-01T21:12:12.854000Z',
        bid_audit_date: '2025-03-01T21:12:12.854000Z',
        cycle_excl_position: 'Y',
        cycle_post_view: 'Y',
        description: 'Test Winter Cycle 2023',
      },
    ],
  },
];

const BidAuditCategory = () => {
  // For Integration
  // const dispatch = useDispatch();
  // const routeCycleID = props?.match.params.cycleId;
  // const routeAuditID = props?.match.params.auditId;
  // const bidAuditData = useSelector(state => state.bidAuditFetchData);
  // const bidAuditCategoryData = useSelector(state => state.bidAuditSecondFetchData);
  // eslint-disable-next-line max-len
  // const bidAuditCategoryFetchLoading = useSelector(state => state.bidAuditSecondFetchDataLoading);
  // const bidAuditCategoryFetchError = useSelector(state => state.bidAuditSecondFetchDataErrored);
  // useEffect(() => {
  //   const filteredData = bidAuditData?.filter(audit => (
  //     audit.cycle_id === routeCycleID && audit.audit_id === routeAuditID) && audit);
  //   setBidAuditData$(filteredData);
  // }, [bidAuditData]);
  // useEffect(() => {
  //   dispatch(bidAuditSecondFetchData(routeCycleID, routeAuditID, 'category'));
  // }, []);
  // console.log(bidAuditCategoryData);
  // console.log(bidAuditCategoryFetchLoading);
  // console.log(bidAuditCategoryFetchError);
  // const [bidAuditData$, setBidAuditData$] = useState(bidAuditData);

  const dummyPositionDetails = dummyData;
  const [editMode, setEditMode] = useState(false);
  const inCategories = dummyPositionDetails[1]?.inCategories || [];
  const result = dummyPositionDetails[2].bidAudit[0];

  const onEditChange = () => {
    setEditMode(e => !e);
  };
  const onSubmit = () => {
    console.log('submit');
  };
  const onCancelForm = () => {
    console.log('cancel');
    swal.close();
  };
  const onInCategoriesSave = () => {
    swal.close();
  };

  const tenureCode = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];

  const onNewInCateogries = (e) => {
    e.preventDefault();
    swal({
      title: 'Add New In Category',
      button: false,
      closeOnEsc: true,
      content: (
        <div className="position-form bid-audit-form-modal">
          <div className="filter-div-modal">
            <div className="label">Position Skill Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div-modal">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
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

  const inCategoriesSections = {
    /* eslint-disable no-dupe-keys */
    /* eslint-disable quote-props */
    subheading: [
      { 'Cycle Name': result.cycle_name || '--' },
      { 'Audit Number': result.id || '--' },
      { 'Description': result.description || '--' },
      { 'Posted': result.bid_audit_date || '--' },
      { '': <Link to="#" onClick={onNewInCateogries}>Add New In Category</Link> },
    ],
    bodyPrimary: [
      { '': <BidAuditSections rows={inCategories} onEditChange={onEditChange} /> },
    ],
    /* eslint-enable quote-props */
    /* eslint-enable no-dupe-keys */
  };

  const inCategoriesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Skill Code - Description:</div>
            {/* this disabled dropdowns might not need to be a dropdown will fix in next PR */}
            <select disabled>
              {tenureCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
                <option value={grade.code}>{grade.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ),
    cancelText: 'Are you sure you want to discard all changes made to this position?',
    handleSubmit: () => onSubmit(),
    handleCancel: () => onCancelForm(),
    handleEdit: {
      editMode,
      setEditMode,
    },
    /* eslint-enable quote-props */
  };

  return (
    <div className="position-search bid-audit-page">
      <div className="usa-grid-full position-search--header">
        <BackButton />
        <ProfileSectionTitle title="Bid Audit" icon="keyboard-o" className="xl-icon" />
      </div>

      <div className="usa-width-one-whole position-search--results">
        <div className="usa-grid-full position-list">

          <TabbedCard
            tabs={
              [
                {
                  text: 'In Categories',
                  value: 'In Categories',
                  content: (
                    <div className="position-content--container">
                      <PositionExpandableContent
                        sections={inCategoriesSections}
                        form={inCategoriesForm}
                        saveText="Save In Category"
                        tempHideEdit
                      />
                    </div>
                  ),
                },
              ]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(BidAuditCategory);
