import { useState, useRef, useCallback } from 'react'
import { uploadImage } from '../api/imageApi.js'

const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

/**
 * 이미지 업로드 공통 컴포넌트
 *
 * Props:
 *   domain      — ImageService 허용 도메인 ('diet' | 'posts' | 'reports' | ...)
 *   onChange    — 업로드 완료/제거 시 호출: (imageUrl: string | null) => void
 *   aspectRatio — CSS aspect-ratio 값 (기본 '4/3')
 *   className   — 루트 div 추가 클래스
 *
 * 동작:
 *   1. 탭 → 파일 피커 열기
 *   2. 파일 선택 즉시 미리보기(ObjectURL) 표시
 *   3. 백그라운드로 업로드 → 완료 시 onChange(imageUrl) 호출
 *   4. 업로드 중 스피너 오버레이
 *   5. ✕ 버튼으로 이미지 제거 → onChange(null) 호출
 */
export default function ImageUploader({ domain, onChange, onFile, aspectRatio = '4/3', className = '' }) {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const fixed = !!aspectRatio

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError(null)
    setPreview(URL.createObjectURL(file))
    onFile?.(file)
    setUploading(true)
    try {
      const url = await uploadImage(file, domain)
      onChange?.(url)
    } catch {
      setError('이미지 업로드에 실패했습니다.')
      setPreview(null)
      onFile?.(null)
      onChange?.(null)
    } finally {
      setUploading(false)
    }
  }, [domain, onChange, onFile])

  const handleRemove = useCallback((e) => {
    e.stopPropagation()
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onChange?.(null)
    onFile?.(null)
  }, [onChange, onFile])

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div
        role="button"
        tabIndex={uploading ? -1 : 0}
        onClick={uploading ? undefined : () => inputRef.current?.click()}
        onKeyDown={(e) => { if (!uploading && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click() }}
        className={`relative w-full bg-surface-container-low rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden transition-colors hover:border-primary/40 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        style={fixed ? { aspectRatio } : undefined}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="업로드 이미지"
              className={fixed ? 'w-full h-full object-cover' : 'w-full h-auto block'}
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center gap-2 ${fixed ? 'py-10' : 'py-6'}`}>
            <div className="relative">
              <CameraIcon />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-[11px] font-bold leading-none">+</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">사진을 추가하려면 탭하세요</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5 px-1">{error}</p>
      )}
    </div>
  )
}
