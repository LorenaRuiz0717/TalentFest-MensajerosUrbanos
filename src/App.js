import React from 'react';
import { BrowserRouter as Router, Route, }
    from 'react-router-dom';
import SignIn from './loginIn'
import Mapas from './mapas'
import { AuthProvider } from './firebase/firebaseAuth';

import PrivateRoute from './PrivateRoute';

const App = () => {

  return (
   <AuthProvider>
      <Router>
        <Route exact  path='/' component={SignIn} />
        <PrivateRoute path='/Monitoreo' component={Mapas} />
      </Router>
     </AuthProvider> 
  );
};
export default App;
