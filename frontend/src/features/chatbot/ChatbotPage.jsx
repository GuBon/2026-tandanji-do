import PageLayout from '../../components/PageLayout.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChatbotPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: '안녕하세요! 식단 관련 무엇이든 물어보세요 🥗' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: input }])
    setInput('')
  }

  return (
    <PageLayout
      header={{ title: 'AI 식단 도우미', left: <button onClick={() => navigate(-1)} className="text-gray-600 text-xl">←</button> }}
      className="flex flex-col"
    >
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ' +
              (msg.role === 'user'
                ? 'self-end bg-emerald-500 text-white rounded-br-sm'
                : 'self-start bg-white text-gray-700 shadow-sm rounded-bl-sm')
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="mx-5 mb-4 h-[58px] bg-white rounded-2xl shadow-lg flex items-center px-4 gap-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="메시지를 입력하세요"
          className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
        />
        <button
          onClick={send}
          className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm flex items-center justify-center transition-colors"
        >
          ↑
        </button>
      </div>
    </PageLayout>
  )
}
