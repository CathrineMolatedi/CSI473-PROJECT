import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/ResidentDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForumComponent from './components/ForumComponent';
import Scanner from './components/Scanner';
import TwoFactorAuth from './components/TwoFactorAuth';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/resident-dashboard" component={ResidentDashboard} />
        <Route path="/officer-dashboard" component={OfficerDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/forum" component={ForumComponent} />
        <Route path="/scanner" component={Scanner} />
        <Route path="/two-factor-auth" component={TwoFactorAuth} />
      </Switch>
    </Router>
  );
};

export default App;