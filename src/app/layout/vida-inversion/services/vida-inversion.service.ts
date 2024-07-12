import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class VidaInversionService {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private Url = AppConfig.URL_API_SCTR;
    private IdeconUrl = AppConfig.URL_API_IDECON;
    private WorldCheckUrl = AppConfig.URL_API_WORLD_CHECK;

    constructor(private http: HttpClient) { }

    public insertProspect(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/InsertProspect', body, { headers: this.headers });
    }

    public consultProspect(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ConsultProspect', body, { headers: this.headers });
    }

    public ConsultDataComplementary(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ConsultDataComplementary', body, { headers: this.headers });
    }


    public getProspects(data: any = {}): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/GetAllProspect', body, { headers: this.headers });
    }

    /* DGC - VIGP PEP - 06/02/2024 - INICIO */
    public getIdecon(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.IdeconUrl + '/idecon/getCoincidenceNotPep', body, { headers: this.headers });
    }

    public getWorldCheck(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.WorldCheckUrl + '/WC1/getCoincidenceNotPep', body, { headers: this.headers });
    }

    public invokeServiceExperia(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ClientManager/InvokeServiceExperia', body, { headers: this.headers });
    }
    /* DGC - VIGP PEP - 06/02/2024 - FIN */

    public saveDirection(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/SaveDirection', body, { headers: this.headers });
    }

    public searchByProspect(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/GetProspectById', body, { headers: this.headers });
    }

    public investmentFunds(): Observable<any> {
        return this.http.get(this.Url + '/QuotationManager/InvestmentFunds', { headers: this.headers });
    }

    public savingTime(): Observable<any> {
        return this.http.get(this.Url + '/QuotationManager/SavingTime', { headers: this.headers });
    }

    public getIntermeds(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/GetIntermeds', body, { headers: this.headers });
    }

    public reasignarIntermediario(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ReasignarIntermediario', body, { headers: this.headers });
    }

    public AddEmailVIGP(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/PDFGenerator/AddEmailVIGP', body, { headers: this.headers });
    }

    public AddEmailVIGPList(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/PDFGenerator/AddEmailVIGPList', body, { headers: this.headers });
    }

    public ConsultaIdecom(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ConsultaIdecom', body, { headers: this.headers });
    }
    
    public InsUpdIdecom(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/InsUpdIdecom', body, { headers: this.headers });
    }
    public updateIdecom(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/updateIdecom', body, { headers: this.headers });
    }
    public ConsultaWorldCheck(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ConsultaWorldCheck', body, { headers: this.headers });
    }

    public InsUpdWorldCheck(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/InsUpdWorldCheck', body, { headers: this.headers });
    }

    // DGC - VIGP - 19/01/2024
    public InsUpdDatosPEPVIGP(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/InsUpdDatosPEPVIGP', body, { headers: this.headers });
    }

    public UpdDataComplementaryVIGP(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/UpdDataComplementaryVIGP', body, { headers: this.headers });
    }

    public SelDatosPEPVIGP(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/SelDatosPEPVIGP', body, { headers: this.headers });
    }

    public ReadDocumentsVIGP(data: any): Observable<any> {
        return this.http.post(this.Url + '/QuotationManager/ReadDocumentsVIGP', data);
    }

    public SaveDocumentsVIGP(data: FormData): Observable<any> {
        return this.http.post(this.Url + '/QuotationManager/SaveDocumentsVIGP', data);
    }

    public DeleteDocumentsVIGP(data: any): Observable<any> {
        return this.http.post(this.Url + '/QuotationManager/DeleteDocumentsVIGP', data);
    }

    public DownloadDocumentsVIGP(_filePath: string): Observable<any> {
        let data = { filePath: _filePath };
        return this.http.get(this.Url + "/QuotationManager/DownloadDocumentsVIGP", { params: data, responseType: 'blob' });
    }

    public GetProviderListVIGP(ramo: number): Observable<any> {
        const data = { ramo };
        return this.http.post(this.Url + '/QuotationManager/GetProviderListVIGP', data);
    }

    public InsOriginDetailCab(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/InsUpdOriginDetailCab', body, { headers: this.headers });
    }

    public GetOriginDetailCab(cotizacion_id: any): Observable<any> {
        const body = { P_NID_COTIZACION: cotizacion_id };
        return this.http.post(this.Url + '/QuotationManager/GetOriginDetailCab', body);
    }

    public InsOriginDetailDet(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/InsUpdOriginDetailDet', body, { headers: this.headers });
    }

    public GetOriginDetailDet(cotizacion_id: any): Observable<any> {
        const body = { P_NID_COTIZACION: cotizacion_id };
        return this.http.post(this.Url + '/QuotationManager/GetOriginDetailDet', body);
    }

    public DeleteOriginDetail(cotizacion_id: any): Observable<any> {
        const body = { P_NID_COTIZACION: cotizacion_id };
        return this.http.post(this.Url + '/QuotationManager/DeleteOriginDetail', body);
    }

    public InsPerfilamiento(formData: FormData): Observable<any> {
        return this.http.post(this.Url + '/QuotationManager/InsPerfilamiento', formData);
    }

    public RequestScoring(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/RequestScoring', body, { headers: this.headers });
    }

    public getScoringOptions(): Observable<any> {
        return this.http.get(this.Url + '/QuotationManager/GetScoringOptions', { headers: this.headers });
    }

    public CleanBeneficiar(formData: FormData): Observable<any> {
        return this.http.post(this.Url + '/QuotationManager/CleanBeneficiar', formData);
    }

    public validateClientProspect(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/ProspectsManager/ValidateClientProspect', body, { headers: this.headers });
    }

    public ListarReportePolizaTransaccionVIGP(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/PolicyManager/ListarReportePolizaTransaccionVIGP', body, { headers: this.headers });
    }
 
    public getDateIdecon(P_SCLIENT: any): Observable<any> {
        let _params = { P_SCLIENT: P_SCLIENT }
        return this.http.get(this.Url + `/ProspectsManager/GetDateIdecom?P_SCLIENT=${_params.P_SCLIENT}`);
    } 

    public ListarSolicitudesSuscripcion(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/PolicyManager/ListarSolicitudesSuscripcion', body, { headers: this.headers });
    }
    public InsertarSuscripcion(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/PolicyManager/INS_SUSCRIPTION_VIGP', body, { headers: this.headers });
    }

    public GetBeneficiaries(P_NID_COTIZACION: any,P_NID_PROC:any): Observable<any> {
        let _params = { P_NID_COTIZACION: P_NID_COTIZACION,P_NID_PROC: P_NID_PROC}
        return this.http.get(this.Url + `/PolicyManager/GetBeneficiaries?P_NID_COTIZACION=${_params.P_NID_COTIZACION}&P_NID_PROC=${_params.P_NID_PROC}`);
    }

    public GetQuotationFunds(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/GetQuotationFunds', body, { headers: this.headers });
    }

    public InsQuotationFunds(data: any): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(this.Url + '/QuotationManager/InsQuotationFunds', body, { headers: this.headers });
    }
}