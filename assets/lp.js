/* おうか鍼灸整体院 LP 共通スクリプト */
(function () {
  // Meta Pixel の計測（Pixel 未設定のときは何もしない）
  function track(ev, params) {
    if (typeof fbq === 'function') fbq('track', ev, params || {});
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.classList.contains('js-reserve')) track('Lead', { content_name: 'hotpepper' });      // ホットペッパー予約
    else if (a.classList.contains('js-line')) track('Contact', { content_name: 'line' });     // LINE
    else if (a.href && a.href.indexOf('tel:') === 0) track('Contact', { content_name: 'tel' }); // 電話
  });

  // お悩みチェック：タップでチェックを付けられる
  document.querySelectorAll('.checks li').forEach(function (li) {
    li.setAttribute('role', 'checkbox');
    li.setAttribute('aria-checked', 'false');
    li.tabIndex = 0;
    function toggle() {
      var on = li.classList.toggle('on');
      li.setAttribute('aria-checked', on ? 'true' : 'false');
    }
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
  });

  // スクロールでふわっと表示
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // 産後ページ：3問アンケート
  var form = document.getElementById('quiz-form');
  if (!form) return;
  var submit = document.getElementById('quiz-submit');
  var hint = document.getElementById('quiz-hint');
  var result = document.getElementById('quiz-result');
  var list = document.getElementById('quiz-result-list');
  var Q1 = {
    pain: '腰や肩のつらさには、抱っこや授乳の姿勢のクセも関係します。検査でお体の状態を確認してから施術します。',
    shape: '体型の変化が気になる方へ：産後の体型が<a class="jump" href="#cause">戻りにくくなる理由</a>をご覧ください。',
    pelvis: '骨盤のゆがみが気になる方へ：骨盤だけでなく、全身のバランスを確認して整えます。',
    swell: 'むくみ・冷えが気になる方も、あわせてご相談ください。お話を伺い、施術内容をご説明します。'
  };
  var Q2 = {
    lt6: '産後6か月未満の方は、産後の体調や悪露の状況に合わせて施術内容を調整します。不安な点はご予約前にご相談ください。',
    lt12: '産後の体調に合わせて施術内容を調整しますので、安心してご相談ください。',
    gt12: '産後1年以上経った方も、ご相談いただけます。これまでの経過もお聞かせください。'
  };
  function answers() {
    return {
      q1: Array.prototype.map.call(form.querySelectorAll('input[name="q1"]:checked'), function (i) { return i.value; }),
      q2: (form.querySelector('input[name="q2"]:checked') || {}).value,
      q3: (form.querySelector('input[name="q3"]:checked') || {}).value
    };
  }
  form.addEventListener('change', function () {
    var a = answers();
    var ready = a.q1.length > 0 && a.q2 && a.q3;
    submit.disabled = !ready;
    hint.hidden = !!ready;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = answers();
    var lines = a.q1.map(function (k) { return Q1[k]; });
    lines.push(Q2[a.q2]);
    lines.push(a.q3 === 'yes'
      ? 'お子様連れOKです。院内に<a class="jump" href="#kids">キッズルーム</a>があり、施術中は女性スタッフがお子様を見守ります。'
      : 'おひとりでのご来院も、もちろん歓迎です。');
    list.innerHTML = lines.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    result.hidden = false;
    result.focus();
    if (typeof fbq === 'function') fbq('trackCustom', 'QuizComplete');
  });
})();
