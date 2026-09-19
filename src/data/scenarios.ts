import { Scenario } from '../types';

export const SCENARIO_CATEGORIES = [
  { id: 'all', label: 'Tất cả tình huống' },
  { id: 'friends', label: '🎒 Kết bạn & Giao lưu' },
  { id: 'team', label: '👥 Làm việc nhóm' },
  { id: 'discussion', label: '🎨 Góp ý & Tranh luận' },
  { id: 'apology', label: '🤝 Hòa giải & Xin lỗi' },
  { id: 'refusal', label: '🛡️ Từ chối khéo léo' },
  { id: 'teacher', label: '👩‍🏫 Thầy cô giáo' }
] as const;

export const SCENARIOS: Scenario[] = [
  // 1. KẾT BẠN & GIAO LƯU
  {
    id: 'make-friends',
    title: 'Làm quen với bạn mới chuyển trường',
    category: 'Giao lưu bạn bè',
    categoryTag: 'friends',
    partnerName: 'Hải Đăng',
    partnerRole: 'Bạn học sinh mới chuyển đến lớp',
    partnerAvatar: '🎒',
    contextDescription: 'Giờ ra chơi, một bạn mới chuyển trường đang ngồi một mình ở bàn cuối, nhìn xung quanh có vẻ bỡ ngỡ và ngập ngừng.',
    initialPrompt: 'Chào bạn... Mình mới chuyển trường đến hôm qua nên chưa quen ai trong lớp cả. Mình có thể ngồi cùng bạn một lát được không?'
  },
  {
    id: 'canteen-chat',
    title: 'Chủ động bắt chuyện ở giờ giải lao',
    category: 'Giao lưu bạn bè',
    categoryTag: 'friends',
    partnerName: 'Tuấn Kiệt',
    partnerRole: 'Bạn học cùng khối lớp',
    partnerAvatar: '📖',
    contextDescription: 'Ở góc ghế đá sân trường, em thấy một bạn cùng khối đang đọc say mê cuốn truyện tranh/sách khoa học mà em cũng rất yêu thích.',
    initialPrompt: 'A, bạn cũng đọc bộ sách này à? Đoạn cuối tập 3 bất ngờ ghê luôn ấy, bạn đọc đến đoạn đó chưa?'
  },

  // 2. LÀM VIỆC NHÓM
  {
    id: 'group-work',
    title: 'Đề xuất ý tưởng thuyết trình nhóm',
    category: 'Làm việc nhóm',
    categoryTag: 'team',
    partnerName: 'Minh Thảo',
    partnerRole: 'Nhóm trưởng thảo luận',
    partnerAvatar: '🧪',
    contextDescription: 'Nhóm đang thảo luận chọn đề tài cho bài thuyết trình môn Khoa học tuần tới và nhóm trưởng đang thăm dò ý kiến của các thành viên.',
    initialPrompt: 'Nhóm mình đang cần thêm ý tưởng sáng tạo cho bài thuyết trình tuần sau. Bạn có đề xuất hoặc sáng kiến nào muốn chia sẻ với cả nhóm không?'
  },
  {
    id: 'share-workload',
    title: 'Đề nghị san sẻ công việc khi bạn quá tải',
    category: 'Làm việc nhóm',
    categoryTag: 'team',
    partnerName: 'Khánh Linh',
    partnerRole: 'Bạn phụ trách thiết kế slide',
    partnerAvatar: '💻',
    contextDescription: 'Bạn được phân công làm toàn bộ slide và đang thở dài mệt mỏi vì vừa phải soạn nội dung vừa phải tìm hình ảnh gấp trong đêm.',
    initialPrompt: 'Hôm nay tớ phải ôn kiểm tra Toán nữa mà slide nhóm mình dài quá, tớ làm mãi vẫn chưa xong một nửa, lo quá cậu ơi...'
  },
  {
    id: 'remind-deadline',
    title: 'Nhắc nhở bạn nộp bài nhóm đúng hạn',
    category: 'Làm việc nhóm',
    categoryTag: 'team',
    partnerName: 'Hoàng Long',
    partnerRole: 'Thành viên phụ trách phần 2',
    partnerAvatar: '⏳',
    contextDescription: 'Chỉ còn một ngày nữa là tới hạn nộp bài báo cáo của nhóm nhưng Long vẫn chưa gửi phần nội dung của bạn ấy cho nhóm trưởng.',
    initialPrompt: 'Ôi tớ bận quá nên chưa kịp gõ xong phần của tớ. Mai mới nộp bài mà, tối nay tớ thức làm vội cũng được chứ gì?'
  },

  // 3. GÓP Ý & TRANH LUẬN
  {
    id: 'disagree-politely',
    title: 'Góp ý khi không đồng ý cách làm',
    category: 'Góp ý & Tranh luận',
    categoryTag: 'discussion',
    partnerName: 'Quốc Bảo',
    partnerRole: 'Bạn cùng bàn làm báo tường 20/11',
    partnerAvatar: '🎨',
    contextDescription: 'Bạn đề xuất tô kín toàn bộ nền báo tường bằng màu đỏ thẫm rồi viết chữ đen thật dày, em thấy làm vậy sẽ khiến người xem rất chói mắt.',
    initialPrompt: 'Tớ thấy tờ báo tường này cứ tô kín nền đỏ tươi rồi viết chữ thật dày đặc lên là nổi bật nhất khối luôn! Cậu thấy ý tưởng của tớ thế nào?'
  },
  {
    id: 'defend-opinion',
    title: 'Bảo vệ ý kiến một cách hòa nhã',
    category: 'Góp ý & Tranh luận',
    categoryTag: 'discussion',
    partnerName: 'Ngọc Mai',
    partnerRole: 'Thành viên ban cán sự lớp',
    partnerAvatar: '💡',
    contextDescription: 'Em đề xuất tổ chức một góc chia sẻ sách cũ ở góc lớp, nhưng bạn Mai gạt đi vì cho rằng sẽ bừa bộn và không ai tham gia.',
    initialPrompt: 'Ý tưởng để sách cũ ở lớp của cậu không khả thi đâu, vừa bừa bộn lớp học mà các bạn giờ ra chơi chỉ thích chạy nhảy thôi, ai đọc làm gì!'
  },

  // 4. HÒA GIẢI & XIN LỖI
  {
    id: 'apologize',
    title: 'Xin lỗi khi vô tình làm hỏng đồ của bạn',
    category: 'Hòa giải & Xin lỗi',
    categoryTag: 'apology',
    partnerName: 'Phương Linh',
    partnerRole: 'Bạn cùng bàn',
    partnerAvatar: '📚',
    contextDescription: 'Em mượn cuốn sách bài tập bìa đẹp của bạn nhưng vô tình làm gập mép bìa và quên mang trả bạn đúng giờ kiểm tra sáng nay.',
    initialPrompt: 'Sao góc bìa cuốn sách tớ quý lại bị gập cong queo thế này... Với lại sáng nay có bài kiểm tra mà đến giờ ra chơi cậu mới trả làm tớ lo mãi!'
  },
  {
    id: 'resolve-rumor',
    title: 'Hóa giải hiểu lầm và tin đồn thất thiệt',
    category: 'Hòa giải & Xin lỗi',
    categoryTag: 'apology',
    partnerName: 'Thanh Trúc',
    partnerRole: 'Bạn cùng lớp',
    partnerAvatar: '💬',
    contextDescription: 'Có bạn khác nói với Trúc rằng em chê bai bài vẽ của Trúc trong giờ Mỹ thuật, khiến Trúc giận và nhìn em bằng ánh mắt xa lánh.',
    initialPrompt: 'Có người bảo với tớ là hôm qua cậu đi nói với cả lớp là bài vẽ của tớ xấu tệ hại đúng không? Sao cậu lại làm thế với tớ?'
  },
  {
    id: 'calm-dispute',
    title: 'Can ngăn hai người bạn đang to tiếng',
    category: 'Hòa giải & Xin lỗi',
    categoryTag: 'apology',
    partnerName: 'Gia Huy',
    partnerRole: 'Bạn chơi thể thao cùng đội',
    partnerAvatar: '🏀',
    contextDescription: 'Trong trận bóng rổ, Huy và một bạn khác va chạm và chuẩn bị lao vào xô xát, to tiếng gay gắt ngay giữa sân bóng.',
    initialPrompt: 'Nó cố tình gạt chân tớ trước rõ ràng! Hôm nay tớ không bỏ qua đâu, để tớ xử lý nó ra ngô ra khoai!'
  },

  // 5. TỪ CHỐI KHÉO LÉO
  {
    id: 'refuse-politely',
    title: 'Từ chối lời rủ đi chơi để ôn bài và giúp mẹ',
    category: 'Từ chối khéo léo',
    categoryTag: 'refusal',
    partnerName: 'Đức Anh',
    partnerRole: 'Bạn thân',
    partnerAvatar: '⚽',
    contextDescription: 'Tan học, bạn rủ em đi đá bóng và ghé quán nước mía ngay, nhưng chiều nay em đã hứa phụ mẹ dọn nhà và có bài kiểm tra ngày mai.',
    initialPrompt: 'Chiều nay được về sớm, tụi mình đi đá bóng rồi ghé uống nước mía một lát đi! Lâu lắm mới có buổi rảnh rỗi, cậu đi cùng tớ nhé?'
  },
  {
    id: 'refuse-cheating',
    title: 'Từ chối cho bạn chép bài trong giờ kiểm tra',
    category: 'Từ chối khéo léo',
    categoryTag: 'refusal',
    partnerName: 'Tiến Đạt',
    partnerRole: 'Bạn ngồi cạnh trong phòng thi',
    partnerAvatar: '📝',
    contextDescription: 'Trong giờ kiểm tra 1 tiết môn Sử, bạn ngồi bàn kế bên loay hoay không làm được và liên tục huých tay thì thầm xin chép đáp án.',
    initialPrompt: 'Suỵt... Cậu làm xong câu 2 chưa? Đưa tớ chép câu đó với câu 3 với, tớ quên sạch rồi, không chép là tớ bị điểm liệt mất!'
  },

  // 6. GIAO TIẾP VỚI THẦY CÔ
  {
    id: 'ask-teacher',
    title: 'Nhờ thầy cô giảng lại bài tập chưa hiểu',
    category: 'Giao tiếp thầy cô',
    categoryTag: 'teacher',
    partnerName: 'Cô Mai Lan',
    partnerRole: 'Giáo viên dạy Toán',
    partnerAvatar: '👩‍🏫',
    contextDescription: 'Sau tiết học Đại số, em vẫn chưa hiểu rõ bước biến đổi hằng đẳng thức ở ví dụ 3 trên bảng và muốn gặp cô hỏi lại trong giờ ra chơi.',
    initialPrompt: 'Em chào cô ạ! Em có chuyện gì cần cô giúp đỡ hay trao đổi về tiết học vừa rồi không em?'
  },
  {
    id: 'explain-forgotten-hw',
    title: 'Trình bày lý do để quên vở bài tập ở nhà',
    category: 'Giao tiếp thầy cô',
    categoryTag: 'teacher',
    partnerName: 'Thầy Hùng',
    partnerRole: 'Giáo viên môn Ngữ Văn',
    partnerAvatar: '👨‍🏫',
    contextDescription: 'Đầu giờ học, thầy gọi kiểm tra vở bài tập. Em đã làm bài đầy đủ tối qua nhưng sáng vội quá nên để quên trên bàn học ở nhà.',
    initialPrompt: 'Thầy kiểm tra đến bàn em rồi. Vở bài tập của em đã làm xong chưa, mang lên cho thầy xem nào?'
  }
];
