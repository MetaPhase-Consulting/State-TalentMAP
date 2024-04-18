import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import { useDataLoader } from 'hooks';
import PropTypes from 'prop-types';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import { altAssignmentFetchData } from 'actions/assignment';
import AssignmentSeparationCard from './AssignmentSeparationCard/AssignmentSeparationCard';
import ReactModal from '../ReactModal';
import api from '../../api';

const useNotification = () => checkFlag('flags.assignment_notification');
const useMemo = () => checkFlag('flags.assignment_memo');

const Assignments = (props) => {
  const assignments = useSelector(state => state.altAssignment);
  const assignmentsErrored = useSelector(state => state.altAssignmentHasErrored);
  const assignmentsLoading = useSelector(state => state.altAssignmentIsLoading);

  // default || memo || notification
  // eslint-disable-next-line no-unused-vars
  const [cardMode, setCardMode] = useState('default');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (openModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [openModal]);

  const id = props?.match.params.id;

  // eslint-disable-next-line no-unused-vars
  const { data: employeeData, error: employeeDataError, loading: employeeDataLoading } = useDataLoader(api().get, `/fsbid/client/${id}/`);

  const employeeData$ = employeeData?.data;
  const employeeName = employeeDataLoading ? '' : employeeData$?.name;


  // eslint-disable-next-line no-unused-vars
  const hideBreadcrumbs = checkFlag('flags.breadcrumbs');
  // cleanup role check links for breadcrumbs
  const breadcrumbLinkRole = 'ao';

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(altAssignmentFetchData(id));
  }, [id]);

  const noResults = assignments?.length === 0;

  const getOverlay = () => {
    let overlay;
    if (assignmentsLoading || employeeDataLoading) {
      overlay = <Spinner type="standard-center" class="homepage-position-results" size="big" />;
    } else if (assignmentsErrored) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else if (noResults) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'No assignments for this user.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    getOverlay() ||
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
          Assignments
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
          Review the current assignments or add assignments for {employeeName}
          <div>
            <div className="create-new-button">
              <a role="button" className="width-300" tabIndex={0} onClick={() => setOpenModal(true)}>
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
        <div className="asg-lower-section">
          {assignments?.map(data => (
            <AssignmentSeparationCard
              perdet={id}
              data={data}
              setNewAsgSep={setCardMode}
            />
          ))}
          <ReactModal isOpen={openModal}>
            <AssignmentSeparationCard
              perdet={id}
              setNewAsgSep={() => setCardMode('default')}
              toggleModal={setOpenModal}
              isNew
            />
          </ReactModal>
        </div>
      </div>
    </div>
  );
};

Assignments.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

Assignments.defaultProps = {
  match: {},
};

export default Assignments;
