import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import ConfigModal from '../../Modal/ConfigModal'
import EditUserForm from '../../User/EditUserForm'
import AvatarNotFound from '../../../assets/png/avatar-no-found.png'
import { API_HOST } from '../../../utils/constants'
import { checkFollowApi, followUserApi, unfollowUserApi } from '../../../api/follow'
import "./BannerAvatar.scss"

export default function BannerAvatar(props) {
    const { user, currentUser } = props;

    const [showModal, setShowModal] = useState(false);
    const [following, setFollowing] = useState(null);
    const [realodFollow, setRealodFollow] = useState(false)

    const bannerURL = user?.banner ? `${API_HOST}/obtenerBanner?id=${user.id}` : null;
    const avatarURL = user?.avatar ? `${API_HOST}/obtenerAvatar?id=${user.id}` : AvatarNotFound;

    useEffect(() => { // Esto es para que no se ejecute en cada renderizado
        if (user) {
            checkFollowApi(user?.id).then(response => {
                if (response?.status) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
        }
        setRealodFollow(false);
    }, [user, realodFollow]);
    console.log()
    const onFollow = () => {
        followUserApi(user.id).then(() => {
            setRealodFollow(true);
        })
    };

    const onUnfollow = () => {
        unfollowUserApi(user.id).then(() => {
            setRealodFollow(true);
        })
    }

    return (
        <div className='banner-avatar' style={{ backgroundImage: `url('${bannerURL}')` }}>
            <div className='avatar' style={{ backgroundImage: `url('${avatarURL}')` }}></div>
            {user && (
                <div className="options">
                    {currentUser._id === user.id &&
                        <Button onClick={() => setShowModal(true)}>Editar Perfil</Button>
                    }

                    {currentUser._id !== user.id && 
                    following !== null &&
                    (following ? (
                        <Button onClick={onUnfollow} className="unfollow">
                            <span>Siguiendo</span>
                        </Button>
                    ) : (
                        <Button onClick={onFollow}>Seguir</Button>
                    ))}
                    
                </div>
            )}
            <ConfigModal
                show={showModal}
                setShow={setShowModal}
                title="Editar perfil"
            >
                <EditUserForm user={user} setShowModal={setShowModal} />
            </ConfigModal>
        </div>
    )
}
