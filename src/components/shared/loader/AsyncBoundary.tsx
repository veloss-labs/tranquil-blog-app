import React from 'react';
import ErrorBoundary from "~/components/shared/loader/ErrorBoundary";
import Suspense from "~/components/shared/loader/Suspense";

// types
import type { ComponentProps } from 'react';

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

interface Props extends Omit<ErrorBoundaryProps, 'renderFallback'> {
  pendingFallback: ComponentProps<typeof Suspense>['fallback'];
  rejectedFallback: ErrorBoundaryProps['fallback'];
  children: React.ReactNode;
}

function AsyncBoundary({
  pendingFallback,
  rejectedFallback,
  children,
  ...errorBoundaryProps
}: Props) {
  return (
    <ErrorBoundary fallback={rejectedFallback} {...errorBoundaryProps}>
      <Suspense fallback={pendingFallback}>
        {children} {/* <- fulfilled */}
      </Suspense>
    </ErrorBoundary>
  );
}

export default AsyncBoundary;
