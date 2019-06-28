import React from 'react';
import Ribbon from '../Ribbon';

const Featured = ({ ...props }) => (
  <Ribbon icon="bolt" text="Featured" type="tertiary" {...props} />
);

export default Featured;
