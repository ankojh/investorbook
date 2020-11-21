import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './AddCompany.css'

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
  update_company(where: {id: {_eq: $id}}, _set: {name: $name}) {
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
    return <AddCompany />
  }
}



const AddCompany = () => {

    const [setCompany] = useMutation(SET_COMPANY);
    const history = useHistory();

    async function onSave({name}){
      const id = await setCompany({variables: {name}})
      history.push(`/company`)

    }

  return (
    <div>
      <div className="addcompany-header">Add Company</div>
      <CompanyEditor onSave={onSave} name={''}/>
    </div>
  )
};


const EditCompany = (props)=>{

  const { loading, error, data } = useQuery(GET_COMPANY, { variables: { id: props.companyID } })

  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const history = useHistory();

  async function onSave({name}){
    await updateCompany({variables: { id: props.companyID, name}});
    history.push(`/company/${props.companyID}`)
  }


  return (
    <div>
      <div className="addcompany-header">Edit Company</div>
      <CompanyEditor name={data ? data.company[0].name : ''} onSave={onSave} />
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
      <div className="addcompany-name">Name: <input onChange={e => setName(e.target.value)} value={name}/></div>
      <div>
        <button className="addcompany-button" onClick={onCancelClicked}>Cancel</button>
        <button className="addcompany-button" onClick={onSaveClicked}>Save</button>
      </div>
    </div>
  );
}

export default Company;