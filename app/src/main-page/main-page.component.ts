import { Component, inject } from '@angular/core';
import { TextboxComponent } from './textbox/textbox.component';
import { TranslateButtonComponent } from './translate-button/translate-button.component';
import { SwitchComponent } from './switch/switch.component';
import { TexboxOutputComponent } from './texbox-output/texbox-output.component';
import { RamdropComponent } from './ramdrop/ramdrop.component';
import { SaveRamButtonComponent } from './save-ram-button/save-ram-button.component';
import { TranslatorService } from '../Shared/Services/Translator/translator.service';
import { AssemblerTranslatorService } from '../Shared/Services/assemblerTranslator/assembler-Translator.service';
import { FormInputManagerService } from '../Shared/Services/FormInputManager/form-input-manager.service';
import { InstructionTableComponent } from './instruction-table/instruction-table.component';
import { TableInstructionService } from '../Shared/Services/tableInstruction/table-instruction.service';
import { assemblerTextboxComponent } from './assembler-textbox/assembler-textbox.component';
import { assemblerTranslateButtonComponent } from './assembler-translate-button/assembler-translate-button.component';
import { assemblerOutputContainer } from './assembler-output/output-container/output-container.component';
import { infocardComponent } from './assembler-output/infocard/infocard.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    TextboxComponent,
    TranslateButtonComponent,
    SwitchComponent,
    TexboxOutputComponent,
    RamdropComponent,
    SaveRamButtonComponent,
    InstructionTableComponent,
    assemblerTextboxComponent,
    assemblerTranslateButtonComponent,
    assemblerOutputContainer,
    infocardComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'], 
})
export class MainPageComponent {
  
  inputText: string = '';
  output: string = '';
  parameter:string = '';
  assemblerInputText: string = '';
  assemblerOutputDict: { [key: string]: string } = {};
  private translator = inject(TranslatorService);
  private assemblerTranslator = inject(AssemblerTranslatorService);
  private inputManager = inject(FormInputManagerService).inputApp;
  private inputManagerIsHexToMips = inject(FormInputManagerService).isHexToMips;
  isHexToMIPS: boolean = false;
  tableManager = inject(TableInstructionService);

  onTableValueChange(value: string): void {
    this.tableManager.updateSelectedLineText(value);
    
  }

  // Manejadores de eventos
  onToggle(isChecked: boolean): void {
    this.isHexToMIPS = isChecked;
    this.inputManagerIsHexToMips.setValue(isChecked);
    let draft = this.inputManager.value;
    this.inputManager.setValue(this.output);
    this.output = draft;

  }

  onInput(input: string): void {
    this.inputText = input;
    
  }
  onTextFile(textFile: Promise<string[]>): void {
    
    textFile.then((instructions) => {
      
      if (this.isHexToMIPS) {
        
        this.inputManager.setValue(instructions[0]) ;
        this.output = instructions[1];
      } else {
        this.output = instructions[0];
        this.inputManager.setValue(instructions[1]) ;
      }
      
    });
  }
  onTranslate(): void {
    if (this.isHexToMIPS) {
      
      this.output = this.translator.translateHextoMIPS(this.inputText);
      this.parameter = this.inputText;
    } else {
      this.output = this.translator.translateMIPStoHex(this.inputText);
      this.parameter = this.output
    }
  }

  onAssemblerInput(input: string): void {
    this.assemblerInputText = input;
  }
  getKeys(obj: { [key: string]: string }): string[] {
    return Object.keys(obj);
  }
  onAssemblerTranslate(): void {
    this.assemblerOutputDict = this.assemblerTranslator.assembleTranslate(this.assemblerInputText);
  }
}
