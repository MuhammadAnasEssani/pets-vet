import ExceptionWithCode from "App/Exceptions/ExceptionWithCode";
import Env from '@ioc:Adonis/Core/Env'

const qs = require('qs');
const braintree = require("braintree");
const axios = require('axios');
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // or braintree.Environment.Production
  merchantId: Env.get('BRAINTREE_MERCHANT_ID'),
  publicKey: Env.get('BRAINTREE_PUBLIC_KEY'),
  privateKey: Env.get('BRAINTREE_PRIVATE_KEY')
});

// const gateway = new braintree.BraintreeGateway({
//   environment:  braintree.Environment.Sandbox,
//   merchantId:   '6xpmc67ch65jt5nt',
//   publicKey:    '9sxdx2gzz3ffvwtj',
//   privateKey:   '243af079293690228d99a2876a9472da'
// });

const PAYPAL_REQUEST_URL = "https://api-m.sandbox.paypal.com"//https://api-m.paypal.com, https://api-m.sandbox.paypal.com

class PaypalService {
  async createCustomer(email,name){


    const customer = await  gateway.customer.create({
      firstName: name,
      lastName: '',
      email: email
    })
    return customer
  }

  async addPaymentMethod(customerId,nonce){
    return gateway.paymentMethod.create({
      customerId: customerId,
      paymentMethodNonce: nonce,
    })

  }

  async deletePaymentMethod(token){

    return gateway.paymentMethod.delete(token);

  }

  async charge(_customerId,token, amount, paypal_pay = false,settlement = true) {
    let result
    if (paypal_pay){
      result = await gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: token,
        options: {
          submitForSettlement: settlement
        }
      })
      if (result.success && settlement ? (result.transaction.status == "submitted_for_settlement" || result.transaction.status == "settling") : result.transaction.status === "authorized") {
        return result
      } else {
        throw new ExceptionWithCode("transaction is not submitted for settlement",400)
      }
    }else {
      result = await gateway.transaction.sale({
        amount: amount,
        paymentMethodToken: token,
        // customerId: customerId,
        options: {
          submitForSettlement: settlement
        }
      })

      if (result.success && settlement ? result?.transaction?.status == "submitted_for_settlement" : result?.transaction?.status === "authorized") {
        return result
      } else {
        throw new ExceptionWithCode("transaction is not submitted for settlement",400)
      }
    }

  }

  async submitForSettlement(transactionId: string) {
    const result = await gateway.transaction.submitForSettlement(transactionId);

    if (result.success && result.transaction.status === "submitted_for_settlement") {
      // Update the appointment status and transaction status in your database
      return result.transaction;
    } else {
      throw new ExceptionWithCode("transaction is not submitted for settlement", 400);
    }
  }

  async refund(transactionId : string, amount : number) {
    // Issue the partial refund
    return gateway.transaction.refund(transactionId, amount);
  }


  async paypalRequest(endpoint, data = {}, method, config = {}) {
    let request;
    switch (method) {
      case "post":
        request = await axios.post(PAYPAL_REQUEST_URL + endpoint, data, config)
        return request.data
        break;
      case "get":
        request = await axios.get(PAYPAL_REQUEST_URL + endpoint, config)
        return request.data
        break;
    }

  }

  async getPayPalToken() {
    const data = qs.stringify({
      'grant_type': 'client_credentials',
      'ignoreCache': 'true'
    });
    const base_64 = btoa(Env.get('PAYPAL_CLIENT_ID') + ":" + Env.get('PAYPAL_CLIENT_SECRET'));

    let request = await this.paypalRequest("/v1/oauth2/token", data, "post", {
      //sandbox
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base_64}`
      }
    })
    return request.access_token
  }


  async payoutRequest(data) {
    data = JSON.stringify(data)
    let token = await this.getPayPalToken()
    let request = await this.paypalRequest("/v1/payments/payouts", data, "post", {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
    if (request?.batch_header?.payout_batch_id) {
      let payout_details = await this.paypalRequest("/v1/payments/payouts/" + request?.batch_header?.payout_batch_id, {}, "get", {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
      })
      return payout_details;
    }
    return request;
  }
  async payout(appointment_id,connect_account_id,amount){
    let payoutItems : any = [];
    let payoutObject = {
      "sender_batch_header": {
        "sender_batch_id": `Payouts_${new Date().getTime()}`,
        "email_subject": "You have a payout!",
        "email_message": "You have received a payout! Thanks for using our service!"
      }
    }

    if (connect_account_id) {
      let payoutItem :any = {
        recipient_type: "EMAIL",
        amount: {
          value: amount.toFixed(2),
          currency: "USD"
        },
        note: "Thanks for your patronage!",
        sender_item_id: `${appointment_id}-${new Date().getTime()}`,
        receiver: connect_account_id,
        notification_language: "en-US"
      }
      payoutItems.push(payoutItem)
    }

    if (payoutItems.length > 0) {
      payoutObject['items'] = payoutItems
      return this.payoutRequest(payoutObject)
      // let bulkData: any = []
      // if (payout.items) {
      //   let item = payout.items[0];
      //   let sender_item_id = item?.payout_item?.sender_item_id
      //   sender_item_id = sender_item_id.split("-")
      //   let data = {
      //     order_id: sender_item_id[1],
      //     user_id: sender_item_id[0],
      //     payout_batch_id: item.payout_batch_id,
      //     payout_item_id: item.payout_item_id,
      //     amount: item?.payout_item?.amount?.value,
      //     currency: item?.payout_item?.amount?.currency,
      //     receiver: item?.payout_item?.receiver,
      //     sender_item_id: item?.payout_item?.sender_item_id,
      //     status: item.transaction_status
      //   }
      //   bulkData.push(data)
      // }
      // await Payout.createMany(bulkData);
      // return payout;
    }
  }
}

export default new PaypalService()
