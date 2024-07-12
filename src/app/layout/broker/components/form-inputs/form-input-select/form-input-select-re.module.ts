import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInputSelectREComponent } from './form-input-select-re.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    FormInputSelectREComponent,
  ],
  exports: [
    FormInputSelectREComponent,
  ]
})
export class FormInputSelectREModule {}