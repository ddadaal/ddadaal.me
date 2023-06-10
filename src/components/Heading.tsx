import { PropsWithChildren } from "react";

export const Heading = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="bg-neutral p-4">
      <div className="max-w-7xl mx-auto h-64 flex justify-center items-center text-neutral-content">
        <div className="flex flex-col items-center animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
};
