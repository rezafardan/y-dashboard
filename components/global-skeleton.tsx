// COMPONENT
import { Skeleton } from "./ui/skeleton";

const GlobalSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* HEADER */}
      <Skeleton className="h-8 w-1/2" />

      {/* BODY */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* ADDITIONAL */}
      <Skeleton className="h-16 w-full" />
    </div>
  );
};

export default GlobalSkeleton;
