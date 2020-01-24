import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Accordion, AccordionItem } from 'Components/Accordion';
import { BIDDER_RESULTS } from '../../../Constants/PropTypes';
import BidderPortfolioStatRow from '../BidderPortfolioStatRow';

class BidderPortfolioGridList extends Component {
  constructor(props) {
    super(props);
    this.updateFromAcc = this.updateFromAcc.bind(this);
    this.accordionToggleAll = this.accordionToggleAll.bind(this);
    this.state = {
      allExpanded: true,
    };
  }

  updateFromAcc(newState) {
    // i need to send this function to Accordion
    // Accordion should return the updated state
    this.setState({ allExpanded: newState });
  }

  accordionToggleAll() {
    const toggleFromAcc = this.accordionFunc.toggle();
    this.setState({ allExpanded: toggleFromAcc });
  }

  render() {
    const { results, showEdit } = this.props;
    let expandText = 'Expand All';
    let expandIcon = 'plus';
    if (this.state.allExpanded) {
      expandText = 'Collapse All';
      expandIcon = 'minus';
    }

    return (
      <div>
        <button className="usa-accordion-button-all" title={expandText} onClick={this.accordionToggleAll}>
          <FontAwesome name={expandIcon} /></button>
        <Accordion
          className="usa-grid-full accordion-inverse user-dashboard portfolio-row-list"
          isMultiselectable
          ref={(acc) => { this.accordionFunc = acc; }}
        >
          {
              results.map(result => (
                <AccordionItem
                  className="portfolio-row"
                  id={`${result.id}-row`}
                  key={result.id}
                  title={result.name}
                >
                  <BidderPortfolioStatRow
                    userProfile={result}
                    showEdit={showEdit}
                  />
                </AccordionItem>
              ))
            }
        </Accordion>
      </div>
    );
  }
}

BidderPortfolioGridList.propTypes = {
  results: BIDDER_RESULTS.isRequired,
  showEdit: PropTypes.bool,
};

BidderPortfolioGridList.defaultProps = {
  showEdit: false,
};

export default BidderPortfolioGridList;
