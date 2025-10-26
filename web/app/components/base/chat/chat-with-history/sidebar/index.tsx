import { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  RiEditBoxLine,
  RiExpandRightLine,
  RiLayoutLeft2Line,
  RiHome2Line, // آیکون خانه جدید اضافه شد
} from "@remixicon/react";
import { useChatWithHistoryContext } from "../context";
import AppIcon from "@/app/components/base/app-icon";
import ActionButton from "@/app/components/base/action-button";
import Button from "@/app/components/base/button";
import List from "@/app/components/base/chat/chat-with-history/sidebar/list";
import MenuDropdown from "@/app/components/share/text-generation/menu-dropdown";
import Confirm from "@/app/components/base/confirm";
import RenameModal from "@/app/components/base/chat/chat-with-history/sidebar/rename-modal";
import type { ConversationItem } from "@/models/share";
import cn from "@/utils/classnames";
import { useGlobalPublicStore } from "@/context/global-public-context";
import DifyLogo from "@/app/components/base/icons/dify-logo";

// =========================================================
// کامپوننت TypewriterText (پیاده سازی افکت تایپ)
// =========================================================
const TypewriterText = ({ text, delay = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // زمانی که تایپ کردن تمام شد، تابع onComplete را صدا می‌زنیم
      if (onComplete) onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  // نمایش متن با استایل مناسب برای متن آغازین
  return (
    <span className="text-2xl font-semibold text-gray-800">
      {displayedText}
      {/* نمایش کرسر چشمک‌زن */}
      <span className="animate-pulse inline-block w-1 bg-gray-700 h-6 ml-0.5"></span>
    </span>
  );
};

// =========================================================
// کامپوننت ۱: ChatPage (مدیریت لودینگ و لوگوموشن)
// =========================================================
const CHAT_GREETING = "به چت بات موازی خوش آمدید!";
const CHAT_PROMPT = "لطفا سوالات خود را مطرح بفرمایید.";

const ChatPage = ({ appData }) => {
  // این منطق لودینگ باید پس از اعمال تغییرات در Loading/index.tsx حذف شود
  const [isLoading, setIsLoading] = useState(false);
  const [isGreetingDone, setIsGreetingDone] = useState(false);
  const [isPromptDone, setIsPromptDone] = useState(false);

  // توجه: این منطق isLoading به درخواست کاربر حذف نشده و باید در فایل اصلی (یا پس از Refactoring) حذف گردد.
  // if (isLoading) {
  //   return (
  //   //   <div className="flex items-center justify-center w-full h-full min-h-screen bg-white">
  //   //     <video
  //   //       src="/logo/logomotion.mp4"
  //   //       alt="Loading SharpDima"
  //   //       className="w-40 h-40 rounded-lg shadow-xl"
  //   //       autoPlay
  //   //       loop
  //   //       muted
  //   //       playsInline
  //   //     />
  //   //   </div>
  //   // );
  // }

  // پس از لودینگ، افکت تایپ را نمایش می‌دهیم.
  return (
    <div className="full-chat-layout flex flex-col items-center justify-center pt-20">
      <div className="text-center space-y-4">
        {/* خط اول: خوش آمد گویی */}
        <TypewriterText
          text={CHAT_GREETING}
          delay={70}
          onComplete={() => setIsGreetingDone(true)}
        />

        {/* خط دوم: اعلان سوالات (فقط پس از اتمام خط اول) */}
        {isGreetingDone && (
          <TypewriterText
            text={CHAT_PROMPT}
            delay={50}
            onComplete={() => setIsPromptDone(true)}
          />
        )}
      </div>

      {/* توجه: این بخش فقط پیام خوش آمدگویی تایپ شده را نمایش می‌دهد.
        باید مطمئن شوید که سایر اجزای UI چت (مثل Input Box و مکالمات قبلی) 
        در جای اصلی خود رندر شوند و این کامپوننت فقط به عنوان یک لایه خوش آمدگویی موقت یا 
        بخشی از صفحه اصلی چت در حال اجرا باشد.
      */}

      {/* اگر تایپ تمام شد، می‌توانید محتوای اصلی صفحه چت را نمایش دهید */}
      {/* این یک پیاده سازی ساده است، ممکن است نیاز به Refactoring در فایل اصلی داشته باشد */}
    </div>
  );
};

type Props = {
  isPanel?: boolean;
};

// =========================================================
// کامپوننت ۲: Sidebar (شامل دکمه Mowazi)
// =========================================================
const Sidebar = ({ isPanel }: Props) => {
  const { t } = useTranslation();
  const {
    isInstalledApp,
    appData,
    handleNewConversation,
    pinnedConversationList,
    conversationList,
    currentConversationId,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    conversationRenaming,
    handleRenameConversation,
    handleDeleteConversation,
    sidebarCollapseState,
    handleSidebarCollapse,
    isMobile,
    isResponding,
  } = useChatWithHistoryContext();
  const isSidebarCollapsed = sidebarCollapseState;
  const systemFeatures = useGlobalPublicStore((s) => s.systemFeatures);
  const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null);
  const [showRename, setShowRename] = useState<ConversationItem | null>(null);

  const handleOperate = useCallback(
    (type: string, item: ConversationItem) => {
      if (type === "pin") handlePinConversation(item.id);

      if (type === "unpin") handleUnpinConversation(item.id);

      if (type === "delete") setShowConfirm(item);

      if (type === "rename") setShowRename(item);
    },
    [handlePinConversation, handleUnpinConversation]
  );
  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(null);
  }, []);
  const handleDelete = useCallback(() => {
    if (showConfirm)
      handleDeleteConversation(showConfirm.id, {
        onSuccess: handleCancelConfirm,
      });
  }, [showConfirm, handleDeleteConversation, handleCancelConfirm]);
  const handleCancelRename = useCallback(() => {
    setShowRename(null);
  }, []);
  const handleRename = useCallback(
    (newName: string) => {
      if (showRename)
        handleRenameConversation(showRename.id, newName, {
          onSuccess: handleCancelRename,
        });
    },
    [showRename, handleRenameConversation, handleCancelRename]
  );

  // تعریف هندلر برای دکمه موازی
  const handleGoToMowazi = () => {
    window.open("https://mowazi.ir/", "_blank");
  };

  return (
    <div
      className={cn(
        "flex w-full grow flex-col",
        isPanel &&
          "rounded-xl border-[0.5px] border-components-panel-border-subtle bg-components-panel-bg shadow-lg"
      )}
    >
      <div className={cn("flex shrink-0 items-center gap-3 p-3 pr-2")}>
        <div className="shrink-0">
          <AppIcon
            size="large"
            iconType={appData?.site.icon_type}
            icon={appData?.site.icon}
            background={appData?.site.icon_background}
            imageUrl={appData?.site.icon_url}
          />
        </div>
        <div
          className={cn("system-md-semibold grow truncate text-text-secondary")}
        >
          {appData?.site.title}
        </div>
        {!isMobile && isSidebarCollapsed && (
          <ActionButton size="l" onClick={() => handleSidebarCollapse(false)}>
            <RiExpandRightLine className="h-[18px] w-[18px]" />
          </ActionButton>
        )}
        {!isMobile && !isSidebarCollapsed && (
          <ActionButton size="l" onClick={() => handleSidebarCollapse(true)}>
            <RiLayoutLeft2Line className="h-[18px] w-[18px]" />
          </ActionButton>
        )}
      </div>
      <div className="shrink-0 px-3 py-4 space-y-2">
        {/* دکمه "وب‌سایت موازی" - اعمال رنگ پس زمینه سفارشی */}
        {/* از استایل اینلاین برای اعمال کد رنگ هگزادسیمال استفاده شده است */}
        <Button
          variant="secondary"
          className="w-full justify-center text-white"
          style={{ backgroundColor: "#03b5ff", borderColor: "#03b5ff" }}
          onClick={handleGoToMowazi}
        >
          <RiHome2Line className="mr-1 h-4 w-4" />
          وب‌ سایت موازی
        </Button>

        {/* دکمه چت جدید - اعمال رنگ متن، آیکون و حاشیه سفارشی */}
        <Button
          variant="secondary" // تغییر variant به secondary برای کنترل استایل بهتر
          disabled={isResponding}
          // استفاده از text-[#03b5ff] برای رنگ متن و آیکون
          // و استفاده از hover:bg-[#03b5ff] برای جلوه بصری hover
          className="w-full justify-center border-[#03b5ff] text-[#03b5ff] hover:bg-[#03b5ff] hover:text-white"
          onClick={handleNewConversation}
        >
          <RiEditBoxLine className="mr-1 h-4 w-4" />
          {t("share.chat.newChat")}
        </Button>
      </div>
      <div className="h-0 grow space-y-2 overflow-y-auto px-3 pt-4">
        {/* pinned list */}
        {!!pinnedConversationList.length && (
          <div className="mb-4">
            <List
              isPin
              title={t("share.chat.pinnedTitle") || ""}
              list={pinnedConversationList}
              onChangeConversation={handleChangeConversation}
              onOperate={handleOperate}
              currentConversationId={currentConversationId}
            />
          </div>
        )}
        {!!conversationList.length && (
          <List
            title={
              (pinnedConversationList.length &&
                t("share.chat.unpinnedTitle")) ||
              ""
            }
            list={conversationList}
            onChangeConversation={handleChangeConversation}
            onOperate={handleOperate}
            currentConversationId={currentConversationId}
          />
        )}
      </div>
      <div className="flex shrink-0 items-center justify-between p-3">
        <MenuDropdown
          hideLogout={isInstalledApp}
          placement="top-start"
          data={appData?.site}
        />

        <div className="shrink-0">
          {!appData?.custom_config?.remove_webapp_brand && (
            <div className={cn("flex shrink-0 items-center gap-1.5 px-1")}>
              <div className="system-2xs-medium-uppercase text-text-tertiary">
                {t("share.chat.poweredBy")}
              </div>
              <a
                href="https://sharpdima.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {systemFeatures.branding.enabled &&
                systemFeatures.branding.workspace_logo ? (
                  <img
                    src={systemFeatures.branding.workspace_logo}
                    alt="logo"
                    className="block h-5 w-auto"
                  />
                ) : appData?.custom_config?.replace_webapp_logo ? (
                  <img
                    src={`${appData?.custom_config?.replace_webapp_logo}`}
                    alt="logo"
                    className="block h-5 w-auto"
                  />
                ) : (
                  <img
                    src="/logo/screenshot.png"
                    alt="SharpDima Logo"
                    className="block h-5 w-auto"
                  />
                )}
              </a>
            </div>
          )}
        </div>

        {!!showConfirm && (
          <Confirm
            title={t("share.chat.deleteConversation.title")}
            content={t("share.chat.deleteConversation.content") || ""}
            isShow
            onCancel={handleCancelConfirm}
            onConfirm={handleDelete}
          />
        )}
        {showRename && (
          <RenameModal
            isShow
            onClose={handleCancelRename}
            saveLoading={conversationRenaming}
            name={showRename?.name || ""}
            onSave={handleRename}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
