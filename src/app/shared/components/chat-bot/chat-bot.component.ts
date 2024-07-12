import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../../app.config';
import { ChatBotService } from '../../services/chat-bot/chat-bot.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '@root/layout/soat/shared/services/session.service';
@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  animations: [
    trigger('fadein', [
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate(
          250,
          style({
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class ChatBotComponent implements OnInit {
  showForm = false;
  model = { email: null };

  frmChat: FormGroup;

  modalSucess: boolean;
  descriptionModal: string;

  limitNumberPhone: { min: number; max: number };

  showChat: boolean;
  constructor(
    private readonly fb: FormBuilder,
    private readonly _ChatBotService: ChatBotService,
    private readonly _sessionService: SessionService,
    private readonly _route: ActivatedRoute,
    private readonly renderer: Renderer2
  ) {
    this.limitNumberPhone = {
      min: 9,
      max: 9,
    };
    this.modalSucess = false;
    this.descriptionModal = 'Se envió correctamente el correo electrónico';
    this.showChat = true;
  }

  ngOnInit() {
    this.frmChat = this.fb.group({
      names: [null],
      email: [
        null,
        [Validators.required, Validators.pattern(AppConfig.CUSTOM_MAIL_DOMAIN)],
      ],
      horario: ['9 a.m. - 11 a.m.', Validators.required],
      telefono: [
        null,
        Validators.compose([
          Validators.pattern(/^[0-9]*$/),
          Validators.required,
        ]),
      ],
      comentario: [null],
    });
    this.cForm.telefono.valueChanges.subscribe((val) => {
      if (this.cForm.telefono.hasError('pattern')) {
        if (val) {
          this.cForm.telefono.setValue(
            val?.toString().substring(0, val.toString().length - 1)
          );
        }
      }
    });
    this.cForm.email.setValidators([
      Validators.pattern(AppConfig.CUSTOM_MAIL_DOMAIN),
      Validators.required,
    ]);
    this.cForm.email.updateValueAndValidity();
    if (this.isVidaDevolucion) {
      this.frmChat.clearValidators();

      this.cForm.names.setValidators(Validators.required);
      this.cForm.names.updateValueAndValidity();

      this.cForm.horario.setValidators(Validators.required);
      this.cForm.horario.updateValueAndValidity();

      this.cForm.telefono.setValidators(
        Validators.compose([
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(9),
          Validators.required,
        ])
      );
      this.cForm.telefono.updateValueAndValidity();

      this.cForm.comentario.setValidators(Validators.required);
      this.cForm.comentario.updateValueAndValidity();
    } else {
      this.cForm['telefono'].clearValidators();
      this.cForm['telefono'].updateValueAndValidity();

      this.cForm['comentario'].clearValidators();
      this.cForm['comentario'].updateValueAndValidity();

      this.cForm['horario'].clearValidators();
      this.cForm['horario'].updateValueAndValidity();

      this.cForm['names'].clearValidators();
      this.cForm['names'].updateValueAndValidity();

      this.cForm['email'].setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern(AppConfig.CUSTOM_MAIL_DOMAIN),
        ])
      );
      this.cForm['email'].updateValueAndValidity();
    }
    this._sessionService.renewSellingPoint().subscribe((res: any) => {
      this.showChatBot();
    });
  }
  closeModalSucess(): void {
    this.modalSucess = false;
    this.descriptionModal = '';
  }
  get cForm() {
    return this.frmChat.controls;
  }

  get isVidaDevolucion(): boolean {
    return window.location.pathname.indexOf('vidadevolucion') !== -1;
  }

  get isAccidentesPersonales(): boolean {
    return window.location.pathname.indexOf('accidentespersonales') !== -1;
  }

  validPhone(): void {
    const control = this.cForm['telefono'];
    if (control.touched) {
      const firstNumber = Number(control.value?.substring(0, 1));
      if (firstNumber !== 9) {
        control.setValidators(
          Validators.compose([
            Validators.pattern(/^[0-9]*$/),
            Validators.minLength(7),
            Validators.maxLength(7),
            Validators.required,
          ])
        );
        this.limitNumberPhone = {
          min: 7,
          max: 7,
        };
      } else {
        control.setValidators(
          Validators.compose([
            Validators.pattern(/^[0-9]*$/),
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.required,
          ])
        );
        this.limitNumberPhone = {
          min: 9,
          max: 9,
        };
      }
      control.updateValueAndValidity();
    }
  }
  showError(controlName: string): boolean {
    return (
      this.cForm[controlName].invalid &&
      (this.cForm[controlName].dirty || this.cForm[controlName].touched)
    );
  }

  showFormClick() {
    this.showForm = !this.showForm;
    this.modalSucess = false;
    if (this.isVidaDevolucion) {
      let data: any = sessionStorage.getItem('step1');
      let names: any = sessionStorage.getItem('info-document');
      if (data && names) {
        console.log('vd1');
        data = JSON.parse(data);
        names = JSON.parse(names);
        this.cForm['names'].setValue(
          `${names.p_SCLIENT_NAME} ${names.p_SCLIENT_APPPAT} ${names.p_SCLIENT_APPMAT}`
        );
        this.cForm['telefono'].setValue(data.telefono);
        this.cForm['email'].setValue(data.email);
      } else {
        this.cForm['names'].setValue(null);
        this.cForm['telefono'].setValue(null);
        this.cForm['email'].setValue(null);
      }
    }
    // this.model.email = '';
  }

  insertScriptChat(): void {
    if (!document.getElementById('purecloud-api-js')) {
      const element = this.renderer.createElement('script');
      element.setAttribute(
        'src',
        'https://apps.mypurecloud.com/webchat/jsapi-v1.js'
      );
      element.setAttribute('type', 'text/javascript');
      element.setAttribute('id', 'purecloud-api-js');
      this.renderer.appendChild(document.body, element);
    }

    if (!document.getElementById('purecloud-webchat-js')) {
      const element2 = this.renderer.createElement('script');
      element2.setAttribute(
        'src',
        'https://apps.usw2.pure.cloud/webchat/jsapi-v1.js'
      );
      element2.setAttribute('type', 'text/javascript');
      element2.setAttribute('id', 'purecloud-webchat-js');
      element2.setAttribute('region', 'us-west-2');
      element2.setAttribute('org-guid', 'd3923f48-b992-4b4f-b368-e878e53c5e4e');
      element2.setAttribute(
        'deployment-key',
        '091ac3f6-de5a-4f21-b60a-9c18099049c9'
      );
      this.renderer.appendChild(document.body, element2);
    }
  }

  onSubmit() {
    this.frmChat.markAllAsTouched();
    if (this.frmChat.valid) {
      if (!this.isVidaDevolucion) {
        this.insertScriptChat();
        setTimeout(() => {
          if (window['ININ']) {
            window['ININ'].webchat.create(
              this.chatConfig(),
              function (err, webchat) {
                if (err) {
                  console.error('Unable to share page', err.stack || err);
                  return;
                }

                // Render to frame
                webchat.renderPopup({
                  width: 400,
                  height: 400,
                  title: 'ProtectaSecurity',
                  // set newTab to true if using screen share
                  newTab: false,
                });
              }
            );
          }
        }, 1500);
      } else {
        const data = {
          nombres: this.cForm['names'].value,
          horario: this.cForm['horario'].value,
          email: this.cForm['email'].value,
          telefono: this.cForm['telefono'].value,
          comentario: this.cForm['comentario'].value,
        };
        this._ChatBotService.notificationContact(data).subscribe(
          (res: any) => {
            this.frmChat.reset();
            this.cForm.horario.setValue('9 a.m. - 11 a.m.');
            this.modalSucess = true;
            this.descriptionModal =
              'Gracias! Nos contactaremos contigo en el horario elegido.';
          },
          (err: any) => {
            console.log(err);
            this.showForm = false;
            this.cForm.horario.setValue('9 a.m. - 11 a.m.');
            this.frmChat.reset();
          }
        );
      }
      // this.showForm = false;
    }
  }

  // // Logo used at the top of the chat window
  // "companyLogo": {
  //   "width": 600,
  //   "height": 149,
  //   "url": "https://plataformadigital.protectasecurity.pe/ecommerce/assets/logos/logo_protecta_security.svg"
  // },

  // // Logo used within the chat window
  // "companyLogoSmall": {
  //   "width": 149,
  //   "height": 149,
  //   "url": "https://plataformadigital.protectasecurity.pe/ecommerce/assets/logos/logo_protecta_security.svg"
  // },

  //  "data": {
  //   "firstName": correito,
  //   "email":correito
  // },
  // // Image used for agent
  // "agentAvatar": {
  //   "width": 462,
  //   "height": 462,
  //   "url": "https://plataformadigital.protectasecurity.pe/ecommerce/assets/logos/logo_protecta_security.svg"
  // },

  // "cssClass": "webchat-frame",

  // "css": {
  //   "width": "100%",
  //   "height": "100%",

  // },

  chatConfig() {
    return {
      // No modificar
      webchatAppUrl: 'https://apps.usw2.pure.cloud/webchat',
      webchatServiceUrl: 'https://realtime.usw2.pure.cloud:443',
      orgId: '1572',
      orgName: 'ProtectaSecurity',
      queueName: 'Chat',
      logLevel: 'DEBUG',
      locale: 'es',
      // contentCssUrl: 'screenshare.css',
      // Logo used at the top of the chat window
      companyLogo: {
        width: 600,
        height: 149,
        url: 'https://plataformadigital.protectasecurity.pe/ecommerce/assets/logos/logo_protecta_security.svg',
      },

      // Logo used within the chat window
      companyLogoSmall: {
        width: 149,
        height: 149,
        url: 'https://plataformadigital.protectasecurity.pe/ecommerce/assets/logos/logo_protecta_security.svg',
      },

      data: {
        firstName: this.cForm['email'].value,
        email: this.cForm['email'].value,
      },
      // Image used for agent
      agentAvatar: {
        width: 462,
        height: 462,
        url: 'https://plataformadigital.protectasecurity.pe/ecommerce/assets/soat/img/avatar.png',
      },

      cssClass: 'webchat-frame',

      css: {
        width: '100%',
        height: '100%',
      },
    };
  }

  private showChatBot(): void {
    if (location.pathname.indexOf('/soat/') !== -1) {
      const linksAgenciados = ['2015000002', '2019000007'];
      const sellingChannel = JSON.parse(
        sessionStorage.getItem('selling') || '{}'
      );
      if (
        linksAgenciados.includes(sellingChannel?.sellingChannel?.toString()) &&
        this._route.snapshot.queryParamMap.get('code')
      ) {
        this.showChat = true;
      } else {
        this.showChat = false;
      }
      if (!this._route.snapshot.queryParamMap.get('code')) {
        this.showChat = true;
      }
    } else {
      this.showChat = true;
    }
  }
}
