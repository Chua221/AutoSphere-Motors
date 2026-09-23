import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <h4>AutoSphere Motors</h4>
          <p>
            A Used Car Marketplace Portal connecting verified sellers with buyers across
            Malaysia. Search, compare and list vehicles with confidence.
          </p>
        </div>
        <div>
        </div>
        <div>
          <h4>Marketplace</h4>
          <ul>
            <li><Link to="/cars">Browse cars</Link></li>
            <li><Link to="/cars/new">Sell your car</Link></li>
            <li><Link to="/register">Create an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        © {new Date().getFullYear()} AutoSphere Motors Sdn. Bhd. — Built for DSE204/03 Assignment 1.
      </div>
    </footer>
  );
}
