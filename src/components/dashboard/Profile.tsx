import React from 'react';
import type { MenuProps} from 'antd';
import { Dropdown, Typography, Button } from 'antd';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import LogOutIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

function Profile() {
  const items: MenuProps['items'] = [
    {
      label: (
        <Button
          type="link"
          icon={<UserIcon />}
          size="small"
          className="sm:min-w-[8rem] btn-menu--profile"
        >
          내 프로필
        </Button>
      ),
      key: '0',
    },
    {
      label: (
        <Button
          type="link"
          icon={<LogOutIcon />}
          size="small"
          className="btn-menu--profile"
        >
          로그아웃
        </Button>
      ),
      key: '1',
    },
  ];

  return (
    <>
      <div className="ml-1">
        <Typography.Text>Administrator</Typography.Text>
      </div>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button
          size="small"
          htmlType="button"
          shape="default"
          type="text"
          className="btn-menu--toggle"
        >
          <span className="sm:max-w-[10rem] ellipsis-text">admin</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </Dropdown>
    </>
  );
}

export default React.memo(Profile);
