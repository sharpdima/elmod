import type { FC } from 'react'
import React from 'react'

type Props = {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode | string;
}

const Spinner: FC<Props> = ({ loading = false, children, className }) => {
  // اگر loading (بارگذاری) فعال نباشد، چیزی نمایش داده نمی‌شود.
  if (!loading)
    return null

  // آدرس تصویر متحرک (GIF) خود را اینجا قرار دهید.
  // مطمئن شوید که این تصویر در مسیر درست قرار دارد و متحرک است (مثل یک فایل GIF).
  const customImageUrl = '/images/loading sign.gif'

  return (
    // از یک تگ <img> برای نمایش تصویر استفاده می‌کنیم
    <img
      src={customImageUrl}
      alt="Loading..."
      // کلاس‌های h-4 w-4 تصویر را به اندازه اسپینر اصلی تنظیم می‌کنند
      // کلاس‌های دیگر (مثل block) برای اطمینان از نمایش صحیح اضافه می‌شوند
      className={`block h-4 w-4 ${className ?? ''}`}
      role="status"
    >
      {/* در صورت نیاز، children (مثلاً متن Loading) همچنان می‌تواند اینجا رندر شود */}
      {children}
    </img>
  )
}

export default Spinner
