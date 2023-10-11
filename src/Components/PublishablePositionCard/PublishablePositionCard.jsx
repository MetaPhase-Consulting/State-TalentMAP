import { useEffect, useState } from 'react';
import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import Picky from 'react-picky';
import PropTypes from 'prop-types';
import { BID_CYCLES, EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import { formatDateFromStr, renderSelectionList } from 'utilities';
import { DEFAULT_TEXT } from 'Constants/SystemMessages';
import { Row } from 'Components/Layout';
import CheckBox from 'Components/CheckBox';
import TabbedCard from 'Components/TabbedCard';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { checkFlag } from '../../flags';
import PositionClassification from './PositionClassification/PositionClassification';


const PP_INTEGRATION_FLAG = checkFlag('flags.publishable_positions_integration');

const hardcodedFilters = {
  statusFilters: [{ code: 1, description: '' }, { code: 2, description: 'Publishable' }, { code: 3, description: 'Vet' }],
  cycleFilters: [{ code: 1, description: '2010 Winter' }, { code: 2, description: '2007 Fall' }, { code: 3, description: '2009 Spring' }],
  todFilters: [{ code: 1, description: '' }, { code: 2, description: 'OTHER' }, { code: 3, description: 'INDEFINITE' }],
  functionalBureauFilters: [{ code: 1, description: '' }, { code: 2, description: 'bureau' }, { code: 3, description: 'bureau' }],
};


const PublishablePositionCard = ({ data, onEditModeSearch, onSubmit, disableEdit }) => {
  // =============== Overview: View Mode ===============

  const sections = {
    /* eslint-disable quote-props */
    subheading: [
      { 'Position Number': data?.positionNumber || DEFAULT_TEXT },
      { 'Skill': data?.skill || DEFAULT_TEXT },
      { 'Position Title': data?.positionTitle || DEFAULT_TEXT },
    ],
    bodyPrimary: [
      { 'Bureau': data?.bureau || DEFAULT_TEXT },
      { 'Organization': data?.org || DEFAULT_TEXT },
      { 'Grade': data?.grade || DEFAULT_TEXT },
      { 'Status': data?.status || DEFAULT_TEXT },
      { 'Language': data?.language || DEFAULT_TEXT },
      { 'Pay Plan': data?.payPlan || DEFAULT_TEXT },
    ],
    bodySecondary: PP_INTEGRATION_FLAG ?
      [
        { 'Bid Cycle': data?.status || DEFAULT_TEXT },
        { 'TED': data?.status || DEFAULT_TEXT },
        { 'Incumbent': data?.status || DEFAULT_TEXT },
        { 'Tour of Duty': data?.status || DEFAULT_TEXT },
        { 'Assignee': data?.status || DEFAULT_TEXT },
        { 'Post Differential | Danger Pay': data?.status || DEFAULT_TEXT },
      ]
      : [],
    textarea: data?.positionDetails || 'No description.',
    metadata: [
      { 'Last Updated': formatDateFromStr(data?.lastUpdated) },
    ],
    /* eslint-enable quote-props */
  };


  // =============== Overview: Edit Mode ===============

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 200,
    includeSelectAll: true,
    renderList: renderSelectionList,
    className: 'width-280',
  };
  const [status, setStatus] = useState('');
  const [exclude, setExclude] = useState(true);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [selectedFuncBureau, setSelectedFuncBureau] = useState('');
  const [overrideTOD, setOverrideTOD] = useState('');


  const [textArea, setTextArea] = useState(data?.positionDetails || 'No description.');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    onEditModeSearch(editMode);
  }, [editMode]);

  const onSubmitForm = () => {
    const editData = {
      posSeqNum: data?.posSeqNum,
      positionDetails: textArea,
      lastUpdatedUserID: data?.lastUpdatedUserID,
      lastUpdated: data?.lastUpdated,
    };
    onSubmit(editData);
  };

  const onCancelForm = () => {
    setStatus('');
    setExclude(true);
    setSelectedCycles([]);
    setTextArea(data?.positionDetails || 'No description.');
    setSelectedFuncBureau('');
    setOverrideTOD('');
  };

  const form = {
    /* eslint-disable quote-props */
    staticBody: [
      { 'Bureau': data?.bureau || DEFAULT_TEXT },
      { 'Organization': data?.org || DEFAULT_TEXT },
      { 'Grade': data?.grade || DEFAULT_TEXT },
      { 'Status': data?.status || DEFAULT_TEXT },
      { 'Language': data?.language || DEFAULT_TEXT },
      { 'Pay Plan': data?.payPlan || DEFAULT_TEXT },
    ],
    inputBody: (
      <div className="position-form">
        {PP_INTEGRATION_FLAG &&
          <div className="spaced-row">
            <div className="dropdown-container">
              <div className="position-form--input">
                <label htmlFor="publishable-position-statuses">Status</label>
                <select
                  id="publishable-position-statuses"
                  defaultValue={status}
                  onChange={(e) => setStatus(e?.target.value)}
                >
                  {hardcodedFilters.statusFilters.map(s => (
                    <option value={s.code}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="position-form--input">
                <label htmlFor="publishable-pos-tod-override">Override Tour of Duty</label>
                <select
                  id="publishable-pos-tod-override"
                  defaultValue={overrideTOD}
                  onChange={(e) => setOverrideTOD(e?.target.value)}
                >
                  {hardcodedFilters.todFilters.map(t => (
                    <option value={t.code}>
                      {t.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CheckBox
              id="exclude-checkbox"
              label="Exclude Position from Bid Audit"
              value={exclude}
              onCheckBoxClick={e => setExclude(e)}
            />
          </div>
        }
        <div>
          <Row fluid className="position-form--description">
            <span className="definition-title">Position Details</span>
            <Linkify properties={{ target: '_blank' }}>
              <TextareaAutosize
                maxRows={6}
                minRows={6}
                maxlength="2000"
                name="position-description"
                placeholder="No Description"
                defaultValue={textArea}
                onChange={(e) => setTextArea(e.target.value)}
                draggable={false}
              />
            </Linkify>
            <div className="word-count">
              {textArea.length} / 2000
            </div>
          </Row>
        </div>
        {PP_INTEGRATION_FLAG &&
          <>
            <div className="content-divider" />
            <div className="position-form--heading">
              <span className="title">Future Cycle</span>
              <span className="subtitle">Please identify a cycle to add this position to.</span>
            </div>
            <div className="position-form--picky">
              <div className="publishable-position-cycles-label">Chosen Bid Cycle(s):</div>
              <div className="publishable-position-cycles">{selectedCycles.map(a => a.description).join(', ')}</div>
            </div>
            <Picky
              {...pickyProps}
              placeholder="Choose Bid Cycle(s)"
              value={selectedCycles}
              options={hardcodedFilters.cycleFilters}
              onChange={setSelectedCycles}
              valueKey="code"
              labelKey="description"
            />
            <div className="pt-20">
              <div className="content-divider" />
              <div className="position-form--heading">
                <span className="title">Add a Functional Bureau</span>
                <span className="subtitle">Add a Functional Bureau to this Position</span>
              </div>
              <div className="position-form--input">
                <label htmlFor="publishable-pos-func-bureaus">Bureau</label>
                <select
                  id="publishable-pos-func-bureaus"
                  defaultValue={selectedFuncBureau}
                  onChange={(e) => setSelectedFuncBureau(e?.target.value)}
                >
                  {hardcodedFilters.functionalBureauFilters.map(b => (
                    <option value={b.code}>
                      {b.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        }
      </div>
    ),
    handleSubmit: onSubmitForm,
    handleCancel: onCancelForm,
    handleEdit: {
      editMode,
      setEditMode,
      disableEdit,
    },
    /* eslint-enable quote-props */
  };

  return (
    <TabbedCard
      tabs={[
        {
          text: 'Position Overview',
          value: 'OVERVIEW',
          content: <PositionExpandableContent
            sections={sections}
            form={form}
          />,
        },
        PP_INTEGRATION_FLAG ?
          {
            text: 'Position Classification',
            value: 'CLASSIFICATION',
            content: <PositionClassification
              positionNumber={data?.positionNumber}
              bureau={data?.bureau || DEFAULT_TEXT}
            />,
            disabled: editMode,
          } : {},
      ]}
    />
  );
};

PublishablePositionCard.propTypes = {
  data: POSITION_DETAILS.isRequired,
  cycles: BID_CYCLES.isRequired,
  onEditModeSearch: PropTypes.func,
  onSubmit: PropTypes.func,
  disableEdit: PropTypes.bool,
  filters: PropTypes.shape({
    filters: {},
  }).isRequired,
};

PublishablePositionCard.defaultProps = {
  onEditModeSearch: EMPTY_FUNCTION,
  onSubmit: EMPTY_FUNCTION,
  disableEdit: false,
};

export default PublishablePositionCard;
