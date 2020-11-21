import React from 'react';
import './InvestorView.css'
import { useQuery, gql } from '@apollo/client';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const GET_INVESTORS = gql`
query getInvestors {
  investor(limit: 5) {
    investments {
      company {
        name
      }
    }
    id
    name
    photo_thumbnail
  }
}
`;


const InvestorView = () => {

  const { loading, error, data } = useQuery(GET_INVESTORS);

  if (loading)
    return (<div>Loading</div>)
  if (error)
    return (<div>Error</div>)

  return (
    <div className="App-InvestorView">
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
            <TableRow key={investor.id}>
              <TableCell> <img src={investor.photo_thumbnail} alt={investor.name} width='30px' /> </TableCell>
              <TableCell> {investor.name}</TableCell>
            <TableCell> {investor.investments.map(({company})=><span>{company.name}, </span>)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestorView;