import React from 'react'
import { motion } from 'framer-motion'

const PrivacyNotice = () => {
  return (
    <motion.div
      className="flex justify-center mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="bg-gray-500/70 backdrop-blur-sm rounded-lg px-4 py-2 max-w-sm">
        <p className="text-white text-xs text-center leading-relaxed">
          我们的所有谈话内容都将是严格保密的。没有你的书面同意，我不会向任何人透露你在这里谈到的任何信息。这是我的法律义务，请你放心。
        </p>
      </div>
    </motion.div>
  )
}

export default PrivacyNotice