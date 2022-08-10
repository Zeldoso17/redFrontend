import React, {useState} from 'react'
import { Row, Col, Form, Button, Spinner, FormCheck } from 'react-bootstrap'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import { values, size } from 'lodash'
import { toast } from 'react-toastify'
import { isEmailValid } from '../../utils/validations'
import { signUpApi } from '../../api/auth'

import './SignUpForm.scss'

export default function SignUpForm(props) {
    const { setShowModal } = props

    const [formData, setFormData] = useState(initialFormData());
    const [signUpLoading, setSignUpLoading] = useState(false)
    const [showPassword, setShowPassword] = useState('off')

    const onSubmit = e => {
        e.preventDefault();

        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (validCount !== size(formData)) {
            toast.warning("Completa todos los campos");
            return;
        }
        if (!isEmailValid(formData.email)){
            toast.warning("El email no es valido");
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            toast.warning("Las contraseñas no coinciden");
            return;
        }
        if (size(formData.password) < 6) {
            toast.warning("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        setSignUpLoading(true)
        signUpApi(formData).then(response => {
            if (response.code) {
                toast.error(response.message);
            }else{
                toast.success("Te has registrado exitosamente");
                setShowModal(false);
                setFormData(initialFormData());
            }
        }).catch(err => {
            toast.error("Error del servidor, inténtelo mas tarde");
        }).finally(() => {
            setSignUpLoading(false)
        });
    };

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
    <div className='sign-up-form'>
        <h2>Crea tu cuenta</h2>
        <Form onSubmit={onSubmit}>
            <Form.Group> {/* Form group para el nombre y los apellidos */}
                <Row>
                    <Col>
                        <Form.Control type='text' placeholder='Nombre' name="nombre" defaultValue={formData.nombre} onChange={onChange} />
                    </Col>
                    <Col>
                        <Form.Control type='text' placeholder='Apellidos' name="apellidos" defaultValue={formData.apellidos} onChange={onChange} />
                    </Col>
                </Row>
            </Form.Group>
            <br/>
            <Form.Group>  {/* Form group para el correo */}
                <Form.Control type='email' placeholder='Correo electrónico' name="email" defaultValue={formData.email} onChange={onChange} />
            </Form.Group>
            <br/>
            <Form.Group> {/* Form group para las contraseñas */}
                <Row>
                    <Col>
                        {showPassword === 'on' ? 
                            <Form.Control type='text' placeholder="Contraseña" name="password" defaultValue={formData.password} onChange={onChange}/>
                        :
                            <Form.Control type='password' placeholder="Contraseña" name="password" defaultValue={formData.password} onChange={onChange} />}
                    </Col>
                    <Col>
                        {showPassword === 'on' ? 
                            <Form.Control type='text' placeholder="Contraseña" name="passwordConfirm" defaultValue={formData.passwordConfirm} onChange={onChange}  />
                        :
                            <Form.Control type='password' placeholder="Contraseña" name="passwordConfirm" defaultValue={formData.passwordConfirm} onChange={onChange}  />}
                    </Col>
                </Row>
            </Form.Group>
            <br/>
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
                {!signUpLoading ? "Crear cuenta" : <Spinner animation="border" size="sm" />}
            </Button>
        </Form>
    </div>
  )
}

function initialFormData() {
    return {
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        passwordConfirm: ""
    };
}
