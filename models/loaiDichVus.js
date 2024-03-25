const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const LoaiDichVus = new Scheme({
    tenLoaiDichVu: {type: String},
}, {
    timestamps: true
})

module.exports = mongoose.model('LoaiDichVu', LoaiDichVus);