import { useEffect, useReducer, useRef, useState } from 'react';

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export function useMount(fn, { hook = useEffect } = {}) {
  hook(() => { fn(); return undefined; }, []);
}

export function useUnmount(fn, { hook = useEffect } = {}) {
  hook(() => fn, []);
}

export default function useUpdate(fn, { hook = useEffect } = {}) {
  const mounting = useRef(true);
  hook(() => {
    if (mounting.current) {
      mounting.current = false;
    } else {
      fn();
    }
  });
}

export const dataReducer = (state, action) => {
  switch (action.type) {
    case 'get':
      return { ...state, loading: true };
    case 'success':
      return {
        ...state,
        data: action.payload.data,
        error: null,
        loading: false,
      };
    case 'error':
      return {
        ...state,
        data: null,
        error: action.payload.error,
        loading: false,
      };
    default:
      return state;
  }
};

export const useDataLoader = (getData, ...args) => {
  const [nonce, setNonce] = useState(Date.now());
  const [state, dispatch] = useReducer(dataReducer, {
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancel = false;

    dispatch({ type: 'get' });
    getData(...args)
      .then(data => {
        // eslint-disable-next-line
        !cancel && dispatch({ type: 'success', payload: { data } });
      })
      .catch(error => {
        // eslint-disable-next-line
        !cancel && dispatch({ type: 'error', payload: { error } });
      });

    return () => {
      cancel = true;
    };
  }, [nonce, ...args]);

  const retry = () => {
    setNonce(Date.now());
  };

  return { ...state, retry };
};
