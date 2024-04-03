import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import { Tooltip } from 'react-tippy';
import { useDispatch, useSelector } from 'react-redux';
import { onEditModeSearch } from 'utilities';
import { filtersFetchData } from 'actions/filters/filters';
import Alert from 'Components/Alert';
import { bidAuditFetchData, bidAuditUpdateBidCounts } from 'actions/bidAudit';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import swal from '@sweetalert/with-react';
import BidAuditCard from './BidAuditCard';
import BidAuditModal from './BidAuditModal';

const BidAudit = () => {
  const dispatch = useDispatch();

  const dummyPositionDetails = useSelector(state => state.bidAudit);
  const atGrades = dummyPositionDetails[0]?.atGrades || [];
  const inCategories = dummyPositionDetails[1]?.inCategories || [];
  const [cardsInEditMode, setCardsInEditMode] = useState([]);

  const disableSearch = cardsInEditMode.length > 0;

  const genericFilters = useSelector(state => state.filters);

  useEffect(() => {
    dispatch(bidAuditFetchData());
    dispatch(filtersFetchData(genericFilters));
  }, []);


  const onAddClick = (e) => {
    e.preventDefault();
    swal({
      title: 'Create New Audit Cycle',
      button: false,
      content: (
        // passing in a auditNumber prop to the BidAuditModal component until backend is ready
        <BidAuditModal data={genericFilters} auditNumber={88} />
      ),
    });
  };

  const cancelBidCount = () => swal.close();
  const submitBidCount = () => {
    dispatch(bidAuditUpdateBidCounts());
    swal.close();
  };

  const onUpdateCountClick = (e) => {
    e.preventDefault();
    swal({
      title: 'Run Dynamic Audit to Update Bid Counts?',
      button: false,
      content: (
        <div className="bid-audit-modal-buttons">
          <button onClick={submitBidCount} type="submit">Yes</button>
          <button onClick={cancelBidCount}>Cancel</button>
        </div>
      ),
    });
  };

  return (
    <div className="position-search bid-audit-page">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Bid Audit" icon="keyboard-o" className="xl-icon" />

      </div>
      {disableSearch &&
        <Alert
          type="warning"
          title={'Edit Mode (Search Disabled)'}
          customClassName="mb-10"
          messages={[{
            body: 'Discard or save your edits before searching. ' +
              'Filters and Pagination are disabled if any cards are in Edit Mode.',
          }]}
        />
      }
      <div className="usa-width-one-whole position-search--results">
        <div className="usa-grid-full position-list">
          <span className="ba-flex-end">
            <Tooltip title="Run Dynamic Audit">
              <FA name="clock-o" />
              {' '}
              <Link to="#" onClick={onUpdateCountClick}>
                {'Update Bid Count'}
              </Link>
            </Tooltip>
            <span className="ml-10">
              <FA className="ml-10" name="plus" />
              {' '}
              <Link
                to="#"
                onClick={onAddClick}
              >
                {'Create New Audit Cycle'}
              </Link>
            </span>
          </span>
          {dummyPositionDetails[2]?.bidAudit.map(k => (
            <BidAuditCard
              atGrades={atGrades}
              inCategories={inCategories}
              id={k.id}
              key={k.id}
              result={k}
              onEditModeSearch={(editMode, id) =>
                onEditModeSearch(editMode, id, setCardsInEditMode, cardsInEditMode)
              }
            />
          ))}
        </div>
      </div>
      {disableSearch &&
        <div className="disable-react-paginate-overlay" />
      }
    </div>
  );
};


export default BidAudit;
