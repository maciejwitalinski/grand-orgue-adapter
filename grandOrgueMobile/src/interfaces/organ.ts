import { Piston } from "./piston";

export interface Organ {
    name: string 
    start: number
    pistons: Array<Piston>
}