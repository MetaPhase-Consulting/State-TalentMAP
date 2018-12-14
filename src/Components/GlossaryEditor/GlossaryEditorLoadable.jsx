import React from 'react';
import createLoader from '../Loadable';

export const path = () => import('./GlossaryEditorPage');

const GlossaryEditor = createLoader({ path, shouldPreload: false, useAnimation: false });

const GlossaryEditorLoadable = ({ ...rest }) => (
  <GlossaryEditor {...rest} />
);

export default GlossaryEditorLoadable;
