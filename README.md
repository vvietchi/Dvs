# English Daily – Ứng dụng học tiếng Anh

Ứng dụng web tĩnh (HTML/CSS/JavaScript thuần, không cần build, không cần server) giúp học tiếng Anh mỗi ngày, giao diện tiếng Việt.

## Tính năng

| Mục | Mô tả |
|---|---|
| **Tổng quan** | Số từ cần ôn hôm nay, số từ đã thuộc, chuỗi ngày học 🔥, điểm XP, tiến độ từng chủ đề |
| **Thẻ từ** | Flashcard có phiên âm IPA, nghĩa, câu ví dụ, phát âm; tự đánh giá *Quên / Khó / Nhớ / Dễ*, hệ thống lên lịch ôn theo phương pháp **lặp lại ngắt quãng** (SM-2 rút gọn) |
| **Trắc nghiệm** | 10 câu Anh ↔ Việt, chọn theo chủ đề |
| **Nghe – chép** | Nghe từ/câu (có chế độ chậm) và gõ lại, chấm theo độ khớp |
| **Luyện nói** | Đọc câu mẫu, nhận dạng giọng nói và chấm % độ khớp (Chrome/Edge) |
| **Ngữ pháp** | 5 chủ điểm thông dụng trong công việc kèm bài tập |

Chủ đề từ vựng: Giao tiếp hằng ngày · Công việc văn phòng · **Chuyển đổi số & CNTT** · Họp & thuyết trình · Du lịch (52 từ).

Phím tắt: `Space` lật thẻ, `1–4` chấm điểm thẻ / chọn đáp án, `Enter` sang câu tiếp.

## Chạy

- Cách nhanh nhất: mở trực tiếp `index.html` bằng trình duyệt.
- Hoặc chạy server cục bộ (khuyến nghị cho tính năng micro): `npm start` rồi mở http://localhost:8080
- Có thể đăng lên GitHub Pages / Cloudflare Pages vì toàn bộ là file tĩnh.

Tiến độ học được lưu trong `localStorage` của trình duyệt.

## Cấu trúc

```
index.html        Khung trang và thanh điều hướng
css/style.css     Giao diện (hỗ trợ dark mode, mobile)
js/data.js        Nội dung: từ vựng theo chủ đề, ngữ pháp, câu luyện nói
js/srs.js         Thuật toán lặp lại ngắt quãng + so khớp chuỗi
js/app.js         Các màn hình và router
tests/            Unit test cho srs.js (`npm test`)
```

## Thêm nội dung

Thêm từ vào `js/data.js` theo dạng `["english", "/ipa/", "nghĩa tiếng Việt", "Câu ví dụ."]`, hoặc thêm một chủ đề mới vào mảng `TOPICS`. Bài ngữ pháp thêm vào `GRAMMAR` với `quiz: [[câu hỏi, [đáp án...], chỉ số đáp án đúng]]`.
