import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import moment from 'moment'
import AvatarNoFound from '../../assets/png/avatar-no-found.png'
import { API_HOST } from '../../utils/constants'
import { getUserApi } from '../../api/user'
import { replaceURLWithHTMLLinks } from '../../utils/functions'
import Send from '../../assets/Icons/send'
import { createCommentTweetApi, GetComments } from '../../api/coments'
import './ListTweets.scss'
import Swal from 'sweetalert2'
import Comments from './Comments'
import Spinner from './Spinner'

function Tweet(props) {
    const { tweet } = props;
    const [userInfo, setUserInfo] = useState(null)
    const [avatarURL, setAvatarURL] = useState(null)
    const [comentarioV, setComentarioV] = useState(false)
    const [comentario, setComentario] = useState('')
    const [cargando, setCargando] = useState(false)
    const [comentarios, setComentarios] = useState(null)



    //use efect para sacar la informacion del usuario del tweet
    useEffect(() => {
        getUserApi(tweet.userId).then(response => {
            setUserInfo(response)
            setAvatarURL(
                response?.avatar
                    ? `${API_HOST}/obtenerAvatar?id=${response.id}`
                    : AvatarNoFound
            );
        })
    }, [tweet]);

    //useefect para los comentarios de los tweet
    useEffect(() => {

    }, [tweet])

    const CrearComentario = async () => {
        if (comentario === '') {
            return
        }
        createCommentTweetApi(comentario, tweet._id).then(response => {
            if (response?.code >= 200 && response?.code < 300) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Comentario Creado exitosamente!'
                })

                setComentarioV(false)
                setTimeout(() => {
                    setComentarioV(true)

                }, 100);



            }
            setComentario("");
        })
            .catch(err => {
                console.log(err);
            })
    }
    const handleCommments = () => {
        setCargando(true)
        GetComments(tweet._id).then(response => {
            setComentarios(response)



        })
        setTimeout(() => {
            setCargando(false)
        }, 500);
    }

    useEffect(() => {
        handleCommments()
    }, [comentarioV])

    return (
        <div onClick={() => console.log(tweet._id)} className='tweetCotainer'>
            <div className='tweet'>
                <Image className='avatar' src={avatarURL} roundedCircle />
                <div>
                    <div className='name'>
                        {userInfo?.nombre} {userInfo?.apellidos}
                        <span>{moment(tweet.fecha).calendar()}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinks(tweet.mensaje) }} />
                </div>
            </div>
            <div className='optionsCointainer'>
                <p onClick={() => setComentarioV(!comentarioV)} htmlFor='comentario'>Comentar</p>
            </div>
            {comentarioV ? <div> <input value={comentario} onChange={(e) => setComentario(e.target.value)} name={comentario} id='comentario' placeholder='Agrega un comentario...' className='input' type="text" />
                <Send onClick={CrearComentario} className='iconSend' /></div> : ''}

            {comentarioV ?
                <div className='ContainerComentarios'>

                    {cargando ? <Spinner /> : comentarios ? comentarios.map(comentario => (
                        <Comments
                            setComentarioV={setComentarioV}
                            user={tweet.userId}
                            key={comentario._id}
                            comentario={comentario}
                        />
                    ))

                        : "No hay Comentarios"}


                </div>
                : ''


            }

        </div>
    )
}
export default Tweet;