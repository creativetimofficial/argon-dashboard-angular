export interface Transaction {
  id?: string;
  confirmedDate: string;
  orderNo: string;
  status: string;
  type: string;
  documents?: TransactionDocument[];
  comments?: TransactionComment[];
  statusUpdates?: StatusUpdates[];
  dateCompleted?: string
}

export interface TransactionDocument {
  url: string;
  uploadDate: string;
}

export interface TransactionComment{
  comment: string;
  commentDate: string;
  user: string;
}

export interface StatusUpdates{
  status: string;
  dateUpdated: string;
  user: string;
}
