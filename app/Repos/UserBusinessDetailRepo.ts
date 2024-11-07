import BaseRepo from 'App/Repos/BaseRepo'
import UserBusinessDetail from "App/Models/UserBusinessDetail";


class UserBusinessDetailRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(UserBusinessDetail, relations, scopes)
        this.model = UserBusinessDetail
    }
}

export default new UserBusinessDetailRepo()