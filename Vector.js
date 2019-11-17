export default class Vector {
    constructor(x,y,z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(v) {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y; 
            this.z += v.z;
        } else {

        }

    }
}