const Sidebar = () => {
  return (
    <>
      <aside className="fixed top-0 left-0 w-64 h-full" aria label="Sidenav">
        <div className="overflow-y-auto py-5 px-3 h-full bg-gray-700 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="flex items-center p-2 text-3xl  font-medium text-white rounded-lg group"
              >
                <span className="ml-3 tracking-widest">GLAMGAIT</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
