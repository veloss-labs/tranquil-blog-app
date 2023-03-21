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
import {
  ListBulletIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  Pencil1Icon,
  HeadingIcon,
  QuoteIcon,
  CheckboxIcon,
  ActivityLogIcon,
  ArrowLeftIcon as BackIcon,
  ArrowRightIcon as ForwardIcon,
} from "@radix-ui/react-icons";

import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

interface IconProps extends React.SVGProps<SVGSVGElement> { }

const OrderedListIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="none" d="M0 0h24v24H0z" />
    <rect x="5" y="3" width="14" height="2" />
    <rect x="5" y="9" width="14" height="2" />
    <rect x="5" y="15" width="14" height="2" />
  </svg>

)

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
  Bold: FontBoldIcon,
  Italic: FontItalicIcon,
  Strikethrough: StrikethroughIcon,
  Code: CodeIcon,
  Highlight: Pencil1Icon,
  Heading: HeadingIcon,
  Quote: QuoteIcon,
  BulletList: ListBulletIcon,
  Checkbox: CheckboxIcon,
  ActivityLog: ActivityLogIcon,
  Back: BackIcon,
  Forward: ForwardIcon,
  OrderedList: OrderedListIcon,
};

export const AntdIcons = {
  time: (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Icons.time} {...props} />
  ),
};
