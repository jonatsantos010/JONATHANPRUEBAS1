import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddPepComponent } from '../../components/add-pep/add-pep.component';
import { AddPropertyComponent } from '../../components/add-property/add-property.component';
import { AddRelationComponent } from '../../components/add-relation/add-relation.component';
import { AddDeclarationComponent } from '../../components/add-declaration/add-declaration.component';
import { AddBeneficiaryComponent } from '../../components/add-beneficiary/add-beneficiary.component';
import { OriginDetailModalComponent } from '../../components/origin-detail-modal/origin-detail-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { CommonMethods } from '../../../broker/components/common-methods';
import { DataContractor } from '../../models/DataContractor';
import { DataInsured } from '../../models/DataInsured';
import { AccPersonalesService } from '../../../broker/components/quote/acc-personales/acc-personales.service';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import { AddressService } from '../../../broker/services/shared/address.service';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import Swal from 'sweetalert2';
import { AddFileComponent } from '../../components/add-file/add-file.component';

@Component({
    templateUrl: './quotation-definitive.component.html',
    styleUrls: ['./quotation-definitive.component.scss']
})


export class QuotationDefinitiveComponent implements OnInit {

    quotation_id: number = 0;
    profile_id: any;

    quotation: any = {
        moneda: '',
        fondo: '',
        contribution: '',
        date_fund: new Date(),
        nid_proc: "",
        periodo: '',
        monedaDesc: '',
        date_fundDesc: '',
        contributionDesc: 0,
        date_fund_disabled: false
    };
    sclient: string = '0';
    prospect_id: any;

    showCoordinadorBtn: boolean = false;
    showGerenteBtn: boolean = false;
    dissabled_next_button: boolean = false; //  se creo para no 2 o mas veces al metodo

    showScoreBtn: boolean = true;
    randomItem: string = '';

    comentarios: any[];
    comentario: string;

    CONSTANTS: any = VidaInversionConstants;
    isLoading: boolean = false;
    dissabled_btn_modal_detail_origin: boolean = false;
    
    dissabled_btn_modal_add_benef: boolean = false;
    

    boolNumberCTR: boolean = false;
    boolNumberASG: boolean = false;
    boolEmailCTR: boolean = false;
    boolEmailASG: boolean = false;
    @Input() check_input_value;
    @Input() check_input_value_beneficiary = 1;
    @Input() check_input_nationality;
    @Input() check_input_relationship;
    @Input() check_input_fiscal_obligations;

    CODPRODUCTO_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    NID_STATE: number;
    DEF_STATE: number;
    pdfFile = '';
    investment: any = [];
    error_msg = "";
    error_upd_360 = "0";
    serror = "";
    contractor_province_department: any = false;
    contractor_province_selected: any = false;
    insured_province_department: any = false;
    insured_province_selected: any = false;

    value_pep: any = 0;
    value_properties: any = 0;
    value_relationship: any = 0;
    value_declaration: any = 0;

    type_rol: any;
    ocupation_value: any;
    step_list: any;
    now_date: any;
    pep_data: any // ALMACENA LOS DATOS PEP
    check_input_value_360: any; //Valor si el Contratante === Asegurado o no que es traido de BD
    parse_amount: any;
    show_guide: boolean = false;
    new_client_insured = false; // Indica si es cliente Ya se encuentra registrado en el 360 o no
    desc_scoring: any = "-";
    recomendacion: any = "";
    sum_scoring: any = '';
    current_step: number;
    cur_usr: any;
    pro_usr: any;

    CURRENCY: any;
    TIME: any = [];
    APORT: any;
    NATIONALITY: any;
    FONDO: any;

    list_files: any = [];
    filesList: any = [];

    list_data_contractor_department: any = [];
    list_data_contractor_province: any = [];
    list_data_contractor_district: any = [];

    list_data_insured_department: any = [];
    list_data_insured_province: any = [];
    list_data_insured_district: any = [];
    list_civil_state_contractor: any = [];
    list_civil_state_insured: any = [];

    list_nationalities_contractor: any = [];
    list_nationalities_insured: any = [];
    list_occupation_contractor: any = [];
    list_gender_contractor: any = [];
    list_benefeciarys: any = [];
    list_document_type_contractor: any = [];
    steps_list: any;

    origin_fund_saving_percent: any = 0; // Origen de fondo ahoro
    origin_fund_spp_percent: any = 0; // Origen de fondo sistema privadode pensiones

    chekedsumamaxima: boolean = false;
    current_quotation_selected: any;

    perfilamiento: any = {
        question1: "",
        question2: "",
        question3: "",
        question4: "",
        question5: "",
        perfilamiento_exist: false,
        question1_disabled:false,
        question2_disabled:false,
        question3_disabled:false,
        question4_disabled:false,
        question5_disabled:false
    }

    options_perfilamiento_question1 = [];
    options_perfilamiento_question2 = [];
    options_perfilamiento_question3 = [];
    options_perfilamiento_question4 = [];
    options_perfilamiento_question5 = [];
    list_occupation_id: any = {
        Id: 0,
        Name: ""
    }

    data_complementary: any = {
        occupation_status: 0,
        occupation_status_disabled:false
    }

    data_quotation_complementary: any = {
        P_NID_PROSPECT: 0,
        P_NOCCUPATION: 0,
        P_NNATUSA: 3,
        P_NCONPARGC: 3,
        P_NOFISTRI: 3,
        P_USER: 0
    }

    //ACTUALIZAR REGISTRO
    nregister_contractor = 0;
    nregister_insured = 0;
    nregister_parentesco = 0;
    nregister_nnatusa = 0;
    nregister_nconpargc = 0;
    nregister_nofistri = 0;
    nregister_noccupation = 0;


    // BENEFICIARIOS
    listToShow_benefeciarys: any = [];
    currentPage = 1;
    itemsPerPage = 2;
    totalItems = 0;
    maxSize = 10;

    data_contractor: DataContractor = {
        sclient: "",
        type_document: "",
        document_number: "",
        birthday_date: "",
        names: "",
        last_name: "",
        last_name2: "",
        gender: "",
        civil_status: "",
        nationality: "",
        department: "",
        province: "",
        district: "",
        phone: "",
        email: "",
        address: "",

        type_document_disabled: true,
        document_number_disabled: true,
        birthday_date_disabled: true,
        names_disabled: true,
        last_name_disabled: true,
        last_name2_disabled: true,
        gender_disabled: true,
        civil_status_disabled: false,
        nationality_disabled: false,
        department_disabled: false,
        province_disabled: false,
        district_disabled: false,
        phone_disabled: false,
        email_disabled: false,
        address_disabled: false,
    };


    data_insured: DataInsured = {
        sclient: "",
        type_document: "",
        document_number: "",
        birthday_date: "",
        names: "",
        last_name: "",
        last_name2: "",
        gender: "",
        civil_status: "",
        nationality: "",
        department: {},
        province: {},
        district: {},
        phone: "",
        email: "",
        address: "",

        type_document_disabled: false,
        document_number_disabled: false,
        birthday_date_disabled: true,
        names_disabled: true,
        last_name_disabled: true,
        last_name2_disabled: true,
        gender_disabled: true,
        civil_status_disabled: false,
        nationality_disabled: false,
        department_disabled: false,
        province_disabled: false,
        district_disabled: false,
        phone_disabled: false,
        email_disabled: false,
        address_disabled: false,
    };


    data_contractor_360: DataContractor = { // Info traida 360 Directamente
        sclient: "",
        type_document: "",
        document_number: "",
        birthday_date: "",
        names: "",
        last_name: "",
        last_name2: "",
        gender: "",
        civil_status: "",
        nationality: "",
        department: [],
        province: [],
        district: [],
        phone: "",
        email: "",
        address: "",
    };


    data_insured_360: DataInsured = { // Info traida 360 Directamente
        sclient: "",
        type_document: "",
        document_number: "",
        birthday_date: "",
        names: "",
        last_name: "",
        last_name2: "",
        gender: "",
        civil_status: "",
        nationality: "",
        department: [],
        province: [],
        district: [],
        phone: "",
        email: "",
        address: "",
    };
    status_contractor_disabled = false;
    check_input_nationality_disabled = false;
    check_input_relationship_disabled = false;
    check_input_fiscal_obligations_disabled = false;
    check_input_value_beneficiary_disabled = false;
    actions = true;
    registerDatapet = true;
    firmaManuscrita = false;

    /* DGC - VIGP PEP - 06/02/2024 - INICIO */
    idecon_contractor: any = {
        otherList: 'NO',
        pep: 'NO',
        famPep: 'NO'
    }

    idecon_insured: any = {
        otherList: 'NO',
        pep: 'NO',
        famPep: 'NO'
    }

    world_check_contractor: any = {
        otherList: 'NO',
        pep: 'NO'
    }

    world_check_insured: any = {
        otherList: 'NO',
        pep: 'NO'
    }

    experian_contractor: any = {
        riskClient: 'NO'
    }

    experian_insured: any = {
        riskClient: 'NO'
    }
    /* DGC - VIGP PEP - 06/02/2024 - FIN */

    exist_origin_detail_spp: boolean = false;
    exist_origin_detail_saving_financial_institution: boolean = false;

    constructor(
        private router: Router,
        public clientInformationService: ClientInformationService,
        public addressService: AddressService,
        private vidaInversionService: VidaInversionService,
        private quotationService: QuotationService,
        private readonly activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private acc_personales_service: AccPersonalesService,
        private parameterSettingsService: ParameterSettingsService,
    ) {
        pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

    async ngOnInit() {
        this.isLoading = true;
        this.quotation_id = parseInt(this.activatedRoute.snapshot.params["cotizacion"]);
        this.step_list = [
            {
                step_index: 1,
                tittle: "Datos del Contratante/Asegurado"
            },
            {
                step_index: 2,
                tittle: "Nueva Cotización"
            },
            {
                step_index: 3,
                tittle: "Cotización"
            },
            {
                step_index: 4,
                tittle: "Perfilamiento"
            },
            {
                step_index: 5,
                tittle: "File del cliente/Comentarios"
            },
            {
                step_index: 6,
                tittle: "Datos del Producto"
            }
        ];
        this.getNidStateAndDefState();
        this.sclient = this.activatedRoute.snapshot.params["cliente"];
        this.prospect_id = this.activatedRoute.snapshot.params["prospecto"];
        this.cur_usr = JSON.parse(localStorage.getItem('currentUser'));

        // firstName
        this.profile_id = await this.getProfileProduct();

        if(this.profile_id == 203 ||this.profile_id ==196 ){
            this.data_contractor = {
                type_document_disabled: true,
                document_number_disabled: true,
                birthday_date_disabled: true,
                names_disabled: true,
                last_name_disabled: true,
                last_name2_disabled: true,
                gender_disabled: true,
                civil_status_disabled: true,
                nationality_disabled: true,
                department_disabled: true,
                province_disabled: true,
                district_disabled: true,
                phone_disabled: true,
                email_disabled: true,
                address_disabled: true,
            };
            this.data_insured = {
                type_document_disabled: true,
                document_number_disabled: true,
                birthday_date_disabled: true,
                names_disabled: true,
                last_name_disabled: true,
                last_name2_disabled: true,
                gender_disabled: true,
                civil_status_disabled: true,
                nationality_disabled: true,
                department_disabled: true,
                province_disabled: true,
                district_disabled: true,
                phone_disabled: true,
                email_disabled: true,
                address_disabled: true,
            };
            this.status_contractor_disabled = true;
            this.data_complementary.occupation_status_disabled = true;
            this.check_input_nationality_disabled = true;
            this.check_input_relationship_disabled = true;
            this.check_input_fiscal_obligations_disabled = true;
            this.quotation.date_fund_disabled = true;
            this.check_input_value_beneficiary_disabled = true;
            this.perfilamiento.question1_disabled = true;
            this.perfilamiento.question2_disabled = true;
            this.perfilamiento.question3_disabled = true;
            this.perfilamiento.question4_disabled = true;
            this.perfilamiento.question5_disabled = true; 
            this.actions = false;
            this.registerDatapet = false;
        }
       

        this.getDatosPep();
        this.SelDatosPEPVIGP();
        this.GetCommentsCotiVIGP();
        this.readFile();

        this.type_rol = '0';
        this.sum_scoring = '';
        this.check_input_value = 1;
        this.current_step = 1;
        this.now_date = new Date();

        // FOR Contractor
        // Se les esta agregando un await para poder Controlarlo
        await this.clientInformationService.getDocumentTypeList(this.CODPRODUCTO_PROFILE).toPromise().then((result) => {
            this.list_document_type_contractor = result;
        }).catch((err) => {
        });

        this.clientInformationService.getGenderList().toPromise().then((result) => {
            this.list_gender_contractor = result;
        })

        await this.clientInformationService.getCivilStatusList().toPromise().then((result) => {
            this.list_civil_state_contractor = result;
        }).catch((err) => {
        });

        // Ocupacion
        await this.clientInformationService.getOccupationTypeList().toPromise().then((result) => {
            this.list_occupation_contractor = result;
        })


        await this.clientInformationService.getNationalityList().toPromise().then((result) => {
            this.list_nationalities_contractor = result;
        }).catch((err) => {
        });

        // Asegurado
        await this.clientInformationService.getCivilStatusList().toPromise().then((result) => {
            this.list_civil_state_insured = result;
        }).catch((err) => {
        });

        await this.clientInformationService.getNationalityList().toPromise().then((result) => {
            this.list_nationalities_insured = result;
        }).catch((err) => {
        })

        await this.acc_personales_service.getCurrency({ nproduct: this.CONSTANTS.COD_PRODUCTO, nbranch: this.CONSTANTS.RAMO }).toPromise().then((result) => {
            this.CURRENCY = result;
        }).catch((err) => {
        });

        await this.vidaInversionService.investmentFunds().toPromise().then((result) => {
            this.investment = result;
        }).catch((err) => {
        });


        await this.vidaInversionService.savingTime().toPromise().then((result) => {
            this.TIME = result;
        }).catch((err) => {
        });

        const request_search_prospect = { P_NID_PROSPECT: this.prospect_id };

        await this.vidaInversionService.searchByProspect(request_search_prospect).toPromise().then(async res => {

            this.data_contractor.type_document = { Id: res.TYPE_DOC_CONTRACTOR }
            this.data_contractor.document_number = res.DOC_CONTRACTOR;

            const params_360 = {
                P_TipOper: 'CON',
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                P_NIDDOC_TYPE: this.data_contractor.type_document.Id,
                P_SIDDOC: this.data_contractor.document_number,
            };

            await this.clientInformationService.getCliente360(params_360).toPromise().then(async res => {
                if (res.P_NCODE == "0") {
                    if (res.EListClient[0].P_SCLIENT == null) {
                    }
                    else {
                        if (res.EListClient.length === 1) {
                            if (res.EListClient[0].P_SIDDOC != null) {
                                await this.cargarDatosContractor(res, 1);
                                await this.invokeServiceExperia(1); // Cambiando a metodo asincrono ya que se demora mucho en responder el Servicio
                                // await this.getWorldCheck(1); // Cambiando a metodo asincrono ya que se demora mucho en responder el Servicio
                                await this.getIdecon(1); // Cambiando a metodo asincrono ya que se demora mucho en responder el Servicio
                                await this.consultProspect(1);
                                await this.ConsultDataComplementary(1);
                                this.data_contractor_360 = { ...this.data_contractor }; // Almacenando la Info de Inicio del 360 para el Contratante en una Variable para validacino si cambio alguna info
                            }
                        }
                    }

                }
                else if (res.P_NCODE === "2" || res.P_NCODE === "1" || res.P_NCODE === "3") {
                    this.clearData(1);
                    this.isLoading = false;
                    Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
                }
            }, error => {
                this.isLoading = false;
                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
            }
            )
        })

        this.TIME = [
            { codigo: "1", valor: '7 AÑOS' },
            { codigo: "2", valor: '8 AÑOS' },
        ];

        this.APORT = [
            { codigo: "1", valor: '10,000' },
            { codigo: "2", valor: '20,000' },
            { codigo: "3", valor: '30,000' },
            { codigo: "4", valor: '40,000' },
        ];

        this.FONDO = [
            { codigo: "1", valor: 'MODERADO' },
        ];

        this.list_files = [
            {   // 01
                desc: "SOLICITUD DEL SEGURO",
                value: "solicitud_del_seguro",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 02
                desc: "COTIZACIÓN OFICIAL DE FIRMA",
                value: "cotizacion_oficial_de_firma",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 03
                desc: "INFORMACIÓN COMPLEMENTARIA",
                value: "informacion_complementaria",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 04
                desc: "CONSTANCIA DE PAGO",
                value: "constancia_de_pago",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 05
                desc: "FORMATO PEP",
                value: "formato_pep",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 06
                desc: "DECLARACIÓN JURADA DE ANTECEDENTES",
                value: "declaracion_jurada_de_antecedentes",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 07
                desc: "DECLARACIÓN DE FONDOS",
                value: "declaracion_de_fondos",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 08
                desc: "INFORME PEP",
                value: "informe_pep",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 09
                desc: "DOCUMENTOS DE SUSTENTO DE ORIGEN DE FONDOS",
                value: "documentos_de_sustento_de_origen_de_fondos",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 10
                desc: "CRONOGRAMA DE PAGOS",
                value: "cronograma_de_pagos",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 11
                desc: "CUADRO DE RESCATE",
                value: "cuadro_de_rescate",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 12
                desc: "DECLARACIÓN JURADA DEL PERFIL INVERSIONISTA",
                value: "declaracion_jurada_del_perfil_inversionista",
                type: "ARCHIVO PDF",
                flag: 2
            },
            {   // 13
                desc: "DNI DEL CLIENTE",
                value: "dni_del_cliente",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 14
                desc: "DNI DE BENEFICIARIOS MENORES DE EDAD",
                value: "dni_de_beneficiarios_menores_de_edad",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 15
                desc: "VOUCHER DE PAGO",
                value: "voucher_de_pago",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 16
                desc: "FICHA RENIEC ASEGURAD / CONTRATANTE",
                value: "ficha_reniec_asegurado_contratante",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 17
                desc: "FICHA RENIEC BENEFICIARIOS",
                value: "ficha_reniec_beneficiarios",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 18
                desc: "REPORTE EXPERIAN, WC, IDECON",
                value: "reporte_experian",
                type: "ARCHIVO PDF",
                flag: 1
            },
            {   // 0
                desc: "OTROS",
                value: "otros",
                type: "ARCHIVO PDF",
                flag: 0
            }
        ];

        const search_scoring = {
            P_NID_COTIZACION: this.quotation_id,
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
        }
        await this.vidaInversionService.RequestScoring(search_scoring).toPromise().then(res => {
            if (res.P_COD_ERR == 1) { }  //Error
            else if (res.P_COD_ERR == 2) { } // Es porque se puede registrar, no existe data en las tablas
            else {

                this.desc_scoring = res.P_DESC_SCORING;
                this.recomendacion = res.P_RECOMENDACION;
                this.sum_scoring = res.P_SUM_SCORING;
                this.perfilamiento.question1 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[0].P_SANSWER;
                this.perfilamiento.question2 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[1].P_SANSWER;
                this.perfilamiento.question3 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[2].P_SANSWER;
                this.perfilamiento.question4 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[3].P_SANSWER;
                this.perfilamiento.question5 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[4].P_SANSWER;
                this.perfilamiento.perfilamiento_exist = res.P_COD_ERR == 0 ? true : false;
            }
        });

        const get_data_coti = {
            QuotationNumber: this.quotation_id
        };

        await this.quotationService.GetCotizacionPre(get_data_coti).toPromise().then((res) => {
            if (res.P_COD_ERROR == 1) {
                this.quotation.date_fund = new Date();
                this.quotation.contribution = "";
                this.quotation.fondo = "";
                this.quotation.moneda = "";
                this.quotation.periodo = "";
                this.quotation.monedaDesc = "";
                this.quotation.date_fundDesc = "";
            }
            else {

                this.getCurrency(res.P_NCURRENCY);

                this.parse_amount = CommonMethods.formatNUMBER(res.P_CONTRIBUTION);
                this.quotation.contribution = this.parse_amount;
                this.quotation.contributionDesc = res.P_CONTRIBUTION;
                this.quotation.date_fundDesc = res.P_DDATE_FUND;
                this.quotation.periodo = res.P_NSAVING_TIME;

                if (this.quotation.contribution.toUpperCase() == "NAN") {
                    this.quotation.contribution = '';
                }

                this.quotation.fondo = { NFUNDS: res.P_NFUNDS };
                this.quotation.moneda = { NCODIGINT: res.P_NCURRENCY };

                let split_date_date_fund = res.P_DDATE_FUND.split('/');
                this.quotation.date_fund = new Date(parseInt(split_date_date_fund[2]), parseInt(split_date_date_fund[1]) - 1, parseInt(split_date_date_fund[0]));

                this.quotation.nid_proc = res.CodigoProceso;
                

                this.list_benefeciarys = res.List_beneficiary.map(element => {
                    return {
                        type_doc: element.niddoc_type_beneficiary,
                        type_document: { Id: element.niddoc_type_beneficiary, desc_type_doc: element.sdesc_doc },
                        siddoc: element.siddoc_beneficiary,
                        desc_type_doc: element.sdesc_doc,
                        srelation_name: element.sdesc_srelation,
                        percentage_participation: element.percen_participation,
                        nationality: { NNATIONALITY: element.nnationality },
                        desc_nationality: element.sdesc_nationality,
                        sfirstname: element.sfirstname.toUpperCase(),
                        slastname: element.slastname.toUpperCase(),
                        last_name2: element.slastname2.toUpperCase(),
                        birthday_date: element.dbirthdat,
                        gender: { id: element.ssexclien },
                        relation: { NCODIGO: element.srelation },
                        email: element.se_mail,
                        phone: element.sphone,
                        assignment: element.percen_participation,
                    };
                })

                if (this.list_benefeciarys.length > 0) {
                    this.check_input_value_beneficiary = 0;
                }

                this.currentPage = 1;
                this.totalItems = this.list_benefeciarys.length;
                this.listToShow_benefeciarys = this.list_benefeciarys.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                );
            }
        });


        await this.vidaInversionService.GetOriginDetailCab(this.quotation_id).toPromise().then((res) => {
            if (res.length > 0) {
                const response = res[0];

                // CON ESTA DATA SABREMOS SI la cotizacino tiene todo a segura de pensiona , todo a ahorros financieros o compartido.

                // CAMBIOS PARA SISTEMA PRIVADO DE PENSIONES
                if (response.P_NCUSPP != 0 && response.P_NPRIVATE_PENSION_SYSTEM != 0) {
                    this.exist_origin_detail_spp = true;

                }

                if (response.P_NSAVING_FINANCIAL_INSTITUTION1 || response.P_NSAVING_FINANCIAL_INSTITUTION2 || response.P_NSAVING_FINANCIAL_INSTITUTION3 || response.P_NSAVING_FINANCIAL_INSTITUTION4) {
                    this.exist_origin_detail_saving_financial_institution = true;
                }
            }

            else {

            }
        });

        await this.vidaInversionService.GetOriginDetailDet(this.quotation_id).toPromise().then((res) => {
            if (res.length > 0) {
                const response = res[0];

                this.dissabled_btn_modal_detail_origin = true;

            
                // Retorna la suma de los Porcentajes

                if (this.exist_origin_detail_spp == true && this.exist_origin_detail_saving_financial_institution == false) {
                    this.origin_fund_saving_percent = 0;
                    this.origin_fund_spp_percent = 100;
                }
                else if (this.exist_origin_detail_saving_financial_institution == true && this.exist_origin_detail_spp == false) {
                    this.origin_fund_saving_percent = 100;
                    this.origin_fund_spp_percent = 0;
                }

                else {

                    let sum_origin_detail = Number.parseFloat(response.P_NBUSINESS_INCOME) + Number.parseFloat(response.P_NREMUNERATIONS) + Number.parseFloat(response.P_NGRATIFICATIONS) + Number.parseFloat(response.P_NBUSINESS_DIVIDENS) + Number.parseFloat(response.P_NSALE_SECURITIES) + Number.parseFloat(response.P_NCANCELED_BANK_CERTIFICATES) + Number.parseFloat(response.P_NLOAN) + Number.parseFloat(response.P_NINCOME_PERSONAL_FEES) + Number.parseFloat(response.P_NCOMPENSATION_SERVICE_TIME) + Number.parseFloat(response.P_NLABOR_PROFITS) + Number.parseFloat(response.P_NSALES_ESTATES) + Number.parseFloat(response.P_NINHERITANCE) + Number.parseFloat(response.P_NCANCELLATION_TERM_DEPOSITS) + Number.parseFloat(response.P_NOTHERS);

                    // this.origin_fund_saving_percent = sum_origin_detail;
                    // this.origin_fund_spp_percent = (100 - Number.parseFloat(this.origin_fund_saving_percent)).toFixed(2);

                    this.origin_fund_saving_percent = (sum_origin_detail).toFixed(0);
                    this.origin_fund_spp_percent = (100 - sum_origin_detail).toFixed(0);
                }
            }
        });

        await this.vidaInversionService.getScoringOptions().toPromise().then((res) => {

            this.options_perfilamiento_question1 = res.filter((item) => item.P_NQUESTION === 1);
            this.options_perfilamiento_question2 = res.filter((item) => item.P_NQUESTION === 2);
            this.options_perfilamiento_question3 = res.filter((item) => item.P_NQUESTION === 3);
            this.options_perfilamiento_question4 = res.filter((item) => item.P_NQUESTION === 4);
            this.options_perfilamiento_question5 = res.filter((item) => item.P_NQUESTION === 5);

        });

        this.isLoading = false;
    }


    getCurrency = (item) => {
        this.acc_personales_service.getCurrency({ nproduct: this.CONSTANTS.COD_PRODUCTO, nbranch: this.CONSTANTS.RAMO }).subscribe(
            res => {
                let temp = res.filter(x => x.NCODIGINT == item);
                this.quotation.monedaDesc = temp[0].SDESCRIPT;
            }
        );
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

    getDatosPep = () => {
        this.quotationService.getDatosPep({ P_NID_COTIZACION: this.quotation_id, P_SCLIENT: this.sclient }).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.value_pep = res.P_NSECCION;
                }
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error obteniendo los datos PEP.", 'error');
            }
        )
    }

    SelDatosPEPVIGP = () => {
        this.vidaInversionService.SelDatosPEPVIGP({ P_NID_COTIZACION: this.quotation_id, P_SCLIENT: this.sclient }).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.value_properties = res.P_NSECCION_1;
                    this.value_relationship = res.P_NSECCION_2;
                    this.value_declaration = res.P_NSECCION_3;
                }
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error obteniendo los datos PEP.", 'error');
            }
        )
    }

    pageChanged(currentPage) {
        this.currentPage = currentPage;
        this.listToShow_benefeciarys = this.list_benefeciarys.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
    }

    changeValue(value) {
        this.check_input_value = value;
        if (this.check_input_value == 0) {
            this.show_guide = true;
            setTimeout(() => {
                this.show_guide = false;
            }, 5000);
        }

    }

    onSelectDepartament() {
        this.contractor_province_department = true;
        this.contractor_province_selected = false;
        this.data_contractor.province = { Id: null };
        this.data_contractor.district = { Id: null };
        this.list_data_contractor_district = [];

        this.addressService.getProvinceList(this.data_contractor?.department?.Id).toPromise().then(res => {
            this.list_data_contractor_province = res;
            this.data_contractor.province = { Id: 0 }
        });

    }

    onSelectProvince() {
        this.contractor_province_selected = true;
        this.list_data_contractor_district = [];

        this.addressService.getDistrictList(this.data_contractor?.province?.Id).toPromise().then(res => {
            this.list_data_contractor_district = res;
            this.data_contractor.district = { Id: null };
        });
    }

    onSelectDepartamentInsured() {
        this.insured_province_department = true;
        this.insured_province_selected = false;
        this.data_insured.province = { Id: null };
        this.data_insured.district = { Id: null };
        this.list_data_insured_district = [];

        this.addressService.getProvinceList(this.data_insured?.department?.Id).toPromise().then(res => {
            this.list_data_insured_province = res;
            this.data_insured.province = { Id: 0 }
        });
    }

    onSelectProvinceInsured() {

        this.insured_province_selected = true;
        this.list_data_insured_district = [];

        this.addressService.getDistrictList(this.data_insured?.province?.Id).toPromise().then(res => {
            this.list_data_insured_district = res;
            this.data_insured.district = { Id: null };
        });
    }

    //this.check_input_fiscal_obligations=0;

    changeValueBenefeciary(value) {
        this.check_input_value_beneficiary = value;
    }

    changeValueNationality(value) {
        this.check_input_nationality = value;
    }


    changeValueRelationship(value) {
        this.check_input_relationship = value;
    }

    changeValueFiscal_obligations(value) {
        this.check_input_fiscal_obligations = value;
    }

    ValidateInputStep1() {

        this.error_msg = "";

        if (this.data_contractor.type_document == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        if (this.data_contractor.document_number == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.birthday_date == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.names == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.last_name == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.last_name2 == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        if (this.data_contractor.civil_status.codigo == "0") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.nationality.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.phone == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        // if (this.data_contractor.email == "") {
        //     this.error_msg += 'Se debe completar todos los campos para continuar<br>';
        //     return this.error_msg;
        // }

        if (this.esEmailValido(this.data_contractor.email)) {
            console.log('El formato del correo es correcto.');
        } else {
            this.error_msg += 'El formato del correo es incorrecto.<br>';
            return this.error_msg;
        }


        if (this.data_contractor.address == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.department.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.province.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_contractor.district.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }


        if (this.data_complementary.occupation_status.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }


        if ((this.check_input_nationality != 0) && (this.check_input_nationality != 1)) {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }


        if ((this.check_input_relationship != 0) && (this.check_input_relationship != 1)) {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }


        if ((this.check_input_fiscal_obligations != 0) && (this.check_input_fiscal_obligations != 1)) {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        return this.error_msg;
    }

    ValidateInputStep1A() {

        this.error_msg = "";

        if (this.data_insured.type_document == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        if (this.data_insured.document_number == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.birthday_date == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.names == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.last_name == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.last_name2 == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        if (this.data_insured.civil_status.codigo == "0") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.nationality.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.phone == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        // if (this.data_insured.email == "") {
        //     this.error_msg += 'Se debe completar todos los campos para continuar<br>';
        //     return this.error_msg;
        // }
        if (this.esEmailValido(this.data_insured.email)) {
            console.log('El formato del correo es correcto.');
        } else {
            this.error_msg += 'El formato del correo es incorrecto.<br>';
            return this.error_msg;
        }


        if (this.data_insured.address == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.department.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.province.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }

        if (this.data_insured.district.codigo == "") {
            this.error_msg += 'Se debe completar todos los campos para continuar<br>';
            return this.error_msg;
        }
        if (this.data_insured.relation.codigo == "") {
            this.error_msg += 'Se debe completar parentesco del asegurado<br>';
            return this.error_msg;
        }

        return this.error_msg;
    }


    ValidateInputStep2() {
        let error_msg = "";

        if (this.value_pep == 0) {
            error_msg += 'Debe completar los datos del PEP. <br>';
        }

        if (this.value_properties == 0) {
            error_msg += 'Debe completar los datos de bienes e inmuebles. <br>';
        }

        if (this.value_relationship == 0) {
            error_msg += 'Debe completar los datos de relaciones de personas. <br>';
        }

        if (this.value_declaration == 0) {
            error_msg += 'Debe completar los datos de la declaración jurada. <br>';
        }

        return error_msg;
    }


    ValidateInputStep3() {

        let error_msg = "";
        if (((Number(this.origin_fund_saving_percent)+ Number(this.origin_fund_spp_percent)) == 100) || ((Number(this.origin_fund_saving_percent) + Number(this.origin_fund_spp_percent) == 100.00))) { }
        else { error_msg = 'Debe completar todas las preguntas.'; }

        if (this.check_input_value_beneficiary == 0) {

            // let sum_asing = this.list_benefeciarys.reduce((acc, current) => { return acc + parseFloat(current.percentage_participation).toFixed(2) });
            let sum_asing = this.list_benefeciarys.reduce((acc, current) => {
                let parse_percentage = parseFloat(current.percentage_participation);
                let a = parse_percentage.toFixed(2);
                let b = parseFloat(a);
                return acc + b;
            }, 0);

            console.log(sum_asing);

            if ((sum_asing == 100) || (sum_asing == 100.00)) { }
            else { error_msg = 'Debe completar toda la información.'; }
        }
        return error_msg;
    }

    ValidateInputStep4() {

        let error_msg = "";
        // if (this.perfilamiento.question1 && this.perfilamiento.question2 && this.perfilamiento.question3 && this.perfilamiento.question4 && this.perfilamiento.question5) {

        if ((this.perfilamiento.question1 == "") || (this.perfilamiento.question2 == "") || (this.perfilamiento.question3 == "") || (this.perfilamiento.question4 == "") || (this.perfilamiento.question5 == "")) {
            error_msg = 'Debe completar todas las preguntas.';
        }
        return error_msg;
    }



    validateInputs(nex_step) {
        let response = { cod_error: 0, message_error: "" }
        // nex_step == 1 Validandoprimer parte, ya sed Contratante o Asegurado
        if (nex_step == 2) {
            let response_error = this.ValidateInputStep1()
            if (response_error !== "") {
                response.cod_error = 1
                response.message_error = response_error;
                return response;
            }
            return response;

        }

        if (nex_step == 3) {
            let response_error = this.ValidateInputStep2()
            if (response_error !== "") {
                response.cod_error = 1
                response.message_error = response_error;
                return response;
            }
            return response;

        }


        if (nex_step == 4) {
            let response_error;
            if (response_error !== "") {
                response.cod_error = 1
                response.message_error = response_error;
                return response;
            }
            return response;
        }

        if (nex_step == 5) {
            let response_error = this.ValidateInputStep4()
            if (response_error !== "") {
                response.cod_error = 1
                response.message_error = response_error;
                return response;
            }
            return response;

        }
        return response;
    }

    previusStep(value) {
        if (value == 2) {

            /* VIGP - DGC - 12/02/2024 - INICIO */
            if (this.idecon_contractor.pep == 'SÍ' || this.idecon_contractor.famPep == 'SÍ' || this.world_check_contractor.pep == 'SÍ' || this.check_input_relationship == 1) {
                this.current_step = value;
            }
            else {
                this.current_step = 1;
            }
            /* VIGP - DGC - 12/02/2024 - FIN */
        }
        else {
            this.current_step = value;
        }
    }

    validateCheckInsured() {
        // console.log(typeof this.type_rol);

        if ((this.check_input_value == 3) || (this.check_input_value == 1)) {

            const customswal = Swal.mixin({
                confirmButtonColor: "553d81",
                focusConfirm: false,
            })

            customswal.fire('Información', "Para esta sección, debe indicar que el asegurado NO es la misma persona que contrata el seguro.", 'warning');
        }
    }

    OpenModalBeneficiary(type, item) {

    if (this.profile_id != '196' && this.profile_id != '203' ) {
        let modalRef: NgbModalRef;
        modalRef = this.modalService.open(AddBeneficiaryComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.list_benefeciary = this.list_benefeciarys;
        modalRef.componentInstance.reference.type = type;
        modalRef.componentInstance.reference.item = item;
        modalRef.componentInstance.reference.contratactor_doc = { type_doc: this.data_contractor.type_document, document_number: this.data_contractor.document_number };
        modalRef.componentInstance.reference.insured_doc = { type_doc: this.data_insured.type_document, document_number: this.data_insured.document_number };

        modalRef.result.then(
            (res) => {
                if (res) {
                    const new_item = {
                        ...res,
                        siddoc: res.document_number,
                        sfirstname: res.names,
                        slastname: res.last_name,
                        slastname2: res.slastname2,
                        srelation_name: res.relation.text,
                        percentage_participation: res.assignment,
                        type_doc: res.type_document.Id,
                        type_document: { desc_type_doc: res.type_document.Name },
                        desc_nationality: res.nationality.SDESCRIPT,
                        relation: { GLS_ELEMENTO: res.relation.SDESCRIPT, NCODIGO: res.relation.COD_ELEMENTO },
                        desc_type_doc: res.type_document.Id == 2 ? 'DNI' : "CE",
                    };

                    // AQUI SE DEBE COMPROBAR QUE EL TIPO Y NUMERO DE DOCUEMNTO SEA LOS MISMOS, SI SON LOS MISMO VA REEMPLAZAR LA DATA CON EL NUEVO ELEMENTO EDITADO, SI NO SE ENCUENTRA UNO IGUAL LO VA INSERTAR COMO NUEV
                    if (type == 'edit') {

                        const new_list_benefeciary = this.list_benefeciarys.map((element) => {

                            if ((element.type_doc == new_item.type_doc) && (element.siddoc == new_item.document_number)) { return new_item; }
                            else { return element; }
                        });
                        this.list_benefeciarys = new_list_benefeciary;
                    }
                    else {
                        this.list_benefeciarys.push(new_item);// Aqui se esta insertando
                    }

                    this.currentPage = 1;
                    this.totalItems = this.list_benefeciarys.length;
                    this.listToShow_benefeciarys = this.list_benefeciarys.slice(
                        (this.currentPage - 1) * this.itemsPerPage,
                        this.currentPage * this.itemsPerPage
                    );
                }
            }
        )
      }
    }


    openPepModal = () => {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddPepComponent, {
            size: 'xl',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.quotation_id = this.quotation_id;
        modalRef.componentInstance.reference.sclient = this.sclient;

        modalRef.result.then(
            res => {
                this.getDatosPep();
            }
        );
    }

    openPropertyModal = () => {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddPropertyComponent, {
            size: 'lg',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.quotation_id = this.quotation_id;
        modalRef.componentInstance.reference.sclient = this.sclient;

        modalRef.result.then(
            res => {
                this.SelDatosPEPVIGP();
            }
        );
    }

    openRelationsModal() {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddRelationComponent, {
            size: 'lg',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.quotation_id = this.quotation_id;
        modalRef.componentInstance.reference.sclient = this.sclient;

        modalRef.result.then(
            res => {
                this.SelDatosPEPVIGP();
            }
        );
    }

    openDeclarationModal() {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddDeclarationComponent, {
            size: 'lg',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.quotation_id = this.quotation_id;
        modalRef.componentInstance.reference.sclient = this.sclient;

        modalRef.result.then(
            res => {
                this.SelDatosPEPVIGP();
            }
        );
    }


    async OpenModalDetailOrigin(type = '') {

      if (this.profile_id != '196' && this.profile_id != '203' ) {
        let modalRef: NgbModalRef;

        if (type == "edit" && this.dissabled_btn_modal_detail_origin == false) { }

        else {
            modalRef = this.modalService.open(OriginDetailModalComponent, {
                size: 'xl',
                backdropClass: 'light-blue-backdrop',
                backdrop: 'static',
                keyboard: true,
            });
            modalRef.componentInstance.reference = modalRef;
            modalRef.componentInstance.reference.quotation_id = this.quotation_id;

            let response_origin_detail_modal = {
                P_NBUSINESS_DIVIDENS: null,
                P_NBUSINESS_INCOME: null,
                P_NCANCELED_BANK_CERTIFICATES: null,
                P_NCANCELLATION_TERM_DEPOSITS: null,
                P_NCOMPENSATION_SERVICE_TIME: null,
                P_NCUSPP: null,
                P_NGRATIFICATIONS: null,
                P_NID_COTIZACION: null,
                P_NINCOME_PERSONAL_FEES: null,
                P_NINHERITANCE: null,
                P_NLABOR_PROFITS: null,
                P_NLOAN: null,
                P_NOTHERS: null,
                P_NPRIVATE_PENSION_SYSTEM: null,
                P_NREMUNERATIONS: null,
                P_NSALES_ESTATES: null,
                P_NSALE_SECURITIES: null,
                P_NSAVING_FINANCIAL_INSTITUTION1: null,
                P_NSAVING_FINANCIAL_INSTITUTION2: null,
                P_NSAVING_FINANCIAL_INSTITUTION3: null,
                P_NSAVING_FINANCIAL_INSTITUTION4: null,
                P_SACCOUNT_NUMBER1: null,
                P_SACCOUNT_NUMBER2: null,
                P_SACCOUNT_NUMBER3: null,
                P_SACCOUNT_NUMBER4: null,
                cancel: "false",
                P_SCOMMENT: ''
            };

            await modalRef.result.then((res) => { response_origin_detail_modal = res });

            if ((!response_origin_detail_modal.cancel) || (response_origin_detail_modal.cancel != "true")) { this.showPercentage(response_origin_detail_modal); }

        }
      }
    }


    showPercentage(origin_detail) {

        // console.log(origin_detail.P_NPRIVATE_PENSION_SYSTEM); // Su valor por defecto  es 0
        // console.log(origin_detail.P_NCUSPP); // Su valor por defecto es Vacio ''

        // Cuando No existe NINGUNA INSTITUCION FINANCIERA Y EL SISTEMA PRIVADO DE PENSIONES TIENE VALOR.

        if ((!origin_detail?.P_NSAVING_FINANCIAL_INSTITUTION1 && !origin_detail?.P_NSAVING_FINANCIAL_INSTITUTION2 && !origin_detail?.P_NSAVING_FINANCIAL_INSTITUTION3 && !origin_detail?.P_NSAVING_FINANCIAL_INSTITUTION4) && (origin_detail?.P_NPRIVATE_PENSION_SYSTEM != "0" && origin_detail?.P_NCUSPP != "")) {
            this.origin_fund_saving_percent = 0;
            this.origin_fund_spp_percent = 100;
            this.dissabled_btn_modal_detail_origin = true;
        }

        // Si existe 1 o mas Ahorro financiero Y el Sistema privado de pensiones es Vacio.
        else if ((origin_detail.P_NSAVING_FINANCIAL_INSTITUTION1 || origin_detail.P_NSAVING_FINANCIAL_INSTITUTION2 || origin_detail.P_NSAVING_FINANCIAL_INSTITUTION3 || origin_detail.P_NSAVING_FINANCIAL_INSTITUTION4) && (origin_detail?.P_NPRIVATE_PENSION_SYSTEM == "0" && origin_detail?.P_NCUSPP == "")) {
            console.log("Alguno financiero tiene valor y Se tiene vacion el SPP");
            this.origin_fund_saving_percent = 100;
            this.origin_fund_spp_percent = 0;
            this.dissabled_btn_modal_detail_origin = true;
        }

        else {
            origin_detail.P_NBUSINESS_INCOME = origin_detail.P_NBUSINESS_INCOME ? origin_detail.P_NBUSINESS_INCOME == '' ? 0 : origin_detail.P_NBUSINESS_INCOME : 0;
            origin_detail.P_NREMUNERATIONS = origin_detail.P_NREMUNERATIONS ? origin_detail.P_NREMUNERATIONS == '' ? 0 : origin_detail.P_NREMUNERATIONS : 0;
            origin_detail.P_NGRATIFICATIONS = origin_detail.P_NGRATIFICATIONS ? origin_detail.P_NGRATIFICATIONS == '' ? 0 : origin_detail.P_NGRATIFICATIONS : 0;
            origin_detail.P_NBUSINESS_DIVIDENS = origin_detail.P_NBUSINESS_DIVIDENS ? origin_detail.P_NBUSINESS_DIVIDENS == '' ? 0 : origin_detail.P_NBUSINESS_DIVIDENS : 0;
            origin_detail.P_NSALE_SECURITIES = origin_detail.P_NSALE_SECURITIES ? origin_detail.P_NSALE_SECURITIES == '' ? 0 : origin_detail.P_NSALE_SECURITIES : 0;
            origin_detail.P_NCANCELED_BANK_CERTIFICATES = origin_detail.P_NCANCELED_BANK_CERTIFICATES ? origin_detail.P_NCANCELED_BANK_CERTIFICATES == '' ? 0 : origin_detail.P_NCANCELED_BANK_CERTIFICATES : 0;
            origin_detail.P_NLOAN = origin_detail.P_NLOAN ? origin_detail.P_NLOAN == '' ? 0 : origin_detail.P_NLOAN : 0;
            origin_detail.P_NINCOME_PERSONAL_FEES = origin_detail.P_NINCOME_PERSONAL_FEES ? origin_detail.P_NINCOME_PERSONAL_FEES == '' ? 0 : origin_detail.P_NINCOME_PERSONAL_FEES : 0;
            origin_detail.P_NCOMPENSATION_SERVICE_TIME = origin_detail.P_NCOMPENSATION_SERVICE_TIME ? origin_detail.P_NCOMPENSATION_SERVICE_TIME == '' ? 0 : origin_detail.P_NCOMPENSATION_SERVICE_TIME : 0;
            origin_detail.P_NLABOR_PROFITS = origin_detail.P_NLABOR_PROFITS ? origin_detail.P_NLABOR_PROFITS == '' ? 0 : origin_detail.P_NLABOR_PROFITS : 0;
            origin_detail.P_NSALES_ESTATES = origin_detail.P_NSALES_ESTATES ? origin_detail.P_NSALES_ESTATES == '' ? 0 : origin_detail.P_NSALES_ESTATES : 0;
            origin_detail.P_NINHERITANCE = origin_detail.P_NINHERITANCE ? origin_detail.P_NINHERITANCE == '' ? 0 : origin_detail.P_NINHERITANCE : 0;
            origin_detail.P_NCANCELLATION_TERM_DEPOSITS = origin_detail.P_NCANCELLATION_TERM_DEPOSITS ? origin_detail.P_NCANCELLATION_TERM_DEPOSITS == '' ? 0 : origin_detail.P_NCANCELLATION_TERM_DEPOSITS : 0;
            origin_detail.P_NOTHERS = origin_detail.P_NOTHERS ? origin_detail.P_NOTHERS == '' ? 0 : origin_detail.P_NOTHERS : 0;

            let sum_origin_detail = Number.parseFloat(origin_detail.P_NBUSINESS_INCOME) + Number.parseFloat(origin_detail.P_NREMUNERATIONS) + Number.parseFloat(origin_detail.P_NGRATIFICATIONS) + Number.parseFloat(origin_detail.P_NBUSINESS_DIVIDENS) + Number.parseFloat(origin_detail.P_NSALE_SECURITIES) + Number.parseFloat(origin_detail.P_NCANCELED_BANK_CERTIFICATES) + Number.parseFloat(origin_detail.P_NLOAN) + Number.parseFloat(origin_detail.P_NINCOME_PERSONAL_FEES) + Number.parseFloat(origin_detail.P_NCOMPENSATION_SERVICE_TIME) + Number.parseFloat(origin_detail.P_NLABOR_PROFITS) + Number.parseFloat(origin_detail.P_NSALES_ESTATES) + Number.parseFloat(origin_detail.P_NINHERITANCE) + Number.parseFloat(origin_detail.P_NCANCELLATION_TERM_DEPOSITS) + Number.parseFloat(origin_detail.P_NOTHERS)

            this.dissabled_btn_modal_detail_origin = true;

            // this.origin_fund_saving_percent = sum_origin_detail;
            // this.origin_fund_spp_percent = (100 - Number.parseFloat(this.origin_fund_saving_percent)).toFixed(2);

            this.origin_fund_saving_percent = (sum_origin_detail).toFixed(0);
            this.origin_fund_spp_percent = (100 - sum_origin_detail).toFixed(0);
        }
    };

    deleteDetailOrigin() {

    if (this.profile_id != '196' && this.profile_id != '203' ) {   
        if (this.dissabled_btn_modal_detail_origin == false) { }
        else {
            this.vidaInversionService.DeleteOriginDetail(this.quotation_id).toPromise().then(
                res => {
                    if (res.ErrorCode == 0) {

                        this.origin_fund_saving_percent = 0;
                        this.origin_fund_spp_percent = 0;
                        this.dissabled_btn_modal_detail_origin = false;

                        Swal.fire('Información', "Se eliminó la información correctamente.", 'success');
                    } else {
                        Swal.fire('Información', "Ocurrió un problema al realizar la solicitud.", 'error');
                    }
                },
                error => {
                    Swal.fire('Información', "Ocurrió un problema al realizar la solicitud.", 'error');
                }
            );
        }
     }
    }

    toUpper(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        inputElement.value = inputElement.value.toUpperCase();
    }

    readFile = () => {
        let obj = {
            P_NID_COTIZACION: this.quotation_id
        };
        this.vidaInversionService.ReadDocumentsVIGP(obj).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    if (this.NID_STATE == 12 || this.NID_STATE == 14) {
                        let temp = res.P_DOCUMENTS.filter(x => x.P_FLAG != 1);
                        let bool: boolean = false;
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i].P_FLAG == 7 && temp[i].P_STATUS == 1) {
                                bool = true;
                            }
                        }
                        if (bool) {
                            this.filesList = temp.filter(x => x.P_FLAG != 6);
                            this.firmaManuscrita = true;
                        } else {
                            this.filesList = temp.filter(x => x.P_FLAG != 7);
                            this.firmaManuscrita = false;
                        }
                    } else {
                        this.filesList = res.P_DOCUMENTS.filter(x => x.P_FLAG != 6 && x.P_FLAG != 7);
                        this.firmaManuscrita = false;
                    }
                }
            },
            error => {
                Swal.fire('Información', "Ha ocurrido un error al obtener los archivos.", 'error');
            }
        );
    }

    addFile = () => {
        let temp = this.filesList.filter(x => x.P_FLAG == 3 || x.P_FLAG == 4 || x.P_FLAG == 5)
        if (temp.length >= 5) {
            Swal.fire('Información', 'Solo puede agregar 5 documentos como máximo.', 'warning');
            return;
        }
        let item: any = {};
        item.P_DESCRI = "otros";
        item.P_NAME = "";
        item.P_FLAG = 5;
        item.P_TYPE = "";
        item.P_FILE_NAME = "";
        item.P_STATUS = 0;
        this.filesList.push(item);
    }

    deleteFile = (item, i) => {
        if (item.P_FLAG == 5) {
            let _temp = this.filesList.splice(i, 1);
            let temp = this.filesList.filter(x => x !== _temp);
            this.filesList = temp;
        } else {
            Swal.fire(
                {
                    title: '¿Está seguro de eliminar el archivo?',
                    text: 'Esta acción es irreversible.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    cancelButtonText: 'Cancelar',
                }
            ).then(
                (result) => {
                    if (result.value) {
                        let obj = {
                            P_NID_COTIZACION: this.quotation_id,
                            P_DESCRI: item.P_DESCRI,
                            P_NAME: item.P_NAME,
                            P_FLAG: item.P_FLAG
                        };
                        this.vidaInversionService.DeleteDocumentsVIGP(obj).subscribe(
                            res => {
                                if (res.P_NCODE == 0) {
                                    Swal.fire('Información', "Se eliminó el archivo correctamente.", 'success');
                                    this.readFile();
                                } else {
                                    Swal.fire('Información', res.P_MESSAGE, 'error');
                                }
                            },
                            error => {
                                Swal.fire('Información', "Ha ocurrido un error al eliminar el archivo.", 'error');
                            }
                        );
                    }
                    else if (result.dismiss === Swal.DismissReason.cancel) {
                        this.modalService.dismissAll();
                    }
                }
            )
        }
    }

    importFile = (event, item) => {
        if (item.P_NAME == null || item.P_NAME == "") {
            Swal.fire('Información', "Debe ingresar el nombre del documento.", 'warning');
        } else {
            if (event.target.files.length == 0) {
                return;
            }

            let file: File = event.target.files[0];
            let myFormData: FormData = new FormData();

            let obj = {
                P_NID_COTIZACION: this.quotation_id,
                P_DESCRI: item.P_DESCRI,
                P_NAME: item.P_NAME,
                P_FLAG: item.P_FLAG
            };

            myFormData.append('objeto', JSON.stringify(obj));
            myFormData.append('dataFile', file);

            this.vidaInversionService.SaveDocumentsVIGP(myFormData).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        Swal.fire('Información', "Se subió el archivo correctamente.", 'success');
                        this.readFile();
                    } else {
                        Swal.fire('Información', res.P_MESSAGE, 'error');
                    }
                },
                error => {
                    Swal.fire('Información', "Ha ocurrido un error al cargar el archivo.", 'error');
                }
            );
        }
    }

    exportFile = (item) => {
        let obj = item.P_FILE_NAME;
        this.vidaInversionService.DownloadDocumentsVIGP(obj).subscribe(
            res => {
                if (res.StatusCode == 1) {
                    Swal.fire('Información', this.listToString(res.ErrorMessageList), 'error');
                } else {
                    var newBlob = new Blob([res], { type: "application/pdf" });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(newBlob);
                        return;
                    }
                    const data = window.URL.createObjectURL(newBlob);

                    var link = document.createElement('a');
                    link.href = data;

                    link.download = obj.substring(obj.lastIndexOf("\\") + 1);
                    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

                    setTimeout(function () {
                        window.URL.revokeObjectURL(data);
                        link.remove();
                    }, 100);
                }
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error al descargar el archivo.", 'error');
            }
        );
    }

    visualizeFile = (item, content: any) => {
        let obj = item.P_FILE_NAME;
        this.vidaInversionService.DownloadDocumentsVIGP(obj).subscribe(
            res => {
                if (res.StatusCode == 1) {
                    Swal.fire('Información', this.listToString(res.ErrorMessageList), 'error');
                } else {
                    var newBlob = new Blob([res], { type: "application/pdf" });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(newBlob);
                        return;
                    }
                    this.pdfFile = window.URL.createObjectURL(newBlob);
                    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
                }
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error al visualizar el archivo.", 'error');
            }
        );
    }

    listToString = (list: String[]): string => {
        let output = "";
        if (list != null) {
            list.forEach(
                function (item) {
                    output = output + item + " <br>"
                }
            );
        }
        return output;
    }

    deleteBenefeciary(item_benefeciary) {
    
        if (this.profile_id != '196' && this.profile_id != '203' ) {


        let new_list_benefeciary = this.list_benefeciarys.filter((element) => element.siddoc != item_benefeciary.siddoc);
        this.list_benefeciarys = new_list_benefeciary;
        this.totalItems = this.list_benefeciarys.length;
        this.listToShow_benefeciarys = this.list_benefeciarys.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
        this.currentPage = this.listToShow_benefeciarys.length == 0 ? this.currentPage - 1 : this.currentPage;
        this.listToShow_benefeciarys = this.list_benefeciarys.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
     }
    }

    // SendSupervisor() {
    //     Swal.fire('Información', "Se derivó correctamente.", 'success').then(
    //         result => {
    //             this.router.navigate(['extranet/vida-inversion/consulta-cotizacion']);
    //         }
    //     )
    // }

    // oficializar = () => {
    //     this.router.navigate([`extranet/vida-inversion/oficializar-cotizacion/${this.quotation_id}/${this.sclient}/${this.prospect_id}`]);
    // }

    changeStyleCredit(input_name = "") {

        let format_amount = parseInt(this.quotation.contribution.replace(/,/g, ''));

        this.parse_amount = CommonMethods.formatNUMBER(format_amount);
        this.quotation.contribution = this.parse_amount;

        if (this.quotation.contribution.toUpperCase() == "NAN") {
            this.quotation.contribution = '';
        }
    }

    changeDocumentType(search_type: any) {
        if (search_type == 1) {
            this.data_contractor.document_number = "";
        } else {
            this.data_insured.document_number = "";
        }
    }

    search = (search_type: any) => {

        if (search_type == 1) {
            let errCode = 0;
            let errMsg = '';
            if (this.data_contractor.type_document.codigo == null || this.data_contractor.type_document.codigo == "") {
                errCode = 1;
                errMsg += 'Seleccione el tipo de documento del contratante. <br>';
            }
            if (this.data_contractor.document_number == null || this.data_contractor.document_number == "") {
                errCode = 1;
                errMsg += 'Ingrese el número de documento del contratante. <br>';
            }
            if (errCode == 1) {
                Swal.fire('Información', errMsg, 'warning');
                return;
            }
        }

        if (search_type == 2) {
            let errCode = 0;
            let errMsg = '';
            if (this.data_insured.type_document.codigo == null || this.data_insured.type_document.codigo == "") {
                errCode = 1;
                errMsg += 'Seleccione el tipo de documento del asegurado. <br>';
            }
            if (this.data_insured.document_number == null || this.data_insured.document_number == "") {
                errCode = 1;
                errMsg += 'Ingrese el número de documento del asegurado. <br>';
            }
            if (errCode == 1) {
                Swal.fire('Información', errMsg, 'warning');
                return;
            }
        }

        if (this.check_input_value == 0) {
            if (this.data_contractor.document_number && this.data_insured.document_number) {
                if (this.data_contractor.document_number == this.data_insured.document_number) {
                    if (search_type == 1) {
                        //this.data_contractor.document_number = null;
                        Swal.fire('Información', 'El documento ingresado se encuentra registrado como asegurado, cambiar la opción a SI en caso el contratante y asegurado sean el mismo.', 'warning');
                        return;
                    } else {
                        //this.data_insured.document_number = null;
                        Swal.fire('Información', 'El documento ingresado se encuentra registrado como contratante, cambiar la opción a SI en caso el contratante y asegurado sean el mismo.', 'warning');
                        return;
                    }
                }
            }
        }

        this.clickBuscar(search_type);
    }


    searchValidate(search_type) { // 1 Contratante 2 Asegurado

        const validate_res = { cod_error: "0", message: "" };

        if (search_type == 1) {

            if (this.data_contractor.type_document.Id == 2) {
                console.log(this.data_contractor.document_number.length);

                if (this.data_contractor.document_number.length == 7) {
                    console.log(this.data_contractor.document_number);
                    this.data_contractor.document_number = this.data_contractor.document_number.padStart(8, "0");
                    console.log(this.data_contractor.document_number);
                }

                if (!(this.data_contractor.document_number.length >= 7 && this.data_contractor.document_number.length <= 8)) {
                    validate_res.message = 'Cantidad de caracteres del DNI incorrecto.';
                    validate_res.cod_error = "1";
                }

            }

            if (this.data_contractor.type_document.Id == 4) {
                if (!(this.data_contractor.document_number.length >= 8 && this.data_contractor.document_number.length <= 12)) {
                    validate_res.message = 'Cantidad de caracteres del CE incorrecto.';
                    validate_res.cod_error = "1";
                }
            }


        }
        else if (search_type == 2) {

            if (this.data_insured.type_document.Id == 2) {

                if (this.data_insured.document_number.length == 7) {
                    this.data_insured.document_number = this.data_insured.document_number.padStart(8, "0");
                }

                if (!(this.data_insured.document_number.length >= 7 && this.data_insured.document_number.length <= 8)) {
                    validate_res.message = 'Cantidad de caracteres del DNI incorrecto.';
                    validate_res.cod_error = "1";
                }
            }

            if (this.data_insured.type_document.Id == 4) {
                if (!(this.data_insured.document_number.length >= 8 && this.data_insured.document_number.length <= 12)) {
                    validate_res.message = 'Cantidad de caracteres del CE incorrecto.';
                    validate_res.cod_error = "1";
                }
            }
        }
        return validate_res;
    }

    async getIdecon(client_type: number) {
        let datosIdecom = {};

        let consultIdecom = {
            P_SCLIENT: null,
            P_NOTHERLIST: 0,
            P_NISPEP: 0,
            P_NISFAMPEP: 0,
            P_NNUMBERFAMPEP: 0,
            P_SUPDCLIENT: '0'
        };

        let sclientIdecom = { P_SCLIENT: this.data_contractor.sclient }

        if (client_type == 1) {
            datosIdecom = {
                name: this.data_contractor.names + ' ' + this.data_contractor.last_name + ' ' + this.data_contractor.last_name2,
                idDocNumber: this.data_contractor.document_number,
                percentage: 100,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaIdecom(sclientIdecom).toPromise().then(
                async (res) => {
                    consultIdecom = {
                        P_SCLIENT: res.P_SCLIENT,
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_NISFAMPEP: res.P_NISFAMPEP,
                        P_NNUMBERFAMPEP: res.P_NNUMBERFAMPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }

                    if (consultIdecom.P_SCLIENT == null || consultIdecom.P_SCLIENT == "") {
                        await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                            async (res) => {
                                consultIdecom = {
                                    P_SCLIENT: this.data_contractor.sclient,
                                    P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                    P_NISPEP: res.isPep ? 1 : 0,
                                    P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                    P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                    P_SUPDCLIENT: '0'
                                }

                                this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                await this.vidaInversionService.InsUpdIdecom(consultIdecom).toPromise().then();
                            }
                        );
                    } else {
                        if (consultIdecom.P_SUPDCLIENT == "1") {
                            await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                                async (res) => {
                                    consultIdecom = {
                                        P_SCLIENT: this.data_contractor.sclient,
                                        P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                        P_NISPEP: res.isPep ? 1 : 0,
                                        P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                        P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                        P_SUPDCLIENT: '1'
                                    }

                                    this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                    this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                    this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                    await this.vidaInversionService.InsUpdIdecom(consultIdecom).toPromise().then();
                                }
                            );
                        } else {
                            this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                        }
                    }
                }
            );
        } else {
            datosIdecom = {
                name: this.data_insured.names + ' ' + this.data_insured.last_name + ' ' + this.data_insured.last_name2,
                idDocNumber: this.data_insured.document_number,
                percentage: 100,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaIdecom(sclientIdecom).toPromise().then(
                async (res) => {
                    consultIdecom = {
                        P_SCLIENT: res.P_SCLIENT,
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_NISFAMPEP: res.P_NISFAMPEP,
                        P_NNUMBERFAMPEP: res.P_NNUMBERFAMPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }

                    if (consultIdecom.P_SCLIENT == null || consultIdecom.P_SCLIENT == "") {
                        await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                            async (res) => {
                                consultIdecom = {
                                    P_SCLIENT: this.data_insured.sclient,
                                    P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                    P_NISPEP: res.isPep ? 1 : 0,
                                    P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                    P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                    P_SUPDCLIENT: '0'
                                }

                                this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                await this.vidaInversionService.InsUpdIdecom(consultIdecom).toPromise().then();
                                this.isLoading = false;
                            }
                        );
                    } else {
                        if (consultIdecom.P_SUPDCLIENT == "1") {
                            await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                                async (res) => {
                                    consultIdecom = {
                                        P_SCLIENT: this.data_insured.sclient,
                                        P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                        P_NISPEP: res.isPep ? 1 : 0,
                                        P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                        P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                        P_SUPDCLIENT: '1'
                                    }

                                    this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                    this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                    this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                    await this.vidaInversionService.InsUpdIdecom(consultIdecom).toPromise().then();
                                }
                            );
                        } else {
                            this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                            this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                        }
                    }
                }
            );
        }
    }

    // async getWorldCheck(client_type: number) {
    //     let datosWorldCheck = {};

    //     let consultWorldCheck = {
    //         P_SCLIENT: null,
    //         P_NOTHERLIST: 0,
    //         P_NISPEP: 0,
    //         P_SUPDCLIENT: '0'
    //     };

    //     let sclientWorldCheck = { P_SCLIENT: this.data_contractor.sclient }

    //     if (client_type == 1) {
    //         datosWorldCheck = {
    //             name: this.data_contractor.names + ' ' + this.data_contractor.last_name + ' ' + this.data_contractor.last_name2,
    //             idDocNumber: this.data_contractor.document_number,
    //             typeDocument: ""
    //         }

    //         await this.vidaInversionService.ConsultaWorldCheck(sclientWorldCheck).toPromise().then(
    //             async (res) => {
    //                 consultWorldCheck = {
    //                     P_SCLIENT: res.P_SCLIENT,
    //                     P_NOTHERLIST: res.P_NOTHERLIST,
    //                     P_NISPEP: res.P_NISPEP,
    //                     P_SUPDCLIENT: res.P_SUPDCLIENT
    //                 }

    //                 if (consultWorldCheck.P_SCLIENT == null || consultWorldCheck.P_SCLIENT == "") {
    //                     await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
    //                         async (res) => {
    //                             consultWorldCheck = {
    //                                 P_SCLIENT: this.data_contractor.sclient,
    //                                 P_NOTHERLIST: res.isOtherList ? 1 : 0,
    //                                 P_NISPEP: res.isPep ? 1 : 0,
    //                                 P_SUPDCLIENT: '0'
    //                             }

    //                             this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                             this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

    //                             await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
    //                         }
    //                     );
    //                 } else {
    //                     if (consultWorldCheck.P_SUPDCLIENT == "1") {
    //                         await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
    //                             async (res) => {
    //                                 consultWorldCheck = {
    //                                     P_SCLIENT: this.data_contractor.sclient,
    //                                     P_NOTHERLIST: res.isOtherList ? 1 : 0,
    //                                     P_NISPEP: res.isPep ? 1 : 0,
    //                                     P_SUPDCLIENT: '1'
    //                                 }

    //                                 this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                                 this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

    //                                 await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
    //                             }
    //                         );
    //                     } else {
    //                         this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                         this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';
    //                     }
    //                 }
    //             }
    //         );
    //     } else {
    //         datosWorldCheck = {
    //             name: this.data_insured.names + ' ' + this.data_insured.last_name + ' ' + this.data_insured.last_name2,
    //             idDocNumber: this.data_insured.document_number,
    //             typeDocument: ""
    //         }

    //         await this.vidaInversionService.ConsultaWorldCheck(sclientWorldCheck).toPromise().then(
    //             async (res) => {
    //                 consultWorldCheck = {
    //                     P_SCLIENT: res.P_SCLIENT,
    //                     P_NOTHERLIST: res.P_NOTHERLIST,
    //                     P_NISPEP: res.P_NISPEP,
    //                     P_SUPDCLIENT: res.P_SUPDCLIENT
    //                 }

    //                 if (consultWorldCheck.P_SCLIENT == null || consultWorldCheck.P_SCLIENT == "") {
    //                     await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
    //                         async (res) => {
    //                             consultWorldCheck = {
    //                                 P_SCLIENT: this.data_insured.sclient,
    //                                 P_NOTHERLIST: res.isOtherList ? 1 : 0,
    //                                 P_NISPEP: res.isPep ? 1 : 0,
    //                                 P_SUPDCLIENT: '0'
    //                             }

    //                             this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                             this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

    //                             await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
    //                             this.isLoading = false;
    //                         }
    //                     );
    //                 } else {
    //                     if (consultWorldCheck.P_SUPDCLIENT == "1") {
    //                         await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
    //                             async (res) => {
    //                                 consultWorldCheck = {
    //                                     P_SCLIENT: this.data_insured.sclient,
    //                                     P_NOTHERLIST: res.isOtherList ? 1 : 0,
    //                                     P_NISPEP: res.isPep ? 1 : 0,
    //                                     P_SUPDCLIENT: '1'
    //                                 }

    //                                 this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                                 this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

    //                                 await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
    //                             }
    //                         );
    //                     } else {
    //                         this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
    //                         this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';
    //                     }
    //                 }
    //             }
    //         );
    //     }
    // }

    async invokeServiceExperia(client_type: number) {
        let datosServiceExperia = {};
        if (client_type == 1) {
            datosServiceExperia = {
                tipoid: (this.data_contractor.type_document || {}).Id == '1' ? '2' : '1',
                id: this.data_contractor.document_number,
                papellido: this.data_contractor.last_name,
                sclient: this.data_contractor.sclient,
                usercode: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
        } else {
            datosServiceExperia = {
                tipoid: (this.data_insured.type_document || {}).Id == '1' ? '2' : '1',
                id: this.data_insured.document_number,
                papellido: this.data_insured.last_name,
                sclient: this.data_insured.sclient,
                usercode: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
        }
        await this.vidaInversionService.invokeServiceExperia(datosServiceExperia).toPromise().then(
            async res => {
                if (client_type == 1) {
                    this.experian_contractor.riskClient = res.nflag == 0 ? 'SÍ' : 'NO';
                } else {
                    this.experian_insured.riskClient = res.nflag == 0 ? 'SÍ' : 'NO';
                }
            }
        );
    }

    async setDepartmentContractor(id: any) {
        await this.addressService.getDepartmentList().toPromise().then(res => {
            this.list_data_contractor_department = res;
            this.data_contractor.department = { Id: id };
        })
    }

    async setProvinceContractor(department_id, province_id) {
        await this.addressService.getProvinceList(department_id).toPromise().then(async res => {
            this.list_data_contractor_province = res;
            this.data_contractor.province = { Id: province_id };
        })
    }

    async setDistrictContractor(province_id, municipality_id) {
        await this.addressService.getDistrictList(province_id).toPromise().then(async res => {
            this.list_data_contractor_district = res;
            this.data_contractor.district = { Id: parseInt(municipality_id) };
        })
    }


    async setDepartmentInsured(id: any) {
        await this.addressService.getDepartmentList().toPromise().then(res => {
            this.list_data_insured_department = res;
            this.data_insured.department = { Id: id }
        })
    }

    async setProvinceInsured(department_id, province_id) {

        await this.addressService.getProvinceList(department_id).toPromise().then(async res => {
            this.list_data_insured_province = res;
            this.data_insured.province = { Id: province_id };
        })
    }

    async setDistrictInsured(province_id, municipality_id) {

        await this.addressService.getDistrictList(province_id).toPromise().then(async res => {
            this.list_data_insured_district = res;
            this.data_insured.district = { Id: parseInt(municipality_id) }
        })
    }


    async cargarDatosInsured(res: any, search_type: any) {

        const contracting_data = res.EListClient[0];

        this.data_insured.names = contracting_data.P_SFIRSTNAME;
        this.data_insured.last_name = contracting_data.P_SLASTNAME;
        this.data_insured.last_name2 = contracting_data.P_SLASTNAME2;
        this.data_insured.sclient = contracting_data.P_SCLIENT;



        // let split_date = contracting_data.P_DBIRTHDAT.split('/');
        // let format_birthday = `${split_date[1]}/${split_date[0]}/${split_date[2]}`;
        if (contracting_data.P_DBIRTHDAT == null) {
            console.log("Fecha Nula");
        } else {
            let split_date = contracting_data.P_DBIRTHDAT.split('/');
            this.data_insured.birthday_date = new Date(split_date[1] + '/' + split_date[0] + '/' + split_date[2]); //FECHA
        }
        this.data_insured.gender = { SSEXCLIEN: contracting_data.P_SSEXCLIEN };
        this.data_insured.civil_status = { NCIVILSTA: contracting_data.P_NCIVILSTA };

        this.data_insured.nationality = { NNATIONALITY: contracting_data.P_NNATIONALITY };


        if (contracting_data.EListEmailClient.length >= 1) {
            this.data_insured.email = contracting_data.EListEmailClient[0].P_SE_MAIL;
        }


        if (contracting_data.EListAddresClient.length >= 1) {
            this.data_insured.address = contracting_data.EListAddresClient[0].P_SDESDIREBUSQ;
            this.data_insured.department = { Id: parseInt(contracting_data.EListAddresClient[0].P_NPROVINCE) }

            await this.setDepartmentInsured(parseInt(contracting_data.EListAddresClient[0].P_NPROVINCE));

            await this.setProvinceInsured(parseInt(this.data_insured.department.Id), parseInt(contracting_data.EListAddresClient[0].P_NLOCAL));

            await this.setDistrictInsured(parseInt(this.data_insured.province.Id), parseInt(contracting_data.EListAddresClient[0].P_NMUNICIPALITY));

        } else {
            await this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_insured_department = res;
                this.data_insured.department = { Id: null }
                this.list_data_insured_province = [];
                this.data_insured.province = { Id: null }
                this.list_data_insured_district = [];
                this.data_insured.district = { Id: null }
            });
        }

        if (contracting_data.EListPhoneClient.length >= 1) {
            this.data_insured.phone = contracting_data.EListPhoneClient[0].P_SPHONE;
        }
    }

    async ConsultDataComplementary(search_type) {
        let params_cons = {
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number
        };
        await this.vidaInversionService.ConsultDataComplementary(params_cons).toPromise().then(
            async res => {
                this.check_input_nationality = res.P_NNATUSA;
                this.check_input_relationship = res.P_NCONPARGC;
                this.check_input_fiscal_obligations = res.P_NOFISTRI;
                this.data_complementary.occupation_status = { Id: res.P_NOCCUPATION }

                this.nregister_nnatusa = res.P_NNATUSA;
                this.nregister_nconpargc = res.P_NCONPARGC;
                this.nregister_nofistri = res.P_NOFISTRI;
                this.nregister_noccupation = res.P_NOCCUPATION

            })
    };

    async consultProspect(search_type) {
        let params_cons = {
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_NTYPE_CLIENT: search_type
        };
        await this.vidaInversionService.consultProspect(params_cons).toPromise().then(
            async res => {
                this.check_input_value = res.P_NID_ASCON;
                this.check_input_value_360 = res.P_NID_ASCON;
                if (this.check_input_value == 0) {
                    this.data_insured.type_document = { Id: res.P_NTYPE_DOCUMENT };
                    this.data_insured.document_number = res.P_SNUMBER_DOCUMENT_INSURED.trim();
                    if (res.P_SRELATION == null) { // PARENTESCO
                        this.data_insured.relation = { COD_ELEMENTO: 0 };
                    } else {
                        this.data_insured.relation = { COD_ELEMENTO: parseInt(res.P_SRELATION) };
                    }
                    this.nregister_parentesco = this.data_insured.relation;


                    // Asegurado
                    const params_360 = {
                        P_TipOper: 'CON',
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_NIDDOC_TYPE: this.data_insured.type_document.Id,
                        P_SIDDOC: this.data_insured.document_number,
                    };

                    await this.clientInformationService.getCliente360(params_360).toPromise().then(
                        async res => {
                            if (res.P_NCODE === "0") {
                                if (res.EListClient[0].P_SCLIENT == null) {
                                    // No se tiene registro el SCLIENT indicado
                                } else {
                                    // 2 Insured
                                    if (res.EListClient.length === 1) {
                                        await this.cargarDatosInsured(res, search_type);
                                        this.invokeServiceExperia(2);
                                        // this.getWorldCheck(2);
                                        this.getIdecon(2);
                                        this.data_insured_360 = { ...this.data_insured }; // Almacenando la Info de Inicio del 360 para el Asegurado en una Variable para validar si se tiene que actualizar data de la persona.
                                    }
                                }
                            }
                        }, error => {
                            this.isLoading = false;
                            Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
                        }
                    )
                }
            })
    }

    async clickBuscar(search_type) {
        const res = this.searchValidate(search_type);

        if (res.cod_error == "1") {
            Swal.fire('Información', res.message, 'error');
        }

        else {

            this.isLoading = true;

            let params_360;
            if (search_type == 1) {
                params_360 = {
                    P_TipOper: 'CON',
                    P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                    P_NIDDOC_TYPE: this.data_contractor.type_document.Id,
                    P_SIDDOC: this.data_contractor.document_number,
                };
            } else { // Asegurado
                params_360 = {
                    P_TipOper: 'CON',
                    P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                    P_NIDDOC_TYPE: this.data_insured.type_document.Id,
                    P_SIDDOC: this.data_insured.document_number,
                };
            }

            await this.clientInformationService.getCliente360(params_360).toPromise().then(
                async res => {
                    if (res.P_NCODE === "0") {
                        if (res.EListClient[0].P_SCLIENT == null) {
                            // No se tiene registro el SCLIENT indicado
                        } else {

                            if (res.EListClient.length === 1) {
                                //if (res.EListClient[0].P_SIDDOC != null) {
                                if (search_type == 1) {
                                    this.clearData(search_type);
                                    await this.cargarDatosContractor(res, search_type);
                                    await this.consultProspect(search_type);
                                    await this.ConsultDataComplementary(search_type);
                                    this.invokeServiceExperia(1);
                                    // this.getWorldCheck(1);
                                    this.getIdecon(1);
                                }
                                else { // 2 Insured
                                    this.clearData(search_type);
                                    await this.cargarDatosInsured(res, search_type);
                                    this.invokeServiceExperia(2);
                                    // this.getWorldCheck(2);
                                    this.getIdecon(2);
                                }
                                this.isLoading = false;
                                //}
                            }
                        }

                    }

                    else if (res.P_NCODE === "3") { // Se debe habilitar los campos para poder ingresar la Data y Crear el prospecto
                        this.isLoading = false;
                        Swal.fire('Información', 'No se encontró información, ingresar manualmente los datos.', 'error');

                        if (search_type == 2) {
                            this.enableInputs(search_type);// Solo para el Asegurado
                        }
                    }
                    else {
                        this.clearData(search_type);
                        this.isLoading = false;
                        Swal.fire('Información', res.P_SMESSAGE, 'error');
                    }

                }, error => {
                    this.isLoading = false;
                    Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
                }
            )
        }
    }


    async cargarDatosContractor(res: any, search_type: any) {

        const contracting_data = res.EListClient[0];

        let split_date = contracting_data.P_DBIRTHDAT.split('/');
        this.data_contractor.birthday_date = new Date(split_date[1] + '/' + split_date[0] + '/' + split_date[2]); //FECHA
        this.data_contractor.names = contracting_data.P_SFIRSTNAME;
        this.data_contractor.last_name = contracting_data.P_SLASTNAME;
        this.data_contractor.last_name2 = contracting_data.P_SLASTNAME2;
        this.data_contractor.sclient = contracting_data.P_SCLIENT;

        this.data_contractor.gender = { SSEXCLIEN: contracting_data.P_SSEXCLIEN };
        this.data_contractor.civil_status = { NCIVILSTA: contracting_data.P_NCIVILSTA };

        this.data_contractor.nationality = { NNATIONALITY: contracting_data.P_NNATIONALITY };


        if (contracting_data.EListEmailClient.length >= 1) {
            this.data_contractor.email = contracting_data.EListEmailClient[0].P_SE_MAIL;
        }

        if (contracting_data.EListAddresClient.length >= 1) {
            this.data_contractor.address = contracting_data.EListAddresClient[0].P_SDESDIREBUSQ;
            this.data_contractor.department = { Id: parseInt(contracting_data.EListAddresClient[0].P_NPROVINCE) }

            await this.setDepartmentContractor(parseInt(contracting_data.EListAddresClient[0].P_NPROVINCE));

            await this.setProvinceContractor(parseInt(this.data_contractor.department.Id), parseInt(contracting_data.EListAddresClient[0].P_NLOCAL));

            await this.setDistrictContractor(parseInt(this.data_contractor.province.Id), parseInt(contracting_data.EListAddresClient[0].P_NMUNICIPALITY));
        } else {
            await this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_contractor_department = res;
                this.data_contractor.department = { Id: null }
                this.list_data_contractor_province = [];
                this.data_contractor.province = { Id: null }
                this.list_data_contractor_district = [];
                this.data_contractor.district = { Id: null }
            });
        }


        if (contracting_data.EListPhoneClient.length >= 1) {
            this.data_contractor.phone = contracting_data.EListPhoneClient[0].P_SPHONE;
        }


    }

    clearData(type: any) {

        if (type == 1) {// Contratante
            // this.data_contractor.docuemnt_number = "";
            this.data_contractor.birthday_date = "";
            this.data_contractor.names = "";
            this.data_contractor.last_name = "";
            this.data_contractor.last_name2 = "";
            this.data_contractor.gender = "";
            this.data_contractor.civil_status = "";
            this.data_contractor.nationality = "";
            this.data_contractor.phone = "";
            this.data_contractor.email = "";
            this.data_contractor.address = "";
            this.data_contractor.department = { Id: null };
            this.data_contractor.province = { Id: null };
            this.data_contractor.district = { Id: null };

            this.data_contractor.type_document_disabled = false;
            this.data_contractor.document_number_disabled = false;
            this.data_contractor.birthday_date_disabled = true;
            this.data_contractor.names_disabled = true;
            this.data_contractor.last_name_disabled = true;
            this.data_contractor.last_name2_disabled = true;
            this.data_contractor.gender_disabled = true;
            this.data_contractor.civil_status_disabled = false;
            this.data_contractor.nationality_disabled = false;
            this.data_contractor.department_disabled = false;
            this.data_contractor.province_disabled = false;
            this.data_contractor.district_disabled = false;
            this.data_contractor.phone_disabled = false;
            this.data_contractor.email_disabled = false;
            this.data_contractor.address_disabled = false;

            this.contractor_province_department = false;
            this.contractor_province_selected = false;
            this.list_data_contractor_province = [];
            this.list_data_contractor_district = [];
        } else if (type == 2) { // Asegurado
            // this.data_insured.docuemnt_number = "";
            this.data_insured.birthday_date = "";
            this.data_insured.names = "";
            this.data_insured.last_name = "";
            this.data_insured.last_name2 = "";
            this.data_insured.gender = "";
            this.data_insured.civil_status = "";
            this.data_insured.nationality = "";
            this.data_insured.phone = "";
            this.data_insured.email = "";
            this.data_insured.address = "";
            this.data_insured.province = { Id: null };
            this.data_insured.district = { Id: null };
            this.data_insured.department = { Id: null };
            this.data_insured.relation = { COD_ELEMENTO: 0 };

            this.data_insured.type_document_disabled = false;
            this.data_insured.document_number_disabled = false;
            this.data_insured.birthday_date_disabled = true;
            this.data_insured.names_disabled = true;
            this.data_insured.last_name_disabled = true;
            this.data_insured.last_name2_disabled = true;
            this.data_insured.gender_disabled = true;
            this.data_insured.civil_status_disabled = false;
            this.data_insured.nationality_disabled = false;
            this.data_insured.department_disabled = false;
            this.data_insured.province_disabled = false;
            this.data_insured.district_disabled = false;
            this.data_insured.phone_disabled = false;
            this.data_insured.email_disabled = false;
            this.data_insured.address_disabled = false;

            this.insured_province_department = false;
            this.insured_province_selected = false;
            this.list_data_insured_province = [];
            this.list_data_insured_district = [];
            this.list_data_insured_department = [];
            this.data_insured.relation = [];
        }
    }

    changeStep(next_step) {
       
        if (this.profile_id == '196' || this.profile_id == '203' ) {
            this.dissabled_btn_modal_add_benef = true; 
            this.quotation.date_fund_disabled = true;
            this.check_input_value_beneficiary_disabled = true;
            this.dissabled_btn_modal_detail_origin = true;
            this.actions = true;
        }

        if (next_step == 2 && this.profile_id != 203 && this.profile_id != 196) {
            this.ValidateInputStep1();
            if (this.error_msg.toString().trim() != '') {
                Swal.fire('Información Contratante', this.error_msg, 'error');
                return;
            }
            if (this.check_input_value == 0) {
                this.ValidateInputStep1A();
                if (this.error_msg.toString().trim() != '') {
                    Swal.fire('Información Asegurado', this.error_msg, 'error');
                    return;
                }
            }
            //cliente360
            this.nregister_contractor = 0;
            this.nregister_insured = 0;
            const client_update = this.validateForUpdateClient();
            if (client_update == true || this.check_input_value != this.check_input_value_360) {
                console.log('actualizando')
                this.updateDataClient360();
            }
            // if (this.check_input_value == 0) {
            //     const insured_update = this.validateForUpdateInsured();
            //     if (insured_update == true) {
            //         this.updateDataClient360();
            //     }
            // }
            //validacion datos complementarios
            //datos complementarios
            if (this.check_input_nationality != this.nregister_nnatusa) { this.nregister_contractor = 1; };
            if (this.check_input_relationship != this.nregister_nconpargc) { this.nregister_contractor = 1; };
            if (this.check_input_fiscal_obligations != this.nregister_nofistri) { this.nregister_contractor = 1; };
            if (this.data_complementary.occupation_status != this.nregister_noccupation) { this.nregister_contractor = 1; };

            //actualizacion de datos complementarios
            if (this.nregister_contractor == 1) {
                this.data_quotation_complementary.P_NID_PROSPECT = parseInt(this.prospect_id);
                this.data_quotation_complementary.P_NOCCUPATION = this.data_complementary.occupation_status.Id;
                this.data_quotation_complementary.P_NNATUSA = this.check_input_nationality;
                this.data_quotation_complementary.P_NCONPARGC = this.check_input_relationship;
                this.data_quotation_complementary.P_NOFISTRI = this.check_input_fiscal_obligations;
                this.data_quotation_complementary.P_USER = JSON.parse(localStorage.getItem('currentUser'))['id'],
                    this.vidaInversionService.UpdDataComplementaryVIGP(this.data_quotation_complementary).toPromise().then(res => {
                        if (res.P_NCODE == 1) {
                            Swal.fire('Información', 'Ha ocurrido un error al actualizar el archivo.', 'error');
                            return;
                        } else {
                            console.log('Se actualizó el registro correctamente.');
                            // Swal.fire('Información', 'Se actualizó el registro correctamente.', 'error');
                        }
                    });
            }

            if (this.check_input_value == 0) {
                // this.current_step = next_step;

                /* VIGP - DGC - 12/02/2024 - INICIO */
                if (this.idecon_contractor.pep == 'SÍ' || this.idecon_contractor.famPep == 'SÍ' || this.world_check_contractor.pep == 'SÍ' || this.check_input_relationship == 1) {
                    this.current_step = next_step;
                }
                else {
                    this.current_step = 3;
                }
                /* VIGP - DGC - 12/02/2024 - FIN */
            }
            else if (this.check_input_value == 1) {
                Swal.fire({
                    title: 'Confirmación',
                    text: '¿Esta seguro que el contratante es igual al asegurado?',
                    icon: 'warning',
                    confirmButtonText: 'SI',
                    cancelButtonText: 'NO',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(
                    result => {
                        if (result.isConfirmed) { //AFIRMA QUE EL CONTRATANTE ES IGUAL QUE EL ASEUGRADO POR ENDER LLAMAR SOLO PARA CONTRATANTE
                            // this.current_step = next_step;

                            /* VIGP - DGC - 12/02/2024 - INICIO */
                            if (this.idecon_contractor.pep == 'SÍ' || this.idecon_contractor.famPep == 'SÍ' || this.world_check_contractor.pep == 'SÍ' || this.check_input_relationship == 1) {
                                this.current_step = next_step;
                            }
                            else {
                                this.current_step = 3;
                            }
                            /* VIGP - DGC - 12/02/2024 - FIN */
                        }
                        else {
                            this.check_input_value = 0;
                            this.show_guide = true;
                            setTimeout(() => {
                                this.show_guide = false;
                            }, 5000);
                        }
                    }
                )
            }
        }

        else if (next_step == 4) {

            const msg_validate = this.ValidateInputStep3();
            if (msg_validate.toString().trim() != "") {
                Swal.fire('Información', msg_validate, 'error');
                return;
            }

            const myFormData: FormData = new FormData();

            const params = {
                CodigoProceso: this.quotation.nid_proc,
                P_NTYPE_PROFILE: this.CONSTANTS.COD_PRODUCTO,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                NumeroCotizacion: this.quotation_id,
                List_beneficiary: []
            };

            if (this.check_input_value_beneficiary == 0) {
                if (this.list_benefeciarys.length > 0) {

                    console.log(this.list_benefeciarys);

                    for (let i = 0; i < this.list_benefeciarys.length; i++) {

                        let format_birthday_beneficiary = "null";
                        if (typeof this.list_benefeciarys[i].birthday_date == "object") {
                            format_birthday_beneficiary = this.list_benefeciarys[i].birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.list_benefeciarys[i].birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.list_benefeciarys[i].birthday_date.getFullYear();
                        }
                        // else if (typeof this.list_benefeciarys[i].birthday_date == "string"){
                        //     format_birthday_beneficiary="";
                        // }

                        console.log(format_birthday_beneficiary);

                        let item = {
                            nid_cotizacion: this.quotation_id,
                            nid_proc: this.quotation.nid_proc,
                            niiddoc_type: this.list_benefeciarys[i].type_document.desc_type_doc,
                            niddoc_type_beneficiary: this.list_benefeciarys[i].type_document.desc_type_doc,
                            siddoc: this.list_benefeciarys[i].siddoc,
                            siddoc_beneficiary: this.list_benefeciarys[i].siddoc,
                            sfirstname: this.list_benefeciarys[i].sfirstname.toUpperCase(),
                            slastname: this.list_benefeciarys[i].slastname.toUpperCase(),
                            slastname2: this.list_benefeciarys[i].last_name2.toUpperCase(),
                            nnationality: this.list_benefeciarys[i].desc_nationality,
                            percen_participation: this.list_benefeciarys[i].percentage_participation,
                            dbirthdat: format_birthday_beneficiary == "null" ? this.list_benefeciarys[i].birthday_date : format_birthday_beneficiary,
                            nusercode: JSON.parse(localStorage.getItem('currentUser'))['id'],
                            srole: 'Beneficiario',
                            // scivilsta: this.list_benefeciarys[i].scivilsta, //No esta en el formulario,
                            se_mail: this.list_benefeciarys[i].email.toUpperCase(),
                            sphone_type: "Celular",
                            sphone: this.list_benefeciarys[i].phone,
                            // srelation: this.list_benefeciarys[i].relation?.srelation_name,
                            srelation: this.list_benefeciarys[i].srelation_name,
                            ssexclien: this.list_benefeciarys[i].gender.id,
                        }
                        params.List_beneficiary.push(item);
                    }
                } else {
                    params.List_beneficiary = [];
                }

            }

            myFormData.append('objeto', JSON.stringify(params));

            console.log(params);

            this.vidaInversionService.CleanBeneficiar(myFormData).toPromise().then((res) => {
                console.log(res);
                if (res.codError == 1) {
                    Swal.fire('Información', res.desError, 'error');
                } else {
                    this.current_step = next_step;
                }
            });
        }

        else if (next_step == 5 && this.profile_id != 203 && this.profile_id != 196) {

            let res = this.ValidateInputStep4(); // TODo => aGREGAR LA VALIDACION ACA QUE TODAS LAS PREGUNTAS ESTEN COMPLETAS
            if (res.toString().trim() != "") {
                Swal.fire('Información', res, 'error');
                return;
            }
            else {
                const myFormData: FormData = new FormData();
                const response_items = [
                    {
                        P_NQUESTION: 1,
                        P_SANSWER: this.perfilamiento.question1
                    },
                    {
                        P_NQUESTION: 2,
                        P_SANSWER: this.perfilamiento.question2
                    },
                    {
                        P_NQUESTION: 3,
                        P_SANSWER: this.perfilamiento.question3
                    },
                    {
                        P_NQUESTION: 4,
                        P_SANSWER: this.perfilamiento.question4
                    },
                    {
                        P_NQUESTION: 5,
                        P_SANSWER: this.perfilamiento.question5
                    }
                ];


                const search_scoring = {
                    P_NID_COTIZACION: this.quotation_id,
                    P_NBRANCH: this.CONSTANTS.RAMO,
                    P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
                }
                this.vidaInversionService.RequestScoring(search_scoring).toPromise().then(res => {
                    
                    if (res.P_COD_ERR == 1) { }  //Error
                    // else if (res.P_COD_ERR == 2) { } // Es porque se puede registrar, no existe data en las tablas
                    else {
        
                        this.desc_scoring = res.P_DESC_SCORING;
                        this.recomendacion = res.P_RECOMENDACION;
                        this.sum_scoring = res.P_SUM_SCORING;
                        // this.perfilamiento.question1 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[0].P_SANSWER;
                        // this.perfilamiento.question2 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[1].P_SANSWER;
                        // this.perfilamiento.question3 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[2].P_SANSWER;
                        // this.perfilamiento.question4 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[3].P_SANSWER;
                        // this.perfilamiento.question5 = res.P_PERFILAMIENTO_ITEMS_RESPONSE[4].P_SANSWER;
                        this.perfilamiento.perfilamiento_exist = res.P_COD_ERR == 0 ? true : false;


                        const request_perfilamiento = {
                            P_NID_COTIZACION: this.quotation_id,
                            P_NBRANCH: this.CONSTANTS.RAMO,
                            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
                            P_UPDETE_PERFILAMIENTO: this.perfilamiento.perfilamiento_exist,
                            P_PERFILAMIENTO_ITEMS: response_items
                        };
        
                        myFormData.append('respuestas_perfilamiento', JSON.stringify(request_perfilamiento));
        
                        this.vidaInversionService.InsPerfilamiento(myFormData).toPromise().then((res) => {
                            console.log(res);
                            this.dissabled_next_button = true;
                            if (res.P_COD_ERR == 1) {
                            this.dissabled_next_button = false;
                                Swal.fire('Información', 'Ocurrió un problema en el cálculo del perfilamiento', 'error');
                            } else {
                                //Generacion de Documentos
                                let request_documentos = {
                                    P_NID_COTIZACION: this.quotation_id,
                                    P_SSTATREGT_COT: 6, // ESTADO PENDIENTE
                                    P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id']
                                };  
                                this.quotationService.InsUpdCotiStatesVIGPDoc(request_documentos).subscribe(
                                    res => {
                                        if (res.P_NCODE == 0) {
                                            this.readFile();
                                            this.current_step = next_step;
                                            this.dissabled_next_button = false;
        
                                        } else {
                                            this.dissabled_next_button = false;
                                            Swal.fire('Información', res.P_SMESSAGE, 'error');
                                        }
                                    },
                                    err => {
                                        Swal.fire('Información', 'Ha ocurrido un error.', 'error');
                                    }
                                );
                            }
                        });


                    }
                });


                
            }
        }
        else {
            this.current_step = next_step;
        }
    }

    enableInputs(type: any) { // Cuando el 360 no llama Info
        console.log("ENTRA");

        if (type == 1) {// Contratante
            // this.data_contractor.docuemnt_number = "";
            this.data_contractor.birthday_date = "";
            this.data_contractor.names = "";
            this.data_contractor.last_name = "";
            this.data_contractor.last_name2 = "";
            this.data_contractor.gender = "";
            this.data_contractor.civil_status = "";
            this.data_contractor.nationality = "";
            this.data_contractor.phone = "";
            this.data_contractor.email = "";
            this.data_contractor.address = "";
            // this.data_contractor.department = { Id: null };
            // this.data_contractor.province = { Id: null };
            // this.data_contractor.district = { Id: null };

            this.data_contractor.type_document_disabled = false;
            this.data_contractor.document_number_disabled = false;
            this.data_contractor.birthday_date_disabled = true;
            this.data_contractor.names_disabled = false;
            this.data_contractor.last_name_disabled = false;
            this.data_contractor.last_name2_disabled = false;
            this.data_contractor.gender_disabled = false;
            this.data_contractor.civil_status_disabled = false;
            this.data_contractor.nationality_disabled = false;
            this.data_contractor.department_disabled = false;
            this.data_contractor.province_disabled = false;
            this.data_contractor.district_disabled = false;
            this.data_contractor.phone_disabled = false;
            this.data_contractor.email_disabled = false;
            this.data_contractor.address_disabled = false;

            this.contractor_province_department = false;
            this.contractor_province_selected = false;
            // this.list_data_contractor_province = [];
            // this.list_data_contractor_district = [];


            this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_contractor_department = res;
                this.data_contractor.department = { Id: null }
                this.list_data_contractor_province = [];
                this.data_contractor.province = { Id: null }
                this.list_data_contractor_district = [];
                this.data_contractor.district = { Id: null }
            });

        } else if (type == 2) { // Asegurado
            // this.data_insured.docuemnt_number = "";
            this.data_insured.birthday_date = "";
            this.data_insured.names = "";
            this.data_insured.last_name = "";
            this.data_insured.last_name2 = "";
            this.data_insured.gender = "";
            this.data_insured.civil_status = "";
            this.data_insured.nationality = "";
            this.data_insured.phone = "";
            this.data_insured.email = "";
            this.data_insured.address = "";
            // this.data_insured.province = { Id: null };
            // this.data_insured.district = { Id: null };
            // this.data_insured.department = { Id: null };

            this.data_insured.type_document_disabled = false;
            this.data_insured.document_number_disabled = false;
            this.data_insured.birthday_date_disabled = false;
            this.data_insured.names_disabled = false;
            this.data_insured.last_name_disabled = false;
            this.data_insured.last_name2_disabled = false;
            this.data_insured.gender_disabled = false;
            this.data_insured.civil_status_disabled = false;
            this.data_insured.nationality_disabled = false;
            this.data_insured.department_disabled = false;
            this.data_insured.province_disabled = false;
            this.data_insured.district_disabled = false;
            this.data_insured.phone_disabled = false;
            this.data_insured.email_disabled = false;
            this.data_insured.address_disabled = false;

            this.insured_province_department = false;
            this.insured_province_selected = false;
            // this.list_data_insured_province = [];
            // this.list_data_insured_district = [];

            this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_insured_department = res;
                this.data_insured.department = { Id: null }
                this.list_data_insured_province = [];
                this.data_insured.province = { Id: null }
                this.list_data_insured_district = [];
                this.data_insured.district = { Id: null }
                this.data_insured.relation = { COD_ELEMENTO: 0 }
            });

            this.new_client_insured = true; // Indicamos que el cliente va ser nuevo
        }
    }

    validateForUpdateClient() {

        let response = false;

        if (this.data_contractor.type_document.Id != this.data_contractor_360.type_document.Id) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.document_number != this.data_contractor_360.document_number) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.birthday_date != this.data_contractor_360.birthday_date) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.names != this.data_contractor_360.names) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.last_name != this.data_contractor_360.last_name) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.last_name2 != this.data_contractor_360.last_name2) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.gender.SSEXCLIEN != this.data_contractor_360.gender.SSEXCLIEN) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.civil_status.NCIVILSTA != this.data_contractor_360.civil_status.NCIVILSTA) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.nationality.NNATIONALITY != this.data_contractor_360.nationality.NNATIONALITY) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.phone != this.data_contractor_360.phone) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.email != this.data_contractor_360.email) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.address != this.data_contractor_360.address) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.department.Id != this.data_contractor_360.department.Id) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.province.Id != this.data_contractor_360.province.Id) { response = true; this.nregister_contractor = 1; };

        if (this.data_contractor.district.Id != this.data_contractor_360.district.Id) { response = true; this.nregister_contractor = 1; };

        if (this.check_input_value == 0) {

            if (this.data_insured.type_document.Id != this.data_insured_360.type_document.Id) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.document_number != this.data_insured_360.document_number) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.birthday_date != this.data_insured_360.birthday_date) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.names != this.data_insured_360.names) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.last_name != this.data_insured_360.last_name) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.last_name2 != this.data_insured_360.last_name2) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.gender.SSEXCLIEN != this.data_insured_360.gender.SSEXCLIEN) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.civil_status.NCIVILSTA != this.data_insured_360.civil_status.NCIVILSTA) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.nationality.NNATIONALITY != this.data_insured_360.nationality.NNATIONALITY) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.phone != this.data_insured_360.phone) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.email != this.data_insured_360.email) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.address != this.data_insured_360.address) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.department.Id != this.data_insured_360.department.Id) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.province.Id != this.data_insured_360.province.Id) { response = true; this.nregister_insured = 1; };

            if (this.data_insured.district.Id != this.data_insured_360.district.Id) { response = true; this.nregister_insured = 1; };

            if (this.nregister_parentesco != this.data_insured.relation) { response = true; this.nregister_insured = 1; }; //parentesco

        }
        return response;

    }

    validateForUpdateInsured() {

        let response = false;

        if (this.data_insured.type_document.Id != this.data_insured_360.type_document.Id) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.document_number != this.data_insured_360.document_number) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.birthday_date != this.data_insured_360.birthday_date) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.names != this.data_insured_360.names) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.last_name != this.data_insured_360.last_name) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.last_name2 != this.data_insured_360.last_name2) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.gender.SSEXCLIEN != this.data_insured_360.gender.SSEXCLIEN) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.civil_status.NCIVILSTA != this.data_insured_360.civil_status.NCIVILSTA) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.nationality.NNATIONALITY != this.data_insured_360.nationality.NNATIONALITY) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.phone != this.data_insured_360.phone) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.email != this.data_insured_360.email) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.address != this.data_insured_360.address) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.department.Id != this.data_insured_360.department.Id) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.province.Id != this.data_insured_360.province.Id) { response = true; this.nregister_insured = 1; };

        if (this.data_insured.district.Id != this.data_insured_360.district.Id) { response = true; this.nregister_insured = 1; };

        if (this.nregister_parentesco != this.data_insured.relation) { response = true; this.nregister_insured = 1; }; //parentesco

        return response;
    }


    onChangeOptionPerfilamiento(value) {

        if (this.perfilamiento.question1 && this.perfilamiento.question2 && this.perfilamiento.question3 && this.perfilamiento.question4 && this.perfilamiento.question5) {

            let value_question1 = this.options_perfilamiento_question1.filter((item) => item.P_NOPTION.toUpperCase() == this.perfilamiento.question1.toUpperCase());
            let value_question2 = this.options_perfilamiento_question2.filter((item) => item.P_NOPTION.toUpperCase() == this.perfilamiento.question2.toUpperCase());
            let value_question3 = this.options_perfilamiento_question3.filter((item) => item.P_NOPTION.toUpperCase() == this.perfilamiento.question3.toUpperCase());
            let value_question4 = this.options_perfilamiento_question4.filter((item) => item.P_NOPTION.toUpperCase() == this.perfilamiento.question4.toUpperCase());
            let value_question5 = this.options_perfilamiento_question5.filter((item) => item.P_NOPTION.toUpperCase() == this.perfilamiento.question5.toUpperCase());

            let sun_scoring_local = value_question1[0].P_NVALUE + value_question2[0].P_NVALUE + value_question3[0].P_NVALUE + value_question4[0].P_NVALUE + value_question5[0].P_NVALUE;

            if (sun_scoring_local >= -6 && sun_scoring_local <= -3) {
                this.desc_scoring = 'Inversionista Conservador';
                this.recomendacion = '(Retornos fijos o baja volatilidad esperada)';
            }

            else if (sun_scoring_local >= -2 && sun_scoring_local <= 2) {
                this.desc_scoring = 'Perfil Moderado';
                this.recomendacion = '(Portafolios mixtos, volatilidad media)';
            }
            else if (sun_scoring_local >= 3 && sun_scoring_local <= 6) {
                this.desc_scoring = 'Tomador de Riesgo';
                this.recomendacion = '(Todo tipo de inversiones, maximizar retorno)'
            };
        };

    }


    esEmailValido(email: string): boolean {
        let mailValido = false;
        'use strict';

        var EMAIL_REGEX = this.CONSTANTS.REGEX.CORREO;
        //var EMAIL_REGEX = /^[a-z0-9!#$%&''*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+([A-Z]{2}|arpa|biz|com|info|intww|name|net|org|pro|aero|asia|cat|coop|edu|gov|jobs|mil|mobi|online|museum|pro|tel|travel|post|pe|global)$/;
        if (email.match(EMAIL_REGEX)) {
            mailValido = true;
        }
        return mailValido;
    }


    async updateDataClient360() {
        let error_upd_360 = "0";

        let formatter_data = this.formatter_data_definitive();

        if (this.check_input_value == 1) { // Solo Contratante

            let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);

            if (validate_error_contractor.cod_error == 1) {
                error_upd_360 = "1";
                this.isLoading = false;
                Swal.fire('Información', validate_error_contractor.message_error, 'error');
                return error_upd_360;
            }
            else {

                /* DGC - 17/01/2024 - INICIO */
                // CONTRATANTE
                if (this.data_contractor.type_document.Id == 2 && (this.data_contractor.nationality == "" || this.data_contractor.nationality.codigo == "")) {
                    this.data_contractor.nationality = { NNATIONALITY: 1 };
                }
                if (this.data_contractor.type_document.Id == 4 && (this.data_contractor.nationality == "" || this.data_contractor.nationality.codigo == "")) {
                    this.data_contractor.nationality = { NNATIONALITY: 276 };
                }
                if (this.data_contractor.civil_status == "" || this.data_contractor.civil_status.codigo == "") {
                    this.data_contractor.civil_status = { NCIVILSTA: -1 };
                }
                /* DGC - 17/01/2024 - FIN */

                let prospect_data = [];
                prospect_data.push(formatter_data.contractor_data);

                await this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                    if (res.P_NCODE == 1) {
                        error_upd_360 = "1";
                        this.isLoading = false;
                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                        return error_upd_360;
                    }

                    else {
                        console.log("llegue1")
                                    prospect_data[0].P_TYPE_ACTION = 1;
                                    prospect_data[0].P_NID_COTIZACION = this.quotation_id;
                                    prospect_data[0].P_NID_PROC = this.quotation.nid_proc;
                                    console.log(prospect_data)
                                    this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                                        if (res.P_NCODE == 1) {
                                            this.isLoading = false;
                                            Swal.fire('Información', res.P_SMESSAGE, 'error')
                                        }
                                    })
                        let update_client_360 = this.format_360(1); // Para enviar al 360
                        await this.clientInformationService.getCliente360(update_client_360).toPromise().then(
                            async res => {
                                if (res.P_NCODE == 1) {
                                    error_upd_360 = "1";
                                    this.isLoading = false;
                                    Swal.fire('Información1', res.P_SMESSAGE, 'warning')
                                    return error_upd_360;
                                }
                                else {
                                    
                                    // Validacion para actualizar la ubicacion del Contratante
                                    //if (this.data_contractor.address !== "" || this.data_contractor.department.Id != "0" || this.data_contractor.province.Id != "0" || this.data_contractor.district.Id != "0") {
                                    if (
                                        (this.data_contractor.address == "" || this.data_contractor.address == null) &&
                                        (this.data_contractor.department.Id == undefined || this.data_contractor.department.Id == null) &&
                                        (this.data_contractor.province.Id == undefined || this.data_contractor.province.Id == null) &&
                                        (this.data_contractor.district.Id == undefined || this.data_contractor.district.Id == null)
                                    ) {
                                        // no entra porque no hay datos de ubigeo
                                    }
                                    else {
                                        let contractor_ubication = {
                                            P_NRECOWNER: "2",
                                            P_SRECTYPE: "2",
                                            P_NIDDOC_TYPE: this.data_contractor.type_document.Id.toString(),
                                            P_SIDDOC: this.data_contractor.document_number,
                                            // P_NCOUNTRY: this.data_contractor.nationality.NNATIONALITY.toString() == "" ? "1": this.data_contractor.nationality.NNATIONALITY.toString(),
                                            P_NCOUNTRY: "1",
                                            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                                            P_NPROVINCE: this.data_contractor.department.Id ? this.data_contractor.department.Id.toString() : null,
                                            P_NLOCAL: this.data_contractor.province.Id ? this.data_contractor.province.Id.toString() : null,
                                            P_NMUNICIPALITY: this.data_contractor.district.Id ? this.data_contractor.district.Id.toString() : null,
                                            P_SREFERENCE: "referencial",
                                            P_SNOM_DIRECCION: this.data_contractor.address,
                                            P_SORIGEN: "SCTRM",
                                            // P_NRECOWNER: "2",
                                            // P_SRECTYPE: "2",
                                            // P_NIDDOC_TYPE: "2",
                                            // P_SIDDOC: "27725666",
                                            // P_NCOUNTRY: "1",
                                            // P_NUSERCODE: "1",
                                            // P_NPROVINCE: "14",
                                            // P_NLOCAL: "1401",
                                            // P_SREFERENCE: "cerca",
                                            // P_NMUNICIPALITY: "140101",
                                            // P_SNOM_DIRECCION: "AV ROOSELVET",
                                            // P_SORIGEN: "SCTRM"
                                        }
                                        await this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                            async res => {
                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) {
                                                }
                                                else {
                                                    error_upd_360 = "1";
                                                    this.isLoading = false;
                                                    Swal.fire('Información2', res.P_SMESSAGE, 'warning')
                                                    return error_upd_360;
                                                }
                                            }
                                        )
                                    }
                                    
                                }
                            })
                    }
                });
        
            }

        } else { // Contratante y Asegurado

            let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);

            let validate_error_insured = this.CONSTANTS.VALIDATE_INSURED(this.data_insured, this.idecon_insured);

            if (validate_error_contractor.cod_error == 1 || validate_error_insured.cod_error == 1) {
                error_upd_360 = "1";
                this.isLoading = false;
                Swal.fire('Información', `${validate_error_contractor.message_error}${validate_error_insured.message_error}`, 'error');
                return error_upd_360;
            }
            else {

                /* DGC - 17/01/2024 - INICIO */
                // CONTRATANTE
                if (this.data_contractor.type_document.Id == 2 && (this.data_contractor.nationality == "" || this.data_contractor.nationality.codigo == "")) {
                    this.data_contractor.nationality = { NNATIONALITY: 1 };
                }
                if (this.data_contractor.type_document.Id == 4 && (this.data_contractor.nationality == "" || this.data_contractor.nationality.codigo == "")) {
                    this.data_contractor.nationality = { NNATIONALITY: 276 };
                }
                if (this.data_contractor.civil_status == "" || this.data_contractor.civil_status.codigo == "") {
                    this.data_contractor.civil_status = { NCIVILSTA: -1 };
                }
                // ASEGURADO
                if (this.data_insured.type_document.Id == 2 && (this.data_insured.nationality == "" || this.data_insured.nationality.codigo == "")) {
                    this.data_insured.nationality = { NNATIONALITY: 1 };
                }
                if (this.data_insured.type_document.Id == 4 && (this.data_insured.nationality == "" || this.data_insured.nationality.codigo == "")) {
                    this.data_insured.nationality = { NNATIONALITY: 276 };
                }
                if (this.data_insured.civil_status == "" || this.data_insured.civil_status.codigo == "") {
                    this.data_insured.civil_status = { NCIVILSTA: -1 };
                }
                /* DGC - 17/01/2024 - FIN */

                let prospect_data = [];
                prospect_data.push(formatter_data.contractor_data);
                prospect_data.push(formatter_data.insured_data); // Agregando Asegurado

                if (this.new_client_insured == true) {  // Si el Asegurado no esta registrado en el 360

                    let update_client_360_insured = this.format_360(2); // Para enviar al 360 Asegurado
                    //asegurado
                    await this.clientInformationService.getCliente360(update_client_360_insured).toPromise().then(
                        async res2 => {

                            if (res2.P_NCODE == 1) {
                                error_upd_360 = "1";
                                this.isLoading = false;
                                Swal.fire('Información', res2.P_SMESSAGE, 'warning');
                                return error_upd_360;
                            }
                            else {

                                prospect_data[1].P_SCLIENT = res2.P_SCOD_CLIENT.toString().trim();
                                this.data_insured.sclient = res2.P_SCOD_CLIENT.toString().trim();

                                //if (this.data_insured.address !== "" || this.data_insured.department.Id != "0" || this.data_insured.province.Id != "0" || this.data_insured.district.Id != "0") {
                                if (
                                    (this.data_insured.address == "" || this.data_insured.address == null) &&
                                    (this.data_insured.department.Id == undefined || this.data_insured.department.Id == null) &&
                                    (this.data_insured.province.Id == undefined || this.data_insured.province.Id == null) &&
                                    (this.data_insured.district.Id == undefined || this.data_insured.district.Id == null)
                                ) {
                                    //

                                } else {
                                    let insured_ubication = {
                                        P_NRECOWNER: "2",
                                        P_SRECTYPE: "2",
                                        P_NIDDOC_TYPE: this.data_insured.type_document.Id.toString(),
                                        P_SIDDOC: this.data_insured.document_number,
                                        P_NCOUNTRY: "1",
                                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                                        P_NPROVINCE: this.data_insured.department.Id.toString(),
                                        P_NLOCAL: this.data_insured.province.Id.toString(),
                                        P_NMUNICIPALITY: this.data_insured.district.Id.toString(),
                                        P_SREFERENCE: "referencial",
                                        P_SNOM_DIRECCION: this.data_insured.address,
                                        P_SORIGEN: "SCTRM",
                                    }

                                    await this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                        async res => {
                                            if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar
                                            } else {
                                                error_upd_360 = "1";
                                                Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                return error_upd_360;
                                            }

                                        })
                                }

                            }
                        });

                    await this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                        if (res.P_NCODE == 1) {
                            error_upd_360 = "1";
                            Swal.fire('Información', res.P_SMESSAGE, 'error')
                            return error_upd_360;
                        }
                    });
                    console.log("llegue2")
                    //para actualizar LA DATA DEL ASEGURADO EN TABLAS
                    prospect_data[0].P_TYPE_ACTION = 1;
                    prospect_data[0].P_NID_COTIZACION = this.quotation_id;
                    prospect_data[0].P_NID_PROC = this.quotation.nid_proc;
                    await this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                        if (res.P_NCODE == 1) {
                            this.isLoading = false;
                            Swal.fire('Información', res.P_SMESSAGE, 'error')
                        }
                    })

                }
                else {
                    await this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                        if (res.P_NCODE == 1) {
                            error_upd_360 = "1";
                            Swal.fire('Información', res.P_SMESSAGE, 'error')
                            return error_upd_360;
                        }
                        else {

                            let update_client_360_contractor = this.format_360(1); // Para enviar al 360 Contratante
                            let update_client_360_insured = this.format_360(2); // Para enviar al 360 Asegurado

                            //contratante
                            await this.clientInformationService.getCliente360(update_client_360_contractor).toPromise().then(
                                async res => {

                                    if (res.P_NCODE == 1) {
                                        error_upd_360 = "1";
                                        this.isLoading = false;
                                        Swal.fire('Información', res.P_SMESSAGE, 'warning');
                                        return error_upd_360;
                                    }

                                    else {

                                        //if (this.data_contractor.address !== "" || this.data_contractor.department.Id != "0" || this.data_contractor.province.Id != "0" || this.data_contractor.district.Id != "0") {
                                        if (
                                            (this.data_contractor.address == "" || this.data_contractor.address == null) &&
                                            (this.data_contractor.department.Id == undefined || this.data_contractor.department.Id == null) &&
                                            (this.data_contractor.province.Id == undefined || this.data_contractor.province.Id == null) &&
                                            (this.data_contractor.district.Id == undefined || this.data_contractor.district.Id == null)
                                        ) {
                                            // no entra porque no hay datos de ubigeo
                                        }
                                        else {
                                            let contractor_ubication = {
                                                P_NRECOWNER: "2",
                                                P_SRECTYPE: "2",
                                                P_NIDDOC_TYPE: this.data_contractor.type_document.Id.toString(),
                                                P_SIDDOC: this.data_contractor.document_number,
                                                P_NCOUNTRY: "1",
                                                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                                                P_NPROVINCE: this.data_contractor.department.Id.toString(),
                                                P_NLOCAL: this.data_contractor.province.Id.toString(),
                                                P_NMUNICIPALITY: this.data_contractor.district.Id.toString(),
                                                P_SREFERENCE: "referencial",
                                                P_SNOM_DIRECCION: this.data_contractor.address,
                                                P_SORIGEN: "SCTRM",
                                            }
                                            await this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                                async res => {
                                                    if (res.P_NCODE == 0 || res.P_NCODE == 2) {

                                                        ///
                                                    }
                                                    else {
                                                        error_upd_360 = "1";
                                                        this.isLoading = false;
                                                        Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                        return error_upd_360;
                                                    }
                                                }
                                            )
                                        }
                                        // else {
                                        // Swal.fire('Información', "El prospecto se creó exitosamente.", 'success');
                                        // }
                                    }
                                });

                            //asegurado
                            await this.clientInformationService.getCliente360(update_client_360_insured).toPromise().then(
                                async res2 => {

                                    if (res2.P_NCODE == 1) {
                                        error_upd_360 = "1";
                                        this.isLoading = false;
                                        Swal.fire('Información', res2.P_SMESSAGE, 'warning');
                                        return error_upd_360;
                                    }
                                    else {

                                        //if (this.data_insured.address !== "" || this.data_insured.department.Id != "0" || this.data_insured.province.Id != "0" || this.data_insured.district.Id != "0") {
                                        if (
                                            (this.data_insured.address == "" || this.data_insured.address == null) &&
                                            (this.data_insured.department.Id == undefined || this.data_insured.department.Id == null) &&
                                            (this.data_insured.province.Id == undefined || this.data_insured.province.Id == null) &&
                                            (this.data_insured.district.Id == undefined || this.data_insured.district.Id == null)
                                        ) {
                                            //

                                        } else {
                                            let insured_ubication = {
                                                P_NRECOWNER: "2",
                                                P_SRECTYPE: "2",
                                                P_NIDDOC_TYPE: this.data_insured.type_document.Id.toString(),
                                                P_SIDDOC: this.data_insured.document_number,
                                                P_NCOUNTRY: "1",
                                                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                                                P_NPROVINCE: this.data_insured.department.Id.toString(),
                                                P_NLOCAL: this.data_insured.province.Id.toString(),
                                                P_NMUNICIPALITY: this.data_insured.district.Id.toString(),
                                                P_SREFERENCE: "referencial",
                                                P_SNOM_DIRECCION: this.data_insured.address,
                                                P_SORIGEN: "SCTRM",
                                            }

                                            await this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                                async res => {
                                                    if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar
                                                    } else {
                                                        error_upd_360 = "1";
                                                        Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                        return error_upd_360;
                                                    }

                                                })
                                        }

                                    }
                                });


                                if (res.P_NCODE == 1) {
                                    this.isLoading = false;
                                    Swal.fire('Información', res.P_SMESSAGE, 'error');
                                }
                                else {
                                console.log("llegue3")
                                console.log(prospect_data)
                                prospect_data[0].P_TYPE_ACTION = 1;
                                prospect_data[0].P_NID_COTIZACION = this.quotation_id;
                                prospect_data[0].P_NID_PROC = this.quotation.nid_proc;
                                await this.vidaInversionService.insertProspect(prospect_data).toPromise().then(async (res) => {
                                    if (res.P_NCODE == 1) {
                                        this.isLoading = false;
                                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                                    }
                                })
                            }
                                
                        }
                    })
         
                }
            }
        }
        return error_upd_360;
    }



    formatter_data_definitive() {

        const contractor_data = {
            P_NCHANNEL: "1",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_contractor.sclient,
            P_NTYPE_DOCUMENT: this.data_contractor.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_SNAMES: this.data_contractor.names,
            P_SLASTNAME: this.data_contractor.last_name,
            P_SLASTNAME2: this.data_contractor.last_name2,
            P_DDATEBIRTHDAY: this.data_contractor.birthday_date,
            P_NID_SEX: this.data_contractor.gender.SSEXCLIEN,
            P_NID_NATION: this.data_contractor.nationality.NNATIONALITY,
            P_SCELLPHONE: this.data_contractor.phone,
            P_SEMAIL: this.data_contractor.email,
            P_SADDRESS: this.data_contractor.address,
            P_NID_DPTO: this.data_contractor.department.Id,
            P_NID_PROV: this.data_contractor.province.Id,
            P_NID_DIST: this.data_contractor.district.Id,
            P_NID_ASCON: this.check_input_value, // 1 Si , 0 NO
            P_NTYPE_CLIENT: 1,
            P_USER: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_SUSERNAME: JSON.parse(localStorage.getItem('currentUser'))['username'],
            P_REG_CONTRACTOR: this.nregister_contractor,
            P_REG_INSURED: this.nregister_insured
        };

        const insured_data = {
            P_NCHANNEL: "1000",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_insured.sclient,
            P_NTYPE_DOCUMENT: this.data_insured.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_insured.document_number,
            P_SNAMES: this.data_insured.names ? this.data_insured.names : null,
            P_SLASTNAME: this.data_insured.last_name ? this.data_insured.last_name : null,
            P_SLASTNAME2: this.data_insured.last_name2 ? this.data_insured.last_name2 : null,
            P_DDATEBIRTHDAY: this.data_insured.birthday_date ? this.data_insured.birthday_date : null,
            P_NID_SEX: this.data_insured.gender ? this.data_insured.gender.SSEXCLIEN : null,
            P_NID_NATION: this.data_insured.nationality.NNATIONALITY,
            P_SCELLPHONE: this.data_insured.phone,
            P_SEMAIL: this.data_insured.email,
            P_SADDRESS: this.data_insured.address,
            P_NID_DPTO: this.data_insured.department.Id,
            P_NID_PROV: this.data_insured.province.Id,
            P_NID_DIST: this.data_insured.district.Id,
            P_NID_ASCON: this.check_input_value, // 1 Si , 0 NO
            P_NTYPE_CLIENT: 2,
            P_REG_CONTRACTOR: this.nregister_contractor,
            P_REG_INSURED: this.nregister_insured,
            P_SRELATION: this.data_insured.relation.COD_ELEMENTO
        };

        let format_data = { contractor_data, insured_data };

        return format_data;

    }


    format_360(search_type) {
        // search_type 1 para Contratante 2 Para Contratatne y Asegurado

        let formatter_data_360 = {};

        if (search_type == 1) {

            // let split_date = this.data_contractor.birthday_date.split('/');
            // let format_birthday = `${split_date[1]}/${split_date[0]}/${split_date[2]}`;

            const format_birthday = this.data_contractor.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_contractor.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_contractor.birthday_date.getFullYear();

            // Agrergar la Valdiacion que cuando se hace click en el Departamente busvcar si [items] esta vacio y si lo esta que llame el servicio 
            formatter_data_360 = {
                EListContactClient: [],
                EListCIIUClient: [],
                P_NIDDOC_TYPE: this.data_contractor.type_document.Id,
                P_SIDDOC: this.data_contractor.document_number,
                P_TipOper: "INS",
                P_SFIRSTNAME: this.data_contractor.names,
                P_SLASTNAME: this.data_contractor.last_name,
                P_SLASTNAME2: this.data_contractor.last_name2,
                P_SLEGALNAME: "",
                P_SSEXCLIEN: this.data_contractor.gender.SSEXCLIEN,
                P_DBIRTHDAT: format_birthday,
                P_NSPECIALITY: "",
                P_NCIVILSTA: this.data_contractor.civil_status.NCIVILSTA, // this.data_contractor.civil_status.NCIVILSTA PASARLE EL CODE DE ESTADO CIVIL,
                P_SBLOCKADE: "2",
                P_NTITLE: "99",
                P_NHEIGHT: null,
                P_ORIGEN_DATA: "GESTORCLIENTE",
                P_NNATIONALITY: this.data_contractor.nationality.NNATIONALITY, // Cambio de pais
                // P_NNATIONALITY: "1", // Cambio de pais
                P_SBLOCKLAFT: "2",
                P_SISCLIENT_IND: "2",
                P_SISRENIEC_IND: "2",
                P_SISCLIENT_GBD: "2",
                P_SPOLIZA_ELECT_IND: "2",
                P_SPROTEG_DATOS_IND: "2",
                P_COD_CUSPP: "",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            }

            if (this.data_contractor.phone !== "") {
                formatter_data_360 = {
                    ...formatter_data_360, EListPhoneClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESAREA: "",
                        P_DESTIPOTLF: "Celular",
                        P_NAREA_CODE: null,
                        P_NEXTENS1: "",
                        P_NPHONE_TYPE: "2",
                        P_NROW: 1,
                        P_SPHONE: this.data_contractor.phone,
                        P_SNOMUSUARIO: "",
                        P_DCOMPDATE: "",
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }
            }

            if (this.data_contractor.email !== "") {
                // Actualizacion de Correo Personal
                formatter_data_360 = {
                    ...formatter_data_360, EListEmailClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESTICORREO: "Trabajo",
                        P_NROW: 1,
                        P_SE_MAIL: this.data_contractor.email,
                        P_SRECTYPE: 4,
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }

            }
        }
        else {


            // let split_date = this.data_insured.birthday_date.split('/');
            // let format_birthday = `${split_date[1]}/${split_date[0]}/${split_date[2]}`;

            const format_birthday = this.data_insured.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_insured.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_insured.birthday_date.getFullYear();

            formatter_data_360 = {
                EListContactClient: [],
                EListCIIUClient: [],
                P_NIDDOC_TYPE: this.data_insured.type_document.Id,
                P_SIDDOC: this.data_insured.document_number,
                P_TipOper: "INS",
                P_SFIRSTNAME: this.data_insured.names,
                P_SLASTNAME: this.data_insured.last_name,
                P_SLASTNAME2: this.data_insured.last_name2,
                P_SLEGALNAME: "",
                P_SSEXCLIEN: this.data_insured.gender.SSEXCLIEN,
                P_DBIRTHDAT: format_birthday,
                P_NSPECIALITY: "",
                P_NCIVILSTA: this.data_insured.civil_status.NCIVILSTA, // this.data_insured.civil_status.NCIVILSTA PASARLE EL CODE DE ESTADO CIVIL,
                P_SBLOCKADE: "2",
                P_NTITLE: "99",
                P_NHEIGHT: null,
                P_ORIGEN_DATA: "GESTORCLIENTE",
                P_NNATIONALITY: this.data_insured.nationality.NNATIONALITY, // Cambio de pais
                P_SBLOCKLAFT: "2",
                P_SISCLIENT_IND: "2",
                P_SISRENIEC_IND: "2",
                P_SISCLIENT_GBD: "2",
                P_SPOLIZA_ELECT_IND: "2",
                P_SPROTEG_DATOS_IND: "2",
                P_COD_CUSPP: "",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            }

            if (this.data_insured.phone !== "") {
                formatter_data_360 = {
                    ...formatter_data_360, EListPhoneClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESAREA: "",
                        P_DESTIPOTLF: "Celular",
                        P_NAREA_CODE: null,
                        P_NEXTENS1: "",
                        P_NPHONE_TYPE: "2",
                        P_NROW: 1,
                        P_SPHONE: this.data_insured.phone,
                        P_SNOMUSUARIO: "",
                        P_DCOMPDATE: "",
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }
            }

            if (this.data_insured.email !== "") {
                // Actualizacion de Correo Personal
                formatter_data_360 = {
                    ...formatter_data_360, EListEmailClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESTICORREO: "Trabajo",
                        P_NROW: 1,
                        P_SE_MAIL: this.data_insured.email,
                        P_SRECTYPE: 4,
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }

            }
        }
        return formatter_data_360;
    }


    formatter_insert_360(search_type) {

        // search_type 1 para Contratante 2 Para Contratatne y Asegurado
        let formatter_data_360;

        if (search_type == 1) {

            const format_birthday = this.data_contractor.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_contractor.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_contractor.birthday_date.getFullYear();


            // Agrergar la Valdiacion que cuando se hace click en el Departamente busvcar si [items] esta vacio y si lo esta que llame el servicio 
            formatter_data_360 = {
                EListContactClient: [],
                EListCIIUClient: [],
                P_NIDDOC_TYPE: this.data_contractor.type_document.Id,
                P_SIDDOC: this.data_contractor.document_number,
                P_TipOper: "INS",
                P_SFIRSTNAME: this.data_contractor.names,
                P_SLASTNAME: this.data_contractor.last_name,
                P_SLASTNAME2: this.data_contractor.last_name2,
                P_SLEGALNAME: "",
                P_SSEXCLIEN: this.data_contractor.gender.SSEXCLIEN,
                P_DBIRTHDAT: format_birthday,
                P_NSPECIALITY: "",
                P_NCIVILSTA: this.data_contractor.civil_status.NCIVILSTA, // this.data_contractor.civil_status.NCIVILSTA PASARLE EL CODE DE ESTADO CIVIL,
                P_SBLOCKADE: "2",
                P_NTITLE: "99",
                P_NHEIGHT: null,
                P_ORIGEN_DATA: "GESTORCLIENTE",
                P_NNATIONALITY: this.data_contractor.nationality.NNATIONALITY, // Cambio de pais
                // P_NNATIONALITY: "1", // Cambio de pais
                P_SBLOCKLAFT: "2",
                P_SISCLIENT_IND: "2",
                P_SISRENIEC_IND: "2",
                P_SISCLIENT_GBD: "2",
                P_SPOLIZA_ELECT_IND: "2",
                P_SPROTEG_DATOS_IND: "2",
                P_COD_CUSPP: "",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            }

            if (this.data_contractor.phone !== "") {
                formatter_data_360 = {
                    ...formatter_data_360, EListPhoneClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESAREA: "",
                        P_DESTIPOTLF: "Celular",
                        P_NAREA_CODE: null,
                        P_NEXTENS1: "",
                        P_NPHONE_TYPE: "2",
                        P_NROW: 1,
                        P_SPHONE: this.data_contractor.phone,
                        P_SNOMUSUARIO: "",
                        P_DCOMPDATE: "",
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }
            }

            if (this.data_contractor.email !== "") {
                // Actualizacion de Correo Personal
                formatter_data_360 = {
                    ...formatter_data_360, EListEmailClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESTICORREO: "Trabajo",
                        P_NROW: 1,
                        P_SE_MAIL: this.data_contractor.email,
                        P_SRECTYPE: 4,
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }

            }
        }
        else {

            const format_birthday = this.data_insured.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_insured.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_insured.birthday_date.getFullYear();

            formatter_data_360 = {
                EListContactClient: [],
                EListCIIUClient: [],
                P_NIDDOC_TYPE: this.data_insured.type_document.Id,
                P_SIDDOC: this.data_insured.document_number,
                P_TipOper: "INS",
                P_SFIRSTNAME: this.data_insured.names,
                P_SLASTNAME: this.data_insured.last_name,
                P_SLASTNAME2: this.data_insured.last_name2,
                P_SLEGALNAME: "",
                P_SSEXCLIEN: this.data_insured.gender.SSEXCLIEN,
                P_DBIRTHDAT: format_birthday,
                P_NSPECIALITY: "",
                P_NCIVILSTA: this.data_insured.civil_status.NCIVILSTA, // this.data_insured.civil_status.NCIVILSTA PASARLE EL CODE DE ESTADO CIVIL,
                P_SBLOCKADE: "2",
                P_NTITLE: "99",
                P_NHEIGHT: null,
                P_ORIGEN_DATA: "GESTORCLIENTE",
                P_NNATIONALITY: this.data_insured.nationality.NNATIONALITY, // Cambio de pais
                P_SBLOCKLAFT: "2",
                P_SISCLIENT_IND: "2",
                P_SISRENIEC_IND: "2",
                P_SISCLIENT_GBD: "2",
                P_SPOLIZA_ELECT_IND: "2",
                P_SPROTEG_DATOS_IND: "2",
                P_COD_CUSPP: "",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            }

            if (this.data_insured.phone !== "") {
                formatter_data_360 = {
                    ...formatter_data_360, EListPhoneClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESAREA: "",
                        P_DESTIPOTLF: "Celular",
                        P_NAREA_CODE: null,
                        P_NEXTENS1: "",
                        P_NPHONE_TYPE: "2",
                        P_NROW: 1,
                        P_SPHONE: this.data_insured.phone,
                        P_SNOMUSUARIO: "",
                        P_DCOMPDATE: "",
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }
            }

            if (this.data_insured.email !== "") {
                // Actualizacion de Correo Personal
                formatter_data_360 = {
                    ...formatter_data_360, EListEmailClient: [{
                        P_SORIGEN: "SCTR",
                        P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        P_DESTICORREO: "Trabajo",
                        P_NROW: 1,
                        P_SE_MAIL: this.data_insured.email,
                        P_SRECTYPE: 4,
                        P_TipOper: "",
                        P_CLASS: ""
                    }]
                }

            }
        }
        return formatter_data_360;
    }

    insertUpdateExistingClient(update_client_360) {
        let response;
        this.clientInformationService.getCliente360(update_client_360).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    insDirection(client_ubication) {
        let response;
        this.vidaInversionService.saveDirection(client_ubication).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    formatterDataDirection(search_type) {
        let client_ubication;

        if (search_type == 1) {
            client_ubication = {
                P_NRECOWNER: "2",
                P_SRECTYPE: "2",
                P_NIDDOC_TYPE: this.data_contractor.type_document.Id.toString(),
                P_SIDDOC: this.data_contractor.document_number,
                P_NCOUNTRY: "1",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                P_NPROVINCE: this.data_contractor.department.Id ? this.data_contractor.department.Id.toString() : null,
                P_NLOCAL: this.data_contractor.province.Id ? this.data_contractor.province.Id.toString() : null,
                P_NMUNICIPALITY: this.data_contractor.district.Id ? this.data_contractor.district.Id.toString() : null,
                P_SREFERENCE: "REFERENCIAL",
                P_SNOM_DIRECCION: this.data_contractor.address,
                P_SORIGEN: "SCTRM",
            }
        } else if (search_type == 2) {

            client_ubication = {
                P_NRECOWNER: "2",
                P_SRECTYPE: "2",
                P_NIDDOC_TYPE: this.data_insured.type_document.Id.toString(),
                P_SIDDOC: this.data_insured.document_number,
                P_NCOUNTRY: "1",
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'].toString(),
                P_NPROVINCE: this.data_insured.department.Id ? this.data_insured.department.Id.toString() : null,
                P_NLOCAL: this.data_insured.province.Id ? this.data_insured.province.Id.toString() : null,
                P_NMUNICIPALITY: this.data_insured.district.Id ? this.data_insured.district.Id.toString() : null,
                P_SREFERENCE: "REFERENCIAL",
                P_SNOM_DIRECCION: this.data_insured.address,
                P_SORIGEN: "SCTRM",
            }
        }

        return client_ubication;

    }

    validEmail = (num) => {
        if (num == 1) {
            if (this.data_contractor.email == "" || this.data_contractor.email.match(this.CONSTANTS.REGEX.CORREO)) {
                this.boolEmailCTR = false;
            } else {
                this.boolEmailCTR = true;
            }
        } else {
            if (this.data_insured.email == "" || this.data_insured.email.match(this.CONSTANTS.REGEX.CORREO)) {
                this.boolEmailASG = false;
            } else {
                this.boolEmailASG = true;
            }
        }
    }

    validNumber = (num) => {
        if (num == 1) {
            if (this.data_contractor.phone == "" || this.data_contractor.phone.match(this.CONSTANTS.REGEX.CELULAR)) {
                this.boolNumberCTR = false;
            } else {
                this.boolNumberCTR = true;
            }
        } else {
            if (this.data_insured.phone == "" || this.data_insured.phone.match(this.CONSTANTS.REGEX.CELULAR)) {
                this.boolNumberASG = false;
            } else {
                this.boolNumberASG = true;
            }
        }
    }

    // 1
    derivadoAJefe = () => {
        this.InsUpdCotiStatesVIGP();
    }

    // 2
    observadoPorJefe = () => {
        this.InsCommentsCotiVIGP(2, 'Se registró la observación y se envió al supervisor.');
    }

    // 3
    derivadoASoporte = () => {
        this.InsCommentsCotiVIGP(3, 'Se derivó a soporte correctamente.');
    }

    // 4
    observadoPorSoporteAJefe = () => {
        this.InsCommentsCotiVIGP(4, 'Se registró la observación y se envió al jefe.');
    }

    // 5
    observadoPorSoporteASupervisor = () => {
        this.InsCommentsCotiVIGP(5, 'Se registró la observación y se envió al supervisor.');
    }

    // 6
    derivadoACoordinador = () => {
        this.InsCommentsCotiVIGP(6, 'Se derivó al coordinador correctamente.');
    }

    // 7
    aprobadoPorCoordinador = () => {
        this.InsCommentsCotiVIGP(7, 'Se aprobó correctamente.');
    }

    // 8
    rechazadoPorCoordinador = () => {
        this.InsCommentsCotiVIGP(8, 'Se rechazó correctamente.');
    }

    // 9
    derivadoAGerente = () => {
        this.InsCommentsCotiVIGP(9, 'Se derivó al gerente correctamente.');
    }

    // 10
    aprobadoPorGerente = () => {
        this.InsCommentsCotiVIGP(10, 'Se aprobó correctamente.');
    }

    // 11
    rechazadoPorGerente = () => {
        this.InsCommentsCotiVIGP(11, 'Se rechazó correctamente.');
    }

    // 12
    derivadoAFirmas = () => {
        this.InsCommentsCotiVIGP(12, 'Se derivó a firmas correctamente.');
        if (this.comentario) {
            this.previusStep(5);
            this.NID_STATE = 12;
            this.readFile();
        }  
    }

    // 12
    derivadoAOperaciones = () => {
        this.InsCommentsCotiVIGP(14, 'Se derivó a operaciones correctamente.');
    }

    openFileModal() {
        let modalRef: NgbModalRef;

        let obj = {
            P_NID_COTIZACION: this.quotation_id,
            P_DESCRI: "file_del_cliente_firmado",
            P_NAME: "FILE DEL CLIENTE FIRMADO",
            P_FLAG: 7
        };

        modalRef = this.modalService.open(AddFileComponent, {
            size: 'md',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.obj = obj;
        modalRef.componentInstance.reference.readFile = () => this.readFile();
        modalRef.componentInstance.reference.previusStep = () => this.previusStep(5);
        //modalRef.componentInstance.reference.funFirmaManuscrita = () => this.funFirmaManuscrita();
    }

    // funFirmaManuscrita () {
    //     this.firmaManuscrita = true;
    // }

    InsUpdCotiStatesVIGP = () => {
        if (this.comentario == null || this.comentario == '') {
            Swal.fire('Información', 'Debe ingresar un comentario.', 'warning');
        } else {
            let item = {
                P_NID_COTIZACION: this.quotation_id,
                P_SSTATREGT_COT: 6, // ESTADO PENDIENTE
                P_SCOMMENT: this.comentario,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
            this.quotationService.InsUpdCotiStatesVIGP(item).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        //this.comentario = null;
                        this.InsCommentsCotiVIGP(1, 'Se derivó al jefe correctamente.');
                    } else {
                        Swal.fire('Información', res.P_SMESSAGE, 'error');
                    }
                },
                err => {
                    Swal.fire('Información', 'Ha ocurrido un error.', 'error');
                }
            );
        }
    }

    InsCommentsCotiVIGP = (state, mess) => {
        if (this.comentario == null || this.comentario == '') {
            Swal.fire('Información', 'Debe ingresar un comentario.', 'warning');
        } else {
            let item = {
                P_NID_COTIZACION: this.quotation_id,
                P_NID_STATE: state,
                P_SCOMMENT: this.comentario,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
            this.quotationService.InsCommentsCotiVIGP(item).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        this.comentario = null;
                        this.GetCommentsCotiVIGP();
                        Swal.fire(
                            {
                                title: 'Información',
                                text: mess,
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showCloseButton: false
                            }
                        ).then(
                            (result) => {
                                if (result.value && state != 12) {
                                    this.router.navigate(['extranet/vida-inversion/consulta-cotizacion']);
                                }
                            }
                        );
                    } else {
                        Swal.fire('Información', res.P_MESSAGE, 'error');
                    }
                },
                err => {
                    Swal.fire('Información', 'Ha ocurrido un error.', 'error');
                }
            );
        }
    }

    GetCommentsCotiVIGP = () => {
        this.quotationService.GetCommentsCotiVIGP({ P_NID_COTIZACION: this.quotation_id }).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.comentarios = res.C_TABLE;
                } else {
                    Swal.fire('Información', res.P_SMESSAGE, 'error');
                }
            },
            err => {
                Swal.fire('Información', 'Ha ocurrido un error.', 'error');
            }
        );
    }

    scoring = () => {
        let items: string[] = ['Bajo', 'Medio', 'Alto'];
        const randomIndex = Math.floor(Math.random() * items.length);
        this.randomItem = items[randomIndex];
        this.showScoreBtn = false;
        this.showCoordinadorBtn = (this.randomItem == 'Medio' || this.randomItem == 'Alto') && Number(this.quotation.contributionDesc) <= 100000 ? true : false;
        this.showGerenteBtn = (this.randomItem == 'Medio' || this.randomItem == 'Alto') && Number(this.quotation.contributionDesc) > 100000 ? true : false;
    }

    cancelar = () => {
        Swal.fire(
            {
                title: '¿Estás seguro de salir de la cotización',
                text: 'Los datos ingresados previamente permanecerán guardados.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                cancelButtonText: 'Cancelar',
            }
        ).then(
            (result) => {
                if (result.value) {
                    this.router.navigate(['extranet/vida-inversion/consulta-cotizacion']);
                }
            }
        )
    }
    getNidStateAndDefState(){
        this.quotationService.GetNidStateAndDefState(this.quotation_id).subscribe(
            res => {
                this.NID_STATE = res.P_NID_STATE
                this.DEF_STATE = res.P_DEF_STATE
            },
        );
    }
    
}