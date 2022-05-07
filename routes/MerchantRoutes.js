const Router = require('@koa/router');
const Merchant = require('../models/Merchant')
const StrgStock = require('../models/StrgStock')
const router = new Router({
    prefix: '/merchant'
});

router.post('/signup', async ctx => {
    try {
        //validate req.body data before saving
        let {id,username,email, address, businessName, password,contact } = ctx.request.body;
            const merchant = new Merchant({
                id:merchantId,
                username: username,
                email:email,
                address:address,
                businessName: businessName,
                password: password,
                contact:contact
                        });

            await merchant.save();
            ctx.response.status = (201)
            ctx.response.body = { success: true, data: merchant };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.post('/login', async ctx => {
   
    try {
        let {email,password } = ctx.request.body;

        let { id } = ctx.params;
        const data = await Merchant.find({email:email,password:password})
        if (data) {
            ctx.response.status = 200
            ctx.response.body = { success: true, data: data };
        }
        else {
            ctx.response.status = 404
            ctx.response.body = { success: false, message: "invalid credentials" };
        }
        
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let {merchantId,merchantName,merchantType, description, unitOfMeasurement, stocks , unitPrice} = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const merchant = {
               merchantId:merchantId,
               merchantName:merchantName,
               merchantType:merchantType,
                description:description,
                unitOfMeasurement: unitOfMeasurement,
                stocks: stocks,
                unitPrice:unitPrice
            };

            var updatedProduct = await Merchant.findOneAndUpdate(filter, merchant, {
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
        const data = await Merchant.find()
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
        const data = await Merchant.find({_id:id})
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
        var deletedProduct = await Merchant.findById({"_id":id})
        await merchant.deleteOne({_id: id});
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedProduct };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;