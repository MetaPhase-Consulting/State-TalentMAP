import { useEffect } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'Components/Spinner';
import ProfileSectionTitle from 'Components/ProfileSectionTitle';
import Alert from 'Components/Alert';
import { bureauExceptionFetchData } from 'actions/bureauException';
import BureauExceptionListCard from './BureauExceptionListCard';


const BureauExceptionList = () => {
  const dispatch = useDispatch();

  const BureauExceptionDataLoading = useSelector(state => state.bureauExceptionsFetchDataLoading);
  const BureauExceptionData = useSelector(state => state.bureauExceptions);
  const BureauExceptionOptionsData = useSelector(state => state.bureauExceptionsOptions);
  const BureauExceptionError = useSelector(state => state.bureauExceptionsFetchDataErrored);
  const fetchAndSet = () => {
    dispatch(bureauExceptionFetchData());
  };

  useEffect(() => {
    fetchAndSet();
  }, []);

  // Overlay for error, info, and loading state
  const noResults = BureauExceptionData?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (BureauExceptionDataLoading) {
      overlay = <Spinner type="bid-season-filters" class="homepage-position-results" size="big" />;
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
        <ProfileSectionTitle title="Bureau Exception List" icon="calendar" className="xl-icon" />
      </div>
      {
        getOverlay() ||
        <>
          <div className="bs-lower-section">
            {BureauExceptionData?.map(data => (
              <BureauExceptionListCard
                key={data?.id}
                userData={data}
                BureauExceptionOptionsData={BureauExceptionOptionsData?.data}
              />),
            )
            }
          </div>
        </>
      }
    </div>
  );
};

export default withRouter(BureauExceptionList);
