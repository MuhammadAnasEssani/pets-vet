import BaseRepo from 'App/Repos/BaseRepo'
import GatewayTransaction from "App/Models/GatewayTransaction";


class GatewayTransactionRepo extends BaseRepo {
    model

    constructor() {
        const relations = []
        const scopes = []
        super(GatewayTransaction, relations, scopes)
        this.model = GatewayTransaction
    }
}

export default new GatewayTransactionRepo()