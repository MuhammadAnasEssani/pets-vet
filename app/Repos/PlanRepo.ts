import BaseRepo from 'App/Repos/BaseRepo'
import Plan from "App/Models/Plan";


class PlanRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(Plan, relations, scopes)
        this.model = Plan
    }
}

export default new PlanRepo()