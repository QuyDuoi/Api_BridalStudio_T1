const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const KhachHangs = new Scheme({
    tenKhachHang: {type: String},
    diaChi: {type: String},
    soDienThoai: {type: String},
    emailKhachHang: {type: String},
}, {
    timestamps: true
})

module.exports = mongoose.model('KhachHang', KhachHangs);