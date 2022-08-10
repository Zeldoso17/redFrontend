import React from 'react'
import {Modal} from 'react-bootstrap'
import LogoBlancoTwittor from "../../../assets/png/logo-white.png"

import "./ModalBasico.scss"

export default function ModalBasico(props) {
    const {show, setShow, children} = props;
  return (
    <Modal
        className="modal-basico"
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
    >

        <Modal.Header>
            <Modal.Title>
                <img src={LogoBlancoTwittor} alt="Twittor"/>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
    </Modal>
  )
}
