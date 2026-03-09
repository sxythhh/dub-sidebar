"use client";

// ── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  cardBg: "#F8F9FA",
  textPrimary: "#0A0B0B",
  textSecondary: "#545454",
  border: "rgba(10, 11, 11, 0.1)",
  pillBg: "#F4F3F2",
};

// ── Icon badge (gradient square with white icon) ─────────────────────────────
function IconBadge({
  gradient,
  borderColor,
  children,
}: {
  gradient: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Card header (icon + title + subtitle) ────────────────────────────────────
function CardHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        {icon}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4.6px 0",
            minHeight: 40,
          }}
        >
          <h3
            style={{
              fontSize: 21.5,
              fontWeight: 600,
              lineHeight: "31px",
              color: C.textPrimary,
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
      </div>
      <p
        style={{
          fontSize: 16.7,
          fontWeight: 500,
          lineHeight: "25px",
          color: C.textSecondary,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ── Task row (for Task Tracking card) ────────────────────────────────────────
function TaskRow({ color, width }: { color: string; width: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 54,
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width,
          height: 54,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: `${color}33`,
          }}
        />
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: `${color}22`,
            border: `1px solid ${color}44`,
          }}
        />
      </div>
    </div>
  );
}

// ── Team member pill (for Team Performance card) ─────────────────────────────
function TeamPill({
  name,
  tasks,
  percent,
  avatarUrl,
}: {
  name: string;
  tasks: string;
  percent: string;
  avatarUrl: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 20px 6px 6px",
        gap: 8,
        backgroundColor: C.pillBg,
        borderRadius: 100,
        border: `1px solid ${C.border}`,
        flexShrink: 0,
      }}
    >
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          objectFit: "cover",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontSize: 16.7,
            fontWeight: 600,
            lineHeight: "22px",
            color: C.textPrimary,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 11.4,
            fontWeight: 700,
            lineHeight: "12px",
            letterSpacing: "0.3px",
            color: C.textSecondary,
          }}
        >
          {tasks}
        </span>
      </div>
      <div
        style={{
          marginLeft: "auto",
          padding: "6px 6px 5px",
          backgroundColor: "rgba(10, 11, 11, 0.1)",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            lineHeight: "12px",
            letterSpacing: "0.3px",
            color: C.textSecondary,
          }}
        >
          {percent}
        </span>
      </div>
    </div>
  );
}

// ── Revenue bar chart ────────────────────────────────────────────────────────
function RevenueChart() {
  const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const heights = [85, 55, 95, 45, 110, 70, 60];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: 140,
        padding: "0 4px",
        gap: 2,
      }}
    >
      {days.map((day, i) => (
        <div
          key={day}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 32,
              height: heights[i],
              borderRadius: "6px 6px 0 0",
              background:
                i === 4
                  ? "linear-gradient(180deg, #FA8837 0%, #FAAC75 100%)"
                  : "rgba(10, 11, 11, 0.06)",
            }}
          />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              lineHeight: "17px",
              letterSpacing: "0.3px",
              color: C.textSecondary,
            }}
          >
            {day}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Orbiting icon ────────────────────────────────────────────────────────────
function OrbitIcon({ gradient, size = 32 }: { gradient: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: gradient,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    />
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function LanderPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 16,
        backgroundColor: C.bg,
        minHeight: "100vh",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1180 }}>
        {/* Features grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 30,
          }}
        >
          {/* ── Card 01: Task Tracking (top-left, spans ~60%) ── */}
          <div
            style={{
              gridColumn: "1 / 2",
              backgroundColor: C.cardBg,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              minHeight: 440,
              position: "relative",
            }}
          >
            <CardHeader
              icon={
                <IconBadge
                  gradient="linear-gradient(144deg, #674CD0 0%, #A8A8FF 100%)"
                  borderColor="#674CD0"
                >
                  {/* Checklist icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="3" stroke="#fff" strokeWidth="1.5" />
                    <path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </IconBadge>
              }
              title="Task Tracking"
              subtitle="Plan work, assign owners, and stay on top of deadlines without switching apps."
            />
            {/* Task list illustration */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 160,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: "0 30px",
              }}
            >
              <TaskRow color="#674CD0" width={285} />
              <TaskRow color="#3784B4" width={348} />
              <TaskRow color="#5BAEF2" width={269} />
              <TaskRow color="#FA8837" width={277} />
            </div>
          </div>

          {/* ── Card 02: Client Management (top-right) ── */}
          <div
            style={{
              gridColumn: "2 / 3",
              backgroundColor: C.cardBg,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              minHeight: 440,
              position: "relative",
            }}
          >
            <CardHeader
              icon={
                <IconBadge
                  gradient="linear-gradient(144deg, #F045AA 0%, #EEAAD2 100%)"
                  borderColor="#F045AA"
                >
                  {/* Mail/client icon */}
                  <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                    <rect x="1" y="0.5" width="18" height="14" rx="3" stroke="#fff" strokeWidth="1.5" />
                    <path d="M1 3l9 5 9-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </IconBadge>
              }
              title="Client management"
              subtitle="Keep notes, files, updates, and project status organized for every client."
            />
            {/* Client orbit illustration */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 200,
                transform: "translateX(-50%)",
                width: 300,
                height: 300,
              }}
            >
              {/* Dashed orbit circle */}
              <div
                style={{
                  position: "absolute",
                  inset: 20,
                  border: "2px dashed #F4F3F2",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(180deg, #DEE6EB 0%, rgba(222, 230, 235, 0) 100%)",
                  opacity: 0.5,
                }}
              />
              {/* Center book */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "15%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 130,
                  borderRadius: 4,
                  backgroundColor: "#E38109",
                  boxShadow:
                    "inset 0px 1.9px 3px rgba(255,255,255,0.43), inset 3.6px 0px 3.6px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              {/* Orbit icons */}
              <div style={{ position: "absolute", left: 20, top: 100 }}>
                <OrbitIcon gradient="linear-gradient(180deg, #5BF2B5 0%, #3784B4 100%)" />
              </div>
              <div style={{ position: "absolute", right: 20, top: 60 }}>
                <OrbitIcon gradient="linear-gradient(180deg, #F25B5D 0%, #9137B4 100%)" size={40} />
              </div>
              <div style={{ position: "absolute", left: 30, bottom: 40 }}>
                <OrbitIcon gradient="linear-gradient(180deg, #5BAEF2 0%, #1F3BA8 100%)" />
              </div>
              <div style={{ position: "absolute", right: 60, bottom: 20 }}>
                <OrbitIcon gradient="linear-gradient(180deg, #674CD0 0%, #A8A8FF 100%)" />
              </div>
            </div>
          </div>

          {/* ── Card 03: Team Performance (bottom-left) ── */}
          <div
            style={{
              gridColumn: "1 / 2",
              backgroundColor: C.cardBg,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              minHeight: 440,
              position: "relative",
            }}
          >
            <CardHeader
              icon={
                <IconBadge
                  gradient="linear-gradient(144deg, #67A429 0%, #AEE576 100%)"
                  borderColor="#67A429"
                >
                  {/* Chart icon */}
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none">
                    <path
                      d="M1 16L7 8l4 4 7-11"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </IconBadge>
              }
              title="Team performance"
              subtitle="Spot overload, track completion rates, and understand how the team is working."
            />
            {/* Dashboard preview */}
            <div
              style={{
                margin: "0 30px",
                borderRadius: 20,
                backgroundColor: "#fff",
                boxShadow: "0px 5px 20px rgba(10, 11, 11, 0.1)",
                height: 158,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                  padding: 20,
                  width: "100%",
                }}
              >
                {[
                  { label: "Active", value: "24", color: "#67A429" },
                  { label: "Completed", value: "156", color: "#3784B4" },
                  { label: "Overdue", value: "3", color: "#F25B5D" },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: stat.color,
                        lineHeight: "36px",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: C.textSecondary,
                        marginTop: 4,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Team members scrolling strip */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 50,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 9.4,
                  padding: "0 30px",
                  width: "max-content",
                }}
              >
                <TeamPill name="Mike Johnson" tasks="8 Tasks" percent="60%" avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" />
                <TeamPill name="Grace Thompson" tasks="10 Tasks" percent="79%" avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" />
                <TeamPill name="Alex Chen" tasks="12 Tasks" percent="92%" avatarUrl="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face" />
                <TeamPill name="Sarah Kim" tasks="6 Tasks" percent="45%" avatarUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" />
              </div>
            </div>
          </div>

          {/* ── Card 04: Revenue Tracking (bottom-right) ── */}
          <div
            style={{
              gridColumn: "2 / 3",
              backgroundColor: C.cardBg,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              minHeight: 440,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              icon={
                <IconBadge
                  gradient="linear-gradient(144deg, #FA8837 0%, #FAAC75 100%)"
                  borderColor="#FA8837"
                >
                  {/* Dollar icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#fff" strokeWidth="1.5" />
                    <path d="M10 5v10M7.5 8.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-.9 1.5-2.5 2-2.5 1-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </IconBadge>
              }
              title="Revenue tracking"
              subtitle="See invoices, payments, and monthly totals in one clean dashboard."
            />
            {/* Revenue chart area */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "0 30px 30px",
                gap: 30,
              }}
            >
              {/* Left fade panel */}
              <div
                style={{
                  width: 102,
                  alignSelf: "stretch",
                  background: "rgba(10, 11, 11, 0.03)",
                  borderRadius: 20,
                  flexShrink: 0,
                }}
              />

              {/* Center chart panel */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: C.pillBg,
                  borderRadius: 20,
                  boxShadow: "0px 5px 20px rgba(10, 11, 11, 0.1)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17.4,
                      fontWeight: 600,
                      lineHeight: "22px",
                      color: C.textPrimary,
                    }}
                  >
                    Total Revenue
                  </span>
                  <span
                    style={{
                      fontSize: 20.5,
                      fontWeight: 600,
                      lineHeight: "31px",
                      color: C.textPrimary,
                    }}
                  >
                    $142,592
                  </span>
                </div>
                {/* Chart */}
                <RevenueChart />
              </div>

              {/* Right fade panel */}
              <div
                style={{
                  width: 102,
                  alignSelf: "stretch",
                  background: "rgba(10, 11, 11, 0.03)",
                  borderRadius: 20,
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
