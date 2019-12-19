import React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { BIDDER_OBJECT } from '../../../Constants/PropTypes';
import BoxShadow from '../../BoxShadow';
import SkillCodeList from '../../SkillCodeList';
import { NO_GRADE, NO_POST } from '../../../Constants/SystemMessages';
import ClientBadgeList from '../ClientBadgeList';
import StaticDevContent from '../../StaticDevContent';
import SearchAsClientButton from '../SearchAsClientButton';

const BidderPortfolioStatCard = ({ userProfile }) => {
  const currentAssignmentText = get(userProfile, 'pos_location_code');
  return (
    <BoxShadow className="usa-grid-full bidder-portfolio-stat-card">
      <div className="bidder-portfolio-stat-card-top">
        <div>
          <h3>
            {get(userProfile, 'name', 'N/A')}
          </h3>
          <Link to={`/profile/public/${userProfile.perdet_seq_number}`}>View Profile</Link>
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
          <span className="updates">Bidder classifications</span>
          <StaticDevContent>
            <ClientBadgeList
              statuses={{
                handshake: 1,
                sixeight: 0,
                fairshare: 1,
                retirement: 2,
              }}
            />
          </StaticDevContent>
        </div>
        <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <SearchAsClientButton user={userProfile} />
        </div>
      </div>
    </BoxShadow>
  );
};

BidderPortfolioStatCard.propTypes = {
  userProfile: BIDDER_OBJECT.isRequired,
};

export default BidderPortfolioStatCard;
