import { API_HOST } from "../utils/constants";
import { getTokenApi } from "./auth";

export const GetLikes = (IDTweet) => {
    //url
    const url = `${API_HOST}/leerLike/${IDTweet}`;

    //las configuraciones
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenApi()}`
        }
    }
    //iniciamos peticion
    return fetch(url, params)
        .then(response => {
            return response.json();
        })
        .catch(err => {
            return err;
        })
}

export function DarLike(IDTweet) {
    const url = `${API_HOST}/darLike/${IDTweet}`;


    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenApi()}`
        },
    }
    return fetch(url, params).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return { code: response.status, message: 'Te gusto la publicacion' };
        }
        return { code: 500, message: 'Error del servidor' };
    })
        .catch(err => {
            return err;
        })



}