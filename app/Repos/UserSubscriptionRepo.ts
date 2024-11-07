import BaseRepo from 'App/Repos/BaseRepo'
import UserSubscription from "App/Models/UserSubscription";


class UserSubscriptionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(UserSubscription, relations, scopes)
        this.model = UserSubscription
    }
}

export default new UserSubscriptionRepo()