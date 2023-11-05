import { useEffect } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'Components/Spinner';
import ProfileSectionTitle from 'Components/ProfileSectionTitle';
import Alert from 'Components/Alert';
import { bureauExceptionUsersListFetchData } from 'actions/bureauException';
import BureauExceptionListCard from './BureauExceptionListCard';


const BureauExceptionList = () => {
  const dispatch = useDispatch();

  const BureauExceptionDataLoading = useSelector(state => state.bureauExceptionLoading);
  const BureauExceptionData = useSelector(state => state.bureauExceptionSuccess);
  const BureauExceptionError = useSelector(state => state.bureauExceptionErrored);
  const fetchAndSet = () => {
    dispatch(bureauExceptionUsersListFetchData());
  };

  useEffect(() => {
    fetchAndSet();
  }, []);

  // Overlay for error, info, and loading state
  const noResults = BureauExceptionData?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (BureauExceptionDataLoading) {
      overlay = <Spinner type="standard-center" class="homepage-position-results" size="medium" />;
    } else if (BureauExceptionError) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else if (noResults) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'Please broaden your search criteria and try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    <div className="position-search">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Bureau Exception Access" icon="users" className="xl-icon" />
      </div>
      {
        getOverlay() ||
        <>
          <div className="bel-lower-section">
            {BureauExceptionData?.map(data => (
              <BureauExceptionListCard
                key={data?.id}
                userData={data}
              />
            ),
            )
            }
          </div>
        </>
      }
    </div>
  );
};

export default withRouter(BureauExceptionList);
