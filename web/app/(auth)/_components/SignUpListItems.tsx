import { Check } from "lucide-react";

type SignUpListItemsProps = {
  text: string;
  description: string;
};

const SignUpListItems = ({ text, description }: SignUpListItemsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 bg-accent/40 rounded-md">
        <Check className="text-primary" />
      </div>

      <div>
        <p className="text-base font-semibold">{text}</p>
        <span className="font-display italic font-medium text-secondary">
          {description}
        </span>
      </div>
    </div>
  );
};

export default SignUpListItems;
