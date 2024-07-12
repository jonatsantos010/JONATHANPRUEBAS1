import { Component, OnInit } from "@angular/core";
import { VidaInversionConstants } from "../../vida-inversion.constants";
import { PolicyService } from "../../../broker/services/policy/policy.service";
import { QuotationService } from "../../../broker/services/quotation/quotation.service";
import { DataSuscription, DataSuscriptionRequest } from "../../models/DataSuscriptionRequest";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { VidaInversionService } from "../../services/vida-inversion.service";
import { ClientInformationService } from "../../../broker/services/shared/client-information.service";
import Swal from "sweetalert2";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddPropertyComponent } from "../../components/add-property/add-property.component";
import { AddDeclarationComponent } from "../../components/add-declaration/add-declaration.component";
import { AddRelationComponent } from "../../components/add-relation/add-relation.component";
import { AddWorkComponent } from "../../components/add-work/add-work.component";
import { ParameterSettingsService } from "../../../broker/services/maintenance/parameter-settings.service";
import { AddFileComponent } from "../../components/add-file/add-file.component";

@Component({
    selector: 'app-new-subscription-request.component',
   templateUrl: './new-subscription-request.component.html',
   styleUrls: ['./new-subscription-request.component.css']
})
export class NewSubscriptionRequestComponent implements OnInit{
    urlTree:any;
    P_NID_COTIZACION: any;
    isLoading: boolean = false;
    current_step: number;
    IS_PEP = false;
    comentario: string = "con fe";
    value_work: any = 0;
    value_properties: any = 0;
    value_relationship: any = 0;
    value_declaration: any = 0;
    randomItem: string = '';
    showCoordinadorBtn: boolean = false;
    showGerenteBtn: boolean = false;
    showScoreBtn: boolean = true;
    scoring: string;
    montoSucripcion:string;
    works: any;
    dataSuscription:DataSuscription = {
        P_NID_COTIZACION: 0,
        P_NID_PROC: "",
        P_NTYPE_SCORE: 0,
        P_NSTATE_SOLID: 0,
        P_NMONTO_SUSCRIPCION: 0,
        P_NAPORTE_TOTAL: 0,
        P_NVALOR_CUOTA: 0,
        P_DCHANGDAT: new Date,
        P_DCOMPDATE: new Date,
    };
    data:DataSuscriptionRequest = {
        APELLIDO_MATERNO: "",
        APELLIDO_PATERNO: "",
        APORTE_TOTAL: 0,
        NOMBRE: "",
        NUMERO_DOCUMENTO: "",
        NUMERO_POLIZA: "",
        PRODUCTO: "",
        RAMO: "",
        TIPO_DOCUMENTO:"",
        SCLIENT:"",
        TIPO_DOCUMENTO_ID:0,
        MONTO_SUSCRIPCION: 0
    }
    dateIdecon: any;
    aporteFormat: string;
    montoSuscripcion:number;
    profile_id: any;
    mensaje: string;
    quotation_id:any;
    sclient:any;
    esMayorDosMeses: boolean;
    constructor( private quotationService: QuotationService,   
        private activatedRoute: ActivatedRoute,
        private vidaInversionService: VidaInversionService,
        public clientInformationService: ClientInformationService,
        private modalService: NgbModal,
        private router: Router,
        private parameterSettingsService: ParameterSettingsService,
        ){}
    async ngOnInit() {
        this.P_NID_COTIZACION = parseInt(this.activatedRoute.snapshot.params["cotizacion"]);

        await this.quotationService.getRequestSuscription(this.P_NID_COTIZACION).toPromise().then((result) => {
            this.data = result.GenericResponse[0];
        }).catch((err) => {
        });
        this.sclient= this.data.SCLIENT
        this.profile_id = await this.getProfileProduct();
        this.dateIdecon = await this.getDate();
        this.esMayorDosMeses = await this.mayorDosMeses()
        this.isLoading = true;
     
        this.SelDatosPEPVIGP();
  
        let items: string[] = ['Bajo', 'Medio', 'Alto'];
        const randomIndex = Math.floor(Math.random() * items.length);
        this.randomItem = items[randomIndex];
        this.scoring = this.randomItem 
        this.quotation_id = this.P_NID_COTIZACION
      
        const params_360 = {
            P_TipOper: 'CON',
            P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id'],
            P_NIDDOC_TYPE: this.data.TIPO_DOCUMENTO_ID,
            P_SIDDOC: this.data.NUMERO_DOCUMENTO
        };

        await this.clientInformationService.getCliente360(params_360).toPromise().then(async res => {
            if (res.P_NCODE == "0") {
                if (res.EListClient[0].P_SCLIENT == null) {
                }
                else {
                    if (res.EListClient.length === 1) {
                        if (res.EListClient[0].P_SIDDOC != null) {
                            await this.invokeServiceExperia(1);
                            // await this.getWorldCheck(1); 
                            await this.getIdecon(1);
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
        if (this.idecon_contractor.pep == "SÍ"|| this.world_check_contractor.pep == "SÍ"){
            this.IS_PEP = true;
        }
        this.isLoading = false;
        this.aporteFormat = this.formatearPrecio(this.data.APORTE_TOTAL)
        this.dataSuscription.P_NID_COTIZACION = this.P_NID_COTIZACION
        this.dataSuscription.P_NTYPE_SCORE = 1
        this.dataSuscription.P_NSTATE_SOLID = 1
        this.dataSuscription.P_NMONTO_SUSCRIPCION = this.data.MONTO_SUSCRIPCION
        this.dataSuscription.P_NAPORTE_TOTAL = this.data.APORTE_TOTAL
        this.dataSuscription.P_NVALOR_CUOTA = 1.01
        this.dataSuscription.P_DCHANGDAT = new Date()
        this.dataSuscription.P_DCOMPDATE = new Date()
   
    }  
    async mayorDosMeses() {
        const fechaActual: Date = new Date();
        const fechaRevision: Date = new Date(this.dateIdecon);
        fechaRevision.setMonth(fechaRevision.getMonth() + 2);
        if (fechaActual.getTime() >  fechaRevision.getTime()) {
          return true
        } else {
            return false
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

    async getDate() {
        let profile;
        await this.vidaInversionService.getDateIdecon(this.sclient).toPromise()
            .then(
                (res) => {
                    profile = res[0].DEFFECDATE;
                },
                err => {
                    console.log(err)
                }
            );

        return profile;
    }

    CONSTANTS: any = VidaInversionConstants;
    current_day: any = new Date;
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


    async calculateRiskScoring(){
     

        this.dataSuscription.P_NSTATE_SOLID = 3
        console.log(this.randomItem)
        if((this.randomItem == 'Medio' || this.randomItem == 'Alto') && Number(this.data.APORTE_TOTAL) <= 10000){
            this.dataSuscription.P_NTYPE_SCORE = 2
            this.dataSuscription.P_NSTATE_SOLID = 3
            this.derivadoACoordinador()
            
        } else if ((this.randomItem == 'Medio' || this.randomItem == 'Alto') && Number(this.data.APORTE_TOTAL) > 10000){
            this.dataSuscription.P_NTYPE_SCORE = 3
            this.dataSuscription.P_NSTATE_SOLID = 3
            this.derivadoAGerente()
        }else {
            await this.vidaInversionService.InsertarSuscripcion(this.dataSuscription).toPromise().then(
                async (res) => res
        );
        }   
       
    }
    
    InsUpdCotiStatesVIGP = () => {
            let item = {
                P_NID_COTIZACION: this.quotation_id,
                P_SSTATREGT_COT: 6,
                P_SCOMMENT: this.comentario,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
            this.quotationService.InsUpdCotiStatesVIGP(item).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        //this.comentario = null;
                        Swal.fire('Información', res.P_SMESSAGE, 'info');
                        this.router.navigate(["extranet/vida-inversion/bandeja-solicitudes/"]);
                    } else {
                        Swal.fire('Información', res.P_SMESSAGE, 'error');
                    }
                
                },
                err => {
                    Swal.fire('Información', 'Ha ocurrido un error.', 'error');
                }
            );
    }
    InsCommentsCotiVIGP = (state, mess) => {
     
            let item = {
                P_NID_COTIZACION: this.quotation_id,
                P_NID_STATE: state,
                P_NUSERCODE: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
             this.quotationService.SP_INS_DERI(item).subscribe(
                res => {
                    this.dataSuscription.P_NID_PROC = res.NID_PROC
                    if (res.P_NCODE == 0) {
                        this.comentario = null;
                        console.log(state)
                      if(state == 6 || state == 9){
                        this.vidaInversionService.InsertarSuscripcion(this.dataSuscription).toPromise().then(
                            async (res) => res
                        );
                      }else if(state == 7 || state == 10){
                        this.dataSuscription.P_NSTATE_SOLID = 1
                        this.vidaInversionService.InsertarSuscripcion(this.dataSuscription).toPromise().then(
                            async (res) => res
                        );
                      }else if(state == 8 || state == 11){
                      
                        this.dataSuscription.P_NSTATE_SOLID = 2
                        this.vidaInversionService.InsertarSuscripcion(this.dataSuscription).toPromise().then(
                            async (res) => res
                        );
                      }
                      
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
                                if (result.value) {
                                    this.router.navigate(['extranet/vida-inversion/bandeja-solicitudes']);
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

    // 6
    derivadoACoordinador = () => {
        this.InsCommentsCotiVIGP(6, 'La solicitud de suscripción requiere de aprobación del Coordinador.');
    }


    // 7
    aprobadoPorCoordinador = () => {
        this.InsCommentsCotiVIGP(7, 'Se aprobó correctamente por el Coordinador.');
    }

    // 8
    rechazadoPorCoordinador = () => {
        this.InsCommentsCotiVIGP(8, 'Se rechazó correctamente por el Coordinador.');
    }

    // 9
    derivadoAGerente = () => {
        this.InsCommentsCotiVIGP(9, 'La solicitud de suscripción requiere de aprobación del Gerente Comercial.');
    }

    // 10
    aprobadoPorGerente = () => {
        this.InsCommentsCotiVIGP(10, 'Se aprobó correctamente por el Gerente Comercial.');
    }

    // 11
    rechazadoPorGerente = () => {
        this.InsCommentsCotiVIGP(11, 'Se rechazó correctamente por el Gerente Comercial.');
    }


    previusStep(value) {
        if (value == 2) {
            if (this.idecon_contractor.pep == 'SÍ' || this.idecon_contractor.famPep == 'SÍ' || this.world_check_contractor.pep == 'SÍ' ) {
                this.current_step = value;
            }
            else {
                this.current_step = 1;  
            }
        }
        else {
            this.current_step = value;
        }
    }
    async getIdecon(client_type: number) {
        let datosIdecom = {};

        let consultIdecom = {
            P_SCLIENT: "",
            P_NOTHERLIST: 0,
            P_NISPEP: 0,
            P_NISFAMPEP: 0,
            P_NNUMBERFAMPEP: 0,
            P_SUPDCLIENT: '0'
        };

        let sclientIdecom = { P_SCLIENT: this.data.SCLIENT }

        if (client_type == 1) {
            datosIdecom = {
                name: this.data.NOMBRE + ' ' + this.data.APELLIDO_PATERNO + ' ' + this.data.APELLIDO_MATERNO,
                idDocNumber: this.data.NUMERO_DOCUMENTO,
                percentage: 100,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaIdecom(sclientIdecom).toPromise().then(
                async (res) => {
                    consultIdecom = {
                        P_SCLIENT: res.P_SCLIENT.toString(),
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_NISFAMPEP: res.P_NISFAMPEP,
                        P_NNUMBERFAMPEP: res.P_NNUMBERFAMPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }
                    if (this.esMayorDosMeses || consultIdecom.P_SCLIENT == null || consultIdecom.P_SCLIENT == "") {
                        await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                            async (res) => {
                                consultIdecom = {
                                    P_SCLIENT: this.data.SCLIENT,
                                    P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                    P_NISPEP: res.isPep ? 1 : 0,
                                    P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                    P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                    P_SUPDCLIENT: '0'
                                }

                                this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                                await this.vidaInversionService.updateIdecom(consultIdecom).toPromise().then();
                            }
                            
                        );
                    } else {
                        if (this.esMayorDosMeses || consultIdecom.P_SUPDCLIENT == "1") {
                            await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                                async (res) => {
                                    consultIdecom = {
                                        P_SCLIENT: this.data.SCLIENT,
                                        P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                        P_NISPEP: res.isPep ? 1 : 0,
                                        P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                        P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                        P_SUPDCLIENT: '1'
                                    }
                                    this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                    this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                    this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                    await this.vidaInversionService.updateIdecom(consultIdecom).toPromise().then();
                                }
                            );
                        } else{
                            this.idecon_contractor.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                            this.idecon_contractor.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';
                        }
                    }
                }
            );
        } else {
            datosIdecom = {
                name: this.data.NOMBRE + ' ' + this.data.APELLIDO_PATERNO + ' ' + this.data.APELLIDO_MATERNO,
                idDocNumber: this.data.NUMERO_DOCUMENTO,
                percentage: 100,
                typeDocument: ""
            }

            await this.vidaInversionService.ConsultaIdecom(sclientIdecom).toPromise().then(
                async (res) => {
                    consultIdecom = {
                        P_SCLIENT: res.P_SCLIENT.toString(),
                        P_NOTHERLIST: res.P_NOTHERLIST,
                        P_NISPEP: res.P_NISPEP,
                        P_NISFAMPEP: res.P_NISFAMPEP,
                        P_NNUMBERFAMPEP: res.P_NNUMBERFAMPEP,
                        P_SUPDCLIENT: res.P_SUPDCLIENT
                    }

                    if (this.esMayorDosMeses || consultIdecom.P_SCLIENT == null || consultIdecom.P_SCLIENT == "") {
                        await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                            async (res) => {
                                consultIdecom = {
                                    P_SCLIENT: this.data.SCLIENT.toString(),
                                    P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                    P_NISPEP: res.isPep ? 8 : 7,
                                    P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                    P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                    P_SUPDCLIENT: '0'
                                }

                                this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                await this.vidaInversionService.updateIdecom(consultIdecom).toPromise().then();
                                this.isLoading = false;
                            }
                        );
                    } else {
                        if (this.esMayorDosMeses || consultIdecom.P_SUPDCLIENT == "1") {
                            await this.vidaInversionService.getIdecon(datosIdecom).toPromise().then(
                                async (res) => {
                                    consultIdecom = {
                                        P_SCLIENT: this.data.SCLIENT,
                                        P_NOTHERLIST: res.isOtherList ? 1 : 0,
                                        P_NISPEP: res.isPep ? 1 : 0,
                                        P_NISFAMPEP: res.isFamPep ? 1 : 0,
                                        P_NNUMBERFAMPEP: res.isIdNumberFamPep ? 1 : 0,
                                        P_SUPDCLIENT: '1'
                                    }

                                    this.idecon_insured.otherList = consultIdecom.P_NOTHERLIST == 1 ? 'SÍ' : 'NO';
                                    this.idecon_insured.pep = consultIdecom.P_NISPEP == 1 ? 'SÍ' : 'NO';
                                    this.idecon_insured.famPep = consultIdecom.P_NISFAMPEP == 1 ? 'SÍ' : 'NO';

                                    await this.vidaInversionService.updateIdecom(consultIdecom).toPromise().then();
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

    //     let sclientWorldCheck = { P_SCLIENT: this.data.SCLIENT }CCC

    //     if (client_type == 1) {
    //         datosWorldCheck = {
    //             name: this.data.NOMBRE + ' ' + this.data.APELLIDO_PATERNO + ' ' + this.data.APELLIDO_MATERNO,
    //             idDocNumber: this.data.NUMERO_DOCUMENTO,
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
    //                                 P_SCLIENT: this.data.SCLIENT,
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
    //                                     P_SCLIENT: this.data.SCLIENT,
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
    //             name: this.data.NOMBRE + ' ' + this.data.APELLIDO_PATERNO + ' ' + this.data.APELLIDO_MATERNO,
    //             idDocNumber: this.data.NUMERO_DOCUMENTO,
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
    //                                 P_SCLIENT: this.data.SCLIENT,
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
    //                                     P_SCLIENT: this.data.SCLIENT,
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
                tipoid: this.data.TIPO_DOCUMENTO_ID.toString() == '1' ? '2' : '1',
                id: this.data.NUMERO_DOCUMENTO,
                papellido: this.data.APELLIDO_PATERNO,
                sclient: this.data.SCLIENT,
                usercode: JSON.parse(localStorage.getItem('currentUser'))['id']
            }
        } else {
            datosServiceExperia = {
                tipoid: this.data.TIPO_DOCUMENTO_ID.toString() == '1' ? '2' : '1',
                id: this.data.NUMERO_DOCUMENTO,
                papellido: this.data.APELLIDO_PATERNO,
                sclient: this.data.SCLIENT,
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

    openWorkModal() {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddWorkComponent, {
            size: 'lg',
            backdropClass: 'light-blue-backdrop',   
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;
        modalRef.componentInstance.reference.quotation_id = this.quotation_id;
        modalRef.componentInstance.reference.sclient = this.sclient;
        modalRef.componentInstance.workAdded.subscribe((data) => {
            if(data = true){
                this.value_work= 1
               
            } else {
                this.value_work= 0
            }
          });
        // this.value_work = 0 
        // modalRef.result.then(
        //     res => {
        //         this.getDatosWorks();
        //     }
        // );
        
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

    openFileModal() {
        let modalRef: NgbModalRef;

        modalRef = this.modalService.open(AddFileComponent, {
            size: 'md',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: true,
        });

        modalRef.componentInstance.reference = modalRef;

    }
    getDatosWorks = () => {
        this.quotationService.getDatoWorks({ P_NID_COTIZACION: this.P_NID_COTIZACION, P_SCLIENT: this.sclient }).subscribe(
            res => {
                if(res == null || res == undefined){
                    this.value_work= 0
                } else {
                    this.value_work= 1
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
    formatearPrecio(precio: number): string {
        return precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    onChangePrecio(event: any) {
        this.montoSucripcion = this.formatearPrecio(event.target.value);
    }
    numeroConComas: string = ''
    formatearNumeroConComas(event: any) {
        let numero = event.target.value;
        this.montoSuscripcion = this.revertirFormateo(numero);
        numero = numero.replace(/[^\d.]/g, '');
        numero = numero.replace(/(\..*)\./g, '$1');
        const partes = numero.split('.');
        if (partes.length > 1) {
          partes[1] = partes[1].slice(0, 2);
          numero = partes.join('.');
        }
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.numeroConComas = partes.join('.');
    }

    revertirFormateo(numeroConComas: string): number {
        const numeroSinComas = numeroConComas.replace(/,/g, '');
        const numero = parseFloat(numeroSinComas).toFixed(2);
        return parseFloat(numero);
    }
}