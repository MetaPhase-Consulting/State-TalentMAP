import { shallow } from 'enzyme';
import PositionManagerBidders from './PositionManagerBidders';

describe('PositionManagerBidders', () => {
  const props = {
    id: 1,
  };

  it('is defined', () => {
    let wrapper = shallow(<PositionManagerBidders {...props} />);
    wrapper = undefined;
    expect(wrapper).toBeDefined();
  });
});
