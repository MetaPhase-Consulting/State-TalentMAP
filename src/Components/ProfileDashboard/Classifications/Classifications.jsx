import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import { useState } from 'react';
import SectionTitle from '../SectionTitle';
import CheckboxList from '../../BidderPortfolio/CheckboxList';
import { CLASSIFICATIONS, CLIENT_CLASSIFICATIONS } from '../../../Constants/PropTypes';
import TestComp from '../../ProfileDashboard/TestComp/TestComp';

// function here
// hook syntax
const Classifications = props => {
  // Props
  const {
    classifications,
    clientClassifications,
    isLoading,
  } = props;

  const [compHidden, setCompHidden] = useState(true);

  // const toggleHideComp = () =>
  //   setCompHidden(false);
  //   // console.log(test);
  //   // this should hide

  const setHideComp = (abcArray) => {
    // this is my hideComp
    // throttledTextInput(q);
    // toggleHideComp();
    // abcArray.push(4);
    console.log('step #2');
    // console.log(abcArray);
    setCompHidden(abcArray);
  };

  // const Classifications = ({ classifications, clientClassifications, isLoading, showComp }) => (
  return (
    <div className="usa-grid-full profile-section-container updates-container">
      <div className="usa-grid-full section-padded-inner-container">
        <div className="usa-width-one-whole">
          <SectionTitle title="Bidder Classifications" icon="tasks" />
        </div>
        <div className="usa-width-one-whole">
          <CheckboxList
            list={classifications}
            clientClassifications={clientClassifications}
            id="updates"
          />
        </div>
      </div>
      {
        !isLoading &&
        <div className="section-padded-inner-container small-link-container view-more-link-centered">
          { compHidden.toString() }
          <FA
            name="pencil"
            // pencil always shows comp
            onClick={() => setCompHidden(false)}
            // onClick={() => setCompHidden(!compHidden)}
            // onClick={setHideComp}
            // onClick={() => this.setState({ showComp: !showComp })}
          // add function for toggle
          // onClick={this.showComp}
          /> Edit Classifications
        </div>
      }
      {
        !compHidden && (
          <div className="section-padded-inner-container small-link-container view-more-link-centered" >
            <TestComp
              abcTest={(abcArray) => setHideComp(abcArray)}
              abcVar={compHidden}
            />
            {/* <TestComp test={this.showComp} /> */}
            {/* // onClick={setHideComp} */}
            {/* follow position manger search */}
            {/* onClick{() => setHideComp(false)} */}
          </div>
        )
      }
    </div>
  );
};

Classifications.propTypes = {
  classifications: CLASSIFICATIONS,
  clientClassifications: CLIENT_CLASSIFICATIONS,
  isLoading: PropTypes.bool,
};

Classifications.defaultProps = {
  classifications: [],
  clientClassifications: [],
  isLoading: false,
};

export default Classifications;
