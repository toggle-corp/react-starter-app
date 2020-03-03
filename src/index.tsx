import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

console.info('React version', React.version);

const rootElement = document.getElementById('MY_APP_ID-root');
ReactDOM.createRoot(rootElement).render(<Root />);
