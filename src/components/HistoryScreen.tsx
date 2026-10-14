import React, { useState } from 'react';
import { ChildProfile, DoseLog, DayAdherence } from '../types';

interface HistoryScreenProps {
  childrenList: ChildProfile[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
  onOpenAddChild: () => void;
  logs: DoseLog[];
  weekDays: DayAdherence[];
  onToggleLogStatus?: (logId: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  onOpenAddChild,
  logs,
  weekDays,
  onToggleLogStatus,
}) => {
  const [timeRange, setTimeRange] = useState<'30days' | '3months' | 'year'>('30days');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5); // Index 5 is Saturday 17th
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [activeMenuLogId, setActiveMenuLogId] = useState<string | null>(null);

  // Filter logs by selected child (if not 'hamad' which acts as 'all' or hamad)
  const displayedLogs = logs.filter((log) => {
    if (selectedChildId === 'hamad') return true; // Acts as all or primary child
    return log.childId === selectedChildId;
  });

  const visibleLogs = showAllLogs ? displayedLogs : displayedLogs.slice(0, 5);

  // Group logs by dateLabel
  const groupedLogs: { [key: string]: DoseLog[] } = {};
  visibleLogs.forEach((log) => {
    if (!groupedLogs[log.dateLabel]) {
      groupedLogs[log.dateLabel] = [];
    }
    groupedLogs[log.dateLabel].push(log);
  });

  // Chart data based on selected time range
  const chartPoints = timeRange === '30days'
    ? [
        { label: 'الأسبوع 1', value: 85 },
        { label: 'الأسبوع 2', value: 91 },
        { label: 'الأسبوع 3', value: 87 },
        { label: 'الأسبوع 4', value: 95 },
      ]
    : timeRange === '3months'
    ? [
        { label: 'أغسطس', value: 88 },
        { label: 'سبتمبر', value: 94 },
        { label: 'أكتوبر', value: 92 },
      ]
    : [
        { label: 'الربع 1', value: 84 },
        { label: 'الربع 2', value: 89 },
        { label: 'الربع 3', value: 92 },
        { label: 'الربع 4', value: 96 },
      ];

  const overallRate = timeRange === '30days' ? '92%' : timeRange === '3months' ? '91%' : '90%';

  return (
    <div className="w-full max-w-7xl mx-auto px-5 pt-4 pb-28 flex flex-col gap-6 animate-fadeIn">
      {/* Header & Subtitle */}
      <section className="space-y-1">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111c2c]">
          السجل والالتزام
        </h1>
        <p className="text-[15px] text-[#424655]">
          مراجعة سجلات الأدوية والاتجاهات.
        </p>
      </section>

      {/* Profile Filter Tabs */}
      <section className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {childrenList.map((child) => {
          const isSelected = selectedChildId === child.id;
          return (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-[#0057cd] text-white'
                  : 'bg-white text-[#111c2c] hover:bg-[#e7eeff] border border-[#c2c6d8]/30'
              }`}
            >
              <img
                src={child.avatar}
                alt={child.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
              />
              <span className="text-[14px] font-bold">{child.name}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenAddChild}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#424655] hover:bg-[#e7eeff] border border-[#c2c6d8]/30 transition-all shrink-0 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="text-[14px] font-semibold">إضافة طفل</span>
        </button>
      </section>

      {/* Weekly Calendar Overview */}
      <section className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(13,110,253,0.06)] p-5 border border-[#e7eeff]">
        <h2 className="text-[20px] font-bold text-[#111c2c] mb-4">
          هذا الأسبوع
        </h2>

        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Day Headers */}
          {weekDays.map((d, idx) => (
            <div
              key={`header-${idx}`}
              className={`text-[12px] font-semibold py-1 ${
                idx === selectedDayIndex
                  ? 'text-[#0057cd] font-bold'
                  : 'text-[#727787]'
              }`}
            >
              {d.dayName}
            </div>
          ))}

          {/* Dates & Status Dots */}
          {weekDays.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <div
                key={`date-${idx}`}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0057cd] text-white shadow-sm'
                    : 'hover:bg-[#f0f3ff] text-[#111c2c]'
                }`}
              >
                <span className="text-[16px] font-bold">{day.dateNumber}</span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected
                      ? 'bg-white'
                      : day.status === 'taken'
                      ? 'bg-[#006a66]'
                      : day.status === 'missed'
                      ? 'bg-[#ba1a1a]'
                      : 'bg-transparent'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mt-4 pt-3 border-t border-[#c2c6d8]/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006a66]" />
            <span className="text-[13px] font-medium text-[#424655]">
              تم التناول
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
            <span className="text-[13px] font-medium text-[#424655]">
              فائتة
            </span>
          </div>
        </div>
      </section>

      {/* Adherence Chart */}
      <section className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(13,110,253,0.06)] p-5 border border-[#e7eeff]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-bold text-[#111c2c]">
            نسبة الالتزام
          </h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-[#f0f3ff] rounded-full px-3 py-1.5 text-[13px] font-semibold text-[#111c2c] border-none focus:ring-2 focus:ring-[#0057cd] cursor-pointer"
          >
            <option value="30days">آخر 30 يوم</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="year">هذا العام</option>
          </select>
        </div>

        {/* Custom SVG Trend Curve */}
        <div className="h-56 w-full relative pt-2 px-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 360 160">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#006a66" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#006a66" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            <line x1="40" y1="20" x2="350" y2="20" stroke="#f0f3ff" strokeDasharray="3 3" />
            <text x="30" y="24" fill="#727787" fontSize="10" textAnchor="end">100%</text>

            <line x1="40" y1="50" x2="350" y2="50" stroke="#f0f3ff" strokeDasharray="3 3" />
            <text x="30" y="54" fill="#727787" fontSize="10" textAnchor="end">90%</text>

            <line x1="40" y1="80" x2="350" y2="80" stroke="#f0f3ff" strokeDasharray="3 3" />
            <text x="30" y="84" fill="#727787" fontSize="10" textAnchor="end">80%</text>

            <line x1="40" y1="110" x2="350" y2="110" stroke="#f0f3ff" strokeDasharray="3 3" />
            <text x="30" y="114" fill="#727787" fontSize="10" textAnchor="end">70%</text>

            {/* Dynamic Curve path */}
            {(() => {
              // Map 4 points across the chart
              const xPositions = [60, 150, 240, 330];
              const points = chartPoints.map((p, i) => {
                const x = xPositions[i];
                // 100% = y:20, 50% = y:140 => y = 140 - ((val - 50)/50) * 120
                const y = 140 - ((p.value - 50) / 50) * 120;
                return { x, y, ...p };
              });

              // Create smooth path
              const dPath = `M ${points[0].x} ${points[0].y} ` +
                points.slice(1).map((pt, i) => {
                  const prev = points[i];
                  const cx = (prev.x + pt.x) / 2;
                  return `C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
                }).join(' ');

              const areaPath = `${dPath} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

              return (
                <>
                  <path d={areaPath} fill="url(#curveGradient)" />
                  <path
                    d={dPath}
                    fill="none"
                    stroke="#006a66"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#006a66"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text
                        x={pt.x}
                        y="155"
                        fill="#727787"
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {pt.label}
                      </text>
                      {/* Floating value pill */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        fill="#006a66"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {pt.value}%
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[32px] font-bold text-[#006a66]">
            {overallRate}
          </span>
          <p className="text-[14px] text-[#424655] font-medium">
            الالتزام العام ({timeRange === '30days' ? '30 يوم' : timeRange === '3months' ? '3 أشهر' : 'هذا العام'})
          </p>
        </div>
      </section>

      {/* Detailed Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#111c2c]">
            السجل التفصيلي
          </h2>
          <span className="text-xs text-[#727787]">
            اضغط على النقاط الثلاث لإجراء تعديل
          </span>
        </div>

        {Object.entries(groupedLogs).map(([dateLabel, groupItems]) => (
          <div key={dateLabel} className="space-y-2">
            <h3 className="text-[13px] font-semibold text-[#727787] px-2">
              {dateLabel}
            </h3>

            {groupItems.map((log) => {
              const isMissed = log.status === 'missed';
              return (
                <div
                  key={log.id}
                  className={`rounded-2xl p-4 flex items-center justify-between transition-all border ${
                    isMissed
                      ? 'bg-[#ffdad6]/25 border-[#ba1a1a]/30'
                      : 'bg-white border-[#e7eeff] shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isMissed
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : 'bg-[#84f5ee]/30 text-[#006a66]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        {isMissed ? 'error' : 'check_circle'}
                      </span>
                    </div>

                    <div>
                      <p className="text-[16px] font-bold text-[#111c2c]">
                        {log.medicationName}
                      </p>
                      <p
                        className={`text-[13px] mt-0.5 ${
                          isMissed ? 'text-[#ba1a1a] font-semibold' : 'text-[#727787]'
                        }`}
                      >
                        {log.timeString} • {isMissed ? 'فائتة' : 'تم التناول'}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuLogId(activeMenuLogId === log.id ? null : log.id)
                      }
                      className="p-2 text-[#727787] hover:bg-[#f0f3ff] rounded-full transition-colors"
                      title="خيارات الجرعة"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>

                    {activeMenuLogId === log.id && (
                      <div className="absolute left-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-[#c2c6d8]/30 py-1.5 z-20">
                        <button
                          onClick={() => {
                            if (onToggleLogStatus) onToggleLogStatus(log.id);
                            setActiveMenuLogId(null);
                          }}
                          className="w-full text-right px-3 py-2 text-xs font-semibold text-[#111c2c] hover:bg-[#f0f3ff] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isMissed ? 'check_circle' : 'cancel'}
                          </span>
                          <span>{isMissed ? 'تغيير إلى تم التناول' : 'تغيير إلى فائتة'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {!showAllLogs && displayedLogs.length > 5 && (
          <button
            onClick={() => setShowAllLogs(true)}
            className="w-full py-3 mt-1 text-[#0057cd] font-semibold text-[14px] hover:bg-[#e7eeff] rounded-full transition-colors border border-[#0057cd]/20"
          >
            تحميل المزيد من السجل ({displayedLogs.length - 5} جرعات إضافية)
          </button>
        )}
      </section>
    </div>
  );
};
