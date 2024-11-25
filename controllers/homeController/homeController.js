
const homeController = async(req, res)=>{
    try{
        res.status(200).send('Server Running Smoothly');
    }catch(error){
        res.status(400).send(error);
        console.log(error);
    }
}

module.exports = {homeController};