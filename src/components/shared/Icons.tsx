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
  HeartIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const OrderedListIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <rect x="5" y="3" width="14" height="2" />
    <rect x="5" y="9" width="14" height="2" />
    <rect x="5" y="15" width="14" height="2" />
  </svg>
);

const SavePostsIcon = (props: IconProps) => (
  <svg {...props} viewBox="0 0 640 512">
    <path d="M299.3 363.3c-6.2 6.3-16.4 6.3-22.6 0l-64-64c-6.3-6.2-6.3-16.4 0-22.6 6.2-6.3 16.4-6.3 22.6 0l52.7 52.7 116.7-116.7c6.2-6.3 16.4-6.3 22.6 0 6.3 6.2 6.3 16.4 0 22.6l-128 128zM272 32c59.5 0 112.1 29.55 144 74.8 14.5-6.93 30.8-10.8 48-10.8 61.9 0 112 50.1 112 112 0 10.7-1.5 20.1-4.3 30.8C612.3 260.2 640 302.9 640 352c0 70.7-57.3 128-128 128H144C64.47 480 0 415.5 0 336c0-62.8 40.15-116.1 96.17-135.9C100.3 106.6 177.4 32 272 32zm0 32c-77.4 0-140.5 61-143.9 137.5-.5 13.1-9 23.6-21.3 28.8C63.18 245.7 32 287.2 32 336c0 61.9 50.14 112 112 112h368c53 0 96-43 96-96 0-36.8-20.7-68.8-51.2-84.9-13.4-8-20-22.6-15.9-38 2-6.1 3.1-13.4 3.1-21.1 0-44.2-35.8-80-80-80-12.3 0-23.9 2.8-34.3 7.7-14 6.7-30.9 2.2-39.9-10.5C363.7 88.12 320.7 64 272 64z"></path>
  </svg>
);

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
  SavePosts: SavePostsIcon,
  Heart: HeartIcon,
  EyeOpen: EyeOpenIcon,
};

export const AntdIcons = {
  time: (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Icons.time} {...props} />
  ),
};
