import React, { useState } from 'react'
import {Container, Row, Col, Button} from "react-bootstrap" // Importamos los componentes de bootstrap
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSearch, faUsers, faComment} from "@fortawesome/free-solid-svg-icons"
import ModalBasico from "../../components/Modal/ModalBasico"
import SignUpForm from '../../components/SignUpForm'
import SignInForm from '../../components/SignInForm'
import LogoTwittor from "../../assets/png/logo.png"
import LogoBlancoTwittor from "../../assets/png/logo-white.png"

import "./SignInSingUp.scss"

export default function SignInSingUp(props) {
    const { setRefreshCheckLogin } = props;
    const [showModal, setShowModal] = useState(false)
    const [contenidoModal, setContenidoModal] = useState(null)

    const abrirModal = contenido => {
        setShowModal(true);
        setContenidoModal(contenido);
    }

  return (
    <>
        <Container className="signin-signup" fluid>
            <Row>
                <ComponenteIzquierdo />
                <ComponenteDerecho 
                    abrirModal={abrirModal}
                    setShowModal={setShowModal}
                    setRefreshCheckLogin={setRefreshCheckLogin}
                />
            </Row>
        </Container>
        <ModalBasico show={showModal} setShow={setShowModal}>
            {contenidoModal}
        </ModalBasico>
    </>
  );
}

function ComponenteIzquierdo() {
    return (
        <Col className="signin-signup__izquierdo" xs={6}>
            <img src={LogoTwittor} alt="Twittor"/>
            <div>
                <h2>
                <FontAwesomeIcon icon={faSearch} />
                 Sigue lo que te interesa
                </h2>
                <h2>
                  <FontAwesomeIcon icon={faUsers} />
                  Enterate de que esta hablando la gente
                </h2>
                <h2>
                  <FontAwesomeIcon icon={faComment} />
                  Unete a la conversación
                </h2>
            </div>
        </Col>
    );
}

function ComponenteDerecho(props) {
    const {abrirModal, setShowModal, setRefreshCheckLogin} = props;

    return (
        <Col className="signin-signup__derecho" xs={6}>
            <div>
                <img src={LogoBlancoTwittor} alt="Twittor"></img>
                <h2>Mira lo que está pasando en el mundo en este momento</h2>
                <h3>Unete a Twittor hoy mismo.</h3>
                <Button 
                    variant="primary"
                    onClick={() => abrirModal(<SignUpForm setShowModal={setShowModal} />)}
                >
                    Registrate
                </Button>
                <Button 
                    variant="outline-primary"
                    onClick={() => abrirModal(<SignInForm setRefreshCheckLogin={setRefreshCheckLogin} />)}
                >
                    Iniciar Sesión
                </Button>
            </div>
        </Col>
    );
}