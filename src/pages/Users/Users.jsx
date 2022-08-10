import React, { useState, useEffect } from 'react'
import { Spinner, ButtonGroup, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { isEmpty } from 'lodash'
import { useDebouncedCallback } from 'use-debounce';
import BasicLayout from '../../layout/BasicLayout'
import ListUsers from '../../components/ListUsers'
import { withRouter } from '../../utils/functions'
import { getFollowsApi } from '../../api/follow'


import "./Users.scss";


function Users(props) {
    const { setRefreshCheckLogin, router } = props;

    const [users, setUsers] = useState(null);
    const params = useUsersQuery(router);
    const [typeUser, setTypeUser] = useState(params.type || "follow");
    const [btnLoading, setBtnLoading] = useState(false);

    const navigate = useNavigate();

    const onSearch = useDebouncedCallback((value) => {
        setUsers(null);
        navigate(`/users?page=${1}&type=${typeUser}&search=${value}`);
    }, 200);

    useEffect(() => {
        getFollowsApi(queryString.stringify(params))
            .then(response => {
                // eslint-disable-next-line eqeqeq
                if(params.page == 1) {
                    if (isEmpty(response)) {
                        setUsers([]);
                    } else {
                        setUsers(response);
                    }
                }else{
                    if(!response){
                        setBtnLoading(0);
                    }else{
                        setUsers([...users, ...response]);
                        setBtnLoading(false);
                    }
                }
            })
            .catch(err => {
                setUsers([]);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.location])

    const onChangeType = type => {
        setUsers(null);
        if (type === "new") {
            setTypeUser("new");
        } else {
            setTypeUser("follow");
        }
        navigate(`/users?page=${1}&type=${type}&search=${""}`);
    }

    const moreData = () => {
        setBtnLoading(true);
        const newPage = parseInt(params.page) + 1;
        navigate(`/users?page=${newPage}&type=${typeUser}&search=${""}`);
    }

    return (
        <BasicLayout className="users" title="Usuarios" setRefreshCheckLogin={setRefreshCheckLogin}>
            <div className='users__title'>
                <h2>Usuarios</h2>
                <input type="texto" placeholder='Busca un usuario...'
                onChange={ e => onSearch(e.target.value)} />
            </div>

            <ButtonGroup className="users__options">
                <Button className={typeUser === 'follow' && 'active'} onClick={() => onChangeType("follow")}>Siguiendo</Button>
                <Button className={typeUser === 'new' && 'active'} onClick={() => onChangeType("new")}>Nuevos</Button>
            </ButtonGroup>

            {!users ? (
                <div className='users__loading'>
                    <Spinner animation='border' variant="info" />
                    Buscando Usuarios
                </div>
            ) : (
                <>
                    <ListUsers users={users} />
                    <Button onClick={moreData} className="load-more">
                        {!btnLoading ? (
                            btnLoading !== 0 && "Cargar más usuarios"
                        ) : (
                            <Spinner as="span" animation='grow' seize="sm" role="status" aria-hidden="true"/>
                        )}
                    </Button>
                </>
            )}
        </BasicLayout>
    );
}

function useUsersQuery(router) {
    const { page = 1, type = "follow", search } = queryString.parse(router.location.search);

    return { page, type, search };
}

export default withRouter(Users)