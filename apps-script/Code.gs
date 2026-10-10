// AI 수업 렌즈 · 연수 의견 모아 보기
// 시트의 '응답' 탭에 선택을 저장하고, 집계를 JSON으로 돌려줍니다.
const SHEET = '응답';
const POINTS = ['도구', '결과', '역할'];
const CHOICES = ['A', 'B', 'C', 'D'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (POINTS.indexOf(d.point) < 0 || CHOICES.indexOf(d.choice) < 0 || !d.sid) {
      return out({ ok: false, error: 'bad request' });
    }
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    const last = sh.getLastRow();
    const vals = last > 1 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
    let row = 0;
    for (let i = 0; i < vals.length; i++) {
      if (vals[i][1] === d.point && vals[i][3] === String(d.sid)) { row = i + 2; break; }
    }
    const rec = [new Date(), d.point, d.choice, String(d.sid)];
    if (row) sh.getRange(row, 1, 1, 4).setValues([rec]); // 같은 사람이 다시 고르면 덮어씀
    else sh.appendRow(rec);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const last = sh.getLastRow();
  const vals = last > 1 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
  const counts = {};
  POINTS.forEach(p => { counts[p] = { A: 0, B: 0, C: 0, D: 0 }; });
  vals.forEach(r => { if (counts[r[1]] && counts[r[1]][r[2]] !== undefined) counts[r[1]][r[2]]++; });
  return out({ ok: true, counts: counts });
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
