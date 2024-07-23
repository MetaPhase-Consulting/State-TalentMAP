import { useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { useDataLoader } from 'hooks';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { Row } from 'Components/Layout';
import {
  UPDATE_POSITION_CLASSIFICATION_ERROR,
  UPDATE_POSITION_CLASSIFICATION_ERROR_TITLE,
  UPDATE_POSITION_CLASSIFICATION_SUCCESS,
  UPDATE_POSITION_CLASSIFICATION_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { toastError, toastSuccess } from 'actions/toast';
import api from '../../../api';
import { userHasPermissions } from '../../../utilities';

const PositionClassification = (props) => {
  const { positionNumber, bureau, posSeqNum, editMode, setEditMode, disableEdit } = props;

  const dispatch = useDispatch();

  const userProfile = useSelector(state => state.userProfile);
  const isSuperUser = userHasPermissions(['superuser'], userProfile.permission_groups);

  const [refetch, setRefetch] = useState(true);
  const [classifications, setClassifications] = useState([]);
  const [selections, setSelections] = useState([]);

  const { data: results, loading: isLoading } = useDataLoader(
    api().get,
    `/fsbid/position_classifications/${positionNumber}/`,
    true,
    undefined,
    refetch,
  );


  useEffect(() => {
    setClassifications(results?.data?.positionClassifications || []);
    setSelections(results?.data?.classificationSelections || []);
  }, [results]);

  const handleSelection = (code, event) => {
    const newSelections = selections?.map(s => {
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
    setSelections(results?.data?.classificationSelections || []);
  };

  const handleSubmit = () => {
    let position = '';
    let codes = '';
    let values = '';
    let updatedDates = '';
    let updaterIds = '';

    /* eslint-disable no-unused-expressions */
    selections?.forEach(s => {
      const separator = position === '' ? '' : ',';
      position = position.concat(separator, posSeqNum);
      codes = codes.concat(separator, s.code);
      values = values.concat(separator, s.value);
      updatedDates = updatedDates.concat(separator, s.date || '');
      updaterIds = updaterIds.concat(separator, s.user_id !== 0 ? s.user_id : '');
    });

    const editData = {
      id: position,
      values,
      codes,
      updater_ids: updaterIds,
      updated_dates: updatedDates,
    };

    if (position !== '') {
      api().put('/fsbid/position_classifications/edit/', editData)
        .then(() => {
          const toastTitle = UPDATE_POSITION_CLASSIFICATION_SUCCESS_TITLE;
          const toastMessage = UPDATE_POSITION_CLASSIFICATION_SUCCESS;
          batch(() => {
            dispatch(toastSuccess(toastMessage, toastTitle));
            setRefetch(!refetch);
            setEditMode(false);
          });
        })
        .catch((err) => {
          if (err?.message === 'cancel') {
            const toastTitle = UPDATE_POSITION_CLASSIFICATION_ERROR_TITLE;
            const toastMessage = UPDATE_POSITION_CLASSIFICATION_ERROR;
            dispatch(toastError(toastMessage, toastTitle));
          }
        });
    }
  };

  return (isLoading ?
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
        {(!editMode && isSuperUser) &&
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
                    type="checkbox"
                    name={o.code}
                    checked={selections?.find(s => o.code === s.code && s.value === '1') || false}
                    onChange={(event) => handleSelection(o.code, event)}
                    disabled={!editMode}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {(editMode && isSuperUser) &&
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
  posSeqNum: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  disableEdit: PropTypes.bool.isRequired,
};

PositionClassification.defaultProps = {
  positionNumber: undefined,
  bureau: undefined,
  posSeqNum: undefined,
  editMode: false,
  setEditMode: EMPTY_FUNCTION,
  disableEdit: false,
};

export default PositionClassification;
