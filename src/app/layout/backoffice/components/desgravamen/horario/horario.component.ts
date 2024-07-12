import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

import { fadeAnimation } from '@shared/animations/animations';

import { UtilsService } from '@shared/services/utils/utils.service';
import { DesgravamenService } from '../shared/services/desgravamen/desgravamen.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';
import { HorarioService } from '../shared/services/horario/horario.service';
import { ConfigurationModel, INotification } from '../shared/models/configuration.model';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { concat } from 'rxjs-compat/operator/concat';
  
@Component({
    selector: 'app-horario',
    templateUrl: './horario.component.html',
    styleUrls: ['./horario.component.css'],
    animations: [fadeAnimation]
})

export class HorarioComponent implements OnInit {
      
  
    //controlSearch: FormControl = this.builder.control('');
   /// formFilters: FormGroup = this.builder.group({
    //  policy: [''],
   //   contractor: [''],
    //  salesChannel: [''],
    //  createdAt: [null],
    //});
  
    currentPage = 1;
    structures$: Array<any> = [];
    structuresFiltered: Array<any> = [];
  
    messageInfo: {
      showImage?: boolean;
      success?: boolean;
      message?: string;
    } = {};
  
    structureSelected: any = {};

    btnGuardarAct = 'opentype'; //'predefined' 
    btnGuardarHor = 'opentype'; //'predefined' 
    btnActualizarHor = 'opentype'; //'predefined' 
    listHorario: any[] = [];
    isLoading: boolean = false;
    horaSeleccionada: Date;
    branchTypeList: any[] = [];
    diaList: any[] = [];
    horaIniList: any[] = [];
    horaFinList: any[] = [];
    minutoIniList: any[] = [];
    minutoFinList: any[] = [];
    listProduct: any = [];
    mSelectedBranchId:any = '';
    mSelectedProductoId:any = '';
    Ndia:any = '';
    idRamo: number;
    v_hora: number;
    checkboxDiaSig: any = false;
    nconfigs: number = 0
    mhoraIniList: any = '';
    mminutoIniList: any = '';
    mhoraFinList: any = '';
    mminutoFinList: any = '';
    

    constructor(
        private readonly router: Router,
        private readonly builder: FormBuilder,
        private readonly vc: ViewContainerRef,
        private readonly spinner: NgxSpinnerService,
        private readonly desgravamenService: DesgravamenService,
        private readonly horarioService: HorarioService,
        private readonly utilsService: UtilsService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.getHorasList();
    }
   
    backPage(): void {
        this.router.navigate(['/backoffice/desgravamen/estructuras/bandeja']);
    }

    getHorasList() {
        let lengtharray = this.listHorario.length + 1;

        this.horarioService.getHorasList().subscribe(
          (res) => {

            console.log("res: "+res);

            for(let i =0; i<res.length; i++){

                this.listHorario.push({
                    INDICE: lengtharray+i,
                    NBRANCH: res[i].NBRANCH,
                    NPRODUCT: res[i].NPRODUCT,
                    horaIniList: res[i].horaIniList,
                    minutoIniList: res[i].minutoIniList,
                    horaFinList: res[i].horaFinList,
                    minutoFinList: res[i].minutoFinList,
                    SBRANCH: res[i].SBRANCH,
                    SPRODUCT: res[i].SPRODUCT,
                    NDIA: res[i].NDIA,
                    SDIA: res[i].SDIA,
                    DHORA_INICIO: res[i].DHORA_INICIO.toString(),
                    DHORA_FIN: res[i].DHORA_FIN.toString(),
                    NFLAG_DIA_SIG: res[i].NFLAG_DIA_SIG
                });
            }
          },
                (err) => { }
        );
    }

    Borrar(INDICE : number, list : any){
        console.log("INDICE: " + INDICE);
        console.log("NBRANCH: " + list.NBRANCH);
        console.log("NPRODUCT: " + list.NPRODUCT);
        console.log("NDIA: " + list.NDIA);
        console.log("SDIA: " + list.SDIA);
        console.log("DHORA_INICIO: " + list.DHORA_INICIO);

        Swal.fire({
            title: 'Información',
            text: '¿Desea quitar el registro seleccionado?',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            showCancelButton: true,
            allowOutsideClick: false

        }).then((result) => {

            let data: any = {
                NBRANCH: parseInt(list.NBRANCH),
                NPRODUCT: parseInt(list.NPRODUCT),
                NDIA:parseInt(list.NDIA)
            };

            console.log("data: " + data.NBRANCH);

            this.horarioService.BorrarHorario(data).subscribe(
                async (res) => {
      
                  this.spinner.hide();
                    if (res.Id == 1){ //error desde la bd 
                        const result = await Swal.fire({
                            title: res.Description,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Aceptar',
                            allowOutsideClick: false,
                            cancelButtonText: 'Cancelar',
                        });
                            process.exit(1);
                            
                    }else{ //sin errores procede con la eliminación en el front
                        if (result.value) {
                            INDICE = INDICE - 1;
                            this.listHorario.splice(INDICE, 1);
                            this.nconfigs = this.listHorario.length;
            
                            for (let i = 0; i < this.nconfigs; i++) {
                                this.listHorario[i].INDICE = i + 1;
            
                                if (parseInt(this.listHorario[i].NSERVICE) == this.listHorario[this.nconfigs - 1].NSERVICE) {
                                    this.listHorario[i].NBORRAR = true;
                                }
                            }
                        }
                    }
                },
                (err) => { console.log("error de respuesta: ");}
            );

        });
    }

    Editar(INDICE : number, list : any, content2 : any){
        
        console.log("checkboxDiaSig: "+list.NFLAG_DIA_SIG);

        this.modalService.open(content2, {
            size: 's',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: false,
        });
        this.getBranchList();
        this.getDiaList(); 
        this.getHoraList();
        this.getMinutoList();

        this.mSelectedBranchId = list.NBRANCH;
        this.getProductsListByBranch(list.NBRANCH)
        this.mSelectedProductoId = list.NPRODUCT;
        this.Ndia = list.NDIA;
        this.mhoraIniList = list.horaIniList;
        this.mminutoIniList = list.minutoIniList;
        this.mhoraFinList = list.horaFinList;
        this.mminutoFinList = list.minutoFinList;

        if(list.NFLAG_DIA_SIG = 1){
            this.checkboxDiaSig = true;
        }else{
            this.checkboxDiaSig = false;
        }
    }

    actualizarHorario(){
        let v_hora : number;

        Swal.fire({
            title: 'Información',
            text: '¿Desea modificar la información registrada?',
            icon: 'question',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            showCancelButton: true,
            allowOutsideClick: false

        }).then((result) => {
            if (result.value) {

                if(this.checkboxDiaSig){
                    v_hora = 1;
                }else {
                    v_hora = 0;
                }

                const data: any = {
                    NBRANCH: parseInt(this.mSelectedBranchId),
                    NPRODUCT: parseInt(this.mSelectedProductoId),
                    NDIA:parseInt(this.Ndia),
                    HoraSiguienteDia: v_hora,
                    horaIniList: this.mhoraIniList,
                    minutoIniList: this.mminutoIniList,
                    horaFinList: this.mhoraFinList,
                    minutoFinList: this.mminutoFinList,
                    NUSERCODE: JSON.parse(localStorage.getItem("currentUser")).id
                };
                this.horarioService.actualizarHorario(data).subscribe(
                    (res) => {
                        console.log('recepcion de data: '+res.Id)
                        if (res.Id === 0) {
                            Swal.fire('Información', res.Description, 'success');
                                this.modalService.dismissAll('content1');
                                this.listHorario = [];
                                this.getHorasList();
                        } else {
                            Swal.fire('Información', res.Description, 'info');
                        }
                    },
                    (err) => { }
                );
            }
        });

    }

    nuevoHorario(content1: any){
        this.limpiar();

        this.modalService.open(content1, {
            size: 's',
            backdropClass: 'light-blue-backdrop',
            backdrop: 'static',
            keyboard: false,
        });
        this.getBranchList();
        this.getDiaList(); 
        this.getHoraList();
        this.getMinutoList();
    }

    getBranchList() {
        this.horarioService.GetBranchList().subscribe(
          (res) => {
            this.branchTypeList = res;
          },
                (err) => { }
        );
    }

    getDiaList() {
        this.horarioService.GetDiaList().subscribe(
          (res) => {
            this.diaList = res;
          },
                (err) => { }
        );
    }

    getHoraList() {
        this.horarioService.GetHoraList().subscribe(
          (res) => {
            this.horaIniList = res;
            this.horaFinList = this.horaIniList
          },
                (err) => { }
        );
    }

    getMinutoList() {
        this.horarioService.getMinutoList().subscribe(
          (res) => {
            this.minutoIniList = res;
            this.minutoFinList = this.minutoIniList
          },
                (err) => { }
        );
    }

    getProductsListByBranch(idRamo: any) {
        this.idRamo=this.mSelectedBranchId;
        if (this.idRamo !== null) {
            this.horarioService.GetProductsList(this.idRamo).subscribe(
                (res) => {
                  this.listProduct = res;
                },
                      (err) => { }
              );
        }
    }

    guardarNuevoHorario(){
        let v_hora : number;

        Swal.fire({
            title: 'Información',
            text: '¿Desea agregar la información registrada?',
            icon: 'question',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            showCancelButton: true,
            allowOutsideClick: false

        }).then((result) => {
            if (result.value) {

                if(this.checkboxDiaSig){
                    v_hora = 1;
                }else {
                    v_hora = 0;
                }

                const data: any = {
                    NBRANCH: parseInt(this.mSelectedBranchId),
                    NPRODUCT: parseInt(this.mSelectedProductoId),
                    NDIA:parseInt(this.Ndia),
                    HoraSiguienteDia: v_hora,
                    horaIniList: this.mhoraIniList,
                    minutoIniList: this.mminutoIniList,
                    horaFinList: this.mhoraFinList,
                    minutoFinList: this.mminutoFinList,
                    NUSERCODE: JSON.parse(localStorage.getItem("currentUser")).id
                };
                this.horarioService.nuevoHorario(data).subscribe(
                    (res) => {
                        console.log('recepcion de data: '+res.Id)
                        if (res.Id === 0) {
                            Swal.fire('Información', res.Description, 'success');
                                this.modalService.dismissAll('content1');
                                this.listHorario = [];
                                this.getHorasList();
                        } else {
                            Swal.fire('Información', res.Description, 'info');
                        }
                    },
                    (err) => { }
                );
            }
        });

    }

    validarHorarios(){
        let dom : number = 0;
        let lun : number = 0;
        let mar : number = 0;
        let mie : number = 0;
        let jue : number = 0;
        let vie : number = 0;
        let sab : number = 0;
        let branc: string;
        let prod: string;
        let cont: number = 0;
        // Conjunto para almacenar combinaciones únicas de NBRANCH y NPRODUCT
        const combinacionesUnicas: Set<string> = new Set();
        const combinacionesUnicas2: Set<string> = new Set();
        const combinacionesUnicas3: Set<string> = new Set();

        // Llenar el conjunto con las combinaciones únicas
        this.listHorario.forEach(item => {
            const combinacion = `${item.NBRANCH}-${item.NPRODUCT}-${item.NDIA}-${item.SBRANCH}`;
            combinacionesUnicas.add(combinacion);
        });

        // Llenar el conjunto con las combinaciones únicas
        this.listHorario.forEach(item => {
            const combinacion = `${item.NBRANCH}-${item.NPRODUCT}-${item.SBRANCH}`;
            combinacionesUnicas2.add(combinacion);
        });

        // Llenar el conjunto con las combinaciones únicas
        this.listHorario.forEach(item => {
            const combinacion = `${item.NBRANCH}`;
            combinacionesUnicas3.add(combinacion);
        });

        // Convertir el conjunto de combinaciones únicas a una lista
        const listaUnica: { NBRANCH: string; NPRODUCT: string; NDIA: string; SBRANCH: string }[] = Array.from(combinacionesUnicas).map(combinacion => {
            const [NBRANCH, NPRODUCT,NDIA, SBRANCH] = combinacion.split('-');
            return { NBRANCH, NPRODUCT, NDIA, SBRANCH };
        });

        const ramoProducto: { NBRANCH: string; NPRODUCT: string; SBRANCH: string  }[] = Array.from(combinacionesUnicas2).map(combinacion => {
            const [NBRANCH, NPRODUCT, SBRANCH] = combinacion.split('-');
            return { NBRANCH, NPRODUCT, SBRANCH };
        });

        const soloRamo: { NBRANCH: string}[] = Array.from(combinacionesUnicas3).map(combinacion => {
            const [NBRANCH] = combinacion.split('-');
            return { NBRANCH};
        });

        console.log('listaUnica: ');
        console.log(listaUnica);
        console.log('ramoProducto: ');
        console.log(ramoProducto);
        console.log('soloRamo: ');
        console.log(soloRamo);

        for(let i = 0; i < ramoProducto.length; i++){
            branc = ramoProducto[i].NBRANCH;
            prod = ramoProducto[i].NPRODUCT;
            
            for(let j = 0; j < this.listHorario.length; j++){
                if(this.listHorario[j].NBRANCH == branc && this.listHorario[j].NPRODUCT == prod ){
                    console.log(branc+' - '+ prod);
                    cont++;
                    console.log('cont: '+cont);
                }               
            }
            if (cont < 6){
                Swal.fire('Información', 'Faltan registros para el ramo '+ ramoProducto[i].SBRANCH + ', por favor completar', 'warning');
                return;
                //process.exit(1);
            }
            if (cont > 6){
                Swal.fire('Información', 'Sobran registros para el ramo '+ ramoProducto[i].SBRANCH + ', por favor identificarlos y eliminar', 'warning');
                return;
                //process.exit(1);
            }
            cont=0;
        }
    }

    limpiar(){
        this.branchTypeList = [];
        this.listProduct = [];
        this.diaList = [];
        this.horaIniList = [];
        this.minutoIniList = [];
        this.horaFinList = [];
        this.minutoFinList = [];

        this.mSelectedBranchId = -1;
        this.mSelectedProductoId = -1;
        this.checkboxDiaSig = false;
        this.Ndia = -1;
        this.mhoraIniList = 0;
        this.mminutoIniList = 0;
        this.mhoraFinList = 0;
        this.mminutoFinList = 0;
    }

    cerrar1(content1: any)
    {
        Swal.fire({
            title: '¿Desea cerrar la ventana?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                //this.limpiar();
                this.modalService.dismissAll(content1);
            }
        });
    }
}