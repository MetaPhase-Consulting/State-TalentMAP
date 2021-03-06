import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import StaticDevContent from 'Components/StaticDevContent';
import { Tooltip } from 'react-tippy';
import { CriticalNeed, Handshake, HardToFill, ServiceNeedDifferential } from '../Ribbon';
import { HOME_PAGE_CARD_TYPE, POSITION_DETAILS } from '../../Constants/PropTypes';
import { NO_POST } from '../../Constants/SystemMessages';
import { getBidStatisticsObject, getPostName } from '../../utilities';

const ResultsCondensedCardTop = ({
  position,
  isProjectedVacancy,
  isRecentlyAvailable,
  isTandem,
}) => {
  let cardTopClass = '';
  let vacancyClass;
  let vacancyText;

  if (isProjectedVacancy) {
    vacancyClass = 'vacancy--projected';
    vacancyText = 'Projected Vacancy';
    cardTopClass = 'card-top-vacancy';
  } else if (isRecentlyAvailable) {
    vacancyClass = 'vacancy--recent';
    vacancyText = 'Now available';
  }
  const p = position.position || position;
  const stats = getBidStatisticsObject(position.bid_statistics);
  const hasHandshake = get(stats, 'has_handshake_offered', false);
  const isDifficultToStaff = get(position, 'isDifficultToStaff', false);
  const isServiceNeedDifferential = get(position, 'isServiceNeedDifferential', false);

  const title = get(position, 'position.title', '');

  const titleHeader = <h3>{title}</h3>;

  const link = `/${isProjectedVacancy ? 'vacancy' : 'details'}/${position.id}${isTandem ? '?tandem=true' : ''}`;

  const ribbons = (
    <div className="post-ribbon-container">
      <div className="ribbon-container-condensed">
        {
          hasHandshake &&
          <Tooltip
            title="Handshake"
            arrow
            offset={-60}
          >
            <Handshake showText={false} className="ribbon-condensed-card" />
          </Tooltip>
        }
        {
          <StaticDevContent>
            <Tooltip
              title="Critical need"
              arrow
              offset={-60}
            >
              <CriticalNeed showText={false} className="ribbon-condensed-card" />
            </Tooltip>
          </StaticDevContent>
        }
        {
          isDifficultToStaff &&
          <Tooltip
            title="Hard to fill"
            arrow
            offset={-60}
          >
            <HardToFill showText={false} className="ribbon-condensed-card" />
          </Tooltip>
        }
        {
          isServiceNeedDifferential &&
          <Tooltip
            title="Service need differential"
            arrow
            offset={-100}
          >
            <ServiceNeedDifferential showText={false} className="ribbon-condensed-card" />
          </Tooltip>
        }
      </div>

    </div>
  );

  const innerContent = (
    <div>
      {
        vacancyText &&
        <div className={`usa-grid-full condensed-card-top-header-container vacancy-text-container ${vacancyClass}`}>
          {vacancyText}
        </div>
      }
      <div className="usa-grid-full condensed-card-top-header-container">
        <div
          className={
            'usa-width-one-whole condensed-card-top-header condensed-card-top-header-left'
          }
        >
          { titleHeader }
        </div>
      </div>
      <div className="usa-grid-full post-ribbon-container">
        <div className="post-container">
          <span><span className="title">Location:</span> <span className="data">
            {
              isProjectedVacancy ?
                (p.organization || NO_POST) : getPostName(p.post, NO_POST)
            }
          </span></span>
        </div>
      </div>
    </div>
  );

  const containerProps = {
    className: `usa-grid-full ${cardTopClass} condensed-card-top--clickable`,
  };

  return (
    <div className="condensed-card-top">
      {ribbons}
      <Link to={link} {...containerProps} title="View details for this position">
        {innerContent}
      </Link>
    </div>
  );
};

ResultsCondensedCardTop.propTypes = {
  position: POSITION_DETAILS.isRequired,
  type: HOME_PAGE_CARD_TYPE,
  isProjectedVacancy: PropTypes.bool,
  isRecentlyAvailable: PropTypes.bool,
  isTandem: PropTypes.bool,
};

ResultsCondensedCardTop.defaultProps = {
  type: 'default',
  isProjectedVacancy: false,
  isRecentlyAvailable: false,
  isTandem: false,
};

export default ResultsCondensedCardTop;
