import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import Module from 'App/Models/Module'
import constants from 'Config/constants'
import Day from 'App/Models/Day'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

export default class InitialSeeder extends BaseSeeder {
  public async run() {

    /*
    * Roles
    * */
    await this.roles()

    /*
    * Modules
    * */
    await this.modules()

    /*
    * Roles Permission
    * */
    await this.permissions()

    /*
    * Register Admin
    * */
    await this.registerAdmin()

    /*
    * Days
    * */
    await this.days()
  }

  private password = 'Demo@123'

  async registerAdmin() {

    let input = {
      email: constants.SEEDER_CONSTANTS.ADMIN_EMAIL,
      password: await Hash.make(this.password),
      full_name: 'Admin',
      is_completed: 1,
      is_verified: 1,
      phone: "xxxxxxxxxxxxx"
    }
    const user =await Database.table('users').insert(input)
    /*User Role*/
    await Database.table('role_user').insert({
      user_id: user[0],
      role_id: Role.TYPES.ADMIN
    })
  }

  /*
  * Role Seeder'
  * */

  async roles() {

    const data = [
      {
        name: 'admin',
        display_name: 'Super Admin'
      },
      {
        name: 'pet',
        display_name: 'Pet'
      },
      {
        name: 'vet',
        display_name: 'Vet'
      }
    ]

    /*We are using Database insert method to avoid hitting create/update hook in role model*/
    await Database
      .table('roles')
      .multiInsert(data)
  }

  async days() {
    await Day.createMany([
      {
        name: 'Monday',
      },
      {
        name: 'Tuesday',
      },
      {
        name: 'Wednesday',
      },
      {
        name: 'Thursday',
      },
      {
        name: 'Friday',
      },
      {
        name: 'Saturday',
      },
      {
        name: 'Sunday',
      }
    ])
  }

  setGetAllPermissions(){
    return {
      [Module.ITEMS.APPOINTMENT_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.USER_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.TRANSACTION_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.SCHEDULE_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.ROLE_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.USER_ADDRESSES]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PRESCRIPTION_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PLAN_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.PET_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.BREED_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.SLOT_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.CARD_MANAGEMENT]: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
    }
  }

  setGetVetPermissions(){
    return {
      [Module.ITEMS.APPOINTMENT_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 1,
        delete: 0,
      },
      [Module.ITEMS.USER_MANAGEMENT]: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.TRANSACTION_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.SCHEDULE_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.ROLE_MANAGEMENT]: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.USER_ADDRESSES]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PRESCRIPTION_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.PLAN_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PET_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.BREED_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.SLOT_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.CARD_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
    }
  }

  setGetPetPermissions(){
    return {
      [Module.ITEMS.APPOINTMENT_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 0,
      },
      [Module.ITEMS.USER_MANAGEMENT]: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.TRANSACTION_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.SCHEDULE_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.ROLE_MANAGEMENT]: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.USER_ADDRESSES]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
      [Module.ITEMS.PRESCRIPTION_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PLAN_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.PET_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.BREED_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.SLOT_MANAGEMENT]: {
        create: 0,
        read: 1,
        update: 0,
        delete: 0,
      },
      [Module.ITEMS.CARD_MANAGEMENT]: {
        create: 1,
        read: 1,
        update: 1,
        delete: 1,
      },
    }
  }

  async modules() {
    await Module.createMany([
      {
        id: Module.ITEMS.APPOINTMENT_MANAGEMENT,
        name: 'Appointment Management',
      },
      {
        id: Module.ITEMS.SCHEDULE_MANAGEMENT,
        name: 'Schedule Management',
      },
      {
        id: Module.ITEMS.TRANSACTION_MANAGEMENT,
        name: 'Transaction Management',
      },
      {
        id: Module.ITEMS.USER_MANAGEMENT,
        name: 'User Management',
      },
      {
        id: Module.ITEMS.ROLE_MANAGEMENT,
        name: 'Role Management',
      },
      {
        id: Module.ITEMS.BREED_MANAGEMENT,
        name: 'Breed Management',
      },
      {
        id: Module.ITEMS.CARD_MANAGEMENT,
        name: 'Card Management',
      },
      {
        id: Module.ITEMS.PET_MANAGEMENT,
        name: 'Pet Management',
      },
      {
        id: Module.ITEMS.PLAN_MANAGEMENT,
        name: 'Plan Management',
      },
      {
        id: Module.ITEMS.SLOT_MANAGEMENT,
        name: 'Schedule Management',
      },
      {
        id: Module.ITEMS.PRESCRIPTION_MANAGEMENT,
        name: 'Prescription Management',
      },
      {
        id: Module.ITEMS.USER_ADDRESSES,
        name: 'User Addresses',
      }
    ])
  }

  /*
  * Roles Permission
  * */

  async permissions(){
    const permissionsData = this.setGetAllPermissions()
    const petPermissionsData = this.setGetPetPermissions()
    const vetPermissionsData = this.setGetVetPermissions()


    // Admin Roles
    const adminRole = await Role.query().where({id: Role.TYPES.ADMIN}).first()
    await adminRole?.related('permissions').sync(permissionsData)

    // Pet Roles
    const petRole = await Role.query().where({id: Role.TYPES.PET}).first()
    await petRole?.related('permissions').sync(petPermissionsData)

    // Vet Roles
    const vetRole = await Role.query().where({id: Role.TYPES.VET}).first()
    await vetRole?.related('permissions').sync(vetPermissionsData)

  }




  async login(email, password, roleId){
    const input = {
      "email":email,
      "password":password,
      "device_type":"web",
      "device_token":"api_fjakdlfjasklfjkasdlf",
      "role_id" : roleId
    }
    const url = `${Env.get('APP_URL')}api/v1/login`
    const axiosResponse:any = await axios({
      method: 'post',
      url,
      data:input
    }).catch((e)=>console.log(e.response?.data.message))

    return axiosResponse.data
  }
}
