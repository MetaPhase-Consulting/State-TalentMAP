import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, isNumber } from 'lodash';
import { Flag } from 'flag';
import { COMMON_PROPERTIES } from '../../Constants/EndpointParams';
import { Row, Column } from '../Layout';
import DefinitionList from '../DefinitionList';
import Favorite from '../../Containers/Favorite';
import MediaQueryWrapper from '../MediaQuery';
import CompareCheck from '../CompareCheck/CompareCheck';
import LanguageList from '../LanguageList';
import BidCount from '../BidCount';
import BoxShadow from '../BoxShadow';
import Handshake from '../Ribbon/Handshake';

import { formatDate, propOrDefault, getPostName, getBidStatisticsObject } from '../../utilities';

import { POSITION_DETAILS, FAVORITE_POSITIONS_ARRAY } from '../../Constants/PropTypes';
import {
  NO_BUREAU,
  NO_BID_CYCLE,
  NO_DANGER_PAY,
  NO_GRADE,
  NO_POST_DIFFERENTIAL,
  NO_POSITION_NUMBER,
  NO_POST,
  NO_SKILL,
  NO_TOUR_OF_DUTY,
  NO_UPDATE_DATE,
  NO_DATE,
  NO_USER_LISTED,
} from '../../Constants/SystemMessages';

const getResult = (result, path, defaultValue, isRate = false) => {
  let value = get(result, path, defaultValue);

  if ((/_date|date_/i).test(path) && value !== defaultValue) {
    value = formatDate(value);
  }

  if (isRate && isNumber(value)) {
    value = `${value}%`;
  }

  if (!value) {
    value = defaultValue;
  }

  return value;
};

export const renderBidCount = stats => (
  <Column columns="4">
    <BidCount bidStatistics={stats} altStyle />
  </Column>
);

const ResultsCard = (props) => {
  const options = {};
  const {
    id,
    result,
    favorites,
    isProjectedVacancy,
  } = props;

  const pos = result.position || result;

  const title = propOrDefault(pos, 'title');
  const position = getResult(pos, 'position_number', NO_POSITION_NUMBER);
  const languages = getResult(pos, 'languages', []);

  const language = (<LanguageList languages={languages} propToUse="representation" />);

  const post = `${getPostName(pos.post, NO_POST)}${pos.organization ? `: ${pos.organization}` : ''}`;

  const stats = getBidStatisticsObject(pos.bid_statistics);

  // TODO - update this to a real property once API is updateds
  const recentlyAvailable = pos.recently_available;

  const bidTypeTitle = isProjectedVacancy ? 'Bid season' : 'Bid cycle';

  const sections = [
    /* eslint-disable quote-props */
    {
      'TED': getResult(pos, 'current_assignment.estimated_end_date', NO_DATE),
      [bidTypeTitle]: getResult(result, 'bidcycle.name', NO_BID_CYCLE),
      'Skill': getResult(pos, 'skill', NO_SKILL),
      'Grade': getResult(pos, 'grade', NO_GRADE),
      'Bureau': getResult(pos, 'bureau', NO_BUREAU),
    },
    {
      'Tour of duty': getResult(pos, 'post.tour_of_duty', NO_TOUR_OF_DUTY),
      'Language': language,
      'Post differential': getResult(pos, 'post.differential_rate', NO_POST_DIFFERENTIAL, true),
      'Danger pay': getResult(pos, 'post.danger_pay', NO_DANGER_PAY, true),
      'Incumbent': getResult(pos, 'current_assignment.user', NO_USER_LISTED),
    },
    {
      'Posted': getResult(pos, COMMON_PROPERTIES.posted, NO_UPDATE_DATE),
      'Position number': position,
    },
  /* eslint-enable quote-props */
  ];

  options.favorite = {
    compareArray: favorites,
    refKey: pos.id,
    hasBorder: true,
    useButtonClass: true,
    useLongText: true,
    isPV: isProjectedVacancy,
  };

  options.compare = {
    as: 'div',
    refKey: result.id,
  };

  return (
    <MediaQueryWrapper breakpoint="screenMdMax" widthType="max">
      {() => (
        <BoxShadow>
          <div id={id} className={`results-card ${isProjectedVacancy ? 'results-card--secondary' : ''}`}>
            <Row className="header" fluid>
              <Column columns="8">
                <Column columns="12" className="results-card-title-link">
                  <h3>{title}</h3>
                  { !isProjectedVacancy && <Link to={`/details/${result.id}`}>View position</Link> }
                  {recentlyAvailable && <span className="available-alert">Now available!</span>}
                </Column>
                <Column columns="12" className="results-card-title-link">
                  <dt>Post:</dt><dd>{post}</dd>
                </Column>
              </Column>
              <Flag
                name="flags.bidding"
                render={() => renderBidCount(stats)}
              />
            </Row>
            <Flag
              name="flags.bidding"
              render={() =>
                (<Row id={`${id}-inner`} fluid>
                  <Column columns="6">
                    <DefinitionList items={sections[0]} />
                  </Column>
                  <Column columns="4">
                    <DefinitionList items={sections[1]} />
                  </Column>
                  <Column columns="2">
                    {
                      get(stats, 'has_handshake_offered', false) && <Handshake className="ribbon-results-card" />
                    }
                  </Column>
                </Row>)
              }
              fallbackRender={() =>
                (<Row id={`${id}-inner`} fluid>
                  <Column columns="6">
                    <DefinitionList items={sections[0]} />
                  </Column>
                  <Column columns="6">
                    <DefinitionList items={sections[1]} />
                  </Column>
                </Row>)
              }
            />
            <Row className="footer results-card-padded-section" fluid>
              <Column columns="6" as="section">
                {
                !!favorites &&
                  <Favorite {...options.favorite} />
              }
                <CompareCheck {...options.compare} />
              </Column>
              <Column columns="6" as="section">
                <div>
                  <DefinitionList items={sections[2]} />
                </div>
              </Column>
            </Row>
          </div>
        </BoxShadow>
      )}
    </MediaQueryWrapper>
  );
};


ResultsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  result: POSITION_DETAILS.isRequired,
  favorites: FAVORITE_POSITIONS_ARRAY,
  isProjectedVacancy: PropTypes.bool,
};

ResultsCard.defaultProps = {
  favorites: [],
  isProjectedVacancy: false,
};

export default ResultsCard;
