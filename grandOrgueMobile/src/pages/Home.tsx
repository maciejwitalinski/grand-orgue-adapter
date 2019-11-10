
import * as config from '../organ.json';
import React, { Component } from 'react';
import './Home.css'; 
import { OrganService } from '../services/organ';

export interface Organ {
  name: string 
  start: number
  pistons: Array<Piston>
}

export interface Piston {
  name: string
  key: number
  on?: boolean
}

class HomePage extends Component<{}, { selectedOrgan: Organ, selectedSet: number, setConfig: Array<any> }> {
  private organService: OrganService = new OrganService();

  constructor(props: any) {
    super(props);

    let selectedOrgan = this.getSelectedOrgan();
    this.state = {selectedOrgan: selectedOrgan, selectedSet: 1, setConfig: []};
  }

  componentDidMount() {
    this.loadSet(1);
  }

  public toggle(selectedOrgan: Organ, piston: any) {
    piston.on = !piston.on;

    this.organService.setPiston(piston);
    this.saveSet(this.state.selectedSet, this.state.setConfig);
    this.setState({...this.state, selectedOrgan: selectedOrgan})
  }

  private getSelectedOrgan() {
    let stored = localStorage.getItem('selectedOrgan');
    let selectedOrgan: Organ = config[0];
    if(stored !== null) {
      selectedOrgan = JSON.parse(stored);
    }
    return selectedOrgan;
  }

  private loadSet(i: number) {
    let stored = localStorage.getItem(`set_${i}`);
    let set = [];

    if(stored !== null) {
      set = JSON.parse(stored);
    } else {
      set = Object.assign([], this.state.selectedOrgan.pistons);
    }
    this.organService.setPistons(set);
    this.setState({...this.state, selectedSet: i, setConfig: set});
    
    return set;
  }

  private saveSet(i: number, config: any): void {
    return localStorage.setItem(`set_${i}`, JSON.stringify(config) );
  }

  public render() {
    //not able to use ionic components - unable to edit css
    return (    
      <div>
        <div className="background"></div>
        <div className="sets">
          <ul>
            {
              [1,2,3,4,5,6,7,8].map(i => {
                return (
                  <li key={i} onTouchStart={() => this.loadSet(i)} className={`${this.state.selectedSet == i ? 'selected': 'unselected'}`}>Set {i}</li> 
                )
              })
            }
          </ul>
        </div>
        <div className="pistons-container">
            <ul>
                {
                  (this.state.setConfig && this.state.setConfig.map((piston) => {
                    return (
                      <li onTouchStart={() => this.toggle(this.state.selectedOrgan, piston)} className={`${piston.on ? 'switchedOn': 'switchedOff'}`} key={piston.key}>
                        {piston.name}
                      </li>
                    )
                  }))
                }
            </ul>
          </div>
      </div>
    );
  }
};

export default HomePage;
