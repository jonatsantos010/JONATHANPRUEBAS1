import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { AddressService } from '../../../broker/services/shared/address.service';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { DataContractor } from '../../models/DataContractor';
import { DataInsured } from '../../models/DataInsured';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';
import { QuotationService } from '../../../../layout/broker/services/quotation/quotation.service';


@Component({
    selector: 'app-new-prospects',
    templateUrl: './new-prospects.component.html',
    styleUrls: ['./new-prospects.component.scss']
})
export class NewProspectsComponent implements OnInit {

    CONSTANTS: any = VidaInversionConstants;
    COD_PROD_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];

    boolNumberCTR: boolean = false;
    boolNumberASG: boolean = false;
    boolEmailCTR: boolean = false;
    boolEmailASG: boolean = false;
    @Input() public reference: any;
    @Input() check_input_value;

    contractor_province_department: any = false;
    contractor_province_selected: any = false;
    insured_province_department: any = false;
    insured_province_selected: any = false;

    show_guide: boolean = false;
    isLoading: boolean = false;

    list_data_contractor_department: any = [];
    list_data_contractor_province: any = [];
    list_data_contractor_district: any = [];

    list_data_insured_department: any = [];
    list_data_insured_province: any = [];
    list_data_insured_district: any = [];

    type_rol: any;
    new_client_contractor = false; // Indica si es cliente Ya se encuentra registrado en el 360 o no
    new_client_insured = false; // Indica si es cliente Ya se encuentra registrado en el 360 o no
    profile_id: any;
    cur_usr:any;

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
        department: [],
        province: [],
        district: [],
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
        department: [],
        province: [],
        district: [],
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

    constructor(private router: Router,
        public clientInformationService: ClientInformationService,
        public addressService: AddressService,
        private vidaInversionService: VidaInversionService,
        private parameterSettingsService: ParameterSettingsService,
        public quotationService: QuotationService,

    ) { }

    async ngOnInit() {

        this.isLoading = true;
        this.type_rol = '0';
        this.profile_id = await this.getProfileProduct();

        this.check_input_value = 1;
        this.cur_usr = JSON.parse(localStorage.getItem('currentUser'));
        
        this.isLoading = false;

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

    concat = (type) => {
        if (type == 1 && this.data_contractor.document_number.length < 8 && this.data_contractor.type_document.Id == 2) {
            let sust = 8 - this.data_contractor.document_number.length;
            let str: string = "";
            for (let i = 0; i < sust; i++) str += "0";
            this.data_contractor.document_number = str + this.data_contractor.document_number;
        }
        if (type == 2 && this.data_insured.document_number.length < 8 && this.data_insured.type_document.Id == 2) {
            let sust = 8 - this.data_insured.document_number.length;
            let str: string = "";
            for (let i = 0; i < sust; i++) str += "0";
            this.data_insured.document_number = str + this.data_insured.document_number;
        }
    }

    changeDocumentType(search_type: any) {
        if (search_type == 1) {
            this.data_contractor.document_number = "";
        } else {
            this.data_insured.document_number = "";
        }
    }

    search = async (search_type: any) => {

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

        const request_validate_contractor = {
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_NTYPE_DOCUMENT: parseInt(this.data_contractor.type_document.Id),
            P_SUSERNAME: JSON.parse(localStorage.getItem('currentUser'))['username'],
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_NIDUSER: JSON.parse(localStorage.getItem('currentUser'))['id']
        };

        const response_validate_contractor = await this.vidaInversionService.validateClientProspect(request_validate_contractor).toPromise();

        if (response_validate_contractor.P_NCODE == 1) {
            Swal.fire('Información', response_validate_contractor.P_SMESSAGE, 'error');
        }
        else {
            this.clickBuscar(search_type);
        }
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


    formatter_data_prospect() {

        const contractor_data = {
            P_NCHANNEL: "1000",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_contractor.sclient,
            P_NTYPE_DOCUMENT: this.data_contractor.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_SNAMES: this.data_contractor.names ? this.data_contractor.names.toUpperCase(): null,
            P_SLASTNAME: this.data_contractor.last_name ? this.data_contractor.last_name.toUpperCase(): null,
            P_SLASTNAME2: this.data_contractor.last_name2 ? this.data_contractor.last_name2.toUpperCase(): null,
            // P_DDATEBIRTHDAY: this.data_contractor.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_contractor.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_contractor.birthday_date.getFullYear(),
            P_DDATEBIRTHDAY: this.data_contractor.birthday_date ? this.data_contractor.birthday_date: null,
            P_NID_SEX: this.data_contractor.gender ? this.data_contractor.gender.SSEXCLIEN: null,
            P_NID_NATION: this.data_contractor.nationality.NNATIONALITY,
            P_SCELLPHONE: this.data_contractor.phone,
            P_SEMAIL: this.data_contractor.email,
            P_SADDRESS: this.data_contractor.address.toUpperCase(),
            P_NID_DPTO: this.data_contractor.department.Id,
            P_NID_PROV: this.data_contractor.province.Id,
            P_NID_DIST: this.data_contractor.district.Id,
            P_NID_ASCON: this.check_input_value, // 1 Si , 0 NO
            P_NTYPE_CLIENT: 1,
            P_USER: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_SUSERNAME: JSON.parse(localStorage.getItem('currentUser'))['username']
        };

        const insured_data = {
            P_NCHANNEL: "1000",
            P_NBRANCH: this.CONSTANTS.RAMO,
            P_NPRODUCT: this.CONSTANTS.COD_PRODUCTO,
            P_SCLIENT: this.data_insured.sclient,
            P_NTYPE_DOCUMENT: this.data_insured.type_document.Id,
            P_SNUMBER_DOCUMENT: this.data_insured.document_number,
            P_SNAMES: this.data_insured.names ? this.data_insured.names.toUpperCase() : null,
            P_SLASTNAME: this.data_insured.last_name ? this.data_insured.last_name.toUpperCase(): null,
            P_SLASTNAME2: this.data_insured.last_name2 ? this.data_insured.last_name2.toUpperCase(): null,
            // P_DDATEBIRTHDAY: this.data_insured.birthday_date ? this.data_insured?.birthday_date.getDate().toString().padStart(2, '0') + '/' + (this.data_insured?.birthday_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.data_insured?.birthday_date.getFullYear() : '',
            P_DDATEBIRTHDAY: this.data_insured.birthday_date ? this.data_insured.birthday_date: null,
            P_NID_SEX: this.data_insured.gender ? this.data_insured.gender.SSEXCLIEN: null,
            P_NID_NATION: this.data_insured.nationality.NNATIONALITY,
            P_SCELLPHONE: this.data_insured.phone,
            P_SEMAIL: this.data_insured.email,
            P_SADDRESS: this.data_insured.address.toUpperCase(),
            P_NID_DPTO: this.data_insured.department.Id,
            P_NID_PROV: this.data_insured.province.Id,
            P_NID_DIST: this.data_insured.district.Id,
            P_NID_ASCON: this.check_input_value, // 1 Si , 0 NO
            P_NTYPE_CLIENT: 2,
            P_SRELATION: this.data_insured.relation.COD_ELEMENTO
        };

        let format_data = { contractor_data, insured_data };

        return format_data;
    }


    format_360(search_type) {
        // search_type 1 para Contratante 2 Para Contratatne y Asegurado

        let formatter_data_360 = {};

        if (search_type == 1) {
            console.log("supuesta fallla   qaaa", this.data_contractor.birthday_date);


            let format_birthday = this.data_contractor.birthday_date.toLocaleDateString('es-ES');
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

            let format_birthday = this.data_insured.birthday_date.toLocaleDateString('es-ES');

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

    async insertUpdateExistingClient(update_client_360) {
        let response;
        await this.clientInformationService.getCliente360(update_client_360).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    async insProspect(prospect_data) {
        let response;
        await this.vidaInversionService.insertProspect(prospect_data).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    async insDirection(client_ubication) {
        let response;
        await this.vidaInversionService.saveDirection(client_ubication).toPromise().then((res) => {
            response = res;
            return response;
        })
        return response;
    }

    async createProspect() {

        let formatter_data = this.formatter_data_prospect();
        let prospect_data = [];
        
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

        if (this.check_input_value == 1) { // Solo Contratante
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
                async (result) => {
                    if (result.isConfirmed) {

                        let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);

                        if (validate_error_contractor.cod_error == 1) {
                            Swal.fire('Información', validate_error_contractor.message_error, 'error');
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

                            prospect_data.push(formatter_data.contractor_data);

                            if (this.new_client_contractor) { // VALIDAMOS SI ES NUEVO CLIENTE O NO

                                let ins_client_360 = this.formatter_insert_360(1); // Para enviar al 360
                                let insert_response_client360 = await this.insertUpdateExistingClient(ins_client_360);

                                if (insert_response_client360.P_NCODE == 1) {
                                    Swal.fire('Información', insert_response_client360.P_SMESSAGE, 'warning')
                                    return;
                                }
                                else {
                                    prospect_data[0].P_SCLIENT = insert_response_client360.P_SCOD_CLIENT.trim(); // Agregando Sclient del nuevo contratante
                                    console.log(prospect_data[0].P_SCLIENT);

                                    if (
                                        (this.data_contractor.address == "" || this.data_contractor.address == null) &&
                                        (this.data_contractor.department.Id == undefined || this.data_contractor.department.Id == null) &&
                                        (this.data_contractor.province.Id == undefined || this.data_contractor.province.Id == null) &&
                                        (this.data_contractor.district.Id == undefined || this.data_contractor.district.Id == null)
                                    ) { }
                                    else {
                                        const contractor_ubication = this.formatterDataDirection(1); // Contratante
                                        const response_contractor_ubication = await this.insDirection(contractor_ubication);

                                        if (response_contractor_ubication.P_NCODE == 0 || response_contractor_ubication.P_NCODE == 2) {
                                            // EXITOSO
                                            // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                        } else {
                                            Swal.fire('Información', response_contractor_ubication.P_SMESSAGE, 'warning');
                                            return;
                                        }
                                    }

                                    let response_prospect = await this.insProspect(prospect_data);

                                    if (response_prospect.P_NCODE == 1) {
                                        Swal.fire('Información', response_prospect.P_SMESSAGE, 'warning')
                                    }
                                    else {
                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                    }
                                }
                            } else {

                                formatter_data = this.formatter_data_prospect(); // Obteniendo nuevamente el cliente por sitiene informacion pasada
                                prospect_data = [];
                                prospect_data.push(formatter_data.contractor_data);

                                // EL CONTRATANTE YA ESTA REGISTRADO EN EL 360
                                this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {

                                    if (res.P_NCODE == 1) {
                                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                                    }
                                    else {

                                        let update_client_360 = this.format_360(1); // Para enviar al 360
                                        this.clientInformationService.getCliente360(update_client_360).toPromise().then(
                                            async res => {
                                                if (res.P_NCODE == 1) {
                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
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
                                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
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
                                                            P_SREFERENCE: "REFERENCIAL",
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
                                                        this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                                            async res => {
                                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) {
                                                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                                }
                                                                else {
                                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                }
                                                            }
                                                        )
                                                    }
                                                }
                                            })
                                    }
                                })
                            }
                        }
                    } else {
                        this.check_input_value = 0;
                        this.show_guide = true;
                        setTimeout(() => {
                            this.show_guide = false;
                        }, 5000);
                    }
                }
            )


        } else { // EXISTE CONTRATANTE Y ASEGURADO

            let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);
            let validate_error_insured = this.CONSTANTS.VALIDATE_INSURED(this.data_insured, this.idecon_insured);

            if (validate_error_contractor.cod_error == 1 || validate_error_insured.cod_error == 1) {
                Swal.fire('Información', `${validate_error_contractor.message_error}${validate_error_insured.message_error}`, 'error');
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

                prospect_data = []; //limpiando variable
                prospect_data.push(formatter_data.contractor_data);
                prospect_data.push(formatter_data.insured_data);

                if (this.new_client_contractor || this.new_client_insured) { // VALIDAMOS SI EL CONTRATANTE o el asegurado NO ESTAN REGISTRADOS ; 

                    // EL CONTRATANTE Y EL ASEGURADO SON NUEVOS
                    if (this.new_client_contractor == true && this.new_client_insured == true) {

                        let ins_contractor_client_360 = this.formatter_insert_360(1); // Para enviar al 360
                        let insert_response_contractor_client360 = await this.insertUpdateExistingClient(ins_contractor_client_360);

                        if (insert_response_contractor_client360.P_NCODE == 1) {
                            Swal.fire('Información', insert_response_contractor_client360.P_SMESSAGE, 'warning');
                            return;
                        }
                        else {

                            prospect_data[0].P_SCLIENT = insert_response_contractor_client360.P_SCOD_CLIENT.trim();
                            console.log(prospect_data[0].P_SCLIENT);
                            //if (this.data_contractor.address !== "" || this.data_contractor.department.Id != "0" || this.data_contractor.province.Id != "0" || this.data_contractor.district.Id != "0") {

                            if (
                                (this.data_contractor.address == "" || this.data_contractor.address == null) &&
                                (this.data_contractor.department.Id == undefined || this.data_contractor.department.Id == null) &&
                                (this.data_contractor.province.Id == undefined || this.data_contractor.province.Id == null) &&
                                (this.data_contractor.district.Id == undefined || this.data_contractor.district.Id == null)
                            ) { }
                            else {
                                const contractor_ubication = this.formatterDataDirection(1);// Contratante
                                const response_contractor_ubication = await this.insDirection(contractor_ubication);

                                if (response_contractor_ubication.P_NCODE == 0 || response_contractor_ubication.P_NCODE == 2) {
                                    // EXITOSO
                                    // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                } else {
                                    Swal.fire('Información', response_contractor_ubication.P_SMESSAGE, 'warning');
                                    return;
                                }
                            }

                            // En este punto el Contratante y toda su Data ya se inserto, continuamos con el ASEGURADO
                            let ins_insured_client_360 = this.formatter_insert_360(2); // Para enviar al 360 Asegurado
                            let insert_response_insured_client360 = await this.insertUpdateExistingClient(ins_insured_client_360);

                            if (insert_response_insured_client360.P_NCODE == 1) {
                                Swal.fire('Información', insert_response_insured_client360.P_SMESSAGE, 'warning');
                                return;
                            }
                            else {


                                prospect_data[1].P_SCLIENT = insert_response_insured_client360.P_SCOD_CLIENT.trim();
                                console.log(prospect_data[1].P_SCLIENT);

                                //if (this.data_insured.address !== "" || this.data_insured.department.Id != "0" || this.data_insured.province.Id != "0" || this.data_insured.district.Id != "0") {
                                if (
                                    (this.data_insured.address == "" || this.data_insured.address == null) &&
                                    (this.data_insured.department.Id == undefined || this.data_insured.department.Id == null) &&
                                    (this.data_insured.province.Id == undefined || this.data_insured.province.Id == null) &&
                                    (this.data_insured.district.Id == undefined || this.data_insured.district.Id == null)
                                ) {
                                    //
                                } else {

                                    const insured_ubication = this.formatterDataDirection(2);// Asegurado
                                    const response_insured_ubication = await this.insDirection(insured_ubication);
                                    if (response_insured_ubication.P_NCODE == 0 || response_insured_ubication.P_NCODE == 2) {
                                        // EXITOSO
                                        // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                    } else {
                                        Swal.fire('Información', response_insured_ubication.P_SMESSAGE, 'warning');
                                        return;
                                    }
                                }

                                let response_prospect = await this.insProspect(prospect_data);

                                if (response_prospect.P_NCODE == 1) {
                                    Swal.fire('Información', response_prospect.P_SMESSAGE, 'warning');
                                    return;
                                }
                                else {
                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                }
                            }
                        }
                    }
                    // EL CONTRATANTE ES NUEVO, PERO EL ASEGURADO NO
                    else if (this.new_client_contractor == true && this.new_client_insured == false) {

                        // Se insertar el contratante ; y al aseguro se le procedure a llamar igualmente para actualizar el asegurado.
                        let ins_contractor_client_360 = this.formatter_insert_360(1); // Para enviar al 360
                        let insert_response_contractor_client360 = await this.insertUpdateExistingClient(ins_contractor_client_360);

                        if (insert_response_contractor_client360.P_NCODE == 1) {
                            Swal.fire('Información', insert_response_contractor_client360.P_SMESSAGE, 'warning');
                            return;
                        }
                        else {
                            prospect_data[0].P_SCLIENT = insert_response_contractor_client360.P_SCOD_CLIENT.trim();
                            console.log(prospect_data[1].P_SCLIENT);
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

                                const contractor_ubication = this.formatterDataDirection(1);// Contratante
                                const response_contractor_ubication = await this.insDirection(contractor_ubication);

                                if (response_contractor_ubication.P_NCODE == 0 || response_contractor_ubication.P_NCODE == 2) {
                                    // EXITOSO
                                    // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                } else {
                                    Swal.fire('Información', response_contractor_ubication.P_SMESSAGE, 'warning');
                                    return;
                                }
                            }

                            //AQUI LLLAMAR AL CIENT PARA EL ASEUGRADO PARA QUE LO ACTUALIZE Y A ESE TAMBIEN CONSULTARLE POR SU DIRECCION
                            let update_insured_client_360 = this.format_360(2); // Para enviar al 360
                            let update_response_insured_client360 = await this.insertUpdateExistingClient(update_insured_client_360);
                            if (update_response_insured_client360.P_NCODE == 1) {
                                Swal.fire('Información', update_response_insured_client360.P_SMESSAGE, 'warning');
                                return;
                            }
                            else {

                                prospect_data[1].P_SCLIENT = update_response_insured_client360.P_SCOD_CLIENT.trim();
                                console.log(prospect_data[1].P_SCLIENT);

                                //if (this.data_insured.address !== "" || this.data_insured.department.Id != "0" || this.data_insured.province.Id != "0" || this.data_insured.district.Id != "0") {
                                if (
                                    (this.data_insured.address == "" || this.data_insured.address == null) &&
                                    (this.data_insured.department.Id == undefined || this.data_insured.department.Id == null) &&
                                    (this.data_insured.province.Id == undefined || this.data_insured.province.Id == null) &&
                                    (this.data_insured.district.Id == undefined || this.data_insured.district.Id == null)
                                ) {
                                    //
                                } else {
                                    const insured_ubication = this.formatterDataDirection(2);// Asegurado
                                    const response_insured_ubication = await this.insDirection(insured_ubication);

                                    if (response_insured_ubication.P_NCODE == 0 || response_insured_ubication.P_NCODE == 2) {
                                        // EXITOSO
                                        // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                    } else {
                                        Swal.fire('Información', response_insured_ubication.P_SMESSAGE, 'warning');
                                        return;
                                    }
                                }
                                let response_prospect2 = await this.insProspect(prospect_data);

                                if (response_prospect2.P_NCODE == 1) {
                                    Swal.fire('Información', response_prospect2.P_SMESSAGE, 'warning')
                                }
                                else {
                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                }
                            }
                        }
                    }

                    else if (this.new_client_contractor == false && this.new_client_insured == true) {
                        // EL CONTRATANTE YA EXISTE, PERO EL ASEGURADO ES NUEVO
                        let update_contractor_client_360 = this.format_360(1); // Para enviar al 360
                        let update_response_contractor_client360 = await this.insertUpdateExistingClient(update_contractor_client_360);

                        if (update_response_contractor_client360.P_NCODE == 1) {
                            Swal.fire('Información', update_response_contractor_client360.P_SMESSAGE, 'warning');
                            return;
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

                                const contractor_ubication2 = this.formatterDataDirection(1);// Contratante
                                const response_contractor_ubication2 = await this.insDirection(contractor_ubication2);

                                if (response_contractor_ubication2.P_NCODE == 0 || response_contractor_ubication2.P_NCODE == 2) {
                                    // EXITOSO
                                    // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                } else {
                                    Swal.fire('Información', response_contractor_ubication2.P_SMESSAGE, 'warning');
                                    return;
                                }
                            }

                            // YA SE ACTUALIZO LA DATA DEL CONTRATANTE, AHORA SE VA REGISTRAR EL ASEGURADO EN EL 360
                            let ins_insured_client_360 = this.formatter_insert_360(2); // Para enviar al 360
                            let insert_response_insured_client360 = await this.insertUpdateExistingClient(ins_insured_client_360);

                            if (insert_response_insured_client360.P_NCODE == 1) {
                                Swal.fire('Información', insert_response_insured_client360.P_SMESSAGE, 'warning');
                                return;
                            }
                            else {

                                prospect_data[1].P_SCLIENT = insert_response_insured_client360.P_SCOD_CLIENT.trim();
                                console.log(prospect_data[1].P_SCLIENT);

                                //if (this.data_insured.address !== "" || this.data_insured.department.Id != "0" || this.data_insured.province.Id != "0" || this.data_insured.district.Id != "0") {
                                if (
                                    (this.data_insured.address == "" || this.data_insured.address == null) &&
                                    (this.data_insured.department.Id == undefined || this.data_insured.department.Id == null) &&
                                    (this.data_insured.province.Id == undefined || this.data_insured.province.Id == null) &&
                                    (this.data_insured.district.Id == undefined || this.data_insured.district.Id == null)
                                ) { }
                                else {
                                    const insured_ubication3 = this.formatterDataDirection(2);// Asegurado
                                    const response_insured_ubication3 = await this.insDirection(insured_ubication3);

                                    if (response_insured_ubication3.P_NCODE == 0 || response_insured_ubication3.P_NCODE == 2) {
                                        // EXITOSO
                                        // YA SE INSERTA EL CLIENTE, SE LE AGREGÓ LA DIRECCION
                                    } else {
                                        Swal.fire('Información', response_insured_ubication3.P_SMESSAGE, 'warning');
                                        return;
                                    }
                                }
                                // YA SE ACTUALIZO LA INFO DEl Contratante y se Inserto el Asegurado, ahora se crea prospectos.
                                let response_prospect3 = await this.insProspect(prospect_data);

                                if (response_prospect3.P_NCODE == 1) {
                                    Swal.fire('Información', response_prospect3.P_SMESSAGE, 'warning');
                                }
                                else {
                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                }
                            }
                        }
                    }
                } else {

                    this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {
                        if (res.P_NCODE == 1) {
                            Swal.fire('Información', res.P_SMESSAGE, 'error')
                        }
                        else {
                            let update_client_360_contractor = this.format_360(1); // Para enviar al 360 Contratante
                            let update_client_360_insured = this.format_360(2); // Para enviar al 360 Asegurado

                            this.clientInformationService.getCliente360(update_client_360_contractor).toPromise().then(
                                async res => {

                                    if (res.P_NCODE == 1) {
                                        Swal.fire('Información', res.P_SMESSAGE, 'warning')
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
                                            this.clientInformationService.getCliente360(update_client_360_insured).toPromise().then(

                                                async res2 => {

                                                    if (res2.P_NCODE == 1) {
                                                        Swal.fire('Información', res2.P_SMESSAGE, 'warning');
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
                                                            Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
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
                                                                P_SREFERENCE: "REFERENCIAL",
                                                                P_SNOM_DIRECCION: this.data_insured.address,
                                                                P_SORIGEN: "SCTRM",
                                                            }

                                                            this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                                                async res => {
                                                                    if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar
                                                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                                    } else {
                                                                        Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                    }
                                                                })
                                                        }
                                                    }
                                                });
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
                                                P_SREFERENCE: "REFERENCIAL",
                                                P_SNOM_DIRECCION: this.data_contractor.address,
                                                P_SORIGEN: "SCTRM",
                                            }
                                            this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                                async res => {
                                                    if (res.P_NCODE == 0 || res.P_NCODE == 2) {

                                                        this.clientInformationService.getCliente360(update_client_360_insured).toPromise().then(
                                                            async res2 => {

                                                                if (res2.P_NCODE == 1) {
                                                                    Swal.fire('Información', res2.P_SMESSAGE, 'warning')
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
                                                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
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
                                                                            P_SREFERENCE: "REFERENCIAL",
                                                                            P_SNOM_DIRECCION: this.data_insured.address,
                                                                            P_SORIGEN: "SCTRM",
                                                                        }

                                                                        this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                                                            async res => {
                                                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar
                                                                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                                                } else {
                                                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                                }
                                                                            })
                                                                    }
                                                                }
                                                            });
                                                    }
                                                    else {
                                                        Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                    }
                                                }
                                            )
                                        }
                                    }
                                });
                        }
                    })
                }
            }
        }
    }

    changeValue(value) {
        this.check_input_value = value;
        if (this.check_input_value == 0) {
            this.check_input_value = 0;
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
            this.data_insured.province = { Id: 0 };
        });
    }

    onSelectProvinceInsured() {

        this.insured_province_selected = true;
        this.list_data_insured_district = [];
        this.addressService.getDistrictList(this.data_insured?.province?.Id).toPromise().then(res => {
            this.list_data_insured_district = res;
            this.data_insured.district = { Id: null };
            this.data_insured.district = { Id: 0 };
        });
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
                                        await this.getIdecon(1);
                                    }
                                    else { // 2 Insured
                                        this.clearData(search_type);
                                        await this.cargarDatosInsured(res, search_type);
                                        await this.getIdecon(2);
                                    }
                                //}
                            }
                        }
                    }
                    else if (res.P_NCODE === "3") { // Se debe habilitar los campos para poder ingresar la Data y Crear el prospecto
                        this.isLoading = false;
                        Swal.fire('Información', 'No se encontró información, ingresar manualmente los datos.', 'error');
                        this.enableInputs(search_type);
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

        this.data_contractor.names = contracting_data.P_SFIRSTNAME;
        this.data_contractor.last_name = contracting_data.P_SLASTNAME;
        this.data_contractor.last_name2 = contracting_data.P_SLASTNAME2;
        this.data_contractor.sclient = contracting_data.P_SCLIENT;
        if (contracting_data.P_DBIRTHDAT == null){
            console.log("Fecha Nula");
        }else{
            let split_date = contracting_data.P_DBIRTHDAT.split('/');
            this.data_contractor.birthday_date = new Date(split_date[1] + '/' + split_date[0] + '/' + split_date[2]); //FECHA
        }
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

            await this.setdistricttContractor(parseInt(this.data_contractor.province.Id), parseInt(contracting_data.EListAddresClient[0].P_NMUNICIPALITY));
        }
        else {
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

    async consultProspect(search_type) {
        let params_cons = {
            P_SNUMBER_DOCUMENT: this.data_contractor.document_number,
            P_NTYPE_CLIENT: search_type
        };

        await this.vidaInversionService.consultProspect(params_cons).toPromise().then(
            async res => {

                this.check_input_value = res.P_NID_ASCON;
                if (this.check_input_value == 0) {
                    console.log("consultProspect res.P_SRELATION");
                    console.log(res.P_SRELATION);
                    this.data_insured.type_document = { Id: res.P_NTYPE_DOCUMENT };
                    this.data_insured.document_number = res.P_SNUMBER_DOCUMENT_INSURED.trim();
                    this.data_insured.relation = { COD_ELEMENTO: res.P_SRELATION }
                    // this.clickBuscar(search_type);//
                    this.clickBuscar(2);// Buscar Asegurado
                }
            }, error => {
                this.isLoading = false;
                Swal.fire('Información', 'Ocurrió un problema al solicitar su petición.', 'error');
            }
        )
    };

    async cargarDatosInsured(res: any, search_type: any) {

        const contracting_data = res.EListClient[0];

        this.data_insured.names = contracting_data.P_SFIRSTNAME;
        this.data_insured.last_name = contracting_data.P_SLASTNAME;
        this.data_insured.last_name2 = contracting_data.P_SLASTNAME2;
        this.data_insured.sclient = contracting_data.P_SCLIENT;
        //this.data_insured.relation = { COD_ELEMENTO: 0 }
        
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
            await this.setdistricttInsured(parseInt(this.data_insured.province.Id), parseInt(contracting_data.EListAddresClient[0].P_NMUNICIPALITY));

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
    };

    async setDepartmentContractor(id: any) {
        await this.addressService.getDepartmentList().toPromise().then(res => {
            this.list_data_contractor_department = res;
            this.data_contractor.department = { Id: id }
        })
    };

    async setProvinceContractor(department_id, province_id) {
        await this.addressService.getProvinceList(department_id).toPromise().then(async res => {
            this.list_data_contractor_province = res;
            this.data_contractor.province = { Id: province_id };
        })
    };

    async setdistricttContractor(province_id, municipality_id) {
        await this.addressService.getDistrictList(province_id).toPromise().then(async res => {
            this.list_data_contractor_district = res;
            this.data_contractor.district = { Id: parseInt(municipality_id) }
        });
    };


    async setDepartmentInsured(id: any) {
        await this.addressService.getDepartmentList().toPromise().then(res => {
            this.list_data_insured_department = res;
            this.data_insured.department = { Id: id }
        })
    };

    async setProvinceInsured(department_id, province_id) {
        await this.addressService.getProvinceList(department_id).toPromise().then(async res => {
            this.list_data_insured_province = res;
            this.data_insured.province = { Id: province_id };
        })
    };

    async setdistricttInsured(province_id, municipality_id) {
        await this.addressService.getDistrictList(province_id).toPromise().then(async res => {
            this.list_data_insured_district = res;
            this.data_insured.district = { Id: parseInt(municipality_id) }
        })
    };

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
    };


    enableInputs(search_type: any) { // Cuando el 360 no llama Info

        if (search_type == 1) {// Contratante
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

            this.data_contractor.type_document_disabled = false;
            this.data_contractor.document_number_disabled = false;
            this.data_contractor.birthday_date_disabled = false;
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

            this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_contractor_department = res;
                this.data_contractor.department = { Id: null }
                this.list_data_contractor_province = [];
                this.data_contractor.province = { Id: null }
                this.list_data_contractor_district = [];
                this.data_contractor.district = { Id: null }
                
            });

            this.new_client_contractor = true; // Indicamos que el cliente va ser nuevo

        } else if (search_type == 2) { // Asegurado
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

            this.addressService.getDepartmentList().toPromise().then(res => {
                this.list_data_insured_department = res;
                this.data_insured.department = { Id: null }
                this.list_data_insured_province = [];
                this.data_insured.province = { Id: null }
                this.list_data_insured_district = [];
                this.data_insured.district = { Id: null }
                this.data_insured.relation = { COD_ELEMENTO: 0 }
            });

            this.new_client_insured = true;  // Indicamos que el cliente va ser nuevo
        }
    };

    // !! NO BORRAR
    createProspect_LEGACY() { // NO BORRAR

        let formatter_data = this.formatter_data_prospect();
        let prospect_data = [];

        if (this.check_input_value == 1) { // Solo Contratante
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
                    if (result.isConfirmed) {

                        let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);

                        if (validate_error_contractor.cod_error == 1) {
                            Swal.fire('Información', validate_error_contractor.message_error, 'error');
                        }
                        else {
                            prospect_data.push(formatter_data.contractor_data);

                            if (this.new_client_contractor) { // Registrar nuevo cliente en el 360

                                let update_client_360 = this.formatter_insert_360(1); // Para enviar al 360

                                this.clientInformationService.getCliente360(update_client_360).toPromise().then(
                                    async res => {

                                        if (res.P_NCODE == 1) {
                                            Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                        }
                                        else {

                                            console.log(res);
                                            formatter_data.contractor_data.P_SCLIENT = res.P_SCOD_CLIENT.trim();

                                            this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {

                                                if (res.P_NCODE == 1) {
                                                    Swal.fire('Información', res.P_SMESSAGE, 'error')
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
                                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                    }
                                                    else {
                                                        let contractor_ubication = {
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
                                                        this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                                            async res => {
                                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) {
                                                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                                }
                                                                else {
                                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                }
                                                            }
                                                        )
                                                    }
                                                    // else {
                                                    //     Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                    //         result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                    // }
                                                }
                                            })
                                        }
                                    }
                                )
                            } else {
                                this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {
                                    if (res.P_NCODE == 1) {
                                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                                    }
                                    else {
                                        let update_client_360 = this.format_360(1); // Para enviar al 360
                                        this.clientInformationService.getCliente360(update_client_360).toPromise().then(
                                            async res => {
                                                if (res.P_NCODE == 1) {
                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
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
                                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
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
                                                            P_SREFERENCE: "REFERENCIAL",
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
                                                        this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                                            async res => {
                                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) {
                                                                    Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                        result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                                }
                                                                else {
                                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                }
                                                            }
                                                        )
                                                    }
                                                    // else {
                                                    //     Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                    //         result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
                                                    // }
                                                }
                                            })
                                    }
                                })
                            }

                        }

                    } else {
                        this.check_input_value = 0;
                        this.show_guide = true;
                        setTimeout(() => {
                            this.show_guide = false;
                        }, 5000);
                    }
                }
            )


        } else { // Contratante y Asegurado

            let validate_error_contractor = this.CONSTANTS.VALIDATE_CONTRACTOR(this.data_contractor, this.idecon_contractor);

            let validate_error_insured = this.CONSTANTS.VALIDATE_INSURED(this.data_insured, this.idecon_insured);
            let prospect_data = [];

            if (validate_error_contractor.cod_error == 1 || validate_error_insured.cod_error == 1) {
                Swal.fire('Información', `${validate_error_contractor.message_error}${validate_error_insured.message_error}`, 'error');
            }
            else {
                prospect_data.push(formatter_data.contractor_data);
                prospect_data.push(formatter_data.insured_data); // Agregando Asegurado

                // Primero se va Insertar el contratatnte si existen segun la Validacion, si es exitoso lo guardamos, si no es Exitoso mande el error;
                // Despues Lo mismo con el Asegurado; e igual se valida si fue exitoso o No, se va guardar el psclient igualmente

                // Si no hay error ni nada se llama al prospecto  y si no hay error ahi se pasa a insertar la Direccion  e igualmente se valida.
                if (this.new_client_contractor) {

                    let insert_client_360_contractor = this.formatter_insert_360(1);

                    this.clientInformationService.getCliente360(insert_client_360_contractor).toPromise().then(
                        async res => {

                            if (res.P_NCODE == 1) {
                                Swal.fire('Información', res.P_SMESSAGE, 'warning');
                                return;
                            }

                            else {
                                console.log(res);
                                // Como ya retorno el Sclient el Contratante
                                prospect_data[0].P_SCLIENT = res.P_SCOD_CLIENT.trim();
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
                                        P_SREFERENCE: "REFERENCIAL",
                                        P_SNOM_DIRECCION: this.data_contractor.address,
                                        P_SORIGEN: "SCTRM",
                                    }
                                    this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                        async res => {

                                            if (res.P_NCODE == 0 || res.P_NCODE == 2) {

                                                if (this.new_client_insured) { // SI el aSEGURAD ES NUEVO INSERTA AL ASEGURADO Y DE AHI LLAMA A PROSPECTO PARA CREAR

                                                    let insert_client_360_insured = this.formatter_insert_360(2);
                                                    this.clientInformationService.getCliente360(insert_client_360_insured).toPromise().then(
                                                        async res2 => {

                                                            if (res2.P_NCODE == 1) {
                                                                Swal.fire('Información', res2.P_SMESSAGE, 'warning')
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
                                                                        P_SREFERENCE: "REFERENCIAL",
                                                                        P_SNOM_DIRECCION: this.data_insured.address,
                                                                        P_SORIGEN: "SCTRM",
                                                                    }

                                                                    this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                                                        async res => {
                                                                            if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar

                                                                                this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {
                                                                                    if (res.P_NCODE == 1) {
                                                                                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                                                                                        return;
                                                                                    }
                                                                                    else { }
                                                                                })
                                                                            } else {
                                                                                Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                                return;
                                                                            }

                                                                        })
                                                                }
                                                            }

                                                        }
                                                    )
                                                }
                                                else { // No Se realizar la INSERCION DEL Nuevo Asegurado; Asi que se va actualizar la Info del Asegurado.
                                                }
                                            }
                                            else {
                                                Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                            }
                                        })
                                }
                                if (this.new_client_insured) { }
                                else { }
                            }
                        })
                }
                if (this.new_client_insured) { }
                this.vidaInversionService.insertProspect(prospect_data).subscribe((res) => {
                    if (res.P_NCODE == 1) {
                        Swal.fire('Información', res.P_SMESSAGE, 'error')
                    }
                    else {

                        let update_client_360_contractor = this.format_360(1); // Para enviar al 360 Contratante
                        let update_client_360_insured = this.format_360(2); // Para enviar al 360 Asegurado

                        this.clientInformationService.getCliente360(update_client_360_contractor).toPromise().then(
                            async res => {

                                if (res.P_NCODE == 1) {
                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
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
                                        Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                            result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })
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
                                            P_SREFERENCE: "REFERENCIAL",
                                            P_SNOM_DIRECCION: this.data_contractor.address,
                                            P_SORIGEN: "SCTRM",
                                        }
                                        this.vidaInversionService.saveDirection(contractor_ubication).toPromise().then(
                                            async res => {
                                                if (res.P_NCODE == 0 || res.P_NCODE == 2) {

                                                    this.clientInformationService.getCliente360(update_client_360_insured).toPromise().then(
                                                        async res2 => {

                                                            if (res2.P_NCODE == 1) {
                                                                Swal.fire('Información', res2.P_SMESSAGE, 'warning')
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
                                                                        P_SREFERENCE: "REFERENCIAL",
                                                                        P_SNOM_DIRECCION: this.data_insured.address,
                                                                        P_SORIGEN: "SCTRM",
                                                                    }

                                                                    this.vidaInversionService.saveDirection(insured_ubication).toPromise().then(
                                                                        async res => {
                                                                            if (res.P_NCODE == 0 || res.P_NCODE == 2) { // cod 2 No se enviaron datos nuevos para actualizar
                                                                                Swal.fire('Información', "El prospecto se creó exitosamente.", 'success').then(
                                                                                    result => { this.router.navigate(['extranet/vida-inversion/prospectos']); })

                                                                            } else {
                                                                                Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                                            }

                                                                        })
                                                                }
                                                            }
                                                        });
                                                }
                                                else {
                                                    Swal.fire('Información', res.P_SMESSAGE, 'warning')
                                                }
                                            }
                                        )
                                    }
                                }
                            });
                    }
                })
            }
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
}