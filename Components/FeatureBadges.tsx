import {
  IconTruck,
  IconShieldCheck,
  IconFlame,
  IconHeadset,
} from "@tabler/icons-react";
import styles from "./Home.module.css";
const benefits = [
  {
    icon: IconTruck,
    title: "Free Delivery",
    text: "Orders over 500 EGP",
    color: "blue",
  },
  {
    icon: IconShieldCheck,
    title: "Quality Promise",
    text: "100% organic & fresh",
    color: "green",
  },
  {
    icon: IconFlame,
    title: "Daily Deals",
    text: "Up to 40% off daily",
    color: "orange",
  },
  {
    icon: IconHeadset,
    title: "24/7 Support",
    text: "Dedicated assistance",
    color: "purple",
  },
];
export default function FeatureBadges() {
  return (
    <section
      className={styles.benefits}
      aria-label="FreshCart shopping benefits"
    >
      {benefits.map(({ icon: Icon, title, text, color }) => (
        <div className={styles.benefit} key={title}>
          <span className={styles[color]}>
            <Icon size={24} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
