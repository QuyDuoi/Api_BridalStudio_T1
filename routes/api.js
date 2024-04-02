var express = require("express");
var router = express.Router();
const Transporter = require("../config/common/mail");
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC";
const NhanViens = require("../models/nhanViens");
const CongViecs= require("../models/congViecs");
const KhachHangs = require("../models/khachHangs")
const LoaiDichVus = require("../models/loaiDichVus");
const DichVus = require("../models/dichVus")

router.post("/themNhanVien", async (req, res) => {
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
    const danhSachNhanVien = await NhanViens.find().sort({ updatedAt: -1 });
    res.json(danhSachNhanVien);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Lỗi khi lấy danh sách nhân viên",
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

  router.post("/dangNhap", async (req, res) => {
    try {
      const { taiKhoan, matKhau } = req.body;
      const user = await NhanViens.findOne({ taiKhoan, matKhau }).select('-matKhau');
      if (user) {
        const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });

        const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
          expiresIn: "1d",
        });

        res.json({
          status: 200,
          messenger: "Đăng nhập thành công",
          data: user,
          token: token,
          refreshToken: refreshToken,
        });
      } else {
        res.json({
          status: 400,
          messenger: "Tài khoản hoặc mật khẩu không chính xác!",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/themCongViec", async (req, res) => {
    try {
      const { tenCongViec, moTa, ngayBatDau, ngayKetThuc, trangThai, tenKhachHang, idNhanVien } = req.body;
      const congViecMoi = new CongViecs({
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
      const result = await CongViecs.findByIdAndUpdate(id, { tenCongViec, moTa, ngayBatDau, ngayKetThuc, trangThai, tenKhachHang, idNhanVien }, { new: true });
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
      const result = await CongViecs.findByIdAndDelete(id);
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
      const congViec = await CongViecs.find({ ngayBatDau: { $gte: ngayBatDau }, ngayKetThuc: { $lte: ngayKetThuc } });
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

  router.get("/layDanhSachKhachHang", async (req, res) => {
    try {
        const danhSachKhachHang = await KhachHangs.find();
        res.json({
            status: 200,
            messenger: "Lấy danh sách khách hàng thành công",
            data: danhSachKhachHang,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            messenger: "Lỗi khi lấy danh sách khách hàng",
            data: [],
        });
    }
  });

  router.get("/layDsKhTheoIDNhanVien/:idNhanVien", async (req, res) => {
    try {
        const { idNhanVien } = req.params;

        const danhSachKhachHang = await KhachHangs.find({ idNhanVien: idNhanVien });

        res.json({
            status: 200,
            messenger: "Lấy danh sách khách hàng theo ID nhân viên thành công",
            data: danhSachKhachHang,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            messenger: "Lỗi khi lấy danh sách khách hàng",
            data: [],
        });
    }
});


router.post("/taoKhachHang", async (req, res) => {
    try {
        const newKhachHang = new KhachHangs(req.body);
        const savedKhachHang = await newKhachHang.save();
        res.json({
            status: 200,
            messenger: "Tạo khách hàng mới thành công",
            data: savedKhachHang,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            messenger: "Lỗi khi tạo khách hàng mới",
            data: null,
        });
    }
});

router.put("/capNhatKhachHang/:id", async (req, res) => {
    try {
        const updatedKhachHang = await KhachHangs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({
            status: 200,
            messenger: "Cập nhật thông tin khách hàng thành công",
            data: updatedKhachHang,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            messenger: "Lỗi khi cập nhật thông tin khách hàng",
            data: null,
        });
    }
});

router.delete("/xoaKhachHang/:id", async (req, res) => {
    try {
        await KhachHangs.findByIdAndDelete(req.params.id);
        res.json({
            status: 200,
            messenger: "Xóa khách hàng thành công",
            data: null,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            messenger: "Lỗi khi xóa khách hàng",
            data: null,
        });
    }
});

router.get("/layDanhSachLoaiDichVu", async (req, res) => {
  try {
      const danhSachLoaiDichVu = await LoaiDichVus.find();
      res.json({
          status: 200,
          messenger: "Lấy danh sách loại dịch vụ thành công",
          data: danhSachLoaiDichVu,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi lấy danh sách loại dịch vụ",
          data: [],
      });
  }
});

router.post("/taoLoaiDichVu", async (req, res) => {
  try {
      const newLoaiDichVu = new loaiDichVus(req.body);
      const savedLoaiDichVu = await newLoaiDichVu.save();
      res.json({
          status: 200,
          messenger: "Tạo loại dịch vụ mới thành công",
          data: savedLoaiDichVu,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi tạo loại dịch vụ mới",
          data: null,
      });
  }
});

router.put("/capNhatLoaiDichVu/:id", async (req, res) => {
  try {
      const updatedLoaiDichVu = await LoaiDichVus.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({
          status: 200,
          messenger: "Cập nhật thông tin loại dịch vụ thành công",
          data: updatedLoaiDichVu,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi cập nhật thông tin loại dịch vụ",
          data: null,
      });
  }
});

router.get("/layDanhSachDichVu", async (req, res) => {
  try {
      const danhSachDichVu = await DichVus.find().populate('idLoaiDichVu');
      res.json({
          status: 200,
          messenger: "Lấy danh sách dịch vụ thành công",
          data: danhSachDichVu,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi lấy danh sách dịch vụ",
          data: [],
      });
  }
});

router.post("/taoDichVu", async (req, res) => {
  try {
      const { tenDichVu, moTaDichVu, giaDichVu, trangThaiDichVu, idLoaiDichVu } = req.body;

      if (!idLoaiDichVu) {
          return res.status(400).json({
              status: 400,
              messenger: "Vui lòng cung cấp idLoaiDichVu",
              data: null
          });
      }

      const newDichVu = new DichVus({
          tenDichVu,
          moTaDichVu,
          giaDichVu,
          trangThaiDichVu,
          idLoaiDichVu
      });

      const savedDichVu = await newDichVu.save();

      res.json({
          status: 200,
          messenger: "Tạo dịch vụ mới thành công",
          data: savedDichVu,
      });
  } catch (error) {
      console.log(error);
      res.status(400).json({
          status: 400,
          messenger: "Lỗi khi tạo dịch vụ mới",
          data: null,
      });
  }
});

router.put("/capNhatDichVu/:id", async (req, res) => {
  try {
      const updatedDichVu = await DichVus.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({
          status: 200,
          messenger: "Cập nhật thông tin dịch vụ thành công",
          data: updatedDichVu,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi cập nhật thông tin dịch vụ",
          data: null,
      });
  }
});

router.delete("/xoaDichVu/:id", async (req, res) => {
  try {
      await DichVus.findByIdAndDelete(req.params.id);
      res.json({
          status: 200,
          messenger: "Xóa dịch vụ thành công",
          data: null,
      });
  } catch (error) {
      console.log(error);
      res.json({
          status: 400,
          messenger: "Lỗi khi xóa dịch vụ",
          data: null,
      });
  }
});


module.exports = router;
