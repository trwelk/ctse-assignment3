const Router = require('@koa/router');
const StrgProduct = require('../models/StrgProduct')
const StrgStock = require('../models/StrgStock')
const router = new Router({
    prefix: '/products'
});

router.post('/', async ctx => {
    console.log('trwel')
    try {
        //validate req.body data before saving
        let { productId, productName, productType, description, unitOfMeasurement, stocks , unitPrice} = ctx.request.body;
            const strgProduct = new StrgProduct({
                productId: productId,
                description: description,
                productName: productName,
                productType: productType,
                unitOfMeasurement: unitOfMeasurement,
                stocks: stocks,
                unitPrice:unitPrice
            });

            await strgProduct.save();
            ctx.response.status = (201)
            ctx.response.body = { success: true, data: strgProduct };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let { productId, productName, productType, description, unitOfMeasurement, stocks , unitPrice} = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const strgProduct = {
                productId: productId,
                productName: productName,
                productType: productType,
                description:description,
                unitOfMeasurement: unitOfMeasurement,
                stocks: stocks,
                unitPrice:unitPrice
            };

            var updatedProduct = await StrgProduct.findOneAndUpdate(filter, strgProduct, {
                new: true,
             })
            ctx.response.status = (200)
            ctx.response.body = { success: true, data: updatedProduct };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});


router.get('/', async ctx => {
    try {
        const data = await StrgProduct.find()
                .populate({ path: 'stocks'})    ;
        ctx.response.status = 200
        ctx.response.body = { success: true, data: data };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
})

router.get('/:id', async ctx => {
    try {
        let { id } = ctx.params;
        const data = await StrgProduct.find({_id:id})
            .populate({ path: 'stocks' });
        ctx.response.status = 200
        ctx.response.body = { success: true, data: data };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
 })


router.delete('/:id', async ctx => {
    try {
        let { id } = ctx.params;
        var deletedProduct = await StrgProduct.findById({"_id":id})
        await StrgProduct.deleteOne({_id: id});
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedProduct };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;