import { Dot, File } from "lucide-react";

type SessionsListItemProps = {
  name: string;
  pageCount: number;
  createdAt: Date;
};

const SessionsListItem = ({name, pageCount, createdAt}: SessionsListItemProps) => {
  return (
    <li>
      <div className="bg-card flex p-4 rounded-md border gap-4 items-center">
        <div className="p-2 bg-secondary/10 rounded-md">
          <File size={20} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="flex text-xs items-center text-secondary">
            <div>{pageCount} page</div>
            <Dot />
            <div>{createdAt?.getDate()}</div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SessionsListItem;
