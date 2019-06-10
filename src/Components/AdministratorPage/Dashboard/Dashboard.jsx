import React from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import { Link } from 'react-router-dom';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import Spinner from '../../Spinner';
import { Row, Column } from '../../Layout';
import DataSync from './DataSync';
import LinkButton from '../../LinkButton';
import MediaQueryWrapper from '../../MediaQuery';
import { EMPTY_FUNCTION } from '../../../Constants/PropTypes';

const AdministratorPage = (props) => {
  const {
    isLoading,
    syncJobs,
    syncJobsIsLoading,
    runAllJobs,
  } = props;

  const getLink = (link, title) => (
    <Row className="usa-grid-full content-link-row">
      <Link to={link}>{title} <FA name="external-link" /></Link>
    </Row>
  );

  return (
    <div
      className={`usa-grid-full profile-content-inner-container administrator-page
      ${(isLoading) ? 'results-loading' : ''}`}
    >
      {
        isLoading &&
          <Spinner type="homepage-position-results" size="big" />
      }
      <div className="usa-grid-full">
        <ProfileSectionTitle title="Administrator Dashboard" icon="dashboard" />
      </div>
      <div className="usa-grid-full">
        <Row className="usa-grid-full">
          <MediaQueryWrapper breakpoint="screenLgMin" widthType="max">
            {
              (matches) => {
                let columns = [12, 12, 12];
                if (!matches) { columns = [5, 4, 3]; }
                return (
                  <div>
                    <Column
                      columns={columns[0]}
                    >
                      <div className="usa-width-one-whole section no-padding">
                        <DataSync
                          syncJobs={syncJobs}
                          isLoading={syncJobsIsLoading}
                          runAllJobs={runAllJobs}
                        />
                        <div className="usa-grid-full padding-section button-container">
                          <LinkButton className="unstyled-button" toLink="/profile/administrator/logs">Review Logs</LinkButton>
                        </div>
                      </div>
                    </Column>
                    <Column
                      columns={columns[1]}
                    >
                      <div className="usa-width-one-whole section">
                        <h3>Editable Content Areas</h3>
                        <Column className="content-link-container">
                          {getLink('/', 'Header')}
                          {getLink('/about', 'About')}
                          {getLink('/results', 'Featured Positions')}
                          {getLink('/profile/glossaryeditor/', 'Glossary')}
                        </Column>
                      </div>
                    </Column>
                  </div>
                );
              }
            }
          </MediaQueryWrapper>
        </Row>
      </div>
    </div>
  );
};

AdministratorPage.propTypes = {
  isLoading: PropTypes.bool,
  syncJobs: PropTypes.arrayOf(PropTypes.shape({})),
  syncJobsIsLoading: PropTypes.bool,
  runAllJobs: PropTypes.func,
};

AdministratorPage.defaultProps = {
  isLoading: false,
  syncJobs: [],
  syncJobsIsLoading: false,
  runAllJobs: EMPTY_FUNCTION,
};

export default AdministratorPage;
