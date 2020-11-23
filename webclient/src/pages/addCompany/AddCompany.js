import { gql, useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
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
    returning {
      id
    }
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
    const [saveLoading, setSaveLoading] = useState(false);
    const history = useHistory();

    async function onSave({name}){
      if (saveLoading) {
        return;
      }
      setSaveLoading(true);
      const response= await setCompany({variables: {name}})
      const id = response.data['insert_company']['returning'][0].id;
      history.push(`/company/${id}`)
      setSaveLoading(false);

    }

  return (
    <div>
      <div className="addcompany-header">Add Company</div>
      <CompanyEditor onSave={onSave} name={''} working={saveLoading}/>
    </div>
  )
};


const EditCompany = (props)=>{

  const { loading, error, data } = useQuery(GET_COMPANY, { variables: { id: props.companyID } })
  const [saveLoading, setSaveLoading] = useState(false);
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const history = useHistory();

  async function onSave({name}){
    if (saveLoading) {
      return;
    }
    setSaveLoading(true);
    await updateCompany({variables: { id: props.companyID, name}});
    history.push(`/company/${props.companyID}`)
    setSaveLoading(false);
  }


  return (
    <div>
      <div className="addcompany-header">Edit Company</div>
      <CompanyEditor name={data ? data.company[0].name : ''} onSave={onSave} working={saveLoading} />
    </div>
  )
}

const CompanyEditor = (props) => {

  const [name, setName] = useState('')

  const history = useHistory();

  useEffect(() => {
    setName(name ? name : props.name)
  })

  function onSaveClicked() {
    props.onSave && props.onSave({ name })
  }

  function onCancelClicked() {
    // setName(props.name);
    history.goBack();
  }


  return (
    <div className="App-AddCompany">
      <div className="addcompany-name">Name: <input onChange={e => setName(e.target.value)} value={name}/></div>
      {!props.working && <div>
        <button className="addcompany-button" onClick={onCancelClicked}>Cancel</button>
        <button className="addcompany-button" onClick={onSaveClicked}>Save</button>
      </div> } 
      {props.working && <CircularProgress />}
    </div>
  );
}

export default Company;