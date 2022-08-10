import React, { useState, useCallback } from 'react'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import es from 'date-fns/locale/es'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { API_HOST } from '../../../utils/constants'
import { Camera } from '../../../utils/Icons'
import { uploadBannerApi, uploadAvatarApi, updateInfoApi } from '../../../api/user'

import "./EditUserForm.scss"

export default function EditUserForm(props) {
    const { user, setShowModal } = props;

    const [formData, setFormData] = useState(initialFormData(user));

    const [bannerURL, setBannerURL] = useState(
        user?.banner ? `${API_HOST}/obtenerBanner?id=${user.id}` : null
    );
    const [avatarURL, setAvatarURL] = useState(
        user?.avatar ? `${API_HOST}/obtenerAvatar?id=${user.id}` : null
    );

    const [loading, setLoading] = useState(false);

    const [bannerFile, setBannerFile] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDropBanner = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setBannerURL(URL.createObjectURL(file));
        setBannerFile(file);
    });

    const {
        getRootProps: getRootBannerProps,
        getInputProps: getInputBannerProps
    } = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        multiple: false,
        onDrop: onDropBanner
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDropAvatar = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setAvatarURL(URL.createObjectURL(file));
        setAvatarFile(file);
    });

    const { 
        getRootProps: getRootAvatarProps, 
        getInputProps: getInputAvatarProps 
    } = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        multiple: false,
        onDrop: onDropAvatar
    });

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await subirBanner(bannerFile);
        await subirAvatar(avatarFile);
        await actualizarInfoUsuario(formData, setShowModal, setLoading);
        
    };


    return (
        <div className='edit-user-form'>
            <div
                className="banner"
                style={{ backgroundImage: `url('${bannerURL}')` }}
                {...getRootBannerProps()}
            >
                <input {...getInputBannerProps()} />
                <Camera />
            </div>

            <div
                className="avatar"
                style={{ backgroundImage: `url('${avatarURL}')` }}
                {...getRootAvatarProps()}
            >
                <input {...getInputAvatarProps()} />
                <Camera />
            </div>

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                defaultValue={formData.nombre}
                                onChange={onChange}
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Apellidos"
                                name="apellidos"
                                defaultValue={formData.apellidos}
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        row="3"
                        placeholder="Agrega tu biografía"
                        type="text"
                        name="biografia"
                        defaultValue={formData.biografia}
                        onChange={onChange}
                    />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Sitio web"
                        name="sitioWeb"
                        defaultValue={formData.sitioWeb}
                        onChange={onChange}
                    />
                </Form.Group>
                <br />
                <Form.Group>
                    <DatePicker
                        placeholder="Fecha de nacimiento"
                        locale={es}
                        selected={new Date(formData.fechaNacimiento)}
                        onChange={date => setFormData({ ...formData, fechaNacimiento: date })}
                    />
                </Form.Group>

                <Button className="btn-submit" variant="primary" type="submit">
                    {loading && <Spinner animation="border" size="sm" />} Actualizar
                </Button>
            </Form>
        </div>
    )
}

function initialFormData(user) {
    return {
        nombre: user.nombre || "",
        apellidos: user.apellidos || "",
        biografia: user.biografia || "",
        ubicacion: user.ubicacion || "",
        sitioWeb: user.sitioWeb || "",
        fechaNacimiento: user.fechaNacimiento || ""
    };
}

async function subirBanner(bannerFile) {
    if(bannerFile) {
        await uploadBannerApi(bannerFile).catch(() => {
            toast.error("Error al subir el nuevo banner");
        });
    }
}

async function subirAvatar(avatarFile) {
    if(avatarFile) {
        await uploadAvatarApi(avatarFile).catch(() => {
            toast.error("Error al subir el nuevo avatar");
        });
    }
}

async function actualizarInfoUsuario(user, setShowModal, setLoading) {
    await updateInfoApi(user).then(() => {
        toast.success("Información actualizada");
        setShowModal(false);
    })
    .catch(() => {
        toast.error("Error al actualizar la información");
    })
    .finally(() => {
        setLoading(false);
        window.location.reload();
    })
}
