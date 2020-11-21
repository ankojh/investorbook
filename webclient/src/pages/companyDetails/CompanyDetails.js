import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

const GET_COMPANY_DETAILS = gql`
query MyQuery ($id: Int){
  company(where: {id: {_eq: $id}}) {
    name
    id
    investments {
      amount
      investor {
        id
        name
        photo_thumbnail
      }
      id
    }
  }
}

`;

const CompanyDetails = () => {

  const {id: companyID} = useParams();
  const { loading, error, data } = useQuery(GET_COMPANY_DETAILS, { variables: { id: companyID }})

  if (loading) {
    return <div></div>
  }

  if (error) {
    return <div></div>
  }

  const companyDetails = data.company[0];
  return (
    <div className="App-CompanyDetails">
      <div>Name: <span>{companyDetails.name}</span></div>    
      <span>Total Number Investments: companyDetails.investments.length</span>
      <span> Total Investment Amount: xxx</span>
      <div>
        Investors Breakdown:
        {
          companyDetails.investments.map(investment=><div>
            <img src={investment.investor.photo_thumbnail} alt={investment.investor.name} height="100px" />
            Investor: {investment.investor.name}
            Amount: ${investment.amount}
          </div>)
        }
      </div>
    </div>
  );
};

export default CompanyDetails;