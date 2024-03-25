const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const DichVus = new Scheme({
    tenDichVu: {type: String},
    moTaDichVu: {type: String},
    giaDichVu: {type: Number},
    trangThaiDichVu: {type: Number},
    idLoaiDichVu: { type: Scheme.Types.ObjectId, ref: 'LoaiDichVu' }
}, {
    timestamps: true
})

module.exports = mongoose.model('DichVu', DichVus);