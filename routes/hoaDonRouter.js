const express = require('express')
const router = express.Router()
const HoaDon = require('../models/hoaDons')
const DichVu = require('../models/dichVus')


// @route POST /add
// @desc Creater hoadon
// @access Private
// dichvus = [{dichvu,soluong}]

router.post('/add', async (req, res) => {
    const { nhanvien, khachhang, dichvus, trangthai } = req.body
    let tongtien = 0



    if (!nhanvien || !khachhang || !dichvus)
        return res.status(400).json({ success: false, message: 'Không lỗi nhập dữ liệu', data: [] })
    dichvus.forEach(item => {
        const giaTien = item.dichvu.giaDichVu
        const soLuong = item.soLuong
        tongtien += giaTien * soLuong

    });

    const newDV = dichvus.map(item => ({
        soLuong: item.soLuong,
        dichvus: item.dichvu._id
    }))

    if (!newDV) return res.status(400).json({ success: false, message: 'Lỗi thêm hóa đơn', data: [] })

    try {
        const newHoaDon = new HoaDon({
            khachhang, nhanvien, trangthai, tongtien: tongtien, dichvus
        })
        const check = await newHoaDon.save()
        if (!check) return res.status(400).json({ success: false, message: 'Lỗi Thêm', data: [] })
        const data = await HoaDon.find()

        res.status(200).json({ success: true, message: 'Thêm hóa đơn thành công', data: data })
    } catch (error) {
        console.log('Lỗi catch thêm Hóa đơn: ', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })
    }
})


// @route GET /
// @desc Get hoadons
// @access Private


router.get('/', async (req, res) => {

    try {
        const hoadons = await HoaDon.find().populate('nhanvien', ['tenNhanVien']).populate('khachhang', ['tenKhachHang'])
        // .populate('khachhang',['hoTen'])
        if (!hoadons) return res.status(400).json({ success: false, message: 'Lỗi lấy hóa đơn', data: [] })
        res.status(200).json({ success: true, message: 'lấy danh sách hóa đơn thành công', data: hoadons })
    } catch (error) {
        console.log('Lỗi catch lấy DS Hóa đơn: ', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })
    }
})


// @route GET /:id
// @desc Get hoadons
// @access Private

router.get('/:id', async (req, res) => {
    try {
        const hoadon = await HoaDon.findOne({ _id: req.params.id })
        if (!hoadon) return res.status(400).json({ success: false, message: 'Lỗi lấy dữ liệu', data: [] })
        const dichvus = hoadon.dichvus
        let listDichVus = []
        for (const dichvu of dichvus) {
            const getDichVu = await DichVu.findOne(dichvu.dichvu)
            if (!getDichVu) return res.status(400).json({ success: true, message: 'Lỗi lấy dữ liệu', data: [] })
            let sotien = dichvu.soLuong * getDichVu.giaDichVu
            const DVS = {
                _id: getDichVu._id,
                tenDV: getDichVu.tenDichVu,
                gia: getDichVu.giaDichVu,
                soLuong: dichvu.soLuong,
                sotien: sotien
            }
            listDichVus.push(DVS)

        }



        res.status(200).json({ data: listDichVus, success: true, message: 'lấy danh sách chi tiết hóa đơn thành công' })


    } catch (error) {
        console.log(error);
        res.json([]).status(500)
    }
})


// @route PUT /:id
// @desc UPDATE hoadons
// @access Private
router.put('/:id', async (req, res) => {
    const { nhanvien, khachhang, trangthai, dichvus } = req.body
    if (!nhanvien || !khachhang || !trangthai || !dichvus)
        return res.status(400).json({ success: false, message: 'Không để trống', data: [] })
    let tongtien = 0
    dichvus.forEach(item => {
        const giaTien = item.dichvu.giaTien
        const soLuong = item.soLuong
        tongtien += giaTien * soLuong

    });

    const newDV = dichvus.map(item => ({
        soLuong: item.soLuong,
        dichvus: item.dichvu._id
    }))

    if (!newDV) return res.status(400).json({ success: false, message: 'Lỗi thêm hóa đơn', data: [] })

    try {
        const hoadon = { nhanvien, khachhang, tongtien, trangthai, dichvus }
        const updateHoaDon = await HoaDon.findByIdAndUpdate({ _id: req.params.id }, hoadon, { new: true })
        if (!updateHoaDon) return res.status(400).json({ success: false, message: 'Lỗi sửa hóa đơn', data: [] })
        const data = await HoaDon.find()
        console.log(updateHoaDon);
        res.status(200).json({ success: true, message: 'Sửa thành công', data })
    } catch (error) {
        console.log(error);
        res.json([]).status(500)
    }
})
// @route PUT /updatett/:id
// @desc UPDATE trang thai hoa don
// @access Private
router.put('/updatett/:id', async (req, res) => {
    const { trangthai } = req.body
    try {
        const update = await HoaDon.findByIdAndUpdate({ _id: req.params.id }, { trangthai: trangthai }, { new: true })
        if (!update) return res.status(400).json({ success: false, message: 'Lỗi sửa hóa đơn', data: [] })
        const data = await HoaDon.find().populate('nhanvien', ['tenNhanVien']).populate('khachhang', ['tenKhachHang'])
        res.status(200).json({ success: true, message: 'Sửa thành công', data })
    } catch (error) {
        console.log(error);
        res.json([]).status(500)
    }
})


module.exports = router