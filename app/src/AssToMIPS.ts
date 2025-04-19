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

  function AssToMIPS(codeString: string): string {
    let mips = "lol";

    function toMips(line: string[]): void{
        const instruction = line[0].toLowerCase();
        let type;

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
            return;
        }

        let opcodeValue = opcode[instruction];
        if (type === "R") {
            const rs = parseInt(line[1].replace(/[^0-9]/g, ""));
            const rt = parseInt(line[2].replace(/[^0-9]/g, ""));
            const rd = parseInt(line[3].replace(/[^0-9]/g, ""));
            const shamt = 0;
            const functValue = funct[instruction];
            mips += opcodeValue + rs.toString(2).padStart(5, '0') + rt.toString(2).padStart(5, '0') + rd.toString(2).padStart(5, '0') + shamt.toString(2).padStart(5, '0') + functValue + "\n";
        }







    }

    
    const linesArray = codeString.split(/\r?\n/)
    let wordsArray = []

    for(let i = 0; i < linesArray.length; i++){
     wordsArray[0] = linesArray[i].split(/\s+/)
    }


      
    return mips;
  }