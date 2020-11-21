import React from 'react';
import './CompanyView.css'
import { useQuery, gql } from '@apollo/client';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const GET_COMPANIES = gql`
query GetCompanies {
  company(limit: 10) {
    id
    name
    investments {
      investor {
        name
      }
      amount
    }
  }
}

`;


const CompanyView = () => {
  const { loading, error, data } = useQuery(GET_COMPANIES);

  if (loading)
    return (<div>Loading</div>)
  if (error)
    return (<div>Error</div>)

    console.log(data)

  return (
    <div className="App-InvestorView">
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
              <TableCell> {company.name}</TableCell>
              {!company.investments.length && <TableCell>-</TableCell>}
              {/* {!company.investments.length && <TableCell>No Investments Found</TableCell>} */}
              {company.investments.length ? <TableCell> {company.investments.map(({ investor }) => <span>{investor.name}, </span>)}</TableCell> : null}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyView;