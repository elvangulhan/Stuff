const plane = document.querySelector("#plane");
let w = 32;
let h = 48;

w /= 2;
h /= 2;

let max_dot     = 10;
let time_dot    = 200;
let acc_multi   = 50;
let time_move   = 15;
let range_dot   = 100; 

let Pos    = {
        mX: 0,
        mY: 0,
        pX: 0,
        pY: 0
};

let createDot = setInterval(()=>{
    if(Math.abs(Math.sqrt((Pos.mX - Pos.pX)**2 + (Pos.mY - Pos.pY)**2)) < range_dot) return;
    let dot = document.createElement('div');
    dot.className   = 'plane-dot';
    dot.style.left  = (Pos.pX + w) + 'px';
    dot.style.top   = (Pos.pY + h) + 'px';
    dot.style.transformOrigin = "left center";
    let rad = Math.atan2(Pos.mX - Pos.pX + w + 4, - (Pos.mY - Pos.pY + h + 1));
    let degree = rad * (180 / Math.PI);
    dot.style.transform = 'rotate('+degree+'deg)';
    document.body.append(dot);
}, time_dot);


document.addEventListener('mousemove', e => {
    Pos.mX = e.pageX + document.body.scrollLeft;
    Pos.mY = e.pageY - document.body.scrollTop;    
});

let movement = setInterval(function(){
    let dist   =  Math.abs(Math.sqrt((Pos.mX - Pos.pX)**2 + (Pos.mY - Pos.pY)**2)) / acc_multi;
    let acc    = acc_multi - dist; if (isNaN(acc) || acc < 0) acc = acc_multi;
    let radian = Math.atan2(Pos.mX - (Pos.pX + w), - (Pos.mY - (Pos.pY + h)));
    let degree =  radian * (180 / Math.PI);
    plane.style.transform = 'rotate('+degree+'deg)';
    Pos.pX += (Pos.mX - Pos.pX) / acc;
    Pos.pY += (Pos.mY - Pos.pY) / acc;
    plane.style.setProperty('top',Pos.pY + 'px');
    plane.style.setProperty('left',Pos.pX + 'px');
    let r = document.getElementsByClassName('plane-dot');
    if(r.length > max_dot)
        r[0].parentNode.removeChild(r[0]);
    else 
        createDot();
}, time_move);

