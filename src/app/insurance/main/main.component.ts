import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { GoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';
import { NavigationStart, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;

  constructor(
    private readonly ga: GoogleAnalyticsService,
    private readonly router: Router,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly render: Renderer2
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        const path = e.url.split('/')[3] || 'step-0';
        const url = path.charAt(0).toUpperCase() + path.slice(1);
        const step = url.split('-');
        const pageView = {
          path: e.url,
          title: `Accidentes Personales - ${step[0] || ''} ${step[1] || ''}`,
        };
        this.ga.pageView(pageView);
      }
    });

    const canonicalLink: HTMLLinkElement = this.render.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute(
      'href',
      'https://plataformadigital.protectasecurity.pe/ecommerce/accidentespersonales'
    );

    const head = document.querySelector('head');
    this.render.appendChild(head, canonicalLink);

    const script = this.render.createElement('script');
    script.type = 'application/ld+json'
    script.text = `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "Seguro contra Accidentes Personales",
      "image": "https://plataformadigital.protectasecurity.pe/ecommerce/assets/accidentes-personales/resources/banner-ap.webp",
      "description": "Compra tu Segura de Accidentes Personales Online con Protecta Security. Descubre qué es, precio, coberturas. ¡Cotizalo en 3 minutos!",
      "brand": {
        "@type": "Brand",
        "name": "Protecta Secutiry"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://plataformadigital.protectasecurity.pe/ecommerce/accidentespersonales",
        "priceCurrency": "PEN",
        "price": "",
        "priceValidUntil": "2024-07-31",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "17"
      }
    }`

    this.render.appendChild(document.head, script);
  }

  ngAfterViewInit(): void {
    const apElement = document.getElementById('accidentespersonales-mask');
    apElement?.remove();

    this.title.setTitle('Seguro contra accidentes personales | Precio y Coberturas');
    this.meta.updateTag({
      name: 'description',
      content: 'Compra tu Seguro de Accidentes Personales Online con Protecta Security. Descubre qué es, precio, coberturas. ¡Cotizalo en 3 minutos!',
    });
    this.meta.addTags([
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://www.facebook.com/ProtectaSecurity',
      },
      {
        property: 'og:title',
        content: 'Seguros Accidentes Personales | Comprar Online + Precio',
      },
      {
        property: 'og:description',
        content:
          'Compra tu Seguro de Accidentes Personales Online con Protecta Security. Descubre qué es, precio, coberturas y más ¡Comprar ahora!',
      },
      {
        property: 'og:image',
        content: 'http://localhost:4200/assets/logos/logo-latest.png',
      },
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'twitter:url',
        content:
          'https://plataformadigital.protectasecurity.pe/ecommerce/accidentespersonales',
      },
      {
        property: 'twitter:title',
        content: 'Seguros Accidentes Personales | Comprar Online + Precio',
      },
      {
        property: 'twitter:description',
        content:
          'Compra tu Seguro de Accidentes Personales Online con Protecta Security. Descubre qué es, precio, coberturas y más ¡Comprar ahora!',
      },
      {
        property: 'twitter:image',
        content: 'http://localhost:4200/assets/logos/logo-latest.png',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.title.setTitle('PROTECTA :: Plataforma Digital');
    this.subscription.unsubscribe();
  }

  get showChatBot(): boolean {
    const paths: string[] = [
      '/ecommerce/accidentespersonales',
      '/accidentespersonales',
    ];
    return !paths.includes(location.pathname);
  }
}
