import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './InvestorDetails.css';
import deleteIcon from '../../assets/delete-24px.svg'
import updateIcon from '../../assets/create-24px.svg'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

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

const DELETE_INVESTOR = gql`
mutation DeleteInvestor($id: Int) {
  delete_investor(where: {id: {_eq: $id}}){
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


const InvestorDetails = (props) => {
  const { id: investorId } = useParams();
  const { loading, error, data } = useQuery(GET_INVESTOR_DETAILS, { variables: { id: investorId } });
  const history = useHistory()

  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState({id: null, type: 'Investor'});
  const [deleteInvestorMutation] = useMutation(DELETE_INVESTOR);
  const [deleteInvestmentMutation] = useMutation(DELETE_INVESTMENT);
  const [isInvestorEditing, setIsInvestorEditing] = useState(false);

  function companyClicked(companyId){
    history.push(`/company/${companyId}`)
  }

  function deleteInvestment(investmentId){
    setDeleting({type:'Investment', id: investmentId});
    setShowDialog(true);
  }

  function editInvestment(investmentId){
    alert('TODO')
    // history.push(`/investment?edit=${investmentId}`)
  }

  function deleteInvestor(){
    setDeleting({ type: 'Investor', id: investorId });
    setShowDialog(true);
  }

  function editInvestor(){
    history.push(`/investor?edit=${investorId}`)
  }

  function handleCancel(){
    setShowDialog(false);
  }

  async function handleOk(){
    if(deleting.type === 'Investor'){
      await deleteInvestorMutation({ variables: { id: deleting.id } });
      history.push('/')
    }
    else{
      alert('todo');
      // deleteInvestmentMutation({ variables: { id: deleting.id } });
    }
    setShowDialog(false);
  }

  if(loading){
    return <div className="investor-details-message">Loading <CircularProgress /></div>
  }

  if(error){
    return <div className="investor-details-message">Error :(</div>
  }

  if (!data || !data.investor.length){
    return <div className="investor-details-message">No Investor Found :( </div>
  }

  const investor = data.investor[0];

  return (
    <div className="App-InvestorDetails">

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

      <div className="investordetails-header">Investor 
         
      </div>
      {

      }
      <img className="investordetails-avatar" src={investor.photo_large} alt={investor.name} width="300px" height="300px" />
      <div className="investordetails-name">Name: <span>{investor.name}</span> 
      <img onClick={editInvestor} className="investordetails-icon" src={updateIcon} width='20px' alt="update" />
        <img onClick={deleteInvestor} className="investordetails-icon" src={deleteIcon} width='20px' alt="delete" />
      </div>
      
      <div className="investordetails-investment-header">Investments:</div>
      {investor.investments.map(investment=>
        <div className="investordetails-investment" key={investment.id}>
          <span className="investordetails-company" onClick={e => companyClicked(investment.company.id)}>
            {investment.company.name}: </span> <span >${investment.amount}
            <span className="investordetails-options">
              <img onClick={e => editInvestment(investment.id)} className="investordetails-icon" src={updateIcon} width='20px' alt="update" />
              <img onClick={e => deleteInvestment(investment.id)} className="investordetails-icon" src={deleteIcon} width='20px' alt="delete" />
            </span>
            </span>
        </div>
      )}
      {(!investor.investments || !investor.investments.length) &&
        <div style={{ textAlign: 'center' }}>This Investor has currently no invested anywhere</div>
      }
    </div>
  );
};

export default InvestorDetails;