
    MVI A,1
    MVI B,1
    MVI D,BH
    LXI H, MEM
LOOP:
    MOV C,A
    MOV M,A
    INX H
    ADD B
    MOV B,C
    DCR D
    JNZ LOOP

    MOV M,A
    HLT
MEM:
