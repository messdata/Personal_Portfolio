// src/components/panel/MessagesContent.tsx
import Counter from "./Counter";
import { Mail, MailOpen, Archive, Trash2 } from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface MessagesContentProps {
    totalMessages: number;
    unreadMessages: number;
    readMessages: number;
    recentMessages: Message[];
}

export function getMessagesCards({
    totalMessages,
    unreadMessages,
    readMessages,
    recentMessages,
}: MessagesContentProps) {
    return [
        // CARD 1: Total Messages (Small)
        {
            id: "total-messages",
            size: "small" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {/* Card Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Total
                        </span>

                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Mail size={20} color="#06b6d4" />
                        </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ marginTop: "auto" }}>
                        <Counter
                            value={totalMessages}
                            places={[10, 1]}
                            fontSize={60}
                            textColor="white"
                            fontWeight={700}
                        />
                        <h3
                            style={{
                                fontSize: "18px",
                                margin: "0.75rem 0 0.25rem 0",
                                color: "white",
                            }}
                        >
                            Messages
                        </h3>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                                margin: 0,
                            }}
                        >
                            All time
                        </p>
                    </div>
                </div>
            ),
        },

        // CARD 2: Unread Messages (Small)
        {
            id: "unread-messages",
            size: "small" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Unread
                        </span>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MailOpen size={20} color="#f59e0b" />
                        </div>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                        <Counter
                            value={unreadMessages}
                            places={[10, 1]}
                            fontSize={60}
                            textColor="white"
                            fontWeight={700}
                        />
                        <h3
                            style={{
                                fontSize: "18px",
                                margin: "0.75rem 0 0.25rem 0",
                                color: "white",
                            }}
                        >
                            New
                        </h3>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                                margin: 0,
                            }}
                        >
                            Needs attention
                        </p>
                    </div>
                </div>
            ),
        },

        // CARD 3: Recent Messages List (Large - 2x2)
        {
            id: "recent-messages",
            size: "large" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Inbox
                        </span>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Mail size={20} color="#8b5cf6" />
                        </div>
                    </div>

                    <h3
                        style={{
                            fontSize: "18px",
                            margin: "0 0 1rem 0",
                            color: "white",
                        }}
                    >
                        Recent Messages
                    </h3>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            paddingRight: "0.5rem",
                        }}
                    >
                        {recentMessages.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.4)",
                                    padding: "2rem",
                                }}
                            >
                                <Mail size={48} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {recentMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="message-item"
                                        style={{
                                            padding: "1rem",
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: msg.is_read ? "400" : "600",
                                                        color: msg.is_read
                                                            ? "rgba(255,255,255,0.6)"
                                                            : "white",
                                                        marginBottom: "0.25rem",
                                                    }}
                                                >
                                                    {msg.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "rgba(255,255,255,0.4)",
                                                    }}
                                                >
                                                    {msg.email}
                                                </div>
                                            </div>
                                            {!msg.is_read && (
                                                <div
                                                    style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: "#8b5cf6",
                                                        marginLeft: "0.5rem",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                color: "rgba(255,255,255,0.5)",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            {msg.subject}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "rgba(255,255,255,0.4)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: "2",
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },

        // CARD 4: Quick Stats (Small)
        {
            id: "quick-stats",
            size: "small" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <Mail size={48} color="#8b5cf6" style={{ margin: "0 auto 1.5rem" }} />
                        <h3
                            style={{
                                fontSize: "18px",
                                margin: "0 0 0.5rem 0",
                                color: "white",
                            }}
                        >
                            Message Center
                        </h3>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                                margin: 0,
                                lineHeight: 1.5,
                            }}
                        >
                            Manage your communications in one place
                        </p>
                    </div>
                </div>
            ),
        },

        // CARD 5: Read Messages (Small)
        {
            id: "read-messages",
            size: "small" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Archived
                        </span>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Archive size={20} color="#4ade80" />
                        </div>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                        <Counter
                            value={readMessages}
                            places={[10, 1]}
                            fontSize={60}
                            textColor="white"
                            fontWeight={700}
                        />
                        <h3
                            style={{
                                fontSize: "18px",
                                margin: "0.75rem 0 0.25rem 0",
                                color: "white",
                            }}
                        >
                            Read
                        </h3>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.6)",
                                margin: 0,
                            }}
                        >
                            Completed
                        </p>
                    </div>
                </div>
            ),
        },

        // CARD 6: Actions (Small)
        {
            id: "actions",
            size: "small" as const,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Actions
                        </span>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Trash2 size={20} color="#ef4444" />
                        </div>
                    </div>

                    {/* Center button vertically */}
                    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <button
                            style={{
                                padding: "0.75rem 1.5rem",
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                borderRadius: "12px",
                                color: "#ef4444",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                width: "100%",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            ),
        },
    ];
}