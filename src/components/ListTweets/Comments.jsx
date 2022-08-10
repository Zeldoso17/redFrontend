import { useState,useEffect } from 'react'
import { getUserApi } from '../../api/user'
import AvatarNoFound from '../../assets/png/avatar-no-found.png'
import { API_HOST } from '../../utils/constants'
import { replaceURLWithHTMLLinks } from '../../utils/functions'
import { EditCommentTweetApi}from '../../api/coments'
import {  Image } from 'react-bootstrap'
import EliminarBtn from './cerrar'
import moment from 'moment'
import useAuth from "../../hooks/userAuth";
import EditarIcon from './editar'
import Swal from 'sweetalert2'
import Send from '../../assets/Icons/send'
import { DeleteComment } from '../../api/coments'

//este componente viene de tweet
const Comments = ({comentario,user,setComentarioV}) => {
    const [userInfo, setUserInfo] = useState('')
    const [avatarURL, setAvatarURL] = useState(null)
    const [edtiando, setEditando]=useState(false)
    const[NewComment,setNewComment]= useState(comentario.mensaje)

    //sacamos la info del usuario quien sabe como 
    const currentUser = useAuth();

     //identiicar al usurio del comentario
     useEffect(() => {
        getUserApi(comentario.userId).then(response => {
            setUserInfo(response)
            setAvatarURL(
                response?.avatar 
                ? `${API_HOST}/obtenerAvatar?id=${response.id}` 
                : AvatarNoFound
            );
        })
    },[comentario])
    
    //funciones 

    const Recargar = ()=>{
      setComentarioV(false)
      setTimeout(() => {
        setComentarioV(true)
        
      }, 100);
  
    }
    const EditarComment=()=>{
      setEditando(!edtiando)
    }
    const AddChange=(id)=>{
      if(NewComment==''){
        setEditando(false)
      }else{
        EditCommentTweetApi(NewComment,id).then(response => {
          if(response?.code >= 200 && response?.code < 300){
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
                  title: 'Comentario Editado exitosamente!'
                })
              
                
               Recargar()            
          }
        
      })
      .catch(err => {
          console.log(err);
      })
  }
      }
    
    const handleComment = (e)=>{
      setNewComment(e.target.value)
    }
    const DeteleComment = id=>{
   
       if(currentUser._id  == user||comentario.userId==currentUser._id){
        Swal.fire({
            title: 'Estas Seguro ?',
            text: "No Podras Recuperar el Comentario!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, Borrar!'
          }).then((result) => {
            if (result.isConfirmed) {
                DeleteComment(id).then(response=>{
                    if(response?.code >= 200 && response?.code < 300){
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
                          console.log('s') 
                         
                    }
                })

              Swal.fire(
                'Eiminado!',
                'Tu comentario a Sido eliminado con Existo.',
                'success'
              )
              Recargar()
            }
          })
       }
    }

  return (
      <>

    <div className='comentario'>
            { currentUser._id  == user||comentario.userId==currentUser._id? <div className='IconConfig'>
               <EliminarBtn onClick={()=>DeteleComment(comentario._id)} />
                {comentario.userId==currentUser._id?   <EditarIcon onClick={()=>EditarComment(comentario._id)}/>:''}
              
                </div>: ''  }
            
            <div className='flex'>
                <Image className='avatar' src={avatarURL} roundedCircle />
                
                <div className='name'>{userInfo?.nombre} {userInfo?.apellidos}<span>{moment(comentario.fecha).calendar()}</span></div> 
            </div>
            {edtiando?  <div> <input onChange={(e)=>handleComment(e)} className='inputE' type="text" value={NewComment} />  <Send onClick={()=>AddChange(comentario._id)} className='iconSend'/>  </div>  :  <div className='comentarios' dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinks(comentario.mensaje) }} />}
            
        </div>
    </>
  )
}

export default Comments