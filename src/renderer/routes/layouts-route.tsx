import { useEffect } from 'react';

import { useLayouts } from '../api/layouts/get-layouts';

const LayoutsRoute = () => {
  const { data } = useLayouts();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <div></div>;
};

export default LayoutsRoute;
