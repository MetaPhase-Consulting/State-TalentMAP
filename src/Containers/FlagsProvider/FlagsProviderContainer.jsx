import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';
import FlagsProvider from './FlagsProvider';
import { mapFlags } from '../../flags';
import { userProfileFetchData } from '../../actions/userProfile';
import BASE_FLAGS from './constants';

class Flags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flags: BASE_FLAGS,
    };
  }

  componentWillMount() {
    if (this.props.isAuthorized()) {
      this.props.fetchUserProfile();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userProfile.id) {
      this.mapFlags(nextProps.userProfile);
    }
  }

  mapFlags(userProfile) {
    const flags = mapFlags(userProfile);

    if (!isEqual(this.state.flags, flags)) {
      this.setState({ flags });
    }
  }

  render() {
    const { children, userProfile } = this.props;
    return (
      <FlagsProvider flags={this.state.flags} userProfile={userProfile}>
        {userProfile.id && children}
      </FlagsProvider>
    );
  }
}

Flags.propTypes = {
  children: PropTypes.node.isRequired,
  userProfile: PropTypes.shape({ id: PropTypes.number }),
  isAuthorized: PropTypes.func.isRequired,
  fetchUserProfile: PropTypes.func.isRequired,
};

Flags.defaultProps = {
  children: false,
  userProfile: {},
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
});

const mapDispatchToProps = dispatch => ({
  fetchUserProfile: () => dispatch(userProfileFetchData()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Flags));
