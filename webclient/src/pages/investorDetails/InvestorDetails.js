import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

const GET_INVESTOR_DETAILS = gql`
query MyQuery ($id: Int){
  investor(where: {id: {_eq: $id}}) {
    id
    name
    photo_large
    investments(order_by: {created_at: asc}) {
      company {
        id
        name
      }
      id
      amount
    }
  }
}
`;


const InvestorDetails = () => {
  const { id: investorId } = useParams();
  const { loading, error, data } = useQuery(GET_INVESTOR_DETAILS, { variables: { id: investorId } });


  if(loading){
    return <div></div>
  }

  if(error){
    return <div></div>
  }

  const investor = data.investor[0];

  return (
    <div className="App-InvestorDetails">
      <div>Go Back To All Investors</div>
      <img src={investor.photo_large} alt='' width="100px" height="100px" />
      <div>Name: <span>{investor.name}</span></div>
      <div>Investments:</div>
      {investor.investments.map(investment=>
        <div key={investment.id}>
          <span>{investment.company.name}: </span> <span>${investment.amount}</span>
        </div>
      )}
    </div>
  );
};

export default InvestorDetails;