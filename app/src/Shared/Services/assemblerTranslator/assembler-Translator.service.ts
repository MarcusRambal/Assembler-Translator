import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssemblerTranslatorService {
  translate(assemblerTextInput: string): string {
    return `Traducción de: ${assemblerTextInput}`;
  }
}
