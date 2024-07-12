import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DataBeneficiary } from '../../models/DataBeneficiary';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { AddressService } from '../../../broker/services/shared/address.service';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { VidaInversionService } from '../../services/vida-inversion.service';
import { QuotationService } from '../../../../layout/broker/services/quotation/quotation.service';

@Component({
    selector: 'app-add-beneficiary',
    templateUrl: './add-beneficiary.component.html',
    styleUrls: ['./add-beneficiary.component.scss']
})
export class AddBeneficiaryComponent implements OnInit {

    @Input() public reference: any;

    CONSTANTS: any = VidaInversionConstants;
    TYPE_DOCUMENT: any;
    NATIONALITY: any;
    GENERER: any;
    VINC: any;
    diaActual = new Date();
    diaAntiguo = new Date("01/01/1900")

    COD_PROD_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];

    inactivityTimer: any;

    list_data_beneficiary_department: any = [];
    list_data_beneficiary_province: any = [];
    list_data_beneficiary_district: any = [];

    data_beneficiary: DataBeneficiary = {
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
        relation: "",
        assignment: "",

        type_document_disabled: false,
        document_number_disabled: false,
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
        relation_disabled: false
    };

    constructor(
        public clientInformationService: ClientInformationService,
        public addressService: AddressService,
        public vidainversionservice: VidaInversionService,
        public quotationService: QuotationService,
    ) { }

    ngOnInit(): void {
        this.diaActual = new Date(this.diaActual.getFullYear(), this.diaActual.getMonth(), this.diaActual.getDate());

        if (this.reference.type == "edit") {

            this.data_beneficiary.type_document = { Id: Number(this.reference.item.type_doc) };
            this.data_beneficiary.document_number = this.reference.item.siddoc;
            this.data_beneficiary.nationality = { NNATIONALITY: Number(this.reference.item.nationality.NNATIONALITY) };

            this.data_beneficiary.names = this.reference.item.sfirstname.toUpperCase();
            this.data_beneficiary.last_name = this.reference.item.slastname.toUpperCase();
            this.data_beneficiary.last_name2 = this.reference.item.last_name2.toUpperCase();

            this.data_beneficiary.birthday_date = this.reference.item.birthday_date;
            this.data_beneficiary.gender = { SSEXCLIEN: Number(this.reference.item.gender.id) };

            this.data_beneficiary.relation = { COD_ELEMENTO: Number(this.reference.item.relation.NCODIGO) }

            this.data_beneficiary.email = this.reference.item.email;
            this.data_beneficiary.phone = this.reference.item.phone;
            this.data_beneficiary.assignment = this.reference.item.assignment;
        }
    }

    valBenefeciary() {

        let response = { cod_error: 0, message_error: "" }


        if (this.reference.type == "add") {

            let validate_doc_number = this.reference.list_benefeciary.filter((element) => { // Esto solo se ha verificado en Cotizacion Definitiva
                if (element.siddoc == this.data_beneficiary.document_number) {
                    return element;
                }
            });

            if (validate_doc_number.length > 0) {
                response.cod_error = 1;
                response.message_error += 'No se puede volver a registrar este documento. <br>';
            };

        }

        if (!this.data_beneficiary.assignment) {
            response.cod_error = 1;
            response.message_error += 'El campo de asignación no puede estar vacio. <br>';
        }

        if (Number.parseFloat(this.data_beneficiary.assignment) <= 0) {
            response.cod_error = 1;
            response.message_error += 'El campo de asignación debe ser mayor a 0. <br>';
        }

        if (this.data_beneficiary.type_document.Id == undefined) {
            response.cod_error = 1;
            response.message_error += 'El campo tipo de documento es obligatorio.<br>';
        }

        if (!this.data_beneficiary.document_number) {
            response.cod_error = 1;
            response.message_error += 'El campo número de documento es obligatorio.<br>';
        }


        if (this.data_beneficiary.document_number) {

            if (this.reference.contratactor_doc?.document_number == this.data_beneficiary.document_number) {
                response.cod_error = 1;
                response.message_error += 'El beneficiario no puede ser igual al contratante.<br>';
            };

            if (this.reference.insured_doc?.document_number == this.data_beneficiary.document_number) {
                response.cod_error = 1;
                response.message_error += 'El beneficiario no puede ser igual al asegurado.<br>';
            };
        }

        if (!(this.data_beneficiary.nationality.NNATIONALITY)) {
            response.cod_error = 1;
            response.message_error += 'El campo nacionalidad es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.names)) {
            response.cod_error = 1;
            response.message_error += 'El campo nombres es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.last_name)) {
            response.cod_error = 1;
            response.message_error += 'El campo apellido paterno es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.last_name2)) {
            response.cod_error = 1;
            response.message_error += 'El campo apellido materno es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.birthday_date)) {
            response.cod_error = 1;
            response.message_error += 'El campo fecha de nacimiento es obligatorio.<br>';
        } else {
            if (new Date(this.data_beneficiary.birthday_date) >= this.diaActual) {
                response.cod_error = 1;
                response.message_error += 'El campo fecha de nacimiento no puede ser mayor o igual a la fecha actual.<br>';
            }
            if (new Date(this.data_beneficiary.birthday_date) < this.diaAntiguo) {
                response.cod_error = 1;
                response.message_error += 'La fecha ingresada no es válida.<br>';
            }
        }

        if (this.data_beneficiary.gender.codigo == '') {
            response.cod_error = 1;
            response.message_error += 'El campo sexo es obligatorio.<br>';
        }

        if (this.data_beneficiary.relation.codigo == '') {
            response.cod_error = 1;
            response.message_error += 'El campo vínculo es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.email)) {
            response.cod_error = 1;
            response.message_error += 'El campo correo electrónico es obligatorio.<br>';
        }

        if (!(this.data_beneficiary.phone)) {
            response.cod_error = 1;
            response.message_error += 'El campo celular es obligatorio.<br>';
        }

        if (this.data_beneficiary.phone.toString().length != 9) {
            response.cod_error = 1;
            response.message_error += 'El campo celular no tiene la cantidad de digitos correctos.<br>';
        }

        // Agregar Validacion la cual verifica que no sea igual el Contratatante Ni el Asegurado a los Beneficiarios
        // const original_sum_percentage_participation = this.reference.list_benefeciary.reduce((acc, current) => acc + parseInt(current?.assignment), 0); // Obtiene la suma de los beneficiarios sin modificar

        const sum_percentage_participation = this.reference.list_benefeciary.reduce(
            (acc, current) => {
                
                // if ((current.type_document.Id == this.data_beneficiary.type_document.Id) && (current.document_number == this.data_beneficiary.document_number) && (this.reference.type == "edit")) {
                
                if ((current.type_doc == this.data_beneficiary.type_document.Id) && (current.siddoc == this.data_beneficiary.document_number) && (this.reference.type == "edit")) {
                    return acc + parseFloat(this.data_beneficiary.assignment);
                }
                else {
                    return acc + parseFloat(current?.assignment);
                }
            }, 0
        );

        if ((parseFloat(this.data_beneficiary.assignment) + parseFloat(sum_percentage_participation)) > 100 && this.reference.type == "add") {
            response.cod_error = 1;
            response.message_error += 'El porcentaje de asignación del beneficiario que está ingresando supera el 100%. <br>';
        }

        if (parseFloat(sum_percentage_participation) > 100 && (this.reference.type == "edit")) {
            response.cod_error = 1;
            response.message_error += 'El nuevo porcentaje de asignación superará el 100%. <br>';
        }

        if (parseFloat(this.data_beneficiary.assignment) > 100) {
            response.cod_error = 1;
            response.message_error += 'La asignación no puede superar el 100%. <br>';
        }

        return response;
    }

    addBenefeciary() {
        const validate_benefeciary = this.valBenefeciary();
        // EL AF INDICA QUE SE TIENE QUE VALIDAR TODOS LOS CAMPOS DE FORMA OBLIGATORIA
        // ADEMAS LA ASGINACION DEBE SER MAYOR A 0 Y MENOR A 100

        if (validate_benefeciary.cod_error === 1) {
            Swal.fire({
                html: validate_benefeciary.message_error,
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false
            })
        }

        else {
            Swal.fire({
                text: this.reference.type == "edit" ? 'Se editó el beneficiario correctamente.' : 'Se agregó el beneficiario correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false
            }).then(res => {
                this.reference.close(this.data_beneficiary);
            })
        }
    }

    async clickBuscar() {

        let params_360 = {
            P_TipOper: 'CON',
            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_NIDDOC_TYPE: this.data_beneficiary.type_document.Id,
            P_SIDDOC: this.data_beneficiary.document_number,
        };


        // if (res.EListClient.length == 0) {
        //     Swal.fire({
        //         text: res.P_SMESSAGE,
        //         icon: 'error',
        //         confirmButtonText: 'Aceptar',
        //         allowOutsideClick: false,
        //         allowEscapeKey: false,
        //         showCloseButton: false
        //     })
        //     // this.clearData();
        // } else {

        //     if (res.EListClient.length === 1) {
        //         if (res.EListClient[0].P_SIDDOC != null) {
        //             await this.cargarDatosBeneficiary(res);
        //         }
        //     }
        // }
        await this.clientInformationService.getCliente360(params_360).toPromise().then(
            async res => {

                if (res.P_NCODE === "0") {
                    await this.cargarDatosBeneficiary(res);
                }
                else {
                    Swal.fire({
                        text: res.P_SMESSAGE,
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showCloseButton: false
                    })
                    this.disableInputsBeneficiary();
                    this.clearInputsBeneficiary();
                }


            })
    }

    async cargarDatosBeneficiary(res: any) {

        const beneficiary_data = res.EListClient[0];

        this.data_beneficiary.names = beneficiary_data.P_SFIRSTNAME.toUpperCase();
        this.data_beneficiary.last_name = beneficiary_data.P_SLASTNAME.toUpperCase();
        this.data_beneficiary.last_name2 = beneficiary_data.P_SLASTNAME2.toUpperCase();
        this.data_beneficiary.sclient = beneficiary_data.P_SCLIENT;

        let split_date = beneficiary_data.P_DBIRTHDAT.split('/');
        this.data_beneficiary.birthday_date = new Date(split_date[1] + '/' + split_date[0] + '/' + split_date[2]); //FECHA


        this.data_beneficiary.gender = { SSEXCLIEN: beneficiary_data.P_SSEXCLIEN };
        this.data_beneficiary.civil_status = { NCIVILSTA: beneficiary_data.P_NCIVILSTA };

        this.data_beneficiary.nationality = { NNATIONALITY: beneficiary_data.P_NNATIONALITY };


        if (beneficiary_data.EListEmailClient.length >= 1) {
            this.data_beneficiary.email = beneficiary_data.EListEmailClient[0].P_SE_MAIL;
        }

        if (beneficiary_data.EListPhoneClient.length >= 1) {
            this.data_beneficiary.phone = beneficiary_data.EListPhoneClient[0].P_SPHONE;
        }
    this.enableInputsBeneficiary();
    }

    changeDocumentType() {
        this.data_beneficiary.document_number = "";
    }

    disableInputsBeneficiary() {
        this.data_beneficiary.type_document_disabled = false;
        this.data_beneficiary.document_number_disabled = false;
        this.data_beneficiary.birthday_date_disabled = false;
        this.data_beneficiary.names_disabled = false;
        this.data_beneficiary.last_name_disabled = false;
        this.data_beneficiary.last_name2_disabled = false;
        this.data_beneficiary.gender_disabled = false;
        this.data_beneficiary.civil_status_disabled = false;
        this.data_beneficiary.nationality_disabled = false;
        this.data_beneficiary.phone_disabled = false;
        this.data_beneficiary.email_disabled = false;
        this.data_beneficiary.address_disabled = false;
        this.data_beneficiary.relation_disabled = false;
    }

    enableInputsBeneficiary() {
        this.data_beneficiary.type_document_disabled = true;
        this.data_beneficiary.document_number_disabled = true;
        this.data_beneficiary.birthday_date_disabled = true;
        this.data_beneficiary.names_disabled = true;
        this.data_beneficiary.last_name_disabled = true;
        this.data_beneficiary.last_name2_disabled = true;
        this.data_beneficiary.gender_disabled = true;
        this.data_beneficiary.civil_status_disabled = true;
        this.data_beneficiary.nationality_disabled = true;
        this.data_beneficiary.phone_disabled = true;
        this.data_beneficiary.email_disabled = true;
        this.data_beneficiary.address_disabled = true;
    }

    clearInputsBeneficiary() {

        this.data_beneficiary.names = "";
        this.data_beneficiary.last_name = "";
        this.data_beneficiary.last_name2 = "";
        this.data_beneficiary.sclient = "";
        this.data_beneficiary.birthday_date = new Date();

        this.data_beneficiary.gender = { SSEXCLIEN: "0" };
        this.data_beneficiary.civil_status = { NCIVILSTA: "0" };
        this.data_beneficiary.nationality = { NNATIONALITY: "0" };
        this.data_beneficiary.email = "";
        this.data_beneficiary.phone = "";
        this.data_beneficiary.relation  = { COD_ELEMENTO: "0"}
        this.data_beneficiary.assignment = "";
    }

}
