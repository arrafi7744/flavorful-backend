const port = process.env.PORT || 8000;
const routerManager = require("./routerManager");
const connectToDb = require("./db/db");
const {app} = require("./app");



//DB Connection//
connectToDb()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server Running on Port ${port}`);
    });
    routerManager();
})

.catch((error)=>{
        console.log(error);
});