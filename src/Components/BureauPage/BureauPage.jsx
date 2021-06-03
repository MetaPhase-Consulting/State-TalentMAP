import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import AvailableBidderContainer from 'Components/AvailableBidder/AvailableBidderContainer';
import Dashboard from './Dashboard';
import Stats from './Stats';
import PositionManager from './PositionManager';
import CandidateManager from './CandidateManager';
import PositionManagerDetails from './PositionManagerDetails';

const BureauPage = props => {
  const dashboardProps = {
    placeholderText: 'I am the Bureau Dashboard',
  };

  const statsProps = {
    placeholderText: 'I am the Bureau Stats',
  };

  const posManagerProps = {
    isAO: props.isAO,
  };

  return (
    <div className="usa-grid-full profile-content-container">
      <Switch>
        <Route path="/profile/(bureau|ao)/dashboard" render={() => <Dashboard {...dashboardProps} />} />
        <Route path="/profile/(bureau|ao)/stats" render={() => <Stats {...statsProps} />} />
        <Route path="/profile/(bureau|ao)/positionmanager/:type/:id" render={() => <PositionManagerDetails />} />
        <Route path="/profile/(bureau|ao)/positionmanager" render={() => <PositionManager {...posManagerProps} />} />
        <Route path="/profile/(bureau|ao)/candidatemanager" render={() => <CandidateManager />} />
        <Route path="/profile/(bureau|ao)/availablebidders" render={() => <AvailableBidderContainer isCDO={false} />} />
      </Switch>
    </div>
  );
};

BureauPage.propTypes = {
  isAO: PropTypes.bool,
};

BureauPage.defaultProps = {
  isAO: false,
};

export default BureauPage;
