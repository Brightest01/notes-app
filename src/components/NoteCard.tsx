interface NoteCardProps {
  title: string
  content: string
  createdAt: string
  onView: () => void
  onDelete: () => void
  onEdit: () => void
  isDeleting: boolean
}

function NoteCard({
  title,
  content,
  createdAt,
  onView,
  onDelete,
  onEdit,
  isDeleting,
}: NoteCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Date unavailable'

  return (
    <article className="note-card">
      <h2>{title}</h2>
      <p>{content}</p>

      <time className="note-timestamp" dateTime={createdAt || undefined}>
        {formattedDate}
      </time>

      <button type="button" onClick={onView}>
        View
      </button>

      <button type="button" onClick={onEdit}>
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </article>
  )
}

export default NoteCard
