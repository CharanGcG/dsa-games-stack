import styles from "../styles/AlterStack.module.css";

const Stats = ({currentSum, pushes, pops, target, difficulty}) =>{
    return (
        <div className={styles.stats}>
            <h1>Stats</h1>
            <div className={styles.statsDiv}>
            <p>Difficulty: {difficulty.toUpperCase()}</p>
            <p>Pushes: {pushes}</p>
            <p>Pops: {pops}</p>
            <p>Target: {target}</p>
            <p>Current Sum: {currentSum}</p>
            </div>
        </div>
    )
};

export default Stats;