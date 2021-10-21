import { shallow } from 'enzyme';
import ServiceNeedDifferential from './ServiceNeedDifferential';
import toJSON from 'enzyme-to-json';


describe('ServiceNeedDifferentialComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<ServiceNeedDifferential shortName />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<ServiceNeedDifferential />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
