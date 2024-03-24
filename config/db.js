const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const local = 'mongodb://127.0.0.1:27017/BridalStudioDb';
const atlas =
  'mongodb+srv://taiKhoan:matKhau@atlascluster.wgpzrhs.mongodb.net/link"';
const connect = async() => {
    try {
        await mongoose.connect(local,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log('connect success')
    } catch (error){
        console.log(error)
        console.log('connect fail')
    }
}
module.exports = {connect}