import { Component } from 'react';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import { USER_PROFILE } from 'Constants/PropTypes';
import { DEFAULT_USER_PROFILE } from 'Constants/DefaultProps';
import PanelAdministratorPage from '../../Components/PanelAdministratorPage';

class PanelAdministratorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getIsPanelAdmin() {
    return includes(this.props.userProfile.permission_groups, 'panel_admin');
  }

  render() {
    return (
      <PanelAdministratorPage isPost={this.getIsPanelAdmin()} />
    );
  }
}

PanelAdministratorContainer.propTypes = {
  userProfile: USER_PROFILE,
};

PanelAdministratorContainer.defaultProps = {
  userProfile: DEFAULT_USER_PROFILE,
};

const mapStateToProps = (state) => ({
  userProfile: state.userProfile,
});

export default connect(mapStateToProps, null)(PanelAdministratorContainer);
