import BaseRepo from 'App/Repos/BaseRepo'
import VetSpecialization from "App/Models/VetSpecialization";


class VetSpecializationRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(VetSpecialization, relations, scopes)
        this.model = VetSpecialization
    }
}

export default new VetSpecializationRepo()