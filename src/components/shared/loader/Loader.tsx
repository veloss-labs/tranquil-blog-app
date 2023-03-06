import React from 'react';
import { isEmpty } from '~/utils/assertion';

// utils

interface LoaderProps extends Partial<Record<string, any>> {
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  children?: React.ReactNode;
}

function Loader(props: LoaderProps) {
  const {
    errorComponent = null,
    loadingComponent = null,
    emptyComponent = null,
    isLoading,
    data,
    error,
  } = props;

  if (isLoading) {
    return <React.Fragment>{loadingComponent}</React.Fragment>;
  }

  if (error) {
    return <React.Fragment>{errorComponent}</React.Fragment>;
  }

  if (isEmpty(data)) {
    return <React.Fragment>{emptyComponent}</React.Fragment>;
  }

  return <>{props.children}</>;
}

export default Loader;
