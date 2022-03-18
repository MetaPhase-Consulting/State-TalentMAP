/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { get } from 'lodash';
// import { Link } from 'react-router-dom';
import {
  NO_ASSIGNMENT_STATUS,
  NO_ASSIGNMENT_TOD_DESC,
  NO_LANGUAGES,
  NO_POSITION_NUMBER,
  NO_POST,
  NO_SKILL,
} from 'Constants/SystemMessages';
import { POSITION_DETAILS } from 'Constants/PropTypes';
import { formatDate, getPostName } from '../../../../../utilities';
import StartEnd from '../../../PositionInformation/StartEnd';


const AssignmentsContent = ({ assignment }) => (
  // TO-DO:
  // integrate fully with new EP
  // once data is coming through
  [assignment].map(a =>
    (<div className="usa-grid-full bid-content-container">
      <div className="bid-list-card-title-lg">
        {/* <span className="bid-list-card-title-post">{get(assignment, 'position.title')} </span> */}
        <span className="bid-list-card-title-post">{get(assignment, 'position.title', 'POSITION TITLE: Coming soon')} </span>
      </div>
      <div>
        <span className="usa-sr-only">Position number: </span>
        <span className="bid-list-card-title-post bid-list-card-title-lg">
          {
            get(a, 'asg_pos_seq_num') ?
              `(${get(a, 'asg_pos_seq_num')}) ` : NO_POSITION_NUMBER
          }
        </span>
        {/* <Link to={`/archived/${get(assignment, 'position.position_id')}`}>View Position</Link> */}
      </div>
      <div>
        <span className="bid-list-card-title-post">Location: </span>
        {/* {getPostName(get(assignment, 'position.post', NO_POST))} */}
        {'Coming Soon'}
      </div>
      <div>
        <span className="bid-list-card-title-post">Skill: </span>
        {/* {get(assignment, 'position.skill', NO_SKILL)} */}
        {'Coming Soon'}
      </div>
      <div>
        <span className="bid-list-card-title-post">Language: </span>
        {/* {get(assignment, 'position.language', NO_LANGUAGES)} */}
        {'Coming Soon'}
      </div>
      <div>
        <span className="bid-list-card-title-post">Status: </span>
        {get(a, 'asgs_code', NO_ASSIGNMENT_STATUS)}
      </div>
      <div>
        <span className="bid-list-card-title-post">TOD Description: </span>
        {get(a, 'asgd_tod_desc_text', NO_ASSIGNMENT_TOD_DESC)}
      </div>
      <div>
        <span className="bid-list-card-title-post">Start date and End date: </span>
        <StartEnd
          start={formatDate(get(a, 'asgd_eta_date'))}
          end={formatDate(get(a, 'asgd_etd_ted_date'))}
        />
      </div>
    </div>),
  )
);

AssignmentsContent.propTypes = {
  assignment: POSITION_DETAILS.isRequired,
};


export default AssignmentsContent;
