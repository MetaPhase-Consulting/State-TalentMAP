import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import { BIDDER_OBJECT, CLASSIFICATIONS } from 'Constants/PropTypes';
import { NO_GRADE, NO_POST } from 'Constants/SystemMessages';
import BoxShadow from '../../BoxShadow';
import SkillCodeList from '../../SkillCodeList';
import ClientBadgeList from '../ClientBadgeList';
import SearchAsClientButton from '../SearchAsClientButton';
import AddToInternalListButton from '../AddToInternalListButton';

const useCDOBidding = () => checkFlag('flags.cdo_bidding');
const useAvailableBidders = () => checkFlag('flags.available_bidders');

const BidderPortfolioStatCard = ({ userProfile, classifications }) => {
  const currentAssignmentText = get(userProfile, 'pos_location');
  const clientClassifications = get(userProfile, 'classifications');
  const perdet = get(userProfile, 'perdet_seq_number');
  return (
    <BoxShadow className="usa-grid-full bidder-portfolio-stat-card">
      <div className="bidder-portfolio-stat-card-top">
        <div>
          <h3>
            {get(userProfile, 'shortned_name', 'N/A')}
          </h3>
          <Link to={`/profile/public/${perdet}`}>View Profile</Link>
        </div>
        <div className="stat-card-data-point">
          <dt>Employee ID:</dt><dd>{perdet}</dd>
        </div>
        <div className="stat-card-data-point">
          <dt>Skill:</dt><dd><SkillCodeList skillCodes={userProfile.skills} /></dd>
        </div>
        <div className="stat-card-data-point">
          <dt>Grade:</dt><dd>{userProfile.grade || NO_GRADE}</dd>
        </div>
        <div className="stat-card-data-point">
          <dt>Location:</dt><dd>{currentAssignmentText || NO_POST}</dd>
        </div>
      </div>
      <div className="bidder-portfolio-stat-card-bottom">
        <div>
          <span className="updates">Classifications: </span>
          <ClientBadgeList
            clientClassifications={clientClassifications}
            classifications={classifications}
          />
        </div>
        {useCDOBidding() &&
        <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <SearchAsClientButton user={userProfile} />
          { useAvailableBidders() && <AddToInternalListButton refKey={perdet} /> }
        </div>}
      </div>
    </BoxShadow>
  );
};

BidderPortfolioStatCard.propTypes = {
  userProfile: BIDDER_OBJECT.isRequired,
  classifications: CLASSIFICATIONS,
};

BidderPortfolioStatCard.defaultProps = {
  classifications: [],
};

export default BidderPortfolioStatCard;
