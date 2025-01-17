import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="flex justify-center gap-5">
      <NavLink
        className="m-3 p-4 text-xl bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 hover:bg-blue-600 rounded-md font-medium text-white"
        to={"/"}
      >
        All Entries
      </NavLink>
      <NavLink
        className="m-3 p-4 text-xl bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 hover:bg-blue-600 rounded-md font-medium text-white"
        to={"/create"}
      >
        New Entry
      </NavLink>
    </nav>
  );
}
