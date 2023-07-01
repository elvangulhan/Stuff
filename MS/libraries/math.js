export const PI         = 3.14;
export const gravity    = 1;

export function vectorArea(degree){
    let points = {x: 1, y: 1}, 
        area   =
    (0   < degree && degree <= 90)  ? "1.1"   :
	(90  < degree && degree <= 180) ? "-1.1"  :
    (180 < degree && degree <= 270) ? "-1.-1" :
    (270 < degree && degree <= 360) ? "1.-1"  : false;
    if(area){
        let aSplit = area.split(".");
        points.x = aSplit[0];
        points.y = aSplit[1];
    }
    return points;
}

export function degreeRates(degree){
    let powerDegrees = {x: 0.00, y: 0.00};
    let degreeArea   = vectorArea(degree);
    let degreeRatio  =  10 * (degree % 90) / 9; // priorty

    if(degreeArea.x != degreeArea.y)
        if(degreeRatio != 0)
            powerDegrees = {x: degreeRatio, y: 100-degreeRatio};
        else
            powerDegrees = {x: 100-degreeRatio, y: degreeRatio};
    else
        if(degreeRatio != 0)
            powerDegrees = {x: 100-degreeRatio, y: degreeRatio};
        else if(degree==0)
            powerDegrees = {x: 100, y: 0};
        else
            powerDegrees = {x: degreeRatio, y: 100-degreeRatio};
            
    return powerDegrees;
}

