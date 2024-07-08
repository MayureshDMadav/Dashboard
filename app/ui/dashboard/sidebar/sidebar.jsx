import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdUpload,
  MdDashboardCustomize,
} from "react-icons/md";
import { auth } from "@/app/auth";
import { useSignOut } from "@/app/authentication";

const menuItems = [
  {
    title: "Main",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Merchant List",
        path: "/dashboard/merchants",
        icon: <MdShoppingBag />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Upload",
        path: "/dashboard/upload",
        icon: <MdUpload />,
      },
      {
        title: "Customize",
        path: "/dashboard/customize",
        icon: <MdDashboardCustomize />,
      },
    ],
  },
];

const SideBar = async () => {
  const session = await auth();

  //Handling Menu On the basis Of Users
  const filteredMenuItems = menuItems
    .map((category) => ({
      ...category,
      list: category.list.filter((item) =>
        !session.user.isAdmin
          ? item.title !== "Users" && item.title !== "Reports" && item.title !== "Revenue" && item.title !== "Settings" && item.title !== "Customize"
           : item
      ),
    }))
    .filter((category) => category.list.length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>
            {session?.user?.username ? session?.user?.username : "Unknow"}
          </span>
          <span className={styles.userTitle}>
            {session?.user?.isAdmin ? "Admin" : "User"}
          </span>
        </div>
      </div>
      <ul className={styles.list}>
        {filteredMenuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form action={useSignOut}>
        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
      </form>
    </div>
  );
};

export default SideBar;
