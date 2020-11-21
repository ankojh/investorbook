import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './InvestorDetails.css'

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
  const history = useHistory()

  function companyClicked(companyId){
    history.push(`/company/${companyId}`)
  }


  if(loading){
    return <div>Loading</div>
  }

  if(error){
    return <div>Error</div>
  }

  const investor = data.investor[0];

  return (
    <div className="App-InvestorDetails">
      <div className="investordetails-header">Investor</div>
      <img className="investordetails-avatar" src={investor.photo_large} alt={investor.name} width="300px" height="300px" />
      <div className="investordetails-name">Name: <span>{investor.name}</span></div>
      <div className="investordetails-investment-header">Investments:</div>
      {investor.investments.map(investment=>
        <div className="investordetails-investment" key={investment.id}>
          <span className="investordetails-company" onClick={e => companyClicked(investment.company.id)}>{investment.company.name}: </span> <span >${investment.amount}</span>
        </div>
      )}
    </div>
  );
};

export default InvestorDetails;