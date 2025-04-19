import { Component} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-assembler-textbox',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './assembler-textbox.component.html',
  styleUrl: './assembler-textbox.component.css',
})
export class assemblerTextboxComponent {
    textControl = new FormControl('');
}
