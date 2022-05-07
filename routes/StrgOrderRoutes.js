const Router = require('@koa/router');
const StrgOrder = require('../models/StrgOrder')
const OrderState = require('../constants/OrderState')

const router = new Router({
    prefix: '/orders'
});

router.post('/', async ctx => {
    try {
        //validate req.body data before saving
        let {orderId, customer, supplier, requiredDate, shippedDate, orderLocation, state } = ctx.request.body;
        var strgOrder = new StrgOrder({
            orderId: orderId,
            customer: customer,
            supplier: supplier,
            requiredDate: requiredDate,
            shippedDate: shippedDate,
            orderLocation: orderLocation,
            state: OrderState.STATE_REQUESTED
        });
        strgOrder = await strgOrder.save();


        ctx.response.status = (201)
        ctx.response.body = { success: true, data: strgOrder };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let {orderId, customer, supplier, requiredDate, shippedDate, orderLocation, state } = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const strgOrder = {
            orderId : orderId,
            customer: customer,
            supplier: supplier,
            requiredDate: requiredDate,
            shippedDate: shippedDate,
            orderLocation: orderLocation,
            state: state
        };

        var updatedOrder = await StrgOrder.findOneAndUpdate(filter, strgOrder, {
            new: true,
        })
        updatedOrder = await updatedOrder
            .populate("orderItems", "order product quantity deliverableQuantity state ")
            .populate('product','productName')
            .execPopulate();
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: updatedOrder };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    if (id) {
        try {
            let strgOrder = await StrgOrder.findById(id);
            res.status(200).json(strgOrder);
        }
        catch (error) {
            ctx.response.status(400).json({ message: "Could not fetch user" });
        }
    } else {
        ctx.response.status(422).json({
            message: "invalid inputs"
        });
    }
});

router.get('/', async ctx => {
    try {
        const data = await StrgOrder.find()
            .populate({ path: 'orderItems' , populate: {path:'product',select:'productName'}});
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
        var deletedOrder = await StrgOrder.findById({ "_id": id })
        await StrgOrder.deleteOne({ _id: id });
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedOrder };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;