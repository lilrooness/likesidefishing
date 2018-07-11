import React, { Component } from 'react';
import logo from './logo.svg';
import inv_square from './assets/inventory_square2.png'
import plank_rect from './assets/wood_button.png'
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
      selectedInvItem: "",
      interval_id: ""
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

    var sellCallback = function() {
      if(!t.state.selectedInvItem) {
        return
      }

      var item = Items[t.state.selectedInvItem]

      var i=0;
      for(i=0; i<t.state.inventory; i++) {
        if(t.state.inventory[i] === t.state.selectedInvItem) {
          break;
        }
      }
      var l = t.state.inventory.length
      var newInv = t.state.inventory.slice(0,i).concat(t.state.inventory.slice(i+1, l))
      var newMoney = t.state.money + item.price
      console.log(newMoney)
      t.setState({
        "inventory": newInv,
        "money": newMoney,
        "selectedInvItem": ""
      })

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

    var startFishing = function(rodName, baitName) {
      var rod = Items[rodName]
      var bait = Items[baitName]

      var itemNames = Object.keys(Items)

      var catchableFish = []

      for(var i=0; i<itemNames.length; i++) {
        var item = Items[itemNames[i]]
        if(item.type === "fish" && item.rod_level <= rod.rod_level && item.bait === baitName) {
          catchableFish.push(itemNames[i])
        }
      }

      var intervalId = window.setInterval(function() {

        if(t.state.inventory.length === t.state.inventorySize) {
          return
        }

        var luck = Math.random()
        var choices = []
        for(var i=0; i<catchableFish.length; i++) {
          var fish = Items[catchableFish[i]]
          if(luck > (1 - fish.catch_chance)) {
            choices.push(catchableFish[i])
          }
        }

        if(choices.length > 0) {
          var choice = choices[Math.floor(Math.random() * choices.length)]
          t.setState({
            inventory: t.state.inventory.concat([choice])
          })
        }

      }, 1000)

      t.setState({
        interval_id: intervalId
      })
    }

    var stopFishing = function() {
      window.clearInterval(t.state.interval_id)
    }

    return (
      <div className="App">
        
        <div className="shopButton"
             style={{"backgroundImage": "url(" + plank_rect + ")"}}
             onClick={function(e) {toggleShop()}}><h3>shop</h3></div>
        <div className="moneyLabel" style={{"backgroundImage": "url(" + inv_square + ")"}}><h3>Money ${this.state.money}</h3></div>
        <div className="inventoryButton"
             style={{"backgroundImage": "url(" + plank_rect + ")"}}
             onClick={function(e) {toggleInventory()}}><h3>Inventory</h3></div>

        <Inventory display={this.state.displayInventory}
                   slots={this.state.inventorySize}
                   inventory={this.state.inventory}
                   clickselect={select}/>

        <Shop display={this.state.displayShop}
              slots="20"
              goods={this.state.shopGoods}
              buyCallback={buyCallback}
              sellCallback={sellCallback}/>
        <FishingControlls startFishing={startFishing}
                          stopFishing={stopFishing}
                          selectedInvItem={this.state.selectedInvItem}/>
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

      if(t.state.fishing) {
        t.props.stopFishing()
        t.setState({
          fishing: false
        })
        return
      }

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
        <div className="control" style={{"backgroundImage": "url(" + plank_rect + ")"}} onClick={setRod}>Set rod</div>
        <div className="control" style={{"backgroundImage": "url(" + inv_square + ")"}}>Rod: {this.state.rod}</div>
        <div className="control" style={{"backgroundImage": "url(" + plank_rect + ")"}} onClick={setBait}>Set bait</div>
        <div className="control" style={{"backgroundImage": "url(" + inv_square + ")"}}>Bait: {this.state.bait}</div>
        <div className="control" style={{"backgroundImage": "url(" + plank_rect + ")"}} onClick={castLine}>Cast line</div>
        <div className="control" style={{"backgroundImage": "url(" + inv_square + ")"}}>Fishing: {this.state.fishing?"Yes":"No"}</div>
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
      console.log(`url(${inv_square})`)
      if(t.state.selected == elem) {
        return {
          border: "solid 2px red",
          "backgroundImage": "url(" + inv_square + ")"
        }
      } else {
        return {
          "backgroundImage": "url(" + inv_square + ")",
        }
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
        slots.push(<Slot key={i} style={getDivStyle(i)}/>)
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
        onClick={click}
        style={{"backgroundImage": "url(" + inv_square + ")"}}>
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

      var t = this

      var click = function(selection) {
        t.setState({
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
             }}
             style={{"backgroundImage": "url(" + plank_rect + ")"}}>
          BUY {this.state.selection}
        </div>
        <div className="sellbutton"
              onClick={function(e) {
                t.props.sellCallback()
              }}
              style={{"backgroundImage": "url(" + plank_rect + ")"}}>
          SELL
        </div>
      </div>
      );
  }
}


export default App;
