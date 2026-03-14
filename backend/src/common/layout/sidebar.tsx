import { Link } from "react-router-dom";

export default function Sidebar(){

  return (
    <aside className="sidebar glass">

      <div className="sidebar-logo">

        <img src="/assets/logo-jaecoo.png" alt="JAECOO"/>

      </div>

      <nav>

        <Link to="/dashboard/service">
          Service Board
        </Link>

        <Link to="/dashboard/vehicle">
          Vehicles
        </Link>

        <Link to="/dashboard/owner">
          Owners
        </Link>

      </nav>

    </aside>
  )

}