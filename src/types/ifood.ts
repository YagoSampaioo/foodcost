export interface IfoodProduct {}

export interface IfoodSale {}

export interface Document {
  value: string;
  type: "CNPJ" | string;
}

export interface Merchant {
  id: string;
  shortId: number;
  documents: Document[];
  name: string;
  type: "RESTAURANT" | string;
  timezone: string;
}

export interface SaleGrossValue {
  bag: number;
  deliveryFee: number;
  serviceFee: number;
}

export interface InformationProvider {
  name: "DELIVERY_OFFER" | string;
}

export interface DeliveryParameters {
  logisticProvider: "MERCHANT" | string;
  deliveryProduct: "SELF_DELIVERY" | string;
  code: "DEFAULT" | string;
  schedulingType: "IMMEDIATE" | string;
}

export interface DeliveryPrices {
  grossValue: number;
  discount: number;
  netValue: number;
}

export interface Delivery {
  informationProvider: InformationProvider;
  type: "DELIVERY" | string;
  deliveryParameters: DeliveryParameters;
  prices: DeliveryPrices;
}

export interface Card {
  brand: "SODEXO" | string;
}

export interface PaymentMethod {
  method: "MEAL_VOUCHER" | string;
  currency: "BRL" | string;
  value: number;
  card: Card;
  liability: "MERCHANT" | string;
}

export interface Payments {
  methods: PaymentMethod[];
}

export interface CancellationDispute {
  automaticRefund: boolean;
  reason: "CANCELLED_BEFORE_CONFIRMED" | string;
  isContestable: "CANCELLATION_IS_NOT_CONTESTABLE" | string;
  reasons: string[];
}

export interface OrderStatusMetadata {
  cancelStage?: string;
  cancelOrigin?: "SCHEDULER" | string;
  cancelCode?: string;
  cancelCodeDescription?: string;
  cancellationDispute?: CancellationDispute;
}

export interface OrderStatusHistory {
  value: "CANCELLED" | "PLACED" | "CREATED" | string;
  createdAt: string;
  metadata?: OrderStatusMetadata;
}

export interface BillingSummary {
  saleBalance: number;
  billingEntries: any[];
}

export interface RefundInfo {
  amount: number;
  currency: "BRL" | string;
  originalAmount?: number;
  category: "FULL_REFUND" | "NO_REFUND_MERCHANT" | string;
  deadlineInMinutes: number;
}

export interface Payout {
  amount: number;
  chargeback: boolean;
  currency: "BRL" | string;
  id: string;
  type: "CREDIT" | string;
  category: "NO_REFUND_MERCHANT" | string;
  compensate: boolean;
  creditType: "NA" | string;
}

export interface OrderEventMetadata {
  originType: string;
  createdAt: string;
  metadata: {
    orderAmount?: string;
    merchantId?: string;
    paymentLiability?: "MERCHANT" | string;
    cancellationRequestSource?: string;
    paymentMethod?: "MEAL_VOUCHER" | string;
    type?: "CANCELLATION" | "NO_REFUND_MERCHANT" | string;
    cancellationId?: string;
    cancelCode?: number;
    cancelOrigin?: "SCHEDULER" | string;
    paymentType?: "ONLINE" | string;
    isTestOrder?: boolean;
    salesChannel?: "IFOOD" | string;
    category?: "FOOD" | string;
    refundId?: string;
  };
  originId: string;
  orderId: string;
  tribe: string;
  id: string;
  source: "Cancellation_Api" | string;
  refund?: RefundInfo;
  payout?: Payout;
}

export interface OrderEvent {
  id: string;
  fullCode: "REFUND" | "CANCEL" | "CANCELLED" | "RECEIVED" | string;
  code: "RF" | "CANC" | "CAN" | "RC" | string;
  createdAt: string;
  metadata?: OrderEventMetadata;
}

export interface Sale {
  id: string;
  shortId: string;
  createdAt: string;
  type: "ORDER" | string;
  category: "FOOD" | string;
  salesChannel: "IFOOD" | string;
  currentStatus: "CANCELLED" | "PLACED" | "CREATED" | "CONFIRMED" | "DELIVERED" | string;
  merchant: Merchant;
  saleGrossValue: SaleGrossValue;
  delivery: Delivery;
  payments: Payments;
  orderStatusHistory: OrderStatusHistory[];
  billingSummary: BillingSummary;
  orderEvents: OrderEvent[];
}

export interface SalesApiResponse {
  page: number;
  size: number;
  beginSalesDate: string;
  endSalesDate: string;
  sales: Sale[];
  total: number;
  pageCount: number;
}

export type IfoodSalesResponse = SalesApiResponse[];

