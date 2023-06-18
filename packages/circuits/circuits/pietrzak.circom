pragma circom 2.0.0;

include "./circomlib/circuits/sha256/sha256.circom";
include "./circomlib/circuits/comparators.circom";

// a ^ b = out
template Pow() {
    signal input a;
    signal input b;
    signal output out; 

    // if (0 <= b && b <=  256) {

    // }

    signal x[256];

    x[0] <== 1;
    for(var i = 0; i < 255; i++){
        x[i + 1] <-- x[i] * a;
        x[i] === 3;
    }

    out <== b;
}

template PietrzakVDF(MIN_TIMESTAMP) {

    signal input y;
    signal input g;
    signal input pi;
    signal input L;
    signal input T;
    signal output out;
    
    component valid_t = GreaterEqThan(252);
    valid_t.in[0] <== T;
    valid_t.in[1] <== MIN_TIMESTAMP;

    valid_t.out === 1;
    // T === 10;
    // component p = Pow();
    // p.a <== 2;
    // p.b <== T;

    // signal r <== p.out;    

    // component pi_pow = Pow();
    // pi_pow.a <== pi;
    // pi_pow.b <== L;

    // component g_pow = Pow();
    // g_pow.a <== g;
    // g_pow.b <== r;


    // out <== (pi_pow.out * g_pow.out) % G;
}