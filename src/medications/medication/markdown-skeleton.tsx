import React from "react";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";

export function MarkdownSkeleton({ source }: { source?: string }) {
  return source ? <ReactMarkdown source={source} /> : <Skeleton count={3} />;
}
