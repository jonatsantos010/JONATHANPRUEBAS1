import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '@shared/modules/common-components.module';
import { VidaInversionRoutingModule } from './vida-inversion-routing.module';
import { MainComponent } from './main/main.component';
import { ProspectsComponent } from './views/prospects/prospects.component';
import { NavMenuProdModule } from '@shared/components/navmenuprod/navmenuprod.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoadingScreenModule } from './components/loading-screen/loading-screen.module';
import { FormButtonModule } from './components/form-button/form-button.module';
import { FormInputSelectModule } from './components/form-input-select/form-input-select.module';
import { FormInputDateModule } from './components/form-input-date/form-input-date.module';
import { FormInputTextModule } from './components/form-input-text/form-input-text.module';
import { NewProspectsComponent } from './views/new-prospects/new-prospects.component';
import { BreadcrumbModule } from './components/breadcrumb/breadcrumb.module';
import { PanelWidgetModule } from './components/panel-widget/panel-widget.module';
import { FormInputRadioModule } from './components/form-input-radio/form-input-radio.module';
import { RequestQuoteComponent } from './views/request-quote/request-quote.component';
import { NewQuotationComponent } from './views/new-quotation/new-quotation.component';
import { AddBeneficiaryComponent } from './components/add-beneficiary/add-beneficiary.component';
import { IndexStepsModule } from './components/index-steps/index-steps.module';
import { QuotationDefinitiveComponent } from './views/quotation-definitive/quotation-definitive.component';
import { AddPepComponent } from './components/add-pep/add-pep.component';
import { AddDeclarationComponent } from './components/add-declaration/add-declaration.component';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { AddRelationComponent } from './components/add-relation/add-relation.component';
import { OriginDetailModalComponent } from './components/origin-detail-modal/origin-detail-modal.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AddLeyendComponent } from './components/add-leyend/add-leyend.component';
import { AddLeyend1Component } from './components/add-leyend1/add-leyend1.component';
import { QuotationDefinitiveConsultComponent } from './views/quotation-definitive-consult/quotation-definitive-consult.component';
import { ViewQuotationComponent } from './views/view-quotation/view-quotation.component';
import { PolicyComponent } from './views/policy/policy.component';
import { PolicyTransactionConsultComponent } from './views/policy-transaction-consult/policy-transaction-consult.component';
import { SubscriptionRequestComponent } from './views/subscription-request/subscription-request.component';
import { NgModule } from '@angular/core';
import { NewSubscriptionRequestComponent } from './views/new-subscription-request/new-subscription-request.component';
import { AddWorkComponent } from './components/add-work/add-work.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { SubscriptionRequestConsultationComponent } from './views/subscription-request-consultation/subscription-request-consultation.component';
import { PolicySubscriptionComponent } from './views/policy-subscription/policy-subscription.component';
import { EndosoModalComponent } from './components/endoso-modal/endoso-modal.component';
import { PanelEndosoComponent } from './components/panel-endoso/panel-endoso.component';

@NgModule({
    imports: [
        CommonModule,
        VidaInversionRoutingModule,
        NavMenuProdModule,
        FormInputDateModule,
        FormsModule,
        FormButtonModule,
        FormInputSelectModule,
        FormInputTextModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgbModule,
        CommonComponentsModule,
        LoadingScreenModule,
        BreadcrumbModule,
        PanelWidgetModule,
        FormInputRadioModule,
        IndexStepsModule,
        NgxExtendedPdfViewerModule,
    ],
    declarations: [
        MainComponent,
        ProspectsComponent,
        NewProspectsComponent,
        RequestQuoteComponent,
        NewQuotationComponent,
        AddBeneficiaryComponent,
        QuotationDefinitiveComponent,
        AddPepComponent,
        AddFileComponent,
        AddDeclarationComponent,
        AddPropertyComponent,
        AddRelationComponent,
        OriginDetailModalComponent,
        AddLeyendComponent,
        AddLeyend1Component,
        QuotationDefinitiveConsultComponent,
        ViewQuotationComponent,
        PolicyComponent,
        PolicyTransactionConsultComponent,
        SubscriptionRequestComponent,
        NewSubscriptionRequestComponent,
        SubscriptionRequestConsultationComponent,
        PolicySubscriptionComponent,
        AddWorkComponent,
        EndosoModalComponent,
        AddWorkComponent,
        PanelEndosoComponent,
    ],
    entryComponents: [
        AddBeneficiaryComponent,
        AddPepComponent,
        AddDeclarationComponent,
        AddPropertyComponent,
        AddRelationComponent,
        AddLeyendComponent,
        AddLeyend1Component,
        OriginDetailModalComponent,
        AddWorkComponent,
        AddFileComponent,
        EndosoModalComponent,
        PanelEndosoComponent
    ],
    exports: [],
    providers: []
})

export class VidaInversionModule { }