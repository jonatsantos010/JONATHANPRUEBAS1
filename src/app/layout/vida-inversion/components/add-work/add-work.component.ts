import { Component, OnInit, Input, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { ClientInformationService } from '../../../broker/services/shared/client-information.service';
import { CommonMethods } from '@root/layout/broker/components/common-methods';
import { VidaInversionConstants } from '../../vida-inversion.constants';
import { QuotationService } from '../../../broker/services/quotation/quotation.service';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
    selector: 'app-add-work',
    templateUrl: './add-work.component.html',
    styleUrls: ['./add-work.component.scss']
})

export class AddWorkComponent implements OnInit {
    @Output() workAdded: EventEmitter<any> = new EventEmitter();
    @Input() public reference: any;
    CONSTANTS: any = VidaInversionConstants;
    COD_PROD_PROFILE = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    work_list: any = [];
    TYPE_CURRENCY: any;
    work_cod_currency: any;
    parse_amount: any;
    work: any;
    toggle_edit_work: boolean;
    toggle_add_work: boolean;
    type_client: any;
    list_document_type: any = [];
    list_civilStatus: any = [];
    ORGANIZATION: any;
    idCotizacion: any; //this.reference.quotation_id
    sclient: any; //this.reference.sclient
    constructor(
        public clientInformationService: ClientInformationService,
        public quotationService: QuotationService
    ) { }

    async ngOnInit() {
        
        // this.getWorks()
        this.idCotizacion = this.reference.quotation_id;//19970;//
        this.sclient = this.reference.sclient;//"02000084584251";//
        this.ORGANIZATION = [
            {id: 0, value: "Seleccione"},
            {id: 1, value: "Organismo Público"},
            {id: 2, value: "Organismo Internacional"},
        ]
        this.work = {
            id: 0,
            place_work: "",
            name_type_organization: {id: 0, value: "Seleccione"},
            position: "",
            code_work: "",
            ini_date: "",
            fin_date: "",
            currency: "",
            salary: ""
        }
        this.toggle_add_work = true;
        this.toggle_edit_work = false;

        await this.clientInformationService.getDocumentTypeList(this.COD_PROD_PROFILE).toPromise().then((result) => {
            this.list_document_type = result;
        }).catch((err) => {
        });

        await this.clientInformationService.getCivilStatusList().toPromise().then((result) => {
            this.list_civilStatus = result;
        }).catch((err) => {
        });

  

        this.TYPE_CURRENCY = [
            { id: 0, value: '' },
            { id: 1, value: 'S/' },
            { id: 2, value: '$' },
        ]
        this.work.currency = { NNATIONALITY: 0 };
  
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
                    name_type_organization: this.work.name_type_organization.value,
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
            name_type_organization: item_work.name_type_organization.value,
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


            if (item.id == this.work.id) {

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

            }

            return item;
        });

        this.work_list = new_list;
        this.toggle_edit_work = false;
        this.toggle_add_work = true;
        this.work = {}



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


    changeStyleCredit2(value) {
        let resnpose = this.CONSTANTS.changeStyleCredit(value);
        this.parse_amount = resnpose.parse_amount;
        this.work.salary = resnpose.amount;
    }

    validarTextoKeyPress(event: any, type: string) {
        if (type == '') return;
        CommonMethods.textValidate(event, type);
    }

    completo() {
        this.workAdded.emit(true);
    }
    SaveWork = () => {

        let P_WORK_LIST: any = [];

        if (this.work_list.length > 0) {
            this.work_list.forEach(
                lista => {
                    let dataPepWork: any = {};
                    dataPepWork.P_NID_COTIZACION = this.idCotizacion;
                    dataPepWork.P_SCLIENT = this.sclient;
                    dataPepWork.P_SCENTRAL_WORK = lista.place_work;
                    dataPepWork.P_STYPE_ORGANIZATION = lista.name_type_organization;
                    dataPepWork.P_SJOB_POSITION = lista.position;
                    dataPepWork.P_NCODE = lista.code_work;
                    dataPepWork.P_DINI_WORK = lista.ini_date;
                    dataPepWork.P_DFIN_WORK = lista.fin_date;
                    dataPepWork.P_NCURRENCY = lista.cod_currency;
                    dataPepWork.P_NSALARY = lista.salary;
                    P_WORK_LIST.push(dataPepWork);
                }
            );
        }
        if(this.work_list.length < 3){
            Swal.fire('Información', "Debe ingresar 3 trabajos.", 'info');
        }else{
            this.quotationService.postWorks(P_WORK_LIST).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        Swal.fire('Información', "Los datos se registraron correctamente.", 'success');
                        this.completo()
                        this.reference.close();
                    } else {
                        Swal.fire('Información', "Error al registrar los datos.", 'error');
                    }
                }
            );
        }

        

    }

    // async getWorks() {
    //     let cotClie: any = {
    //         P_NID_COTIZACION: 20480, P_SCLIENT: "02000072566970"
    //     };

    //     await this.quotationService.getDatoWorks(cotClie).toPromise().then(
    //         res => {
    //                     let i = 1;
    //                     res.forEach(
    //                         lista => {
    //                             const listWork: any = {}
    //                             listWork.id = i++;
    //                             listWork.place_work = lista.P_SCENTRAL_WORK;
    //                             listWork.name_type_organization = lista.P_STYPE_ORGANIZATION;
    //                             listWork.position = lista.P_SJOB_POSITION;
    //                             listWork.code_work = lista.P_NCODE;
    //                             listWork.ini_date = lista.P_DINI_WORK;
    //                             listWork.fin_date = lista.P_DFIN_WORK;
    //                             listWork.salary = lista.P_NSALARY;
    //                             listWork.cod_currency = lista.P_NCURRENCY;
    //                             listWork.desc_currency = lista.P_SCURRENCY;
    //                             this.work_list.push(listWork);
    //                         }
    //                     );
    //         }
    //     );
    // }
}