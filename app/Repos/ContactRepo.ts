import BaseRepo from 'App/Repos/BaseRepo'
import Contact from "App/Models/Contact";


class ContactRepo extends BaseRepo {
  model

  constructor() {
    const relations = []
    const scopes = []
    super(Contact, relations, scopes)
    this.model = Contact
  }
}

export default new ContactRepo()
