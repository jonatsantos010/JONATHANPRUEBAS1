import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FormInputDateREComponent } from './form-input-date-re.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    BsDatepickerModule,
  ],
  declarations: [
    FormInputDateREComponent,
  ],
  exports: [
    FormInputDateREComponent,
  ]
})
export class FormInputDateREModule { }
