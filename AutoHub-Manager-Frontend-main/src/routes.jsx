import { Home } from "@/pages";
import Usersignup from "./signup/Usersignup";
import Companysignup from"./signup/Companysignup";
import Mifotrasignup from "./signup/Mifotrasignup";
import {
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

export const routes = [
  {
    icon: HomeIcon,
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    icon: UserPlusIcon,
    name: "Usersignup",
    path: "/Usersignup",
    element: <Usersignup />,
  },
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Companysignup",
    path: "/Companysignup",
    element: <Companysignup />,
  },
  {
    icon: DocumentTextIcon,
    name: "Mifotrasignup",
    path: "/Mifotrasignup",
    element: <Mifotrasignup />,
  },
 
];

export default routes;
