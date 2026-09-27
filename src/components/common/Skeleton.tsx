import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#DDD7CA]/50 rounded-lg ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-4 rounded-xl border border-[#DDD7CA] space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-[#DDD7CA] overflow-hidden p-4 space-y-3">
    <div className="flex justify-between items-center pb-2 border-b border-[#DDD7CA]">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-48" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center py-2">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);
