import styles from "../styles/AlterStack.module.css";

const StackDiv = ({stack, onPop, onSub, target, currentSum, gameStarted}) => {
    return (
        <div className={styles.stackDiv}>
            <h1>Stack</h1>
            <div className={styles.stackAndButtons}>
                <div className={styles.stackButtons}>
                    <button onClick={onPop} disabled={!gameStarted || stack.length<=0} >Pop</button>
                    <button onClick={onSub} disabled={!gameStarted || target!==currentSum} >Submit</button>
                </div>
                <div className={styles.stack}>
                    {[...stack].map((value,index)=>(
                        <div key={index} className={styles.stackItem} >{value}</div>
                    ))}
                </div>
            </div>

        </div>
    )
};

export default StackDiv;