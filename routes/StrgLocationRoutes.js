const Router = require('@koa/router');
const StrgLocation = require('../models/StrgLocation')
const router = new Router({
    prefix: '/locations'
});

router.post('/', async ctx => {
    try {
        //validate req.body data before saving
        let { locationId, temperature, humidity} = ctx.request.body;
            const strgLocation = new StrgLocation({
                locationId: locationId,
                temperature: temperature,
                humidity: humidity
            });

            await strgLocation.save();
            ctx.response.status = (201)
            ctx.response.body = { success: true, data: strgLocation };
    } catch (err) {
        console.log(err)
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.put('/:id', async ctx => {
    try {
        //validate req.body data before saving
        let { locationId, temperature, humidity} = ctx.request.body;
        let { id } = ctx.params;
        const filter = { _id: id };

        const strgLocation = {
                locationId: locationId,
                temperature: temperature,
                humidity: humidity
            };

            var updatedlocation = await StrgLocation.findOneAndUpdate(filter, strgLocation, {
                new: true,
             })
            ctx.response.status = (200)
            ctx.response.body = { success: true, data: updatedlocation };
    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    if (id) {
        try {
            let strgLocation = await StrgLocation.findById(id);
            res.status(200).json(strgLocation);
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
        const data = await StrgLocation.find();
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
        var deletedlocation = await StrgLocation.findById({"_id":id})
        await StrgLocation.deleteOne({_id: id});
        ctx.response.status = (200)
        ctx.response.body = { success: true, data: deletedlocation };

    } catch (err) {
        ctx.response.status = 400
        ctx.response.body = { success: false, message: err.message };
    }
});
module.exports = router;