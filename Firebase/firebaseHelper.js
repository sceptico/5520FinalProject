import { db } from './firebaseSetup';
import { query, where, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc, GeoPoint } from "firebase/firestore";

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

// export async function getItemsByCategory(collectionName, category) {
//     try {
//         const querySnapshot = await getDocs(collection(db, collectionName));
//         const items = [];
//         querySnapshot.forEach((doc) => {
//             if (doc.data().category === category) {
//                 items.push({ id: doc.id, ...doc.data() });
//             }
//         });
//         return items;
//     } catch (err) {
//         console.error(`Error fetching documents from ${collectionName}:`, err);
//     }
// }

export async function getItemsByCategory(collectionName, { mainCategory, subCategory }) {
    try {
      // Initialize query
      let queryRef = collection(db, collectionName);
  
      // Add filters dynamically
      if (mainCategory) {
        queryRef = query(queryRef, where("mainCategory", "==", mainCategory));
      }
      if (subCategory) {
        queryRef = query(queryRef, where("subCategory", "==", subCategory));
      }
  
      // Execute query
      const querySnapshot = await getDocs(queryRef);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
  
      return items;
    } catch (err) {
      console.error(`Error fetching documents from ${collectionName}:`, err);
      throw err; // Re-throw error for further handling
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

export async function getUserLikesOrInterests(userId, collectionName) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const itemIds = userData[collectionName === 'Product' ? 'likedProducts' : 'interestedEvents'] || [];

        const items = await fetchItemsByIds(collectionName, itemIds);
        return items;
        } else {
        console.log("User not found");
        return [];
        }
    } catch (error) {
        console.error("Error fetching user likes or interests:", error);
    }
}

async function fetchItemsByIds(collectionName, itemIds) {
    const items = [];
    try {
        for (const id of itemIds) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            items.push({ id: docSnap.id, ...docSnap.data() });
        }
        }
    } catch (error) {
        console.error(`Error fetching items from ${collectionName}:`, error);
    }
    return items;
    }

export async function fetchUserListingsOrReminders(userId, collectionName) {
    try {
        const q = query(collection(db, collectionName), where('ownerId', '==', userId));
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (error) {
        console.error("Error fetching user listings:", error);
    }
}

export async function isLikedByUser(docId, userId, collectionName) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        //console.log('userDoc:', userDoc);
        

        const userData = userDoc.data();
        if (collectionName === "Product") {
            const userLikedProducts = userData.likedProducts || [];
            return userLikedProducts.includes(docId);
        } else {
            const userInterestedEvents = userData.interestedEvents || []
            return userInterestedEvents.includes(docId)
        }
    } catch (error) {
        console.error('Error checking if item is liked:', error)
        return false;
    }
}

export async function writeUserDataToFirestore(userId, email, displayName) {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        userName: displayName, // Store the username as displayName
        email: email,
        uid: userId,
        photoURL: null, // Set photoURI to null initially
        likedProducts: [], // Initialize liked products array
        interestedEvents: [], // Initialize interested events array
        location: new GeoPoint(0, 0),  // Add location field with default GeoPoint
      });
  
      console.log("User data written to Firestore");
    } catch (error) {
      console.error("Error writing user data to Firestore:", error);
    }
  }

  export async function writeDocumentWithSpecificId(collectionName, documentId, data) {
  try {
    const docRef = doc(db, collectionName, documentId); // Specify the collection and document ID
    await setDoc(docRef, data); // Write the data to Firestore
    console.log("Document written with ID:", documentId);
  } catch (error) {
    console.error("Error writing document:", error);
  }
}
  
