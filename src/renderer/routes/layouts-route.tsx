import { useEffect } from 'react';

import { useLayouts } from '../api/layouts/get-layouts';
import { LayoutSelector } from '../components/my-layouts/layout-selector';

const LayoutsRoute = () => {
  const { data } = useLayouts();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="flex h-full w-full flex-row">
      <LayoutSelector />
    </div>
  );
};

export default LayoutsRoute;
