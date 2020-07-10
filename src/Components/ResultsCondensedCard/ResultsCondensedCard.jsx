import React from 'react';
import PropTypes from 'prop-types';
import ResultsCondensedCardTop from '../ResultsCondensedCardTop';
import ResultsCondensedCardBottom from '../ResultsCondensedCardBottom';
import ResultsCondensedCardFooter from '../ResultsCondensedCardFooter';
import BoxShadow from '../BoxShadow';
import { POSITION_DETAILS, FAVORITE_POSITIONS_ARRAY, BID_RESULTS, HOME_PAGE_CARD_TYPE } from '../../Constants/PropTypes';

const ResultsCondensedCard = (
  {
    position,
    favorites,
    favoritesTandem,
    favoritesPV,
    favoritesPVTandem,
    bidList,
    type,
    refreshFavorites,
    showBidListButton,
    isProjectedVacancy,
    isRecentlyAvailable,
    useShortFavButton,
    showCompareButton,
    sortType,
    limit,
    page,
  }) => (
  <BoxShadow className="usa-grid-full condensed-card-inner">
    <ResultsCondensedCardTop
      position={position}
      type={type}
      isProjectedVacancy={isProjectedVacancy}
      isRecentlyAvailable={isRecentlyAvailable}
    />
    <ResultsCondensedCardBottom
      position={position}
      favorites={favorites}
      favoritesPV={favoritesPV}
      favoritesTandem={favoritesTandem}
      favoritesPVTandem={favoritesPVTandem}
      bidList={bidList}
      refreshFavorites={refreshFavorites}
      showBidListButton={showBidListButton && !isProjectedVacancy}
      showBidCount={!isProjectedVacancy}
      useShortFavButton={useShortFavButton}
      showCompareButton={showCompareButton}
      isProjectedVacancy={isProjectedVacancy}
      sortType={sortType}
      limit={limit}
      page={page}
    />
    <ResultsCondensedCardFooter
      position={position}
      isProjectedVacancy={isProjectedVacancy}
    />
  </BoxShadow>
);

ResultsCondensedCard.propTypes = {
  position: PropTypes.shape({
    position: POSITION_DETAILS.isRequired,
  }).isRequired,
  favorites: FAVORITE_POSITIONS_ARRAY,
  favoritesPV: FAVORITE_POSITIONS_ARRAY,
  favoritesTandem: FAVORITE_POSITIONS_ARRAY,
  favoritesPVTandem: FAVORITE_POSITIONS_ARRAY,
  bidList: BID_RESULTS.isRequired,
  type: HOME_PAGE_CARD_TYPE.isRequired,
  refreshFavorites: PropTypes.bool,
  showBidListButton: PropTypes.bool,
  isProjectedVacancy: PropTypes.bool,
  isRecentlyAvailable: PropTypes.bool,
  useShortFavButton: PropTypes.bool,
  showCompareButton: PropTypes.bool,
  sortType: PropTypes.string,
  limit: PropTypes.number,
  page: PropTypes.number,
};

ResultsCondensedCard.defaultProps = {
  favorites: [],
  favoritesPV: [],
  favoritesTandem: [],
  favoritesPVTandem: [],
  refreshFavorites: false,
  showBidListButton: false,
  isProjectedVacancy: false,
  isRecentlyAvailable: false,
  useShortFavButton: false,
  showCompareButton: false,
  sortType: null,
  limit: 15,
  page: 1,
};

export default ResultsCondensedCard;
