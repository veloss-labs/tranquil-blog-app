import ArrowLeftIcon from "@heroicons/react/20/solid/ArrowLeftIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import Square3Stack3DIcon from "@heroicons/react/24/outline/Square3Stack3DIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import PhotoIcon from "@heroicons/react/24/outline/PhotoIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import EllipsisIcon from "@heroicons/react/24/outline/EllipsisHorizontalIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import Bars3BottomRightIcon from "@heroicons/react/24/outline/Bars3BottomRightIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import Icon from "@ant-design/icons";

import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

export const Icons = {
  logo: Square3Stack3DIcon,
  arrowLeft: ArrowLeftIcon,
  down: ChevronDownIcon,
  close: XMarkIcon,
  user: UserIcon,
  post: DocumentTextIcon,
  page: DocumentIcon,
  settings: Cog6ToothIcon,
  media: PhotoIcon,
  add: PlusIcon,
  ellipsis: EllipsisIcon,
  trash: TrashIcon,
  warning: ExclamationTriangleIcon,
  menu: Bars3Icon,
  time: ClockIcon,
  subTitle: Bars3BottomRightIcon,
};

export const AntdIcons = {
  time: (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Icons.time} {...props} />
  ),
};
