import { useState } from 'react'
import Button from '../../components/Button.jsx'

const CarbsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="3.5" r="1.8" fill="#9CA3AF" />
    <circle cx="4"  cy="8"   r="1.8" fill="#9CA3AF" />
    <circle cx="18" cy="8"   r="1.8" fill="#9CA3AF" />
    <circle cx="4"  cy="15"  r="1.8" fill="#9CA3AF" />
    <circle cx="18" cy="15"  r="1.8" fill="#9CA3AF" />
    <circle cx="11" cy="18.5" r="1.8" fill="#9CA3AF" />
    <circle cx="11" cy="11"  r="1.4" fill="#9CA3AF" />
  </svg>
)

const ProteinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M5 19C5 19 5 13 9 10C13 7 15 3 15 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 3C17 3 17 9 13 12C9 15 7 19 7 19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const FatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2C11 2 4 9 4 14.5a7 7 0 0014 0C18 9 11 2 11 2z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 13.5v3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 13.5v3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const NUTRITION_ROWS = [
  { key: 'carbs',   Icon: CarbsIcon,   label: '탄수화물', sub: 'CARBS' },
  { key: 'protein', Icon: ProteinIcon, label: '단백질',   sub: 'PROTEIN' },
  { key: 'fat',     Icon: FatIcon,     label: '지방',     sub: 'FAT' },
]

export default function ReportModal({ onClose }) {
  const [form, setForm] = useState({ storeName: '', menuName: '', carbs: '', protein: '', fat: '' })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <>
      <div className="fixed inset-0 z-modal bg-black/40" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-modal bg-white rounded-t-3xl max-h-[92dvh] overflow-y-auto">
        <div className="px-6 pt-7 pb-10 flex flex-col gap-6">

          {/* 타이틀 */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[28px] font-bold text-gray-800 leading-tight">정보 제보하기</h2>
            <p className="text-sm text-gray-500 leading-snug">
              임상 큐레이터를 위해 정확한 식품 정보를 공유해 주세요.
            </p>
          </div>

          {/* 매장명 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              매장명 <span className="font-normal text-gray-400">(STORE NAME)</span>
            </label>
            <input
              type="text"
              placeholder="예: 샐러디 강남점"
              value={form.storeName}
              onChange={set('storeName')}
              className="w-full h-[58px] px-5 rounded-2xl bg-surface-container-low text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* 메뉴명 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              메뉴명 <span className="font-normal text-gray-400">(MENU NAME)</span>
            </label>
            <input
              type="text"
              placeholder="예: 칠리 베이컨 윔볼"
              value={form.menuName}
              onChange={set('menuName')}
              className="w-full h-[58px] px-5 rounded-2xl bg-surface-container-low text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* 영양성분 정보 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              영양성분 정보 <span className="font-normal text-gray-400">(NUTRITIONAL INFO)</span>
            </label>
            <div className="flex flex-col gap-2">
              {NUTRITION_ROWS.map(({ key, Icon, label, sub }) => (
                <div key={key} className="h-[62px] px-4 rounded-2xl bg-surface-container-low flex items-center gap-3">
                  <Icon />
                  <span className="flex-1 text-xs text-gray-500">
                    {label} <span className="text-gray-400">({sub})</span>
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form[key]}
                    onChange={set(key)}
                    className="w-14 text-right text-[26px] font-light text-gray-700 bg-transparent outline-none"
                  />
                  <span className="text-base font-medium text-gray-500">g</span>
                </div>
              ))}
            </div>
          </div>

          {/* 안내 박스 */}
          <div className="rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 px-4 py-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              이미지나 영수증을 함께 첨부하면 검수 과정이 더욱 빨라집니다.
              지속적인 허위 제보 시 서비스 이용이 제한될 수 있습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button variant="sheet-cancel" onClick={onClose}>취소</Button>
            <Button variant="sheet-confirm" onClick={onClose}>제보하기</Button>
          </div>
        </div>
      </div>
    </>
  )
}
