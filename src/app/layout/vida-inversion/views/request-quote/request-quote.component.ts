import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddLeyendComponent } from '../../components/add-leyend/add-leyend.component';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { AddLeyend1Component } from '../../components/add-leyend1/add-leyend1.component';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import { VidaInversionService } from '../../services/vida-inversion.service';

@Component({
    templateUrl: './request-quote.component.html',
    styleUrls: ['./request-quote.component.scss']
})
export class RequestQuoteComponent implements OnInit {

    profile_id: any;
    data: Array<any> = [];
    CHANNEL: any;
    RAMO: any;
    PRODUCT: any
    TYPE_CLIENT: any;
    TYPE_STATE: any = [{ Id: "", Name: "" }];
    TYPE_ADVISER: any = [{ Id: "", Name: "" }];
    TYPE_SUPERVIS: any = [{ Id: "", Name: "" }];
    TYPE_BOSS: any = [{ Id: "", Name: "" }];


    TYPE_DOCUMENT: any;
    NUMBER_DOCUMENT: any;
    BOSS: any;
    SUPERVISOR: any;
    ADVISER: any;
    EJECUTIVO: any;

    CONSTANTS: any = VidaInversionConstants;
    COD_PROD_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    //profile = JSON.parse(localStorage.getItem('currentUser'))['profileId'];


    listToShowNV: any = [];
    currentPageNV = 1;
    itemsPerPageNV = 5;
    totalItemsNV = 0;
    maxSizeNV = 15;

    isLoading: boolean = false;


    search_params = {
        quotation: "",
        client_type: {
            codigo: "",
            text: "",
            valor: "",
            COD_PRODUCT: "",
            DES_PRODUCT: ""
        },
        state_type: {
            codigo: "",
            text: "",
            valor: "",
            COD_STATE: "",
            DES_STATE: ""
        },
        document_type: {
            Id: "",
            codigo: ""
        },
        document_number: "",
        names: "",
        last_name: "",
        last_name2: "",
        type_adviser: {
            codigo: "",
            text: "",
            valor: "",
            Id: "",
            Name: ""
        },
        type_supervision: {
            codigo: "",
            text: "",
            valor: "",
            Id: "",
            Name: ""
        },
        type_boss: {
            codigo: "",
            text: "",
            valor: "",
            Id: "",
            Name: ""
        },
    }

    constructor(private router: Router, private modalService: NgbModal,
        public clientInformationService: ClientInformationService,
        public quotationService: QuotationService,
        private parameterSettingsService: ParameterSettingsService,
        private vidaInversionService: VidaInversionService,
    ) { }

    async ngOnInit() {

        this.isLoading = true;

        this.quotationService.getStatusList('3', '18').subscribe(
            res => { this.TYPE_STATE = res; },
            error => {
                this.TYPE_STATE = [];
            }
        );


        this.RAMO = [
            { codigo: "71", valor: 'VIDA INDIVIDUAL DE LARGO PLAZA' },
        ];

        this.CHANNEL = [
            { codigo: "1", valor: 'VIDA INVERSIÓN GLOBAL PROTECTA' },
        ];

        this.PRODUCT = [
            { codigo: "10", valor: 'VIDA INVERSIÓN GLOBAL PROTECTA' },
        ];

        this.TYPE_CLIENT = [
            { codigo: "0", valor: 'AMBOS' },
            { codigo: "1", valor: 'CONTRATANTE' },
            { codigo: "2", valor: 'ASEGURADO' },
        ];



        // this.TYPE_STATE = [
        //     { codigo: "0", valor: 'TODOS' },
        //     { codigo: "1", valor: 'COTIZADA' },
        //     { codigo: "2", valor: 'PENDIENTE' },
        // ];
        this.TYPE_DOCUMENT = [
            { codigo: "0", valor: 'SELECCIONE' },
            { codigo: "1", valor: 'DNI' },
            { codigo: "2", valor: 'CARNET DE EXTRANJERÍA - CE' },
        ];

        this.EJECUTIVO = [
            { codigo: "71", valor: 'JUAN PEREZ' },
        ];

        this.BOSS = [
            { codigo: "1", valor: 'PEDRO RODRIGUEZ' },

        ]

        this.SUPERVISOR = [
            { codigo: "1", valor: 'MATIAS RUIZ' },
            { codigo: "2", valor: 'EMMA GARCÍA' },

        ]

        this.ADVISER = [
            { codigo: "1", valor: 'ASESOR COMERCIAL' },
            // { codigo: "1", valor: 'USUARIO PRUEBA' },
            { codigo: "2", valor: 'JUAN DE LA ROCA' },
        ]

        const quotation_list_params = {
            Nbranch: "71",
            ProductType: "10",
            User: JSON.parse(localStorage.getItem('currentUser'))['id'],
            Channel: "2060144853",
            QuotationNumber: "0",
            ClientType: "0",
            StateType: "0",
            ContractorDocumentType: "0",
            ContractorDocumentNumber: "0",
            ContractorFirstName: "0",
            ContractorPaternalLastName: "0",
            ContractorMaternalLastName: "0",
            NumberProfile: JSON.parse(localStorage.getItem('currentUser'))['profileId'],
            AdviserType: "0"
        };

        await this.getListQuotation(quotation_list_params);



        this.profile_id = await this.getProfileProduct();
        console.log(this.profile_id);

        //validacion
        const request_validate_profile = {
            P_NFILTER: 0
        };
        this.quotationService.getJefeVIGP(request_validate_profile).subscribe(
            res => {
                this.TYPE_BOSS = res;
                this.search_params.type_boss = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
            },
            error => {
                this.TYPE_BOSS = [];
            }
        );

        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '194') {
            const request_validate_boss = {
                P_NFILTER: parseInt(JSON.parse(localStorage.getItem('currentUser'))['id'])
            };
            this.quotationService.getSupervisorVIGP(request_validate_boss).subscribe(
                res => {
                    this.TYPE_SUPERVIS = res;
                    this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );

            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA: 0
            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => {
                    this.TYPE_ADVISER = res;
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_ADVISER = [];
                }
            );
        }
        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '195') {
            const request_validate_boss = {
                P_NFILTER: 0
            };
            await this.quotationService.getSupervisorVIGP(request_validate_boss).toPromise().then(
                res => {
                    this.TYPE_SUPERVIS = res;
                    this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );

            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA: 0
            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => {
                    this.TYPE_ADVISER = res;
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_ADVISER = [];
                }
            );

        }

        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '191') {
            const request_validate_boss = {
                P_NFILTER: 0
            };
            this.quotationService.getSupervisorVIGP(request_validate_boss).subscribe(
                res => {
                    this.TYPE_SUPERVIS = res;
                    this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );

            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA: parseInt(JSON.parse(localStorage.getItem('currentUser'))['id'])
            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => {
                    this.TYPE_ADVISER = res;
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_ADVISER = [];
                }
            );

        }

        this.isLoading = false;
        await this.clearParameters();

    }


    async getProfileProduct() {
        let profile = 0;

        let _data: any = {};
        _data.nUsercode = JSON.parse(localStorage.getItem('currentUser'))['id'];
        _data.nProduct = this.CONSTANTS.COD_CHA_PRODUCTO;
        await this.parameterSettingsService.getProfileProduct(_data).toPromise()
            .then(
                (res) => {
                    profile = res;
                },
                err => {
                    console.log(err)
                }
            );

        return profile;
    }
    async getListQuotation(request) {

        await this.quotationService.getQuotationsVIGP(request).toPromise().then(async (res) => {

            const response = res.GenericResponse;

            let format_res = [];

            // if (res.ErrorCode == 1) {
            //     format_res = []
            // } else { }

            if (res.ErrorCode == 0) {
                if (response.length > 0) {
                    format_res = response.map(
                        (element) => {
                            const new_element = {
                                id_cotizacion: element.QuotationNumber,
                                doc_contratante: element.ContractorDocumentNumber,
                                nom_contratante: element.ContractorFullName,
                                doc_aseg: element.InsuredDocumentNumber,
                                nom_aseg: element.InsuredFullName,
                                contribution: element.NCONTRIBUTION.toLocaleString('en-US'),
                                background: element.TYPE_FUND_DESC,
                                nom_asesor: element.AseosrComercial,
                                desc_state: element.SDESC_STATE,
                                date_preliminar: `P-${element.DEFFECT_PRELIMINARY}`,
                                date_definitiva: '-',
                                currency: element.NCURRENCY,
                                desc_currency: element.CURRENCY_DESC,
                                state_pre: element.StatusPreleminary,
                                state_def: element.StatusDefinitive,
                                remaining_days_pre: element.RemainingDaysPre,
                                remaining_days_def: element.RemainingDaysDef,
                                sclient_contractor: element.ContractorSclient,
                                sclient_insured: element.InsuredSclient,
                                NID_STATE:element.NID_STATE,
                                prospect: element.IdProspect
                                
                            }
                            if (element.DEFFECT_DEFINITIVE != "") {
                                new_element.date_definitiva = `D-${element.DEFFECT_DEFINITIVE}`;
                            }
                            return new_element;
                        }
                    )
                } else {
                    Swal.fire('Información', 'No se encontró información según los criterios de búsqueda ingresados.', 'error');
                }
            }

            this.data = format_res;
        })

        this.currentPageNV = 1;
        this.totalItemsNV = this.data.length;
        this.listToShowNV = this.data.slice(
            (this.currentPageNV - 1) * this.itemsPerPageNV,
            this.currentPageNV * this.itemsPerPageNV
        );
    }

    onSelectSupervision() {

        const request_validate_supervision = {
            P_NFILTER: this.search_params.type_supervision.codigo,
            P_NIDUSERA: 0
        };
        this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
            res => {
                this.TYPE_ADVISER = res;
                this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
            },
            error => {
                this.TYPE_ADVISER = [];
            }
        );

    }

    createQuotation(item) {
        this.router.navigate([`extranet/vida-inversion/nueva-cotizacion/${item.prospect}`]);
    }

    viewQuotation(item) {
        this.router.navigate([`extranet/vida-inversion/ver-cotizacion/${item.prospect}/${item.id_cotizacion}`]);
    }

    GoToQuoteDefinitive(item) {
        this.router.navigate([`extranet/vida-inversion/cotizacion-definitiva/${item.id_cotizacion}/${item.sclient_contractor}/${item.prospect}`]);
    }

    GotoSend() {
        Swal.fire({
            title: 'Confirmaciòn',
            text: '¿Està seguro que desea enviar la cotizaciòn?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
        }).then(
            result => {
                if (result.value) {
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Se asignó correctamente la cotizaciòn al correo correo@correo.com .',
                        icon: 'success',
                        confirmButtonText: 'Siguiente',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showCloseButton: true
                        //html: 'Seleccion: ' + result
                    })
                }
            }
        )
    }

    GotoAnular(item) {
        Swal.fire({
            title: 'Anular cotización: ' + item.id_cotizacion,
            text: '¿Està seguro(a) que desea anular la cotizaciòn?',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonColor: "#2b0d61",
        }).then(
            result => {
                if (result.value) {

                    const request_cancel_quote = {
                        QuotationNumber: item.id_cotizacion
                    }
                    this.quotationService.cancelCotizacionesVigentesVIGP(request_cancel_quote).toPromise().then((res) => {
                        console.log(res);
                    });
                    // Swal.fire({
                    //     title: 'Mensaje',
                    //     text: 'La cotizaciòn fue anulada correctamente.',
                    //     confirmButtonText: 'Aceptar',
                    //     allowOutsideClick: false,
                    //     allowEscapeKey: false,
                    //     showCloseButton: true,
                    //     confirmButtonColor: "#2b0d61",
                    //     //html: 'Seleccion: ' + result
                    // })
                }
            }
        )
    }

    openModal(modalName: String) {
        let modalRef: NgbModalRef;
        switch (modalName) {
            case 'see-leyend1':
                modalRef = this.modalService.open(AddLeyendComponent, {
                    size: 'md',
                    backdropClass: 'light-blue-backdrop',
                    backdrop: 'static',
                    keyboard: true,
                });
                modalRef.componentInstance.reference = modalRef;
                break;
            case 'see-leyend2':
                modalRef = this.modalService.open(AddLeyend1Component, {
                    size: 'md',
                    backdropClass: 'light-blue-backdrop',
                    backdrop: 'static',
                    keyboard: true,
                });
                modalRef.componentInstance.reference = modalRef;
                break;

        }
    }

    pageChangedNV(currentPageNV) {
        this.currentPageNV = currentPageNV;
        this.listToShowNV = this.data.slice(
            (this.currentPageNV - 1) * this.itemsPerPageNV,
            this.currentPageNV * this.itemsPerPageNV
        );
    }


    validateParamsSearch() {

        const list_error = { cod_error: 0, error_message: '' };

        // TIPO DE CLIENTE
        // if (this.search_params.client_type?.codigo == "0") {
        //     if (this.search_params.names != '' || this.search_params.last_name != '' || this.search_params.last_name2 != '') {
        //         list_error.cod_error = 1;
        //         list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        //     }
        // }

        // if (this.search_params.document_type?.codigo != "" && this.search_params.client_type?.codigo == "0")
        // {
        //     list_error.cod_error = 1;
        //     list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        // }
        // if (this.search_params.names != '' && this.search_params.client_type?.codigo == "0" )
        // {
        //     list_error.cod_error = 1;
        //     list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        // }
        // if (this.search_params.last_name != '' && this.search_params.client_type?.codigo == "0" )
        // {
        //     list_error.cod_error = 1;
        //     list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        // }
        // if (this.search_params.last_name2 != '' && this.search_params.client_type?.codigo == "0" )
        // {
        //     list_error.cod_error = 1;
        //     list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        // }

        // NÚMERO DE DOCUMENTO
        if (this.search_params.document_type?.codigo != "" && this.search_params.document_number == "") {
            list_error.cod_error = 1;
            if (this.search_params.client_type?.codigo != "0") {
                list_error.error_message += `Se debe ingresar el número de documento del ${this.search_params.client_type?.text}. <br>`;
            } else {
                list_error.error_message += `Se debe ingresar el número de documento. <br>`;
            }
        }
        if (this.search_params.document_number.length > 0 && this.search_params.document_number.length < 8 && this.search_params.document_type?.codigo == "2") {
            list_error.cod_error = 1;
            list_error.error_message += `Cantidad de caracteres del DNI incorrecto. <br>`;
        }
        if (this.search_params.document_number.length > 0 && this.search_params.document_number.length < 12 && this.search_params.document_type?.codigo == "4") {
            list_error.cod_error = 1;
            list_error.error_message += `Cantidad de caracteres del CE incorrecto. <br>`;
        }

        // TIPO DE DOCUMENTO
        if (this.search_params.document_type?.codigo == "" && this.search_params.document_number != "") {
            list_error.cod_error = 1;
            if (this.search_params.client_type?.codigo != "0") {
                list_error.error_message += `Se debe seleccionar el tipo de documento del ${this.search_params.client_type?.text}. <br>`;
            } else {
                list_error.error_message += `Se debe seleccionar el tipo de documento. <br>`;
            }
        }

        // if (this.search_params.client_type["codigo"] == '') {
        //     list_error.cod_error = 1;
        //     list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        // } else {
        //     if (this.search_params.document_type.codigo == "2" && this.search_params.document_number.toString().length != 8) {
        //         list_error.cod_error = 1;
        //         list_error.error_message += 'Cantidad de caracteres del DNI incorrecto. <br>';
        //     }
        //     if (this.search_params.document_type.codigo == "4" && this.search_params.document_number.toString().length != 12) {
        //         list_error.cod_error = 1;
        //         list_error.error_message += 'Cantidad de caracteres de CE incorrecto. <br>';
        //     }
        // }

        return list_error;
    }

    searchQuotations() {

        const response_validate = this.validateParamsSearch();
        if (response_validate.cod_error == 1) {
            Swal.fire('Información', response_validate.error_message, 'error');
            return;
        }

        console.log(this.search_params);

        const request = {
            Nbranch: "71",
            ProductType: "10",
            User: JSON.parse(localStorage.getItem('currentUser'))['id'],
            Channel: "2060144853",
            QuotationNumber: this.search_params.quotation ? this.search_params.quotation : "0",
            StateType: this.search_params.state_type.codigo ? this.search_params.state_type.codigo : "0",
            ClientType: this.search_params.client_type.codigo ? this.search_params.client_type.codigo : "0",
            ContractorDocumentType: this.search_params.document_type.Id ? this.search_params.document_type.Id.toString() : "0",
            ContractorDocumentNumber: this.search_params.document_number ? this.search_params.document_number.toString() : "0",
            ContractorFirstName: this.search_params.names ? this.search_params.names.toString() : "0",
            ContractorPaternalLastName: this.search_params.last_name ? this.search_params.last_name.toString() : "0",
            ContractorMaternalLastName: this.search_params.last_name2 ? this.search_params.last_name2.toString() : "0",
            NumberProfile: JSON.parse(localStorage.getItem('currentUser'))['profileId'],
            AdviserType: this.search_params.type_adviser.codigo ? this.search_params.type_adviser.codigo : "0",
        };

        console.log(request);

        this.getListQuotation(request);
    }

    async clearParameters() {
        this.search_params.quotation = "",
            this.search_params.client_type = { codigo: "0", text: "AMBOS", valor: "AMBOS", COD_PRODUCT: "", DES_PRODUCT: "" };
        this.search_params.state_type = { codigo: "0", text: "TODOS", valor: "TODOS", COD_STATE: "", DES_STATE: "" };
        this.search_params.document_type = { Id: "", codigo: "" };
        this.search_params.document_number = "";
        this.search_params.names = "";
        this.search_params.last_name = "";
        this.search_params.last_name2 = "";
        this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
        this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
        this.search_params.type_boss = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };

    }

    changeDocumentType() {
        this.search_params.document_number = "";
    }

    SendQuotation(QuotationNumber) {
        Swal.fire('Confirmación', '¿Está seguro de que desea enviar la cotización?', 'warning').then(
            result => {
                if (result.value) {
                    let params = {
                        P_NBRANCH: this.CONSTANTS.RAMO,
                        P_NID_COTIZACION: QuotationNumber,
                        P_NIDHEADERPROC: null,
                        P_NTYPE_DOCUMENT_SEND: 2
                    }
                    this.vidaInversionService.AddEmailVIGP(params).subscribe(
                        res => {
                            if (res.Result.P_ERROR == 0) {
                                Swal.fire('Mensaje', res.Reseult.P_MESSAGE, 'success');
                            } else {
                                Swal.fire('Mensaje', res.Reseult.P_MESSAGE, 'error');
                            }
                        },
                        err => {
                            Swal.fire('Mensaje', 'Ha ocurrido un error al enviar la cotización.', 'error');
                        }
                    )
                }
            }
        )
    }
}
