pragma circom 2.0.0;

template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;

    c <== a * b;
}

template Pietrzak() {
    signal input N;
    signal input x;
    signal input T;
    signal input y;

    if (T == 1) {
        y === x * x;
    }

    
}

component main = Multiplier2();