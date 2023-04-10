import {firestore} from "firebase-admin";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;


export const getCollection = ( name: string ): firestore.CollectionReference => {
    return firestore().collection( name );
}

export const getLastDocument = async ( colName: string, filter?: FirebaseFirestore.Filter ): Promise<QueryDocumentSnapshot | undefined> => {
    const collection = getCollection( colName );
    if ( filter ) {
        collection.where( filter );
    }
    const query = await collection
        .orderBy("createDateTime", "desc")
        .limit(1)
        .get();
    return query?.docs[0];
}