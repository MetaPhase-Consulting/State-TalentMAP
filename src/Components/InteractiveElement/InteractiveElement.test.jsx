import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import sinon from 'sinon';
import InteractiveElement from './InteractiveElement';

describe('InteractiveElementComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(
      <InteractiveElement type="div">text</InteractiveElement>,
    );
    expect(wrapper).toBeDefined();
  });

  it('is defined with arbitrary props', () => {
    const wrapper = shallow(
      <InteractiveElement tabIndex="0" onClick={() => {}} type="div">
        text
      </InteractiveElement>,
    );
    expect(wrapper).toBeDefined();
  });

  it('adds both pre-defined and prop-defined classNames', () => {
    const wrapper = shallow(
      <InteractiveElement className="my-class" onClick={() => {}} type="div">
        text
      </InteractiveElement>,
    );
    expect(wrapper.find('.interactive-element').exists()).toBe(true);
    expect(wrapper.find('.my-class').exists()).toBe(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(
      <InteractiveElement type="span">text</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when type is "div"', () => {
    const wrapper = shallow(
      <InteractiveElement type="div">text</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when type is "a"', () => {
    const wrapper = shallow(
      <InteractiveElement type="a">text</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when type is "submit"', () => {
    const wrapper = shallow(
      <InteractiveElement type="submit">submit!</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when type is "button"', () => {
    const wrapper = shallow(
      <InteractiveElement type="button">a button!</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when type is other', () => {
    const wrapper = shallow(
      <InteractiveElement type="dt">arbitrary element</InteractiveElement>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('handles onClick event', () => {
    const onClickMock = sinon.mock();
    const wrapper = shallow(
      <InteractiveElement type="button" onClick={onClickMock}>
        button
      </InteractiveElement>,
    );
    wrapper.find('button').simulate('keyDown', { keyCode: 12 });
    expect(onClickMock.calledOnce).toBe(false);
    wrapper.find('button').simulate('keyDown', { keyCode: 13 });
    expect(onClickMock.calledOnce).toBe(true);
  });

  it('handle keyDown events when no onClick event provided', () => {
    const keyDownMock = sinon.mock();
    const wrapper = shallow(
      <InteractiveElement type="button" onKeyDown={keyDownMock}>
        button
      </InteractiveElement>,
    );
    wrapper.find('button').simulate('keyDown', { keyCode: 13 });
    expect(keyDownMock.calledOnce).toBe(true);
  });
});
