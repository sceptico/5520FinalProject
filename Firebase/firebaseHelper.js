import { db } from './firebaseSetup';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

// Fetch all documents from a specified collection
export async function fetchAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (err) {
        console.error(`Error fetching documents from ${collectionName}:`, err);
    }
}


// Fetch a single item by ID from a specified collection
export async function getItem(collectionName, id) {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Document does not exist!");
        }
    } catch (err) {
        console.error(`Error fetching document from ${collectionName} with ID ${id}:`, err);
        throw err;
    }
}

export async function getItemsByCategory(collectionName, category) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().category === category) {
                items.push({ id: doc.id, ...doc.data() });
            }
        });
        return items;
    } catch (err) {
        console.error(`Error fetching documents from ${collectionName}:`, err);
    }
}


// Add a new document to a specified collection
export async function addDocument(collectionName, item) {
    try {
        await addDoc(collection(db, collectionName), item);
    } catch (err) {
        console.error(`Error adding document to ${collectionName}:`, err);
    }
}

// Update a specific document in a specified collection
export async function updateDocument(collectionName, id, updatedFields) {
    try {
        const itemRef = doc(db, collectionName, id);
        await updateDoc(itemRef, updatedFields);  // Pass only the fields to be updated
    } catch (err) {
        console.error(`Error updating document in ${collectionName}:`, err);
    }
}

// Delete a specific document from a specified collection

export async function deleteDocument(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`Document deleted from ${collectionName} with ID: ${id}`);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
