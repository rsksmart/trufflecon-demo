import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import axios from 'axios';
import { decode } from 'punycode';
import { TextEncoder } from 'util';

class App extends Component{

  state = { messages: [] }

  async componentWillMount(){

    const that = this;
    var $page = {};
    var actualBlock = null;

    $page.contract_address = '0x969f812F4308BFEd193200BEcE2a1FdcfDCB4F60';
    var apiUrl = "api?module=events&action=getAllEventsByAddress&address=" + $page.contract_address;
    var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://52.67.232.22:4445/websocket"));
    var transform = function(input, apiCall){      
      //TODO: resolve it more elegantly
      if (!apiCall){
        input = "0x" + input.substring(10);
      }

      var it = input.substring(128);
      var filtered = it.slice(0, ((it.search("00") % 2) === 1) ? it.search("00") + 1 : it.search("00"));
      return web3.utils.toAscii("0x" + filtered).substring(1);
    }

    const result = await axios.get(apiUrl);
    var oldMessages = result.data.data.map(i => transform(i.data, true));
    var addresses = result.data.data.map(i => i.address);

    that.setState({ messages: oldMessages });
    that.setState({ addresses });



    web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (error || !result) {
        console.error(error);
        return;
      }

      if (actualBlock == result.number) {
        return;
      }
      else{
        actualBlock = result.number;
      }

      console.log("newblock " + result.number);
      web3.eth.getBlock(result.number, true).then(function(block){
        block.transactions.forEach(function(e) {
          if(e.to.toLowerCase() !== $page.contract_address) return;          
          var message = transform(e.input, false);
          const { messages: allMsg } = that.state;
          allMsg.unshift(message);
          that.setState({ messages: allMsg });
          console.log(message);
        });
      });
    });

  }

  render(){

    return (
      <div className="App">
        <button onClick={()=>{ console.log(this.state.addresses.length); var winner = Math.floor(Math.random() * Math.floor(this.state.addresses.length)); console.log(winner); alert(this.state.addresses[winner]); document.querySelector('li[data-index="' + winner + '"]').classList.add("winner"); }}>spin!</button>
        <ul>
          { this.state.messages.map((m,i) => <li key={i} data-index={i}>{m}</li>) }
        </ul>
      </div>
    );

  }
}

export default App;
