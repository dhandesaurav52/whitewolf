
'use server';

import { 
    getFirestore, 
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
    limit
} from "firebase/firestore";
import { app } from "./firebase";
import type { Product, Order, Advertisement, Reel, User } from './types';

if (!app) {
  throw new Error("Firebase is not initialized. Cannot use Firestore services.");
}

const db = getFirestore(app);

// Generic Firestore Functions
async function getAll<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function getById<T>(collectionName:string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
}

async function add<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data } as T;
}

async function update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
}

async function remove(collectionName: string, id: string): Promise<void> {
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
        const q = query(collection(db, "products"), where("new", "==", true), limit(4));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },
    getByCategory: async (category: string) => {
        const q = query(collection(db, "products"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
};

export const orders = {
    getAll: () => getAll<Order>('orders'),
    getById: (id: string) => getById<Order>('orders', id),
    getByUser: async (userId: string) => {
        const q = query(collection(db, "orders"), where("customer.userId", "==", userId), orderBy("orderDate", "desc"));
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
    remove: (id: string) => remove('reels', id),
}
