const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const NhanViens = new Scheme({
    tenNhanVien: {type: String, require: true},
    vaiTro: {type: Number, require: true},
    email: {type: String, require: true},
    soDienThoai: {type: String, require: true},
    taiKhoan: {type: String, require: true},
    matKhau: {type: String, require: true},
    trangThai: {type: Number, require: true},
    // hinhAnh: {type: String}
}, {
    timestamps: true
})

module.exports = mongoose.model('NhanVien', NhanViens);