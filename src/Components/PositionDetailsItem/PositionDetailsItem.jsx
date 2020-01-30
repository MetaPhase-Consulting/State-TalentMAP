import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flag } from 'flag';
import Differentials from 'Components/Differentials';
import { COMMON_PROPERTIES } from '../../Constants/EndpointParams';
import LanguageList from '../../Components/LanguageList/LanguageList';
import CondensedCardDataPoint from '../CondensedCardData/CondensedCardDataPoint';
import PositionDetailsDescription from './PositionDetailsDescription';
import PositionDetailsContact from './PositionDetailsContact';
import ServiceNeededToggle from './ServiceNeededToggle';
import GlossaryTermTrigger from '../GlossaryTermTrigger';
import { Featured, Handshake } from '../Ribbon';
import {
  formatDate,
  propOrDefault,
  getAccessiblePositionNumber,
  getBidStatisticsObject,
} from '../../utilities';

import { DEFAULT_HIGHLIGHT_POSITION } from '../../Constants/DefaultProps';
import {
  POSITION_DETAILS,
  USER_PROFILE,
  HIGHLIGHT_POSITION,
  EMPTY_FUNCTION,
} from '../../Constants/PropTypes';
import {
  NO_BUREAU,
  NO_GRADE,
  NO_SKILL,
  NO_END_DATE,
  NO_TOUR_OF_DUTY,
  NO_USER_LISTED,
  NO_UPDATE_DATE,
} from '../../Constants/SystemMessages';

export const renderHandshake = stats => (
  get(stats, 'has_handshake_offered', false) && <Handshake cutSide="both" className="ribbon-position-details" />
);

const PositionDetailsItem = (props) => {
  const {
    details,
    editDescriptionContent,
    resetDescriptionEditMessages,
    editPocContent,
    editWebsiteContent,
    userProfile,
    highlightPosition,
    onHighlight,
    isProjectedVacancy,
  } = props;

  const { position } = details;

  const isHighlightLoading = highlightPosition.loading;
  const tourEndDate = propOrDefault(details, 'ted');
  const formattedTourEndDate = tourEndDate ? formatDate(tourEndDate) : NO_END_DATE;

  const formattedBureau = get(position, 'bureau', NO_BUREAU);
  const formattedTOD = propOrDefault(position, 'post.tour_of_duty') || NO_TOUR_OF_DUTY;

  const dangerPay = get(position, 'post.danger_pay');
  const postDifferential = get(position, 'post.differential_rate');
  const obcUrl = get(position, 'post.post_bidding_considerations_url');
  const diffProps = { dangerPay, postDifferential, obcUrl };
  const differentials = <Differentials {...diffProps} />;

  const incumbent = propOrDefault(position, 'current_assignment.user', NO_USER_LISTED);

  const getPostedDate = () => {
    const posted = get(position, COMMON_PROPERTIES.posted);
    if (posted) {
      return formatDate(posted);
    }
    return NO_UPDATE_DATE;
  };
  const postedDate = getPostedDate();

  const stats = getBidStatisticsObject(get(details, 'bid_statistics'));

  const isHighlighted = get(position, 'is_highlighted');
  return (
    <div className="usa-grid-full padded-main-content position-details-outer-container">
      <div className="handshake-offset-container">
        <Flag
          name="flags.available_positions"
          render={() => renderHandshake(stats, position)}
        />
        {
          isHighlighted && <Featured cutSide="both" className="ribbon-position-details" />
        }
      </div>
      <div className="usa-grid-full position-details-description-container positions-details-about-position">
        <div className="usa-width-two-thirds about-section-left">
          <h2>About the Position</h2>
          <PositionDetailsDescription
            details={position}
            editDescriptionContent={editDescriptionContent}
            resetDescriptionEditMessages={resetDescriptionEditMessages}
          />
          {
            isHighlighted &&
            <div className="featured-description-container">
              {`
                This is a featured position. To learn more about the benefits of filling a featured position, click on each term:
              `}
              <GlossaryTermTrigger className="featured-description--link" text="volunteer" term="Vol Cable - Volunteer Cable" />
              {', '}
              <GlossaryTermTrigger className="featured-description--link" text="hard-to-fill" term="HDS - Historically Difficult to Staff" />
              {', or '}
              <GlossaryTermTrigger className="featured-description--link" text="urgent vacancies" term="UV - Urgent Vacancy" />
              {'.'}
            </div>
          }
          <div className="usa-grid-full data-point-section">
            <CondensedCardDataPoint ariaLabel={getAccessiblePositionNumber(position.position_number)} title="Position number" content={position.position_number} />
            <CondensedCardDataPoint title="Skill" content={position.skill || NO_SKILL} />
            <CondensedCardDataPoint title="Grade" content={position.grade || NO_GRADE} />
            <CondensedCardDataPoint title="Bureau" content={formattedBureau} />
            <CondensedCardDataPoint title="Tour of duty" content={formattedTOD} />
            <CondensedCardDataPoint title="Language" content={<LanguageList languages={position.languages} propToUse="representation" />} />
            <CondensedCardDataPoint title="Post differential | Danger Pay" content={differentials} />
            <CondensedCardDataPoint title="TED" content={formattedTourEndDate} />
            <CondensedCardDataPoint title="Incumbent" content={incumbent} />
            { !isProjectedVacancy && <CondensedCardDataPoint title="Posted" content={postedDate} />}
          </div>
        </div>
        <div className="usa-width-one-third position-details-contact-container">
          <PositionDetailsContact
            details={position}
            editWebsiteContent={editWebsiteContent}
            editPocContent={editPocContent}
            resetDescriptionEditMessages={resetDescriptionEditMessages}
            isProjectedVacancy={isProjectedVacancy}
          />
          {
            !isProjectedVacancy &&
            <ServiceNeededToggle
              userProfile={userProfile}
              position={details}
              loading={isHighlightLoading}
              onChange={onHighlight}
            />
          }
        </div>
      </div>
    </div>
  );
};

PositionDetailsItem.propTypes = {
  details: POSITION_DETAILS,
  editDescriptionContent: PropTypes.func.isRequired,
  resetDescriptionEditMessages: PropTypes.func.isRequired,
  editWebsiteContent: PropTypes.func.isRequired,
  editPocContent: PropTypes.func.isRequired,
  userProfile: USER_PROFILE,
  highlightPosition: HIGHLIGHT_POSITION,
  onHighlight: PropTypes.func.isRequired,
  isProjectedVacancy: PropTypes.bool,
};

PositionDetailsItem.defaultProps = {
  details: null,
  userProfile: {},
  highlightPosition: DEFAULT_HIGHLIGHT_POSITION,
  onHighlight: EMPTY_FUNCTION,
  isProjectedVacancy: false,
};

export default PositionDetailsItem;
