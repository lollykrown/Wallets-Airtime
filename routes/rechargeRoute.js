const express = require('express');
const rechargeRoute = express.Router();
const axios = require('axios');
const debug = require('debug')('app:rechargeRoute');

function router() {
  rechargeRoute.route('/').post((req, res) => {
    (async function postCards() {
      try {
        const { public, secret, phone, network, amount } = req.body
        debug(public, secret, phone, network, amount)
        if (!public || !secret || !phone || !network || !amount) {
          res.status(400).send({
            status: false,
            message: 'All fields are required'
          })
          return
        }
        const key = public.trim()
        const code = network.trim().toLowerCase()
        const secretKey = secret.trim()
        const auth = `Bearer ${key}`
        debug(auth, code)
        const options = {
          method: 'post',
          //url: 'https://api.wallets.africa/bills/airtime/providers',
          //url: 'https://api.wallets.africa/wallet/balance',
          url:'https://api.wallets.africa/bills/airtime/purchase',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          data: JSON.stringify(
            {
              Code: code,
              Amount: amount,
              PhoneNumber: phone,
              SecretKey: secretKey
            })
        };

        function recharge(phone) {
          return axios({
            method: 'post',
            //url: 'https://api.wallets.africa/bills/airtime/providers',
            // url: 'https://api.wallets.africa/wallet/balance',
            //url:'https://api.wallets.africa/bills/airtime/purchase',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
            },
            data: JSON.stringify(
              {
                Code: code,
                Amount: amount,
                PhoneNumber: phone,
                SecretKey: secretKey
              })
  
          })
        }

        axios(options)
          .then(function (response) {
            debug(response.data);
            res.status(200).render('response')
          }).catch(function (error) {
            debug(error);
            res.status(200).render('error', {err: error})
          })
      } catch (err) {
        debug(err.stack)
      }
    }());
  })

  return rechargeRoute
}

module.exports = router;
