import { Component, OnInit, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { CommonMethods } from '@root/layout/broker/components/common-methods';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
    selector: 'app-add-pep',
    templateUrl: './add-pep.component.html',
    styleUrls: ['./add-pep.component.scss']
})

export class AddPepComponent implements OnInit {

    @Input() public reference: any;
    CONSTANTS: any = VidaInversionConstants;
    COD_PROD_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];

    pep_data: any; // Objeto el cual va tener los datos de la primera parte del formulario
    work_list: any = [];
    TYPE_DOCUMENT: any;
    list_nationality_pep: any;
    RESIDENCE: any;
    list_civil_status_pep: any;

    TYPE_CURRENCY: any;

    work_cod_currency: any;
    parse_amount: any;

    work: any;
    toggle_edit_work: boolean;
    toggle_add_work: boolean;

    idCotizacion: any; //this.reference.quotation_id
    sclient: any; //this.reference.sclient
    type_client: any;
    list_document_type: any = [];
    list_relationship_type: any = [];
    list_nacionality: any = [];
    list_civilStatus: any = [];
    relationship: any;

    constructor(
        public clientInformationService: ClientInformationService,
        public quotationService: QuotationService
    ) { }

    async ngOnInit() {
        this.idCotizacion = this.reference.quotation_id;//19970;//
        this.sclient = this.reference.sclient;//"02000084584251";//
        this.type_client = 2;//this.reference.type_client;

        this.pep_data = {
            relationship_type: "",
            names: "",
            concat_last_names: "",
            document_type: "",
            document_number: "",
            birthday_date: "",
            civil_status: "",
            nationality: "",
            residence: "",
            address: "",
            pep_condition: "SI",
            pep_condition_origin: "",
        }

        this.work = {
            id: 0,
            place_work: "",
            name_type_organization: "",
            position: "",
            code_work: "",
            ini_date: "",
            fin_date: "",
            currency: "",
            salary: ""
        }

        this.toggle_add_work = true;
        this.toggle_edit_work = false;

        /*
        this.work_list = [
            {
                id: 1, place_work: "TRABAJO 1", name_type_organization: "ORGANISMO PÚBLICO", position: "CARGO 1", code_work: "001", ini_date: "21/10/2019", fin_date: "20/10/2020", salary: "7,000", cod_currency: 2, desc_currency: "$"
            },
            {
                id: 2, place_work: "TRABAJO 2", name_type_organization: "ORGANISMO PÚBLICO", position: "CARGO 2", code_work: "002", ini_date: "21/10/2020", fin_date: "20/10/2021", salary: "8,000", cod_currency: 1, desc_currency: "S/."
            }
        ];
        */

        this.relationship = {
            P_NIDDOC_TYPE: 2,
            P_SIDDOC: '99999999'
        }

        await this.clientInformationService.getContactTypeList(this.relationship).toPromise().then((result) => {
            this.list_relationship_type = result;
        }).catch((err) => {
        });

        this.TYPE_DOCUMENT = [
            { codigo: "0", valor: 'SELECCIONE' },
        ]

        await this.clientInformationService.getDocumentTypeList(this.COD_PROD_PROFILE).toPromise().then((result) => {
            this.list_document_type = result;
        }).catch((err) => {
        });

        this.list_nationality_pep = [
            { codigo: "0", valor: 'SELECCIONE' },
        ]

        await this.clientInformationService.getNationalityList().toPromise().then((result) => {
            this.list_nacionality = result;
        }).catch((err) => {
        });

        await this.clientInformationService.getCivilStatusList().toPromise().then((result) => {
            this.list_civilStatus = result;
        }).catch((err) => {
        });

        /*
        this.RESIDENCE = [
            { codigo: "0", valor: 'SELECCIONE' },
        ]*/


        this.TYPE_CURRENCY = [
            { id: 0, value: '' },
            { id: 1, value: 'S/' },
            { id: 2, value: '$' },
        ]

        this.work.currency = { NNATIONALITY: 0 };

        await this.getPep();
    }

    public VALIDATE_WORK(work): any {
        let diaActualNoFormat = moment(new Date()).toDate();
        let diaActual = new Date(diaActualNoFormat.getFullYear(), diaActualNoFormat.getMonth(), diaActualNoFormat.getDate());
        let response = { cod_error: 0, message_error: "" }

        if (work.place_work == "") {
            response.message_error += 'Se debe ingresar el centro de trabajo. <br>';
            response.cod_error = 1;
        }

        if (work.name_type_organization == "") {
            response.message_error += 'Se debe ingresar el tipo de organización. <br>';
            response.cod_error = 1;
        }

        if (work.position == "") {
            response.message_error += 'Se debe ingresar el cargo. <br>';
            response.cod_error = 1;
        }

        if (work.code_work == "") {
            response.message_error += 'Se debe ingresar el código del trabajo. <br>';
            response.cod_error = 1;
        }

        if (work.ini_date == "") {
            response.message_error += 'Se debe ingresar la fecha de inicio. <br>';
            response.cod_error = 1;
        }

        if (work.fin_date == "") {
            response.message_error += 'Se debe ingresar la fecha de cese. <br>';
            response.cod_error = 1;
        }

        if (work.ini_date > diaActual) {
            response.message_error += 'La fecha de inicio no puede ser mayor a la fecha actual. <br>';
            response.cod_error = 1;
        }

        if (work.fin_date > diaActual) {
            response.message_error += 'La fecha de cese no puede ser mayor a la fecha actual. <br>';
            response.cod_error = 1;
        }

        if (work.ini_date > work.fin_date) {
            response.message_error += 'La fecha de inicio no puede ser mayor a la fecha de cese. <br>';
            response.cod_error = 1;
        }

        if (work.salary == "") {
            response.message_error += 'Se debe ingresar el sueldo. <br>';
            response.cod_error = 1;
        }

        if (work.currency == "" || work.currency.id == "") {
            response.message_error += 'Es obligatorio seleccionar el tipo de moneda. <br>';
            response.cod_error = 1;
        }

        return response;
    }

    addWork = () => {
        const customswal = Swal.mixin({
            confirmButtonColor: "553d81",
            focusConfirm: false,
        })

        if (this.work_list.length < 3) {
            let validate_error = this.VALIDATE_WORK(this.work);

            if (validate_error.cod_error == 1) {
                Swal.fire('Información', validate_error.message_error, 'error');
            } else {
                let itemTrabajo = {
                    id: 0,
                    place_work: this.work.place_work,
                    name_type_organization: this.work.name_type_organization,
                    position: this.work.position,
                    code_work: this.work.code_work,
                    ini_date: this.work.ini_date.getDate().toString().padStart(2, '0') + '/' + (this.work.ini_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.work.ini_date.getFullYear(),
                    fin_date: this.work.fin_date.getDate().toString().padStart(2, '0') + '/' + (this.work.fin_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.work.fin_date.getFullYear(),
                    salary: this.work.salary,
                    cod_currency: this.work.currency.id,
                    desc_currency: this.work.currency.value
                }

                this.work_list.push(itemTrabajo);

                let count = 0;

                for (var i = 0; i < this.work_list.length; i++) {
                    this.work_list[i].id = ++count;
                }

                customswal.fire('Información', "Se agregó el trabajo correctamente.", 'success');
            }
        } else {
            customswal.fire('Información', "Solo puede agregar 3 trabajos como máximo.", 'error');
        }
    }

    editWork = (item_work) => {
        var partesFecha_1 = item_work.ini_date.split('/');
        var dia = parseInt(partesFecha_1[0]); // Parsea el día como entero
        var mes = parseInt(partesFecha_1[1]) - 1; // Parsea el mes (resta 1 ya que en JavaScript los meses van de 0 a 11)
        var anio = parseInt(partesFecha_1[2]); // Parsea el año
        var fecha_1 = new Date(anio, mes, dia);

        var partesFecha_2 = item_work.fin_date.split('/');
        var dia = parseInt(partesFecha_2[0]); // Parsea el día como entero
        var mes = parseInt(partesFecha_2[1]) - 1; // Parsea el mes (resta 1 ya que en JavaScript los meses van de 0 a 11)
        var anio = parseInt(partesFecha_2[2]); // Parsea el año
        var fecha_2 = new Date(anio, mes, dia);


        this.work = {
            id: item_work.id,
            place_work: item_work.place_work,
            name_type_organization: item_work.name_type_organization,
            position: item_work.position,
            code_work: item_work.code_work,
            ini_date: fecha_1,
            fin_date: fecha_2,
            salary: item_work.salary,
            currency: { id: item_work.cod_currency, value: item_work.desc_currency }
        }

        this.toggle_edit_work = true;
        this.toggle_add_work = false;
    }

    updateWork = () => {
        const new_list = this.work_list.map((item) => {
            // console.log("Item0:");
            // console.log(item.id);

            if (item.id == this.work.id) {
                //const prev_date1 = item.ini_date;
                //const prev_date2 = item.fin_date;
                //item = this.work;
                let validate_error = this.VALIDATE_WORK(this.work);

                if (validate_error.cod_error == 1) {
                    Swal.fire('Información', validate_error.message_error, 'error');
                } else {
                    item.id = this.work.id;
                    item.place_work = this.work.place_work;
                    item.name_type_organization = this.work.name_type_organization;
                    item.position = this.work.position;
                    item.code_work = this.work.code_work;
                    item.ini_date = this.work.ini_date.getDate().toString().padStart(2, '0') + '/' + (this.work.ini_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.work.ini_date.getFullYear();
                    item.fin_date = this.work.fin_date.getDate().toString().padStart(2, '0') + '/' + (this.work.fin_date.getMonth() + 1).toString().padStart(2, '0') + '/' + this.work.fin_date.getFullYear();
                    item.cod_currency = this.work.currency.id;
                    item.desc_currency = this.work.currency.value;
                    item.salary = this.work.salary;
                }
                // console.log("Item:");
                // console.log(item);
                // return item
            }
            // else {
            //     return item
            // }
            return item;
        });

        this.work_list = new_list;
        this.toggle_edit_work = false;
        this.toggle_add_work = true;
        this.work = {}

        // console.log(this.work_list);

        const customswal = Swal.mixin({
            confirmButtonColor: "553d81",
            focusConfirm: false,
        });

        customswal.fire('Información', "El trabajo fue editado.", 'success');
    }

    cancelWork = () => {
        this.work = {};
        this.toggle_edit_work = false;
        this.toggle_add_work = true;
    }

    deleteWork = (item_id) => {
        Swal.fire({
            title: 'Información',
            text: 'Seguro que deseas eliminar este registro?',
            icon: 'question',
            iconColor: '#ed6e00',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar',
            allowEscapeKey: false,
        }).then(
            result => {
                if (result.isConfirmed) {
                    const id = this.work_list.findIndex((element: any) => element.id == item_id);
                    if (id != -1) {
                        this.work_list.splice(id, 1);
                    }
                    Swal.fire('Información', "Se eliminó el trabajo correctamente.", 'success');
                }
            }
        );
    }

    SavePep = () => {
        let diaActualNoFormat = moment(new Date()).toDate();
        let diaActual = new Date(diaActualNoFormat.getFullYear(), diaActualNoFormat.getMonth(), diaActualNoFormat.getDate());
        let diaMinus18 = moment(diaActual).subtract(18, 'years').toDate();
        let dataPep: any = {};

        if (this.pep_data.birthday_date > diaMinus18) {
            Swal.fire('Información', "El PEP no puede ser menor de edad.", 'error');
            return;
        }
        if (this.pep_data.relationship_type.NCODIGO == undefined || this.pep_data.relationship_type.NCODIGO == "") {
            Swal.fire('Información', "Parentesco debe estar lleno.", 'error');
            return;
        }
        if (this.pep_data.names == undefined || this.pep_data.names == "") {
            Swal.fire('Información', "El campo nombres debe estar completo.", 'error');
            return;
        }
        if (this.pep_data.concat_last_names == undefined || this.pep_data.concat_last_names == "") {
            Swal.fire('Información', "El campo apellidos debe estar completo.", 'error');
            return;
        }
        if (this.pep_data.document_type.Id == undefined || this.pep_data.document_type.Id == "") {
            Swal.fire('Información', "Seleccione un tipo de documento.", 'error');
            return;
        }
        if (this.pep_data.document_number.length < 7 && this.pep_data.document_type.Id == 2) {
            Swal.fire('Información', "Debe ingresar 8 digitos para el DNI.", 'error');
            return;
        }
        if (this.pep_data.document_number.length < 7 && this.pep_data.document_type.Id == 4) {
            Swal.fire('Información', "Debe ingresar 8 o 12 digitos para el Carnet de extrangería.", 'error');
            return;
        }
        if (this.pep_data.birthday_date == undefined || this.pep_data.birthday_date == "") {
            Swal.fire('Información', "Seleccione su fecha de nacimiento.", 'error');
            return;
        }
        if (this.pep_data.civil_status.NCIVILSTA == undefined ||this.pep_data.civil_status.NCIVILSTA == "") {
            Swal.fire('Información', "Seleccione un estado civil.", 'error');
            return;
        }
        if (this.pep_data.nationality.NNATIONALITY == undefined ||this.pep_data.nationality.NNATIONALITY == "") {
            Swal.fire('Información', "Seleccione una nacionalidad.", 'error');
            return;
        }
        if (this.pep_data.residence == undefined || this.pep_data.residence == "") {
            Swal.fire('Información', "El campo residencia debe estar completo.", 'error');
            return;
        }
        if (this.pep_data.address == undefined || this.pep_data.address == "") {
            Swal.fire('Información', "El campo dirección debe estar completo.", 'error');
            return;
        }
        if (this.pep_data.pep_condition_origin == undefined || this.pep_data.pep_condition_origin == "") {
            Swal.fire('Información', "El campo origen de condición PEP debe estar completo.", 'error');
            return;
        }

        dataPep.P_NID_COTIZACION = this.idCotizacion;
        dataPep.P_SCLIENT = this.sclient;
        dataPep.P_NTYPE_CLIENT = this.type_client;
        dataPep.P_NRELATIONSHIP = this.pep_data.relationship_type.NCODIGO;
        dataPep.P_SNAMES = this.pep_data.names;
        dataPep.P_SCLIENAME = this.pep_data.concat_last_names;
        dataPep.P_NIDDOC_TYPE = this.pep_data.document_type.Id;
        dataPep.P_SIDDOC = this.pep_data.document_number;
        dataPep.P_DBIRTHDAT = this.pep_data.birthday_date;
        dataPep.P_NCIVILSTA = this.pep_data.civil_status.NCIVILSTA;
        dataPep.P_NNATIONALITY = this.pep_data.nationality.NNATIONALITY;
        dataPep.P_SRESIDENCIA = this.pep_data.residence;
        dataPep.P_ADDRESS = this.pep_data.address;
        dataPep.P_NCONDITION_PEP = this.pep_data.pep_condition == 'SI' ? 1 : 0;
        dataPep.P_SORIGIN_CONDITION_PEP = this.pep_data.pep_condition_origin;
        dataPep.P_WORK_LIST = [];

        if (this.work_list.length > 0) {
            this.work_list.forEach(
                lista => {
                    let dataPepWork: any = {};
                    // dataPepWork.P_NID_TRABAJOS = lista.id;
                    dataPepWork.P_NID_COTIZACION = this.idCotizacion;
                    dataPepWork.P_SCLIENT = this.sclient; // lista.P_SCLIENT;
                    dataPepWork.P_SCENTRAL_WORK = lista.place_work;
                    dataPepWork.P_STYPE_ORGANIZATION = lista.name_type_organization;
                    dataPepWork.P_SJOB_POSITION = lista.position;
                    dataPepWork.P_NCODE = lista.code_work;
                    dataPepWork.P_DINI_WORK = lista.ini_date;
                    dataPepWork.P_DFIN_WORK = lista.fin_date;
                    dataPepWork.P_NCURRENCY = lista.cod_currency;
                    dataPepWork.P_NSALARY = lista.salary;
                    dataPep.P_WORK_LIST.push(dataPepWork);
                }
            );
        }

        //console.log(dataPep);

        this.quotationService.insUpdDatosPep(dataPep).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    Swal.fire('Información', "Los datos se registraron correctamente.", 'success');
                    this.reference.close(this.pep_data);
                } else {
                    Swal.fire('Información', "Error al registrar los datos.", 'error');
                }
            }
        );

        /* Swal.fire('Información', "Se registró correctamente.", 'success');
        this.reference.close(this.pep_data);*/
    }

    async getPep() {
        let cotClie: any = {
            P_NID_COTIZACION: this.idCotizacion,
            P_SCLIENT: this.sclient
        };

        await this.quotationService.getDatosPep(cotClie).toPromise().then(
            res => {
                if (res.P_NCODE == 0) {
                    this.pep_data.relationship_type = { NCODIGO: res.P_NRELATIONSHIP };
                    this.pep_data.names = res.P_SNAMES;
                    this.pep_data.concat_last_names = res.P_SCLIENAME;
                    this.pep_data.document_type = { Id: res.P_NIDDOC_TYPE };
                    this.pep_data.document_number = res.P_SIDDOC;
                    // this.pep_data.birthday_date = res.P_DBIRTHDAT;

                    let split_birthdat_pep = res.P_DBIRTHDAT.split('/');
                    let dia_res_pep = parseInt(split_birthdat_pep[0]); // Parsea el día como entero
                    let mes_res_pep = parseInt(split_birthdat_pep[1]) - 1; // Parsea el mes (resta 1 ya que en JavaScript los meses van de 0 a 11)
                    let anio_res_pep = parseInt(split_birthdat_pep[2]); // Parsea el año
                    let birthdat_pep = new Date(anio_res_pep, mes_res_pep, dia_res_pep);

                    this.pep_data.birthday_date = birthdat_pep;
                    this.pep_data.civil_status = { NCIVILSTA: res.P_NCIVILSTA };
                    this.pep_data.nationality = { NNATIONALITY: res.P_NNATIONALITY };
                    this.pep_data.residence = res.P_SRESIDENCIA;
                    this.pep_data.address = res.P_ADDRESS;
                    this.pep_data.pep_condition = res.P_NCONDITION_PEP == 1 ? 'SI' : 'NO';
                    this.pep_data.pep_condition_origin = res.P_SORIGIN_CONDITION_PEP;
                    //this.work_list = [];

                    if (res.P_WORK_LIST != null && res.P_WORK_LIST.length > 0) {
                        //console.log('Entra a listado');
                        let i = 1;

                        res.P_WORK_LIST.forEach(
                            lista => {
                                const listWork: any = {}
                                listWork.id = i++;
                                listWork.place_work = lista.P_SCENTRAL_WORK;
                                listWork.name_type_organization = lista.P_STYPE_ORGANIZATION;
                                listWork.position = lista.P_SJOB_POSITION;
                                listWork.code_work = lista.P_NCODE;
                                listWork.ini_date = lista.P_DINI_WORK;
                                listWork.fin_date = lista.P_DFIN_WORK;
                                listWork.salary = lista.P_NSALARY;
                                listWork.cod_currency = lista.P_NCURRENCY;
                                listWork.desc_currency = lista.P_SCURRENCY;
                                this.work_list.push(listWork);
                                //console.log(this.work_list);
                            }
                        );
                    }
                }
                else {
                    this.pep_data.relationship_type = { NCODIGO: "" };
                    this.pep_data.document_type = { Id: "" };
                    this.pep_data.civil_status = { NCIVILSTA: "" };
                    this.pep_data.nationality = { NNATIONALITY: "" };
                }
                // else {
                //     Swal.fire('Información', "Error al obtener los datos.", 'error');
                // }
            }
        );
    }

    changeStyleCredit2(value) {
        // let format_amount = parseInt(this.work.salary.replace(/,/g, ''));
        // this.parse_amount = CommonMethods.formatNUMBER(format_amount);
        // this.work.salary = this.parse_amount;
        // if (this.work.salary.toUpperCase() == "NAN") {
        //     this.work.salary = '';
        // }
        let resnpose = this.CONSTANTS.changeStyleCredit(value);
        this.parse_amount = resnpose.parse_amount;
        this.work.salary = resnpose.amount;
    }

    validarTextoKeyPress(event: any, type: string) {
        if (type == '') return;
        CommonMethods.textValidate(event, type);
    }

    changeDocumentType() {
        this.pep_data.document_number = "";
    }
}