const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const CongViecs = new Scheme({
    tenCongViec: {type: String},
    moTa: {type: String},
    ngayBatDau: {type: String},
    ngayKetThuc: {type: String},
    trangThai: {type: Number},
    tenKhachHang: {type: String},
    idNhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' }
}, {
    timestamps: true
})

module.exports = mongoose.model('CongViec', CongViecs);