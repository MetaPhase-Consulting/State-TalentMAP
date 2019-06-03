import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flag } from 'flag';
import CondensedCardData from '../CondensedCardData';
import { POSITION_DETAILS, FAVORITE_POSITIONS_ARRAY } from '../../Constants/PropTypes';
import Favorite from '../../Containers/Favorite';
import BidListButton from '../../Containers/BidListButton';
import PermissionsWrapper from '../../Containers/PermissionsWrapper';
import ResultsCondensedCardStats from '../ResultsCondensedCardStats';
import CompareCheck from '../CompareCheck';

class ResultsCondensedCardBottom extends Component {
  constructor(props) {
    super(props);
    this.renderStats = this.renderStats.bind(this);
    this.renderBidListButton = this.renderBidListButton.bind(this);
  }
  renderStats() {
    const { showBidCount, position } = this.props;
    const pos = position.position || position;
    return showBidCount ?
      <ResultsCondensedCardStats bidStatisticsArray={pos.bid_statistics} />
    :
    null;
  }
  renderBidListButton() {
    const { showBidListButton, position } = this.props;
    const pos = position.position || position;
    return showBidListButton ?
      <PermissionsWrapper permissions="bidder">
        <BidListButton
          id={pos.id}
          disabled={!get(pos, 'availability.availability', true)}
        />
      </PermissionsWrapper>
    :
    null;
  }
  render() {
    const { position,
        favorites,
        refreshFavorites,
        useShortFavButton,
        showCompareButton,
      } = this.props;
    const pos = position.position || position;
    return (
      <div className="condensed-card-bottom-container">
        <div className="usa-grid-full condensed-card-bottom">
          <Flag
            name="flags.bidding"
            render={this.renderStats}
          />
          <CondensedCardData position={pos} />
          <div className="usa-grid-full condensed-card-buttons-section">
            <Favorite
              useLongText
              hideText={useShortFavButton}
              hasBorder
              refKey={pos.id}
              compareArray={favorites}
              useButtonClass={!useShortFavButton}
              useButtonClassSecondary={useShortFavButton}
              refresh={refreshFavorites}
            />
            <Flag
              name="flags.bidding"
              render={this.renderBidListButton}
            />
            {
              showCompareButton &&
              <CompareCheck as="div" refKey={pos.position_number} />
            }
          </div>
        </div>
      </div>
    );
  }
}

ResultsCondensedCardBottom.propTypes = {
  position: PropTypes.oneOfType([
    PropTypes.shape({
      position: POSITION_DETAILS.isRequired,
    }),
    POSITION_DETAILS.isRequired,
  ]).isRequired,
  favorites: FAVORITE_POSITIONS_ARRAY.isRequired,
  refreshFavorites: PropTypes.bool,
  showBidListButton: PropTypes.bool,
  showBidCount: PropTypes.bool,
  useShortFavButton: PropTypes.bool,
  showCompareButton: PropTypes.bool,
};

ResultsCondensedCardBottom.defaultProps = {
  type: 'default',
  refreshFavorites: false,
  showBidListButton: false,
  showBidCount: true,
  useShortFavButton: false,
  showCompareButton: false,
};

export default ResultsCondensedCardBottom;
