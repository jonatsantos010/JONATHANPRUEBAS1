import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RegularExpressions } from '@shared/regexp/regexp';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
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
      transition(':leave', [
        animate(
          150,
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ChatBotComponent implements OnInit {
  formControlEmail = new FormControl(
    '',
    Validators.compose([Validators.pattern(RegularExpressions.email), Validators.required])
  );
  form: FormGroup = this.builder.group({
    email: this.formControlEmail,
  });

  showForm = false;

  constructor(
    private readonly renderer: Renderer2,
    private readonly builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.insertScriptChat();
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

  get chatConfig() {
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
        firstName: this.formControlEmail.value,
        email: this.formControlEmail.value,
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

  openChat(): void {
    if (this.form.invalid) {
      return;
    }

    this.showForm = false;
    (window as any)['ININ'].webchat.create(
      this.chatConfig,
      function (err: any, webchat: any) {
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
}
