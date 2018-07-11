import React from 'react';

import simple_rod from './assets/simple_rod.png';
import doughballs from './assets/doughballs.png';
import carp from './assets/carp.png';
import good_pole from './assets/good_pole.png';
import fly_bait from './assets/fly_bait.png';
import worm_bait from './assets/worm_bait.png';
import salmon from './assets/salmon.png';
import trout from './assets/trout.png';

export var Items = {
  "simple rod": {
    "type": "rod",
    "price": 10,
    "catch": ["carp"],
    "rod_level": 1
  },

  "carp": {
    "type": "fish",
    "price": 3,
    "bait": "doughballs",
    "rod_level": 1,
    "catch_chance": 0.2
  },

  "doughballs": {
    "type": "bait",
    "price": 1
  },

  "good pole": {
    "type": "rod",
    "price": 100,
    "catch": ["carp", "trout"],
    "rod_level": 2
  },

  "fly bait": {
    "type": "bait",
    "price": 10
  },

  "worm bait": {
    "type": "bait",
    "price": 8
  },

  "salmon": {
    "type": "fish",
    "price": 20,
    "bait": "fly bait",
    "rod_level": 5,
    "catch_chance": 0.1
  },

  "trout": {
    "type": "fish",
    "price": 8,
    "bait": "worm bait",
    "rod_level": 2,
    "catch_chance": 0.2
  }
}

export var getItemImage = function (itemName) {
  switch(itemName) {
    case "simple rod": 
      return (<img className="icon" src={simple_rod} alt="Simple Rod"/>)
    case "doughballs":
      return (<img className="icon" src={doughballs} alt="Doughballs"/>)
    case "carp":
      return (<img className="icon" src={carp} alt="Carp"/>)
    case "good pole":
      return (<img className="icon" src={good_pole} alt="Good Pole"/>)
    case "fly bait":
      return (<img className="icon" src={fly_bait} alt="Fly Bait"/>)
    case "worm bait":
      return (<img className="icon" src={worm_bait} alt="Worm Bait"/>)
    case "salmon":
      return (<img className="icon" src={salmon} alt="Salmon"/>)
    case "trout":
      return (<img className="icon" src={trout} alt="Trout"/>)
    default:
      return (<div/>)
  }
}