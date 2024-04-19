import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import BackButton from 'Components/BackButton';
import TabbedCard from 'Components/TabbedCard';
import swal from '@sweetalert/with-react';
import { Link } from 'react-router-dom';
import {
  NO_BUREAU, NO_POSITION_NUMBER, NO_POSITION_TITLE, NO_SKILL,
} from 'Constants/SystemMessages';
import BidAuditSections from './BidAuditSections/BidAuditSections';

const BidAuditCategory = () => {
  const dummyPositionDetails = useSelector(state => state.bidAudit);
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
      { 'Cycle Name': result.cycle_name || NO_POSITION_NUMBER },
      { 'Audit Number': result.id || NO_BUREAU },
      { 'Description': result.description || NO_SKILL },
      { 'Posted': result.bid_audit_date || NO_POSITION_TITLE },
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

export default BidAuditCategory;
