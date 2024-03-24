var express = require("express");
var router = express.Router();
const Transporter = require("../config/common/mail");
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC";
const NhanViens = require("../models/nhanViens");
const CongViecs= require("../models/congViecs");

router.post("./themNhanVien", async (req, res) => {
  try {
    const data = req.body;
    const nhanVienMoi = new NhanViens({
      tenNhanVien: data.tenNhanVien,
      vaiTro: data.vaiTro,
      email: data.email,
      soDienThoai: data.soDienThoai,
      taiKhoan: data.taiKhoan,
      matKhau: data.matKhau,
      trangThai: data.trangThai,
    });
    const result = await nhanVienMoi.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm nhân viên thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Thêm nhân viên thất bại",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/layDanhSachNhanVien", async (req, res) => {
    try {
      const danhSachNhanVien = await NhanViens.find();
      res.json({
        status: 200,
        messenger: "Lấy danh sách nhân viên thành công",
        data: danhSachNhanVien,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: 400,
        messenger: "Lỗi khi lấy danh sách nhân viên",
        data: [],
      });
    }
  });
  
  router.put("/capNhatThongTinNV/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await NhanViens.findByIdAndUpdate(id, data, { new: true });
      if (result) {
        res.json({
          status: 200,
          messenger: "Cập nhật thông tin nhân viên thành công",
          data: result,
        });
      } else {
        res.json({
          status: 404,
          messenger: "Không tìm thấy nhân viên để cập nhật",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        status: 400,
        messenger: "Lỗi khi cập nhật thông tin nhân viên",
        data: [],
      });
    }
  });
  
  router.delete("/xoaNhanVien/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await NhanViens.findByIdAndDelete(id);
      if (result) {
        res.json({
          status: 200,
          messenger: "Xóa nhân viên thành công",
          data: result,
        });
      } else {
        res.json({
          status: 404,
          messenger: "Không tìm thấy nhân viên để xóa",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        status: 400,
        messenger: "Lỗi khi xóa nhân viên",
        data: [],
      });
    }
  });

  router.post("/themCongViec", async (req, res) => {
    try {
      const { tenCongViec, moTa, ngayBatDau, ngayKetThuc, trangThai, tenKhachHang, idNhanVien } = req.body;
      const congViecMoi = new CongViec({
        tenCongViec,
        moTa,
        ngayBatDau,
        ngayKetThuc,
        trangThai,
        tenKhachHang,
        idNhanVien
      });
      const result = await congViecMoi.save();
      res.json({
        status: 200,
        message: "Thêm công việc thành công",
        data: result
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Thêm công việc thất bại",
        data: []
      });
    }
  });
  
  router.put("/capNhatCongViec/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { tenCongViec, moTa, ngayBatDau, ngayKetThuc, trangThai, tenKhachHang, idNhanVien } = req.body;
      const result = await CongViec.findByIdAndUpdate(id, { tenCongViec, moTa, ngayBatDau, ngayKetThuc, trangThai, tenKhachHang, idNhanVien }, { new: true });
      res.json({
        status: 200,
        message: "Cập nhật công việc thành công",
        data: result
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Cập nhật công việc thất bại",
        data: []
      });
    }
  });
  
  router.delete("/xoaCongViec/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CongViec.findByIdAndDelete(id);
      res.json({
        status: 200,
        message: "Xóa công việc thành công",
        data: result
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Xóa công việc thất bại",
        data: []
      });
    }
  });
  
  router.get("/timKiemCongViecTheoThoiGian", async (req, res) => {
    try {
      const { ngayBatDau, ngayKetThuc } = req.query;
      const congViec = await CongViec.find({ ngayBatDau: { $gte: ngayBatDau }, ngayKetThuc: { $lte: ngayKetThuc } });
      res.json({
        status: 200,
        message: "Tìm kiếm công việc thành công",
        data: congViec
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Tìm kiếm công việc thất bại",
        data: []
      });
    }
  });

module.exports = router;
