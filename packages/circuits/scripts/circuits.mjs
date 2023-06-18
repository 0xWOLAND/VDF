export const ptauName = "powersOfTau28_hez_final_18.ptau";

export const circuitContents = {
  pietrzak:
    'pragma circom 2.0.0; include "../circuits/pietrzak.circom"; \n\ncomponent main = PietrzakVDF(32);',
  multiplier2:
    'pragma circom 2.0.0; include "../circuits/multiplier2.circom"; \n\ncomponent main = Multiplier2();',
};
