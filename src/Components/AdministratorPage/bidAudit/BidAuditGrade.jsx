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

const BidAuditGrade = () => {
  const dummyPositionDetails = useSelector(state => state.bidAudit);
  const [editMode, setEditMode] = useState(false);
  const atGrades = dummyPositionDetails[0]?.atGrades || [];
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

  const onNewAtGrades = (e) => {
    e.preventDefault();
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

  const atGradesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Grade:</div>
            <select>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade?.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Position Skill Code - Description:</div>
            <select>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Employee Grade:</div>
            <select>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Tenure Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
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

  const atGradesSections = {
    /* eslint-disable no-dupe-keys */
    /* eslint-disable quote-props */
    subheading: [
      { 'Cycle Name': result.cycle_name || NO_POSITION_NUMBER },
      { 'Audit Number': result.id || NO_BUREAU },
      { 'Description': result.description || NO_SKILL },
      { 'Posted': result.bid_audit_date || NO_POSITION_TITLE },
      { '': <Link to="#" onClick={onNewAtGrades}>Add New At Grade</Link> },
    ],
    bodyPrimary: [
      { '': <BidAuditSections rows={atGrades} onEditChange={onEditChange} /> },
    ],
    /* eslint-enable quote-props */
    /* eslint-enable no-dupe-keys */
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
                  text: 'At Grades',
                  value: 'At Grades',
                  content: (
                    <div className="position-content--container">
                      <PositionExpandableContent
                        sections={atGradesSections}
                        form={atGradesForm}
                        saveText="Save At Grade"
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

export default BidAuditGrade;
