const express = require('express');
const rechargeRoute = express.Router();
const axios = require('axios');
const debug = require('debug')('app:rechargeRoute');

function router() {
  rechargeRoute.route('/').post((req, res) => {
    (async function postCards() {
      try {
        const { public, secret, phone, network } = req.body
        debug(public, secret, phone, network)
        if (!public || !secret || !phone || !network) {
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
              Amount: 100,
              PhoneNumber: phone,
              SecretKey: secretKey
            })
        };

        // axios.all([recharge(phone), recharge('07068260000')])
        //   .then(axios.spread(function (response, perms) {
        //     // Both requests are now complete            
        //     debug(response.data, perms.data.Response)
        //     debug(response.status);
        //     debug(response.statusText);
        //     debug(response.headers);
        //     debug(response.config);
        //     res.status(200).send('<h3>Recharged successfully</h3>')
        //   })).catch(function (error) {
        //     debug(error);
        //     res.status(200).send(`<h3>${error}</h3>`)
        //   })

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

  rechargeRoute.route('/multiple').post((req, res) => {
    (async function postCards() {
      try {

        function recharge(phone, network, amount) {
          return axios({
            method: 'post',
            url: 'https://api.wallets.africa/bills/airtime/providers',
            // url: 'https://api.wallets.africa/wallet/balance',
            //url:'https://api.wallets.africa/bills/airtime/purchase',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 103lamgop7db'
            },
            data: JSON.stringify(
              {
                Code: network,
                Amount: amount,
                PhoneNumber: phone,
                SecretKey: '5u5aak9rr9ke'
              })
  
          })
        }
        let arr = req.body
        debug(arr)
        let response = [] 
        for(let i of arr){
          let number = i.phone
          let code = i.network.trim().toLowerCase()
          let amount = i.amount
          debug(number, code, amount)
          const resu = await recharge(number, code, amount)
          //response.push(resu.data)
          response.push(resu.data)
        }
        debug(response)
        noOfSuccessfulRecharges = 0
        noOfFailedRecharges = 0
        for(let i of response){
          if(i === '100'){
            noOfSuccessfulRecharges =+ 1
          }
          if(i !== '100'){
            noOfFailedRecharges =+ 1
          }
        }
        res.status(200).json(response)
        // res.status(200).render('view', {
        //   msg: `${noOfSuccessfulRecharges} were successful while ${noOfFailedRecharges} were not`})
      } catch (error) {
        debug(error.stack)
        res.status(200).render('error', {err: error.stack})
      }
    }());
  })

  return rechargeRoute
}

module.exports = router;
