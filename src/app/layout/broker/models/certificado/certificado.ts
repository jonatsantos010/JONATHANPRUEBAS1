export class Certificado {
  P_NIDPROCESS: string;
  P_NPOLICY: string; // NUMERO DE POLIZA
  P_DISSUEDAT: Date; // FECHA DE EMISIÓN
  P_DSTARTDATE: Date; // FECHA DE INICIO DE VIGENCIA
  P_DEXPIRDAT: Date; // FECHA DE FIN DE VIGENCIA
  P_NCODCHANNEL_BO: number; // CODIGO DE CANAL
  P_SDESCHANNEL_BO: string; // DESCRIPCION DE CANAL
  P_NCODNUMPOINT_BO: number; // CODIGO DE PUNTO DE VENTA
  P_SDESNUMPOINT_BO: string; // DESCRIPCION DE PUNTO DE VENTA
  P_NTYPECHANNEL_BO: number; // CODIGO DE TIPO DE CANAL
  P_NPLAN: string; // PLAN DE TARIFARIO VALOR DEL COMBO
  P_NPREMIUM: number; // PV_PROCESS_EMISION_SOAT.NPREMIUM%TYPE --PRIMA DEL TARIFARIO
  /* P_NPREMIUMR: number; // PRIMA RENOVACION */
  P_NCOMISSION: number; // COMISSION DEL TARIFARIO
  P_NIDCAMPAIGN: number;
  V_NIDPROCESS: number;

  // New Tarifario
  P_DESCRIPTARIFARIO: string; // PLAN DE TARIFARIO VALOR DEL COMBO
  P_IDTARIFARIO: string; // PLAN DE TARIFARIO VALOR DEL COMBO
  P_NINTERMED_BROK: number; // CODIGO DE BROKER
  P_NCOMISSION_BROK: number; // COMISION DE BROKER
  P_NINTERMED_INTERM: number; // CODIGO DE INTERMEDIARIO
  P_NCOMISSION_INTERM: number; // COMISION DE INTERMEDIARIO
  P_NINTERMED_SPOINT: number; // CODIGO DE PUNTO DE VENTA
  P_NCOMISSION_SPOINT: number; // COMISION DE PUNTO DE VENTA
  P_NTIPOPAPEL: number; // COMISION DE PUNTO DE VENTA

  // New Delivery
  P_DFECHAENTREGADELIVERY: Date;
  P_STURNOENTREGADELIVERY: string;
  P_STURNOENTREGADESCRIPTDELIVERY: string;
  P_SFORMAPAGODELIVERY: string;
  P_SFORMAPAGODESCRIPTDELIVERY: string;
  P_SDIRECCIONENTREGADELIVERY: string;
  P_SCOMENTARIODELIVERY: string;
  P_NHAVEDELIVERY: number;
  P_NMUNICIPALITYDELIVERY: number;
  P_SMUNICIPALITYDESCRIPTDELIVERY: string;
  P_NLOCATDELIVERY: number;
  P_NLOCATDELIVERYDESCRIPTDELIVERY: string;
  P_NPROVINCEDELIVERY: number;
  P_NPROVINCEDESCRIPTDELIVERY: string;

  IsPd: boolean;
}
