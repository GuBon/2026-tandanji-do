const variants = {
  gradient:
    'bg-gradient-to-b from-[#1b6d24] to-[#076419] text-white text-sm font-semibold rounded-full px-4 py-2 hover:opacity-90 active:opacity-80 transition-opacity',
  filter:
    'bg-white text-gray-600 text-xs font-medium rounded-xl px-3 h-8 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm',
  'filter-active':
    'bg-[#1b6d24] text-white text-xs font-semibold rounded-xl px-3 h-8 shadow-sm',
  icon: 'flex items-center justify-center bg-transparent hover:opacity-70 transition-opacity',
  'sheet-cancel':
    'flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-2xl transition-colors',
  'sheet-confirm':
    'flex-1 h-14 bg-[#1b6d24] hover:bg-[#145a1e] text-white font-semibold rounded-2xl transition-colors',
}

export default function Button({ variant = 'gradient', className = '', children, ...props }) {
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
