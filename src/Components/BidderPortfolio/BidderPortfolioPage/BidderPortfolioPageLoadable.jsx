import React from 'react';
import createLoader from '../../Loadable';

export const path = () => import('./BidderPortfolioPage');

const BidderPortfolio = createLoader({ path, shouldPreload: false, useAnimation: false });

const BidderPortfolioLoadable = ({ ...rest }) => (
  <BidderPortfolio {...rest} />
);

export default BidderPortfolioLoadable;
