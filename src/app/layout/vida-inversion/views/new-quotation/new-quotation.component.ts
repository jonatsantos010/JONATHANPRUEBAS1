import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaryComponent } from '../../components/add-beneficiary/add-beneficiary.component';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { AddressService } from '../../../broker/services/shared/address.service';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { DataInsured } from '../../models/DataInsured';
import { DataContractor } from '../../models/DataContractor';
import { AccPersonalesService } from '../../../broker/components/quote/acc-personales/acc-personales.service';
import { CommonMethods } from '../../../broker/components/common-methods';
import { QuotationService } from '../../../../layout/broker/services/quotation/quotation.service';
import { StorageService } from '../../../broker/components/quote/acc-personales/core/services/storage.service';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import moment from 'moment';

@Component({
    templateUrl: './new-quotation.component.html',
    styleUrls: ['./new-quotation.component.scss']
})

export class NewQuotationComponent implements OnInit {

    profile_id: any;
    masterChecked: boolean = false;
    CONSTANTS: any = VidaInversionConstants;
    //profile = JSON.parse(localStorage.getItem('currentUser'))['profileId'];

    boolNumberCTR: boolean = false;
    boolNumberASG: boolean = false;
    boolEmailCTR: boolean = false;
    boolEmailASG: boolean = false;
    @Input() check_input_value;
    @Input() check_input_value_beneficiary = 1;

    contractor_province_department: any = false;
    contractor_province_selected: any = false;
    insured_province_department: any = false;
    insured_province_selected: any = false;
    show_guide: boolean = false;
    isLoading: boolean = false;

    current_step: number;
    cur_usr:any;
    list: any;
    type_rol: any;
    now_date: any;
    prospect_id: number;
    format_amount: any;
    parse_amount_contribution: any;
    s_usr: any;
    investment: any = [];

    CODPRODUCTO_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    TIME: any = [];
    CURRENCY: any = [];
    DEPARTMENT: any;
    PROVINCE: any;
    DISTRICT: any;

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

    list_gender_contractor: any = [];
    list_benefeciary: any = [];
    list_document_type_contractor: any = [];
    listadoCotizacionesVigentes: any;
    listadoCotizacionesNoVigentes: any;
    steps_list: any;
    chekedsumamaxima: boolean = false;
    current_quotation_selected: any;
    data_contractor_step1: any;

    //ACTUALIZAR REGISTRO
    nregister_contractor = 0;
    nregister_insured = 0;
    nregister_parentesco = 0;

    // BENEFICIARIOS
    listToShow: any = [];
    currentPage = 1;
    itemsPerPage = 2;
    totalItems = 0;
    maxSize = 10;

    // COTIZACIONES VIGENTES
    listToShowV: any = [];
    currentPageV = 1;
    itemsPerPageV = 4;
    totalItemsV = 0;
    maxSizeV = 10;

    // COTIZACIONES NO VIGENTES
    listToShowNV: any = [];
    currentPageNV = 1;
    itemsPerPageNV = 4;
    totalItemsNV = 0;
    maxSizeNV = 10;
    check_input_value_360: any; //Valor si el Contratante === Asegurado o no que es traido de BD
    inactivityTimer: any;

    new_client_insured = false; // Indica si es cliente Ya se encuentra registrado en el 360 o no

    diaActual = moment(new Date()).toDate();
    //funds_list: any = [];

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
    /* DGC - VIGP PEP - 06/02/2024 - FIN */


    quotation = {
        contribution: "",
        currency: { NCODIGINT: "", SDESCRIPT: "" },
        funds: { NFUNDS: "", SDESCRIPT: "" },
        date_fund: new Date(),
    }
    min_date_fund: any;

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

    constructor(private router: Router,
        private storageService: StorageService,
        public clientInformationService: ClientInformationService,
        public addressService: AddressService,
        private vidaInversionService: VidaInversionService,
        private quotationService: QuotationService,
        private readonly activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private acc_personales_service: AccPersonalesService,
        private parameterSettingsService: ParameterSettingsService
    ) { }

    async ngOnInit() {

        this.isLoading = true;
        
        this.diaActual = new Date(this.diaActual.getFullYear(), this.diaActual.getMonth(), this.diaActual.getDate());
        this.getQuotationFunds();
        this.prospect_id = parseInt(this.activatedRoute.snapshot.params["prospecto"]);
        this.cur_usr = JSON.parse(localStorage.getItem('currentUser'));

        this.type_rol = '0';

        this.check_input_value = 1;
        this.now_date = new Date();

        this.profile_id = await this.getProfileProduct();

        // FOR Contractor
        // Se les esta agregando un await para poder Controlarlo
        await this.clientInformationService.getDocumentTypeList(this.CODPRODUCTO_PROFILE).toPromise().then((result) => {
            this.list_document_type_contractor = result;
        }).catch((err) => {
        });

        await this.clientInformationService.getGenderList().toPromise().then(async res => {
            this.list_gender_contractor = res
        })

        await this.clientInformationService.getCivilStatusList().toPromise().then(async (result) => {
            this.list_civil_state_contractor = result;
        }).catch((err) => {
        });

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

        await this.acc_personales_service.getCurrency({ nproduct: this.CONSTANTS.COD_PRODUCTO, nbranch: 71 }).toPromise().then((result) => {
            this.CURRENCY = result;
        }).catch((err) => {
        });

        // await this.vidaInversionService.investmentFunds().toPromise().then((result) => {
        //     this.investment = result;
        // }).catch((err) => {
        // });


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
                if (res.P_NCODE === "0") {
                    if (res.EListClient[0].P_SCLIENT == null) {
                    } else {

                        if (res.EListClient.length === 1) {
                            if (res.EListClient[0].P_SIDDOC != null) {
                                await this.cargarDatosContractor(res, 1);
                                await this.getIdecon(1);
                                await this.consultProspect(1);
                                this.data_contractor_360 = { ...this.data_contractor }; // Almacenando la Info de Inicio del 360 para el Contratante en una Variable
                            }
                        }
                    }
                }
                else if (res.P_NCODE === "2" || res.P_NCODE === "1" || res.P_NCODE === "3") {
                    this.clearData(1);
                    this.isLoading = false;
                    Swal.fire('Información', res.P_SMESSAGE, 'error');
                }
            }, error => {
                this.isLoading = false;
                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición', 'error');
            }
            )
        })

        // BENEFICIARIOS
        this.list_benefeciary = [];

        this.currentPage = 1;
        this.totalItems = this.list_benefeciary.length;
        this.listToShow = this.list_benefeciary.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );

        this.steps_list = [
            {
                step_index: 1,
                tittle: "Datos del Contratante/Asegurado"
            },
            {
                step_index: 2,
                tittle: "Nueva Cotización"
            }
        ]


        this.quotation.date_fund = new Date();
        this.min_date_fund = new Date();
        this.min_date_fund.setDate(this.min_date_fund.getDate() - 30);

        this.current_step = 1;

        console.log(this.data_contractor.sclient);
        
        this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
            async res => {
                this.listadoCotizacionesVigentes = res;

                this.listadoCotizacionesVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                    element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                });

                this.currentPageV = 1;
                this.totalItemsV = this.listadoCotizacionesVigentes.length;
                this.listToShowV = this.listadoCotizacionesVigentes.slice(
                    (this.currentPageV - 1) * this.itemsPerPageV,
                    this.currentPageV * this.itemsPerPageV
                );
            }
        )

        this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
            async res => {
                this.listadoCotizacionesNoVigentes = res;

                this.listadoCotizacionesNoVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                });

                this.currentPageNV = 1;
                this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                    (this.currentPageNV - 1) * this.itemsPerPageNV,
                    this.currentPageNV * this.itemsPerPageNV
                );
            }
        )
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
        this.listToShow = this.list_benefeciary.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
    }

    pageChangedV(currentPageV) {
        this.currentPageV = currentPageV;
        this.listToShowV = this.listadoCotizacionesVigentes.slice(
            (this.currentPageV - 1) * this.itemsPerPageV,
            this.currentPageV * this.itemsPerPageV
        );
    }

    pageChangedNV(currentPageNV) {
        this.currentPageNV = currentPageNV;
        this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
            (this.currentPageNV - 1) * this.itemsPerPageNV,
            this.currentPageNV * this.itemsPerPageNV
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
            this.data_contractor.province = { Id: 0 };
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
            this.data_insured.province = { Id: 0 };
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

    changeValueBenefeciary(value) {
        this.check_input_value_beneficiary = value;
    }

    changeStep(next_step) {
    
        if (next_step == 2){
            //validaciones de campos obligatorios CONTRATANTE arjg 
            if (this.data_contractor.birthday_date==''){
                console.log("Fecha Nacimiento Nula");
                Swal.fire('Información Contratante', "Fecha Nacimiento Nula", 'error');
                return;
            }
            if (this.data_contractor.names==null){
                console.log("Nombres Nulo");
                Swal.fire('Información Contratante', "Nombres Nulo", 'error');
                return;
            }
            if (this.data_contractor.last_name==null){
                console.log("Apellido Materno Nulo");
                Swal.fire('Información Contratante', "Apellido Materno Nulo", 'error');
                return;
            }

            if (this.data_contractor.last_name2==null){
                console.log("Apellido Paterno Nulo");
                Swal.fire('Información Contratante', "Apellido Paterno Nulo", 'error');
                return;
            }

            if (this.data_contractor.gender.codigo ==''){
                console.log("Sexo Nulo");
                Swal.fire('Información Contratante', "Sexo Nulo", 'error');
                return;
            }
            //validaciones de campos obligatorios ASEGURADO arjg 
            if (this.check_input_value == 0){
                if (this.data_insured.birthday_date==''){
                    console.log("Fecha Nacimiento Nula");
                    Swal.fire('Información Asegurado', "Fecha Nacimiento Nula", 'error');
                    return;
                }
                if (this.data_insured.names==null){
                    console.log("Nombres Nulo");
                    Swal.fire('Información Asegurado', "Nombres Nulo", 'error');
                    return;
                }
                if (this.data_insured.last_name==null){
                    console.log("Apellido Materno Nulo");
                    Swal.fire('Información Asegurado', "Apellido Materno Nulo", 'error');
                    return;
                }

                if (this.data_insured.last_name2==null){
                    console.log("Apellido Paterno Nulo");
                    Swal.fire('Información Asegurado', "Apellido Paterno Nulo", 'error');
                    return;
                }

                if (this.data_insured.gender.codigo ==''){
                    console.log("Sexo Nulo");
                    Swal.fire('Información Asegurado', "Sexo Nulo", 'error');
                    return;
                }
            }
        }


        if (next_step == 2 && this.check_input_value == 1) {
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
                        this.current_step = next_step;
                    } else {
                        this.check_input_value = 0;
                        this.show_guide = true;
                        setTimeout(() => {
                            this.show_guide = false;
                        }, 5000);
                    }
                }
            )
        } else {
            this.current_step = next_step;
        }
    }

    OpenModalBeneficiary(type, item) {

        let modalRef: NgbModalRef;
        modalRef = this.modalService.open(AddBeneficiaryComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.list_benefeciary = this.list_benefeciary;
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
                        srelation_name: res.relation.GLS_ELEMENTO, // Aqui va ir el nombre del Parentesco
                        relation: { NCODIGO: res.relation.COD_ELEMENTO },
                        percentage_participation: res.assignment,
                        type_doc: res.type_document.Id,
                        desc_type_doc: res.type_document.Id == 2 ? 'DNI' : "CE",
                    };

                    if (type == 'edit') {
                        const new_list_benefeciary = this.list_benefeciary.map((element) => {
                            if ((element.type_document.Id == new_item.type_document.Id) && (element.document_number == new_item.document_number)) { return new_item; }
                            else { return element; }
                        });

                        this.list_benefeciary = new_list_benefeciary;
                    }
                    else {
                        // let split_date = new_item.birthday_date.split('/');
                        // let format_birthday = `${split_date[1]}/${split_date[0]}/${split_date[2]}`; // parse to dd/mm/yyyy
                        // new_item.birthday_date = format_birthday;
                        this.list_benefeciary.push(new_item);// Aqui se esta insertando
                    }

                    this.currentPage = 1;
                    this.totalItems = this.list_benefeciary.length;
                    this.listToShow = this.list_benefeciary.slice(
                        (this.currentPage - 1) * this.itemsPerPage,
                        this.currentPage * this.itemsPerPage
                    );
                }
            }
        )
    }

    validateCheckInsured() {
        if ((this.check_input_value == 3) || (this.check_input_value == 1)) {
            const customswal = Swal.mixin({
                confirmButtonColor: "553d81",
                focusConfirm: false,
            })
            customswal.fire('Información', "Para esta sección, debe indicar que el asegurado NO es la misma persona que contrata el seguro.", 'warning');
        }
    }

    goToDefinitiveQuote() {
        if (this.current_quotation_selected) {
            this.router.navigate([`extranet/vida-inversion/cotizacion-definitiva/${this.current_quotation_selected.QuotationNumber}/${this.current_quotation_selected.ContractorSclient}/${this.current_quotation_selected.IdProspect}`]);
        } else {
            Swal.fire({
                title: 'Información',
                text: 'Debe seleccionar una cotización.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: true,
            })
        }
    }

    SendQuotationSing(QuotationNumber) {
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
                                Swal.fire('Mensaje', res.P_MESSAGE, 'error');
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

    SendQuotationList() {
        let cap = this.listadoCotizacionesVigentes.filter(x => x.checked);
        if (cap.length > 0) {
            Swal.fire('Confirmación', '¿Está seguro de que desea enviar la cotización?', 'warning').then(
                result => {
                    if (result.value) {
                        let params = { P_LIST: [] }
                        for (let i = 0; i < this.listadoCotizacionesVigentes.length; i++) {
                            if (this.listadoCotizacionesVigentes[i].checked) {
                                let item = {
                                    P_NBRANCH: this.CONSTANTS.RAMO,
                                    P_NID_COTIZACION: this.listadoCotizacionesVigentes[i].QuotationNumber,
                                    P_NIDHEADERPROC: null,
                                }
                                params.P_LIST.push(item);
                            }
                        }
                        this.vidaInversionService.AddEmailVIGPList(params).subscribe(
                            res => {
                                if (res.Result.P_ERROR == 0) {
                                    Swal.fire('Mensaje', 'Se envió correctamente la cotización al correo correo@gmail.com?', 'success');
                                } else {
                                    Swal.fire('Mensaje', res.P_MESSAGE, 'error');
                                }
                            },
                            err => {
                                Swal.fire('Mensaje', 'Ha ocurrido un error al enviar la cotización.', 'error');
                            }
                        )
                    }
                }
            )
        } else {
            Swal.fire('Mensaje', 'Debe seleccionar al menos una cotización.', 'warning');
        }
    }

    createFormDataQuotationPreliminary() {
        const params = {
            NumeroPoliza: 0,
            NumeroCotizacion: 0,
            P_SCLIENT: this.data_contractor.sclient,
            // P_SCLIENT_PROVIDER: this.cotizacion.endosatario[0].cod_proveedor,
            P_NCURRENCY: this.quotation.currency.NCODIGINT,
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_SAPLICACION: 'PD',
            P_DFEC_OTORGAMIENTO: '01/12/2023',
            P_DSTARTDATE: '01/12/2023',
            P_DEXPIRDAT: '01/11/2025',
            P_DSTARTDATE_ASE: '01/12/2023',
            P_DEXPIRDAT_ASE: '01/11/2025',
            P_NIDCLIENTLOCATION: 1,
            // P_SCOMMENT: "",
            P_SRUTA: '',
            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_NACT_MINA: 0,
            P_NTIP_RENOV: 6,
            P_NPAYFREQ: 5,
            P_SCOD_ACTIVITY_TEC: 1,
            P_SCOD_CIUU: 1,
            P_NTIP_NCOMISSION: 0,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_NEPS: this.storageService.eps.STYPE,
            P_QUOTATIONNUMBER_EPS: "",
            P_NPENDIENTE: '0',
            P_NCOMISION_SAL_PR: 0,
            retOP: 2,
            FlagCambioFecha: 1,
            TrxCode: "EM",
            // planId: 
            // P_NMODULEC_TARIFARIO: this.cotizacion.poliza.tipoPlan.ID_PLAN,
            // P_SDESCRIPT_TARIFARIO: this.cotizacion.poliza.tipoPlan.TIPO_PLAN,
            P_NPOLIZA_MATRIZ: 0,
            P_NTRABAJO_RIESGO: 0,
            P_NFACTURA_ANTICIPADA: 1,
            P_NTYPE_PROFILE: this.CONSTANTS.COD_PRODUCTO,
            P_NTYPE_PRODUCT: "1",
            P_NTYPE_MODALITY: 0,
            P_NTIPO_FACTURACION: 1,
            P_ESTADO: 2,
            // PolizaEditAsegurados: this.cotizacion.PolizaEditAsegurados, // 1 si se valido trama
            P_STRAN: "EM",
            IsDeclare: false,

            // nuevos tarifario
            // P_NDERIVA_TECNICA: 0,
            // P_NSCOPE: 1,
            // P_NTEMPORALITY: 0,
            // P_NTYPE_LOCATION: 0,
            P_NLOCATION: 14,
            // P_NNUM_CUOTA: this.cotizacion.poliza.nroCuotas,
            // nuevo tipo de renovacion
            P_STIMEREN: "3",
            QuotationDet: [
                {
                    P_NBRANCH: this.CONSTANTS.RAMO,
                    P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
                    P_NTOTAL_TRABAJADORES: 1,
                    // P_NMONTO_PLANILLA: this.cotizacion.trama.MONT_PLANILLA,
                    // P_NTASA_CALCULADA: this.cotizacion.trama.TASA,
                    // P_NTASA_PROP: 0, 
                    // P_NPREMIUM_MIN: this.cotizacion.trama.PRIMA,
                    // P_NPREMIUM_MIN_PR: this.cotizacion.poliza.primaPropuesta,
                    P_NPREMIUM_END: '0',
                    P_NRATE: 0,
                    P_NDISCOUNT: 0,
                    P_NACTIVITYVARIATION: 0,
                    P_FLAG: '0',
                    // P_NAMO_AFEC: 0,
                    // P_NIVA: 0,
                    // P_NAMOUNT: 0,
                    // P_NDE: 0,
                },
            ],
            QuotationCom: [ // Se enviará como Comercializador el Canal que esta Asociado el Usuario.
                {
                    P_NIDTYPECHANNEL: JSON.parse(localStorage.getItem('currentUser'))['tipoCanal'],
                    P_NINTERMED: JSON.parse(localStorage.getItem('currentUser'))['canal'],
                    P_SCLIENT_COMER: JSON.parse(localStorage.getItem('currentUser'))['sclient'],
                    P_NCOMISION_SAL_PR: 0,
                    P_NCOMISION_PEN: 0,
                    P_NCOMISION_PEN_PR: 0,
                    P_NPRINCIPAL: 0,
                    P_SEDIT: "I"
                }
            ],
            QuotationCli: [],
            // Vida Inversion
            // P_NSAVING_TIME: 7, // ESTE VALOR SE VA ENVIAR DESDE EL TARIFARIO
            P_CONTRIBUTION: this.format_amount,
            P_NFUNDS: this.quotation.funds.NFUNDS,
            P_DDATE_FUND: this.quotation.date_fund.toLocaleDateString('es-PE'), //CAMBIAR FECHA ESTE VALOR NO ES EL CORRECTO
            P_NID_PROSPECT: this.prospect_id,
            List_beneficiary: [],
            is_benef_direct: this.check_input_value_beneficiary
        };

        const myFormData: FormData = new FormData();

        if (this.check_input_value_beneficiary == 0) {
            if (this.list_benefeciary.length > 0) {
                console.log(this.list_benefeciary);
                for (let i = 0; i < this.list_benefeciary.length; i++) {

                    let item = {
                        // niiddoc_type: this.list_benefeciary[i].type_document.Id,
                        niiddoc_type: this.list_benefeciary[i].type_document.Name,
                        niddoc_type_beneficiary: this.list_benefeciary[i].type_document.Name,
                        siddoc: this.list_benefeciary[i].siddoc,
                        siddoc_beneficiary: this.list_benefeciary[i].siddoc,
                        sfirstname: this.list_benefeciary[i].sfirstname,
                        slastname: this.list_benefeciary[i].slastname,
                        slastname2: this.list_benefeciary[i].last_name2,
                        nnationality: this.list_benefeciary[i].nationality.SDESCRIPT,
                        percen_participation: this.list_benefeciary[i].percentage_participation,
                        dbirthdat: this.list_benefeciary[i].birthday_date.toLocaleDateString('es-ES'),
                        nusercode: JSON.parse(localStorage.getItem('currentUser'))['id'],
                        srole: 'Beneficiario',
                        se_mail: this.list_benefeciary[i].email,
                        sphone_type: "Celular",
                        sphone: this.list_benefeciary[i].phone,
                        srelation: this.list_benefeciary[i].srelation_name,
                        ssexclien: this.list_benefeciary[i].gender.SSEXCLIEN,
                    };
                    params.List_beneficiary.push(item);
                }
            } else {
                params.List_beneficiary = []
            }
        }
        myFormData.append('objeto', JSON.stringify(params));
        return myFormData;
    }

    getDataForQuotationPreliminary() {

        const params = {
            flagCalcular: this.CONSTANTS.PERFIL.TECNICA == JSON.parse(localStorage.getItem('currentUser'))['profileId'] ? 1 : 0,
            codUsuario: JSON.parse(localStorage.getItem('currentUser'))['id'],
            desUsuario: JSON.parse(localStorage.getItem('currentUser'))['username'],
            // codCanal: this.cotizacion.brokers[0].COD_CANAL,
            contratante: this.data_contractor.sclient,
            codRamo: this.CONSTANTS.RAMO,
            codProducto: this.CONSTANTS.COD_PRODUCTO,
            codTipoPerfil: this.CONSTANTS.COD_PRODUCTO,
            codProceso: '',
            PolizaMatriz: 0,
            type_mov: "1", // Emision
            nroCotizacion: 0,
            MontoPlanilla: 0,
            CantidadTrabajadores: 1,
            flagSubirTrama: 1, //Valor para saber si se va enviar Trama o no al Back
            premium: 0,
            datosContratante: {
                codContratante: this.data_contractor.sclient, // Sclient
                desContratante: `${this.data_contractor.names} ${this.data_contractor.last_name2} ${this.data_contractor.last_name2}`, // Legal name
                codDocumento: this.data_contractor.type_document.Id, // Tipo de documento
                documento: this.data_contractor.document_number,
                nombre: this.data_contractor.names, // En caso de ruc es razon social
                apePaterno: this.data_contractor.last_name, // solo si es persona natural
                apeMaterno: this.data_contractor.last_name2, // solo si es persona natural
                fechaNacimiento: "05/12/1972", // en caso de ruc es fecha de creacion sino fecha actual
                // fechaNacimiento: this.data_contractor.birthday_date, // en caso de ruc es fecha de creacion sino fecha actual
                nacionalidad: this.data_contractor.nationality.NNATIONALITY,
                email: this.data_contractor.email,
                sexo: this.data_contractor.gender.SSEXCLIEN,
                desTelefono: "Celular",
                telefono: this.data_contractor.phone,
                rol: "1",
                ascon: this.check_input_value
            },
            datosAsegurado: this.check_input_value == 0 ? { // REVISAR DIEGO, SI EL CONTRATANTE ES IGUAL QUE EL ASEGURO, EL CONTRATANTE ES EL ASEGURADO POR ENDE SE LE DEBE ENVIAR SU MISMA DATA
                codContratante: this.data_insured.sclient,
                desContratante: `${this.data_insured.names} ${this.data_insured.last_name2} ${this.data_insured.last_name2}`,
                codDocumento: this.data_insured.type_document.Id,
                documento: this.data_insured.document_number,
                nombre: this.data_insured.names,
                apePaterno: this.data_insured.last_name,
                apeMaterno: this.data_insured.last_name2,
                // fechaNacimiento: this.data_insured.birthday_date,
                fechaNacimiento: "05/12/1972",
                nacionalidad: this.data_insured.nationality.NNATIONALITY,
                email: this.data_insured.email,
                sexo: this.data_insured.gender.SSEXCLIEN,
                desTelefono: "Celular",
                telefono: this.data_insured.phone,
                rol: "2"
            } : {
                codContratante: this.data_contractor.sclient,
                desContratante: `${this.data_contractor.names} ${this.data_contractor.last_name2} ${this.data_contractor.last_name2}`,
                codDocumento: this.data_contractor.type_document.Id,
                documento: this.data_contractor.document_number,
                nombre: this.data_contractor.names,
                apePaterno: this.data_contractor.last_name,
                apeMaterno: this.data_contractor.last_name2,
                // fechaNacimiento: this.data_contractor.birthday_date,
                fechaNacimiento: "05/12/1972",
                nacionalidad: this.data_contractor.nationality.NNATIONALITY,
                email: this.data_contractor.email,
                sexo: this.data_contractor.gender.SSEXCLIEN,
                desTelefono: "Celular",
                telefono: this.data_contractor.phone,
                rol: "1"
            },
            // } : null,
            datosPoliza: {
                // segmentoId: this.cotizacion.poliza.tipoPlan.ID_PLAN,
                tipoDocumento: this.data_contractor.type_document.Id,
                numDocumento: this.data_contractor.document_number,
                codTipoNegocio: 1, // Tipo de Poliza 1= Individual,
                codTipoProducto: this.CONSTANTS.COD_PRODUCTO,
                codTipoPerfil: this.CONSTANTS.COD_PRODUCTO,
                // codTipoPlan: this.cotizacion.poliza.tipoPlan.ID_PLAN,//this.CONSTANTS.PLANMAESTRO,
                codTipoRenovacion: 6, // POR DEFINIR EL TIPO DE RENOVACION,
                codTipoFrecuenciaPago: 5, // POR DEFINIR CODIGO DE FRECUENCIA DE PAGO POR EL MOMENTO MENSUAL,
                InicioVigPoliza: '01/12/2023',
                FinVigPoliza: '30/11/2025',
                InicioVigAsegurado: '01/12/2023',
                FinVigAsegurado: '30/11/2025',
                CodActividadRealizar: "1",
                CodCiiu: "1",
                codTipoFacturacion: 1,
                codMon: this.quotation.currency.NCODIGINT,
                // desTipoPlan: this.cotizacion.poliza.tipoPlan.TIPO_PLAN,
                typeTransac: this.CONSTANTS.TRANSACTION_CODE.EMISION,
                branch: this.CONSTANTS.RAMO,
                nid_cotizacion: 0,
                trxCode: "EM", // Emision
                temporalidad: 0,
                codAlcance: 0,
                tipoUbigeo: 0,
                codUbigeo: !this.data_contractor.department.Id ? 14 : this.data_contractor.department.Id,
                polizaMatriz: 0,
                fechaOtorgamiento: "01/12/2023",
                tipoRenovacionPoliza: "3", // nuevo tipo de renovacion
            },
        };
        return params;
    }


    cleanQuoteData() {
        this.quotation.contribution = '';
        this.quotation.date_fund = new Date();
        this.list_benefeciary = [];
        this.currentPage = 1;
        this.totalItems = this.list_benefeciary.length;
        this.listToShow = this.list_benefeciary.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
        this.changeValueBenefeciary(1);
    }

    async CreateQuotePreliminary() {

        this.isLoading = true;
        if (this.quotation.contribution == null || this.quotation.contribution == "") {
            this.isLoading = false;
            Swal.fire('Información', 'Debe ingresar el aporte.', 'warning');
            return;
        }

        if (this.format_amount < 10000) {
            this.isLoading = false;
            Swal.fire('Información', 'El aporte debe ser mayor o igual a $ 10,000.', 'warning');
            return;
        }

        const sum_percentage_participation = this.list_benefeciary.reduce((acc, current) => acc + parseInt(current?.percentage_participation), 0);

        if (sum_percentage_participation > 100) {
            this.isLoading = false;
            Swal.fire('Información', 'La suma de la asignación no puede superar el 100%.', 'warning');
            return;
        }

        /* DGC - 15/01/2023 - INICIO */
        this.quotation.date_fund = new Date(this.quotation.date_fund.getFullYear(), this.quotation.date_fund.getMonth(), this.quotation.date_fund.getDate());
        /* DGC - 15/01/2023 - FIN */

        const myFormData = this.createFormDataQuotationPreliminary();
        const objCotDes = this.getDataForQuotationPreliminary();

        myFormData.append('objDes', JSON.stringify(objCotDes));
        //inicializar variables para la actualizacion de registro de contratante y asegurado
        this.nregister_contractor = 0;
        this.nregister_insured = 0;
        //validacion 360
        const must_update = this.validateForUpdateClient();
        if (must_update == true) {
            this.updateDataClient360();
        }
        else {
            await this.quotationService.insertQuotation(myFormData).toPromise().then(
                async res => {
                    if (res.P_COD_ERR == 0) {
                        this.isLoading = false;
                        // Si no hay ningun error lo que se hara el mandar el Loading y traer nuevamente las Cotizacion Vigentes
                        Swal.fire({
                            text: `La cotización ${res.P_NID_COTIZACION} se generó correctamente.`,
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showCloseButton: false
                        }).then(result => {

                            this.isLoading = true;

                            this.cleanQuoteData();

                            /* DGC - 30/05/2024 - INICIO */
                            let funds = {
                                P_NFUNDS: this.investment[0].NFUNDS,
                                P_NPARTICIP: this.investment[0].NPARTICIP,
                                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                                P_SREADDRESS: '',
                                P_NQUAN_AVAIL: '',
                                P_SACTIVFOUND: '',
                                P_NORIGIN: this.investment[0].NORIGIN,
                                P_SAPV: '',
                                P_NINTPROY: this.investment[0].NINTPROY,
                                P_NINTPROYVAR: '',
                                P_NID_COTIZACION: res.P_NID_COTIZACION,
                            }
                            this.insQuotationFunds(funds);
                            /* DGC - 30/05/2024 - FIN */

                            this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
                                async res => {
                                    this.listadoCotizacionesVigentes = res;

                                    this.listadoCotizacionesVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                        element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                                    });

                                    this.currentPageV = 1;
                                    this.totalItemsV = this.listadoCotizacionesVigentes.length;
                                    this.listToShowV = this.listadoCotizacionesVigentes.slice(
                                        (this.currentPageV - 1) * this.itemsPerPageV,
                                        this.currentPageV * this.itemsPerPageV
                                    );
                                }
                            )

                            this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
                                async res => {
                                    this.listadoCotizacionesNoVigentes = res;

                                    this.listadoCotizacionesNoVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                    });


                                    this.currentPageNV = 1;
                                    this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                                    this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                                        (this.currentPageNV - 1) * this.itemsPerPageNV,
                                        this.currentPageNV * this.itemsPerPageNV
                                    );
                                }
                            )
                            this.isLoading = false;
                        })
                    } else {
                        this.isLoading = false;
                        Swal.fire({
                            text: 'Ocurrió un problema al solicitar su petición.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showCloseButton: false
                        })
                    }
                }, error => {
                    this.isLoading = false;
                    Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
                }
            )
        }
    }

    deleteBenefeciary(item_benefeciary) {
        let new_list_benefeciary = this.list_benefeciary.filter((element) => element.siddoc != item_benefeciary.siddoc);
        this.list_benefeciary = new_list_benefeciary;
        this.totalItems = this.list_benefeciary.length;
        this.listToShow = this.list_benefeciary.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
        this.currentPage = this.listToShow.length == 0 ? this.currentPage - 1 : this.currentPage;
        this.listToShow = this.list_benefeciary.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
    }

    CancelQuotation(item) {

        Swal.fire({
            title: `Anular cotización: ${item.QuotationNumber}`,
            text: '¿Está seguro(a) que desea anular la cotización?',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            allowOutsideClick: false,
            reverseButtons: true,
            confirmButtonColor: "#2b0d61",
        }).then(
            result => {

                if (result.value) {
                    const request_cancel_quote = {
                        QuotationNumber: item.QuotationNumber
                    }
                    this.quotationService.cancelCotizacionesVigentesVIGP(request_cancel_quote).toPromise().then((res) => {

                        if (res.P_COD_ERR == 1) {
                            this.isLoading = false;
                            Swal.fire('Información', res.P_MESSAGE, 'error');
                        } else {
                            this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
                                async res => {
                                    this.listadoCotizacionesVigentes = res;

                                    this.listadoCotizacionesVigentes.forEach(element => {
                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                        element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                                    });

                                    this.currentPageV = 1;
                                    this.totalItemsV = this.listadoCotizacionesVigentes.length;
                                    this.listToShowV = this.listadoCotizacionesVigentes.slice(
                                        (this.currentPageV - 1) * this.itemsPerPageV,
                                        this.currentPageV * this.itemsPerPageV
                                    );
                                }
                            )

                            this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
                                async res => {
                                    this.listadoCotizacionesNoVigentes = res;

                                    this.listadoCotizacionesNoVigentes.forEach(element => {
                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                    });

                                    this.currentPageNV = 1;
                                    this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                                    this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                                        (this.currentPageNV - 1) * this.itemsPerPageNV,
                                        this.currentPageNV * this.itemsPerPageNV
                                    );
                                }
                            )
                            Swal.fire('Información', 'Se anuló la cotización correctamente.', 'success');
                        }
                    })
                }
            }
        )
    }

    selectCotizacion(item: any) {
        item.selected = true;
        this.current_quotation_selected = item;
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
            this.list_data_contractor_department = [];
          
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
            this.data_insured.relation = { COD_ELEMENTO: null };
            
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

    async cargarDatosContractor(res: any, search_type: any) {

        const contracting_data = res.EListClient[0];
        if (contracting_data.P_DBIRTHDAT == null){
            console.log("Fecha Nula");
        }else{
            let split_date = contracting_data.P_DBIRTHDAT.split('/');
            this.data_contractor.birthday_date = new Date(split_date[1] + '/' + split_date[0] + '/' + split_date[2]); //FECHA
        }
        this.data_contractor.names = contracting_data.P_SFIRSTNAME;
        this.data_contractor.last_name = contracting_data.P_SLASTNAME;
        this.data_contractor.last_name2 = contracting_data.P_SLASTNAME2;
        console.log(contracting_data);
        this.data_contractor.sclient = contracting_data.P_SCLIENT;
        console.log(this.data_contractor.sclient);

        this.s_usr = { P_SCLIENT: this.data_contractor.sclient }; // Parta la busqueda del Contratante

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
                this.data_insured.relation = { COD_ELEMENTO: 0 }
            });
        }

        if (contracting_data.EListPhoneClient.length >= 1) {
            this.data_contractor.phone = contracting_data.EListPhoneClient[0].P_SPHONE;
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
                                this.isLoading = false;
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
                                    this.isLoading = false;
                                }
                            );
                        } else {
                            this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                            this.isLoading = false;
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
                                    this.isLoading = false;
                                }
                            );
                        } else {
                            this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                            this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                            this.isLoading = false;
                        }
                    }
                }
            );
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
                    if (res.P_SRELATION == null){ // PARENTESCO
                        this.data_insured.relation = { COD_ELEMENTO: 0 }; 
                    }else{
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
                                        this.getIdecon(2);
                                        this.data_insured_360 = { ...this.data_insured }; // Almacenando la Info de Inicio del 360 para el Asegurado en una Variable
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
        if (contracting_data.P_DBIRTHDAT == null){
            console.log("Fecha Nula");
        }else{
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

    changeStyleCredit(input_name = "") {

        this.format_amount = parseInt(this.quotation.contribution.replace(/,/g, ''));

        this.parse_amount_contribution = CommonMethods.formatNUMBER(this.format_amount);
        this.quotation.contribution = this.parse_amount_contribution;

        if (this.quotation.contribution.toUpperCase() == "NAN") {
            this.quotation.contribution = '';
        }
    }

    checkAllQuotations(checked: boolean) {
        if (checked) {
            this.listadoCotizacionesVigentes.forEach(
                (value: any) => {
                    value.checked = true;
                }
            )
        } else {
            this.listadoCotizacionesVigentes.forEach(
                (value: any) => {
                    value.checked = false;
                }
            )
        }
    }

    isAllCheckQuotations() {
        this.masterChecked = this.listadoCotizacionesVigentes.every(
            function (item: any) {
                return item.checked == true;
            }
        )
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


    validateForUpdateClient() {

        let response = false;

        if (this.data_contractor.type_document.Id != this.data_contractor_360.type_document.Id) { response = true;  this.nregister_contractor = 1;  };

        if (this.data_contractor.document_number != this.data_contractor_360.document_number) { response = true;  this.nregister_contractor = 1;  };

        if (this.data_contractor.birthday_date != this.data_contractor_360.birthday_date) { response = true;  this.nregister_contractor = 1;  };

        if (this.data_contractor.names != this.data_contractor_360.names) { response = true;  this.nregister_contractor = 1;  };

        if (this.data_contractor.last_name != this.data_contractor_360.last_name) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.last_name2 != this.data_contractor_360.last_name2) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.gender.SSEXCLIEN != this.data_contractor_360.gender.SSEXCLIEN) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.civil_status.NCIVILSTA != this.data_contractor_360.civil_status.NCIVILSTA) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.nationality.NNATIONALITY != this.data_contractor_360.nationality.NNATIONALITY) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.phone != this.data_contractor_360.phone) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.email != this.data_contractor_360.email) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.address != this.data_contractor_360.address) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.department.Id != this.data_contractor_360.department.Id) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.province.Id != this.data_contractor_360.province.Id) { response = true; this.nregister_contractor = 1;  };

        if (this.data_contractor.district.Id != this.data_contractor_360.district.Id) { response = true; this.nregister_contractor = 1;  };

        if (this.check_input_value != this.check_input_value_360) { response = true; this.nregister_contractor = 1;  };
   

        if (this.check_input_value == 0) { // Contratante != Asegurado 1 Si , 0 No; Para Asegurado

            if (this.data_insured.type_document.Id != this.data_insured_360.type_document.Id) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.document_number != this.data_insured_360.document_number) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.birthday_date != this.data_insured_360.birthday_date) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.names != this.data_insured_360.names) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.last_name != this.data_insured_360.last_name) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.last_name2 != this.data_insured_360.last_name2) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.gender.SSEXCLIEN != this.data_insured_360.gender.SSEXCLIEN) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.civil_status.NCIVILSTA != this.data_insured_360.civil_status.NCIVILSTA) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.nationality.NNATIONALITY != this.data_insured_360.nationality.NNATIONALITY) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.phone != this.data_insured_360.phone) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.email != this.data_insured_360.email) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.address != this.data_insured_360.address) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.department.Id != this.data_insured_360.department.Id) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.province.Id != this.data_insured_360.province.Id) { response = true; this.nregister_insured = 1;  };

            if (this.data_insured.district.Id != this.data_insured_360.district.Id) { response = true; this.nregister_insured = 1;  };
            
            if (this.nregister_parentesco != this.data_insured.relation) { response = true; this.nregister_insured = 1;  }; //parentesco
    
        }
        return response;
    }


    // MEJORA ESTO LLEVARLO EN EL ARCHIVO DE LAS CONSTANTES PARA PODER REUTILIZARLO EN DIFERENTES PARTES
    insertUpdateExistingClient(update_client_360) {
        let response;
        this.clientInformationService.getCliente360(update_client_360).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    insProspect(prospect_data) {
        let response;
        this.vidaInversionService.insertProspect(prospect_data).toPromise().then((res) => {
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

    async updateDataClient360() {

        let error_upd_360 = "0";

        let formatter_data = this.formatter_data_prospect();
        let prospect_data = [];

        const myFormData = this.createFormDataQuotationPreliminary();
        const objCotDes = this.getDataForQuotationPreliminary();

        myFormData.append('objDes', JSON.stringify(objCotDes));

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

                //let prospect_data = [];
                prospect_data.push(formatter_data.contractor_data);


                this.vidaInversionService.insertProspect(prospect_data).subscribe(async (res) => {
                    if (res.P_NCODE == 1) {
                        error_upd_360 = "1";
                        this.isLoading = false;
                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                        return error_upd_360;
                    }

                    else {
                        let update_client_360 = this.format_360(1); // Para enviar al 360
                        await this.clientInformationService.getCliente360(update_client_360).toPromise().then(
                            async res => {
                                if (res.P_NCODE == 1) {
                                    error_upd_360 = "1";
                                    this.isLoading = false;
                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
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
                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                    return error_upd_360;
                                                }
                                            }
                                        )
                                    }
                                }
                            })

                        // if (error_upd_360 == "0") {
                        await this.quotationService.insertQuotation(myFormData).toPromise().then(
                            async (res) => {
                                if (res.P_COD_ERR == 0) {
                                    this.isLoading = false;
                                    // Si no hay ningun error lo que se hara el mandar el Loading y traer nuevamente las Cotizacion Vigentes
                                    Swal.fire({
                                        text: `La cotización ${res.P_NID_COTIZACION} se generó correctamente.`,
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        showCloseButton: false
                                    }).then(result => {

                                        this.isLoading = true;
                                        this.cleanQuoteData();

                                        /* DGC - 30/05/2024 - INICIO */
                                        let funds = {
                                            P_NFUNDS: this.investment[0].NFUNDS,
                                            P_NPARTICIP: this.investment[0].NPARTICIP,
                                            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                                            P_SREADDRESS: '',
                                            P_NQUAN_AVAIL: '',
                                            P_SACTIVFOUND: '',
                                            P_NORIGIN: this.investment[0].NORIGIN,
                                            P_SAPV: '',
                                            P_NINTPROY: this.investment[0].NINTPROY,
                                            P_NINTPROYVAR: '',
                                            P_NID_COTIZACION: res.P_NID_COTIZACION,
                                        }
                                        this.insQuotationFunds(funds);
                                        /* DGC - 30/05/2024 - FIN */

                                        this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
                                            async res => {
                                                this.listadoCotizacionesVigentes = res;

                                                this.listadoCotizacionesVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                    element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                                                });

                                                this.currentPageV = 1;
                                                this.totalItemsV = this.listadoCotizacionesVigentes.length;
                                                this.listToShowV = this.listadoCotizacionesVigentes.slice(
                                                    (this.currentPageV - 1) * this.itemsPerPageV,
                                                    this.currentPageV * this.itemsPerPageV
                                                );
                                            }
                                        )

                                        this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
                                            async res => {
                                                this.listadoCotizacionesNoVigentes = res;

                                                this.listadoCotizacionesNoVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                });

                                                this.currentPageNV = 1;
                                                this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                                                this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                                                    (this.currentPageNV - 1) * this.itemsPerPageNV,
                                                    this.currentPageNV * this.itemsPerPageNV
                                                );
                                            }
                                        )
                                        this.isLoading = false;
                                    })
                                } else {
                                    this.isLoading = false;
                                    Swal.fire({
                                        text: 'Ocurrió un problema al solicitar su petición.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        showCloseButton: false
                                    })
                                }
                            }, error => {
                                this.isLoading = false;
                                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
                            }
                        )
                        // }
                    }




                })
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

                            }});

                        //INSERT COTIZACION
                        //const myFormData_update = this.createFormDataQuotationPreliminary();
                       // const objCotDes_update = this.getDataForQuotationPreliminary();

                        //myFormData_update.append('objDes', JSON.stringify(objCotDes_update));

                        //await this.quotationService.insertQuotation(myFormData_update).toPromise().then(
                        this.vidaInversionService.insertProspect(prospect_data).subscribe(async (res) => {
                                if (res.P_NCODE == 1) {
                                    error_upd_360 = "1";
                                    this.isLoading = false;
                                    Swal.fire('Información', res.P_SMESSAGE, 'error')
                                    return error_upd_360;
                         }});


                        await this.quotationService.insertQuotation(myFormData).toPromise().then(
                            async (res) => {
                                if (res.P_COD_ERR == 0) {
                                    this.isLoading = false;
                                    // Si no hay ningun error lo que se hara el mandar el Loading y traer nuevamente las Cotizacion Vigentes
                                    Swal.fire({
                                        text: `La cotización ${res.P_NID_COTIZACION} se generó correctamente.`,
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        showCloseButton: false
                                    }).then(result => {

                                        this.isLoading = true;
                                        this.cleanQuoteData();

                                        /* DGC - 30/05/2024 - INICIO */
                                        let funds = {
                                            P_NFUNDS: this.investment[0].NFUNDS,
                                            P_NPARTICIP: this.investment[0].NPARTICIP,
                                            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                                            P_SREADDRESS: '',
                                            P_NQUAN_AVAIL: '',
                                            P_SACTIVFOUND: '',
                                            P_NORIGIN: this.investment[0].NORIGIN,
                                            P_SAPV: '',
                                            P_NINTPROY: this.investment[0].NINTPROY,
                                            P_NINTPROYVAR: '',
                                            P_NID_COTIZACION: res.P_NID_COTIZACION,
                                        }
                                        this.insQuotationFunds(funds);
                                        /* DGC - 30/05/2024 - FIN */

                                        this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
                                            async res => {
                                                this.listadoCotizacionesVigentes = res;

                                                this.listadoCotizacionesVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                    element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                                                });

                                                this.currentPageV = 1;
                                                this.totalItemsV = this.listadoCotizacionesVigentes.length;
                                                this.listToShowV = this.listadoCotizacionesVigentes.slice(
                                                    (this.currentPageV - 1) * this.itemsPerPageV,
                                                    this.currentPageV * this.itemsPerPageV
                                                );
                                            }
                                        )

                                        this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
                                            async res => {
                                                this.listadoCotizacionesNoVigentes = res;

                                                this.listadoCotizacionesNoVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                    element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                });

                                                this.currentPageNV = 1;
                                                this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                                                this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                                                    (this.currentPageNV - 1) * this.itemsPerPageNV,
                                                    this.currentPageNV * this.itemsPerPageNV
                                                );
                                            }
                                        )
                                        this.isLoading = false;
                                    })
                                } else {
                                    this.isLoading = false;
                                    Swal.fire({
                                        text: 'Ocurrió un problema al solicitar su petición.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        showCloseButton: false
                                    })
                                }
                            }, error => {
                                this.isLoading = false;
                                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
                            })

                }
                else {
                    this.vidaInversionService.insertProspect(prospect_data).subscribe(async (res) => {
                        if (res.P_NCODE == 1) {
                            error_upd_360 = "1";
                            this.isLoading = false;
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

                            

                            await this.quotationService.insertQuotation(myFormData).toPromise().then(
                                async (res) => {
                                    if (res.P_COD_ERR == 0) {
                                        this.isLoading = false;
                                        // Si no hay ningun error lo que se hara el mandar el Loading y traer nuevamente las Cotizacion Vigentes
                                        Swal.fire({
                                            text: `La cotización ${res.P_NID_COTIZACION} se generó correctamente.`,
                                            icon: 'success',
                                            confirmButtonText: 'Aceptar',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            showCloseButton: false
                                        }).then(result => {

                                            this.isLoading = true;
                                            this.cleanQuoteData();

                                            /* DGC - 30/05/2024 - INICIO */
                                            let funds = {
                                                P_NFUNDS: this.investment[0].NFUNDS,
                                                P_NPARTICIP: this.investment[0].NPARTICIP,
                                                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
                                                P_SREADDRESS: '',
                                                P_NQUAN_AVAIL: '',
                                                P_SACTIVFOUND: '',
                                                P_NORIGIN: this.investment[0].NORIGIN,
                                                P_SAPV: '',
                                                P_NINTPROY: this.investment[0].NINTPROY,
                                                P_NINTPROYVAR: '',
                                                P_NID_COTIZACION: res.P_NID_COTIZACION,
                                            }
                                            this.insQuotationFunds(funds);
                                            /* DGC - 30/05/2024 - FIN */

                                            this.quotationService.getCotizacionesVigentesVIGP(this.s_usr).toPromise().then(
                                                async res => {
                                                    this.listadoCotizacionesVigentes = res;


                                                    this.listadoCotizacionesVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                        element.SDESC_STATE = element.SDESC_STATE.toUpperCase();
                                                    });

                                                    this.currentPageV = 1;
                                                    this.totalItemsV = this.listadoCotizacionesVigentes.length;
                                                    this.listToShowV = this.listadoCotizacionesVigentes.slice(
                                                        (this.currentPageV - 1) * this.itemsPerPageV,
                                                        this.currentPageV * this.itemsPerPageV
                                                    );
                                                }
                                            )

                                            this.quotationService.getCotizacionesNoVigentesVIGP(this.s_usr).toPromise().then(
                                                async res => {
                                                    this.listadoCotizacionesNoVigentes = res;

                                                    this.listadoCotizacionesNoVigentes.forEach(element => { // Para Dar formato de Moneda en el Lista
                                                        element.NCONTRIBUTION = element.NCONTRIBUTION.toLocaleString('en-US');
                                                    });

                                                    this.currentPageNV = 1;
                                                    this.totalItemsNV = this.listadoCotizacionesNoVigentes.length;
                                                    this.listToShowNV = this.listadoCotizacionesNoVigentes.slice(
                                                        (this.currentPageNV - 1) * this.itemsPerPageNV,
                                                        this.currentPageNV * this.itemsPerPageNV
                                                    );
                                                }
                                            )
                                            this.isLoading = false;
                                        })
                                    } else {
                                        this.isLoading = false;
                                        Swal.fire({
                                            text: 'Ocurrió un problema al solicitar su petición.',
                                            icon: 'error',
                                            confirmButtonText: 'Aceptar',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            showCloseButton: false
                                        })
                                    }
                                }, error => {
                                    this.isLoading = false;
                                    Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
                                }
                            )
                        }
                    })
                }
            }
        }
        return error_upd_360;
    }


    formatter_data_prospect() {

        const contractor_data = {
            P_NCHANNEL: "1",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_contractor.sclient,
            P_NTYPE_DOCUMENT: this.data_contractor.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_SNAMES: this.data_contractor.names ? this.data_contractor.names: null,
            P_SLASTNAME: this.data_contractor.last_name ? this.data_contractor.last_name: null,
            P_SLASTNAME2: this.data_contractor.last_name2 ? this.data_contractor.last_name2 : null,
            P_DDATEBIRTHDAY: this.data_contractor.birthday_date ? this.data_contractor.birthday_date: null,
            P_NID_SEX: this.data_contractor.gender ? this.data_contractor.gender.SSEXCLIEN: null,
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
            P_REG_INSURED: this.nregister_insured,
        };

        const insured_data = {
            P_NCHANNEL: "1000",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_insured.sclient,
            P_NTYPE_DOCUMENT: this.data_insured.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_insured.document_number,
            P_SNAMES: this.data_insured.names ? this.data_insured.names: null,
            P_SLASTNAME: this.data_insured.last_name ? this.data_insured.last_name: null,
            P_SLASTNAME2: this.data_insured.last_name2 ? this.data_insured.last_name2: null,
            P_DDATEBIRTHDAY: this.data_insured.birthday_date ? this.data_insured.birthday_date: null,
            P_NID_SEX: this.data_insured.gender ? this.data_insured.gender.SSEXCLIEN: null,
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


    searchValidate(search_type) { // 1 Contratante 2 Asegurado

        const validate_res = { cod_error: "0", message: "" };

        if (search_type == 1) {

            if (this.data_contractor.type_document.Id == 2) {

                if (this.data_contractor.document_number.length == 7) {
                    this.data_contractor.document_number = this.data_contractor.document_number.padStart(8, "0");
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
                                        this.getIdecon(1);
                                    }
                                    else { // 2 Insured
                                        this.clearData(search_type);
                                        await this.cargarDatosInsured(res, search_type);
                                        this.getIdecon(2);
                                    }
                                    //this.isLoading = false;
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

    enableInputs(type: any) { // Cuando el 360 no llama Info

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

    getQuotationFunds = () => {
        let item = {
            NBRANCH: 71,
            NPRODUCT: 10,
            DEFFECDATE: this.diaActual,
            NORIGIN: 4,
            SVIGEN: 2
        }
        this.vidaInversionService.GetQuotationFunds(item).subscribe(
            res => {
                // this.funds_list = res.RC1;
                this.investment = res.RC1;
            },
            err => {
                //Swal.fire('Información', 'Ocurrió un problema al obtener los fondos.', 'error');
            }
        )
    }

    insQuotationFunds = (item) => {
        this.vidaInversionService.InsQuotationFunds(item).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    console.log("Insertó los fondos");
                } else {
                    console.log("No insertó los fondos");
                }
            },
            err => {
                //Swal.fire('Información', 'Ocurrió un problema al insertar los fondos.', 'error');
            }
        )
    }
}