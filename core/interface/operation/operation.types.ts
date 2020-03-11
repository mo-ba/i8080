export enum OPERATION {
    ADD = 'ADD',
    ADC = 'ADC',
    SUB = 'SUB',
    SBB = 'SBB',

    ANA = 'ANA',
    XRA = 'XRA',
    ORA = 'ORA',
    CMP = 'CMP',

    ADI = 'ADI',
    ACI = 'ACI',
    SUI = 'SUI',
    SBI = 'SBI',

    ANI = 'ANI',
    XRI = 'XRI',
    ORI = 'ORI',
    CPI = 'CPI',

    INR = 'INR',
    DCR = 'DCR',

    DAD = 'DAD',
    INX = 'INX',
    DCX = 'DCX',

    MOV = 'MOV',
    MVI = 'MVI',
    PUSH = 'PUSH',
    POP = 'POP',



    NOP = 'NOP',
    HLT = 'HLT',


    RET = 'RET',   //Return
    RNZ = 'RNZ',   //Return NOT Zero
    RZ = 'RZ',     //Return Zero
    RNC = 'RNC',   //Return NOT Carry
    RC = 'RC',     //Return Carry
    RPO = 'RPO',   //Return Parity Odd
    RPE = 'RPE',   //Return Parity Even
    RP = 'RP',     //Return Positive
    RM = 'RM',     //Return Negative

    JMP = 'JMP',   //Jump
    JNZ = 'JNZ',   //Jump NOT Zero
    JZ = 'JZ',     //Jump Zero
    JNC = 'JNC',   //Jump NOT Carry
    JC = 'JC',     //Jump Carry
    JPO = 'JPO',   //Jump Parity Odd
    JPE = 'JPE',   //Jump Parity Even
    JP = 'JP',     //Jump Positive
    JM = 'JM',     //Jump Negative

    CALL = 'CALL', //Call
    CNZ = 'CNZ',   //Call NOT Zero
    CZ = 'CZ',     //Call Zero
    CNC = 'CNC',   //Call NOT Carry
    CC = 'CC',     //Call Carry
    CPO = 'JPO',   //Jump Parity Odd
    CPE = 'CPE',   //Call Parity Even
    CP = 'CP',     //Call Positive
    CM = 'CM',     //Call Negative
}
