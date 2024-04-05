import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import { positionClassificationNumberCheck, positionClassifications, positionClassificationsEdit } from '../../../actions/positionClassifications';

const PositionClassification = (props) => {
  const { positionNumber, bureau, posSeqNum, editMode, setEditMode, disableEdit } = props;

  const dispatch = useDispatch();

  const results = useSelector(state => state.positionClassifications);
  const currentCard = useSelector(state => state.positionClassificationsNumber);
  const isLoading = useSelector(state => state.positionClassificationsIsLoading);
  const pc = results?.positionClassifications ?? [];
  const cs = results?.classificationSelections ?? [];

  useEffect(() => {
    if (positionNumber) {
      dispatch(positionClassificationNumberCheck(positionNumber));
      dispatch(positionClassifications(positionNumber));
    }
  }, [positionNumber]);

  const [classifications, setClassifications] = useState([]);
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    setClassifications(pc);
    setSelections(cs);
  }, [results]);

  const handleSelection = (code, event) => {
    const newSelections = selections.map(s => {
      if (s.code === code) {
        return {
          ...s,
          value: event.target.checked ? '1' : '0',
        };
      }
      return s;
    });
    setSelections(newSelections);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelections(cs);
  };

  const handleSubmit = () => {
    let position = '';
    let codes = '';
    let values = '';
    let updatedDates = '';
    let updaterIds = '';

    selections.forEach(s => {
      const separator = position === '' ? '' : ',';
      position = position.concat(separator, posSeqNum);
      codes = codes.concat(separator, s.code);
      values = values.concat(separator, s.value);
      updatedDates = updatedDates.concat(separator, s.date ?? '');
      updaterIds = updaterIds.concat(separator, s.user_id !== 0 ? s.user_id : '');
    });

    if (position !== '') {
      dispatch(positionClassificationsEdit(positionNumber, {
        id: position,
        values,
        codes,
        updater_ids: updaterIds,
        updated_dates: updatedDates,
      }));
    }
  };

  return (isLoading && positionNumber === currentCard ?
    <div className="loading-animation--5">
      <div className="loading-message pbl-20">
        Loading additional data
      </div>
    </div> :
    <div className="position-classifications position-content">
      <Row fluid className="position-content--subheader">
        <div className="line-separated-fields">
          <div>
            <span className="span-label">Position:</span>
            <span className="span-text">{bureau} {positionNumber}</span>
          </div>
        </div>
        {!editMode &&
          <button
            className={`toggle-edit-mode ${disableEdit ? 'toggle-edit-mode-disabled' : ''}`}
            onClick={disableEdit ? () => { } : () => setEditMode(!editMode)}
          >
            <FA name="pencil" />
            <div>Edit</div>
          </button>
        }
      </Row>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {classifications?.map((o) => (
                <th key={o.code}>{o.short_description}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {classifications?.map((o) => (
                <td key={o.code}>
                  <input
                    id={`classification-${o.code}-${posSeqNum}`}
                    type="checkbox"
                    name={o.code}
                    checked={selections.find(s => o.code === s.code && s.value === '1') ?? false}
                    onChange={(event) => handleSelection(o.code, event)}
                    disabled={!editMode}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {editMode &&
        <div className="position-form--actions">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      }
    </div>
  );
};

PositionClassification.propTypes = {
  positionNumber: PropTypes.string.isRequired,
  bureau: PropTypes.string.isRequired,
  posSeqNum: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  disableEdit: PropTypes.bool.isRequired,
};

PositionClassification.defaultProps = {
  positionNumber: undefined,
  bureau: undefined,
  posSeqNum: undefined,
  editMode: false,
  setEditMode: () => { },
  disableEdit: false,
};

export default PositionClassification;
