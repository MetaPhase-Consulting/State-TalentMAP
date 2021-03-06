import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import PillList from './PillList';
import items from '../../__mocks__/pillList';

describe('PillListComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<PillList
      items={items}
      onPillClick={() => {}}
    />);
    expect(wrapper).toBeDefined();
  });

  it('can take different props', () => {
    const wrapper = shallow(<PillList
      items={items}
      onPillClick={() => {}}
    />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<PillList
      items={items}
      onPillClick={() => {}}
    />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
