
import Header from './components/Header'
import Footer from './components/Footer'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import NoteCard from './components/NoteCard'
import './App.css'

interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

function App() {

const [showCreateNoteModal, setShowCreateNoteModal] = useState(false)
const [viewingNote, setViewingNote] = useState<Note | null>(null)
const [editingNote, setEditingNote] = useState<Note | null>(null)
const [editTitle, setEditTitle] = useState('')
const [editContent, setEditContent] = useState('')
const [isSavingEdit, setIsSavingEdit] = useState(false)
const [editMessage, setEditMessage] = useState('')

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


  const [searchQuery, setSearchQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [noteMessage, setNoteMessage] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
const [signUpPassword, setSignUpPassword] = useState('')
const [isLoggingIn, setIsLoggingIn] = useState(false)
const [isSigningUp, setIsSigningUp] = useState(false)
const [isSavingNote, setIsSavingNote] = useState(false)
const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null)


const [showLogin, setShowLogin] = useState(false)
const [showAuthForm, setShowAuthForm] = useState(false)
const [authScrollRequest, setAuthScrollRequest] = useState(0)


const [theme, setTheme] = useState<'dark' | 'light'>(() => {
  const savedTheme = localStorage.getItem('notes-app-theme')
  return savedTheme === 'light' ? 'light' : 'dark'
})

useEffect(() => {
  localStorage.setItem('notes-app-theme', theme)
  document.documentElement.dataset.theme = theme
}, [theme])

function toggleTheme() {
  setTheme((currentTheme) =>
    currentTheme === 'dark' ? 'light' : 'dark'
  )
}


useEffect(() => {
  if (showAuthForm) {
    document.getElementById('auth')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}, [showAuthForm])


const [loginEmail, setLoginEmail] = useState('')
const [loginPassword, setLoginPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  setIsSigningUp(true)
  setAuthMessage('Creating your account...')

  const { data, error } = await supabase.auth.signUp({
    email: signUpEmail,
    password: signUpPassword,
  })

  if (error) {
    console.error('Error signing up:', error)
    setAuthMessage(error.message)
    setIsSigningUp(false)
    return
  }

  console.log('Sign-up response:', data)

  if (data.session) {
    setUser(data.user)
    setAuthMessage(
      'Account created successfully! You are now logged in.'
    )
  } else {
    setAuthMessage(
      "Account created! Please check your email and click the verification link before logging in. Didn't receive the email? Check your spam folder."
    )
  }

  setSignUpEmail('')
  setSignUpPassword('')
  setIsSigningUp(false)
}

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  setIsLoggingIn(true)
  setAuthMessage('Logging in...')

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword,
  })

  if (error) {
    console.error('Error logging in:', error)
    setAuthMessage(error.message)
    setIsLoggingIn(false)
    return
  }

  console.log('Logged in successfully:', data)

  setUser(data.user)
  setAuthMessage('Logged in successfully!')
  setIsLoggingIn(false)
}


function openAuthForm(mode: 'login' | 'signup') {
  setShowLogin(mode === 'login')
  setShowAuthForm(true)
  setAuthMessage('')
  setAuthScrollRequest((count) => count + 1)
}


useEffect(() => {
  if (!showAuthForm || authScrollRequest === 0) return

  document.getElementById('auth')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}, [showAuthForm, authScrollRequest])


async function handleSaveEditedNote(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()

  if (!editingNote || !user) {
    setEditMessage('Please log in to edit notes.')
    return
  }

  if (!editTitle.trim() || !editContent.trim()) {
    setEditMessage('Please enter a title and content.')
    return
  }

  setIsSavingEdit(true)
  setEditMessage('Saving changes...')

  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      .eq('id', editingNote.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
      setEditMessage(`Failed to update note: ${error.message}`)
      return
    }

    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === data.id ? data : note
      )
    )

    setEditingNote(null)
    setEditMessage('')
    setNoteMessage('Note updated successfully!')
  } catch (error) {
    console.error('Unexpected error updating note:', error)
    setEditMessage('Something went wrong. Please try again.')
  } finally {
    setIsSavingEdit(false)
  }
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

  setIsSavingNote(true)
  setNoteMessage(
    editingNoteId === null ? 'Saving note...' : 'Updating note...'
  )

  try {
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
        setNoteMessage(`Failed to save note: ${error.message}`)
        return
      }

      setNotes((previousNotes) => [data, ...previousNotes])
      setNoteMessage('Note saved successfully!')
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
        setNoteMessage(`Failed to update note: ${error.message}`)
        return
      }

      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingNoteId ? data : note
        )
      )

      setEditingNoteId(null)
      setNoteMessage('Note updated successfully!')
    }

    setShowCreateNoteModal(false)
    setTitle('')
    setContent('')
  } catch (error) {
    console.error('Unexpected error saving note:', error)
    setNoteMessage('Something went wrong. Please try again.')
  } finally {
    setIsSavingNote(false)
  }
}


function handleEdit(note: Note) {
  setEditingNote(note)
  setEditTitle(note.title)
  setEditContent(note.content)
  setEditMessage('')
}


async function handleDelete(noteId: number) {
  setDeletingNoteId(noteId)
  setNoteMessage('Deleting note...')

  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)

    if (error) {
      console.error('Error deleting note:', error)
      setNoteMessage(`Failed to delete note: ${error.message}`)
      return
    }

    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== noteId)
    )

    setNoteMessage('Note deleted successfully!')
  } catch (error) {
    console.error('Unexpected error deleting note:', error)
    setNoteMessage('Something went wrong while deleting the note.')
  } finally {
    setDeletingNoteId(null)
  }
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

const normalizedSearchQuery = searchQuery.trim().toLowerCase()

const filteredNotes = notes.filter((note) => {
  return (
    note.title.toLowerCase().includes(normalizedSearchQuery) ||
    note.content.toLowerCase().includes(normalizedSearchQuery)
  )
})

return (
  <div className="app-shell">
    {loading ? (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Preparing your personal space...</p>
      </div>
    ) : (
      <>
        <Header
          userEmail={user?.email}
          onLoginClick={() => openAuthForm('login')}
          onSignUpClick={() => openAuthForm('signup')}
          onLogout={handleLogout}
          onToggleTheme={toggleTheme}
          theme={theme}
        />

        {!user ? (
          <main className="landing-main">
            <section className="hero-section">
              <div className="hero-copy">
                <span className="eyebrow">
                  YOUR PERSONAL SPACE
                </span>

                <h1>
                  Your thoughts
                  <br />
                  deserve a <span>home.</span>
                </h1>

                <p className="hero-description">
                  Create your private personal notes, to-do lists,
                  stories, and ideas — all in one place.
                </p>

               
<div className="hero-actions">
  <button
    type="button"
    className="primary-button"
    onClick={() => openAuthForm('signup')}
  >
    Start writing for free
    <span aria-hidden="true"> →</span>
  </button>

  <button
    type="button"
    className="secondary-button"
    onClick={() => openAuthForm('login')}
  >
    I already have an account
  </button>
</div>

                <div className="hero-promise">
                  <span aria-hidden="true">✦</span>
                  A personal space for everything on your mind.
                </div>
              </div>

              <div className="hero-visual">
                <div className="glow glow-one" />
                <div className="glow glow-two" />

                <div className="preview-window">
                  <div className="preview-toolbar">
                    <div className="window-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="preview-label">MY NOTE</span>
                    <span className="preview-status">
                      YOUR SPACE
                    </span>
                  </div>

                  <div className="preview-content">
                    <div className="preview-welcome">
                      <div className="preview-icon">
                        <img src="/favicon.svg" alt="" />
                      </div>
                      <div>
                        <p className="preview-greeting">
                          A LITTLE SPACE FOR YOU
                        </p>
                        <h2>Your thoughts matter.</h2>
                      </div>
                    </div>

                    <div className="preview-note preview-purple">
                      <span className="preview-note-icon">✎</span>
                      <div>
                        <h3>My Story</h3>
                        <p>
                          Thoughts, memories, and ideas worth keeping.
                        </p>
                      </div>
                    </div>

                    <div className="preview-note preview-blue">
                      <span className="preview-note-icon">✓</span>
                      <div>
                        <h3>Today's To-do List</h3>
                        <p>
                          Make a plan. Take one step at a time.
                        </p>
                      </div>
                    </div>

                    <div className="preview-note preview-pink">
                      <span className="preview-note-icon">✧</span>
                      <div>
                        <h3>Ideas & Inspiration</h3>
                        <p>
                          Give your next great idea a place to grow.
                        </p>
                      </div>
                    </div>

                    <div className="preview-bottom">
                      <span>Made for your thoughts.</span>
                      <span aria-hidden="true">✦</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="features-section"
              id="features"
            >
              <div className="section-heading">
                <span className="eyebrow">A PLACE FOR EVERYTHING</span>
                <h2>More than just notes.</h2>
                <p>
                  One personal space for the things you want to
                  remember, plan, and create.
                </p>
              </div>

              <div className="features-grid">
                <article className="feature-card">
                  <div className="feature-icon">✎</div>
                  <h3>Your personal notes</h3>
                  <p>
                    Capture thoughts, important information, and
                    everyday moments in your own words.
                  </p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">✓</div>
                  <h3>Your to-do lists</h3>
                  <p>
                    Organize your tasks and keep your next steps
                    somewhere easy to find.
                  </p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">✧</div>
                  <h3>Your stories and ideas</h3>
                  <p>
                    Give your creativity, plans, and personal
                    reflections a home.
                  </p>
                </article>
              </div>
            </section>

            {showAuthForm && (
              <section
                className="auth-section"
                id="auth"
                aria-labelledby="auth-heading"
              >
                <div className="auth-card">
                  <button
                    type="button"
                    className="auth-close"
                    aria-label="Close authentication form"
                    onClick={() => {
                      setShowAuthForm(false)
                      setAuthMessage('')
                    }}
                  >
                    ×
                  </button>

                  <div className="auth-heading">
                    <span className="auth-icon">
                      <img src="/favicon.svg" alt="" />
                    </span>

                    <span className="eyebrow">
                      WELCOME TO MY NOTE
                    </span>

                    <h2 id="auth-heading">
                      {showLogin
                        ? 'Welcome back.'
                        : 'Create your space.'}
                    </h2>

                    <p>
                      {showLogin
                        ? 'Log in to return to your personal notes.'
                        : 'Create an account and start saving your thoughts.'}
                    </p>
                  </div>

                  {authMessage && (
                    <p className="auth-message" role="status">
                      {authMessage}
                    </p>
                  )}

                  {showLogin ? (
                    <form
                      className="auth-form"
                      onSubmit={handleLogin}
                    >
                      <label htmlFor="login-email">Email address</label>
                      <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(event) =>
                          setLoginEmail(event.target.value)
                        }
                        autoComplete="username"
                        required
                      />

                      <label htmlFor="login-password">Password</label>
                      <input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="submit"
                        className="primary-button auth-submit"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn
                          ? 'Logging in...'
                          : 'Log in to MY NOTE'}
                      </button>
                    </form>
                  ) : (
                    <form
                      className="auth-form"
                      onSubmit={handleSignUp}
                    >
                      <label htmlFor="signup-email">Email address</label>
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signUpEmail}
                        onChange={(event) =>
                          setSignUpEmail(event.target.value)
                        }
                        autoComplete="email"
                        required
                      />

                      <label htmlFor="signup-password">Create password</label>
                      <input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={signUpPassword}
                        onChange={(event) =>
                          setSignUpPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />

                      <button
                        type="submit"
                        className="primary-button auth-submit"
                        disabled={isSigningUp}
                      >
                        {isSigningUp
                          ? 'Creating account...'
                          : 'Create my account'}
                      </button>
                    </form>
                  )}

                  <p className="auth-switch">
                    {showLogin
                      ? "Don't have an account?"
                      : 'Already have an account?'}{' '}

                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(!showLogin)
                        setAuthMessage('')
                      }}
                    >
                      {showLogin ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                </div>
              </section>
            )}
          </main>
        ) : (
          <main className="dashboard-main" id="notes">
            <section className="dashboard-heading">
              <div>
                <span className="eyebrow">
                  YOUR PRIVATE WORKSPACE
                </span>
                <h1>My Notes<span>.</span></h1>
                <p>
                  Your thoughts, stories, plans, and ideas — all in
                  one place.
                </p>
              </div>

              <div className="dashboard-badge">
                <span className="online-dot" />
                Your personal space
              </div>
            </section>

            {authMessage && (
              <p className="dashboard-message" role="status">
                {authMessage}
              </p>
            )}

            {noteMessage && (
              <p className="dashboard-message" role="status">
                {noteMessage}
              </p>
            )}

           <section className="notes-section">
  <button
    type="button"
    className="primary-button"
    onClick={() => {
      setEditingNoteId(null)
      setTitle('')
      setContent('')
      setNoteMessage('')
      setShowCreateNoteModal(true)
    }}
  >
    + Create note
  </button>

  {showCreateNoteModal && (
    <div className="modal-backdrop">
      <section
        className="note-modal create-note-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-note-modal-title"
      >
        <button
          type="button"
          className="modal-close-button"
          aria-label="Close create note form"
          onClick={() => {
            setShowCreateNoteModal(false)
            setTitle('')
            setContent('')
            setNoteMessage('')
          }}
        >
          ×
        </button>

        <div className="editor-heading">
          <div>
            <span className="eyebrow">CAPTURE A THOUGHT</span>
            <h2 id="create-note-modal-title">Create a new note</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="note-editor">
          <label htmlFor="note-title">Note title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Give your note a title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="note-content">Your thoughts</label>
          <textarea
            id="note-content"
            placeholder="Start writing here..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />

          <div className="editor-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={isSavingNote}
            >
              {isSavingNote ? 'Saving note...' : 'Save note'}
            </button>

            <button
              type="button"
              className="secondary-button"
              disabled={isSavingNote}
              onClick={() => {
                setShowCreateNoteModal(false)
                setTitle('')
                setContent('')
                setNoteMessage('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  )}
</section>

<section className="saved-notes-section">
  <div className="saved-notes-heading">
    <div>
      <span className="eyebrow">YOUR COLLECTION</span>
      <h2>Saved notes</h2>
    </div>

    <span className="note-count">
      {notes.length}{' '}
      {notes.length === 1 ? 'note' : 'notes'}
    </span>
  </div>

  {notes.length > 0 && (
    <div className="notes-search">
      <label htmlFor="notes-search-input">
        Search your notes
      </label>

      <input
        id="notes-search-input"
        type="search"
        placeholder="Search by title or content..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  )}

  {notes.length === 0 ? (
    <div className="empty-notes">
      <div className="empty-notes-icon">✧</div>
      <h3>Your story starts here.</h3>
      <p>
        Create your first note using the form above.
        Your saved notes will appear here.
      </p>
    </div>
  ) : filteredNotes.length === 0 ? (
    <div className="empty-notes">
      <div className="empty-notes-icon">⌕</div>
      <h3>No matching notes.</h3>
      <p>
        Try another search term or clear your search
        to see all your notes again.
      </p>
    </div>
  ) : (
    <div className="notes-grid">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          content={note.content}
          onEdit={() => handleEdit(note)}
          onDelete={() => handleDelete(note.id)}
          isDeleting={deletingNoteId === note.id}
          onView={() => setViewingNote(note)}
          createdAt={note.updated_at}
        />
      ))}
    </div>
  )}
</section>
          </main>
        )}
        
{viewingNote && (
  <div
    className="modal-backdrop"
    onClick={() => setViewingNote(null)}
  >
    <section
      className="note-modal view-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-note-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-heading">
        <h2 id="view-note-title">{viewingNote.title}</h2>
        <button
          type="button"
          className="modal-close"
          aria-label="Close note"
          onClick={() => setViewingNote(null)}
        >
          ×
        </button>
      </div>

      <div className="modal-note-content">
        {viewingNote.content}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setViewingNote(null)}
        >
          Close
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            const note = viewingNote
            setViewingNote(null)
            handleEdit(note)
          }}
        >
          Edit note
        </button>
      </div>
    </section>
  </div>
)}

{editingNote && (
  <div
    className="modal-backdrop"
    onClick={() => {
      if (!isSavingEdit) setEditingNote(null)
    }}
  >
    <section
      className="note-modal edit-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-note-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="modal-heading">
        <h2 id="edit-note-title">Edit your note</h2>
        <button
          type="button"
          className="modal-close"
          aria-label="Close editor"
          disabled={isSavingEdit}
          onClick={() => setEditingNote(null)}
        >
          ×
        </button>
      </div>

      {editMessage && (
        <p className="modal-message" role="status">
          {editMessage}
        </p>
      )}

      <form onSubmit={handleSaveEditedNote}>
        <label htmlFor="modal-note-title">Note title</label>
        <input
          id="modal-note-title"
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          required
        />

        <label htmlFor="modal-note-content">Your thoughts</label>
        <textarea
          id="modal-note-content"
          value={editContent}
          onChange={(event) => setEditContent(event.target.value)}
          required
        />

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={isSavingEdit}
            onClick={() => setEditingNote(null)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isSavingEdit}
          >
            {isSavingEdit ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  </div>
)}

        <Footer />
      </>
    )}
  </div>
)
}

export default App