
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { Piston } from '../interfaces/piston';
import { networkInterfaces } from 'os';

//add network discovery
let organServiceURL: string | null = 'http://192.168.100.32:3000'
const ORGAN_SERVICE_PORT = '3000';
export const SERVICE_STORAGE_NAME = 'serviceUrl';

export class OrganService {
    constructor() {
        organServiceURL = this.getServiceIp();
    }

    public setServiceIp(ip: string | null): void {
        const value = `http://${ip}`;
        localStorage.setItem(SERVICE_STORAGE_NAME, value);
        organServiceURL = value;
    }

    public getServiceIp(): string | null {
        return localStorage.getItem(SERVICE_STORAGE_NAME)
    }

    public setPiston(piston: Piston): AxiosPromise {
        return axios.patch(`${organServiceURL}:${ORGAN_SERVICE_PORT}/api/piston`, piston);
    }

    public setPistons(pistons: Array<Piston>): AxiosPromise {
        return axios.patch(`${organServiceURL}:${ORGAN_SERVICE_PORT}/api/pistons`, {pistons: pistons});
    }
}