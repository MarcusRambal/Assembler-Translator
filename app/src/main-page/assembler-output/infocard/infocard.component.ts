import { CommonModule, NgClass } from '@angular/common';
import { Component, Input} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'infocard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './infocard.component.html',
  styleUrl: './infocard.component.css',
})
export class infocardComponent {
  @Input() header: string = '';
  @Input() text: string = '';
}
