    LXI H,80H
    MVI M, 2
    INX H
    MVI D, 3
LOOP:    
    
    MVI E, 2
    CALL PrimeTest

    INR D
    MVI A,100
    CMP D
    JZ STOP
    JMP LOOP
    ;JMP STOP

PrimeTest: ;D,E
   

    MOV A,D
    MOV B,E
    
    CALL IsDivisor
    RZ
    INR E
    MOV A,E
    CMP D   
    JZ IsPrime
    JMP PrimeTest
    IsPrime:
    MOV M, D
    INX H
    RET

STOP:
    HLT

IsDivisor: ; A/B
    SUB B
    RZ
    RC
    JMP IsDivisor
