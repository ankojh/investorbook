import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './CompanyDetails.css'

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

  const { id: companyID } = useParams();
  const { loading, error, data } = useQuery(GET_COMPANY_DETAILS, { variables: { id: companyID } })

  if (loading) {
    return <div></div>
  }

  if (error) {
    return <div></div>
  }

 


  const companyDetails = {...data.company[0]};
  companyDetails.investments = [...companyDetails.investments].sort((a,b)=>b.amount - a.amount);
  return (
    <div className="App-CompanyDetails">
      <div className="companydetails-header">Company</div>
      <div className="companydetails-name">Name: <span>{companyDetails.name}</span></div>
      <div className="companydetails-stats">Number of Investments: {companyDetails.investments.length}</div>

      <div className="companydetails-investors">Investors</div>
      <div>
        {
          companyDetails.investments && companyDetails.investments.map(investment => <CompanyInvestorCard key={investment.id} investment={investment} />)
        }
      </div>
    </div>
  );
};


function CompanyInvestorCard({ investment }) {
  const history = useHistory();

  function investorClicked(investorID) {
    history.push(`/investor/${investorID}`)
  }

  return (<div className="investor-card">
    <img className="investor-card-avatar" src={investment.investor.photo_thumbnail} alt={investment.investor.name} height="100px" />
    <div className='investor-card-name'>Name: <span onClick={e => investorClicked(investment.investor.id)} >{investment.investor.name}</span></div>
    <span className='investor-card-amount'>Amount: ${investment.amount}</span>
  </div>)
}


export default CompanyDetails;