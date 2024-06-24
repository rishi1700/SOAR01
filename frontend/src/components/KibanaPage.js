// KibanaPage.js
import React, { useEffect } from 'react';

const KibanaPage = () => {
  useEffect(() => {
    // Perform any additional authentication if necessary
  }, []);

  return (
    <div>
      <h1>Kibana Dashboard</h1>
      <iframe src="http://192.168.18.10:5601/app/dashboards#/view/c757bc69-0d89-4f17-9d9e-0782d06c85fc?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-15m%2Cto%3Anow))" height="600" width="800"></iframe>
    </div>
  );
};

export default KibanaPage;
