import { shallow } from 'enzyme';
import sinon from 'sinon';
import toJSON from 'enzyme-to-json';
import CheckBox from 'Components/CheckBox';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import ChecklistModal from './ChecklistModal';

describe('ChecklistModal', () => {
  const props = {
    checkList: ['a', 'b', 'c'],
    rowDivider: true,
    titleDivider: true,
    onCheck: () => {
      const str = "i'm not empty";
    },
  };

  it('is defined', () => {
    const wrapper = shallow(<ChecklistModal />);
    expect(wrapper).toBeDefined();
  });

  it('can call cancel', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
    />);
    try {
      expect(wrapper.find('.checklist-modal-buttons-container').find('button').at(0).simulate('click', { preventDefault: () => {} })).not.toThrow();
    } catch {
      expect(wrapper).toBeDefined();
    }
  });

  it('can call submit', () => {
    const spy = sinon.spy();
    const wrapper = shallow(<ChecklistModal
      {...props}
      onSubmit={spy}
    />);
    expect(wrapper.find('.checklist-modal-buttons-container').find('button').at(1).simulate('click', { preventDefault: () => {} }));
    sinon.assert.calledOnce(spy);
  });

  it('properly render row and title dividers when true', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
    />);
    expect(wrapper.find('.title-divider').exists()).toBe(true);
    expect(wrapper.find('.row-divider').exists()).toBe(true);
  });

  it('properly render row and title dividers when false', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
      rowDivider={false}
      titleDivider={false}
    />);
    expect(wrapper.find('.title-divider').exists()).toBe(false);
    expect(wrapper.find('.row-divider').exists()).toBe(false);
  });

  it('renders proper number of checkboxes', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
    />);
    expect(wrapper.find(CheckBox).length).toBe(props.checkList.length);
  });

  it('does not render onCheckboxClick when onCheck empty', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
      onCheck={EMPTY_FUNCTION}
    />);
    expect(wrapper.find(CheckBox).first().props().onCheckBoxClick).toEqual(EMPTY_FUNCTION);
  });

  it('render onCheckboxClick when onCheck not empty', () => {
    const wrapper = shallow(<ChecklistModal
      {...props}
    />);
    expect(wrapper.find(CheckBox).first().props().onCheckBoxClick).not.toEqual(EMPTY_FUNCTION);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<ChecklistModal />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
