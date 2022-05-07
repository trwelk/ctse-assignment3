const Router = require('@koa/router');
const Merchant = require('../models/Merchant')
const Product = require('../models/Product')
const Coupon = require('../models/Coupon')

const router = new Router({
    prefix: '/merchant'
});

router.post('/signup', async ctx => {
    try {
        //validate req.body data before saving comment
        let {username,email, address, businessName, password,contact } = ctx.request.body;
            const merchant = new Merchant({
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


router.post('/product/addProduct', async ctx => {
    try {
        let {merchantId,name, price, quantity } = ctx.request.body;

        const merchant = await Merchant.findById({ _id: merchantId })
        //validate req.body data before saving
            const product = new Product({
                merchantId: merchantId,
                name:name,
                price:price,
                quantity: quantity
                        });

            await product.save();
            await merchant.products.push(product);
            await merchant.save()
            ctx.response.status = (201)
            ctx.response.body = { success: true, data: product };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/product/getAllProducts/:merchantId', async ctx => {
    let { merchantId } = ctx.params;
    if (merchantId) {
        try {
            const data = await Product.find({merchantId:merchantId});
            ctx.response.status = 200
            ctx.response.body = { success: true, data: data };
        } catch (err) {
            ctx.response.status = 400
            ctx.response.body = { success: false, message: err.message };
        }
    } else {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: "merchantId not found" };
    }
});


router.post('/product/addProducoupon/addCoupon/:merchantId/:productId', async ctx => {
    let { merchantId,productId } = ctx.params;

    try {
        console.log(productId)
        const product = await Product.findById({ _id: productId })
        //validate req.body data before saving
        let {id,influencerTier,influencerDiscountPercentage, quantity } = ctx.request.body;
            const coupon = new Coupon({
                influencerTier: influencerTier,
                influencerDiscountPercentage:influencerDiscountPercentage,
                productId:productId,
                quantity: quantity
                        });

            await coupon.save();
            await product.coupons.push(coupon);
            await product.save()

            ctx.response.status = (201)
            ctx.response.body = { success: true, data: coupon };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/coupon/getCouponsForMerchant/:merchantId', async ctx => {
    //populate coupons properly
    try {
        let { merchantId } = ctx.params;
        var merchant = await Merchant.findById({"_id":merchantId})
                        .populate({ path: 'products'})
                        .populate({path: 'coupons'})
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: merchant.products };

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