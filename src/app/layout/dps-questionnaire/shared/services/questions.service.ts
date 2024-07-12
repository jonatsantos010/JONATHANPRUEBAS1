import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor() {}

  getPayload(form: any) {
    return {
      answers: [
        {
          question: 1,
          type: 'NUMBER',
          value: form.group1.talla,
        },
        {
          question: 2,
          type: 'NUMBER',
          value: form.group1.peso,
        },
        {
          question: 3,
          type: 'SELECTION',
          value:
            form.group2.fuma == '1'
              ? '800da41f-9ef1-4d35-a59f-f523dc1f26c4'
              : '0b096da0-3228-41dc-b1be-931ad4eadefe',
          detail: {
            type: 'NUMBER',
            value: form.group2.fuma_resp || null,
          },
        },
        {
          question: 4,
          type: 'SELECTION',
          value:
            form.group3.presion == '1'
              ? 'bfb0854b-8f6f-4ca9-a1e3-f8bfcc5ac60f'
              : '7676ed29-8892-42f1-9e43-09746c3c0dd7',
          detail: {
            type: 'NUMBER',
            value:
              form.group3.presion_resp == 1
                ? 'af448937-b214-4489-b885-7f1cda3e5224'
                : form.group3.presion_resp == 2
                ? '695a0285-6709-4347-aa5a-c587145a7b93'
                : form.group3.presion_resp == 3
                ? '06b094d6-7862-4483-a6c9-e23c62c4fa0e'
                : form.group3.presion_resp == 4
                ? 'fd577b09-d78d-4e0a-bfc9-398fa7e9e76c'
                : null,
          },
        },
        {
          question: 5,
          type: 'SELECTION',
          items: [
            {
              question: 5.1,
              type: 'SELECTION',
              value:
                form.group4.cancer == '1'
                  ? '55df2aae-f72e-4c90-92b6-752ca623a86e'
                  : 'b2d9ec65-1330-4764-a539-48cf9a4a7b40',
              detail: {
                type: 'TEXT',
                value: form.group4.cancer_rsp || null,
              },
            },
            {
              question: 5.2,
              type: 'SELECTION',
              value:
                form.group4.gastro == '1'
                  ? 'bbad02d9-f222-4454-8818-978ba73f1967'
                  : '9d3913f9-f08b-40cc-b116-de80d608092e',
              detail: {
                type: 'TEXT',
                value: form.group4.gastro_rsp || null,
              },
            },
            {
              question: 5.3,
              type: 'SELECTION',
              value:
                form.group4.infarto == '1'
                  ? '2a0c66e4-c790-4147-acb5-7e8e0ac833a8'
                  : '1e5926a1-b252-4e13-96d1-dfb04958fcd3',
              detail: {
                type: 'TEXT',
                value: form.group4.infarto_rsp || null,
              },
            },
          ],
        },
        {
          question: 6,
          type: 'SELECTION',
          value:
            form.group5.hospitalizacion == '1'
              ? '5db95bbb-d4b4-45c8-b844-a146c1e2850e'
              : '84e505e4-704b-4bf9-aea9-d94efb4591fa',
          detail: {
            type: 'TEXT',
            value: form.group5.hospitalizacion_resp || null,
          },
        },
        {
          question: 7,
          type: 'SELECTION',
          value:
            form.group6.viaja == '1'
              ? 'ca6a906e-f3b0-4df0-a7b0-d11011e352d4'
              : 'b8bec836-76a0-47b1-a34d-2745bf98e770',
          detail: {
            type: 'TEXT',
            value: form.group6.viaja_resp || null,
          },
        },
        {
          question: 8,
          type: 'SELECTION',
          value:
            form.group7.deporte == '1'
              ? 'e01c05d4-17f6-4fce-a5b9-8cbd9467792e'
              : '540127fe-4b33-468e-9d22-b2d95fd398b1',
          detail: {
            type: 'TEXT',
            value: form.group7.deporte_resp || null,
          },
        },
      ],
    };
  }
}
