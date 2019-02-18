import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { get } from 'lodash';
import { comparisonsFetchData } from '../../actions/comparisons';
import { favoritePositionsFetchData } from '../../actions/favoritePositions';
import CompareList from '../../Components/CompareList/CompareList';
import { COMPARE_LIST, POSITION_SEARCH_RESULTS } from '../../Constants/PropTypes';
import { POSITION_RESULTS_OBJECT } from '../../Constants/DefaultProps';
import { LOGIN_REDIRECT } from '../../login/routes';

class Compare extends Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.state = {
      key: 0,
    };
  }

  componentWillMount() {
    if (!this.props.isAuthorized()) {
      this.props.onNavigateTo(LOGIN_REDIRECT);
    } else {
      const ids = get(this, 'props.match.params.ids');
      if (ids) { this.getComparisons(ids); }
      this.props.fetchFavorites();
    }
  }

  onToggle(id) {
    let compareArray = this.props.match.params.ids.split(',');
    compareArray = compareArray.filter(f => f !== id);
    const compareString = compareArray.toString();
    this.props.onNavigateTo(`/compare/${compareString}`);
    this.getComparisons(`${compareString}`);
  }

  getComparisons(ids) {
    this.props.fetchData(ids);
  }

  render() {
    const { comparisons, hasErrored, isLoading, favoritePositions } = this.props;
    return (
      <CompareList
        compare={comparisons}
        favorites={favoritePositions}
        hasErrored={hasErrored}
        isLoading={isLoading}
        onToggle={this.onToggle}
      />
    );
  }
}

Compare.propTypes = {
  onNavigateTo: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      ids: PropTypes.string,
    }),
  }).isRequired,
  fetchData: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  comparisons: COMPARE_LIST,
  isAuthorized: PropTypes.func.isRequired,
  favoritePositions: POSITION_SEARCH_RESULTS,
  fetchFavorites: PropTypes.func.isRequired,
};

Compare.defaultProps = {
  comparisons: [],
  hasErrored: false,
  isLoading: true,
  favoritePositions: POSITION_RESULTS_OBJECT,
};

Compare.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = state => ({
  comparisons: state.comparisons,
  hasErrored: state.comparisonsHasErrored,
  isLoading: state.comparisonsIsLoading,
  favoritePositions: state.favoritePositions,
});

export const mapDispatchToProps = dispatch => ({
  fetchData: url => dispatch(comparisonsFetchData(url)),
  onNavigateTo: dest => dispatch(push(dest)),
  fetchFavorites: () => dispatch(favoritePositionsFetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Compare));
