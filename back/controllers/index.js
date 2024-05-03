const index = async (ctx, next) => {
    ctx.response.body = {
        message: "Hello world !"
    }
} 
module.exports = index;
  