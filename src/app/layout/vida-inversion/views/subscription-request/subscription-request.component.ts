import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { VidaInversionConstants } from "../../vida-inversion.constants";
import { ClientInformationService } from "../../../broker/services/shared/client-information.service";
import { Router } from "@angular/router";
import { ParameterSettingsService } from "../../../broker/services/maintenance/parameter-settings.service";
import { VidaInversionService } from "../../services/vida-inversion.service";

@Component({
    selector: 'app-subscription-request.component',
    templateUrl: './subscription-request.component.html',
    styleUrls: ['./subscription-request.component.css']
})
export class SubscriptionRequestComponent implements OnInit {
   
    date_ini = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    date_act: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
    isLoading: boolean = false;
    policyList: any = [];
    mensaje: any = "";
    CONSTANTS: any = VidaInversionConstants;
    requests_list: any = [];
    profile_id: any;
    constructor(public clientInformationService: ClientInformationService,
                private router: Router,
                private parameterSettingsService: ParameterSettingsService,
                private vidaInversionService: VidaInversionService) { }


    params: any = {
        P_RAMO: '',
        P_NPRODUCT: '',
        P_NPOLICY: '',
        P_DFEC_INI: new Date(),
        P_DFEC_FIN: new Date(),
        P_NTYPE_DOC: '',
        P_SNUM_DOC: '',
        P_SNAMES: '',
        P_NBRANCH: '',
    };
    
    SEARCH_PARAMS:any;
    async ngOnInit() {
        this.SEARCH_PARAMS_INITIAL()
        this.SEARCH_PARAMS.date_start = this.date_ini;
        this.SEARCH_PARAMS.date_end = this.date_act;
        this.profile_id = await this.getProfileProduct();
        console.log(this.profile_id)
  
        
    }
    codProducto = JSON.parse(localStorage.getItem('codProducto'))['productId'];
    changeDocumentType() {
        if (this.SEARCH_PARAMS.document_type.Id == undefined) {
            this.SEARCH_PARAMS.document_number = "";
            this.SEARCH_PARAMS.document_number_disabled = true;
        } else {
            this.SEARCH_PARAMS.document_number = "";
            this.SEARCH_PARAMS.document_number_disabled = false;
            if (this.SEARCH_PARAMS.document_type.Id == 2){
                this.SEARCH_PARAMS.number = 8
            }else{
                this.SEARCH_PARAMS.number = 12
            }
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
    suscripcion(NIDCOTIZACION) {
        this.router.navigate([`extranet/vida-inversion/nueva-solicitud-suscripcion/${NIDCOTIZACION}`]);
    };

    buscar() {
        this.mensaje = ""
        if(this.SEARCH_PARAMS.document_type.Id !== undefined){
            if (this.SEARCH_PARAMS.document_number == "") {
                this.mensaje = "Se debe ingresar el número de documento del Contratante.";
                Swal.fire({
                    title: 'Información',
                    text: this.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }) 
                } else if (this.SEARCH_PARAMS.document_type.Id == 2 && (this.SEARCH_PARAMS.document_number.length < 8 || this.SEARCH_PARAMS.document_number.length > 8)) {
                    this.mensaje = "Cantidad de caracteresdel DNI Incorrecto";
                    Swal.fire({
                        title: 'Información',
                        text: this.mensaje,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }) 
                } else if (this.SEARCH_PARAMS.document_type.Id == 4 && (this.SEARCH_PARAMS.document_number.length < 8)) {
                this.mensaje = "Cantidad de caracteresdel CE Incorrecto";
                Swal.fire({
                    title: 'Información',
                    text: this.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }) 
            }      
        }

        if (this.SEARCH_PARAMS.date_start > this.SEARCH_PARAMS.date_end) {
            this.mensaje = "La fecha final debe ser mayor a la fecha inicial.";
            Swal.fire({
                title: 'Información',
                text: this.mensaje,
                icon: 'error',
                confirmButtonText: 'Ok',
                allowOutsideClick: false
            }) 
        }
        
        if(this.mensaje == ""){
            this.params.P_RAMO = this.SEARCH_PARAMS.ramo,
        this.params.P_NPRODUCT = 10,
        this.params.P_NPOLICY = this.SEARCH_PARAMS.poliza,
        this.params.P_DFEC_INI = this.SEARCH_PARAMS.date_start,
        this.params.P_DFEC_FIN = this.SEARCH_PARAMS.date_end,
        this.params.P_NTYPE_DOC = this.SEARCH_PARAMS.document_type.Id,
        this.params.P_SNUM_DOC = this.SEARCH_PARAMS.document_number,
        this.params.P_SNAMES = this.SEARCH_PARAMS.contractorName,
        this.params.P_NBRANCH = 71, 
        

       

        this.vidaInversionService.ListarSolicitudesSuscripcion(this.params).subscribe(
            res => {
                if (res.Result.P_NCODE == 0) {
                    this.isLoading = false;
                    this.policyList =  res.Result.P_LIST
                    this.requests_list = this.policyList
                    if (this.policyList.length == 0) {
                        Swal.fire(
                            {
                                title: 'Información',
                                text: 'No se encontraron solicitudes con los filtros ingresados.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                allowOutsideClick: false,
                            }
                        ).then(
                            res => {
                                if (res.value) {
                                    return;
                                }
                            }
                        );
                    }
                } else {
                    this.isLoading = false;
                    Swal.fire('Información', res.Result.P_SMESSAGE, 'error')
                }
            },
            err => {
                this.isLoading = false;
                Swal.fire('Información', 'Ha ocurrido un error al obtener las pólizas.', 'error')
            }
        );
        }
        
        
        
        

        // this.requests_list = [{
        //     BRANCH: "Vida Inversión de Largo Plazo",
        //     PRODUCT: "Vida Inversión Global Protecta",
        //     NPOLICY: 7110000001,
        //     CONTRACTOR_DESC:'Alex Gallozo Flores',
        //     CONTRACTOR: "DNI-72566970",
        //     CONTRIBUTION: "$ 70,000",
        //     TYPE_FUND_DESC: "Moderado",
        //     DESC_FREQUENCY: "Único",
        //     DSTARTDATE: "10/11/2024",
        //     NIDCOTIZACION: "20480"
        // }]
        

    }

    SEARCH_PARAMS_INITIAL () {
        this.SEARCH_PARAMS = {
            ramo: "Vida Individual de Largo Plazo",
            product: "Vida Inversión Global Protecta",
            poliza: "",
            date_start: new Date,
            date_end: new Date,
            document_type: {
                Id: 0,
                Name: ""
            },
            document_number: "",
            contractorName: "",
    
            document_type_disabled: false,
            document_number_disabled: true,
            number: 0
        }
    }
}



