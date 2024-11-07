import {TransactionClientContract} from "@ioc:Adonis/Lucid/Database";

export interface ICreateTransaction {
  refId: number
  refType: number
  amount: number
  gatewayTransaction?: any
  trx?: TransactionClientContract
  type: number
}
