import { Component, Input, OnInit } from '@angular/core';
import { VidaInversionService } from '../../services/vida-inversion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-file',
    templateUrl: './add-file.component.html',
    styleUrls: ['./add-file.component.scss']
})

export class AddFileComponent implements OnInit {

    @Input() check_input_value;
    @Input() public reference: any;

    isLoading: boolean = false;
    pdfFile: File | null = null;
    errorMessage: string | null = null;

    constructor(
        private vidaInversionService: VidaInversionService
    ) { }
    
    ngOnInit(): void {
        this.isLoading = true;
    }

    onFileChange = (event: any) => {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension === 'pdf') {
                this.pdfFile = file;
                this.errorMessage = null;
            } else {
                this.pdfFile = null;
                this.errorMessage = 'Solo se permiten archivos PDF.';
            }
        }
    }

    onSubmit = () => {
        if (this.pdfFile) {
            let myFormData: FormData = new FormData();

            myFormData.append('objeto', JSON.stringify(this.reference.obj));
            myFormData.append('dataFile', this.pdfFile);

            this.vidaInversionService.SaveDocumentsVIGP(myFormData).subscribe(
                res => {
                    if (res.P_NCODE == 0) {
                        Swal.fire('Información', "Se subió el archivo correctamente.", 'success');
                        this.reference.readFile();
                    } else {
                        Swal.fire('Información', res.P_MESSAGE, 'error');
                    }
                },
                error => {
                    Swal.fire('Información', "Ha ocurrido un error al cargar el archivo.", 'error');
                }
            );
            this.reference.close();
            this.reference.previusStep();
            // this.reference.funFirmaManuscrita();
        }
    }
}