import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import NoteCard from './components/NoteCard'
import './App.css'

interface Note {
  id: number
  title: string
  content: string
}

function App() {

const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function fetchNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return
    }

    setNotes(data)
  }

  if (!user) {
    setNotes([])
    return
  }

  fetchNotes()
}, [user])

useEffect(() => {
  async function getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
setLoading(false)
return
    }

    setUser(data.session?.user ?? null)
    setLoading(false)
  }

  getSession()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])


  
  const [notes, setNotes] = useState<Note[]>([])
  const [noteMessage, setNoteMessage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
const [signUpPassword, setSignUpPassword] = useState('')

const [showLogin, setShowLogin] = useState(false)
const [loginEmail, setLoginEmail] = useState('')
const [loginPassword, setLoginPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const { data, error } = await supabase.auth.signUp({
    email: signUpEmail,
    password: signUpPassword,
  })

  if (error) {
    console.error('Error signing up:', error)
    setAuthMessage(error.message)
    return
  }

  console.log('Logged in successfully:', data)

setUser(data.user)

setAuthMessage('Logged in successfully!')

  setSignUpEmail('')
  setSignUpPassword('')
}
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword,
  })

  if (error) {
    console.error('Error logging in:', error)
    setAuthMessage(error.message)
    return
  }

  console.log('Logged in successfully:', data)

  setUser(data.user)

  setAuthMessage('Logged in successfully!')
}

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

if (!title.trim() || !content.trim()) {
  setNoteMessage('Please enter a title and content.')
  return
}

if (!user) {
  setAuthMessage('Please log in to create or edit notes.')
  return
}

if (editingNoteId === null) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      title,
      content,
      user_id: user.id,
    })
    .select()
    .single()

    if (error) {
      console.error('Error creating note:', error)
      return
    }

    setNotes([data, ...notes])
  } else {
  const { data, error } = await supabase
    .from('notes')
    .update({
      title,
      content,
    })
    .eq('id', editingNoteId)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return
  }

  setNotes(
    notes.map((note) =>
      note.id === editingNoteId ? data : note,
    ),
  )

  setEditingNoteId(null)
}

  setTitle('')
  setContent('')
  setNoteMessage('')
}

  function handleEdit(note: Note) {
    setTitle(note.title)
    setContent(note.content)
    setEditingNoteId(note.id)
  }

async function handleDelete(noteId: number) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    console.error('Error deleting note:', error)
    return
  }

  setNotes(notes.filter((note) => note.id !== noteId))
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error logging out:', error)
    return
  }

  setUser(null)
  setEditingNoteId(null)
  setTitle('')
  setContent('')
}

  return (
  <>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <main>
        <h1>My Notes</h1>

      {user && <p>Logged in as: {user.email}</p>}
      <p className="auth-message">{authMessage}</p>
      {user && (
  <button type="button" onClick={handleLogout}>
    Logout
  </button>
)}
    
{!user && (
  <section className="auth-card">   
      {!showLogin && (
  <>
    <h2>Sign Up</h2>

    <form onSubmit={handleSignUp}>
  <input
    type="email"
    placeholder="Email"
    value={signUpEmail}
    onChange={(event) => setSignUpEmail(event.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={signUpPassword}
    onChange={(event) => setSignUpPassword(event.target.value)}
  />

  <button type="submit">Sign Up</button>
</form>
    <p>
      Already have an account?{' '}
      <button
        type="button"
        onClick={() => setShowLogin(true)}
      >
        Login
      </button>
    </p>
  </>
)}

{showLogin && (
  <>
    <h2>Login</h2>

    <form onSubmit={handleLogin}>
  <input
    type="email"
    placeholder="Email"
    value={loginEmail}
    onChange={(event) => setLoginEmail(event.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={loginPassword}
    onChange={(event) => setLoginPassword(event.target.value)}
  />

  <button type="submit">Login</button>
</form>
    <p>
      Don't have an account?{' '}
      <button
        type="button"
        onClick={() => setShowLogin(false)}
      >
        Sign Up
      </button>
    </p>
  </>
)}
  </section>
)}

{noteMessage && <p>{noteMessage}</p>}
{user && (
  <section className="notes-section">
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Note title"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
    />

    <textarea
      placeholder="Note content"
      value={content}
      onChange={(event) => setContent(event.target.value)}
    />

    <button type="submit">
      {editingNoteId === null ? 'Add Note' : 'Update Note'}
    </button>
    {editingNoteId !== null && (
  <button
    type="button"
    onClick={() => {
      setEditingNoteId(null)
      setTitle('')
      setContent('')
    }}
  >
    Cancel
  </button>
)}
  </form>
  </section>
)}

      

      {notes.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          content={note.content}
          onEdit={() => handleEdit(note)}
          onDelete={() => handleDelete(note.id)}
        />
           ))}
      </main>
    )}
  </>
  )
}

export default App