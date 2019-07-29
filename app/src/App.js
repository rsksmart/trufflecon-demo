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

    $page.contract_address = '0xa0e51f2ecdc3f4318eff9bf7477d8bfe03938088';
    var apiUrl = "https://backend.explorer.testnet.rsk.co/api?module=events&action=getAllEventsByAddress&address=" + $page.contract_address;
    var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:4445/websocket"));
    var transform = function(input){
      //TODO: resolve it more elegantly
      var it = input.substring(128);
      var filtered = it.slice(0, ((it.search("00") % 2) === 1) ? it.search("00") + 1 : it.search("00"));
      return web3.utils.toAscii("0x" + filtered).substring(1);
    }

    const result = await axios.get(apiUrl);
    console.log(result.data.data)
    var oldMessages = result.data.data.map(i => transform(i.data));
    //var oldMessages = ["Hola!","Hi!","RSK(L)Truffle"];
    that.setState({ messages: oldMessages });

    web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (error || !result) {
        console.error(error);
        return;
      }
      console.log("newblock " + result.number);
      web3.eth.getBlock(result.number, true).then(function(block){
        block.transactions.forEach(function(e) {
          if(e.to.toLowerCase() !== $page.contract_address) return;

          var message = transform(e.input);
          const { messages: allMsg } = that.state;
          allMsg.push(message);
          that.setState({ messages: allMsg });
          console.log(message);
        });
      });
    });

  }

  render(){

    return (
      <div className="App">
        <ul id="">
          { this.state.messages.map((m,i) => <li key={i}>{m}</li>) }
        </ul>
      </div>
    );

  }
}

export default App;
