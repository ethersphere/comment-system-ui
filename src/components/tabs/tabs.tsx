import styles from "./tabs.module.scss";

interface TabsProps {
  tabs: string[];
  children: React.ReactNode;
  onTabChange: (index: number) => void;
}

export function Tabs({ tabs, children, onTabChange }: TabsProps) {
  return (
    <>
      <div className={styles["swarm-comment-tabs"]}>
        {tabs.map((tab, index) => (
          <button onClick={() => onTabChange(index)}>{tab}</button>
        ))}
      </div>
      <div>{children}</div>
    </>
  );
}
