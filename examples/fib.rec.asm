

MVI A,1
CALL Fib
JMP End

Fib: ;A -> HL
    CPI 1
    JZ RetOne
    JC RetOne

    DCR A
    PUSH PSW
    CALL Fib
    POP PSW
    DCR A
    PUSH H
    CALL Fib
    POP D
    DAD D
    RET

    RetOne:
    LXI H,1
    RET

End:
    HLT
