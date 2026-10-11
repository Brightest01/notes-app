
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="/">
        <img src="/favicon.svg" alt="" />
        <span>MY NOTE</span>
      </a>

      <p>
        Your thoughts, stories, plans, and ideas — all in one place.
      </p>

      <div className="footer-bottom">
        <span className="powered-by">
  Powered by <strong>LKS Platforms LTD</strong>
</span>
        <span>
          © {new Date().getFullYear()} MY NOTE. All rights reserved.
        </span>
        <span>Made for your thoughts.</span>
      </div>
    </footer>
  )
}

export default Footer
