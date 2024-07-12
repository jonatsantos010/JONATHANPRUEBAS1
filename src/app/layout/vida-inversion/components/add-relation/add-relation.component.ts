import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { VidaInversionService } from '../../services/vida-inversion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-relation',
    templateUrl: './add-relation.component.html',
    styleUrls: ['./add-relation.component.scss']
})

export class AddRelationComponent implements OnInit {

    @Input() check_input_value;
    @Input() public reference: any;
    
    @ViewChild('insuredRadioInput') insuredRadioInput: ElementRef;

    isLoading: boolean = false;

    data_quotation_pep = {
        P_NID_COTIZACION: null,
        P_SCLIENT: null,
        P_NSECCION: null,

        P_SINMUEBLES: null,
        P_SVEHICULOS: null,

        P_NPRTCAPSOC: 3,
        P_SPRTCAPSOC_DET: null,

        P_NANTPEN: 3,
        P_NANTJUD: 3,
        P_NANTPOL: 3,
        P_NLAVACT: 3,
        P_NVINAUT: 3,
        P_SDECJUR: null,
    }   

    constructor(
        private vidaInversionService: VidaInversionService
    ){}

    ngOnInit(): void {
        this.isLoading = true;
        this.check_input_value = 3;
        this.data_quotation_pep.P_NID_COTIZACION = this.reference.quotation_id;
        this.data_quotation_pep.P_SCLIENT = this.reference.sclient;
        this.data_quotation_pep.P_NSECCION = 2;
        this.SelDatosPEPVIGP();
    }

    changeValue(value) {
        this.check_input_value = value;
        this.data_quotation_pep.P_SPRTCAPSOC_DET = "";
    }

    InsUpdDatosPEPVIGP = () => {
        this.data_quotation_pep.P_NPRTCAPSOC = this.check_input_value;
        this.vidaInversionService.InsUpdDatosPEPVIGP(this.data_quotation_pep).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    Swal.fire('Información', "Se registró correctamente.", 'success');
                    this.reference.close();
                } else {
                    Swal.fire('Información', res.P_MESSAGE, 'error');
                }
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error registrando los datos PEP.", 'error');
            }
        );
    }
  
    SelDatosPEPVIGP = () => {
        this.vidaInversionService.SelDatosPEPVIGP(this.data_quotation_pep).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.check_input_value = res.C_TABLE[0].NPRTCAPSOC;
                    this.data_quotation_pep.P_SPRTCAPSOC_DET = res.C_TABLE[0].SPRTCAPSOC_DET;
                }
                this.isLoading = false;
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error obteniendo los datos PEP.", 'error');
            }
        );
    }
}