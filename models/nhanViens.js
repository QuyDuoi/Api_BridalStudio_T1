const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const NhanViens = new Scheme({
    tenNhanVien: {type: String},
    vaiTro: {type: Number},
    email: {type: String},
    soDienThoai: {type: String},
    taiKhoan: {type: String},
    matKhau: {type: String},
    trangThai: {type: Number},
    // hinhAnh: {type: String}
}, {
    timestamps: true
})

module.exports = mongoose.model('NhanVien', NhanViens);