import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GET_COMPANY = gql`
  query GetCompany($id:Int) {
  company(where: {id: {_eq: $id}}) {
    name
  }
}
`;


const SET_COMPANY = gql`
mutation SetCompany($name: String) {
  insert_company(objects: {name:$name}) {
    affected_rows
  }
}`;


const UPDATE_COMPANY = gql`
mutation UpdateCompany($id: Int, $name: String) {
  update_investor(where: {id: {_eq: $id}}, _set: {name: $name}) {
    affected_rows
  }
}
`;


const Company = () => {
  const location = useLocation();
  const companyID = new URLSearchParams(location.search).get('edit');

  if (companyID) {
    return <EditCompany companyID={companyID} />
  }
  else {
    return <AddCompany companyID={companyID} />
  }
}



const AddCompany = () => {

    const [setCompany] = useMutation(SET_COMPANY);

    function onSave({name}){
      setCompany({variables: {name}})
    }

  return (
    <div>
      <div>Add Company</div>
      <CompanyEditor onSave={onSave}/>
    </div>
  )
};


const EditCompany = (props)=>{
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  function onSave({name}){
    updateCompany({id:props.id, name});
  }

  return (
    <div>
      <div>Edit Company</div>
      <CompanyEditor onSave={onSave} />
    </div>
  )
}

const CompanyEditor = (props) => {

  const [name, setName] = useState('')


  useEffect(() => {
    setName(name ? name : props.name)
  })

  function onSaveClicked() {
    props.onSave && props.onSave({ name })
  }

  function onCancelClicked() {
    setName(props.name);
  }


  return (
    <div className="App-AddCompany">
      <div>Company Panel</div>
      <div>Name: <input onChange={e => setName(e.target.value)} value={name}/></div>
      <div>
        <button onClick={onCancelClicked}>Cancel</button>
        <button onClick={onSaveClicked}>Save</button>
      </div>
    </div>
  );
}

export default Company;