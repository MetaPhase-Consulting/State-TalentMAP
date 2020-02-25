import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DELEGATE_ROLES from 'Constants/DelegateRoles';
import { getUsers } from 'actions/userRoles';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import Spinner from '../../Spinner';
import PaginationWrapper from '../../PaginationWrapper/PaginationWrapper';
import TotalResults from '../../TotalResults';
import UserRow from './UserRow';

class UserRoles extends Component {
  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
    this.state = {
      page: 1,
      range: 100,
    };
  }

  onPageChange({ page }) {
    this.setState({ page });
    this.props.updateUsers(page);
  }

  render() {
    const {
      totalUsers,
      usersList,
      usersIsLoading,
      usersHasErrored,
      modifyPermissionIsLoading,
      tableStats,
    } = this.props;
    const { page, range } = this.state;
    const usersSuccess = !usersIsLoading && !usersHasErrored;
    // eslint-disable-next-line no-return-assign
    tableStats.map(m => (
        DELEGATE_ROLES[m.name].group_id = m.id
    ));

    return (
      <div
        className={`usa-grid-full profile-content-inner-container administrator-page
        ${(usersIsLoading) ? 'results-loading' : ''}`}
      >
        {
            usersIsLoading &&
            <div>
              <Spinner type="homepage-position-results" size="big" />
            </div>
        }
        <div className="usa-grid-full">
          <ProfileSectionTitle title="User Roles" icon="users" />
        </div>
        {
          usersSuccess &&
          <div>
            <div className="usa-grid-full searches-top-section selectUsers" />
            <div className="usa-grid-full total-results">
              <TotalResults total={totalUsers} pageNumber={page} pageSize={range} />
            </div>
            <div className="usa-grid-full">
              {
                usersSuccess &&
                <table className={`delegateRole--table ${modifyPermissionIsLoading ? 'delegate-roles-loading' : ''}`}>
                  <thead>
                    <tr>
                      <th>userName</th>
                      <th>Last, First</th>
                      {Object.keys(DELEGATE_ROLES).map(m => (
                        <th key={DELEGATE_ROLES[m].group_name}>{DELEGATE_ROLES[m].title}</th>
                      ),
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(m => (
                      <UserRow
                        key={m.id}
                        userID={m.id}
                        username={m.username}
                        name={`${m.last_name}, ${m.first_name}`}
                        permissionGroups={m.groups}
                      />
                      ),
                  )}
                  </tbody>
                </table>
              }
            </div>
            <div className="usa-grid-full react-paginate">
              <PaginationWrapper
                totalResults={totalUsers}
                pageSize={range}
                onPageChange={this.onPageChange}
                forcePage={page}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

UserRoles.propTypes = {
  totalUsers: PropTypes.number,
  usersList: PropTypes.arrayOf(PropTypes.shape({})),
  usersIsLoading: PropTypes.bool,
  usersHasErrored: PropTypes.bool,
  modifyPermissionIsLoading: PropTypes.bool,
  tableStats: PropTypes.arrayOf(PropTypes.shape([])),
  updateUsers: PropTypes.func,
};

UserRoles.defaultProps = {
  totalUsers: 0,
  usersList: [],
  usersIsLoading: false,
  usersHasErrored: false,
  modifyPermissionIsLoading: false,
  tableStats: [],
  updateUsers: EMPTY_FUNCTION,
};

const mapStateToProps = state => ({
  usersList: state.usersSuccess.results,
  usersIsLoading: state.usersIsLoading,
  usersHasErrored: state.usersHasErrored,
  modifyPermissionIsLoading: state.modifyPermissionIsLoading,
  tableStats: state.getTableStatsSuccess,
});

export const mapDispatchToProps = dispatch => ({
  updateUsers: (page, limit) => dispatch(getUsers(page, limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRoles);
