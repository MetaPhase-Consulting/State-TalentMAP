import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FA from 'react-fontawesome';
import ExportButton from 'Components/ExportButton';
import PermissionsWrapper from 'Containers/PermissionsWrapper';
import { shortListLockFetchData, shortListLockUpdateData } from 'actions/shortListLock';

class PositionManagerDetails extends Component {
  UNSAFE_componentWillMount() {
    const { id, getStatus } = this.props;
    getStatus(id);
  }

  updateStatus = () => {
    const { id, updateStatus, statusIsLoading, statusUpdateIsLoading, status } = this.props;
    if (id && !statusIsLoading && !statusUpdateIsLoading) {
      updateStatus(!status);
    }
  }

  render() {
    const { status, statusIsLoading, statusUpdateIsLoading, statusUpdateHasErrored,
      statusHasErrored, id } = this.props;
    const isLoading = statusIsLoading || statusUpdateIsLoading;
    let text = 'Lock';
    let disabled = false;
    if (status) {
      text = 'Unlock';
    }
    if (statusHasErrored || statusUpdateHasErrored) {
      disabled = true;
      text = statusHasErrored || statusUpdateHasErrored;
    }
    if (statusUpdateIsLoading) {
      text = 'Updating...';
    }
    if (statusIsLoading) {
      disabled = true;
      text = 'Loading...';
    }
    const content = <span>{text} { !isLoading && <FA name={status ? 'unlock' : 'lock'} /> }</span>;
    return (
      <PermissionsWrapper permissions="bureau_user">
        {
          id ? <ExportButton isLoading={isLoading} primaryClass="usa-button-primary bureau-lock-button" text={content} onClick={this.updateStatus} disabled={disabled} /> : null
        }
      </PermissionsWrapper>
    );
  }
}

PositionManagerDetails.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.bool.isRequired,
  statusIsLoading: PropTypes.bool,
  statusHasErrored: PropTypes.string,
  statusUpdateIsLoading: PropTypes.bool,
  statusUpdateHasErrored: PropTypes.string,
  updateStatus: PropTypes.func.isRequired,
  getStatus: PropTypes.func.isRequired,
};

PositionManagerDetails.defaultProps = {
  statusIsLoading: false,
  statusHasErrored: '',
  statusUpdateIsLoading: false,
  statusUpdateHasErrored: '',
};

const mapStateToProps = (state) => ({
  status: state.shortListLock,

  statusIsLoading: state.shortListLockIsLoading,
  statusHasErrored: state.shortListLockHasErrored,

  statusUpdateIsLoading: state.shortListLockUpdateIsLoading,
  statusUpdateHasErrored: state.shortListLockUpdateHasErrored,
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  getStatus: (id) => dispatch(shortListLockFetchData(id)),
  updateStatus: (status) => dispatch(shortListLockUpdateData(ownProps.id, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionManagerDetails);
