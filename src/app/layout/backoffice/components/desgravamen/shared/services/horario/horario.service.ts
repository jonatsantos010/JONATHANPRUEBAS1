import { Injectable } from '@angular/core';

import { AppConfig } from '@root/app.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient,  HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
  })
  export class HorarioService {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private url = AppConfig.URL_API_SCTR;

    constructor(private readonly http: HttpClient) { }

    public getHorasList(): Observable<any> {
        const _params = {};
        return this.http.get(this.url + "/AwsDesgravamen/getHorasList", 
        {
          params: _params,
        });
    }

    public GetBranchList(): Observable<any> {
        const _params = {};
        return this.http.get(this.url + "/AwsDesgravamen/GetBranchList", 
        {
          params: _params,
        });
    }

    public GetDiaList(): Observable<any> {
        const _params = {};
        return this.http.get(this.url + "/AwsDesgravamen/GetDiaList", 
        {
          params: _params,
        });
    }
    public GetHoraList(): Observable<any> {
        const _params = {};
        return this.http.get(this.url + "/AwsDesgravamen/GetHoraList", 
        {
          params: _params,
        });
    }

    public getMinutoList(): Observable<any> {
        const _params = {};
        return this.http.get(this.url + "/AwsDesgravamen/getMinutoList", 
        {
          params: _params,
        });
    }

    public GetProductsList(data): Observable<any> {
        console.log('data: '+data);
        let params = new HttpParams().set("nBranch",data);
        return this.http.get(this.url + "/AwsDesgravamen/GetProductsList", {headers:this.headers,params:params});
      }

    public nuevoHorario(data: any): Observable<any> {
        
        return this.http.post(this.url + '/AwsDesgravamen/nuevoHorario', data,{
            headers:this.headers,});
    }  

    public actualizarHorario(data: any): Observable<any> {
        
        return this.http.post(this.url + '/AwsDesgravamen/actualizarHorario', data,{
            headers:this.headers,});
    }  

    /*public listPerPerfil(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/Rebill/listPerPerfil', data, {
            headers: this.headers,
        });
    }*/

    public BorrarHorario(data: any): Observable<any> {

        console.log("data2: " + data.NBRANCH);
        
        let params = new HttpParams()
        .set("NBRANCH",data.NBRANCH)
        .set("NPRODUCT",data.NPRODUCT)
        .set("NDIA",data.NDIA)
        
        return this.http.get(this.url + '/AwsDesgravamen/BorrarHorario', {headers:this.headers,params:params});
    }  
  }