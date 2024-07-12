import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import { DataContractor } from '../../models/DataContractor';
import { DataInsured } from '../../models/DataInsured';
import { AddressService } from '../../../broker/services/shared/address.service';
import { AccPersonalesService } from '../../../broker/components/quote/acc-personales/acc-personales.service';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { CommonMethods } from '../../../broker/components/common-methods';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import Swal from 'sweetalert2';
import { PolicyemitService } from '../../../broker/services/policy/policyemit.service';

@Component({
    selector: 'app-policy',
    templateUrl: './policy.component.html',
    styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

    quotation_id: number;
    prospect_id: number;
    view_mode: string;
    lblMode: string;

    profile_id: any;
    quotation: any = {
        moneda: '',
        fondo: '',
        contribution: '',
        date_fund: new Date(),
        nid_proc: ""
    };

    sclient: string = '0';
    current_day: any = new Date;
    CONSTANTS: any = VidaInversionConstants;
    isLoading: boolean = false;
    dissabled_btn_modal_detail_origin: boolean = false;

    boolNumberCTR: boolean = false;
    boolNumberASG: boolean = false;
    boolEmailCTR: boolean = false;
    boolEmailASG: boolean = false;
    @Input() check_input_value = 1;
    @Input() check_input_value_beneficiary = 1;
    @Input() check_input_nationality;
    @Input() check_input_relationship;
    @Input() check_input_fiscal_obligations;


    CODPRODUCTO_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];

    investment: any = [];
    serror = "";
    contractor_province_department: any = false;
    contractor_province_selected: any = false;
    insured_province_department: any = false;
    insured_province_selected: any = false;

    value_properties: any = 0;
    value_relationship: any = 0;
    value_declaration: any = 0;

    type_rol: any;
    ocupation_value: any;
    now_date: any;
    pep_data: any // ALMACENA LOS DATOS PEP
    parse_amount: any;
    show_guide: boolean = false;
    cur_usr: any;

    CURRENCY: any = [{ NCODIGINT: "", SDESCRIPT: "" }];
    TIME: any = [];
    APORT: any;
    NATIONALITY: any;
    FONDO: any;

    //ACTUALIZAR REGISTRO
    nregister_contractor = 0;
    nregister_insured = 0;
    nregister_parentesco = 0;
    nregister_nnatusa = 0;
    nregister_nconpargc = 0;
    nregister_nofistri = 0;
    nregister_noccupation = 0;

    list_data_contractor_department: any = [];
    list_data_contractor_province: any = [];
    list_data_contractor_district: any = [];

    list_data_insured_department: any = [];
    list_data_insured_province: any = [];
    list_data_insured_district: any = [];
    list_civil_state_contractor: any = [];
    list_civil_state_insured: any = [];
    filesList: any = [];


    list_nationalities_contractor: any = [];
    list_nationalities_insured: any = [];

    list_occupation_contractor: any = [];


    list_gender_contractor: any = [];
    list_benefeciarys: any = [];
    list_document_type_contractor: any = [];

    origin_fund_saving_percent: any = 0; // Origen de fondo ahoro
    origin_fund_spp_percent: any = 0; // Origen de fondo sistema privadode pensiones

    chekedsumamaxima: boolean = false;
    current_quotation_selected: any;

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
        occupation_status: 0
    }

    data_quotation_complementary: any = {
        P_NID_PROSPECT: 0,
        P_NOCCUPATION: 0,
        P_NNATUSA: 3,
        P_NCONPARGC: 3,
        P_NOFISTRI: 3,
        P_USER: 0
    }

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
        civil_status_disabled: true,
        nationality_disabled: true,
        department_disabled: true,
        province_disabled: true,
        district_disabled: true,
        phone_disabled: true,
        email_disabled: true,
        address_disabled: true,
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
        relation_disabled: true
    };

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

    exist_origin_detail_spp: boolean = false;
    exist_origin_detail_saving_financial_institution: boolean = false;
    comment: any = "";

    constructor(private router: Router,
        private readonly activatedRoute: ActivatedRoute,
        public addressService: AddressService,
        public clientInformationService: ClientInformationService,
        public quotationService: QuotationService,
        private acc_personales_service: AccPersonalesService,
        private policyemit: PolicyemitService,
        private vidaInversionService: VidaInversionService,
        private parameterSettingsService: ParameterSettingsService) { }

    async ngOnInit() {

        this.quotation_id = parseInt(this.activatedRoute.snapshot.params["cotizacion"]);
        this.prospect_id = parseInt(this.activatedRoute.snapshot.params["prospecto"]);
        this.view_mode = this.activatedRoute.snapshot.params["mode"];

        if (this.view_mode == "view") {
            this.lblMode = "VISUALIZAR";
        }
        else if (this.view_mode == "emit") {
            this.lblMode = "EMISIÓN";
        }


        this.isLoading = true;

        this.profile_id = await this.getProfileProduct();

        this.readFile();

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
                                await this.invokeServiceExperia(1);
                                // await this.getWorldCheck(1);
                                // await this.getIdecon(1);
                                await this.consultProspect(1);
                            }
                        }
                    }
                }
                else if (res.P_NCODE === "2" || res.P_NCODE === "1" || res.P_NCODE === "3") {
                    this.isLoading = false;
                    Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
                }
            }, error => {
                this.isLoading = false;
                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
            }
            )

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
            }
            else {

                this.parse_amount = CommonMethods.formatNUMBER(res.P_CONTRIBUTION);
                this.quotation.contribution = this.parse_amount;

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
                        type_document: { Id: element.niddoc_type_beneficiary },
                        siddoc: element.siddoc_beneficiary,
                        desc_type_doc: element.sdesc_doc,
                        srelation_name: element.sdesc_srelation,
                        percentage_participation: element.percen_participation,
                        nationality: { NNATIONALITY: element.nnationality },
                        desc_nationality: element.sdesc_nationality,
                        sfirstname: element.sfirstname,
                        slastname: element.slastname,
                        last_name2: element.slastname2,
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
                if (response.P_NCUSPP != 0 && response.P_NPRIVATE_PENSION_SYSTEM != 0) {
                    this.exist_origin_detail_spp = true;
                }

                if (response.P_NSAVING_FINANCIAL_INSTITUTION1 || response.P_NSAVING_FINANCIAL_INSTITUTION2 || response.P_NSAVING_FINANCIAL_INSTITUTION3 || response.P_NSAVING_FINANCIAL_INSTITUTION4) {
                    this.exist_origin_detail_saving_financial_institution = true;
                }
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

                    this.origin_fund_saving_percent = sum_origin_detail;
                    this.origin_fund_spp_percent = (100 - Number.parseFloat(this.origin_fund_saving_percent)).toFixed(2);
                }
            }
        });

        this.isLoading = false;
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

    changeStyleCredit(input_name = "") {

        let format_amount = parseInt(this.quotation.contribution.replace(/,/g, ''));

        this.parse_amount = CommonMethods.formatNUMBER(format_amount);
        this.quotation.contribution = this.parse_amount;

        if (this.quotation.contribution.toUpperCase() == "NAN") {
            this.quotation.contribution = '';
        }
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

    async getWorldCheck(client_type: number) {
        let datosWorldCheck = {};

        let consultWorldCheck = {
            P_SCLIENT: null,
            P_NOTHERLIST: 0,
            P_NISPEP: 0,
            P_SUPDCLIENT: '0'
        };

        let sclientWorldCheck = { P_SCLIENT: this.data_contractor.sclient }

        if (client_type == 1) {
            datosWorldCheck = {
                name: this.data_contractor.names + ' ' + this.data_contractor.last_name + ' ' + this.data_contractor.last_name2,
                idDocNumber: this.data_contractor.document_number,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaWorldCheck(sclientWorldCheck).toPromise().then(
                async (res) => {
                    consultWorldCheck = {
                        P_SCLIENT: res.P_SCLIENT,
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }

                    if (consultWorldCheck.P_SCLIENT == null || consultWorldCheck.P_SCLIENT == "") {
                        // await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
                        //     async (res) => {
                        //         consultWorldCheck = {
                        //             P_SCLIENT: this.data_contractor.sclient,
                        //             P_NOTHERLIST: res.isOtherList ? 1 : 0,
                        //             P_NISPEP: res.isPep ? 1 : 0,
                        //             P_SUPDCLIENT: '0'
                        //         }

                        //         this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                        //         this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

                        //         await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
                        //     }
                        // );
                    } else {
                        if (consultWorldCheck.P_SUPDCLIENT == "1") {
                            // await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
                            //     async (res) => {
                            //         consultWorldCheck = {
                            //             P_SCLIENT: this.data_contractor.sclient,
                            //             P_NOTHERLIST: res.isOtherList ? 1 : 0,
                            //             P_NISPEP: res.isPep ? 1 : 0,
                            //             P_SUPDCLIENT: '1'
                            //         }

                            //         this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            //         this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

                            //         await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
                            //     }
                            // );
                        } else {
                            this.world_check_contractor.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.world_check_contractor.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';
                        }
                    }
                }
            );
        } else {
            datosWorldCheck = {
                name: this.data_insured.names + ' ' + this.data_insured.last_name + ' ' + this.data_insured.last_name2,
                idDocNumber: this.data_insured.document_number,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaWorldCheck(sclientWorldCheck).toPromise().then(
                async (res) => {
                    consultWorldCheck = {
                        P_SCLIENT: res.P_SCLIENT,
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }

                    if (consultWorldCheck.P_SCLIENT == null || consultWorldCheck.P_SCLIENT == "") {
                        // await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
                        //     async (res) => {
                        //         consultWorldCheck = {
                        //             P_SCLIENT: this.data_insured.sclient,
                        //             P_NOTHERLIST: res.isOtherList ? 1 : 0,
                        //             P_NISPEP: res.isPep ? 1 : 0,
                        //             P_SUPDCLIENT: '0'
                        //         }

                        //         this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                        //         this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

                        //         await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
                        //         this.isLoading = false;
                        //     }
                        // );
                    } else {
                        if (consultWorldCheck.P_SUPDCLIENT == "1") {
                            // await this.vidaInversionService.getWorldCheck(datosWorldCheck).toPromise().then(
                            //     async (res) => {
                            //         consultWorldCheck = {
                            //             P_SCLIENT: this.data_insured.sclient,
                            //             P_NOTHERLIST: res.isOtherList ? 1 : 0,
                            //             P_NISPEP: res.isPep ? 1 : 0,
                            //             P_SUPDCLIENT: '1'
                            //         }

                            //         this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            //         this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';

                            //         await this.vidaInversionService.InsUpdWorldCheck(consultWorldCheck).toPromise().then();
                            //     }
                            // );
                        } else {
                            this.world_check_insured.otherList = consultWorldCheck.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.world_check_insured.pep = consultWorldCheck.P_NISPEP == 1 ? 'SÍ' : 'NO';
                        }
                    }
                }
            );
        }
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

    async consultProspect(search_type) {
        let params_cons = {
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_NTYPE_CLIENT: search_type
        };
        console.log(params_cons)
        await this.vidaInversionService.consultProspect(params_cons).toPromise().then(
            async res => {
                this.check_input_value = res.P_NID_ASCON;
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
                    console.log(params_360);

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

    readFile = () => {
        let obj = {
            P_NID_COTIZACION: this.quotation_id
        };
        this.vidaInversionService.ReadDocumentsVIGP(obj).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    // this.filesList = res.P_DOCUMENTS.filter(x => x.P_DESCRI != 'otros');
                    this.filesList = res.P_DOCUMENTS.filter(x => x.P_FLAG == 7 || x.P_FLAG == 4 || x.P_FLAG == 2);
                }
            },
            error => {
                Swal.fire('Información', "Ha ocurrido un error al obtener los archivos.", 'error');
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

    ReturnQuotation() {

        if (this.comment == "") {
            Swal.fire('Información', 'Debe llenar el campo Comentario para completar la observación.', 'error');
        }
        else {

            const changeStatus = {
                P_NID_COTIZACION: this.quotation_id,
                P_NID_STATE: 13, // Estado de Derivado a Soporte Comercial
                P_SCOMMENT: this.comment,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            };
            this.quotationService.InsCommentsCotiVIGP(changeStatus).toPromise().then((res) => {
                if (res.P_NCODE == 1) {
                    Swal.fire('Información', res.P_MESSAGE, 'error');
                } else {
                    Swal.fire('Información', 'La cotización fue derivada.', 'success');
                    this.router.navigate(['extranet/vida-inversion/consulta-cotizacion-definitiva']);
                }
            });

        }

    }

    GoToQuotationDefinitiveList() {
        this.router.navigate(['extranet/vida-inversion/consulta-cotizacion-definitiva']);
    }

    EmitPolicy() {
        // TODO ==> Agregar validacion de que no supere la fecha los 7 dias de vVigencia la cotizacion preliminar, SI lo paso no nos debe permitir realizar la Emisión.
        let myFormData: FormData = new FormData();
        // let  params = [{}];
        let params = [{
            P_NID_COTIZACION: this.quotation_id,
            P_NID_PROC: this.quotation.nid_proc,
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: 10,
            P_SCOLTIMRE: 6,
            // P_DSTARTDATE: CommonMethods.formatDate(this.cotizacion.poliza.fechaInicioPoliza),
            P_DSTARTDATE: "07/05/2024",
            // P_DEXPIRDAT: CommonMethods.formatDate(this.cotizacion.poliza.fechaFinPoliza),
            P_DEXPIRDAT: "07/04/2026",
            P_NPAYFREQ: 5, // Mensual temporal, consulta cuanto seria
            P_FACT_MES_VENCIDO: 0,
            P_SFLAG_FAC_ANT: 1,
            P_NPREM_NETA: 0,
            P_SRUTA: '',
            P_IGV: 0,
            P_NPREM_BRU: 0,
            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_SCOMMENT: '',
            P_NAMO_AFEC: 100, // Prima Neta (sin igv)
            P_NIVA: 0,  // Impuestos (igv)
            P_NAMOUNT: 100, // Prima Bruta (con igv)
            P_NDE: 10,
            // P_DSTARTDATE_ASE: CommonMethods.formatDate(this.cotizacion.poliza.fechaMinInicioAsegurado),
            P_DSTARTDATE_ASE: "07/05/2024",
            // P_DEXPIRDAT_ASE: CommonMethods.formatDate(this.cotizacion.poliza.fechaMinInicioAsegurado)
            P_DEXPIRDAT_ASE: "07/05/2024"
        }];

        myFormData.append('objeto', JSON.stringify(params));

        Swal.fire({
            title: 'Confirmación',
            text: '¿Esta seguro de emitir la póliza?',
            icon: 'warning',
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(
            result => {
                if (result.isConfirmed) {
                    this.policyemit.savePolicyEmit(myFormData).subscribe((res: any) => {
                        if (res.P_COD_ERR == 1) {
                            Swal.fire('Información', res.P_MESSAGE, 'error');
                        } else {
                            Swal.fire('Información', "Se ha generado correctamente la emisión póliza N° " + res.P_NPOLICY , 'success');
                        }
                    })
                }
            }
        )

    }
}
