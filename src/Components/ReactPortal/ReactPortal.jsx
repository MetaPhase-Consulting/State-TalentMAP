import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ReactPortal = ({ children, wrapperId }) => {
  const [wrapper, setWrapper] = useState(null);

  useLayoutEffect(() => {
    let el = document.getElementById(wrapperId);
    let isCreated = false;
    if (!el) {
      isCreated = true;
      const defaultWrapper = document.createElement('div');
      defaultWrapper.setAttribute('id', wrapperId);
      document.body.appendChild(defaultWrapper);
      el = defaultWrapper;
    }
    setWrapper(el);

    return () => {
      if (isCreated && el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [wrapperId]);

  if (wrapper === null) return null;

  return createPortal(children, wrapper);
};

export default ReactPortal;
