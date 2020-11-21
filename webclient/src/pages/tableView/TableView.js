import { AppBar, Box, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import CompanyView from '../../components/companyView/CompanyView';
import InvestorView from '../../components/investorView/InvestorView';
import './TableView.css'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        props.children
      )}
    </div>
  );
}

const TableView = () => {

  const [tab, setTab] = useState(0)

  function handleChange(e, newValue) {
    setTab(newValue)
  }

  return (
    <div className="App-TableView">
      <AppBar position="static">
        <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Investors" />
          <Tab label="Companies" />
        </Tabs>
      </AppBar>

      <TabPanel value={tab} index={0}>
        <InvestorView />
        </TabPanel>
      <TabPanel value={tab} index={1}>
        <CompanyView />
      </TabPanel>
    </div>
  );
};

export default TableView;