const Router = require('@koa/router');
const PurchaseReq = require('../models/PurchaseReq')
const PurchaseReqState = require('../constants/PurchaseReqState')

const router = new Router({
    prefix: '/purchase-reqs'
});

router.post('/', async ctx => {
    try {
        //validate req.body data before saving
        let {purchaseReqId, supplier, requiredDate,  deliveryLocation, state } = ctx.request.body;
        var purchaseReq = new PurchaseReq({
            purchaseReqId: purchaseReqId,
            supplier: supplier,
            requiredDate: requiredDate,
            deliveryLocation: deliveryLocation,
            state: PurchaseReqState.STATE_REQUESTED
        });
        purchaseReq = await purchaseReq.save();


        ctx.response.status = (201)
        ctx.response.body = { success: true, data: purchaseReq };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let {purchaseReqId, supplier, requiredDate,  deliveryLocation, state } = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const purchaseReq = {
            purchaseReqId : purchaseReqId,
            supplier: supplier,
            requiredDate: requiredDate,
            deliveryLocation: deliveryLocation,
            state: state
        };

        var updatedPurchaseReq = await PurchaseReq.findOneAndUpdate(filter, purchaseReq, {
            new: true,
        })
        updatedPurchaseReq = await updatedPurchaseReq
            .populate("purchaseReqItems")
            .populate('product','productName')
            .execPopulate();
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: updatedPurchaseReq };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    if (id) {
        try {
            let purchaseReq = await PurchaseReq.findById(id);
            res.status(200).json(purchaseReq);
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
        const data = await PurchaseReq.find()
            .populate({ path: 'purchaseReqItems' , populate: {path:'product',select:'productName'}});
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
        var deletedPurchaseReq = await PurchaseReq.findById({ "_id": id })
        await PurchaseReq.deleteOne({ _id: id });
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedPurchaseReq };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;