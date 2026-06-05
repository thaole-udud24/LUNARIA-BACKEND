export interface BlogPost {
  id: number;
  img: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatar: string;
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
    id: 1,
    img: 'https://images.pexels.com/photos/3762885/pexels-photo-3762885.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: '5 Bước Skincare Buổi Sáng Hoàn Hảo Cho Da Khô',
    excerpt: 'Khởi đầu ngày mới với làn da căng mọng, rạng rỡ bằng quy trình chăm sóc khoa học cấp tế bào.',
    category: 'Chăm sóc da', author: 'Minh Châu', authorAvatar: 'MC', date: '26/05/2026', readTime: '5 phút', views: 2450, tag: 'HOT', featured: true, color: '#ffb8d4',
    content: `
      <p class="content-intro">Một làn da khô thiếu ẩm thường dễ bị bong tróc, xỉn màu và xuất hiện các dấu hiệu lão hóa sớm nếu không được chăm sóc đúng cách vào buổi sáng. Quy trình phục hồi biểu bì 5 bước chuyên sâu dưới đây từ Lunaria sẽ giúp bạn khóa chặt độ ẩm bền vững suốt ngày dài.</p>
      <h2 class="content-heading">Bước 1: Làm sạch dịu nhẹ giải phóng bã nhờn</h2>
      <p class="content-text">Hãy sử dụng các dòng sữa rửa mặt dạng Gel hữu cơ nhẹ nhàng để loại bỏ bã nhờn, độc tố tích tụ sau một đêm dài mà không làm tổn hại đến lớp màng lipid ẩm tự nhiên trên bề mặt biểu bì.</p>
      <h2 class="content-heading">Bước 2: Cân bằng pH với Toner cấp nước tầng sâu</h2>
      <p class="content-text">Sử dụng toner ngay sau khi rửa mặt là nguyên tắc vàng để tối ưu hóa khả năng ngậm nước của tế bào, phục hồi độ pH lý tưởng và mở đường cho các dưỡng chất tiếp theo thẩm thấu sâu.</p>
      <div class="content-tip">💡 <strong>Lời khuyên chuyên gia:</strong> Tuyệt đối không sử dụng các dòng sản phẩm toner chứa cồn khô (Alcohol Denat) vì chúng gây hiện tượng bốc hơi nước ngược khiến da khô ráp hơn.</div>
      <h2 class="content-heading">Bước 3: Tinh chất phục hồi chuyên sâu Vitamin B5 + HA</h2>
      <p class="content-text">Serum chứa phức hợp Hyaluronic Acid đa tầng phối hợp cùng Vitamin B5 đóng vai trò nuôi dưỡng, làm dịu kích ứng và sửa chữa các đứt gãy trong hàng rào sinh học, đem lại hiệu ứng căng bóng tức thì.</p>
      <h2 class="content-heading">Bước 4: Khóa ẩm bề mặt bằng kem dưỡng kết cấu mỏng nhẹ</h2>
      <p class="content-text">Một lớp kem dưỡng ẩm mỏng mịn sẽ đóng vai trò như một hàng rào bảo vệ vững chắc, khóa chặt toàn bộ tinh chất quý giá từ serum nằm lại nuôi dưỡng các tầng cấu trúc da.</p>
      <h2 class="content-heading">Bước 5: Bảo vệ toàn diện cùng kem chống nắng quang phổ rộng</h2>
      <p class="content-text">Tia UV là tác nhân hàng đầu gây đứt gãy sợi collagen và xỉn màu. Kết thúc quy trình bằng kem chống nắng màng lọc lai lành tính để bảo vệ làn da một cách hoàn hảo nhất.</p>
    `
  },
  {
    id: 2,
    img: 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Son Môi 2026: Xu Hướng Màu Sắc Không Thể Bỏ Lỡ',
    excerpt: 'Từ đỏ ruby cổ điển mang nét quyến rũ đến cam san hô tươi mát, mùa hè này đánh dấu sự lên ngôi của tone pastel quý phái.',
    category: 'Trang điểm', author: 'Phương Linh', authorAvatar: 'PL', date: '22/05/2026', readTime: '4 phút', views: 3980, tag: 'NEW', featured: false, color: '#ffd6e7',
    content: `
      <p class="content-intro">Mùa hè năm 2026 chứng kiến sự thay đổi ngoạn mục trong xu hướng trang điểm môi toàn cầu. Những kết cấu son lì thô ráp cũ đang dần nhường chỗ cho dòng son dưỡng thuần chay mịn mượt như nhung.</p>
      <h2 class="content-heading">Sự bùng nổ của Cam San Hô và Hồng Nude Pastel</h2>
      <p class="content-text">Được chiết xuất hoàn toàn từ dầu quả bơ hữu cơ kết hợp cùng tinh chất dâu tây rừng, bộ sưu tập sắc son năm nay mang đến diện mạo trong trẻo, căng mọng tự nhiên nhưng vẫn toát lên thần thái vô cùng thời thượng, quý phái.</p>
      <blockquote>Xu hướng năm nay ưu tiên việc tôn vinh sắc tố môi tự nhiên, mang lại hiệu ứng mọng mướt mà không gây nặng môi hay khô nứt suốt cả ngày dài.</blockquote>
    `
  },
  {
    id: 3,
    img: 'https://images.pexels.com/photos/3738339/pexels-photo-3738339.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Cách Dưỡng Tóc Suôn Mượt Tại Nhà Chỉ Với 3 Nguyên Liệu',
    excerpt: 'Không cần những liệu trình đắt đỏ tại tiệm, công thức nuôi dưỡng phục hồi biểu bì tóc từ tinh dầu hữu cơ thiên nhiên.',
    category: 'Chăm sóc tóc', author: 'Thanh Hương', authorAvatar: 'TH', date: '18/05/2026', readTime: '6 phút', views: 1765, tag: '', featured: false, color: '#ffe4b5',
    content: `
      <p class="content-intro">Mái tóc xơ rối và chẻ ngọn do lạm dụng hóa chất tạo kiểu quá nhiều luôn là nỗi lo lắng lớn. Chỉ với 3 nguyên liệu hữu cơ thuần túy ngay tại căn bếp, bạn hoàn toàn có thể tự thực hiện một liệu trình spa tóc cao cấp.</p>
      <h2 class="content-heading">Ủ tóc chuyên sâu từ kết hợp Dầu Dừa và Mật Ong</h2>
      <p class="content-text">Sự hòa quyện giữa các axit béo trong dầu dừa tinh khiết kết hợp vitamin E tự nhiên từ mật ong rừng tạo nên lớp màng khóa ẩm tuyệt vời, nuôi dưỡng các liên kết keratin bị đứt gãy, đem lại mái tóc suôn mượt, bồng bềnh óng ả từ gốc đến ngọn.</p>
      <div class="content-tip">💡 <strong>Cách làm:</strong> Trộn đều 2 thìa dầu dừa, 1 thìa mật ong và 5 giọt tinh dầu bưởi. Thoa đều lên thân tóc ẩm, ủ trong 20 phút rồi xả sạch lại bằng nước ấm để có hiệu quả mướt mịn rõ rệt.</div>
    `
  },
  {
    id: 4,
    img: 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Retinol Và Những Điều Bạn Cần Biết Trước Khi Dùng',
    excerpt: 'Thành phần vàng trong chống lão hóa, tuy nhiên cần được xây dựng tần suất phù hợp để bảo vệ biểu bì.',
    category: 'Chăm sóc da', author: 'Minh Châu', authorAvatar: 'MC', date: '14/05/2026', readTime: '7 phút', views: 4120, tag: 'HOT', featured: false, color: '#e8d5ff',
    content: `
      <p class="content-intro">Được mệnh danh là hoạt chất vàng trong việc kích thích tăng sinh collagen và tái cấu trúc tầng biểu bì, Retinol luôn là cái tên dẫn đầu trong xu hướng skincare chống lão hóa khoa học hiện nay.</p>
      <h2 class="content-heading">Nguyên tắc xây dựng nồng độ an toàn cho người mới bắt đầu</h2>
      <p class="content-text">Người mới bắt đầu bước vào con đường treatment chỉ nên áp dụng nồng độ thấp từ 0.2% đến 0.5% với tần suất tối giản 2 lần/tuần. Hãy kết hợp chặt chẽ với phương pháp "kẹp bánh mì" (kem dưỡng - retinol - kem dưỡng) cùng các hoạt chất chứa Ceramide để làn da thích nghi một cách êm dịu nhất.</p>
    `
  },
  {
    id: 5,
    img: 'https://images.pexels.com/photos/4625623/pexels-photo-4625623.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Bí Quyết Makeup Tự Nhiên Clean-Girl Cho Ngày Đi Làm',
    excerpt: 'Lớp nền mỏng nhẹ như làn da thứ hai giúp bạn giữ được diện mạo tươi tắn, rạng rỡ suốt ngày dài.',
    category: 'Trang điểm', author: 'Phương Linh', authorAvatar: 'PL', date: '12/05/2026', readTime: '5 phút', views: 1560, tag: '', featured: false, color: '#c8f4e8',
    content: `
      <p class="content-intro">Phong cách trang điểm "Clean-Girl" tôn vinh những đường nét tự nhiên, khỏe khoắn sẵn có của khuôn mặt, tạo hiệu ứng mỏng nhẹ như sương, cực kỳ phù hợp cho môi trường công sở bận rộn.</p>
      <h2 class="content-heading">Tối giản hóa lớp kem nền dày cộm gây bí bách lỗ chân lông</h2>
      <p class="content-text">Hãy thay thế những loại kem nền độ che phủ cao bằng một lớp Cushion mỏng nhẹ bọc nước hoặc kem dưỡng có màu tích hợp chống nắng, giúp nền da vừa giữ được sự thông thoáng suốt 8 tiếng vừa giữ được diện mạo tươi tắn rạng ngời.</p>
    `
  },
  {
    id: 6,
    img: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Thói Quen Buổi Tối Giúp Làn Da Tái Tạo Nhanh Gấp Đôi',
    excerpt: 'Tận dụng khoảng thời gian vàng khi ngủ để kích hoạt cơ chế tự phục hồi, mang lại làn da căng bóng.',
    category: 'Lifestyle', author: 'Thanh Hương', authorAvatar: 'TH', date: '08/05/2026', readTime: '5 phút', views: 2870, tag: 'TIPS', featured: false, color: '#ffecd2',
    content: `
      <p class="content-intro">Khoảng thời gian từ 23h đêm đến 2h sáng là thời điểm "vàng" các tế bào da bước vào chu trình trao đổi chất, phân chia tế bào và tự sửa chữa tổn thương sinh học mạnh mẽ nhất trong ngày.</p>
      <h2 class="content-heading">Kích hoạt chu trình dưỡng ẩm phục hồi ban đêm nâng cao</h2>
      <p class="content-text">Việc thoa các sản phẩm chứa hoạt chất chống oxy hóa mạnh như Vitamin E, Resveratrol hoặc một lớp mặt nạ ngủ cấp nước dồi dào trước khi đi ngủ sẽ cung cấp nguyên liệu dồi dào để biểu bì sửa chữa màng tế bào, giúp bạn thức dậy với làn da rạng rỡ, căng bóng vào sáng hôm sau.</p>
    `
  },
  {
    id: 7,
    img: 'https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Nuôi Dưỡng Mái Tóc Chắc Khỏe Từ Sâu Trong Nang Tóc',
    excerpt: 'Sự kết hợp hoàn hảo giữa chế độ dinh dưỡng giàu vitamin và massage da đầu bằng tinh chất thảo mộc.',
    category: 'Chăm sóc tóc', author: 'Khánh An', authorAvatar: 'KA', date: '04/05/2026', readTime: '8 phút', views: 920, tag: '', featured: false, color: '#d2f1ff',
    content: `
      <p class="content-intro">Sợi tóc chỉ thực sự khỏe và giảm gãy rụng khi nang tóc nằm sâu dưới da đầu được cung cấp đầy đủ chất dinh dưỡng tuần hoàn. Hãy thiết lập thói quen nuôi dưỡng da đầu giống như cách bạn nâng niu làn da mặt.</p>
      <h2 class="content-heading">Kích thích tuần hoàn máu bằng tinh chất chiết xuất hương nhu, vỏ bưởi</h2>
      <p class="content-text">Việc kích thích các mạch máu lưu thông bằng các động tác massage da đầu nhẹ nhàng theo hình vòng tròn, kết hợp sử dụng tinh dầu bưởi hữu cơ cô đặc sẽ làm giảm tỷ lệ tóc rụng tới 80% chỉ sau một tháng kiên trì áp dụng bôi thoa đều đặn.</p>
    `
  },
  {
    id: 8,
    img: 'https://images.pexels.com/photos/3615455/pexels-photo-3615455.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Tối Giản Quy Trình Skincare: Xu Hướng Skinimalism',
    excerpt: 'Lắng nghe làn da và cắt bỏ những bước không cần thiết. Đôi khi sự đơn giản mới là chìa khóa tối ưu.',
    category: 'Tips & Tricks', author: 'Minh Châu', authorAvatar: 'MC', date: '02/05/2026', readTime: '6 phút', views: 3120, tag: 'HOT', featured: false, color: '#fff5f5',
    content: `
      <p class="content-intro">Skinimalism là từ khóa thời thượng kết hợp giữa Skincare và Minimalism, hướng các tín đồ làm đẹp tập trung vào hiệu quả cốt lõi thay vì nhồi nhét quá nhiều bước bôi thoa dày đặc lên mặt.</p>
      <h2 class="content-heading">Quay về bộ ba cốt lõi hoàn hảo: Làm sạch - Dưỡng ẩm - Chống nắng</h2>
      <p class="content-text">Bôi quá nhiều lớp tinh chất đặc trị chồng chéo đôi khi làm lớp màng sinh học quá tải, gây bít tắc sinh mụn ẩn. Hãy tối giản routine để làn da có khoảng nghỉ tự phục hồi, củng cố lại màng lipid tự nhiên vững chắc.</p>
    `
  },
  {
    id: 9,
    img: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Tác Dụng Thần Kỳ Của Vitamin C Trong Việc Làm Sáng Da',
    excerpt: 'Làm mờ các vết thâm mụn sạm màu và tăng cường khả năng chống chịu của tế bào trước tia UV.',
    category: 'Chăm sóc da', author: 'Khánh An', authorAvatar: 'KA', date: '29/04/2026', readTime: '5 phút', views: 1890, tag: 'NEW', featured: false, color: '#ffe9d2',
    content: `
      <p class="content-intro">Vitamin C là một trong những chất chống oxy hóa mạnh mẽ nhất được khoa học da liễu chứng minh về khả năng ức chế hắc sắc tố Melanin, làm mờ thâm sạm và kích thích tăng sinh collagen.</p>
      <h2 class="content-heading">Tạo màng chắn kép khi phối hợp cùng kem chống nắng vào buổi sáng</h2>
      <p class="content-text">Sử dụng tinh chất Vitamin C tinh khiết (L-Ascorbic Acid) vào buổi sáng trước lớp kem chống nắng sẽ tạo nên một cặp bài trùng lý tưởng, nhân đôi khả năng trung hòa các gốc tự do gây ra do bức xạ của tia cực tím.</p>
    `
  },
  {
    id: 10,
    img: 'https://images.pexels.com/photos/3684617/pexels-photo-3684617.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Cách Lựa Chọn Kem Chống Nắng Phù Hợp Với Từng Loại Da',
    excerpt: 'Phân biệt kem chống nắng vật lý, hóa học và màng lọc lai để tối ưu hiệu quả bảo vệ toàn diện.',
    category: 'Tips & Tricks', author: 'Minh Châu', authorAvatar: 'MC', date: '25/04/2026', readTime: '7 phút', views: 3420, tag: '', featured: false, color: '#e3f2fd',
    content: `
      <p class="content-intro">Chọn sai kem chống nắng là nguyên nhân hàng đầu khiến nền da bị đổ dầu không kiểm soát, bít tắc sinh mụn viêm hoặc bị cay mắt khó chịu.</p>
      <h2 class="content-heading">Lựa chọn kết cấu màng lọc chuẩn chuyên khoa cho từng tuýp da</h2>
      <p class="content-text">Làn da dầu mụn nên ưu tiên kết cấu mỏng nhẹ dạng sữa hoặc fluid chứa thành phần Zinc Oxide cao kèm nhãn "Oil-Free". Trong khi đó, làn da nhạy cảm sau treatment nên hướng tới dòng màng lọc hữu cơ thế hệ mới bảo vệ dịu nhẹ.</p>
    `
  },
  {
    id: 11,
    img: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Xu Hướng Chăm Sóc Da Thuần Chay Lên Ngôi Năm 2026',
    excerpt: 'Lựa chọn các sản phẩm không thử nghiệm trên động vật và chiết xuất hoàn toàn từ thực vật lành tính.',
    category: 'Lifestyle', author: 'Phương Linh', authorAvatar: 'PL', date: '20/04/2026', readTime: '6 phút', views: 1280, tag: '', featured: false, color: '#e8f5e9',
    content: `
      <p class="content-intro">Mỹ phẩm thuần chay (Vegan Cosmetics) không chỉ là một khái niệm làm đẹp đơn thuần mà đang dịch chuyển mạnh mẽ thành một phong cách sống xanh có trách nhiệm bền vững với hệ sinh thái thế giới.</p>
      <h2 class="content-heading">Lành tính tuyệt đối từ nguồn chiết xuất thực vật hữu cơ lên men</h2>
      <p class="content-text">Bằng việc loại bỏ hoàn toàn các dẫn xuất từ động vật và thay thế bằng tinh chất chiết xuất rau má, trà xanh hữu cơ, dòng mỹ phẩm thuần chay của Lunaria hạn chế tối đa nguy cơ kích ứng cấu trúc sừng, giúp bảo vệ biểu bì vững chắc an toàn.</p>
    `
  },
  {
    id: 12,
    img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Xây Dựng Chế Độ Ăn Uống Để Có Làn Da Khỏe Đẹp',
    excerpt: 'Cung cấp độ ẩm và dưỡng chất chống oxy hóa từ sâu bên trong thông qua các loại siêu thực phẩm.',
    category: 'Lifestyle', author: 'Thanh Hương', authorAvatar: 'TH', date: '15/04/2026', readTime: '5 phút', views: 2150, tag: 'HOT', featured: false, color: '#fff3e0',
    content: `
      <p class="content-intro">Mỹ phẩm bôi thoa bên ngoài chỉ quyết định một phần diện mạo, phần lớn cốt lõi của một làn da bóng khỏe, căng tràn sức sống xuất phát từ chính chế độ dinh dưỡng nội sinh của bạn.</p>
      <h2 class="content-heading">Bổ sung nhóm siêu thực phẩm giàu chất béo lành mạnh và vitamin hữu ích</h2>
      <p class="content-text">Hãy tăng cường nhóm thực phẩm giàu axit béo Omega-3 từ các loại hạt hữu cơ (hạt chia, hạt lanh) và các chất chống gốc tự do từ quả mọng (việt quất, dâu tây) nhằm xây dựng tấm khiên bảo vệ cấu trúc collagen bền vững.</p>
    `
  }
];

export const POPULAR = [...POSTS].sort((a, b) => b.views - a.views).slice(0, 4);
export const TAGS = ['Skincare', 'Serum', 'Retinol', 'Son môi', 'Da khô', 'Da dầu', 'Mỹ phẩm hữu cơ', 'Vitamin C', 'Tóc khỏe'];