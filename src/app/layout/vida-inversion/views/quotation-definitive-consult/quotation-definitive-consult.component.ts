import { Component, OnInit } from '@angular/core';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ParameterSettingsService } from '../../../broker/services/maintenance/parameter-settings.service';

@Component({
    selector: 'app-quotation-definitive-consult',
    templateUrl: './quotation-definitive-consult.component.html',
    styleUrls: ['./quotation-definitive-consult.component.scss']
})
export class QuotationDefinitiveConsultComponent implements OnInit {
    profile_id: any;
    CONSTANTS: any = VidaInversionConstants;
    PRODUCT: any;
    TYPE_CLIENT: any;
    date_ini: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    date_act: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    date_max: Date = new Date(new Date().setDate(new Date().getDate() + 1));
    data: Array<any>;
    quotation_def_list: any = [];
    quotation_list: any = [];
    currentPage = 1;
    itemsPerPage = 5;
    totalItems = 0;
    maxSize = 15;
    mensaje: any = "";
    isLoading: boolean = false;
    current_day: any = new Date;

    SEARCH_PARAMS = {
        product: {
            codigo: "10",
            valor: 'VIDA INVERSIÓN GLOBAL PROTECTA'
        },

        quotation_number: "",
        date_start: new Date,
        date_end: new Date,

        client_type: {
            codigo: "0",
            valor: 'AMBOS'
        },

        document_type: {
            Id: "",
            Name: ""
        },

        document_number: "",
        names: "",
        last_name: "",
        last_name2: "",

        date_start_disabled: false,
        date_end_disabled: false,
        client_type_disabled: false,
        document_type_disabled: false,
        document_number_disabled: false,
        names_disabled: false,
        last_name_disabled: false,
        last_name2_disabled: false,
    }

    codProducto = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    username = JSON.parse(localStorage.getItem('currentUser'))['username'];
    profile = JSON.parse(localStorage.getItem('currentUser'))['profileId'];

    constructor(
        public clientInformationService: ClientInformationService,
        private quotationService: QuotationService,
        private parameterSettingsService: ParameterSettingsService,
        private router: Router
    ) { }

    async ngOnInit() {
        this.profile_id = await this.getProfileProduct();
        this.PRODUCT = [
            { codigo: "10", valor: 'VIDA INVERSIÓN GLOBAL PROTECTA' },
        ];

        this.TYPE_CLIENT = [
            { codigo: "0", valor: 'AMBOS' },
            { codigo: "1", valor: 'CONTRATANTE' },
            { codigo: "2", valor: 'ASEGURADO' },
        ];

        this.SEARCH_PARAMS.date_start = this.date_ini;
        this.SEARCH_PARAMS.date_end = this.date_act;
        this.SEARCH_PARAMS.document_number_disabled = true;

        // let params = {
        //     P_NBRANCH: this.CONSTANTS.RAMO,
        //     P_NPRODUCT: this.SEARCH_PARAMS.product.codigo,
        //     P_NID_COTIZACION: this.SEARCH_PARAMS.quotation_number == "" ? 0 : this.SEARCH_PARAMS.quotation_number == null ? 0 : this.SEARCH_PARAMS.quotation_number,
        //     P_DFECHA_DESDE: this.SEARCH_PARAMS.date_start.getDate().toString().padStart(2, '0') + "/" + (this.SEARCH_PARAMS.date_start.getMonth() + 1).toString().padStart(2, '0') + "/" + this.SEARCH_PARAMS.date_start.getFullYear(),
        //     P_DFECHA_HASTA: this.SEARCH_PARAMS.date_end.getDate().toString().padStart(2, '0') + "/" + (this.SEARCH_PARAMS.date_end.getMonth() + 1).toString().padStart(2, '0') + "/" + this.SEARCH_PARAMS.date_end.getFullYear(),
        //     P_STIP_CLI: this.SEARCH_PARAMS.client_type.codigo,
        //     P_NTIP_DOC: this.SEARCH_PARAMS.document_type.Id == "" ? 0 : 0,
        //     P_SNUM_DOC: this.SEARCH_PARAMS.document_number == "" ? "0" : "0",
        //     P_SNOMBRES: this.SEARCH_PARAMS.names == "" ? "0" : "0",
        //     P_APELLIDO_PAT: this.SEARCH_PARAMS.last_name == "" ? "0" : "0",
        //     P_APELLIDO_MAT: this.SEARCH_PARAMS.last_name2 == "" ? "0" : "0",
        // }

        // await this.getQuotationList(params);
    }

    changeDocumentType() {
        if (this.SEARCH_PARAMS.document_type.Id == undefined) {
            this.SEARCH_PARAMS.document_number = "";
            this.SEARCH_PARAMS.document_number_disabled = true;
        } else {
            this.SEARCH_PARAMS.document_number = "";
            this.SEARCH_PARAMS.document_number_disabled = false;
        }
    }

    async getQuotationList(request) {
        await this.quotationService.getQuotationDefinitiveConsult(request).toPromise().then(
            async res => {
                if (res.P_NCODE == 0) {
                    this.data = res.C_TABLE;
                    this.currentPage = 1;
                    this.totalItems = this.data.length;
                    this.quotation_def_list = this.data.slice(
                        (this.currentPage - 1) * this.itemsPerPage,
                        this.currentPage * this.itemsPerPage);
                }
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
    async buscar() {
        this.mensaje = "";

        if (this.SEARCH_PARAMS.quotation_number.length > 0) {

        } else {
            if ((this.SEARCH_PARAMS.date_start > this.SEARCH_PARAMS.date_end) ||
                (this.SEARCH_PARAMS.document_type.Id != "" && this.SEARCH_PARAMS.document_type.Id != null && this.SEARCH_PARAMS.document_number == "" || this.SEARCH_PARAMS.document_number == null) ||
                ((this.SEARCH_PARAMS.document_type.Id == "2" || this.SEARCH_PARAMS.document_type.Id == "4") && this.SEARCH_PARAMS.document_number.length < 8)) {

                if (new Date(this.SEARCH_PARAMS.date_start) > new Date(this.SEARCH_PARAMS.date_end)) {
                    this.mensaje = "La fecha 'FECHA COT. DEFINITIVA DESDE' no puede ser mayor que la fecha 'FECHA COT. DEFINITIVA HASTA'.";
                }

                if (this.SEARCH_PARAMS.document_type.Id != "" && this.SEARCH_PARAMS.document_type.Id != null && this.SEARCH_PARAMS.document_number == "" || this.SEARCH_PARAMS.document_number == null) {
                    this.mensaje = "Se debe ingresar el número de documento del Contratante o Asegurado.";
                }

                if ((this.SEARCH_PARAMS.document_type.Id == "2" || this.SEARCH_PARAMS.document_type.Id == "4") && (this.SEARCH_PARAMS.document_number.length > 0 && this.SEARCH_PARAMS.document_number.length < 8)) {
                    if (this.SEARCH_PARAMS.document_type.Id == "2") {
                        this.mensaje = "Se debe ingresar 8 dígitos para " + this.SEARCH_PARAMS.document_type.Name + ".";
                    }

                    if (this.SEARCH_PARAMS.document_type.Id == "4") {
                        this.mensaje = "Cantidad de caracteres del " + this.SEARCH_PARAMS.document_type.Name + " incorrecto.";
                    }
                }

                swal.fire({
                    title: 'Información',
                    text: this.mensaje,
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                    }
                });
            }
        }

        if (this.mensaje == "") {
            this.isLoading = true;
            this.data = [];
            this.quotation_def_list = [];

            let params_search = {
                P_NBRANCH: this.CONSTANTS.RAMO,
                P_NPRODUCT: this.SEARCH_PARAMS.product.codigo,
                P_NID_COTIZACION: this.SEARCH_PARAMS.quotation_number == "" ? 0 : this.SEARCH_PARAMS.quotation_number == null ? 0 : this.SEARCH_PARAMS.quotation_number,
                P_DFECHA_DESDE: this.SEARCH_PARAMS.date_start.getDate().toString().padStart(2, '0') + "/" + (this.SEARCH_PARAMS.date_start.getMonth() + 1).toString().padStart(2, '0') + "/" + this.SEARCH_PARAMS.date_start.getFullYear(),
                P_DFECHA_HASTA: this.SEARCH_PARAMS.date_end.getDate().toString().padStart(2, '0') + "/" + (this.SEARCH_PARAMS.date_end.getMonth() + 1).toString().padStart(2, '0') + "/" + this.SEARCH_PARAMS.date_end.getFullYear(),
                P_STIP_CLI: this.SEARCH_PARAMS.client_type.codigo,
                P_NTIP_DOC: this.SEARCH_PARAMS.document_type.Id == "" ? 0 : this.SEARCH_PARAMS.document_type.Id == undefined ? 0 : this.SEARCH_PARAMS.document_type.Id,
                P_SNUM_DOC: this.SEARCH_PARAMS.document_number == "" ? "0" : this.SEARCH_PARAMS.document_number == null ? "0" : this.SEARCH_PARAMS.document_number,
                P_SNOMBRES: this.SEARCH_PARAMS.names == "" ? "0" : this.SEARCH_PARAMS.names == null ? "0" : this.SEARCH_PARAMS.names,
                P_APELLIDO_PAT: this.SEARCH_PARAMS.last_name == "" ? "0" : this.SEARCH_PARAMS.last_name == null ? "0" : this.SEARCH_PARAMS.last_name,
                P_APELLIDO_MAT: this.SEARCH_PARAMS.last_name2 == "" ? "0" : this.SEARCH_PARAMS.last_name2 == null ? "0" : this.SEARCH_PARAMS.last_name2,
            }

            await this.getQuotationList(params_search);
            this.isLoading = false;

            if (this.SEARCH_PARAMS.quotation_number.length > 0 && this.quotation_def_list.length == 0) {
                swal.fire({
                    title: 'Información',
                    text: "La cotización no es definitiva o no existe en el sistema.",
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                    }
                });
            }
        }
    }

    quotation_numberKeyPress(event: any) {
        if (event.target.value != "" && event.target.value != null) {
            this.SEARCH_PARAMS.date_start_disabled = true;
            this.SEARCH_PARAMS.date_end_disabled = true;
            this.SEARCH_PARAMS.client_type_disabled = true;
            this.SEARCH_PARAMS.document_type_disabled = true;
            this.SEARCH_PARAMS.document_number_disabled = true;
            this.SEARCH_PARAMS.names_disabled = true;
            this.SEARCH_PARAMS.last_name_disabled = true;
            this.SEARCH_PARAMS.last_name2_disabled = true;
        } else {
            this.SEARCH_PARAMS.date_start_disabled = false;
            this.SEARCH_PARAMS.date_end_disabled = false;
            this.SEARCH_PARAMS.client_type_disabled = false;
            this.SEARCH_PARAMS.document_type_disabled = false;
            this.SEARCH_PARAMS.document_number_disabled = false;
            this.SEARCH_PARAMS.names_disabled = false;
            this.SEARCH_PARAMS.last_name_disabled = false;
            this.SEARCH_PARAMS.last_name2_disabled = false;
        }
    }

    limpiar() {
        this.SEARCH_PARAMS.quotation_number = "";
        this.SEARCH_PARAMS.date_start = this.date_ini;
        this.SEARCH_PARAMS.date_end = this.date_act;
        this.SEARCH_PARAMS.client_type = {
            codigo: "0",
            valor: 'AMBOS'
        }

        this.SEARCH_PARAMS.document_type = {
            Id: "",
            Name: ""
        },

        this.SEARCH_PARAMS.document_number = "";
        this.SEARCH_PARAMS.names = ""
        this.SEARCH_PARAMS.last_name = ""
        this.SEARCH_PARAMS.last_name2 = ""
    }

    visualizar() { }

    emitir(item,mode) {
        this.router.navigate([`extranet/vida-inversion/emitir/${item.NCOTIZACION}/${item.NID_PROSPECT}/${mode}`]);
    };

    pageChangedNV(currentPageNV) {
        this.currentPage = currentPageNV;
        this.quotation_def_list = this.data.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );
    }
}
