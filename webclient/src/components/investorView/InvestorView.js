import React, { useState } from 'react';
import './InvestorView.css'
import { useQuery, gql } from '@apollo/client';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const GET_INVESTORS = gql`
query getInvestors($limitBy: Int, $offsetBy:Int) {
  investor(limit: $limitBy, offset: $offsetBy) {
    investments {
      company {
        id
        name
      }
    }
    id
    name
    photo_thumbnail
  }
}
`;

const PER_PAGE_LIMIT = 5;

const InvestorView = () => {
  const [page, setPage] = useState(0);
  const { loading, error, data } = useQuery(GET_INVESTORS,
    {
      variables: {
        limitBy: PER_PAGE_LIMIT,
        offsetBy: PER_PAGE_LIMIT * page
      }
    });
  const history = useHistory();

  function addInvestor() {
    history.push('/newinvestor')
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

  if (loading)
    return (<div>Loading</div>)
  if (error)
    return (<div>Error</div>)

  return (
    <div className="App-InvestorView">

      <div>
        <span>Investors</span>
        <button onClick={addInvestor}>Add Investor</button>
      </div>

      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Invested In</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.investor.map(investor =>
            <TableRow key={investor.id} height={'100px'}>
              <TableCell>
                <img
                  onClick={e => investorClicked(investor.id)}
                  src={investor.photo_thumbnail}
                  alt={investor.name}
                  width='50px' />
              </TableCell>
              <TableCell> <span onClick={e => investorClicked(investor.id)}>{investor.name}</span></TableCell>
              <TableCell>
                {investor.investments.map(({ company }, index) =>
                  <span key={company.id} onClick={e => companyClicked(company.id)}>{company.name}{index === investor.investments.length - 1 ? '' : ','} </span>)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      <div>
        <button onClick={previousPageClicked}>Previous Page</button>
        page: {page + 1}
        <button onClick={nextPageClicked}>Next Page</button>
      </div>
    </div>
  );
};

export default InvestorView;