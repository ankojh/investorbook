import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './CompanyDetails.css'
import deleteIcon from '../../assets/delete-24px.svg'
import updateIcon from '../../assets/create-24px.svg'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

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

const DELETE_COMPANY = gql`
mutation DeleteCompany($id: Int) {
  delete_company(where: {id: {_eq: $id}}){
     affected_rows
  }
}
`;


const DELETE_INVESTMENT = gql`
mutation DeleteInvestment($id: Int) {
  delete_investment(where: {id: {_eq: $id}}){
     affected_rows
  }
}
`;


const CompanyDetails = () => {

  const { id: companyID } = useParams();
  const { loading, error, data } = useQuery(GET_COMPANY_DETAILS, { variables: { id: companyID } })

  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState({ id: null, type: 'Company' });
  const history = useHistory();
  const [deleteCompanyMutation] = useMutation(DELETE_COMPANY);
  const [deleteInvestmentMutation] = useMutation(DELETE_INVESTMENT);
  if (loading) {
    return <div className="company-details-message">Loading <CircularProgress /></div>
  }

  if (error) {
    return <div className="company-details-message">Error :(</div>
  }

  if(!data || !data.company.length){
    return <div className="company-details-message">No Company Found</div>
  }

  function deleteCompany() {
    setDeleting({ type: 'Company', id: companyID });
    setShowDialog(true);
  }

  function editCompany() {
    history.push(`/company?edit=${companyID}`)
  }


  function handleCancel() {
    setShowDialog(false);
  }

  async function handleOk() {
    if (deleting.type === 'Company') {
      await deleteCompanyMutation({ variables: { id: deleting.id } });
      history.push('/')
    }
    else {
      alert('todo');
      // deleteInvestmentMutation({ variables: { id: deleting.id } });
    }
    setShowDialog(false);
  }


  console.log(data);

  const companyDetails = {...data.company[0]};
  companyDetails.investments = [...companyDetails.investments].sort((a,b)=>b.amount - a.amount);
  return (
    <div className="App-CompanyDetails">
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        open={showDialog}
      >
        <DialogTitle>Delete {deleting.type}?</DialogTitle>
        <DialogContent dividers>
          Are You Sure?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
        </Button>
          <Button onClick={handleOk} color="primary">
            Delete
        </Button>
        </DialogActions>
      </Dialog>
      <div className="companydetails-header">Company</div>
      <div className="companydetails-name">Name: <span>{companyDetails.name}</span> 
        <img onClick={e => editCompany()} className="companydetails-icon" src={updateIcon} width='20px' alt="update" />
        <img onClick={e => deleteCompany()} className="companydetails-icon" src={deleteIcon} width='20px' alt="delete" />
      </div>
      <div className="companydetails-stats">Number of Investments: {companyDetails.investments.length}</div>

      <div className="companydetails-company">Investments</div>
      <div>
        {
          companyDetails.investments && companyDetails.investments.map(investment => <CompanyInvestorCard key={investment.id} setDeleting={setDeleting} setShowDialog={setShowDialog} investment={investment} />)
        }
        {(!companyDetails.investments || !companyDetails.investments.length) && <div style={{textAlign: 'center'}}>No Investor Found</div>}
      </div>
    </div>
  );
};


function CompanyInvestorCard({ investment, setDeleting, setShowDialog}) {
  const history = useHistory();

  function deleteInvestment(investmentId) {
    setDeleting({ type: 'Investment', id: investmentId })
    setShowDialog(true);
  }

  function editInvestment(investmentId) {
    alert('TODO')
    // history.push(`/investment?edit=${investmentId}`)
  }

  function investorClicked(investorID) {
    history.push(`/investor/${investorID}`)
  }

  return (<div className="investor-card">
    <img className="investor-card-avatar" src={investment.investor.photo_thumbnail} alt={investment.investor.name} height="100px" />
    <div className='investor-card-name'>
        Name: <span onClick={e => investorClicked(investment.investor.id)} >{investment.investor.name}</span>
        </div>
    <span className='investor-card-amount'>Amount: ${investment.amount}</span>
    <span className="investor-card-option">
      <img onClick={e => editInvestment(investment.id)} className="companydetails-icon" src={updateIcon} width='20px' alt="update" />
      <img onClick={e => deleteInvestment(investment.id)} className="companydetails-icon" src={deleteIcon} width='20px' alt="delete" />
    </span>
  </div>)
}


export default CompanyDetails;