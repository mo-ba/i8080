START = __* e:(EXP/EXP_COMMENT/EXP_LABEL)* {return e}

EXP_COMMENT = _* 
    label:LABEL_DEFINITION? _* 
    comment:COMMENT __* {
        return {
            label,
            operation:null,
            comment,
            location:location()
        }
    }


EXP_LABEL = _* 
    label:LABEL_DEFINITION _* 
    comment:COMMENT? __* {
        return {
            label,
            operation:null,
            comment,
            location:location()
        }
    }

EXP = _*
    label:LABEL_DEFINITION? _* 
    code:Code _*
    operands:Operands? _* 
    comment:COMMENT?
    __*
    {return {label,operation:{code,operands},comment,location:location()}}


Code = head:[a-zA-Z]+ {return head.join('')}

Operands =  head:Operand tail:(',' _? Operand)* {return [head,...tail.map((e:any[]) => e[2])]}
Operand =  NUMBER / LABEL

LABEL_DEFINITION = l:LABEL ':' {return l}

LABEL = head:[a-zA-Z] tail:[a-zA-Z0-9]* {return head+tail.join('')}

COMMENT = ';' comment:[^\n]* {return comment.join('')}

NUMBER = HEX / BIN / DEC

BIN = d:BINDIGITS 'B'      {return parseInt(d.join(''),2)}
HEX = d:HEXDIGITS 'H'  {return parseInt(d.join(''),16)}
DEC = d:DIGITS      {return parseInt(d.join(''),10)}

DIGITS = DIGIT+
DIGIT = [0-9]
BINDIGITS = BINDIGIT+
BINDIGIT = [0-1]
HEXDIGITS = HEXDIGIT+
HEXDIGIT = [a-fA-F0-9]

_ = [ \t]+
__ = [\n\t ]

