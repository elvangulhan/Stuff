import * as math from "./math.js";

// GLOBAL VARIABLES
let changeLogCounter    = 0;
let changeLogFrom       = {0: "BOARD", 1: "OBJECT", 2: "RENDER"};

export const Direction  = {
    Up: 90,
    Down: 270,
    Left: 180,
    Right: 0
}

export const fType      = {
    static: 0,
    dynamic: 1
}

// BOARD VARIABLES
let _board      = null;
let _boardText  = null;

// OBJECT VARIABLES
let _ObjectList = [];

// RENDER VARIABLES
let _renderList = [];


function changeLog(desc,from){
    /*
        It is used to log to the console or another recording side when there is any change.
        Arguments (mandatory): description, from
    */
    let output = "["+changeLogFrom[from]+"] #"+changeLogCounter+": "+desc;
    console.log(output); // console.log, .log file or anything else
    changeLogCounter++;
}

function changeObject(source, data){
    Object.keys(data).forEach(function(key){
        let type    = typeof(data[key]);
        (type !== 'object') ? source[key] = data[key] :
                            Object.keys(data[key]).forEach(function(cKey){
                                source[key][cKey] = data[key][cKey];
                            });
    });
}

export function loadBoard(board, properties){
    /*
        It is the object that contains the game screen. It needs to be defined and set in the first place.
        arguments (mandatory): 
            board (HTML canvas), 
            properties (HTML canvas properties: width, height, style.backgroundColor etc..)
    */
    let fBack = false;
    if(board){
        _board      = board;
        let m       = setBoard(properties);
        _boardText  = _board.getContext("2d");
        if(m)
            fBack   = true;
                if(fBack)
                    changeLog("board successfully loaded.", 0);
    }else{
        changeLog("failed to load board.", 0);
    }
    return fBack;
}

export function setBoard(properties){
    let fBack   = false;
    if(!_board){
        changeLog("board needs to be loaded before set-update.", 0);
        return fBack;
    }
    changeObject(_board, properties);
    changeLog("board has been set-updated.", 0);
    return fBack;
}

export function getBoard(keyAddress=null){
    let _tBoard = _board;
    if(keyAddress && _board!=null){
        keyAddress.split(".").forEach(function(key){
            _tBoard = _tBoard[key];
        });
    }
    return _tBoard;
}

export function clearBoard(){
    _boardText.clearRect(0, 0, getBoard("width"), getBoard("height"));
}

export function createObject(object){
    if(object){
        /*
            Fixed Props:
                ID (String/Text),
                Type (String) [label,rectangle,circle],
                X-axis (Integer),
                Y-axis (Integer),
                render (Bool)
        */
        object["type"]          = object["type"].split("|")[0];
        object["material"]      = object["type"].split("|")[1];
        object["physics"]       = {
                                    degree: 0,
                                    xF: 0,
                                    yF: 0,
                                    friction: 0,
                                    mass: 0
        };
        _ObjectList[object.id]  = object;
        if(object.render)
            addRenderList(object.id);
        changeLog(object.id+" has been created.", 1);
    }
}

export function setObject(objectID, props){
    if(objectID && props)
        changeObject(_ObjectList[objectID], props);
}

export function getObject(oID, address=null){
    if(!address)
        return _ObjectList[oID];
    
    let value = _ObjectList[oID];
    if(oID){
        address.split(".").forEach(function(key){
            value = value[key];
        });
    }
    return value;
}

function drawObject(obj, objPos){
    switch(obj.type){
        case "label":
            Object.keys(obj.props).forEach(function(key){
                _boardText[key] = obj.props[key];
            });
            _boardText.fillText(obj.props.label, objPos.x, objPos.y);
        break;
        case "line":
            Object.keys(obj.props).forEach(function(key){
                _boardText[key] = obj.props[key];
            });
            _boardText.beginPath();
            _boardText.moveTo(objPos.x, objPos.y);
            _boardText.lineTo(obj.props.endPos.x, obj.props.endPos.y);
            _boardText.stroke();    
        break;
        case "rectangle":
            Object.keys(obj.props).forEach(function(key){
                _boardText[key] = obj.props[key];
            });
            _boardText.beginPath();
            _boardText.rect(objPos.x, objPos.y, obj.props.endPos.x, obj.props.endPos.y);
            _boardText.stroke();    
        break;
    }
    
}

export function addRenderList(rObjectID){
    _renderList.push(rObjectID);
}

export function getRenderList(){
    return _renderList;
}

export function renderAll(){
    if(_renderList){
        clearBoard();
        for(let i = 0; i < _renderList.length; i++){
            let _object     = getObject(_renderList[i]); 
            let _objectPos  = {x: _object.x + _object.origin.x, y: _object.y + _object.origin.y};

            objectMove(_object.id);

            drawObject(_object, _objectPos);
        }
    }else{
        changeLog("Render list is empty", 3);
    }
}

function objectMove(objectID){
    if(objectID){
        let _obj = _ObjectList[objectID];
        if(_obj.physics.xF != 0 || _obj.physics.yF != 0){
            _obj.x += _obj.physics.xF;
            _obj.y += _obj.physics.yF;

            let sign = {
                        xM: (_obj.physics.xF >= 0 ? 1 : -1), 
                        yM: (_obj.physics.yF >= 0 ? 1 : -1)
                    };
            let nF   = 0.1; // negative force
            _obj.physics.xF -=  sign.xM * nF;
            _obj.physics.yF -=  sign.yM * nF;

            _obj.physics.xF  = (sign.xM == 1  && _obj.physics.xF < 0) ? 0 : 
                               (sign.xM == -1 && _obj.physics.xF > 0) ? 0 :
                               _obj.physics.xF;

            _obj.physics.yF  = (sign.yM == 1  && _obj.physics.yF < 0) ? 0 : 
                               (sign.yM == -1 && _obj.physics.yF > 0) ? 0 :
                               _obj.physics.yF;
        }
    }
}

export function force(objectID, degree, _f, fType = fType.dynamic){
    if(objectID && _f > 0){
        let objPhysics  = _ObjectList[objectID].physics;
        let dRates      = math.degreeRates(degree);
        let _df         = math.vectorArea(degree);
        let _fS         = {
                            fx: _f * dRates.x / 100 * _df.x, 
                            fy: _f * dRates.y / 100 * _df.y
        };
        
        if(Math.abs(Math.abs(objPhysics.xF) + Math.abs(_fS.fx)) >= Math.abs(_f) && !fType)
            _fS.fx = (Math.abs(objPhysics.xF) - Math.abs(_f)) * -_df.x;

        if(Math.abs(Math.abs(objPhysics.yF) + Math.abs(_fS.fy)) >= Math.abs(_f) && !fType)
            _fS.fy = (Math.abs(objPhysics.yF) - Math.abs(_f)) * -_df.y;

        objPhysics.degree    = degree;
        objPhysics.xF       += _fS.fx;
        objPhysics.yF       -= _fS.fy; // -math.gravity 

        objectMove(objectID);
    }
}