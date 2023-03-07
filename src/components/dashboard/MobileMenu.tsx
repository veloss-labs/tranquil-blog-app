import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

// hooks
import { useLayoutDashboardContext } from "~/context/layout-context";

// components
import Profile from '~/components/dashboard/Profile';
import RoutesMenu from '~/components/dashboard/RoutesMenu';
import { Divider } from 'antd';

import type { UrlRoutes } from '~/ts/common';

interface MobileMenuProps {
  pageTransition: (url: UrlRoutes) => Promise<void>;
}

function MobileMenu({ pageTransition }: MobileMenuProps) {
  const { isShowPopupMenu } = useLayoutDashboardContext();

  useEffect(() => {
    if (isShowPopupMenu) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  }, [isShowPopupMenu]);

  return (
    <motion.div
      animate={isShowPopupMenu ? 'open' : 'closed'}
      initial={{ display: 'none' }}
      variants={{
        open: { display: 'block', opacity: 1, y: 0 },
        closed: {
          opacity: 0,
          y: '-10px',
          transitionEnd: { display: 'none' },
        },
      }}
      transition={{ duration: 0.15 }}
      className="mobile-menu fixed bottom-0 left-0 right-0 p-5 z-30 overflow-auto bg-white"
      style={{ top: '3.5rem' }}
    >
      <Profile />
      <Divider orientation="left">
        <span className="text-sm">메뉴</span>
      </Divider>
      <RoutesMenu pageTransition={pageTransition} />
    </motion.div>
  );
}

export default MobileMenu;
