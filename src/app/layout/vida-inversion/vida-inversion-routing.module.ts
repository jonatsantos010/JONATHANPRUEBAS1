import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProspectsComponent } from './views/prospects/prospects.component';
import { MainComponent } from './main/main.component';
import { NewProspectsComponent } from './views/new-prospects/new-prospects.component';
import { RequestQuoteComponent } from './views/request-quote/request-quote.component';
import { NewQuotationComponent } from './views/new-quotation/new-quotation.component';
import { QuotationDefinitiveComponent } from './views/quotation-definitive/quotation-definitive.component';
import { QuotationDefinitiveConsultComponent } from './views/quotation-definitive-consult/quotation-definitive-consult.component';
import { ViewQuotationComponent } from './views/view-quotation/view-quotation.component';
import { PolicyComponent } from './views/policy/policy.component';
import { PolicyTransactionConsultComponent } from './views/policy-transaction-consult/policy-transaction-consult.component';
import { SubscriptionRequestComponent } from './views/subscription-request/subscription-request.component';
import { NewSubscriptionRequestComponent } from './views/new-subscription-request/new-subscription-request.component';
import { SubscriptionRequestConsultationComponent } from './views/subscription-request-consultation/subscription-request-consultation.component';
import { PolicySubscriptionComponent } from './views/policy-subscription/policy-subscription.component';

const routes: Routes = [
    {
        path: '', component: MainComponent, children: [
            // PROSPECTOS
            {
                path: 'prospectos',
                component: ProspectsComponent
            },
            {
                path: 'nuevo-prospecto',
                component: NewProspectsComponent
            },
            // COTIZACIÓN
            {
                path: 'consulta-cotizacion',
                component: RequestQuoteComponent
            },
            {
                path: 'nueva-cotizacion/:prospecto',
                component: NewQuotationComponent
            },
            {
                path: 'cotizacion-definitiva/:cotizacion/:cliente/:prospecto',
                component: QuotationDefinitiveComponent
            },
            {
                path: 'ver-cotizacion/:prospecto/:cotizacion',
                component: ViewQuotationComponent
            },
            {
                path: 'consulta-cotizacion-definitiva',
                component: QuotationDefinitiveConsultComponent
            },
            // EMISIÓN
            {
                path: 'emitir/:cotizacion/:prospecto/:mode',
                component: PolicyComponent
            },
            {
                path: 'consulta-poliza',
                component: PolicyTransactionConsultComponent
            },
            // SUSCRIPCIÓN
            {
                path: 'bandeja-solicitudes',
                component: SubscriptionRequestComponent
            },
            {
                path: 'consulta-solicitud-suscripcion',
                component: SubscriptionRequestConsultationComponent
            },
            {
                path: 'nueva-solicitud-suscripcion/:cotizacion',
                component: NewSubscriptionRequestComponent
            },
            {
                path: 'suscripcion-poliza',
                component: PolicySubscriptionComponent
            },
            {
                path: '**', redirectTo: '', pathMatch: 'full'
                // path: '**', redirectTo: 'prospectos', pathMatch: 'full'
            },
        ],
        // resolve: {
        //   token: VidaInversionService
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VidaInversionRoutingModule { }