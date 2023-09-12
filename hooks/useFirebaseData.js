const {onValue} = require("firebase/database");
const {useEffect} = require("react");
const {useState} = require("react");


export default function useFirebaseData(ref, prefetchedData) {
    const [data, setData] = useState(prefetchedData)

    useEffect( () => {
        let removeFunc = onValue(ref, snapshot => {
            let data = snapshot.val();
            setData(data);
        });

        return ()=>{
            removeFunc()
        }
    }, [ref]);

    return data;
}
