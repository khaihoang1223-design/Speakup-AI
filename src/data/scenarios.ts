import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'make-friends',
    title: 'Làm quen với bạn mới',
    category: 'Giao tiếp bạn bè',
    partnerName: 'Hải Đăng',
    partnerRole: 'Bạn học sinh mới chuyển đến lớp',
    partnerAvatar: '🎒',
    contextDescription: 'Giờ ra chơi, một bạn mới chuyển trường đang ngồi một mình ở bàn cuối, nhìn xung quanh có vẻ bỡ ngỡ.',
    initialPrompt: 'Chào bạn... Mình mới chuyển trường đến hôm qua nên chưa quen ai trong lớp cả. Mình có thể ngồi cùng bạn một lát được không?'
  },
  {
    id: 'group-work',
    title: 'Trình bày ý kiến khi làm việc nhóm',
    category: 'Làm việc nhóm',
    partnerName: 'Minh Thảo',
    partnerRole: 'Nhóm trưởng thảo luận',
    partnerAvatar: '🧪',
    contextDescription: 'Nhóm đang thảo luận chọn ý tưởng cho bài thuyết trình tuần tới và nhóm trưởng đang hỏi ý kiến cả nhóm.',
    initialPrompt: 'Nhóm mình đang cần thêm ý tưởng cho bài thuyết trình tuần sau. Bạn có đề xuất hoặc ý tưởng nào muốn chia sẻ với cả nhóm không?'
  },
  {
    id: 'disagree-politely',
    title: 'Góp ý khi không đồng ý',
    category: 'Thảo luận ý kiến',
    partnerName: 'Quốc Bảo',
    partnerRole: 'Bạn cùng bàn làm báo tường',
    partnerAvatar: '🎨',
    contextDescription: 'Bạn đề xuất tô kín nền bằng màu đỏ đậm và chữ rất nhỏ, em nhận thấy làm vậy sẽ khiến người xem khó đọc.',
    initialPrompt: 'Tớ thấy tờ báo tường này cứ tô kín nền đỏ tươi rồi viết chữ thật dày đặc lên là nổi bật nhất lớp luôn! Cậu thấy ý tưởng của tớ thế nào?'
  },
  {
    id: 'apologize',
    title: 'Xin lỗi khi làm bạn khó chịu',
    category: 'Ứng xử & Hòa giải',
    partnerName: 'Phương Linh',
    partnerRole: 'Bạn cùng lớp',
    partnerAvatar: '📚',
    contextDescription: 'Em mượn cuốn sách bài tập của bạn nhưng vô tình làm gập mép bìa và quên mang trả bạn đúng giờ kiểm tra sáng nay.',
    initialPrompt: 'Sao góc bìa cuốn sách tớ quý lại bị gập cong thế này... Với lại sáng nay có bài kiểm tra mà đến giờ ra chơi cậu mới trả làm tớ lo mãi!'
  },
  {
    id: 'refuse-politely',
    title: 'Từ chối một lời đề nghị lịch sự',
    category: 'Từ chối khéo léo',
    partnerName: 'Đức Anh',
    partnerRole: 'Bạn thân',
    partnerAvatar: '⚽',
    contextDescription: 'Tan học, bạn rủ em đi đá bóng và uống nước ngay, nhưng chiều nay em đã hẹn giúp mẹ dọn nhà và ôn bài.',
    initialPrompt: 'Chiều nay được về sớm, tụi mình đi đá bóng rồi ghé uống nước mía một lát đi! Lâu lắm mới có buổi rảnh rỗi, đi cùng tớ nhé?'
  }
];
