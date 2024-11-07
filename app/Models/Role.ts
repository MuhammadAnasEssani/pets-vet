import {column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import CommonModel from 'App/Models/CommonModel'
import Module from 'App/Models/Module'

export default class Role extends CommonModel {

  static TYPES = {
    ADMIN: 1,
    PET: 2,
    VET: 3
  }

  @column()
  public id: number

  @column()
  public name: string

  @column()
  public displayName: string

  @column()
  public description: string


  /*
  * ######################### RELATIONS ##########################
  * */


  @manyToMany(()=> Module,{
    pivotTable:'role_permissions',
    pivotColumns: ['create','read','update','delete'], //By default pivot only include default pivot columns, but we need to explicitly mention other columns.
  })
  public permissions: ManyToMany<typeof Module>

  /*
    * ######################### HOOKS ##########################
    * */



}
