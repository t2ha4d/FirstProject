export interface AnnouncementBarProps {
  messages: string[]
}

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  return (
    <div className="announcement-bar">
      <ul className="announcement-list">
        {messages.map((message) => <li key={message}>{message}</li>)}
      </ul>
    </div>
  )
}
