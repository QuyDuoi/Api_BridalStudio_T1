const mongoose = require('mongoose')
const Schema = mongoose.Schema
const HoaDonSchema = new Schema({
    nhanvien: {
        type: Schema.Types.ObjectId,
        ref: 'NhanVien',
        require: true
    },
    khachhang: {
        type: Schema.Types.ObjectId,
        ref: 'KhachHang',
        require: true
    },
    ngaymua: {
        type: Date,
        default: Date.now()
    },
    tongtien: {
        type: Number,
        require: true
    },
    trangthai: {
        type: Boolean,
        require: true,
        default: false
    },
    dichvus: [{
        dichvu: {
            type: Schema.Types.ObjectId,
            ref: 'DichVu',
            require: true
        },
        soLuong: {
            type: Number,
            require: true
        }
    }]
})
module.exports = mongoose.model('HoaDon', HoaDonSchema)