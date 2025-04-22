import styles from "../styles/AlterStack.module.css";

const PushPool = ({onPush, disabledIndexes, poolValues, gameStarted}) => {
    return (
        <div className={styles.pushPool}>
            <h1>Push Pool</h1>
            <div className={styles.elementBoxDiv}>
                {poolValues.map((value,index)=>(
                    <button 
                        key={index} 
                        className={styles.elementBox}
                        onClick={()=>onPush(value,index)}
                        disabled={!gameStarted || disabledIndexes.includes(index)}
                    >  {value} </button>
                ))}
            </div>
        </div>
    )
};

export default PushPool;