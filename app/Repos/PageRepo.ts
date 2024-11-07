import BaseRepo from 'App/Repos/BaseRepo'
import Page from "App/Models/Page";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import {SimplePaginatorContract} from "@ioc:Adonis/Lucid/Database";
import constants from "Config/constants";
import {HttpContext} from "@adonisjs/core/build/standalone";

var _ = require('lodash');

class PageRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Page, relations, scopes)
    this.model = Page
  }

  async index(orderByColumn: string = constants.ORDER_BY_COLUMN, orderByValue: string = constants.ORDER_BY_VALUE, page: number = 1, perPage: number = constants.PER_PAGE): Promise<SimplePaginatorContract<any>> {
    const ctx: any = HttpContext.get()
    if (ctx.request.input('slug', null)) {
      return this.model.query().where('slug', ctx.request.input('slug')).first()
    }
    return super.index(orderByColumn, orderByValue, page, perPage);
  }



  async store(
    input,
    _request?: RequestContract,
    _instanceType?: number,
    _deleteOldMedia = false,
    _trx?: any
  ) {
    input.slug = _.kebabCase(input.title)

    return this.model.updateOrCreate({slug: input.slug}, input)
  }

  async update(id: number, input, request?: RequestContract, instanceType?: number, deleteOldMedia: boolean = false, trx?: any): Promise<any> {
    input.slug = _.kebabCase(input.title);
    return super.update(id, input, request, instanceType, deleteOldMedia, trx);
  }
}

export default new PageRepo()
