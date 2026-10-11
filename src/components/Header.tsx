
import './Header.css'


interface HeaderProps {
  userEmail: string | undefined
  onLoginClick: () => void
  onSignUpClick: () => void
  onLogout: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}


function Header({
  userEmail,
  onLoginClick,
  onSignUpClick,
  onLogout,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="MY NOTE home">
        <img src="/favicon.svg" alt="" />
        <span>MY NOTE</span>
      </a>

      <nav className="header-nav" aria-label="Main navigation">
        {!userEmail ? (
          <a href="#features">Features</a>
        ) : (
          <a href="#notes">My Notes</a>
        )}
      </nav>

      <div className="header-actions">
        
<button
  type="button"
  className="header-button header-outline theme-toggle"
  onClick={onToggleTheme}
  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
>
  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
</button>

        {userEmail ? (
          <>
            <span className="user-email" title={userEmail}>
              {userEmail}
            </span>

            <button
              type="button"
              className="header-button header-outline"
              onClick={onLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="header-button header-outline"
              onClick={onLoginClick}
            >
              Log in
            </button>

            <button
              type="button"
              className="header-button header-primary"
              onClick={onSignUpClick}
            >
              Get started
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
