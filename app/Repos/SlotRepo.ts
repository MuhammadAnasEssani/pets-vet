import BaseRepo from 'App/Repos/BaseRepo'
import Slot from "App/Models/Slot";


class SlotRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(Slot, relations, scopes)
        this.model = Slot
    }
}

export default new SlotRepo()