

import Piston from '../pages/Home';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';


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