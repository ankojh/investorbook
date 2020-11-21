import React, { useContext, useState } from 'react';
import './InvestorView.css'
import { useQuery, gql } from '@apollo/client';
import { CircularProgress, Icon, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ResizeContext } from '../../contexts/resizeContext';

const GET_INVESTORS = gql`
query getInvestors($limitBy: Int, $offsetBy:Int, $limitInvestments: Int) {
  investor(limit: $limitBy, offset: $offsetBy) {
    investments(limit: $limitInvestments) {
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

const InvestorView = () => {
  const [page, setPage] = useState(0);
  const {isWideScreen} = useContext(ResizeContext);
  const PER_PAGE_LIMIT = isWideScreen ? 7 : 5;
  const { loading, error, data } = useQuery(GET_INVESTORS,
    {
      variables: {
        limitBy: PER_PAGE_LIMIT,
        offsetBy: PER_PAGE_LIMIT * page,
        limitInvestments: isWideScreen ? 50: 10
      }
    });
  const history = useHistory();

  function addInvestor() {
    history.push('/investor')
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
    return (<div className="investor-view-loader">
        <span>Loading</span>
        <CircularProgress/>
      </div>)
  if (error)
    return (
      <div className="investor-view-loader">
        <span>Error</span>
      </div>
    )


  return (
    <div className="App-InvestorView">

      <div className="investor-view-header">
        <span className="investor-header-title">Investors</span>
        <button className="investor-header-add" onClick={addInvestor}>Add Investor</button>
      </div>

      <Table stickyHeader className="investor-view-tableheader">
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
              <TableCell> <span className="investor-view-name" onClick={e => investorClicked(investor.id)}>{investor.name}</span></TableCell>
              <TableCell>
                {investor.investments.map(({ company }, index) =>
                  <span className="investor-view-company" key={company.id} onClick={e => companyClicked(company.id)}>{company.name}{index === investor.investments.length - 1 ? '' : ','} </span>)}
                  {!isWideScreen && investor.investments.length==10 && <span className="investor-view-seemore" onClick={e => investorClicked(investor.id)}>See More</span>}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      <div className="investor-view-pagenav">
        <button disabled={!page} onClick={previousPageClicked}>Previous</button>
        page: {page + 1}
        <button onClick={nextPageClicked}>Next</button>
      </div>
    </div>
  );
};

export default InvestorView;