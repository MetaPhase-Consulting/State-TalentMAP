import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Handshake from './Handshake';

describe('HandshakeComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<Handshake shortName />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<Handshake />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
