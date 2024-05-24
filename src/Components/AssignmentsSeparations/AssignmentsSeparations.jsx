import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { checkFlag } from 'flags';
import { useDataLoader } from 'hooks';
import { altAssignmentsSeparations } from 'actions/assignment';
import { NO_VALUE } from 'Constants/SystemMessages';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import TabbedCard from 'Components/TabbedCard';
import Assignment from './Assignment';
import Separation from './Separation';
import ReactModal from '../ReactModal';
import InteractiveElement from '../InteractiveElement';
import api from '../../api';
import { formatDate } from '../../utilities';

const useNotification = () => checkFlag('flags.assignment_notification');
const useMemo = () => checkFlag('flags.assignment_memo');
// eslint-disable-next-line no-unused-vars
const useBreadcrumbs = checkFlag('flags.breadcrumbs');

export const panelMeetingLink = (pmSeqNum, date, editMode) => {
  if ((!pmSeqNum || !date) && editMode) {
    return (
      <div className="create-new-button mt-10">
        <a role="button" tabIndex={0} className="disabled-action">
          Add
        </a>
      </div>
    );
  } else if (pmSeqNum) {
    return (
      <InteractiveElement>
        <Link className="create-ai-link" to={`/profile/administrator/panel/${pmSeqNum}`}>
          {formatDate(date) || 'Link'}
        </Link>
      </InteractiveElement>
    );
  } else if (date) {
    return formatDate(date);
  }
  return NO_VALUE;
};

const AssignmentsSeparations = (props) => {
  const id = props?.match.params.id;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const results = useSelector(state => state.altAssignmentsSeparations);
  const resultsErrored = useSelector(state => state.altAssignmentsSeparationsErrored);
  const resultsLoading = useSelector(state => state.altAssignmentsSeparationsLoading);
  const noResults = results?.length === 0;

  useEffect(() => {
    dispatch(altAssignmentsSeparations(id));
  }, [id]);

  // eslint-disable-next-line no-unused-vars
  const { data: employeeData, error: employeeDataError, loading: employeeDataLoading } = useDataLoader(api().get, `/fsbid/client/${id}/`);
  const employeeData$ = employeeData?.data;
  const employeeName = employeeDataLoading ? '' : employeeData$?.name;
  const employeeId = employeeDataLoading ? '' : employeeData$?.id;


  // ====================== UI State Management ======================

  // cleanup role check links for breadcrumbs
  const breadcrumbLinkRole = 'ao';

  // default || memo || notification
  // eslint-disable-next-line no-unused-vars
  const [cardMode, setCardMode] = useState('default');
  const [assignmentToggle, setAssignmentToggle] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [disableOtherEdits, setDisableOtherEdits] = useState(false);

  useEffect(() => {
    setDisableOtherEdits(false);
  }, []);

  useEffect(() => {
    if (openModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [openModal]);

  const modalEmployeeInfo = (
    <div className="maintain-asg-sep-employee-info">
      <div className="line-separated-fields">
        <div>
          <span className="span-label">Name: </span>
          <span className="span-text">{employeeName || NO_VALUE}</span>
        </div>
        <div>
          <span className="span-label">ID: </span>
          <span className="span-text">{employeeId || NO_VALUE}</span>
        </div>
      </div>
      <div className="horizontal-line-divider" />
    </div>
  );

  const getOverlay = () => {
    let overlay;
    if (resultsLoading || employeeDataLoading) {
      overlay = <Spinner type="standard-center" class="homepage-position-results" size="big" />;
    } else if (resultsErrored) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else if (noResults) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'No assignments for this user.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (getOverlay() ||
    <div className="assignments-maintenance-page position-search">
      <div className="asg-content">
        {false &&
          <div className="breadcrumb-container">
            <Link to={`/profile/public/${breadcrumbLinkRole}/`} className="breadcrumb-active">
              Bidder Portfolio
            </Link>
            <span className="breadcrumb-arrow">&gt;</span>
            <span>{id}</span>
          </div>
        }
        <div className="asg-header">
          <FA name="clipboard" className="fa-lg" />
          Assignments and Separations
          <span className="asg-title-dash">
            {'- '}
            <Link to={`/profile/public/${id}/ao`}>
              <span className="asg-title">
                {`${employeeName}`}
              </span>
            </Link>
          </span>
        </div>
        <div className="pt-20 asg-subheader">
          <span>
            Add or review the current assignments or separations for {employeeName}
          </span>
          <div className={`add-buttons ${disableOtherEdits ? 'disabled' : ''}`}>
            <div className="create-new-button">
              <a role="button" className="width-300" tabIndex={0} onClick={() => { if (!disableOtherEdits) setOpenModal(true); }}>
                <FA name="briefcase" />
                Add New Assignment/Separation
              </a>
            </div>
            {useNotification() &&
              <div className="create-new-button align-left">
                <a role="button" className="width-300" tabIndex={0} onClick={() => setCardMode('notification')}>
                  <FA name="briefcase" />
                  Add Notification
                </a>
              </div>
            }
            {useMemo() &&
              <div className="create-new-button align-left">
                <a role="button" className="width-300" tabIndex={0} onClick={() => setCardMode('memo')}>
                  <FA name="briefcase" />
                  Add Memo
                </a>
              </div>
            }
          </div>
        </div>
        <div className="results-mode">
          <InteractiveElement
            className={`${assignmentToggle ? 'active' : ''} ${(!assignmentToggle && disableOtherEdits) ? 'disabled' : ''}`}
            onClick={() => { if (!disableOtherEdits) setAssignmentToggle(true); }}
          >
            Assignments
          </InteractiveElement>
          <InteractiveElement
            className={`${!assignmentToggle ? 'active' : ''} ${(assignmentToggle && disableOtherEdits) ? 'disabled' : ''}`}
            onClick={() => { if (!disableOtherEdits) setAssignmentToggle(false); }}
          >
            Separations
          </InteractiveElement>
        </div>
        {disableOtherEdits &&
          <Alert
            type="warning"
            title="Edit Mode"
            customClassName="mb-10"
            messages={[{
              body: 'Discard or save your edits before editing or creating another card.',
            }]}
          />
        }
        {assignmentToggle && (results?.QRY_LSTASGS_REF?.length > 0 ?
          results?.QRY_LSTASGS_REF?.map(data => (
            <TabbedCard
              key={data?.ASG_SEQ_NUM}
              tabs={[{
                text: 'Assignment Overview',
                value: 'ASSIGNMENT',
                content: <Assignment
                  perdet={id}
                  setNewAsgSep={setCardMode}
                  data={data}
                  setDisableOtherEdits={setDisableOtherEdits}
                  disableOtherEdits={disableOtherEdits}
                />,
              }]}
            />
          )) :
          <Alert
            type="info"
            title="No Results"
            messages={[{
              body: 'There are no assignments at this time.',
            }]}
          />
        )}
        {!assignmentToggle && (results?.QRY_LSTSEPS_REF?.length > 0 ?
          results?.QRY_LSTSEPS_REF?.map(data => (
            <TabbedCard
              key={data?.SEP_SEQ_NUM}
              tabs={[{
                text: 'Separation Overview',
                value: 'SEPARATION',
                content: <Separation
                  perdet={id}
                  setNewAsgSep={setCardMode}
                  data={data}
                  setDisableOtherEdits={setDisableOtherEdits}
                  disableOtherEdits={disableOtherEdits}
                />,
              }]}
            />
          )) :
          <Alert
            type="info"
            title="No Results"
            messages={[{
              body: 'There are no separations at this time.',
            }]}
          />
        )}
        <ReactModal open={openModal} setOpen={setOpenModal}>
          <TabbedCard
            className="modal-child"
            tabs={[{
              text: 'Maintain Assignment',
              value: 'ASSIGNMENT',
              content: <Assignment
                perdet={id}
                setNewAsgSep={() => setCardMode('default')}
                toggleModal={setOpenModal}
                isNew
                employee={modalEmployeeInfo}
              />,
            }, {
              text: 'Maintain Separation',
              value: 'SEPARATION',
              content: <Separation
                perdet={id}
                setNewAsgSep={() => setCardMode('default')}
                toggleModal={setOpenModal}
                isNew
                employee={modalEmployeeInfo}
              />,
            }]}
          />
        </ReactModal>
      </div>
    </div>
  );
};

AssignmentsSeparations.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

AssignmentsSeparations.defaultProps = {
  match: {},
};

export default AssignmentsSeparations;
