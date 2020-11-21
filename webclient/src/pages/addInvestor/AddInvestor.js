import { gql, useMutation, useQuery } from '@apollo/client';
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
    affected_rows
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

  function onSave({ name, avatarURL }) {
    setInvestor({ variables: { name, photoLarge: avatarURL, photoThumbnail: avatarURL } })
  }
  return (
    <div>
      <div>Add Investor</div>
      <InvestorEditor onSave={onSave} />
    </div>

  )
}

const EditInvestor = (props) => {
  const { loading, error, data } = useQuery(GET_INVESTOR, { variables: { id: props.investorID } })
  
  const [updateInvestor] = useMutation(UPDATE_INVESTOR);

  function onSave({ name, avatarURL }) {
    updateInvestor({ variables: { name, photoLarge: avatarURL, photoThumbnail: avatarURL , id: props.investorID } });
  }

  return (
    <div>
        <div>Edit Investor</div>
      <InvestorEditor name={data ? data.investor[0].name : ''} avatar={data ? data.investor[0].photo_large : ''} onSave={onSave} />
    </div>
  )
}



const InvestorEditor = (props) => {
  const [name, setName] = useState('')
  const [avatarURL, setAvatarURL] = useState('')

  useEffect(() => {
    setName(name? name :props.name)
    setAvatarURL(avatarURL ? avatarURL : props.avatar)
  })

  function onSaveClicked() {
    props.onSave && props.onSave({ name, avatarURL })
  }

  function onCancelClicked() {
    setName(props.name);
    setAvatarURL(props.avatar);
  }


  return (
    <div className="App-NewInvestor">
      <div>Investor Panel</div>
      <div>Name: <input onChange={e => setName(e.target.value)} value={name} /></div>
      <div>Avatar URL: <input onChange={e => setAvatarURL(e.target.value)} value={avatarURL} /></div>
      <div>
        <button onClick={onCancelClicked}>Cancel</button>
        <button onClick={onSaveClicked}>Save</button>
      </div>
    </div>
  );
}

export default Investor;