/* TOEIC Listening practice content.
 * Part 1 (Photographs): a scene + 4 spoken statements, one describes it correctly.
 * Part 2 (Question–Response): a spoken question + 3 spoken responses, one is appropriate.
 * The scene is drawn with emoji since the app ships no photo assets. */
(function (root) {
  const PART1 = [
    {
      scene: "👩‍💻", props: "🖥️ ☕",
      options: ["She's drinking from a bottle.", "She's typing on a keyboard.", "She's fixing a printer.", "She's hanging a picture on the wall."],
      answer: 1, vi: "Cô ấy đang gõ bàn phím.",
      note: "Tập trung vào hành động chính trong tranh. Các đáp án còn lại có động từ không khớp với tranh.",
    },
    {
      scene: "🧑‍🍳", props: "🍳 🔥",
      options: ["He's washing the dishes.", "He's setting the table.", "He's cooking some food in a pan.", "He's reading a menu."],
      answer: 2, vi: "Anh ấy đang nấu thức ăn trong chảo.",
      note: "“Washing the dishes”, “setting the table” cùng chủ đề bếp nhưng sai hành động.",
    },
    {
      scene: "🚲", props: "🌳",
      options: ["Someone is riding a bicycle.", "A bicycle is leaning against a tree.", "Trees are being cut down.", "A bicycle is being repaired."],
      answer: 1, vi: "Một chiếc xe đạp đang dựa vào gốc cây.",
      note: "Bẫy kinh điển: tranh không có người nhưng đáp án nói “someone is riding”. Câu bị động tiếp diễn (is being…) cũng cần có người đang làm.",
    },
    {
      scene: "📚", props: "🗄️ 📚 📚",
      options: ["A woman is reading a book.", "The shelves are being painted.", "Some books have been placed on shelves.", "Boxes are stacked on the floor."],
      answer: 2, vi: "Một số cuốn sách đã được đặt lên kệ.",
      note: "Tranh chỉ có đồ vật → thường dùng bị động hoàn thành (have been placed) để tả trạng thái.",
    },
    {
      scene: "🤝", props: "🧑‍💼 👩‍💼",
      options: ["They're shaking hands.", "They're waving goodbye.", "They're exchanging business cards.", "They're sitting at a desk."],
      answer: 0, vi: "Họ đang bắt tay.",
      note: "“Exchanging business cards” là bối cảnh gặp gỡ tương tự nhưng sai hành động.",
    },
    {
      scene: "🛫", props: "☁️",
      options: ["Passengers are boarding a bus.", "A plane is parked in a hangar.", "Luggage is being unloaded.", "A plane is taking off."],
      answer: 3, vi: "Một chiếc máy bay đang cất cánh.",
      note: "“Parked” (đang đỗ) trái với tranh máy bay đang bay lên.",
    },
    {
      scene: "🚗", props: "🚙 🚕 🅿️",
      options: ["A car is being washed.", "Cars are parked in a row.", "Traffic is moving on a highway.", "A man is opening a car door."],
      answer: 1, vi: "Những chiếc xe ô tô đang đỗ thành hàng.",
      note: "Tranh bãi đỗ xe không có người → loại các đáp án có người hoặc hành động đang diễn ra.",
    },
    {
      scene: "🧑‍🏫", props: "📊 👥",
      options: ["A man is drawing a map.", "People are leaving the room.", "A man is giving a presentation.", "A screen is being installed."],
      answer: 2, vi: "Một người đàn ông đang thuyết trình.",
      note: "“Drawing a map” gần với việc chỉ vào biểu đồ nhưng sai nội dung.",
    },
    {
      scene: "🛒", props: "🍎 🍌 🥖",
      options: ["A cashier is counting money.", "A shopping cart is filled with groceries.", "Fruit is growing on trees.", "Bread is being baked."],
      answer: 1, vi: "Một chiếc xe đẩy chứa đầy hàng tạp hóa.",
      note: "Các đáp án sai nhắc đến trái cây, bánh mì có trong tranh nhưng mô tả sai tình huống.",
    },
    {
      scene: "🧑‍🔧", props: "🔧 🚗",
      options: ["A man is driving a truck.", "Tools are being sold in a store.", "A car is being towed.", "A mechanic is working on a car."],
      answer: 3, vi: "Một thợ máy đang sửa xe ô tô.",
      note: "“Work on” = làm việc với / sửa chữa – cụm từ rất hay gặp trong Part 1.",
    },
    {
      scene: "🚶", props: "☂️ 🌧️",
      options: ["A person is holding an umbrella.", "A person is drying clothes.", "People are sunbathing on the beach.", "An umbrella is lying on the ground."],
      answer: 0, vi: "Một người đang cầm ô.",
      note: "“Lying on the ground” có nhắc tới ô nhưng sai vị trí.",
    },
    {
      scene: "🧑‍🎨", props: "🪜 🧱",
      options: ["A man is climbing a mountain.", "A man is standing on a ladder.", "Ladders are stored in a garage.", "A wall is being torn down."],
      answer: 1, vi: "Một người đàn ông đang đứng trên thang.",
      note: "“Climbing” dễ gây nhầm, nhưng tranh có thang (ladder) chứ không phải núi.",
    },
  ];

  const PART2 = [
    {
      q: "Where is the nearest post office?",
      options: ["Yes, I posted it yesterday.", "Two blocks down this street.", "At nine o'clock."],
      answer: 1, vi: "Bưu điện gần nhất ở đâu? – Cách đây hai dãy nhà, theo con đường này.",
      note: "Câu hỏi WHERE → trả lời địa điểm. Câu hỏi Wh- không trả lời bằng Yes/No. “Posted” là bẫy lặp âm với “post”.",
    },
    {
      q: "When does the meeting start?",
      options: ["In conference room B.", "At two thirty.", "Yes, it was very long."],
      answer: 1, vi: "Khi nào cuộc họp bắt đầu? – Lúc 2 giờ 30.",
      note: "WHEN → thời gian. “Conference room B” trả lời cho WHERE.",
    },
    {
      q: "Who's in charge of the new project?",
      options: ["Ms. Tanaka is.", "It's a new charger.", "By next Friday."],
      answer: 0, vi: "Ai phụ trách dự án mới? – Cô Tanaka.",
      note: "WHO → người. “Charger” là bẫy phát âm gần giống “charge”.",
    },
    {
      q: "Why was the shipment delayed?",
      options: ["It's shipped by air.", "Because of the storm.", "No, it wasn't on the ship."],
      answer: 1, vi: "Tại sao lô hàng bị chậm? – Vì cơn bão.",
      note: "WHY → lý do (because…, to…, due to…). “Shipped”, “ship” là bẫy lặp từ.",
    },
    {
      q: "How often do you check your email?",
      options: ["About every hour.", "By email, please.", "It's checked in."],
      answer: 0, vi: "Bạn kiểm tra email thường xuyên như thế nào? – Khoảng mỗi giờ một lần.",
      note: "HOW OFTEN → tần suất.",
    },
    {
      q: "Would you like some coffee?",
      options: ["Yes, it's a coffee shop.", "Thanks, but I just had some.", "In the copy room."],
      answer: 1, vi: "Bạn có muốn uống cà phê không? – Cảm ơn, tôi vừa uống rồi.",
      note: "Lời mời → nhận lời hoặc từ chối lịch sự. “Copy” phát âm gần “coffee”.",
    },
    {
      q: "Can you help me move these boxes?",
      options: ["They moved last year.", "A box of pens.", "Sure, where do they go?"],
      answer: 2, vi: "Bạn giúp tôi chuyển mấy cái hộp này được không? – Được thôi, để chúng ở đâu?",
      note: "Lời đề nghị giúp đỡ → đồng ý/từ chối. Đáp án đúng có thể là một câu hỏi lại.",
    },
    {
      q: "Didn't you send the invoice yesterday?",
      options: ["Yes, I sent it in the afternoon.", "The voice was clear.", "I'll be in tomorrow."],
      answer: 0, vi: "Hôm qua bạn chưa gửi hóa đơn à? – Có, tôi gửi vào buổi chiều rồi.",
      note: "Câu hỏi phủ định → trả lời như câu hỏi thường. “Voice” là bẫy âm từ “invoice”.",
    },
    {
      q: "Which printer should I use?",
      options: ["Yes, I printed it.", "The one on the left works better.", "Around twenty pages."],
      answer: 1, vi: "Tôi nên dùng máy in nào? – Cái bên trái chạy tốt hơn.",
      note: "WHICH → chọn một cái cụ thể, đáp án thường có “the one…”.",
    },
    {
      q: "Why don't we take a short break?",
      options: ["Because it's broken.", "It took two hours.", "Good idea, I'm a bit tired."],
      answer: 2, vi: "Sao chúng ta không nghỉ giải lao một chút nhỉ? – Ý hay đấy, tôi hơi mệt.",
      note: "“Why don't we…?” là LỜI GỢI Ý, không hỏi lý do → không trả lời bằng “Because”.",
    },
    {
      q: "How much does the ticket cost?",
      options: ["Twenty-five dollars.", "Three times a week.", "A round-trip ticket."],
      answer: 0, vi: "Vé giá bao nhiêu? – 25 đô la.",
      note: "HOW MUCH → giá tiền. “Three times a week” trả lời HOW OFTEN.",
    },
    {
      q: "The report is due on Friday, isn't it?",
      options: ["I read it last week.", "Actually, it's been moved to Monday.", "He reported it to the manager."],
      answer: 1, vi: "Báo cáo hạn nộp là thứ Sáu, phải không? – Thật ra đã dời sang thứ Hai rồi.",
      note: "Câu hỏi đuôi → xác nhận hoặc đính chính. “Actually…” là mở đầu đính chính rất hay gặp.",
    },
    {
      q: "Are you going to the conference or staying here?",
      options: ["Yes, I am.", "I'll be staying here.", "It was a great conference."],
      answer: 1, vi: "Bạn sẽ đi hội nghị hay ở lại đây? – Tôi sẽ ở lại.",
      note: "Câu hỏi lựa chọn (A or B) → chọn một phương án, KHÔNG trả lời Yes/No.",
    },
    {
      q: "Where should I put these files?",
      options: ["On my desk, please.", "They're very useful.", "Put on your coat."],
      answer: 0, vi: "Tôi nên để những tập hồ sơ này ở đâu? – Trên bàn của tôi nhé.",
      note: "WHERE → nơi chốn. “Put on” là bẫy lặp từ “put”.",
    },
    {
      q: "Who will cover for Mr. Kim while he's away?",
      options: ["He placed the order.", "Linda will.", "Next month."],
      answer: 1, vi: "Ai sẽ làm thay ông Kim khi ông ấy vắng mặt? – Linda.",
      note: "WHO → tên người hoặc chức danh. “Next month” trả lời WHEN.",
    },
    {
      q: "What time does the store close?",
      options: ["Close the door, please.", "It's closer to the station.", "At nine p.m. on weekdays."],
      answer: 2, vi: "Mấy giờ cửa hàng đóng cửa? – 9 giờ tối các ngày trong tuần.",
      note: "WHAT TIME → giờ. “Close”, “closer” là bẫy lặp âm.",
    },
    {
      q: "Has the budget been approved yet?",
      options: ["Not yet, maybe next week.", "A large budget.", "He moved to a new office."],
      answer: 0, vi: "Ngân sách đã được duyệt chưa? – Chưa, có lẽ tuần sau.",
      note: "Câu hỏi Yes/No dạng hoàn thành → “Not yet” là câu trả lời tự nhiên.",
    },
    {
      q: "Could you send me the agenda for tomorrow?",
      options: ["Item three is next.", "I'll email it right away.", "Tomorrow was busy."],
      answer: 1, vi: "Bạn gửi tôi chương trình họp ngày mai được không? – Tôi sẽ email ngay.",
      note: "Lời yêu cầu → đồng ý thực hiện. “Tomorrow was” sai thì.",
    },
    {
      q: "How was your business trip to Singapore?",
      options: ["By plane.", "Next Tuesday.", "It was very productive."],
      answer: 2, vi: "Chuyến công tác Singapore của bạn thế nào? – Rất hiệu quả.",
      note: "“How was…?” hỏi nhận xét/đánh giá, không hỏi phương tiện (“By plane”).",
    },
    {
      q: "Let's review the contract before we sign it.",
      options: ["Sure, I'll bring a copy.", "The sign is broken.", "It was a good review."],
      answer: 0, vi: "Hãy xem lại hợp đồng trước khi ký. – Được, tôi sẽ mang một bản.",
      note: "Câu đề nghị (Let's…) → đồng ý hoặc đưa ý kiến. “Sign”, “review” là bẫy lặp từ.",
    },
    {
      q: "Whose turn is it to lead the meeting?",
      options: ["Turn left at the corner.", "I think it's Tom's.", "It lasted an hour."],
      answer: 1, vi: "Đến lượt ai chủ trì cuộc họp? – Tôi nghĩ là của Tom.",
      note: "WHOSE → sở hữu (…'s). “Turn left” là bẫy lặp từ “turn”.",
    },
    {
      q: "Should we take a taxi or the subway?",
      options: ["Yes, we should.", "Taxes are high.", "The subway is faster at this hour."],
      answer: 2, vi: "Chúng ta nên đi taxi hay tàu điện ngầm? – Tàu điện ngầm nhanh hơn vào giờ này.",
      note: "Câu hỏi lựa chọn → chọn một, kèm lý do. “Taxes” là bẫy âm từ “taxi”.",
    },
  ];

  const TIPS = {
    part1: [
      "Nhìn tranh trước khi nghe: ai, đang làm gì, đồ vật ở đâu.",
      "Tranh không có người → loại đáp án có người (someone is…) và bị động tiếp diễn (is being…).",
      "Cẩn thận từ có trong tranh nhưng động từ/vị trí sai.",
    ],
    part2: [
      "Nghe kỹ TỪ ĐẦU câu hỏi (Who/When/Where/Why/How…) – nó quyết định loại đáp án.",
      "Câu hỏi Wh- không trả lời bằng Yes/No; câu hỏi lựa chọn (A or B) cũng vậy.",
      "Cảnh giác đáp án lặp lại từ hoặc âm giống câu hỏi – thường là bẫy.",
      "Câu trả lời gián tiếp (“Let me check”, “I'm not sure”) thường lại là đáp án đúng.",
    ],
  };

  root.CONTENT.TOEIC_LISTENING = { PART1, PART2, TIPS };
})(typeof window !== "undefined" ? window : globalThis);
