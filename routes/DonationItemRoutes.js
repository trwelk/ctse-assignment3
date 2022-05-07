const Router = require('@koa/router');
const DonationItem = require('../models/Supplier')
const router = new Router({
    prefix: '/suppliers'
});

router.post('/', async ctx => {
    try {
        //validate req.body data before saving
        let { donationItemId, contactNumber, email, address, contactNumber2 } = ctx.request.body;
        const donationItem = new DonationItem({
            donationItemId: donationItemId,
            contactNumber: contactNumber,
            email: email,
            address: address,
            contactNumber2: contactNumber2
        });

        await DonationItem.save();
        ctx.response.status = (201)
        ctx.response.body = { success: true, data: donationItem };
    } catch (err) {
        console.log(err)
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let { donationItemId, contactNumber, email, address, contactNumber2 } = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const donationItem = {
            donationItemId: donationItemId,
            contactNumber: contactNumber,
            email: email,
            address: address,
            contactNumber2: contactNumber2
        };

        var updatedSupplier = await DonationItem.findOneAndUpdate(filter, donationItem, {
            new: true,
        })
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: updatedSupplier };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    if (id) {
        try {
            let donationItem = await DonationItem.findById(id);
            res.status(200).json( donationItem );
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
        const data = await DonationItem.find();
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
        var deletedSupplier = await DonationItem.findById({ "_id": id })
        await DonationItem.deleteOne({ _id: id });
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedSupplier };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;