import { PropsWithChildren } from "react";

export const Heading = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <div className="bg-neutral px-4 py-8">
      <div className="max-w-7xl mx-auto min-h-[256px] flex justify-center text-center text-neutral-content">
        <div className="flex flex-col justify-center animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
};
