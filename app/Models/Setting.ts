import {column} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from "App/Models/CommonModel";

export default class Setting extends CommonModel {
    @column({isPrimary:true})
    public id: number
	@column()
	public platformFees: number
	@column()
	public adminCut: number


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
