import styles from "./tabs.module.scss";

interface TabsProps {
  tabs: string[];
  disabled?: boolean[];
  children: React.ReactNode;
  onTabChange: (index: number) => void;
}

export function Tabs({ tabs, children, disabled, onTabChange }: TabsProps) {
  return (
    <>
      <div className={styles["swarm-comment-tabs"]}>
        {tabs.map((tab, index) => (
          <button
            disabled={disabled && disabled[index]}
            onClick={() => onTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </>
  );
}
