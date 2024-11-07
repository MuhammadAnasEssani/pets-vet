import BaseRepo from 'App/Repos/BaseRepo'
import Day from "App/Models/Day";


class DayRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(Day, relations, scopes)
        this.model = Day
    }
}

export default new DayRepo()