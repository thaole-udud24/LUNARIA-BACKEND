export interface VnDistrict {
  name: string;
  wards: string[];
}

export interface VnProvince {
  name: string;
  districts: VnDistrict[];
}

/** Dữ liệu địa giới VN (tỉnh → quận/huyện → phường/xã) cho form checkout */
export const VN_PROVINCES: VnProvince[] = [
  {
    name: 'Thành phố Hồ Chí Minh',
    districts: [
      { name: 'Quận 1', wards: ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang', 'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'] },
      { name: 'Quận 3', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'] },
      { name: 'Quận 7', wards: ['Phường Bình Thuận', 'Phường Phú Mỹ', 'Phường Phú Thuận', 'Phường Tân Hưng', 'Phường Tân Kiểng', 'Phường Tân Phong', 'Phường Tân Phú', 'Phường Tân Quy', 'Phường Tân Thuận Đông', 'Phường Tân Thuận Tây'] },
      { name: 'Quận Bình Thạnh', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17', 'Phường 19', 'Phường 21', 'Phường 22', 'Phường 24', 'Phường 25', 'Phường 26', 'Phường 27', 'Phường 28', 'Phường 29'] },
      { name: 'Quận Tân Bình', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
      { name: 'Quận Phú Nhuận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17'] },
      { name: 'Thành phố Thủ Đức', wards: ['Phường An Khánh', 'Phường An Lợi Đông', 'Phường An Phú', 'Phường Bình Chiểu', 'Phường Bình Thọ', 'Phường Hiệp Bình Chánh', 'Phường Hiệp Bình Phước', 'Phường Hiệp Phú', 'Phường Linh Chiểu', 'Phường Linh Đông', 'Phường Linh Tây', 'Phường Linh Trung', 'Phường Linh Xuân', 'Phường Long Bình', 'Phường Long Phước', 'Phường Long Thạnh Mỹ', 'Phường Long Trường', 'Phường Phước Bình', 'Phường Phước Long A', 'Phường Phước Long B', 'Phường Tam Bình', 'Phường Tam Phú', 'Phường Tăng Nhơn Phú A', 'Phường Tăng Nhơn Phú B', 'Phường Thảo Điền', 'Phường Thủ Thiêm', 'Phường Trường Thọ'] },
      { name: 'Huyện Bình Chánh', wards: ['Xã An Phú Tây', 'Xã Bình Chánh', 'Xã Bình Hưng', 'Xã Bình Lợi', 'Xã Đa Phước', 'Xã Hưng Long', 'Xã Lê Minh Xuân', 'Xã Phạm Văn Hai', 'Xã Phong Phú', 'Xã Quy Đức', 'Xã Tân Nhut', 'Xã Tân Quý Tây', 'Xã Vĩnh Lộc A', 'Xã Vĩnh Lộc B'] },
    ],
  },
  {
    name: 'Hà Nội',
    districts: [
      { name: 'Quận Ba Đình', wards: ['Phường Cống Vị', 'Phường Điện Biên', 'Phường Đội Cấn', 'Phường Giảng Võ', 'Phường Kim Mã', 'Phường Liễu Giai', 'Phường Ngọc Hà', 'Phường Ngọc Khánh', 'Phường Nguyễn Trung Trực', 'Phường Phúc Xá', 'Phường Quán Thánh', 'Phường Thành Công', 'Phường Trúc Bạch', 'Phường Vĩnh Phú'] },
      { name: 'Quận Cầu Giấy', wards: ['Phường Dịch Vọng', 'Phường Dịch Vọng Hậu', 'Phường Mai Dịch', 'Phường Nghĩa Đô', 'Phường Nghĩa Tân', 'Phường Quan Hoa', 'Phường Trung Hòa', 'Phường Yên Hòa'] },
      { name: 'Quận Đống Đa', wards: ['Phường Cát Linh', 'Phường Hàng Bột', 'Phường Khâm Thiên', 'Phường Khương Thượng', 'Phường Kim Liên', 'Phường Láng Hạ', 'Phường Láng Thượng', 'Phường Nam Đồng', 'Phường Ngã Tư Sở', 'Phường Ô Chợ Dừa', 'Phường Phương Liên', 'Phường Quang Trung', 'Phường Quốc Tử Giám', 'Phường Thịnh Quang', 'Phường Thổ Quan', 'Phường Trung Liệt', 'Phường Trung Phụng', 'Phường Trung Tự', 'Phường Văn Chương', 'Phường Văn Miếu', 'Phường Vọng Hà'] },
      { name: 'Quận Hai Bà Trưng', wards: ['Phường Bạch Đằng', 'Phường Bạch Mai', 'Phường Cầu Dền', 'Phường Đồng Nhân', 'Phường Đồng Tâm', 'Phường Lê Đại Hành', 'Phường Minh Khai', 'Phường Nguyễn Du', 'Phường Phạm Đình Hổ', 'Phường Phố Huế', 'Phường Quỳnh Lôi', 'Phường Quỳnh Mai', 'Phường Thanh Lương', 'Phường Thanh Nhàn', 'Phường Trương Định', 'Phường Vĩnh Tuy'] },
      { name: 'Quận Hoàn Kiếm', wards: ['Phường Chương Dương', 'Phường Cửa Đông', 'Phường Cửa Nam', 'Phường Đồng Xuân', 'Phường Hàng Bạc', 'Phường Hàng Bài', 'Phường Hàng Bồ', 'Phường Hàng Buồm', 'Phường Hàng Đào', 'Phường Hàng Gai', 'Phường Hàng Mã', 'Phường Hàng Trống', 'Phường Lý Thái Tổ', 'Phường Phan Chu Trinh', 'Phường Phúc Tân', 'Phường Tràng Tiền', 'Phường Trần Hưng Đạo'] },
      { name: 'Quận Long Biên', wards: ['Phường Bồ Đề', 'Phường Cự Khối', 'Phường Đức Giang', 'Phường Giang Biên', 'Phường Long Biên', 'Phường Ngọc Lâm', 'Phường Ngọc Thụy', 'Phường Phúc Đồng', 'Phường Phúc Lợi', 'Phường Sài Đồng', 'Phường Thạch Bàn', 'Phường Thượng Thanh', 'Phường Việt Hưng'] },
      { name: 'Quận Nam Từ Liêm', wards: ['Phường Cầu Diễn', 'Phường Đại Mỗ', 'Phường Mễ Trì', 'Phường Mỹ Đình 1', 'Phường Mỹ Đình 2', 'Phường Phú Đô', 'Phường Phương Canh', 'Phường Tây Mỗ', 'Phường Trung Văn', 'Phường Xuân Phương'] },
      { name: 'Quận Tây Hồ', wards: ['Phường Bưởi', 'Phường Nghĩa Dũng', 'Phường Phú Thượng', 'Phường Quảng An', 'Phường Thụy Khuê', 'Phường Tứ Liên', 'Phường Xuân La', 'Phường Yên Phụ'] },
    ],
  },
  {
    name: 'Đà Nẵng',
    districts: [
      { name: 'Quận Hải Châu', wards: ['Phường Bình Hiên', 'Phường Bình Thuận', 'Phường Hải Châu I', 'Phường Hải Châu II', 'Phường Hòa Cường Bắc', 'Phường Hòa Cường Nam', 'Phường Hòa Thuận Đông', 'Phường Hòa Thuận Tây', 'Phường Nam Dương', 'Phường Phước Ninh', 'Phường Thạch Thang', 'Phường Thanh Bình', 'Phường Thuận Phước'] },
      { name: 'Quận Sơn Trà', wards: ['Phường An Hải Bắc', 'Phường An Hải Đông', 'Phường An Hải Tây', 'Phường Mân Thái', 'Phường Nại Hiên Đông', 'Phường Phước Mỹ', 'Phường Thọ Quang'] },
      { name: 'Quận Ngũ Hành Sơn', wards: ['Phường Hòa Hải', 'Phường Hòa Quý', 'Phường Khuê Mỹ', 'Phường Mỹ An'] },
      { name: 'Quận Liên Chiểu', wards: ['Phường Hòa Hiệp Bắc', 'Phường Hòa Hiệp Nam', 'Phường Hòa Khánh Bắc', 'Phường Hòa Khánh Nam', 'Phường Hòa Minh'] },
    ],
  },
  {
    name: 'Cần Thơ',
    districts: [
      { name: 'Quận Ninh Kiều', wards: ['Phường An Bình', 'Phường An Cư', 'Phường An Hòa', 'Phường An Khánh', 'Phường An Lạc', 'Phường An Nghiệp', 'Phường An Phú', 'Phường An Thới', 'Phường Cái Khế', 'Phường Hưng Lợi', 'Phường Tân An', 'Phường Thới Bình', 'Phường Xuân Khánh'] },
      { name: 'Quận Bình Thuỷ', wards: ['Phường An Thới', 'Phường Bình Thỷ', 'Phường Bùi Hữu Nghĩa', 'Phường Long Hòa', 'Phường Long Tuyền', 'Phường Thới An Đông', 'Phường Trà An', 'Phường Trà Nóc'] },
    ],
  },
  {
    name: 'Hải Phòng',
    districts: [
      { name: 'Quận Hồng Bàng', wards: ['Phường Hoàng Văn Thụ', 'Phường Hùng Vương', 'Phường Minh Khai', 'Phường Phan Bội Châu', 'Phường Quang Trung', 'Phường Sở Dầu', 'Phường Thượng Lý', 'Phường Trại Chuối'] },
      { name: 'Quận Ngô Quyền', wards: ['Phường Cầu Đất', 'Phường Cầu Tre', 'Phường Đằng Giang', 'Phường Đông Khê', 'Phường Gia Viên', 'Phường Lạch Tray', 'Phường Lê Lợi', 'Phường Máy Chai', 'Phường Máy Tơ', 'Phường Vạn Mỹ'] },
    ],
  },
  {
    name: 'Bình Dương',
    districts: [
      { name: 'Thành phố Thủ Dầu Một', wards: ['Phường Chánh Nghĩa', 'Phường Hiệp An', 'Phường Hiệp Thành', 'Phường Hòa Phú', 'Phường Phú Cường', 'Phường Phú Hòa', 'Phường Phú Lợi', 'Phường Phú Mỹ', 'Phường Phú Tân', 'Phường Phú Thọ', 'Phường Tân An', 'Phường Tân Thành'] },
      { name: 'Thành phố Dĩ An', wards: ['Phường An Bình', 'Phường Bình An', 'Phường Bình Thắng', 'Phường Dĩ An', 'Phường Đông Hòa', 'Phường Tân Bình', 'Phường Tân Đông Hiệp'] },
    ],
  },
  {
    name: 'Đồng Nai',
    districts: [
      { name: 'Thành phố Biên Hòa', wards: ['Phường An Bình', 'Phường An Hòa', 'Phường Bình Đa', 'Phường Bửu Hòa', 'Phường Bửu Long', 'Phường Hiệp Hòa', 'Phường Hố Nai', 'Phường Hóa An', 'Phường Long Bình', 'Phường Long Bình Tân', 'Phường Long Hưng', 'Phường Quang Vinh', 'Phường Tam Hiệp', 'Phường Tam Hòa', 'Phường Tân Biên', 'Phường Tân Hạnh', 'Phường Tân Hiệp', 'Phường Tân Phong', 'Phường Tân Tiến', 'Phường Trảng Dài', 'Phường Trung Dũng'] },
    ],
  },
  {
    name: 'Khánh Hòa',
    districts: [
      { name: 'Thành phố Nha Trang', wards: ['Phường Lộc Thọ', 'Phường Ngọc Hiệp', 'Phường Phước Hải', 'Phường Phước Hòa', 'Phường Phương Sài', 'Phường Phương Sơn', 'Phường Tân Lập', 'Phường Vạn Thạnh', 'Phường Vạn Thắng', 'Phường Vĩnh Hải', 'Phường Vĩnh Hòa', 'Phường Vĩnh Ngọc', 'Phường Vĩnh Phước', 'Phường Vĩnh Thọ', 'Phường Vĩnh Trung', 'Phường Xương Huân'] },
    ],
  },
  {
    name: 'Lâm Đồng',
    districts: [
      { name: 'Thành phố Đà Lạt', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12'] },
    ],
  },
  {
    name: 'An Giang',
    districts: [
      { name: 'Thành phố Long Xuyên', wards: ['Phường Bình Đức', 'Phường Mỹ Bình', 'Phường Mỹ Hòa', 'Phường Mỹ Khánh', 'Phường Mỹ Long', 'Phường Mỹ Phước', 'Phường Mỹ Quý', 'Phường Mỹ Thạnh', 'Phường Mỹ Thới', 'Phường Mỹ Xuyên', 'Phường Đông Xuyên'] },
    ],
  },
  {
    name: 'Bà Rịa - Vũng Tàu',
    districts: [
      { name: 'Thành phố Vũng Tàu', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường Nguyễn An Ninh', 'Phường Rạch Dừa', 'Phường Thắng Nhì', 'Phường Thắng Tam'] },
    ],
  },
];

export const getProvinceNames = () => VN_PROVINCES.map((p) => p.name);

export const getDistrictsByProvince = (provinceName: string): string[] => {
  const province = VN_PROVINCES.find((p) => p.name === provinceName);
  return province?.districts.map((d) => d.name) || [];
};

export const getWardsByDistrict = (provinceName: string, districtName: string): string[] => {
  const province = VN_PROVINCES.find((p) => p.name === provinceName);
  const district = province?.districts.find((d) => d.name === districtName);
  return district?.wards || [];
};

export const ensureOption = (options: string[], value: string) => {
  if (!value) return options;
  return options.includes(value) ? options : [value, ...options];
};

export const matchProvinceName = (input: string) => {
  if (!input) return '';
  const found = VN_PROVINCES.find(
    (p) => p.name === input || p.name.toLowerCase().includes(input.toLowerCase()) || input.toLowerCase().includes(p.name.toLowerCase()),
  );
  return found?.name || input;
};
