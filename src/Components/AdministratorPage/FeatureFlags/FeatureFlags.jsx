import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { JsonEditor as Editor } from 'jsoneditor-react';
import PermissionsWrapper from 'Containers/PermissionsWrapper';
import { EMPTY_FUNCTION, USER_PROFILE } from 'Constants/PropTypes';
import { DEFAULT_USER_PROFILE } from 'Constants/DefaultProps';
import { userHasPermissions } from 'utilities';
import { postFeatureFlagsData } from 'actions/featureFlags';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import Spinner from '../../Spinner';

class FeatureFlags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feature_flags: props.featureFlags,
    };
  }

  handleChange = d => {
    this.setState({ feature_flags: d });
  };

  submitData = () => {
    // eslint-disable-next-line max-len
    if (Object.keys(this.state.feature_flags).length !== 0 && this.state.feature_flags.constructor === Object) {
      this.props.postData(this.state.feature_flags);
    }
  };

  render() {
    const {
      userProfile,
      featureFlagsHasErrored,
      featureFlagsIsLoading,
      featureFlags,
    } = this.props;

    const featureFlagsSuccess = !featureFlagsIsLoading && !featureFlagsHasErrored;

    const isSuperUser = userHasPermissions(['superuser'], userProfile.permission_groups);
    return (
      <div
        className={`usa-grid-full profile-content-inner-container administrator-page
        ${(featureFlagsIsLoading) ? 'results-loading' : ''}`}
      >
        {
          featureFlagsIsLoading && !featureFlagsHasErrored &&
            <Spinner type="homepage-position-results" size="big" />
        }
        <div className="usa-grid-full">
          <ProfileSectionTitle title="Feature Flags" icon="flag" />
        </div>

        { featureFlagsSuccess && isSuperUser ?
          <PermissionsWrapper permissions="superuser">
            <Editor
              value={featureFlags}
              onChange={this.handleChange}
            />
            <button name="Submit" className="usa-button" onClick={this.submitData}>Submit</button>
          </PermissionsWrapper>
          :
          <div>
            {
              Object.keys(featureFlags).map(k =>
                (<div key={k}>{k}:{featureFlags[k].toString()}</div>))
            }
          </div>
        }
      </div>
    );
  }
}

FeatureFlags.propTypes = {
  userProfile: USER_PROFILE,
  featureFlagsHasErrored: PropTypes.bool,
  featureFlagsIsLoading: PropTypes.bool,
  featureFlags: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  postData: EMPTY_FUNCTION,
};

FeatureFlags.defaultProps = {
  userProfile: DEFAULT_USER_PROFILE,
  featureFlagsHasErrored: false,
  featureFlagsIsLoading: false,
  featureFlags: {},
  postData: EMPTY_FUNCTION,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile,
  featureFlagsHasErrored: state.featureFlagsHasErrored,
  featureFlagsIsLoading: state.featureFlagsIsLoading,
});

export const mapDispatchToProps = dispatch => ({
  postData: data => dispatch(postFeatureFlagsData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeatureFlags);
