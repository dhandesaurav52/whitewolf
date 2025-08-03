
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Order, Advertisement, Reel, User, ProfileAddress } from './types';

// Generic Firestore Functions
async function getAll<T>(collectionName: string): Promise<T[]> {
    if (!db) throw new Error("Firestore is not initialized.");
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function getById<T>(collectionName:string, id: string): Promise<T | null> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
}

async function add<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = await addDoc(collection(db, collectionName), data);
    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() } as T;
}

async function update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
}

async function set<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge: true });
}

async function remove(collectionName: string, id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

// Specific functions for each data type
export const products = {
    getAll: () => getAll<Product>('products'),
    getById: (id: string) => getById<Product>('products', id),
    add: (data: Omit<Product, 'id'>) => add<Product>('products', data),
    update: (id: string, data: Partial<Product>) => update<Product>('products', id, data),
    remove: (id: string) => remove('products', id),
    getNewArrivals: async () => {
        if (!db) throw new Error("Firestore is not initialized.");
        const q = query(collection(db, "products"), where("new", "==", true), limit(4));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },
    getByCategory: async (category: string) => {
        if (!db) throw new Error("Firestore is not initialized.");
        const q = query(collection(db, "products"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
};

export const orders = {
    getAll: () => getAll<Order>('orders'),
    getById: (id: string) => getById<Order>('orders', id),
    getByUser: async (userId: string) => {
        if (!db) throw new Error("Firestore is not initialized.");
        const q = query(collection(db, "orders"), where("customer.userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },
    add: (data: Omit<Order, 'id'>) => add<Order>('orders', data),
    update: (id: string, data: Partial<Order>) => update<Order>('orders', id, data),
};

export const ads = {
    getAll: () => getAll<Advertisement>('advertisements'),
    add: (data: Omit<Advertisement, 'id'>) => add<Advertisement>('advertisements', data),
    update: (id: string, data: Partial<Advertisement>) => update<Advertisement>('advertisements', id, data),
    remove: (id: string) => remove('advertisements', id),
};

export const reels = {
    getAll: () => getAll<Reel>('reels'),
    add: (data: Omit<Reel, 'id'>) => add<Reel>('reels', data),
    update: (id: string, data: Partial<Reel>) => update<Reel>('reels', id, data),
    remove: (id: string) => remove('reels', id),
};

export const profiles = {
    get: (userId: string) => getById<ProfileAddress>('profiles', userId),
    set: (userId: string, data: Partial<ProfileAddress>) => set<ProfileAddress>('profiles', userId, data),
    getByEmail: async (email: string) => {
        if (!db) throw new Error("Firestore is not initialized.");
        const q = query(collection(db, "users"), where("email", "==", email), limit(1));
        const userQuerySnapshot = await getDocs(q);
        if (userQuerySnapshot.empty) {
            // Fallback or specific logic for orders where user might not be in a 'users' collection
            // For now, we assume we need to check the profile attached to the user ID
            const ordersQuery = query(collection(db, "orders"), where("customer.email", "==", email), limit(1));
            const orderQuerySnapshot = await getDocs(ordersQuery);
            if(!orderQuerySnapshot.empty){
                const order = orderQuerySnapshot.docs[0].data() as Order;
                if(order.customer.userId){
                    return getById<ProfileAddress>('profiles', order.customer.userId);
                }
            }
            return null;
        }
        const userDoc = userQuerySnapshot.docs[0];
        return getById<ProfileAddress>('profiles', userDoc.id);
    }
}
