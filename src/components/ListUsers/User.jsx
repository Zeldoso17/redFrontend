import React, { useState, useEffect  } from 'react'
import { Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { API_HOST } from '../../utils/constants'
import { getUserApi } from '../../api/user'
import AvatarNotFound from '../../assets/png/avatar-no-found.png'

export default function User(props) {
    const { user } = props;

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        getUserApi(user.id).then(response => {
            setUserInfo(response);
        })
    }, [user])
    

  return (
      <Card as={Link} to={`/${user.id}`} className="list-users__user">
        <Card.Img
            as={Image}
            width={64} 
            height={64} 
            className='mr-3' 
            src={
                userInfo?.avatar
                    ? `${API_HOST}/obtenerAvatar?id=${user.id}`
                    : AvatarNotFound
            }
            alt={`${user.nombre} ${user.apellidos}`}
            />
            <Card.Body>
                <h5>
                    {user.nombre} {user.apellidos}
                </h5>
                <p>{userInfo?.biografia}</p>
            </Card.Body>
      </Card>
  )
}
