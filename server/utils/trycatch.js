const trycatch = (handler) => {
    return async(req,res,next) => {
        try{

            await handler(req,res);

        }
        catch(error){
            res.status(500).json({message: error.message});
            console.log(error);
        }
    };
};

export default trycatch;