import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useThemeStore } from '../../stores/theme-store'

interface AccessModalProps {
  isOpen: boolean
  onClose: () => void
  // onSuccess: () => void
  // webcamRef: React.RefObject<Webcam | null>
}

export const AccessModal = ({ isOpen, onClose }: AccessModalProps) => {
  const { isDark } = useThemeStore()

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative z-10 w-full max-w-md rounded-3xl border p-6 shadow-2xl backdrop-blur ${
            isDark ? 'border-slate-800 bg-slate-900/95' : 'border-zinc-200 bg-white/95'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              출입 기록
            </h2>
            <button
              onClick={onClose}
              className={`rounded-lg p-2 transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-zinc-100'
              }`}
            >
              <X size={20} className={isDark ? 'text-slate-400' : 'text-zinc-600'} />
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}
