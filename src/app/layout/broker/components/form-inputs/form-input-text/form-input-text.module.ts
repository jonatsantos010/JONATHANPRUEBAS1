import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInputTextREComponent } from './form-input-text-re.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    FormInputTextREComponent,
  ],
  exports: [
    FormInputTextREComponent,
  ]
})
export class FormInputTextREModule {}