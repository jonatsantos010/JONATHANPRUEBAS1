import { VidaInversionService } from '../../services/vida-inversion.service';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-property',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.scss']
})

export class AddPropertyComponent implements OnInit {

    @Input() public reference: any;
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
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.data_quotation_pep.P_NID_COTIZACION = this.reference.quotation_id;
        this.data_quotation_pep.P_SCLIENT = this.reference.sclient;
        this.data_quotation_pep.P_NSECCION = 1;
        this.SelDatosPEPVIGP();
    }

    // saveProperty = () => {
    //     const customswal = Swal.mixin({
    //         confirmButtonColor: "553d81",
    //         focusConfirm: false,
    //     })
    //     customswal.fire('Información', "Se registró correctamente.", 'success');
    //     this.reference.close();
    // }

    // DGC - VIGP - 19/01/2024
    InsUpdDatosPEPVIGP = () => {
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
        )
    }

    SelDatosPEPVIGP = () => {
        this.vidaInversionService.SelDatosPEPVIGP(this.data_quotation_pep).subscribe(
            res => {
                if (res.P_NCODE == 0) {
                    this.data_quotation_pep.P_SINMUEBLES = res.C_TABLE[0].SINMUEBLES;
                    this.data_quotation_pep.P_SVEHICULOS = res.C_TABLE[0].SVEHICULOS;
                }
                this.isLoading = false;
            },
            err => {
                Swal.fire('Información', "Ha ocurrido un error obteniendo los datos PEP.", 'error');
            }
        )
    }
}