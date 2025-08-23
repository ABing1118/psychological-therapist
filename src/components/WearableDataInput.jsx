import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Activity, Moon, Thermometer, X, Check } from 'lucide-react'

const WearableDataInput = ({ onSubmit, onClose }) => {
  const [wearableData, setWearableData] = useState({
    heartRate: '',
    bloodPressureHigh: '',
    bloodPressureLow: '',
    sleepHours: '',
    sleepQuality: '',
    temperature: '',
    stepsCount: '',
    hasData: false // 是否有穿戴设备数据
  })

  const [showForm, setShowForm] = useState(false)

  const handleDataAvailability = (hasData) => {
    setWearableData(prev => ({ ...prev, hasData }))
    if (hasData) {
      setShowForm(true)
    } else {
      // 用户没有穿戴设备数据，直接提交空数据
      onSubmit({ hasData: false })
    }
  }

  const handleInputChange = (field, value) => {
    setWearableData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    onSubmit(wearableData)
  }

  const sleepQualityOptions = [
    { value: 'excellent', label: '非常好' },
    { value: 'good', label: '好' },
    { value: 'fair', label: '一般' },
    { value: 'poor', label: '差' },
    { value: 'very_poor', label: '很差' }
  ]

  if (!showForm) {
    // 询问是否有穿戴设备数据
    return (
      <motion.div
        className="p-6 space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-500" />
            健康数据收集
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-2">
                为了更好地了解你的健康状况
              </p>
              <p className="text-xs text-blue-600 leading-relaxed">
                我们想收集一些你的健康数据（如心率、睡眠等），这将帮助我们提供更精准的建议。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            你是否有智能手表、手环等穿戴设备，或最近测量过相关健康数据？
          </p>
          
          <div className="space-y-2">
            <motion.button
              onClick={() => handleDataAvailability(true)}
              className="w-full p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl text-left transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-800">是的，我有数据</p>
                  <p className="text-xs text-primary-600">我可以提供一些健康数据</p>
                </div>
              </div>
            </motion.button>
            
            <motion.button
              onClick={() => handleDataAvailability(false)}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">没有相关数据</p>
                  <p className="text-xs text-gray-500">跳过此步骤，继续对话</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  // 显示数据输入表单
  return (
    <motion.div
      className="p-6 space-y-4 max-h-full overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-500" />
          输入健康数据
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* 心率数据 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-4 h-4 text-red-500" />
            <label className="text-sm font-medium text-red-800">心率 (BPM)</label>
          </div>
          <input
            type="number"
            placeholder="如：72"
            value={wearableData.heartRate}
            onChange={(e) => handleInputChange('heartRate', e.target.value)}
            className="w-full p-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
          />
        </div>

        {/* 血压数据 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-4 h-4 text-orange-500" />
            <label className="text-sm font-medium text-orange-800">血压 (mmHg)</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="高压 如：120"
              value={wearableData.bloodPressureHigh}
              onChange={(e) => handleInputChange('bloodPressureHigh', e.target.value)}
              className="p-2 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
            <input
              type="number"
              placeholder="低压 如：80"
              value={wearableData.bloodPressureLow}
              onChange={(e) => handleInputChange('bloodPressureLow', e.target.value)}
              className="p-2 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>
        </div>

        {/* 睡眠数据 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Moon className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-medium text-blue-800">睡眠</label>
          </div>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="睡眠时长 (小时) 如：7.5"
              step="0.5"
              value={wearableData.sleepHours}
              onChange={(e) => handleInputChange('sleepHours', e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            <select
              value={wearableData.sleepQuality}
              onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="">选择睡眠质量</option>
              {sleepQualityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 体温和步数 */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Thermometer className="w-4 h-4 text-green-500" />
              <label className="text-sm font-medium text-green-800">体温 (°C)</label>
            </div>
            <input
              type="number"
              step="0.1"
              placeholder="如：36.5"
              value={wearableData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              className="w-full p-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
            />
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-purple-500" />
              <label className="text-sm font-medium text-purple-800">今日步数</label>
            </div>
            <input
              type="number"
              placeholder="如：8000"
              value={wearableData.stepsCount}
              onChange={(e) => handleInputChange('stepsCount', e.target.value)}
              className="w-full p-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="pt-4 space-y-2">
        <motion.button
          onClick={handleSubmit}
          className="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          提交健康数据
        </motion.button>
        
        <p className="text-xs text-gray-500 text-center">
          数据仅用于提供更准确的健康建议，严格保密
        </p>
      </div>
    </motion.div>
  )
}

export default WearableDataInput