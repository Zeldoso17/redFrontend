import { API_HOST, TOKEN } from '../utils/constants'
import jwtDecode from 'jwt-decode'

export function signUpApi(user){ // Función que hace el llamado a la API para registrar usuario
    const url = `${API_HOST}/registro`;
    const userTemp = {
        ...user,
        email: user.email.toLowerCase(),
        fechaNacimiento: new Date()
    };
    delete userTemp.passwordConfirm;

    const params = {
        method: 'POST',
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userTemp)
    };

    return fetch(url, params).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
        return {code: 404, message: "Email no disponible"};
    }).then(result => {
        return result
    }).catch(err => {
        return err
    });
    
}

export function signInApi(user){ // Función que hace el llamado a la API para loguear usuario
    const url = `${API_HOST}/login`;

    const data = {
        ...user,
        email: user.email.toLowerCase()
    };

    const params = {
        method: 'POST',
        Headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(url, params).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
        return {message: "Usuario y/o contraseña incorrectos"};
    })
    .then(result => {
        return result
    })
    .catch(err => {
        return err
    })

}

export function setTokenApi(token){ // Guarda el token en el localStorage
    localStorage.setItem(TOKEN, token);
}

export function getTokenApi(){ // Devuelve el token del localStorage
    return localStorage.getItem(TOKEN);
}

export function logoutApi(){ // Elimina el token del localStorage
    localStorage.removeItem(TOKEN);
}

export function isUserLoggedApi(){ // Devuelve true si el usuario esta logueado
    const token = getTokenApi();
    if (!token) {
        return null;
    }
    if (isTokenExpired(token)) { // Verifica si el token ha expirado
        logoutApi(); // Si el token ha expirado, elimina el token del localStorage
    }
    return jwtDecode(token); // Devuelve el token decodificado
}

function isTokenExpired(token){ // Devuelve true si el token ha expirado
    const { exp } = jwtDecode(token); // Obtiene la fecha de expiración del token
    const expire = exp * 1000; // Se convierte el tiempo de expiración a milisegundos
    const timeout = expire - Date.now(); // Calcula el tiempo que falta para que expire el token

    return timeout < 0; // Devuelve true si el token ha expirado
}