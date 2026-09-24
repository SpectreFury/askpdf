import SessionsListItem from "./SessionsListItem";

const DUMMY_ITEMS = [
  {
    name: "Climate Policy",
    pageCount: 18,
    createdAt: new Date(),
  },

  {
    name: "Global Transition",
    pageCount: 142,
    createdAt: new Date(),
  },
];

const Sessions = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <p className="uppercase text-xs font-medium text-secondary">
          Document Library
        </p>
        <span className="text-xs font-medium text-secondary/80">4 files</span>
      </div>

      <ul className="flex flex-col mt-2 gap-2">
        {DUMMY_ITEMS.map((item, index) => (
          <SessionsListItem
            key={index}
            name={item.name}
            pageCount={item.pageCount}
            createdAt={item.createdAt}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
