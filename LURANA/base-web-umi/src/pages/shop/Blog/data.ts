export interface BlogPost {
  id: number;
  img: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  tag: string;
  featured: boolean;
  color: string;
  content?: string;
}

export const CATEGORIES = ['Tất cả', 'Chăm sóc da', 'Trang điểm', 'Chăm sóc tóc', 'Lifestyle', 'Tips & Tricks'];

export const POSTS: BlogPost[] = [
  {
    id: 1, img: 'blog-1.png',
    title: '5 Bước Skincare Buổi Sáng Hoàn Hảo Cho Da Khô',
    excerpt: 'Khởi đầu ngày mới với làn da căng mọng, rạng rỡ bằng quy trình chăm sóc da đúng chuẩn.',
    category: 'Chăm sóc da', author: 'Minh Châu', date: '12/05/2026', readTime: '5 phút', views: 1240, tag: 'HOT', featured: true, color: '#ffb8d4',
    content: '<p>Da khô là một trong những loại da cần được chăm sóc đặc biệt để duy trì độ ẩm và sự mềm mại. Hãy cùng tìm hiểu 5 bước cơ bản nhưng cực kỳ quan trọng cho quy trình skincare buổi sáng dành riêng cho làn da này nhé!</p><br/><h3>Bước 1: Làm sạch nhẹ nhàng</h3><p>Đừng dùng các loại sữa rửa mặt có chất tẩy rửa mạnh. Hãy chọn sữa rửa mặt dạng gel hoặc sữa không tạo bọt nhiều để tránh lấy đi lớp màng ẩm tự nhiên của da.</p><br/><h3>Bước 2: Sử dụng Toner cấp ẩm</h3><p>Toner không chỉ giúp cân bằng độ pH mà còn tạo điều kiện tốt nhất để da hấp thụ dưỡng chất ở các bước sau. Lựa chọn toner có chứa Hyaluronic Acid hoặc Glycerin.</p><br/><h3>Bước 3: Serum dưỡng ẩm sâu</h3><p>Một lớp serum với HA hoặc Vitamin B5 sẽ là vị cứu tinh cho làn da khô, giúp cấp nước sâu vào các tầng biểu bì.</p><br/><h3>Bước 4: Kem dưỡng khóa ẩm</h3><p>Sau khi cấp nước, việc khóa lại những dưỡng chất đó là vô cùng cần thiết. Một loại kem dưỡng có kết cấu đặc sẽ giúp bề mặt da luôn căng mịn suốt ngày dài.</p><br/><h3>Bước 5: Kem chống nắng</h3><p>Dù da khô hay da dầu, kem chống nắng luôn là bước không thể thiếu để bảo vệ làn da khỏi tia UV gây lão hóa sớm.</p>',
  },
  {
    id: 2, img: 'blog-2.png',
    title: 'Son Môi 2026: Xu Hướng Màu Sắc Không Thể Bỏ Lỡ',
    excerpt: 'Từ đỏ ruby cổ điển đến cam san hô tươi mát, mùa hè 2026 mang đến vô số sắc son đẹp mê hồn.',
    category: 'Trang điểm', author: 'Phương Linh', date: '10/05/2026', readTime: '4 phút', views: 980, tag: 'NEW', featured: false, color: '#ffd6e7',
    content: '<p>Năm 2026 đánh dấu sự trở lại của các tone màu son tươi sáng và tràn đầy năng lượng...</p>'
  },
  {
    id: 3, img: 'blog-3.png',
    title: 'Cách Dưỡng Tóc Suôn Mượt Tại Nhà Chỉ Với 3 Nguyên Liệu',
    excerpt: 'Bạn không cần ra tiệm tốn kém, hãy thử các công thức dưỡng tóc thiên nhiên đơn giản ngay tại nhà.',
    category: 'Chăm sóc tóc', author: 'Thanh Hương', date: '08/05/2026', readTime: '6 phút', views: 765, tag: '', featured: false, color: '#ffe4b5',
    content: '<p>Bạn thường xuyên đau đầu vì mái tóc xơ rối? Hãy thử ngay công thức sau...</p>'
  },
  {
    id: 4, img: 'blog-4.png',
    title: 'Retinol Và Những Điều Bạn Cần Biết Trước Khi Dùng',
    excerpt: 'Retinol là thành phần vàng trong skincare nhưng cũng cần dùng đúng cách để tránh kích ứng.',
    category: 'Chăm sóc da', author: 'Minh Châu', date: '06/05/2026', readTime: '7 phút', views: 2100, tag: 'HOT', featured: false, color: '#e8d5ff',
    content: '<p>Nhiều người e ngại khi nhắc đến Retinol vì sợ kích ứng. Bài viết này sẽ hướng dẫn bạn cách dùng an toàn...</p>'
  },
  {
    id: 5, img: 'blog-5.png',
    title: 'Bí Quyết Makeup Tự Nhiên Cho Buổi Đi Làm',
    excerpt: 'Lớp trang điểm nhẹ nhàng, tươi mát giúp bạn tự tin suốt cả ngày mà không cần tốn nhiều thời gian.',
    category: 'Trang điểm', author: 'Phương Linh', date: '04/05/2026', readTime: '5 phút', views: 560, tag: '', featured: false, color: '#c8f4e8',
    content: '<p>Buổi sáng bận rộn nhưng vẫn muốn xuất hiện rạng rỡ tại văn phòng? Dưới đây là tuyệt chiêu...</p>'
  },
  {
    id: 6, img: 'blog-6.png',
    title: 'Thói Quen Buổi Tối Giúp Da Hồi Phục Nhanh Hơn',
    excerpt: 'Ban đêm là "giờ vàng" của làn da. Thiết lập một thói quen skincare tối đúng cách sẽ giúp da mềm mại hơn.',
    category: 'Lifestyle', author: 'Thanh Hương', date: '02/05/2026', readTime: '5 phút', views: 870, tag: '', featured: false, color: '#ffecd2',
    content: '<p>Sự thật là da phục hồi mạnh mẽ nhất trong khi chúng ta ngủ. Việc áp dụng đúng các bước...</p>'
  },
];

export const POPULAR = [...POSTS].sort((a, b) => b.views - a.views).slice(0, 4);
export const TAGS = ['Skincare', 'Serum', 'Retinol', 'Son môi', 'Da khô', 'Da dầu', 'SPF', 'Vitamin C', 'Collagen', 'Tóc đẹp'];
