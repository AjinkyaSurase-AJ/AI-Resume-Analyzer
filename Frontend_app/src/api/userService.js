import config from "../utils/config";
import axios from 'axios'

export async function loginUser(email, password) {
    const url = config.BASE_URL + '/users/signin'
    const body = {email, password}
    try{
        const response = await axios.post(url, body)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function registerUser(body) {
    const url = config.BASE_URL + '/users/signup'
    try {
        const response = await axios.post(url, body)
        return response.data
    } catch (error) {
        throw error
    }
}