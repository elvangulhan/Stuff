const plane = document.querySelector("#plane");
let w = 32;
let h = 48;

w /= 2;
h /= 2;

let max_dot = 10;
let time_dot = 100;
let acc_multi = 50;
let time_move = 15;

let mPos    = {
        mX: 0,
        mY: 0
};

let cPos = {
    pX: 0,
    pY: 0
};

/*

// eğer yıldızlar fazladan oluşuyosa kullanılıcak kod 

let removeDot = setInterval(()=>{
    let r = document.getElementsByClassName('plane-dot');
    if(r.length > max_dot)
        r[0].parentNode.removeChild(r[0]);
}, 100);
*/ 

let createDot = setInterval(()=>{
    let dot = document.createElement('div');
    dot.className   = 'plane-dot';
    dot.style.left  = cPos.pX - w;
    dot.style.top   = cPos.pY + h;
    document.body.append(dot);
}, time_dot);


document.addEventListener('mousemove', e => {
    mPos.mX = e.pageX + document.body.scrollLeft;
    mPos.mY = e.pageY - document.body.scrollTop;
    let r = document.getElementsByClassName('plane-dot');
    if(r.length > max_dot)
        r[0].parentNode.removeChild(r[0]);
    else
        createDot();    
});

let movement = setInterval(function(){
    let dist   = Math.abs(Math.sqrt((mPos.mX - cPos.pX)**2 + (mPos.mY - cPos.pY))) / acc_multi;
    let acc    = acc_multi - dist; if (isNaN(acc) || acc < 0) acc = acc_multi;
    let radian = Math.atan2(mPos.mX - (cPos.pX + w), - (mPos.mY - (cPos.pY + h)));
    let degree =  radian * (180 / Math.PI);
    plane.style.transform = 'rotate('+degree+'deg)';
    cPos.pX += (mPos.mX - cPos.pX) / acc;
    cPos.pY += (mPos.mY - cPos.pY) / acc;
    plane.style.setProperty('top',cPos.pY);
    plane.style.setProperty('left',cPos.pX);
}, time_move);

