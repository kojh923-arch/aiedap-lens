// AI 수업 렌즈 · 연수 의견 모아 보기
// 시트의 '응답' 탭에 선택과 이유를 저장하고, 집계와 최근 이유를 JSON으로 돌려줍니다.
// 응답 탭 열: A 시각 | B 지점 | C 선택 | D 접속번호 | E 이유 | F 숨김
// 화면에 띄우고 싶지 않은 이유가 있으면 그 줄의 F열(숨김)에 x 를 적으면 됩니다.
const SHEET = '응답';
const POINTS = ['도구', '결과', '역할'];
const CHOICES = ['A', 'B', 'C', 'D'];
const MAX_REASONS = 30;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (POINTS.indexOf(d.point) < 0 || CHOICES.indexOf(d.choice) < 0 || !d.sid) {
      return out({ ok: false, error: 'bad request' });
    }
    const why = String(d.why || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    const last = sh.getLastRow();
    const vals = last > 1 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
    let row = 0;
    for (let i = 0; i < vals.length; i++) {
      if (vals[i][1] === d.point && String(vals[i][3]) === String(d.sid)) { row = i + 2; break; }
    }
    const rec = [new Date(), d.point, d.choice, String(d.sid), why];
    if (row) sh.getRange(row, 1, 1, 5).setValues([rec]); // 같은 사람이 다시 고르면 덮어씀 (숨김 표시는 유지)
    else sh.appendRow(rec);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const last = sh.getLastRow();
  const vals = last > 1 ? sh.getRange(2, 1, last - 1, 6).getValues() : [];
  const counts = {}, reasons = {}, people = {};
  POINTS.forEach(p => { counts[p] = { A: 0, B: 0, C: 0, D: 0 }; reasons[p] = []; });
  vals.forEach(r => {
    const p = r[1], c = r[2];
    if (!counts[p] || counts[p][c] === undefined) return;
    counts[p][c]++;
    if (r[3]) people[r[3]] = 1;
    const hidden = String(r[5] || '').trim() !== '';
    if (r[4] && !hidden) reasons[p].push({ c: c, t: String(r[4]), at: new Date(r[0]).getTime() || 0 });
  });
  POINTS.forEach(p => {
    reasons[p].sort((a, b) => b.at - a.at);
    reasons[p] = reasons[p].slice(0, MAX_REASONS).map(x => ({ c: x.c, t: x.t }));
  });
  return out({ ok: true, counts: counts, reasons: reasons, people: Object.keys(people).length });
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
