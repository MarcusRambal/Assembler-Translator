 const opcode: { [key: string]: string } = {
    addi: "001000",
    j: "000010",
    r_type:"000000",
    beq: "000100",
    sw: "101011",
    lw: "100011",
    bne: "000101"
  };

  const funct: { [key: string]: string } = {
    add: "100000",
    sub: "100010",
    and: "100100",
    or: "100101",
    mul: "011000",
    div: "011010"
  };



  function toMips(line: string[]): string{
    const instruction = line[0].toLowerCase();
    let opcodeValue = opcode[instruction];
    let type;
    let mips: string="";

    if (instruction === "add" || instruction === "sub" || instruction === "and" || instruction === "or" || instruction === "mul" || instruction === "div") {
        type = "R";
    }
    else if (instruction === "addi" || instruction === "beq" || instruction === "bne" || instruction === "sw" || instruction === "lw") {
        type = "I";
    }
    else if (instruction === "j") {
        type = "J";
    }
    else {
        console.log("Invalid instruction: " + instruction);
        return "";
    }

    if (type === "R") {
        const rs = parseInt(line[1].replace(/[^0-9]/g, "")) + 16;
        const rt = parseInt(line[2].replace(/[^0-9]/g, ""))+ 16;
        const rd = parseInt(line[3].replace(/[^0-9]/g, ""))+ 16;
        const shamt = 0;
        const functValue = funct[instruction];
        mips += opcodeValue + rs.toString(2).padStart(5, '0') + rt.toString(2).padStart(5, '0') + rd.toString(2).padStart(5, '0') + shamt.toString(2).padStart(5, '0') + functValue + "\n";
    } else if(type === "I") {
        const rs = parseInt(line[1].replace(/[^0-9]/g, "")) + 16;
        const rt = parseInt(line[2].replace(/[^0-9]/g, ""))+ 16;
        const immediate = parseInt(line[3].replace(/[^0-9]/g, ""));
        mips += opcodeValue + rs.toString(2).padStart(5, '0') + rt.toString(2).padStart(5, '0') + immediate.toString(2).padStart(16, '0') + "\n";
    }
    else if (type === "J") {
        const address = parseInt(line[1].replace(/[^0-9]/g, ""));
        mips += opcodeValue + address.toString(2).padStart(26, '0') + "\n";
    }
    return mips;
}


  function AssToMIPS(codeString: string): string[] {
    let mipArray: string[] = [];

   

    const linesArray = codeString.split(/\r?\n/)
    for (let i = 0; i < linesArray.length; i++) {
        const line = linesArray[i].trim().split(/\s+/);
        if (line.length > 0) {
            const mips = toMips(line);
            if (mips !== "") {
                mipArray.push(mips);
            }
        }
    }
      
    return mipArray;
  }