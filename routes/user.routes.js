const UserApi = require('../api/user.api.js');
const jsonwebtoken = require('jsonwebtoken');
const Router = require('@koa/router');

const router = new Router({
    prefix: '/user'
   });
   //Used for a user to login. The users details along with a json web token is also sent back for authentication
   router.post('/login',async ctx => {
    let user = ctx.request.body;
    user = await UserApi.userLogin(user.email, user.password);
    let token = {}
    if(user){
             token = jsonwebtoken.sign({
                id: user.id,
                email: user.email,
                type: user.type,
                phone: user.phoneNumber,
                address: user.address,
                type:user.type
            }, "jwtSecret")
            ctx.body = {user:user,token:token};
            ctx.response.status = 201;
        }
        else{
            ctx.response.body = "AUTHERROR";
        }
   });
   //Used for a user to sign up
   router.post('/', async ctx => {
    let user = ctx.request.body;
    user = await UserApi.userSignUp(user);
    ctx.response.status = 201;
    ctx.body = user;
   });

module.exports = router;