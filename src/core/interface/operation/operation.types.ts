export enum OPERATION {
    DAA,
    STC,
    CMC,
    CMA,

    RLC,
    RAL,
    RRC,
    RAR,

    ADD,
    ADC,
    SUB,
    SBB,

    ANA,
    XRA,
    ORA,
    CMP,

    ADI,
    ACI,
    SUI,
    SBI,

    ANI,
    XRI,
    ORI,
    CPI,

    INR,
    DCR,

    DAD,
    INX,
    DCX,
    LXI,
    LDAX,
    LDA,
    STAX,
    STA,
    SHLD,
    LHLD,

    XTHL,
    SPHL,
    XCHG,

    PCHL,

    MOV,
    MVI,
    PUSH,
    POP,


    NOP,
    HLT,


    RET,   //Return
    RNZ,   //Return NOT Zero
    RZ,     //Return Zero
    RNC,   //Return NOT Carry
    RC,     //Return Carry
    RPO,   //Return Parity Odd
    RPE,   //Return Parity Even
    RP,     //Return Positive
    RM,     //Return Negative

    JMP,   //Jump
    JNZ,   //Jump NOT Zero
    JZ,     //Jump Zero
    JNC,   //Jump NOT Carry
    JC,     //Jump Carry
    JPO,   //Jump Parity Odd
    JPE,   //Jump Parity Even
    JP,     //Jump Positive
    JM,     //Jump Negative

    CALL, //Call
    CNZ,   //Call NOT Zero
    CZ,     //Call Zero
    CNC,   //Call NOT Carry
    CC,     //Call Carry
    CPO,   //Jump Parity Odd
    CPE,   //Call Parity Even
    CP,     //Call Positive
    CM,     //Call Negative


    _, // NOT IMPLEMENTED
}

// console.log(Object.keys(OPERATION));
console.log('length', Object.keys(OPERATION).length);
