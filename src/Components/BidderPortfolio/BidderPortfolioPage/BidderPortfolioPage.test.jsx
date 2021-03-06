import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import BidderPortfolioPage from './BidderPortfolioPage';
import bidderListObject from '../../../__mocks__/bidderListObject';
import bidderPortfolioCountsObject from '../../../__mocks__/bidderPortfolioCountsObject';

describe('BidderPortfolioPageComponent', () => {
  const props = {
    bidderPortfolio: bidderListObject,
    bidderPortfolioIsLoading: false,
    bidderPortfolioHasErrored: false,
    pageSize: 8,
    queryParamUpdate: () => {},
    pageNumber: 1,
    bidderPortfolioCounts: bidderPortfolioCountsObject,
    defaultHandshake: '',
    defaultOrdering: '',
    classificationsIsLoading: false,
    classificationsHasErrored: false,
  };

  it('is defined', () => {
    const wrapper = shallow(<BidderPortfolioPage {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('is defined when navDataIsLoading === true', () => {
    const wrapper = shallow(<BidderPortfolioPage {...props} navDataIsLoading />);
    expect(wrapper).toBeDefined();
  });

  it('sets state when changeEditType() is called', () => {
    const wrapper = shallow(<BidderPortfolioPage {...props} />);
    const setTo = 3;
    wrapper.instance().changeEditType(setTo);
    expect(wrapper.instance().state.editType).toBe(setTo);
  });

  it('can set state by calling the changeViewType function', () => {
    const wrapper = shallow(<BidderPortfolioPage {...props} />);
    expect(wrapper.instance().state.viewType.value).toBe('card');
    wrapper.instance().changeViewType('grid');
    expect(wrapper.instance().state.viewType.value).toBe('grid');
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<BidderPortfolioPage {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
