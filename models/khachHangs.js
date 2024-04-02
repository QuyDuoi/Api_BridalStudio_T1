const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const KhachHangs = new Scheme({
    maKhachHang: {type: String},
    tenKhachHang: {type: String},
    diaChi: {type: String},
    soDienThoai: {type: String},
    emailKhachHang: {type: String},
    idNhanien: {type: Scheme.Types.ObjectId, ref: 'NhanVien'}
}, {
    timestamps: true
})

module.exports = mongoose.model('KhachHang', KhachHangs);