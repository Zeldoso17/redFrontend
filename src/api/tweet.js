import { API_HOST } from "../utils/constants";
import { getTokenApi } from "./auth";

export function createTweetApi(message){
    const url = `${API_HOST}/crearTweet`;
    
    const data = {
        mensaje: message
    }

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenApi()}`
        },
        body: JSON.stringify(data)
    }

    return fetch(url, params)
    .then(response => {
        if(response.status >= 200 && response.status < 300){
            return { code: response.status, message: 'Tweet creado' };
        }
        return { code: 500, message: 'Error del servidor' };
    })
    .catch(err => {
        return err;
    });
}

export function getUserTweetsApi(userId, page){
    const url = `${API_HOST}/leerTweets?id=${userId}&pagina=${page}`;

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenApi()}`
        }
    }

    return fetch(url, params)
    .then(response => {
        return response.json();
    })
    .catch(err => {
        return err;
    })
}

export function getTweetsFollowersApi(page = 1) {
    const url = `${API_HOST}/leoTweetsSeguidores?pagina=${page}`;

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenApi()}`
        }
    }

    return fetch(url, params)
    .then(response => {
        return response.json();
    })
    .catch(err => {
        return err;
    })
}