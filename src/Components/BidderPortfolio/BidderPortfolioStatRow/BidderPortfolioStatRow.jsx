import { useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NO_GRADE, NO_LANGUAGE, NO_POST, NO_TOUR_END_DATE } from 'Constants/SystemMessages';
import { formatDate } from 'utilities';
import FA from 'react-fontawesome';
import { toastSuccess } from 'actions/toast';
import ToggleButton from 'Components/ToggleButton';
import InteractiveElement from 'Components/InteractiveElement';
import { BIDDER_OBJECT, CLASSIFICATIONS } from '../../../Constants/PropTypes';
import SkillCodeList from '../../SkillCodeList';
import ClientBadgeList from '../ClientBadgeList';
import CheckboxList from '../CheckboxList';
import SearchAsClientButton from '../SearchAsClientButton';
import AddToInternalListButton from '../AddToInternalListButton';

const BidderPortfolioStatRow = ({ userProfile, showEdit, classifications }) => {
  const currentAssignmentText = get(userProfile, 'pos_location');
  const clientClassifications = get(userProfile, 'classifications');
  const perdet = get(userProfile, 'perdet_seq_number');
  const id = get(userProfile, 'employee_id');
  const ted = formatDate(get(userProfile, 'current_assignment.end_date'));
  const languages = get(userProfile, 'current_assignment.position.language');
  const bidder = get(userProfile, 'shortened_name') || 'None listed';
  const orgShortDesc = get(userProfile, 'current_assignment.position.organization');
  const [edit, setEdit] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [included, setIncluded] = useState(true);

  const editClient = (e) => {
    e.preventDefault();
    setEdit(previous => !previous);
  };

  const saveEdit = () => {
    // Nothing to do yet, will add later
    toastSuccess('Changes saved.');
    setEdit(false);
  };

  const showSaveAndCancel = edit && showMore;

  return (
    <div className="usa-grid-full bidder-portfolio-stat-row">
      <div className="stat-card-header">
        <h3 className="stat-card-client">Client Overview</h3>
        <ToggleButton
          labelTextRight={!included ? 'Excluded' : 'Included'}
          checked={included}
          onChange={() => setIncluded(!included)}
          onColor="#0071BC"
        />
      </div>
      { showMore &&
        <div className="stat-card-data-point stat-card-data-point--name stat-card-data-space">
          <Link to={`/profile/public/${perdet}`}>{bidder}</Link>
          <Link to="#" onClick={(e) => editClient(e)}>
            <FA name="pencil" />
            Edit
          </Link>
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
          !showEdit &&
          <div className="button-container">
            <SearchAsClientButton user={userProfile} />
            <AddToInternalListButton refKey={perdet} />
          </div>
        }
        {
          showEdit &&
          <CheckboxList id={userProfile.id} />
        }
      </div>
      { showMore &&
        <div>
          <div className="stat-card-data-point stat-card-comments">
            <dt>Comments:</dt><dd><textarea disabled={!edit} /></dd>
          </div>
          <div className="stat-card-data-point">
            <dt>DOS Email:</dt><dd><a href="mailto: example@gmail.com">example@gmail.com</a></dd>
          </div>
          <div className={!edit && 'stat-card-data-point'} >
            <dt>Alt Email:</dt>
            {edit ? <input type="text" defaultValue="" placeholder="example@gmail.com" /> :
              <a href="mailto: example@gmail.com">example@gmail.com</a>
            }
          </div>
        </div>
      }
      { showSaveAndCancel &&
        <div className="stat-card-btn-container">
          <button className="stat-card-cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
          <button onClick={saveEdit}>Save</button>
        </div>
      }
      <div className="toggle-more-container">
        <InteractiveElement className="toggle-more" onClick={() => setShowMore(!showMore)}>
          <FA name={`chevron-${showMore ? 'up' : 'down'}`} />
        </InteractiveElement>
      </div>
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
};

export default BidderPortfolioStatRow;
