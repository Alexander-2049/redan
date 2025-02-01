// import React from 'react';

import { useEffect } from "react";

const OverlaysPage = () => {
  useEffect(() => {
    window.MainWindowAPI.sendMessage("get-mod-names");
  });

  return <div>2</div>;
};

export default OverlaysPage;
