export type Owner = {
  name: string;
  ownership: number;
  income: number;
};

export type Property = {
  _id: string;
  title: string;
  location: string;
  type: string;
  state: string;
  purchase_price: number;
  deposit: number;
  loan_amount?: number;
  rent?: number;
  owners: Owner[];
  createdAt: string;
};
