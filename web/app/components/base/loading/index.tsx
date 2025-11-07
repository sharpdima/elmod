import React from 'react'
import './style.css'

type ILoadingProps = {
  type?: 'area' | 'app';
}

const Loading = ({ type = 'area' }: ILoadingProps) => {
  return (
    // قدم ۱: اضافه کردن کلاس‌های bg-black و flex-col
    <div className="flex h-full w-full flex-col items-center justify-center bg-black">
      {/* لوگوی GIF شما بدون تغییر باقی می‌ماند */}
      <img
        src="/logo/g0R9.gif"
        alt="Loading Mowazi"
        className="h-24 w-24" // می‌توانید این اندازه را به دلخواه تغییر دهید
      />

      {/* قدم ۲: اضافه کردن متن در زیر لوگو */}
      <p className="font-vazirmatn mt-6 text-xl font-semibold text-white">
        Mowazi Inteligent Research Assistant{' '}
      </p>
    </div>
  )
}

export default Loading
