import {limitToLast, orderByChild, orderByKey, query,ref,get} from "firebase/database";
import {firebaseDb} from "../firebase-config"

export async function checkIsOrdered(refPath,orderField) {
    let quer = query(ref(firebaseDb, refPath), limitToLast(1));
    let snapshot = await get(quer);
    let isOrdered = false;
    snapshot.forEach((snap) => {
        if (!snap.exists()) return;
        if (snap.val()[orderField]) isOrdered = true;
    });

    return isOrdered;
}

export async function getSnapshot(path,orderBy){
    let quer = await query(ref(firebaseDb, path)
        ,(orderBy ? orderByChild(orderBy) : orderByKey())
    );

    let snapshot = await get(quer);
    let items =[];
    snapshot.forEach((snap)=>{
        items.unshift(snap.val());
    })
    //handle single items
    if(items.length ===0){items = snapshot.val();}
    return items;
}

export async function getAsObject(path){
    let quer = await query(ref(firebaseDb, path));
    let snapshot = await get(quer);
    return snapshot.val();
}