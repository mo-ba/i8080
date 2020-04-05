import {
    HighLow,
    IFetchDecode,
    IHasProgramCounter,
    IMemory,
    IRegister,
    OPERATION,
    OperationT,
    REGISTER
} from "../interface";
import {xIncrement} from "../util";


export const XRMAP: { [n: number]: OperationT } = {}


class FetchDecode implements IFetchDecode {


    constructor(
        private readonly memory: IMemory,
        private readonly register: IHasProgramCounter,
    ) {
    }

    next(): OperationT {

        const opcode = this.fetch()
        const op = this.decode(opcode)
        XRMAP[opcode] = op;
        return op

    }

    private fetch(): number {
        const val = this.memory.load(this.getProgramCounter())
        return val;
    }

    private getProgramCounter(): HighLow {
        const counter = this.register.getProgramCounter();
        this.register.setProgramCounter(xIncrement(counter));
        return counter;
    }

    private fetchWord(): HighLow {
        const low = this.fetch()
        const high = this.fetch()

        return {low, high}
    };


    private decode(opCode: number): OperationT {


        switch (opCode) {

            case 0x07:
                return {type: OPERATION.RLC};
            case 0x0f:
                return {type: OPERATION.RRC};
            case 0x17:
                return {type: OPERATION.RAL};
            case 0x1f:
                return {type: OPERATION.RAR};

            case 0x27:
                return {type: OPERATION.DAA};
            case 0x2f:
                return {type: OPERATION.CMA};
            case 0x37:
                return {type: OPERATION.STC};
            case 0x3f:
                return {type: OPERATION.CMC};

            case 0x03:
                return {type: OPERATION.INX, register: REGISTER.B};
            case 0x13:
                return {type: OPERATION.INX, register: REGISTER.D};
            case 0x23:
                return {type: OPERATION.INX, register: REGISTER.H};
            case 0x33:
                return {type: OPERATION.INX, register: REGISTER.SP};

            case 0x01:
                return {type: OPERATION.LXI, register: REGISTER.B, value: this.fetchWord()};
            case 0x11:
                return {type: OPERATION.LXI, register: REGISTER.D, value: this.fetchWord()};
            case 0x21:
                return {type: OPERATION.LXI, register: REGISTER.H, value: this.fetchWord()};
            case 0x31:
                return {type: OPERATION.LXI, register: REGISTER.SP, value: this.fetchWord()};


            case 0x02:
                return {type: OPERATION.STAX, register: REGISTER.B,};
            case 0x12:
                return {type: OPERATION.STAX, register: REGISTER.D};
            case 0x22:
                return {type: OPERATION.SHLD, value: this.fetchWord()};
            case 0x32:
                return {type: OPERATION.STA, value: this.fetchWord()};


            case 0x0a:
                return {type: OPERATION.LDAX, register: REGISTER.B,};
            case 0x1a:
                return {type: OPERATION.LDAX, register: REGISTER.D};
            case 0x2a:
                return {type: OPERATION.LHLD, value: this.fetchWord()};
            case 0x3a:
                return {type: OPERATION.LDA, value: this.fetchWord()};

            case 0x0b:
                return {type: OPERATION.DCX, register: REGISTER.B};
            case 0x1b:
                return {type: OPERATION.DCX, register: REGISTER.D};
            case 0x2b:
                return {type: OPERATION.DCX, register: REGISTER.H};
            case 0x3b:
                return {type: OPERATION.DCX, register: REGISTER.SP};

            case 0x09:
                return {type: OPERATION.DAD, register: REGISTER.B};
            case 0x19:
                return {type: OPERATION.DAD, register: REGISTER.D};
            case 0x29:
                return {type: OPERATION.DAD, register: REGISTER.H};
            case 0x39:
                return {type: OPERATION.DAD, register: REGISTER.SP};

            case 0x04:
                return {type: OPERATION.INR, register: REGISTER.B};
            case 0x0c:
                return {type: OPERATION.INR, register: REGISTER.C};
            case 0x14:
                return {type: OPERATION.INR, register: REGISTER.D};
            case 0x1c:
                return {type: OPERATION.INR, register: REGISTER.E};
            case 0x24:
                return {type: OPERATION.INR, register: REGISTER.H};
            case 0x2c:
                return {type: OPERATION.INR, register: REGISTER.L};
            case 0x34:
                return {type: OPERATION.INR, register: REGISTER.M};
            case 0x3c:
                return {type: OPERATION.INR, register: REGISTER.A};

            case 0x05:
                return {type: OPERATION.DCR, register: REGISTER.B};
            case 0x0d:
                return {type: OPERATION.DCR, register: REGISTER.C};
            case 0x15:
                return {type: OPERATION.DCR, register: REGISTER.D};
            case 0x1d:
                return {type: OPERATION.DCR, register: REGISTER.E};
            case 0x25:
                return {type: OPERATION.DCR, register: REGISTER.H};
            case 0x2d:
                return {type: OPERATION.DCR, register: REGISTER.L};
            case 0x35:
                return {type: OPERATION.DCR, register: REGISTER.M};
            case 0x3d:
                return {type: OPERATION.DCR, register: REGISTER.A};


            case 0x06:
                return {type: OPERATION.MVI, to: REGISTER.B, value: this.fetch()};
            case 0x0e:
                return {type: OPERATION.MVI, to: REGISTER.C, value: this.fetch()};
            case 0x16:
                return {type: OPERATION.MVI, to: REGISTER.D, value: this.fetch()};
            case 0x1e:
                return {type: OPERATION.MVI, to: REGISTER.E, value: this.fetch()};
            case 0x26:
                return {type: OPERATION.MVI, to: REGISTER.H, value: this.fetch()};
            case 0x2e:
                return {type: OPERATION.MVI, to: REGISTER.L, value: this.fetch()};
            case 0x36:
                return {type: OPERATION.MVI, to: REGISTER.M, value: this.fetch()};
            case 0x3e:
                return {type: OPERATION.MVI, to: REGISTER.A, value: this.fetch()};

            case 0x40:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.B};
            case 0x41:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.C};
            case 0x42:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.D};
            case 0x43:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.E};
            case 0x44:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.H};
            case 0x45:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.L};
            case 0x46:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.M};
            case 0x47:
                return {type: OPERATION.MOV, to: REGISTER.B, from: REGISTER.A};

            case 0x48:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.B};
            case 0x49:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.C};
            case 0x4a:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.D};
            case 0x4b:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.E};
            case 0x4c:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.H};
            case 0x4d:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.L};
            case 0x4e:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.M};
            case 0x4f:
                return {type: OPERATION.MOV, to: REGISTER.C, from: REGISTER.A};

            case 0x50:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.B};
            case 0x51:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.C};
            case 0x52:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.D};
            case 0x53:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.E};
            case 0x54:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.H};
            case 0x55:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.L};
            case 0x56:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.M};
            case 0x57:
                return {type: OPERATION.MOV, to: REGISTER.D, from: REGISTER.A};

            case 0x58:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.B};
            case 0x59:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.C};
            case 0x5a:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.D};
            case 0x5b:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.E};
            case 0x5c:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.H};
            case 0x5d:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.L};
            case 0x5e:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.M};
            case 0x5f:
                return {type: OPERATION.MOV, to: REGISTER.E, from: REGISTER.A};

            case 0x60:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.B};
            case 0x61:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.C};
            case 0x62:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.D};
            case 0x63:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.E};
            case 0x64:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.H};
            case 0x65:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.L};
            case 0x66:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.M};
            case 0x67:
                return {type: OPERATION.MOV, to: REGISTER.H, from: REGISTER.A};

            case 0x68:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.B};
            case 0x69:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.C};
            case 0x6a:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.D};
            case 0x6b:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.E};
            case 0x6c:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.H};
            case 0x6d:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.L};
            case 0x6e:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.M};
            case 0x6f:
                return {type: OPERATION.MOV, to: REGISTER.L, from: REGISTER.A};

            case 0x70:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.B};
            case 0x71:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.C};
            case 0x72:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.D};
            case 0x73:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.E};
            case 0x74:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.H};
            case 0x75:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.L};
            case 0x76:
                return {type: OPERATION.HLT};
            case 0x77:
                return {type: OPERATION.MOV, to: REGISTER.M, from: REGISTER.A};

            case 0x78:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.B};
            case 0x79:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.C};
            case 0x7a:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.D};
            case 0x7b:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.E};
            case 0x7c:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.H};
            case 0x7d:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.L};
            case 0x7e:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.M};
            case 0x7f:
                return {type: OPERATION.MOV, to: REGISTER.A, from: REGISTER.A};


            case 0x80:
                return {type: OPERATION.ADD, register: REGISTER.B};
            case 0x81:
                return {type: OPERATION.ADD, register: REGISTER.C};
            case 0x82:
                return {type: OPERATION.ADD, register: REGISTER.D};
            case 0x83:
                return {type: OPERATION.ADD, register: REGISTER.E};
            case 0x84:
                return {type: OPERATION.ADD, register: REGISTER.H};
            case 0x85:
                return {type: OPERATION.ADD, register: REGISTER.L};
            case 0x86:
                return {type: OPERATION.ADD, register: REGISTER.M};
            case 0x87:
                return {type: OPERATION.ADD, register: REGISTER.A};

            case 0x88:
                return {type: OPERATION.ADC, register: REGISTER.B};
            case 0x89:
                return {type: OPERATION.ADC, register: REGISTER.C};
            case 0x8a:
                return {type: OPERATION.ADC, register: REGISTER.D};
            case 0x8b:
                return {type: OPERATION.ADC, register: REGISTER.E};
            case 0x8c:
                return {type: OPERATION.ADC, register: REGISTER.H};
            case 0x8d:
                return {type: OPERATION.ADC, register: REGISTER.L};
            case 0x8e:
                return {type: OPERATION.ADC, register: REGISTER.M};
            case 0x8f:
                return {type: OPERATION.ADC, register: REGISTER.A};

            case 0x90:
                return {type: OPERATION.SUB, register: REGISTER.B};
            case 0x91:
                return {type: OPERATION.SUB, register: REGISTER.C};
            case 0x92:
                return {type: OPERATION.SUB, register: REGISTER.D};
            case 0x93:
                return {type: OPERATION.SUB, register: REGISTER.E};
            case 0x94:
                return {type: OPERATION.SUB, register: REGISTER.H};
            case 0x95:
                return {type: OPERATION.SUB, register: REGISTER.L};
            case 0x96:
                return {type: OPERATION.SUB, register: REGISTER.M};
            case 0x97:
                return {type: OPERATION.SUB, register: REGISTER.A};

            case 0x98:
                return {type: OPERATION.SBB, register: REGISTER.B};
            case 0x99:
                return {type: OPERATION.SBB, register: REGISTER.C};
            case 0x9a:
                return {type: OPERATION.SBB, register: REGISTER.D};
            case 0x9b:
                return {type: OPERATION.SBB, register: REGISTER.E};
            case 0x9c:
                return {type: OPERATION.SBB, register: REGISTER.H};
            case 0x9d:
                return {type: OPERATION.SBB, register: REGISTER.L};
            case 0x9e:
                return {type: OPERATION.SBB, register: REGISTER.M};
            case 0x9f:
                return {type: OPERATION.SBB, register: REGISTER.A};


            case 0xa0:
                return {type: OPERATION.ANA, register: REGISTER.B};
            case 0xa1:
                return {type: OPERATION.ANA, register: REGISTER.C};
            case 0xa2:
                return {type: OPERATION.ANA, register: REGISTER.D};
            case 0xa3:
                return {type: OPERATION.ANA, register: REGISTER.E};
            case 0xa4:
                return {type: OPERATION.ANA, register: REGISTER.H};
            case 0xa5:
                return {type: OPERATION.ANA, register: REGISTER.L};
            case 0xa6:
                return {type: OPERATION.ANA, register: REGISTER.M};
            case 0xa7:
                return {type: OPERATION.ANA, register: REGISTER.A};

            case 0xa8:
                return {type: OPERATION.XRA, register: REGISTER.B};
            case 0xa9:
                return {type: OPERATION.XRA, register: REGISTER.C};
            case 0xaa:
                return {type: OPERATION.XRA, register: REGISTER.D};
            case 0xab:
                return {type: OPERATION.XRA, register: REGISTER.E};
            case 0xac:
                return {type: OPERATION.XRA, register: REGISTER.H};
            case 0xad:
                return {type: OPERATION.XRA, register: REGISTER.L};
            case 0xae:
                return {type: OPERATION.XRA, register: REGISTER.M};
            case 0xaf:
                return {type: OPERATION.XRA, register: REGISTER.A};

            case 0xb0:
                return {type: OPERATION.ORA, register: REGISTER.B};
            case 0xb1:
                return {type: OPERATION.ORA, register: REGISTER.C};
            case 0xb2:
                return {type: OPERATION.ORA, register: REGISTER.D};
            case 0xb3:
                return {type: OPERATION.ORA, register: REGISTER.E};
            case 0xb4:
                return {type: OPERATION.ORA, register: REGISTER.H};
            case 0xb5:
                return {type: OPERATION.ORA, register: REGISTER.L};
            case 0xb6:
                return {type: OPERATION.ORA, register: REGISTER.M};
            case 0xb7:
                return {type: OPERATION.ORA, register: REGISTER.A};

            case 0xb8:
                return {type: OPERATION.CMP, register: REGISTER.B};
            case 0xb9:
                return {type: OPERATION.CMP, register: REGISTER.C};
            case 0xba:
                return {type: OPERATION.CMP, register: REGISTER.D};
            case 0xbb:
                return {type: OPERATION.CMP, register: REGISTER.E};
            case 0xbc:
                return {type: OPERATION.CMP, register: REGISTER.H};
            case 0xbd:
                return {type: OPERATION.CMP, register: REGISTER.L};
            case 0xbe:
                return {type: OPERATION.CMP, register: REGISTER.M};
            case 0xbf:
                return {type: OPERATION.CMP, register: REGISTER.A};


            case 0xc6:
                return {type: OPERATION.ADI, value: this.fetch()};
            case 0xce:
                return {type: OPERATION.ACI, value: this.fetch()};
            case 0xd6:
                return {type: OPERATION.SUI, value: this.fetch()};
            case 0xde:
                return {type: OPERATION.SBI, value: this.fetch()};
            case 0xe6:
                return {type: OPERATION.ANI, value: this.fetch()};
            case 0xee:
                return {type: OPERATION.XRI, value: this.fetch()};
            case 0xf6:
                return {type: OPERATION.ORI, value: this.fetch()};
            case 0xfe:
                return {type: OPERATION.CPI, value: this.fetch()};


            case 0xc1:
                return {type: OPERATION.POP, register: REGISTER.B};
            case 0xc5:
                return {type: OPERATION.PUSH, register: REGISTER.B};
            case 0xd1:
                return {type: OPERATION.POP, register: REGISTER.D};
            case 0xd5:
                return {type: OPERATION.PUSH, register: REGISTER.D};
            case 0xe1:
                return {type: OPERATION.POP, register: REGISTER.H};
            case 0xe5:
                return {type: OPERATION.PUSH, register: REGISTER.H};
            case 0xf1:
                return {type: OPERATION.POP, register: REGISTER.PSW};
            case 0xf5:
                return {type: OPERATION.PUSH, register: REGISTER.PSW};

            case 0xc0:
                return {type: OPERATION.RNZ};
            case 0xc8:
                return {type: OPERATION.RZ};
            case 0xd0:
                return {type: OPERATION.RNC};
            case 0xd8:
                return {type: OPERATION.RC};
            case 0xe0:
                return {type: OPERATION.RPO};
            case 0xe8:
                return {type: OPERATION.RPE};
            case 0xf0:
                return {type: OPERATION.RP};
            case 0xf8:
                return {type: OPERATION.RM};

            case 0xc9:
            case 0xd9:
                return {type: OPERATION.RET};

            case 0xc2:
                return {type: OPERATION.JNZ, position: this.fetchWord()};
            case 0xca:
                return {type: OPERATION.JZ, position: this.fetchWord()};
            case 0xd2:
                return {type: OPERATION.JNC, position: this.fetchWord()};
            case 0xda:
                return {type: OPERATION.JC, position: this.fetchWord()};
            case 0xe2:
                return {type: OPERATION.JPO, position: this.fetchWord()};
            case 0xea:
                return {type: OPERATION.JPE, position: this.fetchWord()};
            case 0xf2:
                return {type: OPERATION.JP, position: this.fetchWord()};
            case 0xfa:
                return {type: OPERATION.JM, position: this.fetchWord()};

            case 0xc3:
            case 0xcb:
                return {type: OPERATION.JMP, position: this.fetchWord()};
            case 0xe9:
                return {type: OPERATION.PCHL};


            case 0xc4:
                return {type: OPERATION.CNZ, position: this.fetchWord()};
            case 0xcc:
                return {type: OPERATION.CZ, position: this.fetchWord()};
            case 0xd4:
                return {type: OPERATION.CNC, position: this.fetchWord()};
            case 0xdc:
                return {type: OPERATION.CC, position: this.fetchWord()};
            case 0xe4:
                return {type: OPERATION.CPO, position: this.fetchWord()};
            case 0xec:
                return {type: OPERATION.CPE, position: this.fetchWord()};
            case 0xf4:
                return {type: OPERATION.CP, position: this.fetchWord()};
            case 0xfc:
                return {type: OPERATION.CM, position: this.fetchWord()};


            case 0xe3:
                return {type: OPERATION.XTHL};
            case 0xf9:
                return {type: OPERATION.SPHL};
            case 0xeb:
                return {type: OPERATION.XCHG};


            case 0xcd:
            case 0xdd:
            case 0xed:
            case 0xfd:
                return {type: OPERATION.CALL, position: this.fetchWord()};


            case 0xc7: // RST
            case 0xd7: // RST
            case 0xe7: // RST
            case 0xf7: // RST
            case 0xcf: // RST
            case 0xdf: // RST
            case 0xef: // RST
            case 0xff: // RST
            case 0xd3: // OUT
            case 0xdb: // IN
            case 0xf3: // DI
            case 0xfb: // EI
                console.error('opCode ' + opCode.toString(16) + ' not supported')
                return {type: OPERATION._};


            case 0x00:
            case 0x10:
            case 0x20:
            case 0x30:
            case 0x08:
            case 0x18:
            case 0x28:
            case 0x38:
            default:
                return {type: OPERATION.NOP};
        }
    }
}

export function buildFetch(
    memory: IMemory,
    register: IRegister
): IFetchDecode {
    return new FetchDecode(memory, register);
}
