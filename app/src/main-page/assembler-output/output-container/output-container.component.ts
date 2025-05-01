import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { infocardComponent } from '../infocard/infocard.component';


@Component({
  selector: 'assembler-output-container',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, infocardComponent],
  templateUrl: './output-container.component.html',
  styleUrl: './output-container.component.css',
})
export class assemblerOutputContainer {


}
