const Router = require('@koa/router');
const StrgProduct = require('../models/StrgProduct')
const StrgStock = require('../models/StrgStock')
const axios = require('axios');
const AppConstants = require('../constants/AppConstants');
const StrgLocation = require('../models/StrgLocation');

const router = new Router({
   prefix: '/stocks'
});

Date.prototype.addDays = function(days) {
   console.log(days)
   var date = new Date(this.valueOf());
   date.setDate(date.getDate() + days);
   return date;
}

function parseDate(str) {
   var mdy = str.split('/');
   return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

function datediff(first, second) {
   // Take the difference between the dates and divide by milliseconds per day.
   // Round to nearest whole number to deal with DST.
   return Math.round((second-first)/(1000*60*60*24));
}

const predictExpiry = async ( stock, strgLocation ) => {
   console.log('tre1.2',stock,strgLocation)

  const data = {
      deflectionFromIdealHarvest : stock.deflectionFromIdealHarvest,
      daysSinceHarvest: stock.daysSinceHarvested,
      humidity: strgLocation.humidity,
      temperature : strgLocation.temperature,
      typeOfFood : 0
};
console.log('tre2',data)


const daysToExpireResponse =  await axios.post(AppConstants.EXPIRY_DATE_PREDICTOR_URL, data);
console.log('tre3',daysToExpireResponse)

var predictedExpiryDate = new Date(stock.recievedDate);
predictedExpiryDate = predictedExpiryDate.addDays(Math.ceil(daysToExpireResponse.data.data));
return predictedExpiryDate
}

router.post('/', async ctx => {

   try {
      //validate data as required
      console.log('tre1.0',ctx.request.body)

      const strgStock = new StrgStock(ctx.request.body);
      console.log('tre1',strgStock)
      const strgLocation = await StrgLocation.findById({ _id: strgStock.stockLocation })


      // strgStock.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
      const daysToExpireResponse = await predictExpiry(strgStock,strgLocation);
      strgStock.predictedExpiryDate = daysToExpireResponse.toISOString()
      // strgStock.predictedExpiryDate = 
      await strgStock.save();

      const strgProduct = await StrgProduct.findById({ _id: strgStock.product })
      strgProduct.stocks.push(strgStock);
      await strgProduct.save();

      //return new strgStock object, after saving it to Publisher
      ctx.response.status = (200)
      ctx.response.body = { success: true, data: strgStock };

   } catch (err) {
      ctx.response.status = 400
      if (err.path) {
         ctx.response.body = { success: false, error: `Provide a valid value for ${err.path}` };
      } else {
         ctx.response.body = { success: false, error: `An error occured` };
      }
   }
})

router.put('/:id', async ctx => {
   try {
      //validate req.body data before saving
      let { id } = ctx.params
      let { stockId, product, recievedQty, supplierId, outGoingQty, 
         purchasePrice, stockLocation, recievedDate,  deflectionFromIdealHarvest, daysSinceHarvested , predictedExpiryDate } = ctx.request.body;
      const filter = { _id: id };

      const strgStock = {
         stockId: stockId,
         product: product,
         supplierId: supplierId,
         outGoingQty: outGoingQty,
         stockLocation: stockLocation,
         recievedQty: recievedQty,
         purchasePrice: purchasePrice,
         deflectionFromIdealHarvest: deflectionFromIdealHarvest,
         predictedExpiryDate:predictedExpiryDate,
         daysSinceHarvested:daysSinceHarvested,
         recievedDate: recievedDate
      };

      var updatedStock = await StrgStock.findOneAndUpdate(filter, strgStock, {
         new: true,
      }).catch((err) => {
         ctx.response.status = 400
         ctx.response.body = { success: false, message: err.message };
      })
      ctx.response.status = (200)
      ctx.response.body = { success: true, data: updatedStock };
   } catch (err) {
      ctx.response.status = 400
      ctx.response.body = { success: false, message: err.message };
   }
});

router.delete('/:id', async ctx => {
   try {
      let { id } = ctx.params;
      var deletedStock = await StrgStock.findOneAndRemove({ _id: id });
      ctx.response.status = (200)
      ctx.response.body = { success: true, data: deletedStock };

   } catch (err) {
      ctx.response.status = 400
      ctx.response.body = { success: false, message: err.message };
   }
});


router.get('/donatable-stocks', async ctx => {
   try {
       var data = await StrgStock.find({predictedExpiryDate: {$gt: new Date().toISOString()}})
       .populate("product", "productName")
       ;
       data = data.filter((stock) => {
        
               var recievedDate = new Date(stock.recievedDate);
               console.log('recievedDate',recievedDate)
               var currendDate = new Date();
               console.log('currendDate',currendDate)
   
               var predictedExpiryDate = new Date(stock.predictedExpiryDate);
               console.log('predictedExpiryDate',predictedExpiryDate)
   
               var numberOfDaysToExpire = datediff(recievedDate,predictedExpiryDate)
               console.log('totalDays',numberOfDaysToExpire)
   
               var daysLeftTillExpi  = numberOfDaysToExpire - datediff(recievedDate,currendDate)
               console.log('daysLeftTillExpi',daysLeftTillExpi)
               console.log('2.5/10 * totalDays',2.5/10 * numberOfDaysToExpire)
               return ( daysLeftTillExpi >= 2.5 / 10 * numberOfDaysToExpire );
       
       })

       ctx.response.status = 200
       ctx.response.body = { success: true, data: data };
   } catch (err) {
       ctx.response.status = 400
       ctx.response.body = { success: false, message: err.message };
   }
})


module.exports = router;