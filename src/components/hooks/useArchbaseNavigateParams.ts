import { NavigateOptions, useNavigate } from 'react-router';
import { URLSearchParamsInit, createSearchParams } from 'react-router-dom';

export const useArchbaseNavigateParams = () => {
  const navigate = useNavigate();

  return (pathname: string, options?: NavigateOptions, params?: URLSearchParamsInit) => {
    let path = { pathname, search: '' };
    if (params) {
      path = {
        pathname,
        search: createSearchParams(params).toString(),
      };
    }
    navigate(path, options);
  };
};
