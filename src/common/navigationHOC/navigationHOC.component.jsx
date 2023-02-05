import { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

function NavigationHOC(props) {
  const {
    to,
    history,
    location: { 
      pathname,
    },
  } = props;

  const handleClick = useCallback(() => {
    history.push(to);
  }, [to]);

  return (
    props.children(pathname, handleClick)
  )
}

export default withRouter(NavigationHOC);
