import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInputSelectTextREComponent } from './form-input-select-text-re.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    FormInputSelectTextREComponent,
  ],
  exports: [
    FormInputSelectTextREComponent,
  ]
})
export class FormInputSelectTextREModule {}