import PropTypes from 'prop-types';

const RemarksPill = props => {
  const { remark } = props;
  return (
    <div className="remarks-pill-container" style={{ backgroundColor: remark.color }}>
      {remark.remark}
    </div>
  );
};

RemarksPill.propTypes = {
  remark: PropTypes.arrayOf(PropTypes.shape({})),
};


RemarksPill.defaultProps = {
  remark: [],
};

export default RemarksPill;
