import { shallow } from 'enzyme';
import InBidList from './InBidList';
import toJSON from 'enzyme-to-json';

describe('InBidListComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<InBidList />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<InBidList />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
