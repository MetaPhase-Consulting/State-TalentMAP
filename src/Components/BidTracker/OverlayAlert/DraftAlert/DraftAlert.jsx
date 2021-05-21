import { Component } from 'react';
import StaticDevContent from 'Components/StaticDevContent';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { BID_OBJECT } from 'Constants/PropTypes';
import { NO_GRADE, NO_POST, NO_SKILL } from 'Constants/SystemMessages';
import { formatDate, getPostName } from 'utilities';

class DraftAlert extends Component {
  onSubmitBid = () => {
    const { submitBid, bid } = this.props;
    submitBid(bid.position_info.id);
  };

  render() {
    const { bid } = this.props;
    const { readOnly } = this.context;
    const { position_info } = bid;
    const positionTitle = position_info.title;
    const post = getPostName(position_info.post, NO_POST);
    const skillCode = position_info.skill ? position_info.skill : NO_SKILL;
    const grade = position_info.grade ? position_info.grade : NO_GRADE;
    const ted = formatDate('2020-07-02T05:00:00Z');
    // const ted = position.bid.ted ? formatDate(position.bid.ted) : NO_TOUR_END_DATE;
    // modify line 6: import NO_TOUR_END_DATE from SystemMessages
    return (
      <div className="bid-tracker-alert-container bid-tracker-alert-container--draft">
        <div className="usa-grid-full" style={{ display: 'flex' }}>
          <div className="draft-submission-container" style={{ flex: 1 }}>
            <div className="sub-submission-text">
              { readOnly ?
                'This bid is in draft' :
                'Would you like to submit your bid?'
              }
            </div>
            <div className="usa-grid-full draft-submission-buttons-container">
              {
                !readOnly &&
                  <button
                    className="tm-button-transparent tm-button-submit-bid"
                    onClick={this.onSubmitBid}
                  >
                    <FontAwesome name="paper-plane-o" /> Submit Bid
                  </button>
              }
            </div>
          </div>
          <div className="draft-position-details" style={{ flex: 1 }}>
            <div>
              {positionTitle}
            </div>
            <div>
              <span className="title">Location: </span>
              {post}
            </div>
            <div>
              <StaticDevContent>
                <span className="title">TED: </span>
                {ted}
              </StaticDevContent>
            </div>
            <div>
              <span className="title">Skill: </span>
              {skillCode}
            </div>
            <div>
              <span className="title">Grade: </span>
              {grade}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DraftAlert.contextTypes = {
  readOnly: PropTypes.bool,
};

DraftAlert.propTypes = {
  bid: BID_OBJECT.isRequired,
  submitBid: PropTypes.func.isRequired,
};

export default DraftAlert;
