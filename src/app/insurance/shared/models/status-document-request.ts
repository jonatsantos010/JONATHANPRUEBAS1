export class StatusDocumentRequest {
  numeroDocumento: string;
  digitoVerificador: string;
  error: number;

  constructor({ numeroDocumento, digitoVerificador, error }) {
    this.numeroDocumento = numeroDocumento;
    this.digitoVerificador = digitoVerificador;
    this.error = error;
  }
}
