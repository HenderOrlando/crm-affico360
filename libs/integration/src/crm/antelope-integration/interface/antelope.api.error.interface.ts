export interface AntelopeApiErrorDto {
  // Returns the error code for the exception ,
  errorCode: number;

  // The basic meaning of the exception ,
  errorDesc: string;

  // The spesific reason for exception
  errorDetails: string;
}
