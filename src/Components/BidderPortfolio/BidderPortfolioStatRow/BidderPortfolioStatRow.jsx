import React from 'react';
import { get, orderBy } from 'lodash';
import PropTypes from 'prop-types';
import { BIDDER_OBJECT } from '../../../Constants/PropTypes';
import SkillCodeList from '../../SkillCodeList';
import { getPostName } from '../../../utilities';
import { NO_POST, NO_GRADE } from '../../../Constants/SystemMessages';
import ClientBadgeList from '../ClientBadgeList';
import StaticDevContent from '../../StaticDevContent';
import LinkButton from '../../LinkButton';
import Avatar from '../../Avatar';
import CheckboxList from '../CheckboxList';
import SearchAsClientButton from '../SearchAsClientButton';

const BidderPortfolioStatRow = ({ userProfile, showEdit }) => {
  const sortedAssignments = orderBy(userProfile.assignments, 'start_date', 'desc');
  const currentAssignment = get(sortedAssignments, '[0].position.post');
  const currentAssignmentText = getPostName(currentAssignment, NO_POST);
  return (
    <div className="usa-grid-full bidder-portfolio-stat-row">

      <div>
        <Avatar
          initials={userProfile.initials}
          firstName={userProfile.user.first_name}
          lastName={userProfile.user.last_name}
        />
      </div>

      <div>
        <div className="stat-card-data-point stat-card-data-point--name">
          {`${userProfile.user.first_name} ${userProfile.user.last_name}`}
        </div>
        <div className="stat-card-data-point">
          <dt>Skill:</dt><dd><SkillCodeList skillCodes={userProfile.skills} /></dd>
        </div>
        <div className="stat-card-data-point">
          <dt>Grade:</dt><dd>{userProfile.grade || NO_GRADE}</dd>
        </div>
        <div className="stat-card-data-point">
          <dt>Post:</dt><dd>{currentAssignmentText}</dd>
        </div>
      </div>
      {
        !showEdit &&
        <div className="bidder-portfolio-stat-row-updates">
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
      }
      {
        !showEdit &&
        <div className="button-container">
          <LinkButton className="usa-button-secondary" toLink={`/profile/public/${userProfile.id}`}>View Details</LinkButton>
          <SearchAsClientButton id={userProfile.id} />
        </div>
      }
      {
        showEdit &&
        <CheckboxList id={userProfile.id} />
      }
    </div>
  );
};

BidderPortfolioStatRow.propTypes = {
  userProfile: BIDDER_OBJECT.isRequired,
  showEdit: PropTypes.bool,
};

BidderPortfolioStatRow.defaultProps = {
  showEdit: false,
};

export default BidderPortfolioStatRow;
