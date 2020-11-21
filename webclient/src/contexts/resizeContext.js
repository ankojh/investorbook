import React, { useEffect, useState } from 'react';
import debounce from '../utils/debounce';

export const ResizeContext = React.createContext({})

const ResizeContextProvider = (props) => {

  const [state, setState] = useState({
    width: window.innerWidth,
    isWideScreen: window.innerWidth > 750
  })

  useEffect(() => {
    function handleResize() {
      setState({
        width: window.innerWidth,
        isWideScreen: window.innerWidth > 750
      })
    }
    const debouncedHandleResize = debounce(handleResize, 500);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    }
  }, [])



  return <ResizeContext.Provider value={{ ...state }}>
    {props.children}
  </ResizeContext.Provider>
};

export default ResizeContextProvider;