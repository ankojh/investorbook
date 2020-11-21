import React, { useContext, useState } from 'react';
import './CompanyView.css'
import { useQuery, gql } from '@apollo/client';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ResizeContext } from '../../contexts/resizeContext';

const GET_COMPANIES = gql`
query GetCompanies($limitBy: Int, $offsetBy: Int, $limitInvestments: Int) {
  company(limit: $limitBy, offset: $offsetBy) {
    id
    name
    investments(limit: $limitInvestments){
      investor {
        name
        id
      }
      amount
    }
  }
}

`;


const CompanyView = () => {

  const [page, setPage] = useState(0);
  const { isWideScreen } = useContext(ResizeContext);
  const PER_PAGE_LIMIT = isWideScreen ? 10 : 5;


  const { loading, error, data } = useQuery(GET_COMPANIES,
    {
      variables:
      {
        limitBy: PER_PAGE_LIMIT,
        offsetBy: PER_PAGE_LIMIT * page,
        limitInvestments: isWideScreen ? 50 : 10
      }
    });
  const history = useHistory();



  function addCompany() {
    history.push('/company')
  }

  function investorClicked(investorId) {
    history.push(`/investor/${investorId}`)
  }

  function companyClicked(companyId) {
    history.push(`/company/${companyId}`)
  }

  function nextPageClicked() {
    setPage(page + 1);
  }

  function previousPageClicked() {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  function addInvestmentClicked(companyId){
    alert('TODO')
    // history.push(`/investment?company=${companyId}`);
  }


  if (loading)
    return (<div className="company-view-loader">
      <span>Loading</span>
      <CircularProgress />
    </div>)
  if (error)
    return (
      <div className="company-view-loader">
        <span>Error</span>
      </div>
    )

  return (
    <div className="App-companyView">

      <div className="company-view-header">
        <span className="company-header-title">Companies</span>
        <button className="company-header-add" onClick={addCompany}>Add Company</button>
      </div>


      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Invested By</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.company.map(company =>
            <TableRow key={company.id}>
              <TableCell> <span onClick={e=>companyClicked(company.id)} className="company-view-name">{company.name}</span></TableCell>
              {!company.investments.length && <TableCell>
                No Investors <button className="company-add-investment" onClick={e=>addInvestmentClicked(company.id)}>Add Investment</button>
                </TableCell>}
              {company.investments.length ? <TableCell> 
                {company.investments.map(({ investor }, index) => <span className="company-view-investor" onClick={e=>investorClicked(investor.id)} key={investor.id}>{investor.name}{index === company.investments.length-1 ? '' : ','} </span>)}</TableCell> : null}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="company-view-pagenav">
        <button disabled={!page} onClick={previousPageClicked}>Previous</button>
        page: {page + 1}
        <button onClick={nextPageClicked}>Next</button>
      </div>
    </div>
  );
};

export default CompanyView;