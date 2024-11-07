import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class GatewayTransaction extends CommonModel {
    @column({isPrimary:true})
    public id: number
	@column()
	public gatewayTransactionId: string
	@column()
	public paymentMethodId: string
	@column()
	public responseObject: string
	@column()
	public transactionId: number


    /*
    * ######################### RELATIONS ##########################
    * */




    /*
    * ######################### SCOPES ##########################
    * */



    /*
    * ######################### HOOKS ##########################
    * */
}
