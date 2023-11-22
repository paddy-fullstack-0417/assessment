export interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
}

export interface IAD_TYPE {
  id: string;
  Allowed_Spend_per_Ad: number;
  Cost_Share_Rate: number;
  spend: any;
}
