const Router = require('@koa/router');
const PurchaseReq = require('../models/PurchaseReq')
const PurchaseReqItem = require('../models/PurchaseReqItem')
const PurchaseReqItemState = require('../constants/PurchaseReqItemState')

const router = new Router({
    prefix: '/purchase-req-items'
});

router.post('/', async ctx => {

    try {
        //validate data as required
        var purchaseReqItem = new PurchaseReqItem({ ...ctx.request.body, state: PurchaseReqItemState.STATE_CONFIRMED });
        // PurchaseReqItem.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
        purchaseReqItem = await purchaseReqItem.save();
        purchaseReqItem = await purchaseReqItem
            .populate("product", "productName")
            .execPopulate();

        const purchaseReq = await PurchaseReq.findById({ _id: purchaseReqItem.purchaseReq })
        purchaseReq.purchaseReqItems.push(purchaseReqItem);
        await purchaseReq.save();

        //return new PurchaseReqItem object, after saving it to Publisher
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: purchaseReqItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
})

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let { id } = ctx.params
        let { purchaseReq, product,  quantity,  state } = ctx.request.body;
        var a = await PurchaseReqItem.find({ _id: id })

        const purchaseReqItem = {
            quantity: quantity,
            state: state,
            product: product,
            purchaseReq: purchaseReq
        };

        var updatedPurchaseReqItem = await PurchaseReqItem.findOneAndUpdate({ _id: id }, purchaseReqItem, {
            new: true,
        }).catch((err) => {
            ctx.response.status = 400
            ctx.response.body = { success: false, message: err.message };
        })
        updatedPurchaseReqItem = await updatedPurchaseReqItem
            .populate("product", "productName")
            .execPopulate();

        ctx.response.status = (200)
        ctx.response.body = { success: true, data: updatedPurchaseReqItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.delete('/:id', async ctx => {
    try {
        let { id } = ctx.params;
        var deletedPurchaseReqItem = await PurchaseReqItem.findOneAndRemove({ _id: id });
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedPurchaseReqItem };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});


router.get('/:id/reject', async ctx => {
    try {
        //validate req.body data before saving
        let { id } = ctx.params
        var rejectedItem = await PurchaseReqItem.findOneAndUpdate({ _id: id }, {state:PurchaseReqItemState.STATE_DECLINED}, {
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
        var confirmedItem = await PurchaseReqItem.findOne({ _id: id })
        console.log(confirmedItem)
        if (!confirmedItem.deliverableQuantity) {
            ctx.response.status = (400)
            ctx.response.body = { success: false, data: "Set the deliverable amount before confirming" };        
        } else {
            confirmedItem.state = PurchaseReqItemState.STATE_CONFIRMED;
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