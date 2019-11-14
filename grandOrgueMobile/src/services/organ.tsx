
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { Piston } from '../interfaces/piston';


//add network discovery
export const organServiceURL = 'http://192.168.100.2:3000'

export class OrganService {
    constructor() {
    }

    public setPiston(piston: Piston): AxiosPromise {
        return axios.patch(`${organServiceURL}/api/piston`, piston);
    }

    public setPistons(pistons: Array<Piston>): AxiosPromise {
        return axios.patch(`${organServiceURL}/api/pistons`, {pistons: pistons});
    }
}