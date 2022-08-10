import React, {useState} from 'react'
import { Col, Row, Form, Button, Spinner, FormCheck} from 'react-bootstrap'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import { values, size } from 'lodash';
import { toast } from 'react-toastify';
import { isEmailValid } from '../../utils/validations';
import { signInApi, setTokenApi } from '../../api/auth'

import "./SignInForm.scss";

export default function SignInForm(props) {
    const { setRefreshCheckLogin } = props;

    const [formData, setFormData] = useState(initialFormData());
    const [signInLoading, setSignInLoading] = useState(false)
    const [showPassword, setShowPassword] = useState('off');

    const onSubmit = e => {
        e.preventDefault();

        if (validations(formData)){
            setSignInLoading(true)
            signInApi(formData).then(response => {
                if (response.message){
                    toast.error(response.message);
                }else{
                    setTokenApi(response.token);
                    setRefreshCheckLogin(true);
                }
            }).catch(error => {
                toast.error("Error del servidor, inténtalo más tarde");
            }).finally(() => {
                setSignInLoading(false)
            })
        }

    }

    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const onChangeCheck = e => {
        if (showPassword === 'off') {
            setShowPassword('on');
            return;
        }
        setShowPassword('off');
    };

  return (
    <div className='sign-in-form'>
        <h2>Entrar</h2>
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Control type="email" name="email" placeholder="Correo eléctronico" onChange={onChange}></Form.Control>
            </Form.Group>
            <Form.Group>
                {showPassword === 'on' ? 
                    <Form.Control type='text' name="password" placeholder="Contraseña" onChange={onChange} />
                :
                    <Form.Control type='password' name="password" placeholder="Contraseña" onChange={onChange} />}
            </Form.Group>
            <Form.Group>
                <Row>
                    <Col xs={1}>
                        <FormCheck onChange={onChangeCheck} type="switch" id="check"></FormCheck>
                    </Col>
                    <Col xs={11}>
                        <FormCheckLabel>Ver Contraseña</FormCheckLabel>
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="primary" type="submit">
                {!signInLoading ? 'Iniciar Sesión' : <Spinner animation="border" size='sm' />}
            </Button>
        </Form>
    </div>
  )
}

function initialFormData(){
    return {
        email: '',
        password: '',
    }
}

function validations(formData){
    let validCount = 0;

    values(formData).some(value => {
        value && validCount++;
        return null;
    });

    if (validCount !== size(formData)){
        toast.warning("Completa todos los campos");
        return false;
    }
    if (!isEmailValid(formData.email)){
        toast.warning("El correo no es válido");
        return false;
    }
    if (size(formData.password) < 6){
        toast.warning("La contraseña debe tener al menos 6 caracteres");
        return false;
    }
    return true;
}
