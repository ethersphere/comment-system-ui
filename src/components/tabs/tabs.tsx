import styles from "./tabs.module.scss";

interface TabsProps {
  tabs: string[];
  children: React.ReactNode;
  onTabChange: (index: number) => void;
  className?: string;
}

export function Tabs({ tabs, children, onTabChange, className }: TabsProps) {
  return (
    <>
      <div className={`${styles["swarm-comment-tabs"]} ${className}`}>
        {tabs.map((tab, index) => (
          <button key={tab} onClick={() => onTabChange(index)}>
            {tab}
          </button>
        ))}
      </div>
      <div className={styles["swarm-comment-tabs-content"]}>{children}</div>
    </>
  );
}
