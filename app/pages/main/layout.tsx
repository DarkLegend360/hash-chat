import Image from "next/image";
import AuthForm from "../../components/AuthForm/layout";
import logo from "../../images/hashIcon.svg";
import styles from "./styles";
const Main = () => (
  <div className={styles.outerContainer}>
    <div className={styles.innerContainer}>
      <Image src={logo} alt="logo" />
      <h2 className={styles.headerText}>Sign in to your account</h2>
      <AuthForm />
    </div>
  </div>
);

export default Main;
