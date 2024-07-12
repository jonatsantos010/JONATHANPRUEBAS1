export class DataSuscriptionRequest{
    APELLIDO_MATERNO:string;
    APELLIDO_PATERNO:string;
    APORTE_TOTAL:number;
    NOMBRE:string;
    NUMERO_DOCUMENTO:string;
    NUMERO_POLIZA:string;
    PRODUCTO:string; 
    RAMO:string;
    TIPO_DOCUMENTO:string;
    SCLIENT:string;
    TIPO_DOCUMENTO_ID:number;
    MONTO_SUSCRIPCION:number;
}

export class DataSuscription{
    P_NID_COTIZACION: number;
    P_NID_PROC: string;
    P_NTYPE_SCORE: number;
    P_NSTATE_SOLID: number;
    P_NMONTO_SUSCRIPCION: number;
    P_NAPORTE_TOTAL: number;
    P_NVALOR_CUOTA: number;
    P_DCHANGDAT: Date;
    P_DCOMPDATE: Date;
}