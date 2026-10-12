/* Learning content. Each word: [english, ipa, vietnamese, example] */
(function (root) {
  const TOPICS = [
    {
      id: "daily",
      name: "Giao tiếp hằng ngày",
      icon: "💬",
      words: [
        ["appointment", "/əˈpɔɪntmənt/", "cuộc hẹn", "I have a doctor's appointment at 3 p.m."],
        ["convenient", "/kənˈviːniənt/", "thuận tiện", "Is Monday convenient for you?"],
        ["recommend", "/ˌrekəˈmend/", "giới thiệu, khuyên dùng", "Can you recommend a good restaurant?"],
        ["available", "/əˈveɪləbl/", "sẵn có, rảnh", "Are you available this afternoon?"],
        ["neighbour", "/ˈneɪbə(r)/", "hàng xóm", "My neighbour helped me fix the door."],
        ["borrow", "/ˈbɒrəʊ/", "mượn", "Can I borrow your pen?"],
        ["complain", "/kəmˈpleɪn/", "phàn nàn", "She complained about the noise."],
        ["apologize", "/əˈpɒlədʒaɪz/", "xin lỗi", "I apologize for being late."],
        ["grateful", "/ˈɡreɪtfl/", "biết ơn", "I'm grateful for your help."],
        ["habit", "/ˈhæbɪt/", "thói quen", "Reading every night is a good habit."],
      ],
    },
    {
      id: "office",
      name: "Công việc văn phòng",
      icon: "🏢",
      words: [
        ["deadline", "/ˈdedlaɪn/", "hạn chót", "The deadline for the report is Friday."],
        ["colleague", "/ˈkɒliːɡ/", "đồng nghiệp", "I'm having lunch with a colleague."],
        ["schedule", "/ˈʃedjuːl/", "lịch trình", "Let me check my schedule."],
        ["approve", "/əˈpruːv/", "phê duyệt", "The director approved the budget."],
        ["budget", "/ˈbʌdʒɪt/", "ngân sách", "We need to stay within budget."],
        ["responsible", "/rɪˈspɒnsəbl/", "chịu trách nhiệm", "Who is responsible for this project?"],
        ["delegate", "/ˈdelɪɡeɪt/", "giao việc, ủy quyền", "A good manager knows how to delegate."],
        ["priority", "/praɪˈɒrəti/", "ưu tiên", "Customer satisfaction is our top priority."],
        ["proposal", "/prəˈpəʊzl/", "đề xuất", "Please send me the proposal by email."],
        ["contract", "/ˈkɒntrækt/", "hợp đồng", "We signed the contract yesterday."],
      ],
    },
    {
      id: "digital",
      name: "Chuyển đổi số & CNTT",
      icon: "💡",
      words: [
        ["digital transformation", "/ˈdɪdʒɪtl ˌtrænsfəˈmeɪʃn/", "chuyển đổi số", "Digital transformation changes how organizations serve citizens."],
        ["cloud computing", "/klaʊd kəmˈpjuːtɪŋ/", "điện toán đám mây", "Cloud computing reduces infrastructure costs."],
        ["data center", "/ˈdeɪtə ˈsentə(r)/", "trung tâm dữ liệu", "The new data center will open next year."],
        ["cybersecurity", "/ˌsaɪbəsɪˈkjʊərəti/", "an ninh mạng", "Cybersecurity is a top concern for every business."],
        ["artificial intelligence", "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", "trí tuệ nhân tạo", "Artificial intelligence can automate routine tasks."],
        ["platform", "/ˈplætfɔːm/", "nền tảng", "We built a shared platform for all departments."],
        ["integrate", "/ˈɪntɪɡreɪt/", "tích hợp", "The system integrates with existing software."],
        ["deploy", "/dɪˈplɔɪ/", "triển khai", "We will deploy the solution in three provinces."],
        ["stakeholder", "/ˈsteɪkhəʊldə(r)/", "bên liên quan", "We met all stakeholders to collect requirements."],
        ["e-government", "/ˌiː ˈɡʌvənmənt/", "chính phủ điện tử", "E-government services save citizens time."],
        ["infrastructure", "/ˈɪnfrəstrʌktʃə(r)/", "hạ tầng", "Telecom infrastructure is the foundation of a digital economy."],
        ["smart city", "/smɑːt ˈsɪti/", "đô thị thông minh", "The smart city project uses sensors to manage traffic."],
      ],
    },
    {
      id: "meeting",
      name: "Họp & thuyết trình",
      icon: "📊",
      words: [
        ["agenda", "/əˈdʒendə/", "chương trình họp", "Let's go through today's agenda."],
        ["summarize", "/ˈsʌməraɪz/", "tóm tắt", "Could you summarize the main points?"],
        ["objective", "/əbˈdʒektɪv/", "mục tiêu", "Our objective is to increase revenue by 20%."],
        ["revenue", "/ˈrevənjuː/", "doanh thu", "Revenue grew steadily this quarter."],
        ["quarter", "/ˈkwɔːtə(r)/", "quý", "Sales were strong in the third quarter."],
        ["figure", "/ˈfɪɡə(r)/", "số liệu", "These figures show a clear upward trend."],
        ["negotiate", "/nɪˈɡəʊʃieɪt/", "đàm phán", "We need to negotiate better terms."],
        ["feedback", "/ˈfiːdbæk/", "phản hồi", "Thank you for your feedback."],
        ["clarify", "/ˈklærəfaɪ/", "làm rõ", "Could you clarify what you mean?"],
        ["follow up", "/ˈfɒləʊ ʌp/", "theo dõi, xử lý tiếp", "I will follow up with an email tomorrow."],
      ],
    },
    {
      id: "travel",
      name: "Du lịch",
      icon: "✈️",
      words: [
        ["boarding pass", "/ˈbɔːdɪŋ pɑːs/", "thẻ lên máy bay", "Please show your boarding pass."],
        ["luggage", "/ˈlʌɡɪdʒ/", "hành lý", "My luggage is too heavy."],
        ["reservation", "/ˌrezəˈveɪʃn/", "đặt chỗ", "I have a reservation under the name Nguyen."],
        ["departure", "/dɪˈpɑːtʃə(r)/", "khởi hành", "The departure time has changed."],
        ["destination", "/ˌdestɪˈneɪʃn/", "điểm đến", "Da Nang is a popular destination."],
        ["receipt", "/rɪˈsiːt/", "hóa đơn, biên lai", "Can I have a receipt, please?"],
        ["currency", "/ˈkʌrənsi/", "tiền tệ", "Where can I exchange currency?"],
        ["itinerary", "/aɪˈtɪnərəri/", "lịch trình chuyến đi", "Here is the itinerary for our trip."],
        ["sightseeing", "/ˈsaɪtsiːɪŋ/", "tham quan", "We went sightseeing in Hoi An."],
        ["delay", "/dɪˈleɪ/", "trì hoãn", "The flight was delayed by two hours."],
      ],
    },
  ];

  const GRAMMAR = [
    {
      id: "present-simple",
      title: "Thì hiện tại đơn (Present Simple)",
      body: `
        <p><b>Dùng khi:</b> nói về thói quen, sự thật hiển nhiên, lịch trình cố định.</p>
        <p><b>Cấu trúc:</b> S + V(s/es) &nbsp;|&nbsp; S + do/does + not + V &nbsp;|&nbsp; Do/Does + S + V?</p>
        <ul>
          <li>She <b>works</b> at VNPT.</li>
          <li>The meeting <b>starts</b> at 9 a.m.</li>
          <li>They <b>don't use</b> paper documents anymore.</li>
        </ul>
        <p><b>Dấu hiệu:</b> always, usually, often, every day, on Mondays…</p>`,
      quiz: [
        ["He ___ to work by bus every day.", ["go", "goes", "going", "gone"], 1],
        ["Water ___ at 100 degrees Celsius.", ["boil", "boils", "is boiling", "boiled"], 1],
        ["___ your team use cloud services?", ["Do", "Does", "Is", "Are"], 1],
      ],
    },
    {
      id: "past-simple",
      title: "Thì quá khứ đơn (Past Simple)",
      body: `
        <p><b>Dùng khi:</b> hành động đã xảy ra và kết thúc tại một thời điểm xác định trong quá khứ.</p>
        <p><b>Cấu trúc:</b> S + V-ed/V2 &nbsp;|&nbsp; S + did not + V &nbsp;|&nbsp; Did + S + V?</p>
        <ul>
          <li>We <b>launched</b> the app last month.</li>
          <li>I <b>met</b> the client yesterday.</li>
          <li>She <b>didn't attend</b> the meeting.</li>
        </ul>
        <p><b>Dấu hiệu:</b> yesterday, last week, ago, in 2020…</p>`,
      quiz: [
        ["We ___ the contract two days ago.", ["sign", "signed", "have signed", "signing"], 1],
        ["___ you see the report yesterday?", ["Do", "Did", "Have", "Were"], 1],
        ["They ___ go to the conference last year.", ["didn't", "don't", "haven't", "weren't"], 0],
      ],
    },
    {
      id: "present-perfect",
      title: "Thì hiện tại hoàn thành (Present Perfect)",
      body: `
        <p><b>Dùng khi:</b> hành động xảy ra trong quá khứ nhưng có liên hệ/kết quả ở hiện tại, hoặc chưa rõ thời điểm.</p>
        <p><b>Cấu trúc:</b> S + have/has + V3/V-ed</p>
        <ul>
          <li>We <b>have completed</b> phase one.</li>
          <li>She <b>has worked</b> here since 2018.</li>
          <li><b>Have</b> you ever <b>visited</b> Singapore?</li>
        </ul>
        <p><b>Dấu hiệu:</b> already, yet, just, ever, never, since, for…</p>
        <p><i>Lưu ý:</i> có mốc thời gian cụ thể trong quá khứ (yesterday, in 2020) thì dùng quá khứ đơn.</p>`,
      quiz: [
        ["I ___ already ___ the email.", ["have / sent", "did / send", "has / sent", "am / sending"], 0],
        ["She has lived in Hanoi ___ ten years.", ["since", "for", "ago", "during"], 1],
        ["___ you finished the proposal yet?", ["Did", "Do", "Have", "Are"], 2],
      ],
    },
    {
      id: "conditionals",
      title: "Câu điều kiện loại 1 & 2",
      body: `
        <p><b>Loại 1</b> – điều có thể xảy ra ở hiện tại/tương lai:<br>If + S + V(hiện tại), S + will + V</p>
        <ul><li>If we <b>finish</b> early, we <b>will present</b> on Monday.</li></ul>
        <p><b>Loại 2</b> – điều không có thật/khó xảy ra ở hiện tại:<br>If + S + V2/were, S + would + V</p>
        <ul><li>If I <b>were</b> you, I <b>would accept</b> the offer.</li></ul>`,
      quiz: [
        ["If it rains, we ___ the event indoors.", ["hold", "will hold", "would hold", "held"], 1],
        ["If I ___ more time, I would learn Japanese.", ["have", "had", "will have", "has"], 1],
        ["If I were the director, I ___ invest in AI.", ["will", "would", "am", "did"], 1],
      ],
    },
    {
      id: "passive",
      title: "Câu bị động (Passive Voice)",
      body: `
        <p><b>Dùng khi:</b> muốn nhấn mạnh hành động/đối tượng chịu tác động hơn là người thực hiện — rất phổ biến trong văn bản công việc.</p>
        <p><b>Cấu trúc:</b> S + be (chia theo thì) + V3/V-ed (+ by O)</p>
        <ul>
          <li>The report <b>is updated</b> every week.</li>
          <li>The system <b>was deployed</b> in 2025.</li>
          <li>The data <b>has been migrated</b> to the cloud.</li>
        </ul>`,
      quiz: [
        ["The project ___ by our team last year.", ["completed", "was completed", "is completed", "has completing"], 1],
        ["English ___ all over the world.", ["speaks", "is spoken", "spoke", "is speaking"], 1],
        ["The new policy ___ already been approved.", ["has", "have", "is", "was"], 0],
      ],
    },
  ];

  const SENTENCES = [
    "Nice to meet you.",
    "Could you say that again, please?",
    "Let me introduce myself.",
    "Thank you for your time today.",
    "I'd like to schedule a meeting next week.",
    "Our goal is to improve customer experience.",
    "We are working on a digital transformation project.",
    "Could you send me the report by Friday?",
    "I totally agree with your point.",
    "Let's move on to the next item on the agenda.",
    "Cloud computing helps us reduce costs.",
    "What do you think about this proposal?",
  ];

  root.CONTENT = { TOPICS, GRAMMAR, SENTENCES };
})(typeof window !== "undefined" ? window : globalThis);
