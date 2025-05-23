const orderGiftModel = require('./OrderGiftModel');

exports.orderGiftController = async(req,res)=>{

    try{
        /*
        "id_user": "5084755221",
        "id_winGift": "22"
        */
        const id_user = req.user.id;
        const{id_winGift} = req.body;
        const Numid_user = Number(id_user);
        const Numid_winGift = Number(id_winGift);
        const dataResults = await orderGiftModel.orderGift(Numid_user, Numid_winGift);


        res.status(200).json({
            dataResults
        })

    } catch (error) {
        console.error('Ошибка в orderGiftController:', error);
        res.status(500).json({
            message: 'Ошибка при orderGiftController.',
            error: error.message
        });
    }
};