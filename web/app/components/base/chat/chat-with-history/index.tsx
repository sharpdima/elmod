'use client'
import type { FC } from 'react'
import { useEffect, useState } from 'react' // <--- ایمپورت‌های لازم
import { useAsyncEffect } from 'ahooks'
import { useThemeContext } from '../embedded-chatbot/theme/theme-context'
import { ChatWithHistoryContext, useChatWithHistoryContext } from './context'
import { useChatWithHistory } from './hooks'
import Sidebar from './sidebar'
import Header from './header'
import HeaderInMobile from './header-in-mobile'
import ChatWrapper from './chat-wrapper'
import type { InstalledApp } from '@/models/explore'
import Loading from '@/app/components/base/loading' // <--- ایمپورت لودینگ
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { checkOrSetAccessToken } from '@/app/components/share/utils'
import AppUnavailable from '@/app/components/base/app-unavailable'
import cn from '@/utils/classnames'
import useDocumentTitle from '@/hooks/use-document-title'

type ChatWithHistoryProps = {
  className?: string;
}
const ChatWithHistory: FC<ChatWithHistoryProps> = ({ className }) => {
  const {
    appData,
    appChatListDataLoading, // <--- از این متغیر استفاده می‌کنیم
    chatShouldReloadKey,
    isMobile,
    themeBuilder,
    sidebarCollapseState,
  } = useChatWithHistoryContext()
  const isSidebarCollapsed = sidebarCollapseState
  const customConfig = appData?.custom_config
  const site = appData?.site

  const [showSidePanel, setShowSidePanel] = useState(false)

  useEffect(() => {
    themeBuilder?.buildTheme(
      site?.chat_color_theme,
      site?.chat_color_theme_inverted,
    )
  }, [site, customConfig, themeBuilder])

  useDocumentTitle(site?.title || 'Chat')

  // --- ⬇️ بخش اضافه شده (منطق تأخیر ۵ ثانیه‌ای) ⬇️ ---
  const [minLoading, setMinLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), 2500) // 2 ثانیه
    return () => clearTimeout(timer)
  }, [])

  // لودینگ زمانی نشان داده می‌شود که یا دیتای برنامه لود نشده، یا ۵ ثانیه هنوز تمام نشده است
  const showLoading = appChatListDataLoading || minLoading
  // --- ⬆️ پایان بخش اضافه شده ⬆️ ---

  // --- ⬇️ منطق رندر اصلاح شد ⬇️ ---
  if (showLoading) {
    // اگر در حال لودینگ هستیم، *فقط* کامپوننت لودینگ سیاه تمام صفحه را نشان بده
    return <Loading type="app" />
  }

  // اگر لودینگ تمام شد، *کل* صفحه چت (با سایدبار و صفحه خوشامدگویی آبی) را نشان بده
  return (
    <div
      className={cn(
        'font-vazirmatn flex h-full bg-background-default-burn',
        isMobile && 'flex-col',
        className,
      )}
    >
      {!isMobile && (
        <div
          className={cn(
            'flex w-[236px] flex-col p-1 pr-0 transition-all duration-200 ease-in-out',
            isSidebarCollapsed && 'w-0 overflow-hidden !p-0',
          )}
        >
          <Sidebar />
        </div>
      )}
      {isMobile && <HeaderInMobile />}
      <div
        className={cn(
          'relative grow p-2',
          isMobile && 'h-[calc(100%_-_56px)] p-0',
        )}
      >
        {isSidebarCollapsed && (
          <div
            className={cn(
              'absolute top-0 z-20 flex h-full w-[256px] flex-col p-2 transition-all duration-500 ease-in-out',
              showSidePanel ? 'left-0' : 'left-[-248px]',
            )}
            onMouseEnter={() => setShowSidePanel(true)}
            onMouseLeave={() => setShowSidePanel(false)}
          >
            <Sidebar isPanel />
          </div>
        )}
        <div
          className={cn(
            'flex h-full flex-col overflow-hidden border-[0,5px] border-components-panel-border-subtle bg-chatbot-bg',
            isMobile ? 'rounded-t-2xl' : 'rounded-2xl',
          )}
        >
          {!isMobile && <Header />}

          {/* اینجا دیگر نیازی به شرط لودینگ نیست
            چون ChatWrapper حاوی همان صفحه خوشامدگویی آبی است
          */}
          <ChatWrapper key={chatShouldReloadKey} />
        </div>
      </div>
    </div>
  )
}

// ... بقیه فایل (ChatWithHistoryWrap و ...) بدون تغییر باقی می‌ماند ...
// (کدهای پایین این بخش را از فایل اصلی خودتان کپی کنید یا بگذارید بماند)

export type ChatWithHistoryWrapProps = {
  installedAppInfo?: InstalledApp;
  className?: string;
}
const ChatWithHistoryWrap: FC<ChatWithHistoryWrapProps> = ({
  installedAppInfo,
  className,
}) => {
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const themeBuilder = useThemeContext()

  const {
    appData,
    appParams,
    appMeta,
    appChatListDataLoading,
    currentConversationId,
    currentConversationItem,
    appPrevChatTree,
    pinnedConversationList,
    conversationList,
    newConversationInputs,
    newConversationInputsRef,
    handleNewConversationInputsChange,
    inputsForms,
    handleNewConversation,
    handleStartChat,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    handleDeleteConversation,
    conversationRenaming,
    handleRenameConversation,
    handleNewConversationCompleted,
    chatShouldReloadKey,
    isInstalledApp,
    appId,
    handleFeedback,
    currentChatInstanceRef,
    sidebarCollapseState,
    handleSidebarCollapse,
    clearChatList,
    setClearChatList,
    isResponding,
    setIsResponding,
    currentConversationInputs,
    setCurrentConversationInputs,
    allInputsHidden,
    initUserVariables,
  } = useChatWithHistory(installedAppInfo)

  return (
    <ChatWithHistoryContext.Provider
      value={{
        appData,
        appParams,
        appMeta,
        appChatListDataLoading,
        currentConversationId,
        currentConversationItem,
        appPrevChatTree,
        pinnedConversationList,
        conversationList,
        newConversationInputs,
        newConversationInputsRef,
        handleNewConversationInputsChange,
        inputsForms,
        handleNewConversation,
        handleStartChat,
        handleChangeConversation,
        handlePinConversation,
        handleUnpinConversation,
        handleDeleteConversation,
        conversationRenaming,
        handleRenameConversation,
        handleNewConversationCompleted,
        chatShouldReloadKey,
        isMobile,
        isInstalledApp,
        appId,
        handleFeedback,
        currentChatInstanceRef,
        themeBuilder,
        sidebarCollapseState,
        handleSidebarCollapse,
        clearChatList,
        setClearChatList,
        isResponding,
        setIsResponding,
        currentConversationInputs,
        setCurrentConversationInputs,
        allInputsHidden,
        initUserVariables,
      }}
    >
      <ChatWithHistory className={className} />
    </ChatWithHistoryContext.Provider>
  )
}

const ChatWithHistoryWrapWithCheckToken: FC<ChatWithHistoryWrapProps> = ({
  installedAppInfo,
  className,
}) => {
  const [initialized, setInitialized] = useState(false)
  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)

  useAsyncEffect(async () => {
    if (!initialized) {
      if (!installedAppInfo) {
        try {
          await checkOrSetAccessToken()
        }
 catch (e: any) {
          if (e.status === 404) {
            setAppUnavailable(true)
          }
 else {
            setIsUnknownReason(true)
            setAppUnavailable(true)
          }
        }
      }
      setInitialized(true)
    }
  }, [])

  if (!initialized) return null

  if (appUnavailable)
    return <AppUnavailable isUnknownReason={isUnknownReason} />

  return (
    <ChatWithHistoryWrap
      installedAppInfo={installedAppInfo}
      className={className}
    />
  )
}

export default ChatWithHistoryWrapWithCheckToken
