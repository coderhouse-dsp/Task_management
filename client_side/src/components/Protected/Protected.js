import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import Dashboard from '../TaskSection/Dashboard/Dashboard';

const Protected = ({logOutCallback}) => {
  // Could have something here to check for the time when the accesstoken expires
  // and then call the refresh_token endpoint to get a new accesstoken automatically
  const [user] = useContext(UserContext);
  const [content, setContent] = useState('You need to login');
  const [validated,setValidated] = useState(false)

  useEffect(() => {
    async function fetchProtected() {
      const result = await (await fetch('http://localhost:4000/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${user.accesstoken}`,
        },
      })).json();
      if (result.data) 
      {
        setValidated(true);
        setContent(result.data)
      }
    }
    fetchProtected();
  }, [user])

  return(
    <>
     {validated ? (
        <>
         <Dashboard logOutCallback={logOutCallback}></Dashboard>

        </>
      ) : (
        <div className='form'>{content}</div>
      )}
    
    </>
  )
}

export default Protected;