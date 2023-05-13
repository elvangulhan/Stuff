import * as engine from "./libraries/engine.js";

let gameBoard   = document.getElementById("gameBoard");

let properties = {
    width:  800,
    height: 600,
    style:  {
        backgroundColor: "#eee",
        border: "1px solid #000"
    }
};

engine.loadBoard(gameBoard,properties);

engine.createObject({
        id: "gameObject1",
        type: "label|nonsolid",
        x: 55,
        y: 25,
        origin: {x: 0, y:0},
        render: true,
        props:{
            label: "Geçen Süre:",
            font: "15px Arial",
            fillStyle: "#000",
            textAlign: "center"
        }
});

engine.createObject({
    id: "block1",
    type: "rectangle|solid",
    x: 0,
    y: engine.getBoard("height"),
    origin: {x: 1, y:-76},
    render: true,
    props:{
        lineWidth: 1,
        strokeStyle: "red",
        endPos: {x:engine.getBoard("width")-2, y:75}
    }
});

engine.createObject({
    id: "block2",
    type: "rectangle|solid",
    x: 350,
    y: 450,
    origin: {x: 0, y:0},
    render: true,
    props:{
        lineWidth: 1,
        strokeStyle: "red",
        endPos: {x:75, y:30}
    }
});

engine.createObject({
    id: "block3",
    type: "rectangle|solid",
    x: 450,
    y: 400,
    origin: {x: 0, y:0},
    render: true,
    props:{
        lineWidth: 1,
        strokeStyle: "red",
        endPos: {x:75, y:30}
    }
});

engine.createObject({
    id: "player",
    type: "rectangle|solid",
    x: 100,
    y: 300,
    origin: {x: 0, y:0},
    render: true,
    props:{
        lineWidth: 1,
        strokeStyle: "blue",
        endPos: {x:50, y:50}
    }
});


window.addEventListener("keydown",function(e){
    if(e.key==="w")
        engine.force("player", engine.Direction.Up, 3, engine.fType.static);
    if(e.key==="a")
        engine.force("player", engine.Direction.Left, 3, engine.fType.static);
    if(e.key==="s")
        engine.force("player", engine.Direction.Down, 3, engine.fType.static);
    if(e.key==="d")
        engine.force("player", engine.Direction.Right, 3, engine.fType.static);    
});

setInterval(() => {
    
    engine.renderAll();
},1);
