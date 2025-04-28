interface Instruction {
    opcode: string;
    funct?: string;

}

const instructionMap: { [key: string]: Instruction } = {
    "add": { opcode: "000000", funct: "100000" },
    "sub": { opcode: "000000", funct: "100010" },
    "and": { opcode: "000000", funct: "100100" },
    "or": { opcode: "000000", funct: "100101" },
    "jalr": { opcode: "000000", funct: "001001" },
    "jr": { opcode: "000000", funct: "001000" },
    "slt": { opcode: "000000", funct: "101010" },
    "mfhi": { opcode: "000000", funct: "010000" },
    "mflo": { opcode: "000000", funct: "010010" },
    "mthi": { opcode: "000000", funct: "010001" },
    "mtlo": { opcode: "000000", funct: "010011" },
    "teq": { opcode: "000000", funct: "110100" },
    "tge": { opcode: "000000", funct: "110000" },
    "tgeu": { opcode: "000000", funct: "110001" },
    "tlt": { opcode: "000000", funct: "110010" },
    "tltu": { opcode: "000000", funct: "110011" },
    "tne": { opcode: "000000", funct: "110110" },
    "addu": { opcode: "000000", funct: "100001" },
    "div": { opcode: "000000", funct: "011010" },
    "divu": { opcode: "000000", funct: "011011" },
    "mult": { opcode: "000000", funct: "011000" },
    "multu": { opcode: "000000", funct: "011001" },
    "nor": { opcode: "000000", funct: "100111" },
    "sll": { opcode: "000000", funct: "000000" },
    "sllv": { opcode: "000000", funct: "000100" },
    "sra": { opcode: "000000", funct: "000011" },
    "srav": { opcode: "000000", funct: "000111" },
    "srl": { opcode: "000000", funct: "000010" },
    "srlv": { opcode: "000000", funct: "000110" },
    "subu": { opcode: "000000", funct: "100011" },
    "xor": { opcode: "000000", funct: "100110" },
    "addi": { opcode: "001000" },
    "addiu": { opcode: "001001" },
    "andi": { opcode: "001100" },
    "ori": { opcode: "001101" },
    "xori": { opcode: "001110" },
    "lw": { opcode: "100011" },
    "sw": { opcode: "101011" },
    "lb": { opcode: "100000" },
    "lbu": { opcode: "100100" },
    "lh": { opcode: "100001" },
    "lhu": { opcode: "100101" },
    "sb": { opcode: "101000" },
    "sh": { opcode: "101001" },
    "beq": { opcode: "000100" },
    "bne": { opcode: "000101" },
    "bgtz": { opcode: "000111" },
    "blez": { opcode: "000110" },
    "j": { opcode: "000010" },
    "jal": { opcode: "000011" },
    "lui": { opcode: "001111" }
  };

  const registerMap: { [key: string]: string } = {
    "00000": "zero", "00001": "at", "00010": "v0", "00011": "v1",
    "00100": "a0", "00101": "a1", "00110": "a2", "00111": "a3",
    "01000": "t0", "01001": "t1", "01010": "t2", "01011": "t3",
    "01100": "t4", "01101": "t5", "01110": "t6", "01111": "t7",
    "10000": "s0", "10001": "s1", "10010": "s2", "10011": "s3",
    "10100": "s4", "10101": "s5", "10110": "s6", "10111": "s7",
    "11000": "t8", "11001": "t9", "11010": "k0", "11011": "k1",
    "11100": "gp", "11101": "sp", "11110": "fp", "11111": "ra"
  };

function memDechex(dec: number): string {
    return dec.toString(16).padStart(8, '0');
}

function processInput(input: string ): string[] {
    return input.split('\n').map(line => line.trim()) .filter(line => line !== ''); 
}

// Enumeración para tipos de línea
enum LineType {
    UNASSIGNED,
    COMMENT,
    R,
    I,
    LA_FIRST,
    LA_THIRD,
    J,
    SYSCALL,
    LABEL,
    INVALID
}

class Line {
    inputLineNumber: number = 0;
    originalCode: string = "";
    lineType: LineType = LineType.UNASSIGNED;
    label: string = "";
    op: string = "";
    operands: string[] = [];
    memAddress: number = 0;
    private debugLog: string[] = [];
    private symbolTable: Map<string, number>;

    constructor(symbolTable: Map<string, number>, debugMode: boolean = false) {
        this.symbolTable = symbolTable;
    }

    private registerToNumber(reg: string): number {
        const regName = reg.slice(1);
        const binaryCode = Object.entries(registerMap).find(([_, name]) => name === regName)?.[0];
        if (!binaryCode) throw new Error(`Registro inválido: ${reg}`);
        return parseInt(binaryCode, 2);
    }

    private getInstructionInfo(op: string): Instruction {
        const instr = instructionMap[op];
        if (!instr) throw new Error(`Instrucción no soportada: ${op}`);
        return instr;
    }

    private rHandler(op: string, operands: string[]): string {
        const instr = this.getInstructionInfo(op);
        const [rd, rs, rt] = operands;

        const funct = parseInt(instr.funct!, 2); // Convertir binario a número
        const rsNum = this.registerToNumber(rs);
        const rtNum = this.registerToNumber(rt);
        const rdNum = this.registerToNumber(rd);

        const binaryValue = 
            (parseInt(instr.opcode, 2) << 26) | // Convertir opcode binario a número
            (rsNum << 21) |
            (rtNum << 16) |
            (rdNum << 11) |
            (0 << 6) | // shamt (no usado)
            funct;

        return this.convertToHex(binaryValue);
    }

    private iHandler(op: string, operands: string[]): string {
        const instr = this.getInstructionInfo(op);
        let rsNum = 0;
        let rtNum = 0;
        let immNum = 0;
    
        // Manejar casos especiales como lui
        if (op === "lui") {
            // Formato: lui rt, imm
            rtNum = this.registerToNumber(operands[0]);
            immNum = parseInt(operands[2], 16); // Usar base 16 para hex
        } else {
            // Resto de instrucciones I-Type
            const [rt, rs, imm] = operands;
            rsNum = this.registerToNumber(rs);
            rtNum = this.registerToNumber(rt);
            immNum = parseInt(imm, 10) & 0xffff;
        }
    
        const binaryValue = 
            (parseInt(instr.opcode, 2) << 26) |
            (rsNum << 21) |
            (rtNum << 16) |
            immNum;
    
        return this.convertToHex(binaryValue);
    }
    private convertToHex(value: number): string {
        return (value >>> 0) // Asegura 32 bits sin signo
               .toString(16)
               .padStart(8, '0'); // 8 caracteres hexadecimales
    }

    assemble(): string {
        let output = "";
        
        if (this.lineType === LineType.LABEL) {
            output += `${memDechex(this.memAddress)}: <${this.label}>`;
        } else if ([LineType.R, LineType.I, LineType.J, LineType.SYSCALL].includes(this.lineType)) {
            output += `\t${memDechex(this.memAddress)}: `;
        }

        switch(this.lineType) {
            case LineType.R:
                output += this.rHandler(this.op, this.operands);
                break;
                
            case LineType.I:
                output += this.iHandler(this.op, this.operands);
                break;
                
                case LineType.SYSCALL: {
                    const binaryValue = 
                        (0x00 << 26) | // Opcode
                        (0x00 << 21) | // rs
                        (0x00 << 16) | // rt
                        (0x00 << 6) |  // shamt
                        0x0c;          // funct
                    output += this.convertToHex(binaryValue);
                    break;
                }
                
                case LineType.LA_FIRST: {
                    const tempAddr = this.symbolTable.get(this.operands[0]) || 0;
                    const upper = (tempAddr >> 16) & 0xffff;
                    const binaryValue = 
                        (0x0f << 26) | // Opcode lui
                        (0 << 21) |    // rs no usado
                        (this.registerToNumber(this.op) << 16 |
                        upper);
                    output += this.convertToHex(binaryValue);
                    break;
                }
                
                case LineType.LA_THIRD: {
                    const tempAddr2 = this.symbolTable.get(this.operands[0]) || 0;
                    const lower = tempAddr2 & 0xffff;
                    const binaryValue = 
                        (0x0d << 26) | // Opcode ori
                        (this.registerToNumber(this.op) << 21) |
                        (this.registerToNumber(this.op) << 16 |
                        lower);
                    output += this.convertToHex(binaryValue);
                    break;
                }
        }

        return output;
    }
}



// Función principal de ensamblado
function assembleFull(input: string): string {
    const lines = processInput(input);
    const symbolTable = new Map<string, number>();
    const dataAddressStart = 0x00c00000;
    const textAddressStart = 0x00400000;
    let dataAddress = dataAddressStart;
    
    // Primera pasada: recolectar etiquetas
    let currentAddress = textAddressStart;
    const parsedLines: Line[] = [];
    let dataSection = false;

    // Procesar secciones .data y .text
    for (const lineStr of lines) {
        if (lineStr.startsWith('#')) continue;
        
        if (lineStr === '.data') {
            dataSection = true;
            currentAddress = dataAddressStart;
            continue;
        }
        
        if (lineStr === '.text') {
            dataSection = false;
            currentAddress = textAddressStart;
            continue;
        }

        const labelMatch = lineStr.match(/^([^:]+):/);
        if (labelMatch) {
            const label = labelMatch[1];
            symbolTable.set(label, currentAddress);
        }

        if (!dataSection) { // Sección de texto
            const line = new Line(symbolTable);
            line.originalCode = lineStr;
            line.memAddress = currentAddress;
            parsedLines.push(line);
            currentAddress += 4; // Avanzar dirección
        }

        if (dataSection) {
            if (lineStr.includes(".word")) {
                const [labelPart, valuePart] = lineStr.split(/\.word\s+/);
                const labelMatch = labelPart.match(/(\w+):/);
                
                if (labelMatch) {
                    symbolTable.set(labelMatch[1], dataAddress);
                    dataAddress += 4; // Avanzar dirección de datos
                }
            }
        }


    }

    // Segunda pasada: generar código
    let output = "";
    for (const line of parsedLines) {
        const parts = line.originalCode.split(/[\s,]+/).filter(p => p);
        if (parts.length === 0) continue;

        // Manejar etiquetas y comentarios
        if (parts[0].endsWith(':')) {
            line.lineType = LineType.LABEL;
            line.label = parts[0].slice(0, -1);
        } else if (parts[0].startsWith('#')) {
            line.lineType = LineType.COMMENT;
        } else {
            line.op = parts[0].toLowerCase();
            line.operands = parts.slice(1);
            
            // Determinar tipo de instrucción
            if (instructionMap[line.op]?.opcode === "000000") {
                line.lineType = LineType.R;
            } else if (line.op === 'la') {
                // Expandir pseudoinstrucción
                const addr = symbolTable.get(line.operands[1]) || 0;
                const upper = (addr >> 16) & 0xffff;
                const lower = addr & 0xffff;
                
                // Crear línea lui
                const luiLine = new Line(symbolTable);
                luiLine.lineType = LineType.I;
                luiLine.op = "lui";
                luiLine.operands = [line.operands[0], `0x${upper.toString(16)}`];
                output += luiLine.assemble() + '\n';
                
                // Crear línea ori
                const oriLine = new Line(symbolTable);
                oriLine.lineType = LineType.I;
                oriLine.op = "ori";
                oriLine.operands = [line.operands[0], line.operands[0], `0x${lower.toString(16)}`];
                output += oriLine.assemble() + '\n';
                
                continue;
            } else if (['j', 'jal'].includes(line.op)) {
                line.lineType = LineType.J;
            } else if (line.op === 'syscall') {
                line.lineType = LineType.SYSCALL;
            } else {
                line.lineType = LineType.I;
            }
        }

        output += line.assemble() + '\n';
    }
    
    return output;
}


const testCode = `
    .data
    my_data: .word 0x1234
    
    .text
    main:
        la $t0, my_data     
`;

console.log("=== Resultado del Ensamblado ===");
console.log(assembleFull(testCode));
  
