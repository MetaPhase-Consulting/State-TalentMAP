import React from 'react';
import { get } from 'lodash';
import { USER_PROFILE } from 'Constants/PropTypes';
import { NO_EMAIL, NO_ADDRESS, NO_OFFICE_NUMBER, NO_PERSONAL_NUMBER } from 'Constants/SystemMessages';
import SectionTitle from '../../SectionTitle';
import InformationDataPoint from '../../InformationDataPoint';

const UserProfileContactInformation = ({ userProfile }) => (
  <div className="current-user-section-container">
    <div className="section-padded-inner-container">
      <SectionTitle small title="Contact Information" icon="list-alt" />
      <InformationDataPoint title="Email address" content={get(userProfile, 'user.email', NO_EMAIL)} />
      <InformationDataPoint title="Office number" content={userProfile.user.office_number || NO_OFFICE_NUMBER} />
      <InformationDataPoint
        title="Personal contact number"
        content={userProfile.user.personal_number || NO_PERSONAL_NUMBER}
      />
      <InformationDataPoint
        title="Post/Office address"
        content={userProfile.user.address || NO_ADDRESS}
      />
    </div>
  </div>
);

UserProfileContactInformation.propTypes = {
  userProfile: USER_PROFILE.isRequired,
};

UserProfileContactInformation.defaultProps = {
  showEditLink: true,
};

export default UserProfileContactInformation;
