
import * as config from '../organ.json';
import React, { Component } from 'react';
import './Home.css'; 
import { OrganService } from '../services/organ';
import { Piston } from '../interfaces/piston.js';
import { Organ } from '../interfaces/organ.js';

class HomePage extends Component<{}, { selectedOrgan: Organ, selectedSet: number, setConfig: Array<any> }> {
  private organService: OrganService = new OrganService();

  constructor(props: any) {
    super(props);

    let selectedOrgan = this.getSelectedOrgan();
    this.state = {selectedOrgan: selectedOrgan, selectedSet: 1, setConfig: []};
  }

  componentDidMount() {
    this.loadSet(1);

    let ip = this.organService.getServiceIp();
    if(ip === null) {
      this.askForIp();
    }
  }

  public askForIp() {
    let ip = prompt("What is your backend ip address?");
    this.organService.setServiceIp(ip);
  }

  public toggle(selectedOrgan: Organ, piston: Piston): Organ {
    piston.on = !piston.on;

    this.organService.setPiston(piston);
    this.saveSet(this.state.selectedSet, this.state.setConfig);
    this.setState({...this.state, selectedOrgan: selectedOrgan});
    return selectedOrgan;
  }

  private getSelectedOrgan(): Organ {
    let stored = localStorage.getItem('selectedOrgan');
    let selectedOrgan: Organ = config[0];
    if(stored !== null) {
      selectedOrgan = JSON.parse(stored);
    }
    return selectedOrgan;
  }

  private loadSet(i: number): Array<Piston> {
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
        <button className="ipAddrBtn" onClick={this.askForIp.bind(this)}>Set IP Addr</button>
        <div className="sets">
          <ul>
            {
              Array.from(Array(8).keys()).map(i => {
                let index = i + 1;
                return (
                  <li key={index} onTouchStart={() => this.loadSet(index)} className={`${this.state.selectedSet === index ? 'selected': 'unselected'}`}>Set {index}</li> 
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
