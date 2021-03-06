import { gql, useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import './AddInvestor.css'

const GET_INVESTOR = gql`
  query GetInvestor($id:Int) {
  investor(where: {id: {_eq: $id}}) {
    name
    photo_large
  }
}
`;


const SET_INVESTOR = gql`
mutation SetInvestor($name: String, $photoLarge: String, $photoThumbnail: String) {
  insert_investor(objects: {name:$name, photo_large: $photoLarge, photo_thumbnail: $photoThumbnail}) {
    returning {
      id
    }
  }
}`;


const UPDATE_INVESTOR = gql`
mutation UpdateInvestor($id: Int, $name: String, $photoLarge: String, $photoThumbnail: String) {
  update_investor(where: {id: {_eq: $id}}, _set: {name: $name, photo_large: $photoLarge, photo_thumbnail: $photoThumbnail}) {
    affected_rows
  }
}
`;

const Investor = () => {
  const location = useLocation();
  const investorID = new URLSearchParams(location.search).get('edit');

  if (investorID) {
    return <EditInvestor investorID={investorID} />
  }
  else {
    return <AddInvestor investorID={investorID} />
  }
}


const AddInvestor = () => {

  const [setInvestor] = useMutation(SET_INVESTOR);
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')


  async function onSave({ name, avatarURL }) {
    if (saveLoading) {
      return;
    }

    if (!name) {
      setErrorMsg('Name is Required');
      return;
    }

    if (!avatarURL) {
      setErrorMsg('Avatar is Required');
      return;
    }
    setSaveLoading(true);
    const response = await setInvestor({ variables: { name, photoLarge: avatarURL, photoThumbnail: avatarURL } })
    const id = response.data['insert_investor']['returning'][0].id
    history.push(`/investor/${id}`);
    setSaveLoading(false);
  }
  return (
    <div>
      <div className="addinvestor-header">Add Investor</div>
      <InvestorEditor onSave={onSave} working={saveLoading} error={errorMsg}/>
    </div>

  )
}

const EditInvestor = (props) => {
  const { loading, error, data } = useQuery(GET_INVESTOR, { variables: { id: props.investorID } })
  
  const [updateInvestor] = useMutation(UPDATE_INVESTOR);
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')



  async function onSave({ name, avatarURL }) {
    if(saveLoading){
      return;
    }

    if(!name){
      setErrorMsg('Name is Required');
      return;
    }

    if (!avatarURL) {
      setErrorMsg('Avatar is Required');
      return;
    }

    setSaveLoading(true);
    await updateInvestor({ variables: { name, photoLarge: avatarURL, photoThumbnail: avatarURL , id: props.investorID } });
    history.push(`/investor/${props.investorID}`)
    setSaveLoading(false);
  }

  return (
    <div>
        <div className="addinvestor-header">Edit Investor</div>
      <InvestorEditor 
        name={data ? data.investor[0].name : ''}
        avatar={data ? data.investor[0].photo_large : ''}
        onSave={onSave}
        working={saveLoading}
        error={errorMsg} />
    </div>
  )
}



const InvestorEditor = (props) => {
  const [name, setName] = useState(null)
  const [avatarURL, setAvatarURL] = useState(null)

  const history = useHistory();

  useEffect(() => {
    // setName(name? name :props.name)
    // setAvatarURL(avatarURL ? avatarURL : props.avatar)
    setName(props.name && name === null ? props.name : name);
    setAvatarURL(props.avatar && avatarURL === null ? props.avatar : avatarURL);
  })

  function onSaveClicked() {
    props.onSave && props.onSave({ name, avatarURL })
  }

  function onCancelClicked() {
    history.goBack();
    // setName(props.name);
    // setAvatarURL(props.avatar);
  }


  return (
    <div className="App-NewInvestor">
      <div className="addinvestor-name">Name: <input onChange={e => setName(e.target.value)} value={name} /></div>
      <div className="addinvestor-url">Avatar URL: <input onChange={e => setAvatarURL(e.target.value)} value={avatarURL} /></div>
      {props.error && <div className="addinvestor-error">{props.error}</div>} 
      { !props.working && <div>
        <button className="addinvestor-button" onClick={onCancelClicked}>Cancel</button>
        <button className="addinvestor-button" onClick={onSaveClicked}>Save</button>
      </div>}
      {props.working && <CircularProgress />}
    </div>
  );
}

export default Investor;