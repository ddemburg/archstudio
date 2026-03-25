import { useState, useEffect, useCallback } from "react";

// ── Palette & helpers ──────────────────────────────────────────────────────────
const G = {
  green: "#3D7A5A",
  greenLight: "#EBF4EF",
  greenDark: "#2D5A42",
  gold: "#B45309",
  goldLight: "#FBF5EE",
  border: "#E8E6E1",
  bg: "#F5F4F0",
  text: "#1A1A1A",
  text2: "#6B6B6B",
  text3: "#B0B0B0",
  white: "#FFFFFF",
  red: "#DC2626",
  redLight: "#FEF2F2",
};

const DAY_HE = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const MONTH_HE = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

const fmtDate = (d) =>
  `${d.getDate()} ${MONTH_HE[d.getMonth()]} ${d.getFullYear()}`;

const fmtTime = (h, m = 0) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Simulate busy slots (would come from Google Calendar API)
const MOCK_BUSY = (() => {
  const today = new Date();
  return [
    { date: addDays(today, 1), hour: 9 },
    { date: addDays(today, 1), hour: 10 },
    { date: addDays(today, 2), hour: 14 },
    { date: addDays(today, 3), hour: 11 },
    { date: addDays(today, 4), hour: 9 },
    { date: addDays(today, 4), hour: 16 },
  ];
})();

const isBusy = (date, hour) =>
  MOCK_BUSY.some((b) => sameDay(b.date, date) && b.hour === hour);

// ── Sub-components ─────────────────────────────────────────────────────────────

function Chip({ children, active, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 34,
        padding: "0 14px",
        borderRadius: 8,
        border: active ? "none" : `1px solid ${G.border}`,
        background: active ? G.green : disabled ? "#F5F5F3" : G.white,
        color: active ? G.white : disabled ? G.text3 : G.text2,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Heebo, sans-serif",
        transition: "all .15s",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SlotCard({ slot, selected, onToggle, compact }) {
  const busy = isBusy(slot.date, slot.hour);
  return (
    <div
      onClick={() => !busy && onToggle(slot)}
      style={{
        padding: compact ? "8px 12px" : "10px 14px",
        borderRadius: 10,
        border: `1.5px solid ${selected ? G.green : busy ? "#F0EDE8" : G.border}`,
        background: selected ? G.greenLight : busy ? "#FAFAF8" : G.white,
        cursor: busy ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all .15s",
        opacity: busy ? 0.5 : 1,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        if (!busy && !selected)
          e.currentTarget.style.borderColor = G.green;
      }}
      onMouseOut={(e) => {
        if (!selected) e.currentTarget.style.borderColor = busy ? "#F0EDE8" : G.border;
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 22px 22px 0",
            borderColor: `transparent ${G.green} transparent transparent`,
          }}
        />
      )}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: selected ? G.green : busy ? "#F5F5F3" : G.greenLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14 }}>{busy ? "🚫" : selected ? "✓" : "🕐"}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: compact ? 12 : 13,
            fontWeight: 600,
            color: busy ? G.text3 : G.text,
          }}
        >
          {fmtDate(slot.date)}
        </div>
        <div style={{ fontSize: 12, color: selected ? G.greenDark : G.text2, fontWeight: selected ? 600 : 400 }}>
          {fmtTime(slot.hour)}–{fmtTime(slot.hour + 1)}
        </div>
      </div>
      {busy && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 999,
            background: "#F3F4F6",
            color: G.text3,
          }}
        >
          תפוס
        </span>
      )}
    </div>
  );
}

// ── STEP 1: Calendar picker + slot builder ──────────────────────────────────────
function StepPickSlots({ selected, onToggle, onNext }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const [pickedDay, setPickedDay] = useState(null);
  const [duration, setDuration] = useState(60);

  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  // Calendar grid
  const firstDay = new Date(viewMonth.y, viewMonth.m, 1);
  const lastDay = new Date(viewMonth.y, viewMonth.m + 1, 0);
  const startDow = (firstDay.getDay() + 1) % 7; // adjust for Sunday=0
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++)
    cells.push(new Date(viewMonth.y, viewMonth.m, d));

  const isWeekend = (d) => d && (d.getDay() === 5 || d.getDay() === 6);
  const isPast = (d) => d && d < today && !sameDay(d, today);
  const hasSlots = (d) =>
    d && selected.some((s) => sameDay(s.date, d));

  const addDaySlots = (day) => {
    HOURS.forEach((h) => {
      if (!isBusy(day, h)) {
        const slot = { id: `${day.toDateString()}-${h}`, date: day, hour: h, duration };
        onToggle(slot);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Duration */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: G.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
          משך הפגישה
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[30, 60, 90, 120].map((d) => (
            <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>
              {d < 60 ? `${d} דק׳` : `${d / 60} שעה${d > 60 ? "ות" : ""}`}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Calendar */}
        <div style={{ background: G.white, borderRadius: 12, border: `1px solid ${G.border}`, overflow: "hidden" }}>
          {/* Month nav */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={() => setViewMonth((p) => ({ y: p.m === 0 ? p.y - 1 : p.y, m: p.m === 0 ? 11 : p.m - 1 }))}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: G.text2, lineHeight: 1, padding: 4 }}
            >
              ›
            </button>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {MONTH_HE[viewMonth.m]} {viewMonth.y}
            </span>
            <button
              onClick={() => setViewMonth((p) => ({ y: p.m === 11 ? p.y + 1 : p.y, m: p.m === 11 ? 0 : p.m + 1 }))}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: G.text2, lineHeight: 1, padding: 4 }}
            >
              ‹
            </button>
          </div>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "6px 8px 2px" }}>
            {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: G.text3, padding: "2px 0" }}>
                {d}
              </div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "2px 8px 10px", gap: 2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const past = isPast(day);
              const weekend = isWeekend(day);
              const picked = pickedDay && sameDay(day, pickedDay);
              const hasSl = hasSlots(day);
              const disabled = past || weekend;
              return (
                <div
                  key={day.toDateString()}
                  onClick={() => !disabled && setPickedDay(day)}
                  style={{
                    height: 32,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: picked ? 700 : hasSl ? 600 : 400,
                    cursor: disabled ? "default" : "pointer",
                    background: picked ? G.green : hasSl ? G.greenLight : "transparent",
                    color: picked ? "white" : disabled ? G.text3 : hasSl ? G.greenDark : G.text,
                    position: "relative",
                    transition: "all .12s",
                  }}
                  onMouseOver={(e) => {
                    if (!disabled && !picked) e.currentTarget.style.background = "#F0F0EC";
                  }}
                  onMouseOut={(e) => {
                    if (!picked) e.currentTarget.style.background = hasSl ? G.greenLight : "transparent";
                  }}
                >
                  {day.getDate()}
                  {hasSl && !picked && (
                    <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: G.green }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hour picker for selected day */}
        <div>
          {!pickedDay ? (
            <div style={{ background: "#FAFAF8", borderRadius: 12, border: `1px dashed ${G.border}`, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, padding: 24 }}>
              <span style={{ fontSize: 32 }}>📅</span>
              <span style={{ fontSize: 13, color: G.text3, textAlign: "center" }}>בחר יום ביומן כדי להוסיף סלוטים</span>
            </div>
          ) : (
            <div style={{ background: G.white, borderRadius: 12, border: `1px solid ${G.border}`, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{fmtDate(pickedDay)}</span>
                <button
                  onClick={() => addDaySlots(pickedDay)}
                  style={{ fontSize: 11, fontWeight: 700, background: G.greenLight, color: G.greenDark, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "Heebo, sans-serif" }}
                >
                  + כל השעות הפנויות
                </button>
              </div>
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5, maxHeight: 280, overflowY: "auto" }}>
                {HOURS.map((h) => {
                  const busy = isBusy(pickedDay, h);
                  const sl = { id: `${pickedDay.toDateString()}-${h}`, date: pickedDay, hour: h, duration };
                  const sel = selected.some((s) => s.id === sl.id);
                  return (
                    <div
                      key={h}
                      onClick={() => !busy && onToggle(sl)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: `1px solid ${sel ? G.green : busy ? "#F5F5F3" : G.border}`,
                        background: sel ? G.greenLight : busy ? "#FAFAF8" : G.white,
                        cursor: busy ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        opacity: busy ? 0.4 : 1,
                        transition: "all .12s",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: sel ? G.greenDark : G.text, minWidth: 50 }}>
                        {fmtTime(h)}–{fmtTime(h + 1)}
                      </span>
                      <span style={{ flex: 1, fontSize: 11, color: G.text3 }}>
                        {busy ? "תפוס" : sel ? "✓ נבחר" : "פנוי"}
                      </span>
                      {!busy && (
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            border: `2px solid ${sel ? G.green : G.border}`,
                            background: sel ? G.green : G.white,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {sel && <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>✓</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected summary */}
      <div style={{ background: G.greenLight, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: G.greenDark, fontWeight: 600 }}>
          {selected.length === 0
            ? "לא נבחרו סלוטים עדיין"
            : `${selected.length} סלוטים נבחרו לשליחה ללקוח`}
        </span>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          style={{
            height: 36,
            padding: "0 20px",
            borderRadius: 8,
            border: "none",
            background: selected.length > 0 ? G.green : G.text3,
            color: G.white,
            fontSize: 13,
            fontWeight: 700,
            cursor: selected.length > 0 ? "pointer" : "not-allowed",
            fontFamily: "Heebo, sans-serif",
          }}
        >
          המשך ← הגדרת שליחה
        </button>
      </div>
    </div>
  );
}

// ── STEP 2: Compose the invite ───────────────────────────────────────────────────
function StepCompose({ slots, project, onBack, onSend }) {
  const [form, setForm] = useState({
    to: project?.client_email || "",
    subject: `בקשת פגישה — ${project?.name || "הפרויקט שלנו"}`,
    note: `שלום,\n\nאשמח לקבוע פגישה לעדכון בנושא הפרויקט.\nנא לבחור את הזמן המועדף עליך מהאפשרויות להלן.\n\nתודה,\nהמשרד`,
    meetingType: "zoom",
    location: "",
  });
  const u = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* To */}
        <label style={{ gridColumn: "1/-1" }}>
          <span style={labelStyle}>אל (אימייל לקוח)</span>
          <input
            value={form.to}
            onChange={(e) => u("to", e.target.value)}
            placeholder="client@example.com"
            style={inputStyle}
          />
        </label>
        {/* Subject */}
        <label style={{ gridColumn: "1/-1" }}>
          <span style={labelStyle}>נושא</span>
          <input value={form.subject} onChange={(e) => u("subject", e.target.value)} style={inputStyle} />
        </label>
        {/* Meeting type */}
        <label>
          <span style={labelStyle}>סוג פגישה</span>
          <select value={form.meetingType} onChange={(e) => u("meetingType", e.target.value)} style={inputStyle}>
            <option value="zoom">💻 Zoom / וידאו</option>
            <option value="office">🏢 במשרד</option>
            <option value="site">🏗 בשטח</option>
            <option value="phone">📞 שיחת טלפון</option>
          </select>
        </label>
        {/* Location */}
        {(form.meetingType === "office" || form.meetingType === "site") && (
          <label>
            <span style={labelStyle}>כתובת</span>
            <input value={form.location} onChange={(e) => u("location", e.target.value)} placeholder="רחוב ומספר" style={inputStyle} />
          </label>
        )}
        {/* Note */}
        <label style={{ gridColumn: "1/-1" }}>
          <span style={labelStyle}>הודעה אישית</span>
          <textarea
            value={form.note}
            onChange={(e) => u("note", e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "none" }}
          />
        </label>
      </div>

      {/* Slots preview */}
      <div>
        <span style={{ ...labelStyle, display: "block", marginBottom: 8 }}>
          הסלוטים שיישלחו ({slots.length})
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {slots.map((s) => (
            <SlotCard key={s.id} slot={s} compact />
          ))}
        </div>
      </div>

      {/* Preview box */}
      <div
        style={{
          background: "#FAFAF8",
          border: `1px solid ${G.border}`,
          borderRadius: 10,
          padding: 14,
          fontSize: 12,
          color: G.text2,
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 700, color: G.text, marginBottom: 4 }}>תצוגה מקדימה של המייל</div>
        <div style={{ whiteSpace: "pre-line" }}>{form.note}</div>
        <div style={{ marginTop: 10, padding: 10, background: G.white, borderRadius: 8, border: `1px solid ${G.border}` }}>
          {slots.map((s) => (
            <div key={s.id} style={{ padding: "4px 0", borderBottom: `1px solid #F5F5F3`, fontSize: 12 }}>
              📅 {fmtDate(s.date)} | {fmtTime(s.hour)}–{fmtTime(s.hour + 1)} ({s.duration} דק׳)
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 11, color: G.text3 }}>← לחץ על הזמן המועדף עליך לאישור</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btnStyle, background: G.white, color: G.text2, border: `1px solid ${G.border}` }}>
          ← חזרה
        </button>
        <button onClick={() => onSend(form)} style={{ ...btnStyle, background: G.green, color: G.white }}>
          📨 שלח ללקוח
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Confirmation ───────────────────────────────────────────────────────
function StepSent({ slots, email, onClose, onNewRequest }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: G.greenLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          margin: "0 auto 16px",
        }}
      >
        ✉️
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>הבקשה נשלחה!</h2>
      <p style={{ fontSize: 13, color: G.text2, marginBottom: 20 }}>
        נשלחה ל-<strong>{email}</strong> עם {slots.length} אפשרויות לבחירה.
        <br />
        תקבל התראה ברגע שהלקוח יבחר זמן.
      </p>

      <div style={{ background: G.greenLight, borderRadius: 10, padding: 14, marginBottom: 20, textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G.greenDark, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
          הסלוטים שנשלחו
        </div>
        {slots.map((s) => (
          <div key={s.id} style={{ fontSize: 13, padding: "4px 0", color: G.greenDark }}>
            ✓ {fmtDate(s.date)} — {fmtTime(s.hour)}–{fmtTime(s.hour + 1)}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={onNewRequest} style={{ ...btnStyle, background: G.white, color: G.text2, border: `1px solid ${G.border}` }}>
          + בקשה חדשה
        </button>
        <button onClick={onClose} style={{ ...btnStyle, background: G.green, color: G.white }}>
          סגור
        </button>
      </div>
    </div>
  );
}

// ── CLIENT BOOKING VIEW (what the client sees) ────────────────────────────────
function ClientBookingView({ request, onClose }) {
  const [chosen, setChosen] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #2A5740, #3D7A5A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Heebo, sans-serif",
          direction: "rtl",
        }}
      >
        <div style={{ background: G.white, borderRadius: 20, padding: 48, maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>הפגישה נקבעה!</h1>
          <p style={{ color: G.text2, fontSize: 14, marginBottom: 20 }}>
            {fmtDate(chosen.date)}, {fmtTime(chosen.hour)}–{fmtTime(chosen.hour + 1)}
          </p>
          <div style={{ background: G.greenLight, borderRadius: 10, padding: 14, fontSize: 13, color: G.greenDark }}>
            אישור יישלח אליך במייל. נתראה בקרוב! 🏗
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: G.bg,
        fontFamily: "Heebo, sans-serif",
        direction: "rtl",
      }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #2A5740, #3D7A5A)", padding: "32px 24px 40px", color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏗</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{request.projectName}</h1>
        <p style={{ fontSize: 14, opacity: 0.8 }}>בחר זמן נוח לפגישה</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ background: G.white, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${G.border}` }}>
          <div style={{ fontSize: 12, color: G.text2, marginBottom: 4 }}>📝 {request.note}</div>
          <div style={{ fontSize: 11, color: G.text3 }}>
            {request.meetingType === "zoom" && "💻 פגישת וידאו"}
            {request.meetingType === "office" && "🏢 פגישה במשרד"}
            {request.meetingType === "site" && "🏗 פגישה בשטח"}
            {request.meetingType === "phone" && "📞 שיחת טלפון"}
            {" · "}
            {request.slots[0]?.duration} דקות
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: G.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
          בחר זמן
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {request.slots.map((s) => (
            <div
              key={s.id}
              onClick={() => setChosen(s)}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: `2px solid ${chosen?.id === s.id ? G.green : G.border}`,
                background: chosen?.id === s.id ? G.greenLight : G.white,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: chosen?.id === s.id ? G.green : "#F5F5F3",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: chosen?.id === s.id ? "rgba(255,255,255,.7)" : G.text3 }}>
                  {MONTH_HE[s.date.getMonth()].slice(0, 3)}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: chosen?.id === s.id ? "white" : G.text, lineHeight: 1 }}>
                  {s.date.getDate()}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: G.text }}>
                  {["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][s.date.getDay()]}
                  {", "}
                  {fmtDate(s.date)}
                </div>
                <div style={{ fontSize: 13, color: chosen?.id === s.id ? G.greenDark : G.text2 }}>
                  {fmtTime(s.hour)}–{fmtTime(s.hour + 1)} ({s.duration} דק׳)
                </div>
              </div>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: `2px solid ${chosen?.id === s.id ? G.green : G.border}`,
                  background: chosen?.id === s.id ? G.green : G.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {chosen?.id === s.id && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => chosen && setConfirmed(true)}
          disabled={!chosen}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 12,
            border: "none",
            background: chosen ? G.green : G.text3,
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: chosen ? "pointer" : "not-allowed",
            fontFamily: "Heebo, sans-serif",
            transition: "all .15s",
          }}
        >
          {chosen ? `✓ אני בוחר/ת — ${fmtDate(chosen.date)}, ${fmtTime(chosen.hour)}` : "בחר זמן מועדף"}
        </button>
      </div>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: G.text3,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  marginBottom: 5,
};
const inputStyle = {
  width: "100%",
  height: 38,
  padding: "0 10px",
  border: `1px solid ${G.border}`,
  borderRadius: 8,
  fontSize: 13,
  fontFamily: "Heebo, sans-serif",
  background: G.white,
  outline: "none",
  boxSizing: "border-box",
};
const btnStyle = {
  height: 38,
  padding: "0 20px",
  borderRadius: 8,
  border: "none",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "Heebo, sans-serif",
  transition: "opacity .15s",
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function MeetingScheduler({ project, onClose }) {
  const [step, setStep] = useState(1); // 1=pick, 2=compose, 3=sent
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [sentData, setSentData] = useState(null);
  const [previewClient, setPreviewClient] = useState(false);

  const toggleSlot = useCallback((slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.id === slot.id);
      return exists ? prev.filter((s) => s.id !== slot.id) : [...prev, slot].sort((a, b) => a.date - b.date || a.hour - b.hour);
    });
  }, []);

  const handleSend = (form) => {
    setSentData({ ...form, slots: selectedSlots });
    setStep(3);
  };

  // Mock project fallback
  const proj = project || { name: "פרויקט לדוגמה", client_email: "client@example.com" };

  const STEPS = [
    { n: 1, l: "בחר סלוטים" },
    { n: 2, l: "כתוב הזמנה" },
    { n: 3, l: "נשלח!" },
  ];

  if (previewClient && sentData) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 500 }}>
        <ClientBookingView
          request={{ ...sentData, projectName: proj.name }}
          onClose={() => setPreviewClient(false)}
        />
        <button
          onClick={() => setPreviewClient(false)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 600,
            height: 36,
            padding: "0 14px",
            borderRadius: 8,
            border: "none",
            background: "rgba(0,0,0,.6)",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Heebo, sans-serif",
          }}
        >
          ← חזרה למשרד
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,.45)",
        direction: "rtl",
        fontFamily: "Heebo, sans-serif",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: G.white,
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,.2)",
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: G.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              📅
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>תיאום פגישה</div>
              <div style={{ fontSize: 12, color: G.text2 }}>{proj.name}</div>
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: step > s.n ? G.green : step === s.n ? G.text : "#F0EDE8",
                    color: step >= s.n ? "white" : G.text3,
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <span style={{ fontSize: 11, color: step === s.n ? G.text : G.text3, fontWeight: step === s.n ? 600 : 400, display: i < 2 ? "block" : "block" }}>
                  {s.l}
                </span>
                {i < 2 && <span style={{ color: G.text3, fontSize: 12 }}>›</span>}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: G.text3, lineHeight: 1, padding: 4 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {step === 1 && (
            <StepPickSlots
              selected={selectedSlots}
              onToggle={toggleSlot}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepCompose
              slots={selectedSlots}
              project={proj}
              onBack={() => setStep(1)}
              onSend={handleSend}
            />
          )}
          {step === 3 && sentData && (
            <div>
              <StepSent
                slots={sentData.slots}
                email={sentData.to}
                onClose={onClose}
                onNewRequest={() => {
                  setStep(1);
                  setSelectedSlots([]);
                  setSentData(null);
                }}
              />
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button
                  onClick={() => setPreviewClient(true)}
                  style={{ fontSize: 12, color: G.text2, background: "none", border: `1px solid ${G.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "Heebo, sans-serif" }}
                >
                  👁 תצוגת לקוח (מה הלקוח רואה)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Google Calendar notice */}
        {step !== 3 && (
          <div style={{ padding: "10px 24px 16px", borderTop: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>📅</span>
            <span style={{ fontSize: 11, color: G.text3 }}>
              שעות תפוסות נמשכות מ-Google Calendar שלך · הסלוטים שנשלחו יתווספו ליומן אוטומטית עם האישור
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
