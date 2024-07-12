import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInputTextareaREComponent } from './form-input-textarea-re.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    FormInputTextareaREComponent,
  ],
  exports: [
    FormInputTextareaREComponent,
  ]
})
export class FormInputTextareaREModule {}