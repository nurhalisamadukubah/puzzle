//Salsa20 Implementation
var Salsa20 = (function () {
    function Salsa20(key, nonce, counter, sigmaWords) {
        this.rounds = 20; // number of Salsa rounds
        this.sigmaWords = sigmaWords;

        this.keyWords = [];
        this.nonceWords = [0, 0];
        this.counterWords = [0, 0];

        this.block = [];
        this.blockUsed = 64;

        this.setKey(key);
        this.setNonce(nonce);
        this.setCounter(counter);
    }

    Salsa20.prototype.setKey = function(key) {
        for (var i = 0, j = 0; i < 8; i++, j += 4) {
            this.keyWords[i] = (key[j] & 0xff) |
                            ((key[j+1] & 0xff) << 8) |
                            ((key[j+2] & 0xff) << 16) |
                            ((key[j+3] & 0xff) << 24);
            console.log("this.keyWords[i]"+i, this.keyWords[i].toString(16));
        }
        this._reset();
    };

    Salsa20.prototype.setNonce = function(nonce) {
        this.nonceWords[0] = (nonce[0] & 0xff) |
                            ((nonce[1] & 0xff) << 8) |
                            ((nonce[2] & 0xff) << 16) |
                            ((nonce[3] & 0xff) << 24);
        this.nonceWords[1] = (nonce[4] & 0xff) |
                            ((nonce[5] & 0xff) << 8) |
                            ((nonce[6] & 0xff) << 16) |
                            ((nonce[7] & 0xff) << 24);
        console.log("this.nonceWords[0]", this.nonceWords[0].toString(16));
            console.log("this.nonceWords[1]", this.nonceWords[1].toString(16));
            this._reset();
    };

    Salsa20.prototype.setCounter = function(counter) {
        this.counterWords[0] = (counter[0] & 0xff) |
                            ((counter[1] & 0xff) << 8) |
                            ((counter[2] & 0xff) << 16) |
                            ((counter[3] & 0xff) << 24);
        this.counterWords[1] = (counter[4] & 0xff) |
                            ((counter[5] & 0xff) << 8) |
                            ((counter[6] & 0xff) << 16) |
                            ((counter[7] & 0xff) << 24);
        console.log("this.counterWords[0]", this.counterWords[0].toString(16));
            console.log("this.counterWords[1]", this.counterWords[1].toString(16));
            this._reset();
    };

    Salsa20.prototype.getBytes = function(numberOfBytes) {
        var out = new Array(numberOfBytes);
        for (var i = 0; i < numberOfBytes; i++) {
            if (this.blockUsed == 64) {
                this._generateBlock();
                this._incrementCounter();
                this.blockUsed = 0;
            }
            out[i] = this.block[this.blockUsed];
            this.blockUsed++;
        }
        return out;
    };

    Salsa20.prototype.getHexString = function(numberOfBytes) {
        var hex=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
        var out = [];
        var bytes = this.getBytes(numberOfBytes);
        for(var i = 0; i < bytes.length; i++) {
            out.push(hex[(bytes[i] >> 4) & 15]);
            out.push(hex[bytes[i] & 15]);
        }
        return out.join('');
        };

        //belom ngaroh
    Salsa20.prototype.getHexStringArray = function(numberOfBytes) {
        var hex=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
        var out = [];
        var bytes = this.getBytes(numberOfBytes);
        var temp = []
        var count = 1;
        for(var i = 0; i < bytes.length; i++) {
            // out.push(hex[(bytes[i] >> 4) & 15]);
            // out.push(hex[bytes[i] & 15]);

            temp.push(hex[(bytes[i] >> 4) & 15]);
            temp.push(hex[bytes[i] & 15]);
            if(count % 4 == 0){
                out.push(temp.join(''));
                temp = []
            }
            count++;
        }
        return out;
    };

    Salsa20.prototype._reset = function() {
        this.blockUsed = 64;
    };

    Salsa20.prototype._incrementCounter = function() {
        this.counterWords[0] = (this.counterWords[0] + 1) & 0xffffffff;
        if (this.counterWords[0] == 0) {
            this.counterWords[1] = (this.counterWords[1] + 1) & 0xffffffff;
        }
    };

    Salsa20.prototype._generateBlock = function() {
        var j0 = this.sigmaWords[0],
            j1 = this.keyWords[0],
            j2 = this.keyWords[1],
            j3 = this.keyWords[2],
            j4 = this.keyWords[3],
            j5 = this.sigmaWords[1],
            j6 = this.nonceWords[0],
            j7 = this.nonceWords[1],
            j8 = this.counterWords[0],
            j9 = this.counterWords[1],
            j10 = this.sigmaWords[2],
            j11 = this.keyWords[4],
            j12 = this.keyWords[5],
            j13 = this.keyWords[6],
            j14 = this.keyWords[7],
            j15 = this.sigmaWords[3];

            console.log("this.sigmaWords[1]=", this.sigmaWords[1].toString(16));
                console.log("this.sigmaWords[2]=", this.sigmaWords[2].toString(16));



        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
            x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15;

        console.log("X before : ")
        var _x = [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15];
        for (i = 0; i < 16; i++){
            console.log("x-"+i, _x[i].toString(16));
        }

        for (var i = 0; i < this.rounds; i += 2) {
            u = x0 + x12;
            x4 ^= (u<<7) | (u>>>(32-7));
            // console.log("y4", u.toString(16));
            // console.log("(u>>>(32-7))", (u>>>(32-7)).toString(16));
            // console.log("(u<<7)", (u<<7).toString(16));
            // console.log("signed (u<<7) | (u>>>(32-7))", ((u<<7) | (u>>>(32-7))).toString(16));
            // console.log("unsigned (u<<7) | (u>>>(32-7))", (((u<<7) | (u>>>(32-7))) >>> 0).toString(16));
            // console.log("y4 (xor x4) = ", (x4 >>> 0).toString(16));

            u = x4 + x0;
            x8 ^= (u<<9) | (u>>>(32-9));
            // console.log("y8 (xor x8) = ", (x8 >>> 0).toString(16));

            u = x8 + x4;
            x12 ^= (u<<13) | (u>>>(32-13));
            // console.log("y12 (xor x12) = ", (x12 >>> 0).toString(16));

            u = x12 + x8;
            x0 ^= (u<<18) | (u>>>(32-18));
            // console.log("y0 (xor x0) = ", (x0 >>> 0).toString(16));


            u = x5 + x1;
            x9 ^= (u<<7) | (u>>>(32-7));
            // console.log("y9 (xor x9) = ", (x9 >>> 0).toString(16));

            u = x9 + x5;
            x13 ^= (u<<9) | (u>>>(32-9));
            // console.log("y13 (xor x13) = ", (x13 >>> 0).toString(16));

            u = x13 + x9;
            x1 ^= (u<<13) | (u>>>(32-13));
            // console.log("y1 (xor x1) = ", (x1 >>> 0).toString(16));

            u = x1 + x13;
            x5 ^= (u<<18) | (u>>>(32-18));

            u = x10 + x6;
            x14 ^= (u<<7) | (u>>>(32-7));
            u = x14 + x10;
            x2 ^= (u<<9) | (u>>>(32-9));
            u = x2 + x14;
            x6 ^= (u<<13) | (u>>>(32-13));
            u = x6 + x2;
            x10 ^= (u<<18) | (u>>>(32-18));

            u = x15 + x11;
            // console.log("x15 = ", (x15 >>> 0).toString(16));
            // console.log("x11 = ", (x11 ).toString(10));
            // console.log("x15 + x11 = ", (u >>> 0).toString(16));
            x3 ^= (u<<7) | (u>>>(32-7));
            u = x3 + x15;
            // console.log("x3 = ", (x3 >>> 0).toString(16));
            // console.log("x15 = ", (x15 >>> 0).toString(16));
            // console.log("x3 + x15 = ", (u >>> 0).toString(16));
            // console.log("(u>>>(32-9)) = ", (((u>>>(32-9))) >>> 0).toString(16));
            // console.log("(u<<9) | (u>>>(32-9)) = ", (((u<<9) | (u>>>(32-9))) >>> 0).toString(16));
            x7 ^= (u<<9) | (u>>>(32-9));
            u = x7 + x3;
            x11 ^= (u<<13) | (u>>>(32-13));
            u = x11 + x7;
            x15 ^= (u<<18) | (u>>>(32-18));

            // console.log("X column after round : " + i)
            // var _x = [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15];
            // for (i = 0; i < 16; i++){
            //     console.log("x-"+(i), (_x[i] >>> 0).toString(16));
            // }

            u = x0 + x3;
            x1 ^= (u<<7) | (u>>>(32-7));
            u = x1 + x0;
            x2 ^= (u<<9) | (u>>>(32-9));
            u = x2 + x1;
            x3 ^= (u<<13) | (u>>>(32-13));
            u = x3 + x2;
            x0 ^= (u<<18) | (u>>>(32-18));

            u = x5 + x4;
            x6 ^= (u<<7) | (u>>>(32-7));
            u = x6 + x5;
            x7 ^= (u<<9) | (u>>>(32-9));
            u = x7 + x6;
            x4 ^= (u<<13) | (u>>>(32-13));
            u = x4 + x7;
            x5 ^= (u<<18) | (u>>>(32-18));

            u = x10 + x9;
            x11 ^= (u<<7) | (u>>>(32-7));
            u = x11 + x10;
            x8 ^= (u<<9) | (u>>>(32-9));
            u = x8 + x11;
            x9 ^= (u<<13) | (u>>>(32-13));
            u = x9 + x8;
            x10 ^= (u<<18) | (u>>>(32-18));

            u = x15 + x14;
            x12 ^= (u<<7) | (u>>>(32-7));
            u = x12 + x15;
            x13 ^= (u<<9) | (u>>>(32-9));
            u = x13 + x12;
            x14 ^= (u<<13) | (u>>>(32-13));
            u = x14 + x13;
            x15 ^= (u<<18) | (u>>>(32-18));
            

            
        }
        console.log("X row after round : " + i)
        var _x = [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15];
        for (i = 0; i < 16; i++){
            console.log("x-"+(i), (_x[i] >>> 0).toString(16));
        }

        z0 = x0 + j0;
        // console.log("x0 = ", (x0 >>> 0).toString(16));
        // console.log("j0 = ", (j0 >>> 0).toString(16));
        // console.log("z0 = ", (z0 >>> 0).toString(16));
        x1 += j1;
        x2 += j2;
        x3 += j3;
        x4 += j4;
        x5 += j5;
        x6 += j6;
        x7 += j7;
        x8 += j8;
        x9 += j9;
        x10 += j10;
        x11 += j11;
        x12 += j12;
        x13 += j13;
        x14 += j14;
        x15 += j15;
        console.log("After LE : " + i)
        var _x = [z0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15];
        for (i= 0; i < 16; i++){
            console.log("x-"+(i), (_x[i] >>> 0).toString(16));
        }


        this.block[ 0] = ( x0 >>>  0) & 0xff; this.block[ 1] = ( x0 >>>  8) & 0xff;
        this.block[ 2] = ( x0 >>> 16) & 0xff; this.block[ 3] = ( x0 >>> 24) & 0xff;
        this.block[ 4] = ( x1 >>>  0) & 0xff; this.block[ 5] = ( x1 >>>  8) & 0xff;
        this.block[ 6] = ( x1 >>> 16) & 0xff; this.block[ 7] = ( x1 >>> 24) & 0xff;
        this.block[ 8] = ( x2 >>>  0) & 0xff; this.block[ 9] = ( x2 >>>  8) & 0xff;
        this.block[10] = ( x2 >>> 16) & 0xff; this.block[11] = ( x2 >>> 24) & 0xff;
        this.block[12] = ( x3 >>>  0) & 0xff; this.block[13] = ( x3 >>>  8) & 0xff;
        this.block[14] = ( x3 >>> 16) & 0xff; this.block[15] = ( x3 >>> 24) & 0xff;
        this.block[16] = ( x4 >>>  0) & 0xff; this.block[17] = ( x4 >>>  8) & 0xff;
        this.block[18] = ( x4 >>> 16) & 0xff; this.block[19] = ( x4 >>> 24) & 0xff;
        this.block[20] = ( x5 >>>  0) & 0xff; this.block[21] = ( x5 >>>  8) & 0xff;
        this.block[22] = ( x5 >>> 16) & 0xff; this.block[23] = ( x5 >>> 24) & 0xff;
        this.block[24] = ( x6 >>>  0) & 0xff; this.block[25] = ( x6 >>>  8) & 0xff;
        this.block[26] = ( x6 >>> 16) & 0xff; this.block[27] = ( x6 >>> 24) & 0xff;
        this.block[28] = ( x7 >>>  0) & 0xff; this.block[29] = ( x7 >>>  8) & 0xff;
        this.block[30] = ( x7 >>> 16) & 0xff; this.block[31] = ( x7 >>> 24) & 0xff;
        this.block[32] = ( x8 >>>  0) & 0xff; this.block[33] = ( x8 >>>  8) & 0xff;
        this.block[34] = ( x8 >>> 16) & 0xff; this.block[35] = ( x8 >>> 24) & 0xff;
        this.block[36] = ( x9 >>>  0) & 0xff; this.block[37] = ( x9 >>>  8) & 0xff;
        this.block[38] = ( x9 >>> 16) & 0xff; this.block[39] = ( x9 >>> 24) & 0xff;
        this.block[40] = (x10 >>>  0) & 0xff; this.block[41] = (x10 >>>  8) & 0xff;
        this.block[42] = (x10 >>> 16) & 0xff; this.block[43] = (x10 >>> 24) & 0xff;
        this.block[44] = (x11 >>>  0) & 0xff; this.block[45] = (x11 >>>  8) & 0xff;
        this.block[46] = (x11 >>> 16) & 0xff; this.block[47] = (x11 >>> 24) & 0xff;
        this.block[48] = (x12 >>>  0) & 0xff; this.block[49] = (x12 >>>  8) & 0xff;
        this.block[50] = (x12 >>> 16) & 0xff; this.block[51] = (x12 >>> 24) & 0xff;
        this.block[52] = (x13 >>>  0) & 0xff; this.block[53] = (x13 >>>  8) & 0xff;
        this.block[54] = (x13 >>> 16) & 0xff; this.block[55] = (x13 >>> 24) & 0xff;
        this.block[56] = (x14 >>>  0) & 0xff; this.block[57] = (x14 >>>  8) & 0xff;
        this.block[58] = (x14 >>> 16) & 0xff; this.block[59] = (x14 >>> 24) & 0xff;
        this.block[60] = (x15 >>>  0) & 0xff; this.block[61] = (x15 >>>  8) & 0xff;
        this.block[62] = (x15 >>> 16) & 0xff; this.block[63] = (x15 >>> 24) & 0xff;

    };

    return Salsa20;
})();
