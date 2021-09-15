import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './firebase/firebaseConfig'

import SignIn from './loginIn'
 
ReactDOM.render(
<React.StrictMode>
<SignIn/>
<App />
</React.StrictMode>,
document.getElementById('root')
);