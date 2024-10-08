import { useEffect, useState } from 'react';
import { get } from 'lodash';
// import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Cusp, Eligible } from 'Components/Ribbon';
// import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// import FA from 'react-fontawesome';
import { checkFlag } from 'flags';
import { BIDDER_OBJECT, CLASSIFICATIONS } from 'Constants/PropTypes';
import { NO_GRADE, NO_LANGUAGE, NO_POST, NO_TOUR_END_DATE } from 'Constants/SystemMessages';
import { formatDate } from 'utilities';
// import TextareaAutosize from 'react-textarea-autosize';
// import { saveBidderPortfolioSelections } from 'actions/bidderPortfolio';
import ToggleButton from 'Components/ToggleButton';
// import InteractiveElement from 'Components/InteractiveElement';

import BoxShadow from '../../BoxShadow';
import SkillCodeList from '../../SkillCodeList';
import ClientBadgeList from '../ClientBadgeList';
import SearchAsClientButton from '../SearchAsClientButton';
import AddToInternalListButton from '../AddToInternalListButton';

const BidderPortfolioStatCard = ({ userProfile, showEdit, classifications }) => {
  // const dispatch = useDispatch();
  const showCDOD30 = checkFlag('flags.CDOD30');
  const currentAssignmentText = get(userProfile, 'pos_location');
  const clientClassifications = get(userProfile, 'classifications');
  const perdet = get(userProfile, 'perdet_seq_number');
  // const perSeqNum = get(userProfile, 'per_seq_num');
  // const hruID = get(userProfile, 'hru_id');
  const id = get(userProfile, 'employee_id');
  const ted = formatDate(get(userProfile, 'current_assignment.end_date'));
  const languages = get(userProfile, 'current_assignment.position.language');
  // const bidder = get(userProfile, 'shortened_name') || 'None listed';
  // const alternativeEmail = get(userProfile, 'alt_email') || 'None listed';
  // const commentsText = get(userProfile, 'comments') || 'None listed';
  // This is the new key bidder_types. It returns a string of either 'cusp' or 'eligible'
  const bidderType = 'eligible';
  const email = get(userProfile, 'cdos')[0]?.cdo_email;
  const alternativeEmail = get(userProfile, 'alt_email');
  const comments = get(userProfile, 'comments') || 'None listed';
  const orgShortDesc = get(userProfile, 'current_assignment.position.organization');
  const [currentBidderType, setCurrentBidderType] = useState(bidderType);
  const [included, setIncluded] = useState(bidderType === 'cusp');
  // const [showMore, setShowMore] = useState(false);
  // const [edit, setEdit] = useState(false);
  // const [comments, setComments] = useState(commentsText);
  // const [altEmail, setAltEmail] = useState(alternativeEmail);
  // const [currentSeason, setCurrentSeason] = useState(0);

  const cusp = included;
  const eligible = !included;
  const showToggle = bidderType !== null;
  // const showSaveAndCancel = edit && showMore;

  // const bidderPortfolioSeasons = useSelector(state => state.bidderPortfolioSeasons);

  // const editClient = (e) => {
  //   e.preventDefault();
  //   setEdit(previous => !previous);
  // };

  // const saveEdit = () => {
  //   const clientData = {
  //     per_seq_number: perSeqNum,
  //     bid_seasons: [currentSeason],
  //     hru_id: hruID,
  //     comments,
  //     email: altEmail,
  //   };
  //   dispatch(saveBidderPortfolioSelections(clientData));
  //   setEdit(false);
  // };

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

  const showSearch = !showEdit; // removed && !edit;
  // const collapseCard = () => {
  //   setShowMore(!showMore);
  //   setEdit(false);
  // };

  // const onCancel = () => {
  //   setAltEmail('');
  //   setComments('');
  //   setEdit(false);
  // };

  // const onSeasonChange = (e) => {
  //   setCurrentSeason(Number(e.target.value));
  // };

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
    <BoxShadow className="usa-grid-full bidder-portfolio-stat-card">
      <div className="bidder-portfolio-stat-card-top">
        <div className="bidder-compact-card-head">
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
        {/* <div className="stat-card-data-point bidder-compact-card-head">
          <Link to={getBidderPortfolioUrl(perdet, viewType)}>{bidder}</Link>
          {
            showMore && showCDOD30 &&
            <Link to="#" onClick={(e) => editClient(e)}>
              <FA name="pencil" />
                Edit
            </Link>
          }
        </div> */}
        {
          showToggle && showCDOD30 &&
          <div className="bidder-portfolio-ribbon-container">
            <div className="ribbon-container-condensed-min">
              {ribbons}
            </div>
          </div>
        }
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
          <dt className="location-label">Location (Org):</dt><dd>{currentAssignmentText || NO_POST} ({orgShortDesc})</dd>
        </div>
        {
          showCDOD30 &&
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
              {/* {
                edit &&
                <input
                  type="text"
                  defaultValue=""
                  placeholder="example@gmail.com"
                  onChange={(e) => setAltEmail(e.target.value)}
                />
              } */}
            </div>
            <div className="stat-card-data-point">
              <dt>Comments:</dt><dd>{comments}</dd>
            </div>
          </>
        }
      </div>
      <div className="bidder-portfolio-stat-card-bottom">
        <div>
          <span className="updates">Classifications: </span>
          <ClientBadgeList
            clientClassifications={clientClassifications}
            classifications={classifications}
          />
        </div>
        {
          showSearch &&
          <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <SearchAsClientButton user={userProfile} />
            <AddToInternalListButton refKey={perdet} />
          </div>
        }
      </div>
      <div className="bidder-portfolio-stat-card-bottom">
        {/* {
          showMore && showCDOD30 &&
          <div>
            <div className="filter-div">
              <div className="label">Bid Season:</div>
              <select onChange={onSeasonChange} disabled={!edit}>
                <option key={0} value={0}>Please Select A Season</option>
                {
                  bidderPortfolioSeasons.map(season => (
                    <option key={season.id} value={season.id}>{season.description}</option>
                  ))
                }
              </select>
            </div>
            <dt>Comments:</dt>
            <div className="stat-card-data-point stat-card-comments">
              <TextareaAutosize
                className="stat-card-textarea"
                disabled={!edit || currentSeason === 0}
                maxLength="255"
                name="note"
                placeholder="No Notes"
                value={comments}
                defaultValue={!comments ? '' : comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
        }
        {
          showSaveAndCancel && showCDOD30 &&
          <div className="stat-card-btn-container">
            <button className="stat-card-cancel-btn" onClick={onCancel}>Cancel</button>
            <button onClick={saveEdit} disabled={currentSeason === 0 || (!comments && !altEmail)}>Save</button>
          </div>
        } */}
        {/* {
          showCDOD30 &&
          <div className="toggle-more-container">
            <InteractiveElement className="toggle-more" onClick={collapseCard}>
              <FA name={`chevron-${showMore ? 'up' : 'down'}`} />
            </InteractiveElement>
          </div>
        } */}
      </div>
    </BoxShadow>
  );
};

BidderPortfolioStatCard.propTypes = {
  userProfile: BIDDER_OBJECT.isRequired,
  showEdit: PropTypes.bool,
  classifications: CLASSIFICATIONS,
  // viewType: PropTypes.string,
};

BidderPortfolioStatCard.defaultProps = {
  showEdit: false,
  classifications: [],
  viewType: '',
};

export default BidderPortfolioStatCard;
