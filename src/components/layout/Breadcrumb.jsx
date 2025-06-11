import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { getBreadcrumbs } from '../../routes/routeUtils';

/**
 * Breadcrumb - 面包屑导航组件
 * 
 * 显示当前页面在网站层次结构中的位置
 * 
 * @component
 * @example
 * ```jsx
 * <Breadcrumb />
 * ```
 */
const Breadcrumb = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  
  // 如果只有首页或没有面包屑，不显示
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <nav className="flex" aria-label="面包屑导航">
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <FiChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="font-medium text-gray-900">
                  {index === 0 ? (
                    <FiHome className="h-4 w-4" />
                  ) : (
                    breadcrumb.title
                  )}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="hover:text-primary-600 flex items-center"
                >
                  {index === 0 ? (
                    <FiHome className="h-4 w-4" />
                  ) : (
                    breadcrumb.title
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
