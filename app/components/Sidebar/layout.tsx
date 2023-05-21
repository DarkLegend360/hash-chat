import getCurrentUser from "../../actions/getCurrentUser";
import DesktopSidebar from "../DesktopSidebar/layout";
import MobileFooter from "../MobileFooter/layout";

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
};

export default Sidebar;
