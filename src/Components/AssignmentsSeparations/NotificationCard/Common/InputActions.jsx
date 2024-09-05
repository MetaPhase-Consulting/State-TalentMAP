import PropTypes from 'prop-types';

const InputActions = (props) => {
  const { keys, modCableValue, getCableValue } = props;

  const handleDefault = () => {
    modCableValue(keys, '');
  };

  const handleClear = () => {
    modCableValue(keys, '', true);
  };

  const isDefault = () => {
    let def = true;
    keys.forEach(key => {
      const value = getCableValue(key, true);
      if ((value?.NME_OVERRIDE_CLOB !== '' && value?.NME_CLEAR_IND === 'N') || value?.NME_CLEAR_IND === 'Y') {
        def = false;
      }
    });
    return def;
  };

  const isClear = () => {
    let clear = true;
    keys.forEach(key => {
      const value = getCableValue(key, true);
      if (value?.NME_CLEAR_IND === 'N') {
        clear = false;
      }
    });
    return clear;
  };

  return (
    <div className="input-actions">
      <div>
        <input
          type="radio"
          id="default"
          name="default"
          checked={isDefault()}
          onChange={() => handleDefault()}
        />
        <label htmlFor="default">Default</label>
      </div>
      <div>
        <input
          type="radio"
          id="clear"
          name="clear"
          checked={isClear()}
          onChange={() => handleClear()}
        />
        <label htmlFor="clear">Clear All</label>
      </div>
    </div>
  );
};

InputActions.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  getCableValue: PropTypes.func.isRequired,
  modCableValue: PropTypes.func.isRequired,
};

InputActions.defaultProps = {
};

export default InputActions;
