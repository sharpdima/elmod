"use client";

import React, { useState, useEffect } from "react";
import "./style.css";

type ILoadingProps = {
  type?: "area" | "app";
};

const Loading = ({ type = "area" }: ILoadingProps = { type: "area" }) => {
  const [showForced, setShowForced] = useState(true);

  // نیازی به مدیریت scale نیست، اما opacity برای انیمیشن محو شدن لازم است
  const [logoState, setLogoState] = useState({
    opacity: "opacity-100",
  });

  useEffect(() => {
    // تنظیم opacity به 100% بلافاصله (اگرچه در این حالت اولیه 100 است)
    setLogoState({ opacity: "opacity-100" });

    // ایجاد یک تایمر 5 ثانیه‌ای برای تأخیر اجباری کلی (5000 میلی‌ثانیه)
    // این زمان فرصت کافی برای پخش و نمایش ویدئو را می‌دهد.
    const timer = setTimeout(() => {
      setShowForced(false);
    }, 5000); // تغییر از 2000 به 5000 میلی ثانیه

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (type === "app" && showForced) {
    return (
      // زمینه کل صفحه مشکی است
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 min-h-screen">
        <div className="flex flex-col items-center justify-center w-full h-full max-w-sm">
          <video
            src="/logo/sharp.mp4"
            autoPlay
            loop
            muted // ضروری برای پخش خودکار در مرورگرها
            playsInline // توصیه شده برای موبایل
            // تنظیمات ظاهری: حفظ نسبت تصویر و تنظیم محو شدن
            className={`
                w-full h-auto max-w-xs object-contain
                transition-opacity duration-500 ease-out 
                ${logoState.opacity}
              `}
          />
        </div>
      </div>
    );
  }

  // نمایش لودینگ کوچک (برای type=area)
  return (
    <div
      className={`flex w-full items-center justify-center ${
        type === "app" ? "h-full" : ""
      }`}
    >
      <img
        src="/logo/screenshot.png"
        alt="Loading SharpDima"
        className="w-12 h-12 rounded-lg animate-bounce border-2 border-gray-300 shadow-lg"
      />
    </div>
  );
};

export default Loading;
