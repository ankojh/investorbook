import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import AddCompany from './components/addCompany/AddCompany';
import AddInvestor from './components/addInvestor/AddInvestor';
import Investors from './Investors';
import CompanyDetails from './pages/companyDetails/CompanyDetails';
import InvestorDetails from './pages/investorDetails/InvestorDetails';
import TableView from './pages/tableView/TableView';



function App() {
  return (
    <Router>
      <div className="App">
        {/* <Investors /> */}
        <AppBar position="static">
          <Toolbar>
            InvestorBook
        </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/company/:id">
            <CompanyDetails />
          </Route>
          <Route path="/investor/:id">
            <InvestorDetails />
          </Route>

          <Route path="/newinvestor">
            <AddInvestor />
          </Route>

          <Route path="/newcompany">
            <AddCompany />
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
    </Router>
  );
}

export default App;
