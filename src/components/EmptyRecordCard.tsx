interface EmptyRecordCardProps {
  title: string
  message: string
}

export function EmptyRecordCard({ title, message }: EmptyRecordCardProps) {
  return (
    <article className="record-card compact-card empty-record-card">
      <strong>{title}</strong>
      <p>{message}</p>
    </article>
  )
}
