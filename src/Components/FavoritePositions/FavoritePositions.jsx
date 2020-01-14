import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FAVORITE_POSITIONS_ARRAY, BID_RESULTS } from '../../Constants/PropTypes';
import ProfileSectionTitle from '../ProfileSectionTitle';
import Spinner from '../Spinner';
import SelectForm from '../SelectForm';
import { POSITION_SEARCH_SORTS_DYNAMIC, filterPVSorts } from '../../Constants/Sort';
import HomePagePositionsList from '../HomePagePositionsList';
import NoFavorites from '../EmptyListAlert/NoFavorites';
import Nav from './Nav';
import { checkFlag } from '../../flags';

const getUsePV = () => checkFlag('flags.projected_vacancy');

const TYPE_PV = 'pv';
const TYPE_OPEN = 'open';
const TYPE_ALL = 'all';

class FavoritePositions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: TYPE_ALL,
    };
  }
  getPositions() {
    const { favorites, favoritesPV } = this.props;
    const { selected } = this.state;
    switch (selected) {
      case TYPE_OPEN:
        return favorites;
      case TYPE_PV:
        return favoritesPV;
      default:
        return [...favorites, ...favoritesPV];
    }
  }
  render() {
    const { selected } = this.state;
    const { favorites, favoritesPV, favoritePositionsIsLoading,
    favoritePositionsHasErrored, bidList, onSortChange } = this.props;
    const positions = this.getPositions();
    let options = [{ title: 'All Favorites', value: TYPE_ALL, numerator: favorites.length + favoritesPV.length }];
    if (getUsePV()) {
      options = [
        ...options,
        { title: 'Open Positions', value: TYPE_OPEN, numerator: favorites.length },
        { title: 'Projected Vacancies', value: TYPE_PV, numerator: favoritesPV.length },
      ];
    }
    let selectOptions$ = POSITION_SEARCH_SORTS_DYNAMIC;
    if (selected === TYPE_PV) {
      selectOptions$ = filterPVSorts(selectOptions$);
    }
    selectOptions$ = selectOptions$.options;
    return (
      <div className={`usa-grid-full favorite-positions-container profile-content-inner-container ${favoritePositionsIsLoading ? 'results-loading' : ''}`}>
        <div className="usa-grid-full favorites-top-section">
          <div className="favorites-title-container">
            <ProfileSectionTitle title="Favorites" icon="star" />
          </div>
        </div>
        <Nav
          options={options}
          onClick={s => this.setState({ selected: s })}
          selected={this.state.selected}
          denominator={favorites.length + favoritesPV.length}
        />
        <div className="usa-grid-full favorites-top-section">
          <div className="results-dropdown results-dropdown-sort">
            <SelectForm
              id="sort"
              label="Sort by:"
              onSelectOption={onSortChange}
              options={selectOptions$}
              disabled={favoritePositionsIsLoading}
            />
          </div>
        </div>
        {
          favoritePositionsIsLoading && !favoritePositionsHasErrored &&
            <Spinner type="homepage-position-results" size="big" />
        }
        {
          !favoritePositionsIsLoading && !favorites.length && !favoritesPV.length &&
            <NoFavorites />
        }
        <HomePagePositionsList
          positions={positions}
          favorites={favorites}
          favoritesPV={favoritesPV}
          bidList={bidList}
          title="favorites"
          maxLength={300}
          refreshFavorites
          showBidListButton
          useShortFavButton
          showCompareButton
        />
      </div>
    );
  }
}

FavoritePositions.propTypes = {
  favorites: FAVORITE_POSITIONS_ARRAY,
  favoritesPV: FAVORITE_POSITIONS_ARRAY,
  favoritePositionsIsLoading: PropTypes.bool.isRequired,
  favoritePositionsHasErrored: PropTypes.bool.isRequired,
  bidList: BID_RESULTS.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

FavoritePositions.defaultProps = {
  favorites: [],
  favoritesPV: [],
};

export default FavoritePositions;
