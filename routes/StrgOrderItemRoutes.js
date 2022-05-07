const Router = require('@koa/router');
const StrgOrder = require('../models/StrgOrder')
const StrgOrderItem = require('../models/StrgOrderItem')
const orderItemStates = require('../constants/OrderItemState')

const router = new Router({
    prefix: '/orderItems'
});

router.post('/', async ctx => {

    try {
        //validate data as required
        var strgOrderItem = new StrgOrderItem({ ...ctx.request.body, state: orderItemStates.STATE_REQUESTED });
        // strgOrderItem.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
        strgOrderItem = await strgOrderItem.save();
        strgOrderItem = await strgOrderItem
            .populate("product", "productName")
            .execPopulate();

        const strgOrder = await StrgOrder.findById({ _id: strgOrderItem.order })
        strgOrder.orderItems.push(strgOrderItem);
        await strgOrder.save();

        //return new strgOrderItem object, after saving it to Publisher
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: strgOrderItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
})

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let { id } = ctx.params
        let { order, product, stock, quantity, deliverableQuantity, state } = ctx.request.body;
        var a = await StrgOrderItem.find({ _id: id })

        const strgOrderItem = {
            quantity: quantity,
            deliverableQuantity: deliverableQuantity,
            state: state,
            stock: stock,
            product: product,
            order: order
        };

        var updatedOrderItem = await StrgOrderItem.findOneAndUpdate({ _id: id }, strgOrderItem, {
            new: true,
        }).catch((err) => {
            ctx.response.status = 400
            ctx.response.body = { success: false, message: err.message };
        })
        updatedOrderItem = await updatedOrderItem
            .populate("product", "productName")
            .execPopulate();

        ctx.response.status = (200)
        ctx.response.body = { success: true, data: updatedOrderItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.delete('/:id', async ctx => {
    try {
        let { id } = ctx.params;
        var deletedOrderItem = await StrgOrderItem.findOneAndRemove({ _id: id });
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedOrderItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});


router.get('/:id/reject', async ctx => {
    try {
        //validate req.body data before saving
        let { id } = ctx.params
        var rejectedItem = await StrgOrderItem.findOneAndUpdate({ _id: id }, {state:orderItemStates.STATE_DECLINED}, {
            new: true,
        }).catch((err) => {
            ctx.response.status = 400
            ctx.response.body = { success: false, message: err.message };
        })
        rejectedItem = await rejectedItem
            .populate("product", "productName")
            .execPopulate();

        ctx.response.status = (200)
        ctx.response.body = { success: true, data: rejectedItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/:id/confirm', async ctx => {
    try {
        //validate req.body data before saving
        let { id } = ctx.params
        var confirmedItem = await StrgOrderItem.findOne({ _id: id })
        console.log(confirmedItem)
        if (!confirmedItem.deliverableQuantity) {
            ctx.response.status = (400)
            ctx.response.body = { success: false, data: "Set the deliverable amount before confirming" };        
        } else {
            confirmedItem.state = orderItemStates.STATE_CONFIRMED;
            await confirmedItem.save();
            confirmedItem = await confirmedItem
            .populate("product", "productName")
            .execPopulate();

            ctx.response.status = (200)
            ctx.response.body = { success: true, data: confirmedItem };
        }


    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

module.exports = router;