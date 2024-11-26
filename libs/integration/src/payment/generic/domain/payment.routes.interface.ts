export default interface PaymentRoutesInterface {
  sandbox: BasicPaymentRoutesInterface;
  api: BasicPaymentRoutesInterface;
}

interface BasicPaymentRoutesInterface {
  urlToPay: string;
  sendPayment: string;
  getPayment: string;
  getUrlToPay: string;
}
