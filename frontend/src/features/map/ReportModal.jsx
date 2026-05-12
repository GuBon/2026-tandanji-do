import { useState } from 'react'
import Button from '../../components/Button.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { useReport } from './useReport.js'
import { useKakaoPlaceSearch } from './useKakaoPlaceSearch.js'
import useMapStore from '../../store/useMapStore.js'

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
  const { form, setField, setPlace, clearPlaceDetails, clearPlace, loading, error, submit } = useReport({ onSuccess: onClose })
  const latLon = useMapStore(s => s.latLon)
  const { query, setQuery, results, searching, searchError, clearResults } = useKakaoPlaceSearch(latLon)
  const [imageUrl, setImageUrl] = useState(null)

  const handleStoreInput = (e) => {
    setField('storeName')(e)
    clearPlaceDetails()
    setQuery(e.target.value)
  }

  const handleSelectPlace = (place) => {
    setPlace(place)
    clearResults()
    setQuery('')
  }

  const handleClearPlace = () => {
    clearPlace()
    clearResults()
    setQuery('')
  }

  const showDropdown = !form.storeAddress && (searching || results.length > 0 || !!searchError)

  return (
    <BottomSheet onClose={onClose} defaultExpanded>
      <div className="flex-1 overflow-y-auto px-6 pt-7 pb-10 flex flex-col gap-6">

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[28px] font-bold text-gray-800 leading-tight">정보 제보하기</h2>
          <p className="text-sm text-gray-500 leading-snug">
            임상 큐레이터를 위해 정확한 식품 정보를 공유해 주세요.
          </p>
        </div>

        {/* 매장명 검색 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800">
            매장명 <span className="font-normal text-gray-400">(STORE NAME)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="매장명으로 검색..."
              value={form.storeName}
              onChange={handleStoreInput}
              className="w-full h-[58px] px-5 pr-12 rounded-2xl bg-surface-container-low text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {form.storeName && (
              <button
                type="button"
                onClick={handleClearPlace}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs leading-none"
                aria-label="초기화"
              >
                ✕
              </button>
            )}
          </div>

          {showDropdown && (
            <ul className="rounded-2xl border border-gray-100 bg-white shadow-md max-h-[220px] overflow-y-auto">
              {searching && results.length === 0 && !searchError && (
                <li className="px-4 py-3 text-sm text-gray-400">검색 중...</li>
              )}
              {searchError && (
                <li className="px-4 py-3 text-sm text-red-500">{searchError}</li>
              )}
              {results.map((r) => (
                <li
                  key={r.id}
                  onClick={() => handleSelectPlace(r)}
                  className="px-4 py-3 border-b border-gray-50 last:border-b-0 cursor-pointer active:bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-800">{r.placeName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.address}</div>
                </li>
              ))}
            </ul>
          )}

          {form.storeAddress && (
            <div className="flex items-start gap-2 px-4 py-2.5 rounded-xl bg-emerald-50">
              <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C4.79 1 3 2.79 3 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" fill="#10b981" />
                <circle cx="7" cy="5" r="1.5" fill="white" />
              </svg>
              <span className="text-xs text-emerald-700 leading-relaxed">{form.storeAddress}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800">
            메뉴명 <span className="font-normal text-gray-400">(MENU NAME)</span>
          </label>
          <input
            type="text"
            placeholder="예: 칠리 베이컨 윔볼"
            value={form.menuName}
            onChange={setField('menuName')}
            className="w-full h-[58px] px-5 rounded-2xl bg-surface-container-low text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

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
                  onChange={setField(key)}
                  className="w-14 text-right text-[26px] font-light text-gray-700 bg-transparent outline-none"
                />
                <span className="text-base font-medium text-gray-500">g</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-800">
            이미지 첨부 <span className="font-normal text-gray-400">(선택)</span>
          </label>
          <ImageUploader domain="reports" onChange={setImageUrl} aspectRatio="16/9" />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <p className="text-xs text-gray-400 leading-relaxed">
          이미지를 함께 첨부하면 검수 과정이 더욱 빨라집니다.
          지속적인 허위 제보 시 서비스 이용이 제한될 수 있습니다.
        </p>

        <div className="flex gap-3">
          <Button variant="sheet-cancel" onClick={onClose} disabled={loading}>취소</Button>
          <Button variant="sheet-confirm" onClick={() => submit(imageUrl)} disabled={loading}>
            {loading ? '제보 중...' : '제보하기'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
