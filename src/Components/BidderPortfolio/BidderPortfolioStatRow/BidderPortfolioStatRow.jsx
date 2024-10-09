import { useEffect, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { checkFlag } from 'flags';
import { Cusp, Eligible } from 'Components/Ribbon';
import { NO_GRADE, NO_LANGUAGE, NO_POST, NO_TOUR_END_DATE } from 'Constants/SystemMessages';
import { formatDate } from 'utilities';
import ToggleButton from 'Components/ToggleButton';
import { BIDDER_OBJECT, CLASSIFICATIONS } from '../../../Constants/PropTypes';
import SkillCodeList from '../../SkillCodeList';
import ClientBadgeList from '../ClientBadgeList';
import CheckboxList from '../CheckboxList';
import SearchAsClientButton from '../SearchAsClientButton';
import AddToInternalListButton from '../AddToInternalListButton';

const BidderPortfolioStatRow = ({ userProfile, showEdit, classifications }) => {
  const showCDOD30 = checkFlag('flags.CDOD30');

  const currentAssignmentText = get(userProfile, 'pos_location');
  const clientClassifications = get(userProfile, 'classifications');
  const perdet = get(userProfile, 'perdet_seq_number');
  const id = get(userProfile, 'employee_id');
  const ted = formatDate(get(userProfile, 'current_assignment.end_date'));
  const languages = get(userProfile, 'current_assignment.position.language');
  const bidderType = 'cusp';
  const orgShortDesc = get(userProfile, 'current_assignment.position.organization');
  const email = get(userProfile, 'cdos')[0]?.cdo_email;
  const alternativeEmail = get(userProfile, 'alt_email');
  const comments = get(userProfile, 'comments') || 'None listed';
  const [currentBidderType, setCurrentBidderType] = useState(bidderType);
  const [included, setIncluded] = useState(bidderType === 'cusp');

  const cusp = included;
  const eligible = !included;
  const showToggle = bidderType !== null;

  useEffect(() => {
    if (currentBidderType === 'eligible') {
      setIncluded(false);
    }
    if (currentBidderType === 'cusp') {
      setIncluded(true);
    }
  }, [currentBidderType]);

  const onToggleChange = () => {
    if (currentBidderType === 'cusp') {
      setCurrentBidderType('eligible');
    }
    if (currentBidderType === 'eligible') {
      setCurrentBidderType('cusp');
    }
  };

  const showSearch = !showEdit;

  const ribbons = (
    <div>
      {
        eligible &&
        <Tooltip
          title="Eligible"
          arrow
          offset={-60}
        >
          <Eligible />
        </Tooltip>
      }
      {
        cusp &&
        <Tooltip
          title="Cusp"
          arrow
          offset={-60}
        >
          <Cusp />
        </Tooltip>
      }
    </div>
  );

  return (
    <div className="usa-grid-full bidder-portfolio-stat-row">
      <div className="stat-card-header">
        {
          showToggle && showCDOD30 &&
          <ToggleButton
            labelTextRight={!included ? 'Excluded' : 'Included'}
            checked={included}
            onChange={onToggleChange}
            onColor="#0071BC"
          />
        }
      </div>
      {
        showToggle && showCDOD30 &&
        <div className="bidder-portfolio-ribbon-container">
          <div className="ribbon-container-condensed">
            {ribbons}
          </div>
        </div>
      }
      <div>
        <div>
          <div className="stat-card-data-point">
            <dt>Employee ID:</dt><dd>{id}</dd>
          </div>
          <div className="stat-card-data-point">
            <dt>Skill:</dt><dd><SkillCodeList skillCodes={userProfile.skills} /></dd>
          </div>
          <div className="stat-card-data-point">
            <dt>Grade:</dt><dd>{userProfile.grade || NO_GRADE}</dd>
          </div>
          <div className="stat-card-data-point">
            <dt>Languages:</dt><dd>{languages || NO_LANGUAGE}</dd>
          </div>
          <div className="stat-card-data-point">
            <dt>TED:</dt><dd>{ted || NO_TOUR_END_DATE}</dd>
          </div>
          <div className="stat-card-data-point">
            <dt>Location (Org):</dt><dd>{currentAssignmentText || NO_POST} ({orgShortDesc})</dd>
          </div>
        </div>

        { showCDOD30 &&
          <>
            <div className="stat-card-data-point">
              <dt>DOS Email:</dt>
              <dd>
                {email ?
                  <a href={`mailto: ${email}`}>{email}</a>
                  : 'None listed'
                }
              </dd>
            </div>
            <div className={'stat-card-data-point'} >
              <dt>Alt Email:</dt>
              <dd>
                {alternativeEmail ?
                  <a href={`mailto:${alternativeEmail}`}>{alternativeEmail}</a> :
                  'None listed'
                }
              </dd>
            </div>
            <div className="stat-card-data-point">
              <dt>Comments:</dt><dd>{comments}</dd>
            </div>
          </>
        }


        {
          !showEdit &&
          <div className="bidder-portfolio-stat-row-updates">
            <h4>Classifications: </h4>
            <ClientBadgeList
              clientClassifications={clientClassifications}
              classifications={classifications}
            />
          </div>
        }
        {
          showEdit &&
          <CheckboxList id={userProfile.id} />
        }
      </div>
      {
        showSearch &&
        <div className="button-container">
          <SearchAsClientButton user={userProfile} />
          <AddToInternalListButton refKey={perdet} />
        </div>
      }
    </div>
  );
};

BidderPortfolioStatRow.propTypes = {
  userProfile: BIDDER_OBJECT.isRequired,
  showEdit: PropTypes.bool,
  classifications: CLASSIFICATIONS,
};

BidderPortfolioStatRow.defaultProps = {
  showEdit: false,
  classifications: [],
  viewType: '',
};

export default BidderPortfolioStatRow;
