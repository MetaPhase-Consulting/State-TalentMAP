import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import RemarksPill from './RemarksPill';

describe('RemarksPill', () => {
  const props = [{
    remark: 'Opts for SND',
    color: '#F07011',
    key: 1,
  }];

  it('is defined', () => {
    const wrapper = shallow(<RemarksPill />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<RemarksPill />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when remarks are provided', () => {
    const wrapper = shallow(<RemarksPill {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
