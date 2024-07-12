import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AppConfig} from '@root/app.config';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient],
})
export class ConfigurationService {
  private readonly wspdApi = AppConfig.WSPD_APIAWS;

  subjectEvents = {
    POLICIES: 'PD:DESG:32X1561QWE', // *Cambios en las polizas
    REMOVE_POLICY: 'PD:DESG:A3D1Q98W1E', // *Se elimina una poliza
    CHANGES: {
      READ_FIELDS: 'PD:DESG:RFQWE1X56Q4W', // *Cambios en los campos de entrada (Lectura)
      ENTITY_ATTRIBUTE_VALUE: 'PS:DESG:EAV1Q5W6E', // *Cambios en el valor de la entidades - atributos
    },
  };
  subject: Subject<{ key: string; payload: any }> = new Subject();

  constructor(private readonly http: HttpClient) {
  }

  getParameters(): Observable<any> {
    const url = `${this.wspdApi}/sia/parametros`;
    return this.http.get(url).pipe(map((response: any) => response.data));
  }

  getPolicies(structureId: string): Observable<any> {
    const url: string = `${this.wspdApi}/sia/polizas/listado/${structureId}`;
    return this.http.get(url).pipe(map((response: any) => response.data));
  }

  getEntities(): Observable<any> {
    const url: string = `${this.wspdApi}/sia/entidades/listado`;
    return this.http.get(url).pipe(map((response: any) => response.data));
  }

  getRules(): Observable<any> {
    const url: string = `${this.wspdApi}/sia/reglas/listado`;
    return this.http.get(url).pipe(map((response: any) => response.data?.listaReglasNegocio ?? []));
  }

  getEmails(): Observable<any[]> {
    const url: string = `${this.wspdApi}/sia/correo/listado`;
    return this.http.get(url).pipe(map((response: any) => response.data?.listaCorreos ?? []));
  }

  save(payload: any): Observable<any> {
    payload = {
      ...payload,
      noBase64: true,
    };

    const url: string = `${this.wspdApi}/sia/crear/configuracion`;

    return this.http.post(url, payload).pipe(map((response: any) => response.data));
  }

  update(payload: any): Observable<any> {

    console.log('enviado: '+ payload);
    payload = {...payload, noBase64: true,};

    const url: string = `${this.wspdApi}/sia/editar/configuracion`;

    return this.http.post(url, payload).pipe(map((response: any) => response.data));
  }
}
