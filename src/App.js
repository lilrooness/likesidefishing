import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Items} from './items.js'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      money: 50,
      inventory: [],
      inventorySize: 15,
      shopGoods: Object.keys(Items),
      displayShop: true,
      displayInventory: true,
      selectedInvItem: ""
    }
  }

  render() {

    var t = this;

    var buyCallback = function(itemName) {
      var item = Items[itemName]

      if(item && t.state.inventory.length < t.state.inventorySize && (t.state.money - item.price) >= 0) {
        t.setState({
          money: t.state.money - item.price,
          inventory: t.state.inventory.concat([itemName])
        })
      }
    }

    var toggleShop = function() {
      t.setState({
        displayShop: !t.state.displayShop
      })
    }

    var toggleInventory = function() {
      t.setState({
        displayInventory: !t.state.displayInventory
      })
    }

    var select = function(item) {
      t.setState({
        selectedInvItem: item
      })
      console.log(item)
    }

    var startFishing = function(rod, bait) {
      // TODO: implement fishing
    }

    return (
      <div className="App">
        
        <div className="shopButton" onClick={function(e) {toggleShop()}}><h3>shop</h3></div>
        <div className="moneyLabel"><h3>${this.state.money}</h3></div>
        <div className="inventoryButton" onClick={function(e) {toggleInventory()}}><h3>Inventory</h3></div>

        <Inventory display={this.state.displayInventory}
                   slots={this.state.inventorySize}
                   inventory={this.state.inventory}
                   clickselect={select}/>

        <Shop display={this.state.displayShop}
              slots="20"
              goods={this.state.shopGoods}
              buyCallback={buyCallback}/>
        <FishingControlls startFishing={startFishing} selectedInvItem={this.state.selectedInvItem}/>
      </div>
    );
  }
}

class FishingControlls extends Component {

  constructor(props) {
    super(props)

    this.state = {
      rod: "",
      bait: "",
      fishing: false
    }
  }

  render() {

    var t = this

    var setRod = function() {
      var item = Items[t.props.selectedInvItem]
      if(item && item.type === "rod") {
        t.setState({
          rod: t.props.selectedInvItem
        })
      }
    }

    var setBait = function() {
      var item = Items[t.props.selectedInvItem]
      if(item && item.type === "bait") {
        t.setState({
          bait: t.props.selectedInvItem
        })
      }
    }

    var castLine = function() {
      if(t.state.rod === "" || t.state.bait === "") {
        return
      }

      t.props.startFishing(t.state.rod, t.state.bait)
      t.setState({
        fishing: true
      })

    }

    return(
      <div className="fishingControlls">
        <div className="control" onClick={setRod}>Set rod</div>
        <div className="control">Rod: {this.state.rod}</div>
        <div className="control" onClick={setBait}>Set bait</div>
        <div className="control">Bait: {this.state.bait}</div>
        <div className="control" onClick={castLine}>Cast line</div>
        <div className="control">Fishing: {this.state.fishing?"Yes":"No"}</div>
      </div>
      );
  }
}

class Slot extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: this.props.selected
    }
  }

  render() {
    var t = this

    var click = function(e) {
      if(t.props.item) {
        t.props.click(t.props.item, t.props.id)
        t.setState({
          selected: true
        })
      }
    }

    return (
      <div onClick={click} className="slot" style={this.props.style}>
        {this.props.containsGood? this.props.item : "-"}
      </div>);
  }
}

class Inventory extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: -1
    }
  }

  render() {

    if(!this.props.display) {
      return (<div/>)
    }

    var t = this;

    var getDivStyle = function(elem) {
      if(t.state.selected == elem) {
        return {
          border: "solid 2px red"
        }
      } else {
        return {}
      }
    }

    var slots = []
    for(var i=0; i<this.props.slots; i++) {
      if(i < this.props.inventory.length) {
        slots.push(<Slot 
          key={i}
          id={i}
          item={this.props.inventory[i]}
          containsGood={true}
          style={getDivStyle(i)}
          click={function(item, key) {
            t.props.clickselect(item)
            t.setState({
              selected: key
            })
          }}
        />)
      } else {
        slots.push(<Slot key={i}/>)
      }
    }

    return(
      <div className="inventory">
        {slots}
      </div>
    );
  }
}

class ShopSlot extends Component {

  constructor(props) {
    super(props)

    this.state = {
      contains: this.props.good,
      containsGood: this.props.containsGood
    }
  }

  render() {
    var t = this

    var click = function(e) {
      t.props.click(t.state.contains)
    }

    return (<div className="shop_slot"
        onClick={click}>
        {this.state.containsGood? "$"+Items[this.state.contains]["price"] : ""}
        {" "}        
        {this.state.contains}
    </div>);
  }
}

class Shop extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: false,
      selection: ""
    }
  }

  render() {

    if(!this.props.display) {
      return <div/>;
    }

    var slots = []

    for(var i=0; i<this.props.slots; i++) {
      var good = ""
      var containsGood = false
      if(i<this.props.goods.length) {
        good = this.props.goods[i]
        containsGood = true
      }

      var parent = this

      var click = function(selection) {
        parent.setState({
          selected: true,
          selection: selection
        })
      }

      slots.push(
        <ShopSlot
          click={function(item) {click(item)}} 
          key={i}
          good={good}
          containsGood={containsGood}
        />)
    }

    var t = this;

    return (
      <div className="shop">
        {slots}
        <div className="buybutton" 
             onClick={function(e){
              t.props.buyCallback(t.state.selection)
            }}>
          BUY {this.state.selection}
        </div>
      </div>
      );
  }
}


export default App;
