import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { userProfileToggleFavoritePosition } from '../../actions/userProfile';
import Favorite from '../../Components/Favorite';
import { SetType } from '../../Constants/PropTypes';

const FavoriteContainer = ({
  onToggle,
  isLoading,
  hasErrored,
  refKey,
  sortType,
  limit,
  page,
  ...rest }) => (
  <Favorite
    onToggle={onToggle}
    isLoading={!!isLoading.has(refKey)}
    hasErrored={hasErrored}
    refKey={refKey}
    {...rest}
  />
);

FavoriteContainer.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isLoading: SetType,
  hasErrored: PropTypes.bool.isRequired,
  refKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string.isRequired]).isRequired,
  isPV: PropTypes.bool,
  sortType: PropTypes.string.isRequired,
  limit: PropTypes.number,
  page: PropTypes.number,
};

FavoriteContainer.defaultProps = {
  isLoading: new Set(),
  isPV: false,
  limit: 15,
  page: 1,
};

export const mapStateToProps = state => ({
  isLoading: state.userProfileFavoritePositionIsLoading,
  hasErrored: state.userProfileFavoritePositionHasErrored || false,
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onToggle: (id, remove, refresh = false) => {
    dispatch(userProfileToggleFavoritePosition(id, remove, refresh, get(ownProps, 'isPV'), get(ownProps, 'sortType'), get(ownProps, 'limit'), get(ownProps, 'page')));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteContainer);
