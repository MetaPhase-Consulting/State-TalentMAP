import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import HistDiffToStaff from './HistDiffToStaff';

describe('HistDiffToStaffComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<HistDiffToStaff shortName />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<HistDiffToStaff />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
