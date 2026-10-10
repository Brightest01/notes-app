interface NoteCardProps {
  title: string
  content: string
  onDelete: () => void
  onEdit: () => void
  isDeleting: boolean
}

function NoteCard({
  title,
  content,
  onDelete,
  onEdit,
  isDeleting,
}: NoteCardProps) {
  return (
    <article className="note-card">
      <h2>{title}</h2>
      <p>{content}</p>

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