import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecaptchaComponent } from 'ng-recaptcha';
import { GoogleAnalyticsService } from '@shared/services/google-analytics/google-analytics.service';
import { MainService } from '../shared/services/main.service';
import { RegularExpressions } from '@shared/regexp/regexp';
import { fadeAnimation } from '@root/shared/animations/animations';
import { ParametersResponse } from '../../layout/vidaindividual-latest/models/parameters.model';
import { UbigeoService } from '../../shared/services/ubigeo/ubigeo.service';
import { UserInfoRequest } from '../shared/models/user-info-request';
import { ClientInfoService } from '../shared/services/client-info.service';
import { UtilsService } from '@shared/services/utils/utils.service';
import { IDocumentInfoRequest } from '../../shared/interfaces/document-information.interface';
import { DocumentInfoResponseModel } from '../../shared/models/document-information/document-information.model';
import { AppConfig } from '../../app.config';
import { GoogleTagService } from '../shared/services/google-tag-service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  animations: [fadeAnimation],
})
export class UserInfoComponent implements OnInit, OnDestroy, AfterViewChecked {
  hasErrorSubmit: string;
  datePickerConfig: Partial<BsDatepickerConfig>;
  paramSubject = new Subscription();
  insuranceType: string;
  insuranceCategory: string;

  documentTypes = [
    { value: '4', label: 'CE' },
    { value: '2', label: 'DNI' },
    { value: '1', label: 'RUC' },
  ];

  sexTypes = [
    { value: 2, label: 'MASCULINO' },
    { value: 1, label: 'FEMENINO' },
  ];

  flightTypes = [
    { value: '1', label: 'Nacional' },
    // { value: '2', label: 'Internacional' },
  ];

  loaders = {
    user: false,
    department: false,
    province: false,
    district: false,
  };

  legalUser = false;
  contractInsurance = false;
  placeholder = 'Nombre';
  siteKey = AppConfig.CAPTCHA_KEY;

  parameters$: ParametersResponse;
  listStatusCivil: any[] = [];
  departments: any[] = [];
  provinces: any[];
  districts: any[];
  countries: any[] = [];

  docTypes: Array<{ idDoc: number; sDoc }> = [];
  limitDocumentNumberLegalRepresentative: { min: number; max: number } = {
    min: 8,
    max: 8,
  };
  form = this.builder.group({
    documentType: [
      {
        value: this.session.documentType,
        disabled: false,
      },
      [Validators.required],
    ],
    documentNumber: [
      {
        value: this.session.documentNumber,
        disabled: false,
      },
      [Validators.required],
    ],
    lastname: [
      this.session.lastname,
      Validators.compose([
        Validators.pattern(RegularExpressions.text),
        Validators.required,
      ]),
    ],
    surname: [
      this.session.surname,
      Validators.compose([
        Validators.pattern(RegularExpressions.text),
        +this.session?.documentType == 4 ? null : Validators.required,
      ]),
    ],
    name: [
      this.session.name,
      Validators.compose([
        Validators.pattern(RegularExpressions.text),
        Validators.required,
      ]),
    ],
    address: [this.session.address, [Validators.required, this.spaceValidator]],
    department: [this.session.department, [Validators.required]],
    province: [this.session.provincia, [Validators.required]],
    district: [this.session.district, [Validators.required]],
    phoneNumber: [
      this.session.phoneNumber,
      [Validators.required, Validators.pattern(/^[0-9]*$/)],
    ],
    contractInsurance: [this.session.contractInsurance || false],
    sex: [
      this.session.sex,
      this.session.documentType == 1 ? null : Validators.required,
    ],
    civilStatus: [
      this.session.civilStatus,
      this.session.documentType == 1 ? null : Validators.required,
    ],
    country: [this.session.country || 1, []],
    legalRepresentative: this.builder.group({
      documentType: [2],
      documentNumber: [null],
      names: [null],
      lastName: [null],
      lastName2: [null],
    }),
  });

  saveClientResponse: any;
  showDerivation = false;

  messageDerivation = null;

  private readonly categoryGoogleAnalytics: string =
    'Ecommerce AP - Cliente - Paso 2';

  @ViewChild('recaptchaRef', { static: true }) recaptcha: RecaptchaComponent;

  constructor(
    private readonly router: ActivatedRoute,
    private readonly builder: FormBuilder,
    private readonly route: Router,
    private readonly spinner: NgxSpinnerService,
    private readonly cd: ChangeDetectorRef,
    private readonly ga: GoogleAnalyticsService,
    private readonly locationService: UbigeoService,
    private readonly clientInfoService: ClientInfoService,
    private readonly mainService: MainService,
    private readonly utilsService: UtilsService,
    private readonly gts: GoogleTagService
  ) {
    this.hasErrorSubmit = null;

    if (this.productSelected?.idTipoPoliza == 2) {
      this.formLegalRepresentativeControl['documentType'].setValidators(
        Validators.required
      );
      this.formLegalRepresentativeControl['names'].setValidators(
        Validators.required
      );
      this.formLegalRepresentativeControl['lastName'].setValidators(
        Validators.required
      );
      this.formLegalRepresentativeControl['lastName2'].setValidators(
        Validators.required
      );
      this.formLegalRepresentativeControl['documentNumber'].setValidators(
        Validators.compose([
          Validators.pattern(RegularExpressions.numbers),
          Validators.required,
          Validators.minLength(this.limitDocumentNumberLegalRepresentative.min),
          Validators.maxLength(this.limitDocumentNumberLegalRepresentative.max),
        ])
      );
    }
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('dataAsegurados');
    sessionStorage.removeItem('contractInsurance');
    this.mainService.nstep = 2;
    window.scrollTo(0, 0);
    this.datePickerConfig = Object.assign(
      {},
      {
        locale: 'es',
        showWeekNumbers: false,
        maxDate: new Date(),
      }
    );

    this.paramSubject = this.router.params.subscribe((params) => {
      this.insuranceType = params.insuranceType;
      this.insuranceCategory = params.insuranceCategory;
    });

    this.validateIfChecked();
    this.getParameters();

    if (this.isRuc) {
      this.docTypes = [
        {
          idDoc: 1,
          sDoc: 'RUC',
        },
      ];
    } else {
      this.docTypes = [
        {
          idDoc: 2,
          sDoc: 'DNI',
        },
        {
          idDoc: 4,
          sDoc: 'CE',
        },
      ];
    }
    this.validarInputEmpty('documentType');
    this.validarInputEmpty('documentNumber');
    this.validarInputEmpty('name');
    this.validarInputEmpty('lastname');
    this.validarInputEmpty('surname');
    this.valueChangesForm();
    this.form.patchValue(this.session, {
      emitEvent: false,
      onlySelf: false,
    });

    setTimeout(() => {
      this.ga.emitGenericEventAP('Visualiza paso 2');
    }, 100);
  }

  getParameters(): void {
    this.spinner.show();
    this.locationService.getParameters().subscribe(
      (res: ParametersResponse) => {
        this.spinner.hide();
        this.parameters$ = res;
        this.listStatusCivil = this.parameters$.estadoCivil
          ?.filter((val) => val.id != 8 && val.id != 7 && val.id != 5)
          ?.map((value: any) => ({
            ...value,
            descripcion: value.descripcion.toLocaleUpperCase(),
          }));
        this.departments = this.parameters$.ubigeos;
        this.countries = this.parameters$.nacionalidades;
        this.changeUbigeo();
      },
      (err: any) => {
        this.spinner.hide();
        console.log(err);
        this.hasErrorSubmit = 'Ocurrió un error al obtener el ubigeo';
        this.ga.emitGenericEventAP(
          `Obtener ubigeo`,
          0,
          'Error al obtener el ubigeo',
          2
        );
        this.getUserInfo();
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  get formLegalRepresentativeControl(): { [key: string]: AbstractControl } {
    return (this.f['legalRepresentative'] as FormGroup).controls;
  }

  get session() {
    return JSON.parse(sessionStorage.getItem('insurance') || '{}');
  }

  get productSelected(): any {
    return JSON.parse(sessionStorage.getItem('_producto_selecionado'));
  }

  valueChangesForm(): void {
    this.f['phoneNumber'].valueChanges.subscribe((val) => {
      if (val) {
        if (
          this.f['phoneNumber'].hasError('pattern') ||
          val?.toString()?.slice(0, 1) != '9'
        ) {
          this.f['phoneNumber'].setValue(val.substring(0, val.length - 1));
        }
      }
    });
    this.f['name'].valueChanges.subscribe((value: string) => {
      if (value) {
        if (this.f['name'].hasError('pattern')) {
          this.f['name'].setValue(value.slice(0, value.length - 1));
        }
      }
    });
    this.f['lastname'].valueChanges.subscribe((value: string) => {
      if (value) {
        if (this.f['lastname'].hasError('pattern')) {
          this.f['lastname'].setValue(value.slice(0, value.length - 1));
        }
      }
    });
    this.f['surname'].valueChanges.subscribe((value: string) => {
      if (value) {
        if (this.f['surname'].hasError('pattern')) {
          this.f['surname'].setValue(value.slice(0, value.length - 1));
        }
      }
    });

    if (this.session?.categoryId == 1) {
      return;
    }

    this.formLegalRepresentativeControl['documentType'].valueChanges.subscribe(
      (value: string) => {
        this.formLegalRepresentativeControl['documentNumber'].setValue(null);
        switch (+value) {
          case 2:
            this.limitDocumentNumberLegalRepresentative = {
              min: 8,
              max: 8,
            };
            break;
          case 4:
            this.limitDocumentNumberLegalRepresentative = {
              min: 9,
              max: 12,
            };
            break;
          default:
            this.limitDocumentNumberLegalRepresentative = {
              min: 8,
              max: 12,
            };
            break;
        }
        this.formLegalRepresentativeControl['documentNumber'].setValidators(
          Validators.compose([
            Validators.pattern(RegularExpressions.numbers),
            Validators.required,
            Validators.minLength(
              this.limitDocumentNumberLegalRepresentative.min
            ),
            Validators.maxLength(
              this.limitDocumentNumberLegalRepresentative.max
            ),
          ])
        );
        this.formLegalRepresentativeControl[
          'documentNumber'
        ].updateValueAndValidity();
      }
    );

    this.formLegalRepresentativeControl[
      'documentNumber'
    ].valueChanges.subscribe((value: string) => {
      if (
        this.formLegalRepresentativeControl['documentNumber'].hasError(
          'pattern'
        )
      ) {
        this.formLegalRepresentativeControl['documentNumber'].setValue(
          value.slice(0, value.length - 1)
        );
        return;
      }
    });
  }

  validationsForm(): void {}

  changeUbigeo(): void {
    this.f['department'].valueChanges.subscribe((val) => {
      if (val) {
        this.districts = [];
        this.f['province'].setValue(null);
        this.f['district'].setValue(null);
        this.provinces = this.departments?.find(
          (x) => Number(x.id) === Number(val)
        )?.provincias;
      }
    });

    this.f['province'].valueChanges.subscribe((val) => {
      if (val) {
        this.f['district'].setValue(null);
        this.districts = this.provinces?.find(
          (x) => Number(x.idProvincia) === Number(val)
        )?.distritos;
      }
    });

    this.f.documentType.valueChanges.subscribe((val) => {
      if (Number(val) === 2) {
        this.f.country.setValue('1');
        this.f.country.disable();
        this.f.department.setValue(null);
        this.f.province.setValue(null);
        this.f.district.setValue(null);
        this.f.department.enable();
        this.f.province.enable();
        this.f.district.enable();
      }
      if (Number(val) === 4) {
        this.f.country.setValue(null);
        this.f.country.enable();
        this.f.department.setValue('14');
        this.f.province.setValue(1401);
        this.f.district.setValue(140101);
        this.f.department.disable();
        this.f.province.disable();
        this.f.district.disable();
      }
    });
    this.form.patchValue(this.session);
    this.getUserInfo();

    if (!this.departments?.find((x) => +x.id == +this.f['department'].value)) {
      this.f['department'].setValue(null);
    }

    if (
      this.session.documentInformation.address &&
      this.session.documentType == 1
    ) {
      this.f['address'].disable({
        emitEvent: false,
      });
    }
    if (
      this.session.documentInformation.department &&
      this.session.documentType == 1
    ) {
      this.f['department'].disable({
        emitEvent: false,
      });
    }
    if (
      this.session.documentInformation.province &&
      this.session.documentType == 1
    ) {
      this.f['province'].disable({
        emitEvent: false,
      });
    }
    if (
      this.session.documentInformation.district &&
      this.session.documentType == 1
    ) {
      this.f['district'].disable({
        emitEvent: false,
      });
    }

    if (
      !this.provinces?.find((x) => +x.idProvincia == +this.f['province'].value)
    ) {
      this.f['province'].setValue(null);
    }

    if (
      !this.districts?.find((x) => +x.idDistrito == +this.f['district'].value)
    ) {
      this.f['district'].setValue(null);
    }
  }

  get productIdSelected(): number {
    return Number(sessionStorage.getItem('productIdPolicy'));
  }

  get isTypeProductViajes(): boolean {
    return this.productIdSelected === 4 || this.productIdSelected === 8;
  }

  get namesOrRazonSocial() {
    if (Number(this.f['documentType'].value) === 1) {
      return 'Razón Social';
    }
    return 'Nombres';
  }

  get isRuc(): boolean {
    return Number(this.session.documentType) === 1;
  }

  getDocumentInformation(data: string): void {
    if (this.formLegalRepresentativeControl['documentNumber'].invalid) {
      return;
    }

    const payload: IDocumentInfoRequest = {
      idRamo: 61,
      idTipoDocumento:
        this.formLegalRepresentativeControl['documentType'].value,
      numeroDocumento:
        this.formLegalRepresentativeControl['documentNumber'].value,
      token: data,
    };

    this.spinner.show();
    this.utilsService.documentInfoResponse(payload).subscribe({
      next: (response: DocumentInfoResponseModel) => {
        console.dir(response);

        this.formLegalRepresentativeControl['names'].setValue(response.names);
        this.formLegalRepresentativeControl['lastName'].setValue(
          response.apePat
        );
        this.formLegalRepresentativeControl['lastName2'].setValue(
          response.apeMat
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      complete: () => {
        this.spinner.hide();
        this.recaptcha.reset();
      },
    });
  }

  getDocumentType(val: string) {
    const documentType = this.documentTypes.find(
      (item) => item.value === `${val}`
    );
    return documentType ? documentType.label : null;
  }

  showError(controlName: string): boolean {
    return (
      this.f[controlName].invalid &&
      (this.f[controlName].dirty || this.f[controlName].touched)
    );
  }

  getUserInfo() {
    this.loaders.user = true;
    const documentType = this.documentTypes.find(
      (item) => item.value === `${this.session.documentType}`
    );

    if (!documentType) {
      return;
    }

    if (documentType.value === '1') {
      this.showRuc();
    }
    this.setUserForm();
  }

  setUserForm() {
    this.f.name.setValue(this.session.name);
    this.f.lastname.setValue(this.session.lastname);
    this.f.surname.setValue(this.session.surname);
    this.f.address.setValue(this.session.address);
    this.f.phoneNumber.setValue(this.session.phoneNumber);
    this.f.country.setValue(this.session.country || '1');
    if (Number(this.f['documentType'].value) !== 4) {
      this.f.department.setValue(this.session?.department?.toString());
      this.f.province.setValue(
        this.session?.province ? Number(this.session.province) : null
      );
      this.f.district.setValue(
        this.session?.district ? Number(this.session.district) : null
      );
      if (this.session?.department?.toString() === '0') {
        this.f.province.setValue(null);
      }
      if (this.session?.province?.toString() === '0') {
        this.f.department.setValue(null);
      }
      if (this.session?.district?.toString() === '0') {
        this.f.district.setValue(null);
      }
    } else {
      this.f.department.setValue('14');
      this.f.province.setValue(1401);
      this.f.district.setValue(140101);
      this.f.country.setValue(this.session.country || null);
    }
  }

  showRuc() {
    this.legalUser = true;
    const validationRules = this.legalUser ? null : [Validators.required];

    this.f['lastname'].setValue('');
    this.f['surname'].setValue('');
    this.f['lastname'].setValidators(validationRules);
    this.f['surname'].setValidators(validationRules);
    this.f['lastname'].updateValueAndValidity();
    this.f['surname'].updateValueAndValidity();

    this.placeholder = 'Razón Social';
  }

  resetForm() {
    this.f['province'].setValue(null);
    this.f['district'].setValue(null);
  }

  spaceValidator(control: FormControl) {
    const space = (control.value || '').trim().length === 0;
    return !space ? null : { space: true };
  }

  validateIfChecked() {
    this.f['contractInsurance'].valueChanges.subscribe((val) => {
      if (val) {
        this.f['sex'].setValidators(Validators.required);
        this.f['country'].setValidators(Validators.required);
      } else {
        this.f['sex'].clearValidators();
        this.f['country'].clearValidators();

        this.f['sex'].markAsPristine();
        this.f['country'].markAsPristine();
      }

      this.f['sex'].updateValueAndValidity();
      this.f['country'].updateValueAndValidity();
    });
  }

  getCountries() {
    this.clientInfoService.getCountries().subscribe((response) => {
      this.countries = response;
    });
  }

  get isValidRuc(): boolean {
    if (this.session.categoryId == 2) {
      return (
        this.session.contractorStatus == 'ACTIVO' &&
        this.session.domicileCondition == 'HABIDO'
      );
    }
    return true;
  }

  onSubmit() {
    this.ga.emitGenericEventAP(`Clic en 'Siguiente'`);

    const tagDataUno = {
      event: 'virtualEventGA4_A3',
      Producto: 'Accidentes Personales',
      Paso: 'Paso 2',
      Sección: 'Datos del contratante',
      TipoAcción: 'Intento de avance',
      CTA: 'Siguiente',
      NombreSeguro: this.session.namePlan,
    };

    const tagDataDos = {
      TipoDocumento:
        this.session.documentType == 1
          ? 'RUC'
          : this.session.documentType == 2
          ? 'DNI'
          : 'CE',
      pagePath: window.location.pathname,
      timeStamp: new Date().getTime(),
      user_id: this.session.id,
      TipoCliente: this.session.tipoCliente,
      ID_Proceso: this.session.processId,
      Canal: 'Venta Directa',
    };

    if (this.session.categoryId == 1) {
      const tagManagerPayload = {
        ...tagDataUno,
        ...tagDataDos,
      };
      this.gts.virtualEvent(tagManagerPayload);
    }

    if (this.session.categoryId == 2) {
      const tagManagerPayloadRuc = {
        ...tagDataUno,
        event: 'virtualEventGA4_A4',
        TipoRegistro: 'RUC',
        ...tagDataDos,
      };
      this.gts.virtualEvent(tagManagerPayloadRuc);
    }

    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      const request = new UserInfoRequest({
        ...this.session,
        ...formValues,
        civilStatus: this.f['civilStatus'].value
          ? this.f['civilStatus'].value
          : 5,
        tipoPoliza: this.productSelected?.idTipoPoliza,
        condicionDomicilio: this.session.domicileCondition,
        estadoContratante: this.session.contractorStatus,
      });
      this.spinner.show();
      this.clientInfoService.saveClient(request).subscribe(
        (res: any) => {
          this.saveClientResponse = res;
          this.spinner.hide();
          this.hasErrorSubmit = !res.success
            ? 'Ocurrió un error al grabar el contratante'
            : null;
          if (res.success) {
            sessionStorage.setItem(
              'insurance',
              JSON.stringify({
                ...this.session,
                ...formValues,
                processId: res.idProceso,
              })
            );

            this.messageDerivation = null;
            if (this.session.categoryId == 2) {
              if (!this.isValidRuc) {
                // tslint:disable-next-line:max-line-length
                this.messageDerivation = `Hola, el RUC ${this.session.documentNumber} no está activo o habilitado en la SUNAT. Por favor, verifica que la información sea correcta.`;
                this.showDerivation = true;
                return;
              }
            }

            if (this.session.categoryId == 1) {
              const tagManagerPayloadResponse = {
                ...tagDataUno,
                TipoAcción: 'Avance exitoso',
                ...tagDataDos,
              };
              this.gts.virtualEvent(tagManagerPayloadResponse);
            }

            if (this.session.categoryId == 2) {
              const tagManagerPayloadResponseRuc = {
                ...tagDataUno,
                event: 'virtualEventGA4_A4',
                TipoAcción: 'Avance exitoso',
                TipoRegistro: 'RUC',
                ...tagDataDos,
              };
              this.gts.virtualEvent(tagManagerPayloadResponseRuc);
            }

            this.mainService.nstep = 3;
            this.route.navigate([
              `/accidentespersonales/${this.insuranceCategory}/${this.insuranceType}/step-3`,
            ]);
          } else {
            this.ga.emitGenericEventAP(
              `Clic en 'Siguiente'`,
              0,
              'Error al grabar el contratante',
              2
            );
          }
        },
        (err: any) => {
          this.spinner.hide();
          console.error(err);
        }
      );
    }
  }

  backStep(): void {
    this.ga.emitGenericEventAP(`Clic en 'Anterior'`);
    this.route.navigate([
      `/accidentespersonales/${this.insuranceCategory}/${this.insuranceType}/step-1`,
    ]);
  }

  validarInputEmpty(control): boolean {
    const isEmpty: boolean = !(this.f[control]?.value?.toString().length > 0);
    if (!isEmpty) {
      this.form.get(control).disable();
    } else {
      this.form.get(control).enable();
    }
    return isEmpty;
  }

  ngOnDestroy(): void {
    this.paramSubject.unsubscribe();
  }

  get phoneNumberValid(): boolean {
    if (
      this.f['phoneNumber'].value?.toString() !== '987654321' &&
      this.f['phoneNumber'].value?.toString() !== '999999999'
    ) {
      return true;
    }
    return false;
  }

  requestClientInfo() {
    if (this.formLegalRepresentativeControl['documentNumber'].valid) {
      this.recaptcha.execute();
    }
  }

  resolved(token: string) {
    if (token) {
      this.getDocumentInformation(token);
      return;
    }
  }
}
