import { AppBar, Toolbar } from '@material-ui/core';
import React, { useContext } from 'react';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import './App.css';
import AddCompany from './pages/addCompany/AddCompany';
import AddInvestment from './pages/addInvestment/AddInvestment';
import AddInvestor from './pages/addInvestor/AddInvestor';
import ResizeContextProvider, { ResizeContext } from './contexts/resizeContext';
import Investors from './Investors';
import CompanyDetails from './pages/companyDetails/CompanyDetails';
import InvestorDetails from './pages/investorDetails/InvestorDetails';
import TableView from './pages/tableView/TableView';
import UpdateCompany from './pages/updateCompany/UpdateCompany';
import UpdateInvestment from './pages/updateInvestment/UpdateInvestment';
import UpdateInvestor from './pages/updateInvestor/UpdateInvestor';
import Investor from './pages/addInvestor/AddInvestor';



function App() {

  const { isWideScreen } = useContext(ResizeContext);
  const history = useHistory();
  return (
      <div className={`App ${isWideScreen ? 'wide-screen' : ''}`}>
        <AppBar position="static" className="App-header">
          <Toolbar>
            <span onClick={e=>history.push('/')} className="App-Title">InvestorBook</span>
        </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/company/:id">
            <CompanyDetails />
          </Route>

          <Route path="/investor/:id">
            <InvestorDetails />
          </Route>

          <Route path="/investor">
            <Investor />
          </Route>

          <Route path="/company">
            <AddCompany />
          </Route>

          <Route path="/investment">
            <AddInvestment/>
          </Route>

          
          <Route path="/investors">
            <TableView />
          </Route>
          <Route path="/companies">
            <TableView />
          </Route>
          <Route path="/">
            <TableView />
          </Route>
          <Route path="**">
            <TableView />
          </Route>
        </Switch>
      </div>
  );
}

export default App;
