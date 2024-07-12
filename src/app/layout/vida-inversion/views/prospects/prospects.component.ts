import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethods } from '@root/layout/broker/components/common-methods';
import { AccPersonalesService } from '@root/layout/broker/components/quote/acc-personales/acc-personales.service';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';

@Component({
    templateUrl: './prospects.component.html',
    styleUrls: ['./prospects.component.scss']

})
export class ProspectsComponent implements OnInit {

    channelSales$: Array<any>;
    branches$: Array<any>;
    product$: Array<any>;
    date_init: string
    executiveComercial$: Array<any>;
    data: Array<any>;
    intermeds: [];
    intermedsObj: {};
    type_client_select: string = null;

    FormFilter: FormGroup;
    CONSTANTS: any = VidaInversionConstants;
    CHANEL: any;
    RAMO: any;
    PRODUCT: any
    TYPE_CLIENT: any;
    TYPE_DOCUMENT: any;
    NUMBER_DOCUMENT: any;
    BOSS: any;
    SUPERVISOR: any;
    ADVISER: any;
    EJECUTIVO: any;
    
    TYPE_ADVISER: any = [{ Id: "", Name: "" }];
    TYPE_SUPERVIS: any = [{ Id: "", Name: "" }];
    TYPE_BOSS: any = [{ Id: "", Name: "" }];


    search_params = {
        client_type: {},
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

    // PROSPECTOS
    prospects_list: any = [];
    currentPage = 1;
    itemsPerPage = 9;
    totalItems = 0;
    maxSize = 10;
    profile_id: any;

    codProducto = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    username = JSON.parse(localStorage.getItem('currentUser'))['username'];
    //profile = JSON.parse(localStorage.getItem('currentUser'))['profileId'];

    constructor(private readonly builder: FormBuilder,
        public accPersonalesService: AccPersonalesService,
        private router: Router,
        public clientInformationService: ClientInformationService,
        private vidaInversionService: VidaInversionService,
        public quotationService: QuotationService,
        private parameterSettingsService: ParameterSettingsService
    ) { }




    async ngOnInit() {

        this.CHANEL = [
            { codigo: "1", valor: 'VIDA INVERSIÓN GLOBAL PROTECTA' },
        ];

        this.RAMO = [
            { codigo: "71", valor: 'VIDA INDIVIDUAL DE LARGO PLAZA' },
        ];

        this.PRODUCT = [
            { codigo: "71", valor: 'VIDA INVERSIÓN GLOBAL PROTECTA' },
        ];

        this.TYPE_CLIENT = [
            { codigo: "0", valor: 'AMBOS' },
            { codigo: "1", valor: 'CONTRATANTE' },
            { codigo: "2", valor: 'ASEGURADO' },
        ];

        this.TYPE_DOCUMENT = [
            { codigo: "0", valor: 'SELECCIONE' },
            { codigo: "1", valor: 'DNI' },
            { codigo: "2", valor: 'CARNET DE EXTRANJERÍA-CE' },
        ];


        this.EJECUTIVO = [
            { codigo: "71", valor: 'JUAN PEREZ' },
        ];

        this.BOSS = [
            { codigo: "1", valor: 'PEDRO RODRIGUEZ' },
      
          ]
      
          this.SUPERVISOR=[
            { codigo: "1", valor: 'MATIAS RUIZ' },
            { codigo: "2", valor: 'EMMA GARCÍA' },
      
          ]
      
          this.ADVISER = [
            // { codigo: "1", valor: 'USUARIO PRUEBA' },
            { codigo: "1", valor: 'ASESOR COMERCIAL' },
            { codigo: "2", valor: 'JUAN DE LA ROCA' },
          ]

        

        const request_validate_profile = {
            P_NFILTER: 0
        };
        this.quotationService.getJefeVIGP(request_validate_profile).subscribe(
            res => { this.TYPE_BOSS = res; 
                this.search_params.type_boss =  { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
            error => {
                this.TYPE_BOSS = [];
            }
        );

        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '194'){
            const request_validate_boss = {
                P_NFILTER: parseInt(JSON.parse(localStorage.getItem('currentUser'))['id'])
            };
            this.quotationService.getSupervisorVIGP(request_validate_boss).subscribe(
                res => { this.TYPE_SUPERVIS = res; 
                    this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );
            
            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA:0
            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => { this.TYPE_ADVISER = res; 
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
                error => {
                    this.TYPE_ADVISER = [];
                }
            );
        }    
        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '195'){
            const request_validate_boss = {
                P_NFILTER: 0
            };
            await this.quotationService.getSupervisorVIGP(request_validate_boss).toPromise().then(
                res => { this.TYPE_SUPERVIS = res; 
                this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                },
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );

            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA:0

            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => { this.TYPE_ADVISER = res; 
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
                error => {
                    this.TYPE_ADVISER = [];
                }
            );

        }

        if (JSON.parse(localStorage.getItem('currentUser'))['profileId'].toString() == '191'){
            const request_validate_boss = {
                P_NFILTER: 0
            };
            this.quotationService.getSupervisorVIGP(request_validate_boss).subscribe(
                res => { this.TYPE_SUPERVIS = res; 
                    this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
                error => {
                    this.TYPE_SUPERVIS = [];
                }
            );

            const request_validate_supervision = {
                P_NFILTER: 0,
                P_NIDUSERA:parseInt(JSON.parse(localStorage.getItem('currentUser'))['id']),
            };
            this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
                res => { this.TYPE_ADVISER = res; 
                    this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };},
                error => {
                    this.TYPE_ADVISER = [];
                }
            );

        }  



        this.profile_id = await this.getProfileProduct();


        let params_request = {
            P_SUSERNAME: this.profile_id == 191 ? this.username : null,
            P_NPROFILE : JSON.parse(localStorage.getItem('currentUser'))['profileId'],
            P_NIDUSER: JSON.parse(localStorage.getItem('currentUser'))['id']
        };

        this.vidaInversionService.getProspects(params_request).subscribe((res) => {
            this.data = res;
            this.currentPage = 1;
            this.totalItems = this.data.length;
            this.prospects_list = this.data.slice(
                (this.currentPage - 1) * this.itemsPerPage,
                this.currentPage * this.itemsPerPage
            );
        })

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
    pageChanged(currentPage) {
        this.currentPage = currentPage;
        this.prospects_list = this.data.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.FormFilter.controls;
    }

    // getProspectsList() {
    //     this.vidaInversionService.getProspects(this.search_params).subscribe(
    //         (res) => {
    //             console.log(res);
    //         }
    //     )
    // }

    setChannelSaleForm(): void {
        this.channelSales$ = [
            {
                id: 2021000004,
                description: 'VIDA INVERSIÓN GLOBAL PROTECTA',
            },

        ];
        this.f['channelSale'].setValue(2021000004);
        this.f['channelSale'].disable();
    }

    setExecutiveComercial(): void {
        this.executiveComercial$ = [
            {
                id: 2021222,
                description: 'Asesor 1',
            },
        ];
        this.f['executive_comercial'].setValue(2021222);
        this.f['executive_comercial'].disable();
    }

    GoToNewProspesct() {
        this.router.navigate(['extranet/vida-inversion/nuevo-prospecto']);
    }

    GoToNewQuotation(item) {
        this.router.navigate([`extranet/vida-inversion/nueva-cotizacion/${item.ID_PROSPECT}`]);
    }




    GotoReassignment(item) {
        this.getIntermeds(item.NINTERMED);
        Swal.fire({
            title: 'Información',
            text: 'Este prospecto ya esta asignado, ¿estás seguro que deseas realizar una reasignación?',
            icon: 'question',
            iconColor: '#ed6e00',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
        }).then(
            result => {
                if (result.value) {
                    const example = Swal.fire({
                        title: 'Reasignar',
                        text: 'Nombre del nuevo asignado',
                        input: 'select',
                        inputOptions: this.intermedsObj,
                        inputPlaceholder: 'SELECCIONAR',
                        confirmButtonText: 'Siguiente',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showCloseButton: true,
                        onOpen: () => Swal.getConfirmButton().focus(),
                        inputValidator: (value) => {
                            return new Promise((resolve) => {
                                if (value === "") {
                                    resolve("Debe seleccionar");
                                }
                                else {
                                    this.reasignarIntermediario(item.ID_PROSPECT, value);
                                }
                            })

                        },
                    })
                }
            }
        )
    }

    onSelectSupervision() {
        
        const request_validate_supervision = {
            P_NFILTER: this.search_params.type_supervision.codigo,
            P_NIDUSERA:0
        };
        this.quotationService.getAsesorVIGP(request_validate_supervision).subscribe(
            res => { this.TYPE_ADVISER = res;
                     this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" };
                   },
            error => {
                this.TYPE_ADVISER = [];
            }
        );
        
    }

    searchProspects() {

        const response_validate = this.validateParamsSearch();
        if (response_validate.cod_error == 1) {
            Swal.fire('Información', response_validate.error_message, 'error');
        }

        else {

            let params_request = {
                P_NCHANNEL: 1000,
                P_NPRODUCT: 10,
                P_NTYPE_CLIENT: parseInt(this.search_params.client_type["codigo"]),
                P_NTYPE_DOCUMENT: this.search_params.document_type["codigo"] == "" ? 0 : parseInt(this.search_params.document_type["codigo"]),
                P_SNUMBER_DOCUMENT: this.search_params.document_number,
                P_SNAMES: this.search_params.names,
                P_SLASTNAME: this.search_params.last_name,
                P_SLASTNAME2: this.search_params.last_name2,
                P_SUSERNAME: this.profile_id == 191 ? this.username : null,
                P_NPROFILE: JSON.parse(localStorage.getItem('currentUser'))['profileId'],
                P_NIDUSER: JSON.parse(localStorage.getItem('currentUser'))['id'],
                P_NADVISER: this.search_params.type_adviser.codigo ? this.search_params.type_adviser.codigo : "0",
            }

            if (params_request.P_SNUMBER_DOCUMENT === "") {
                params_request.P_NTYPE_DOCUMENT = 0;
            }

            this.vidaInversionService.getProspects(params_request).subscribe(
                (res) => {
                    this.data = res;
                    this.currentPage = 1;
                    this.totalItems = this.data.length;
                    this.prospects_list = this.data.slice(
                        (this.currentPage - 1) * this.itemsPerPage,
                        this.currentPage * this.itemsPerPage
                    );
                    if (res.length == 0) {
                        Swal.fire('Información', 'No se encontró información según los criterios de búsqueda ingresados.', 'error');
                    }
                }
            )
        }
    }


    validateParamsSearch() {

        const list_error = { cod_error: 0, error_message: '' };

        // TIPO DE CLIENTE
        // if (this.search_params.client_type["codigo"] == "0") {
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
        if (this.search_params.document_type["codigo"] != "" && this.search_params.document_number == "") {
            list_error.cod_error = 1;
            if (this.search_params.client_type["codigo"] != "0") {
                list_error.error_message += `Se debe ingresar el número de documento del ${this.search_params.client_type["text"]}. <br>`;
            } else {
                list_error.error_message += `Se debe ingresar el número de documento. <br>`;
            }
        }
        if (this.search_params.document_number.length > 0 && this.search_params.document_number.length < 8 && this.search_params.document_type["codigo"] == "2") {
            list_error.cod_error = 1;
            list_error.error_message += `Cantidad de caracteres del DNI incorrecto. <br>`;
        }
        if (this.search_params.document_number.length > 0 && this.search_params.document_number.length < 12 && this.search_params.document_type["codigo"] == "4") {
            list_error.cod_error = 1;
            list_error.error_message += `Cantidad de caracteres del CE incorrecto. <br>`;
        }

        // TIPO DE DOCUMENTO
        if (this.search_params.document_type["codigo"] == "" && this.search_params.document_number != "") {
            list_error.cod_error = 1;
            if (this.search_params.client_type["codigo"] != "0") {
                list_error.error_message += `Se debe seleccionar el tipo de documento del ${this.search_params.client_type["text"]}. <br>`;
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



    validateParamsSearchLegacy() {

        // this.search_params.document_type["codigo"] POR DEFECTO ESTÁ HACIENDO 2, QUE ES DNI

        const list_error = { cod_error: 0, error_message: '' };
        console.log(this.search_params.client_type);

        if (this.search_params.client_type["codigo"] == '') {
            list_error.cod_error = 1;
            list_error.error_message += 'Es obligatorio seleccionar el tipo de cliente. <br>';
        } else {

            this.type_client_select = this.search_params.client_type["valor"];

            // if ( (this.search_params.document_number.toString().length == 0) && this.search_params.client_type["codigo"] !== "0" ) { // Distinto a ambos
            //     list_error.cod_error = 1;
            //     // if () {
            //         list_error.error_message += 'Se debe ingresar el número de documento del ' + this.type_client_select + '. <br>'; // Según el tipo debe ser Contratante o Asegurado
            //     // } else {
            //         // list_error.error_message += 'Se debe ingresar el número de documento. <br>'; // Para el caso de Ambos
            // } else {
            // if (this.search_params.document_type["codigo"] == "" && this.search_params.document_number.toString().length != 0) {
            //     list_error.cod_error = 1;
            //     list_error.error_message += 'Es obligatorio seleccionar el tipo de documento. <br>';
            // }
            // if (this.search_params.document_type["codigo"] == 2 && this.search_params.document_number.toString().length != 8) {
            //     list_error.cod_error = 1;
            //     list_error.error_message += 'Cantidad de caracteres del DNI incorrecto. <br>';
            // }
            // if (this.search_params.document_type["codigo"] == 4 && this.search_params.document_number.toString().length != 12) {
            //     list_error.cod_error = 1;
            //     list_error.error_message += 'Cantidad de caracteres de CE incorrecto. <br>';
            // }
            // }
        }

        return list_error;
    }

    getIntermeds = (item) => {
        this.vidaInversionService.getIntermeds({ P_NINTERMED: item }).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.intermeds = res.C_TABLE;
                    this.intermedsObj = res.P_LIST;
                } else {
                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                }
            },
            err => {
                Swal.fire('Información', 'Ha ocurrido un error al obtener los intermediarios.', 'error')
            }
        )
    }

    reasignarIntermediario = (prospect, intermed) => {
        this.vidaInversionService.reasignarIntermediario({ P_NID_PROSPECT: prospect, P_NINTERMED: intermed }).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    Swal.fire('Información', 'Se asignó correctamente.', 'success')
                } else {
                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                }
            },
            err => {
                Swal.fire('Información', 'Ha ocurrido un error al asignar el intermediario.', 'error')
            }
        )
    }

    async clearParameters() {

        this.search_params.client_type = { COD_PRODUCT: "0" };
        this.search_params.document_type = { Id: "", codigo: "" };
        this.search_params.document_number = "";
        this.search_params.names = "";
        this.search_params.last_name = "";
        this.search_params.last_name2 = "";
        this.search_params.type_boss = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" }
        this.search_params.type_adviser = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" }
        this.search_params.type_supervision = { codigo: "0", text: "TODOS", valor: "TODOS", Id: "", Name: "" }
        


    }

    changeDocumentType() {
        this.search_params.document_number = "";
    }

}