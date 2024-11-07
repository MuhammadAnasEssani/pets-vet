import BaseRepo from 'App/Repos/BaseRepo'
import Module from "App/Models/Module";


class ModuleRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(Module, relations, scopes)
        this.model = Module
    }
}

export default new ModuleRepo()