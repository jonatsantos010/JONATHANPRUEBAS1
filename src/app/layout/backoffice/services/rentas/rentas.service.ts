import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@root/app.config';
import { map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { GenericResponse } from '../../../broker/models/shared/generic-response';

@Injectable({
  providedIn: 'root',
})
export class RentasService {
  private urlAPI: string;
  private urlApiSCTR: string;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private readonly http: HttpClient) {
    this.urlAPI = AppConfig.PD_API;
    this.urlApiSCTR = AppConfig.URL_API_SCTR
  }

  private _refresh$ = new Subject<void>();
  private _refreshDetail$ = new Subject<void>();

  get refresh$(){
    return this._refresh$
  }

  get refreshDetail$(){
    return this._refreshDetail$
  }

  exportarReporte(data: any) {
    const url = `${this.urlAPI}/rentas/descarga`;
    const api = this.http.post(url, data);
    return api.pipe(
      map((response: { success: boolean; archivo: string }) => response)
    );
  }

  //SERVICIO PARA LISTAR LOS TICKET
  public getListTickets(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_REA_CLIENT_TICKETS', body, {
        headers: this.headers
      });
  }
//SERVICIO PARA LISTAR UN TICKET
  public getListTicket(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_REA_CLIENT_TICKET', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR LOS PRODUCTOS
  public getListProducts(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_PRODUCTOS', {
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR LOS MOTIVOS
  public getListMotivos(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_MOTIVOS', {
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR LOS SUBMOTIVOS
  public getListSubMotivos(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_SUBMOTIVOS', body,{
        headers: this.headers
      });
  }
  //SERVICIO PARA PARA LISTAR LOS ESTADOS
  public getListEstados(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_ESTADOS',{
        headers: this.headers
      });
  }
//SERVICIO PARA ASIGNAR EJECUTIVO
  public updAsignar(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_ASSIGNEXEC', body,{
        headers: this.headers
      }).pipe(
        tap(()=>{
            this._refresh$.next()
        })
      );
  }
  //SERVICIO PARA LISTAR LOS CLIENTES
  public getListClients(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_REA_CLIENTS', body,{
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR LOS EJECUTIVOS
  public getListEjecutivos(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_EJECUTIVOS', body, {
        headers: this.headers
    });
  }
  //SERVICIO PARA LISTAR LOS TIPOS DE DOCUMENTOS
  public getListTipoDocumentos(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_TYPE_DOCUMENT', {
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR EL TIPO DE PERSONA
  public getListTipoPersonas(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_TYPE_PERSON', {
        headers: this.headers
      });
  }
  //SERVICIO PARA OBTENER LA CANTIDAD DE DIAS A RETROCEDERPARA OBTENER LA CANTIDAD DE DIAS A RETROCEDER
  public getFilterDay(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_FILTERDAY_START', {
        headers: this.headers
      });
  }
  //SERVICIO PARA VALIDAD LA CANTIDAD DE CARACTERES DE LOS DOCUMENTOS
  public valFormat(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_VALFORMATVALUES', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA RECUPERAR EL PRODUCTO
  public getProductCanal(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_NPRODUCTCANAL', {
        headers: this.headers
      });
  }
  //SERVICIO PARA LISTAR LAS ACCIONES PERMITIDAS PARA EL PERFIL
  public getListActions(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_REA_LIST_ACTIONS', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA RECUPERAR EL ID DE PERFIL
  public getNidProfile(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_NIDPROFILE', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA RECUPERAR LAS ACCIONES DE LOS TICKETS
  public getListActionsTicket(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_REA_LIST_ACTIONS_TICKET', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA ACTUALIZAR EL ESTADO DE TICKET
  public updStatusTicket(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_STATUS_TICKET', body, {
        headers: this.headers
      }).pipe(
        tap(()=>{
            this._refresh$.next()
        })
      );
  }
  //SERVICIO PARA ACTUALIZAR EL ESTADO DE TICKET EN LA PESTAÑA DE  DETALLE
  public updStatusTicketDetail(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_STATUS_TICKET', body, {
        headers: this.headers
      }).pipe(
        tap(()=>{
            this._refreshDetail$.next()
        })
      );
  }
  public getPolicyData(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/GET_POLICY_DATA', body, {
        headers: this.headers
      });
  }
  public getCalculationAmount(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/GET_CALCULATION_AMOUNT_DUMMY', body, {
        headers: this.headers
      });
  }
  //SERVICIO PARA ACTUALIZAR LA MONEDA Y EL IMPORTE DEL TICKET
  public updAmountTicket(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_AMOUNT_TICKET', body, {
        headers: this.headers
      }).pipe(
        tap(()=>{
            this._refresh$.next()
        })
      );
  }

  public getListAdj(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_LIST_ADJ', body, {
        headers: this.headers
      });
  }
  public updAttachmentAdj(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_ATTACHMENT', body, {
        headers: this.headers
      });
  }

  public insDataEmail(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_INS_DATA_EMAIL', body, {
        headers: this.headers
      });
  }

  public uploadFile(_fileName: string, _formData: FormData): Observable<GenericResponse> {
    let data = { fileName: _fileName };
    return this.http.post<GenericResponse>(this.urlApiSCTR  + "/Rentas/UploadFile", _formData, { params: data });
  }

  public insTickAdjunt(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_INS_TBL_TICK_ADJUNT', body, {
        headers: this.headers
      });
  }
  public delTickAdjunt(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_DEL_TBL_TICK_ADJUNT', body, {
        headers: this.headers
      });
  }
  public updtTicketDescript(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_TICKET_DESCRIPT', body, {
        headers: this.headers
      });
  }
  public updtTicketNmotiv(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_UPD_TICKET_NMOTIV', body, {
        headers: this.headers
      });
  }

  public getUserResponsible(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_USER_RESPONSIBLE', body, {
        headers: this.headers
      });
  }

  public getValpopup(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_VALPOPUP', body, {
        headers: this.headers
      });
  }

  public getListTypeComments(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_TYPECOMMENT',{
        headers: this.headers
      });
  }

  public getListDestination(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_DESTINATION',{
        headers: this.headers
      });
  }
  public getEmailDestination(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_EMAIL_DESTINATION', body, {
        headers: this.headers
      });
  }

  public getEmailUser(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_EMAIL_USER', body, {
        headers: this.headers
      });
  }
  
  public getConfFile(): Observable<any> {
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_CONF_FILE',{
        headers: this.headers
      });
  }
  public getMessage(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.urlApiSCTR + '/Rentas/PD_GET_MESSAGE', body, {
        headers: this.headers
      });
  }
}


