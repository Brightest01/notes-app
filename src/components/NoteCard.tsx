interface NoteCardProps {
  title: string
  content: string
  onDelete: () => void
  onEdit: () => void
}

function NoteCard({
  title,
  content,
  onDelete,
  onEdit,
}: NoteCardProps) {
  return (
    <article className="note-card">
      <h2>{title}</h2>
      <p>{content}</p>

      <button type="button" onClick={onEdit}>
        Edit
      </button>

      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </article>
  )
}

export default NoteCard