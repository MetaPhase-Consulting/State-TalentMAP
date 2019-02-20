import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { USER_PROFILE } from '../../Constants/PropTypes';
import { DEFAULT_USER_PROFILE } from '../../Constants/DefaultProps';
import { userHasPermissions } from '../../utilities';

export class PermissionsWrapper extends Component {
  constructor(props) {
    super(props);
    this.checkPermissions = this.checkPermissions.bind(this);
  }

  checkPermissions() {
    const { isLoading, permissions, userProfile } = this.props;
    const isEmpty = !permissions.length;
    const permissions$ = typeof permissions === 'string' ? [permissions] : permissions;
    const doesUserHavePermissions =
      isEmpty || userHasPermissions(permissions$, userProfile.permission_groups || []);
    if (!isLoading) {
      return doesUserHavePermissions;
    }
    return false;
  }

  render() {
    const { children, fallback } = this.props;
    const hasPermissions = this.checkPermissions();
    return (
      hasPermissions ? children : fallback
    );
  }
}

PermissionsWrapper.propTypes = {
  userProfile: USER_PROFILE,
  isLoading: PropTypes.bool,
  permissions: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.string), PropTypes.string],
  ), // permissions to check exist
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]).isRequired,
  fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
};

PermissionsWrapper.defaultProps = {
  isLoading: true,
  userProfile: DEFAULT_USER_PROFILE,
  permissions: [],
  fallback: null,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
  isLoading: state.userProfileIsLoading,
});

export default connect(mapStateToProps)(PermissionsWrapper);
