import PropTypes from 'prop-types';

const RemarksPill = props => {
  const { fakeRemark } = props;
  return (
    <div className="remarks-pill-container" style={{ backgroundColor: fakeRemark.color }}>
      {fakeRemark.remark}
    </div>
  );
};

RemarksPill.propTypes = {
  fakeRemark: PropTypes.arrayOf(PropTypes.shape({})),
};


RemarksPill.defaultProps = {
  fakeRemark: [],
};

export default RemarksPill;
