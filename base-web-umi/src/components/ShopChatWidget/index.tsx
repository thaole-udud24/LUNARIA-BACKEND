import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CloseOutlined,
  CustomerServiceOutlined,
  MinusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  ChatMessage,
  QUICK_REPLIES,
  WELCOME_MESSAGE,
  createMessage,
  getBotReply,
  getReplyDelay,
  loadChatMessages,
  saveChatMessages,
} from './chat.utils';
import './index.less';

const ShopChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatMessages());
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (open && !minimized && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open, minimized]);

  const pushShopReply = useCallback((userText: string) => {
    const delay = getReplyDelay(userText);
    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);
      const reply = createMessage('shop', getBotReply(userText));
      setMessages((prev) => [...prev, reply]);
      if (!open || minimized) {
        setUnread((count) => count + 1);
      }
    }, delay);
  }, [open, minimized]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    pushShopReply(trimmed);
  }, [pushShopReply, typing]);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
    window.setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setDraft('');
    setTyping(false);
    setUnread(0);
  };

  return (
    <div className="shop-chat-widget" aria-live="polite">
      {open && (
        <div className={`shop-chat-panel ${minimized ? 'is-minimized' : ''}`}>
          <div className="shop-chat-panel__header">
            <div className="shop-chat-panel__brand">
              <span className="shop-chat-panel__avatar">
                <CustomerServiceOutlined />
                <span className="shop-chat-panel__online" />
              </span>
              <div>
                <strong>LURANA Support</strong>
                <span>Trực tuyến · Phản hồi nhanh</span>
              </div>
            </div>
            <div className="shop-chat-panel__actions">
              <button
                type="button"
                aria-label="Thu nhỏ"
                onClick={() => setMinimized((v) => !v)}
              >
                <MinusOutlined />
              </button>
              <button
                type="button"
                aria-label="Đóng chat"
                onClick={() => setOpen(false)}
              >
                <CloseOutlined />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="shop-chat-panel__body" ref={listRef}>
                <div className="shop-chat-panel__hint">
                  Demo chat — phản hồi tự động để trải nghiệm UI
                </div>

                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`shop-chat-bubble shop-chat-bubble--${item.role}`}
                  >
                    {item.role === 'shop' && (
                      <span className="shop-chat-bubble__avatar">
                        <CustomerServiceOutlined />
                      </span>
                    )}
                    <div className="shop-chat-bubble__content">
                      <p>{item.text}</p>
                      <time>{item.time}</time>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="shop-chat-bubble shop-chat-bubble--shop shop-chat-bubble--typing">
                    <span className="shop-chat-bubble__avatar">
                      <CustomerServiceOutlined />
                    </span>
                    <div className="shop-chat-bubble__content">
                      <div className="typing-dots">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {messages.length <= 1 && (
                <div className="shop-chat-panel__quick">
                  {QUICK_REPLIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => sendMessage(item)}
                      disabled={typing}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <div className="shop-chat-panel__composer">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  placeholder="Nhập tin nhắn..."
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(draft);
                    }
                  }}
                  disabled={typing}
                />
                <button
                  type="button"
                  className="shop-chat-panel__send"
                  onClick={() => sendMessage(draft)}
                  disabled={!draft.trim() || typing}
                  aria-label="Gửi tin nhắn"
                >
                  <SendOutlined />
                </button>
              </div>

              <button type="button" className="shop-chat-panel__reset" onClick={handleReset}>
                Bắt đầu cuộc trò chuyện mới
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className={`shop-chat-fab ${open ? 'is-open' : ''}`}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label="Chat với LURANA"
      >
        {open ? <CloseOutlined /> : <CustomerServiceOutlined />}
        {!open && unread > 0 && (
          <span className="shop-chat-fab__badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>
    </div>
  );
};

export default ShopChatWidget;
