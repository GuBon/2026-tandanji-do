export default function FAB({ onClick, icon = '+', className = '' }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-14 h-14 rounded-2xl bg-primary-dim text-on-primary ' +
        'text-3xl font-bold shadow-xl flex items-center justify-center ' +
        'transition-transform active:scale-95 ' +
        className
      }
    >
      {icon}
    </button>
  )
}
