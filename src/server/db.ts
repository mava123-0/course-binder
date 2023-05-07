import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore_db } from "./firebase";
import { Channel, User } from "~/types";

export const getUserInfo = async (email: string) => {
    const userInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "==", email)
        )
    );

    if(!userInfoSnapshot || userInfoSnapshot.empty) {
        throw new Error("User not found");
    }
    
    const userInfo = userInfoSnapshot.docs[0]?.data();

    return userInfo;
}

export const getfacultyInfo = async (email:string) => {
    const facultyInfoSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("member_emails", 'array-contains', email)
        )
    );

    if(!facultyInfoSnapshot || facultyInfoSnapshot.empty) {
        throw new Error("Faculty does not belong to any channels");
    }
    
    // const userInfo = userInfoSnapshot.docs[0]?.data();
    const facultyCourseInfoLength = facultyInfoSnapshot.docs.length;
    var facultyCourseInfoArray = [];
    for (let i = 0; i < facultyCourseInfoLength; i++) {
        facultyCourseInfoArray.push(facultyInfoSnapshot.docs[i]?.data())
    }

    return facultyCourseInfoArray;
}

export const getAllChannels = async () => {
    const channelsSnapshot = await getDocs(
        collection(firestore_db, "channels")
    );

    if(!channelsSnapshot || channelsSnapshot.empty) {
        throw new Error("Channels not found");
    }

    const channels = channelsSnapshot.docs.map(doc => doc.data()) as Channel[];

    return channels;
}

export const getAllUsers = async () => {
    const usersSnapshot = await getDocs(
        collection(firestore_db, "users")
    );

    if(!usersSnapshot || usersSnapshot.empty) {
        throw new Error("Users not found");
    }

    console.log(usersSnapshot)

    const users = usersSnapshot.docs.map(doc => doc.data()) as User[];

    return users;
}

export const getUsersInEmailList = async (email_list: string[]) => {
    const usersSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "in", email_list)
        )
    );

    if(!usersSnapshot || usersSnapshot.empty) {
        throw new Error("Users not found");
    }

    const users = usersSnapshot.docs.map(doc => doc.data());

    return users;
}

export const getUsersNotInEmailList = async (email_list: string[]) => {
    const usersSnapshot = await getDocs(
        query(
            collection(firestore_db, "users"),
            where("email", "not-in", email_list)
        )
    );

    if(!usersSnapshot || usersSnapshot.empty) {
        throw new Error("Users not found");
    }

    const users = usersSnapshot.docs.map(doc => doc.data());

    return users;
}

export const addUserToChannel = async (channel_code: string, email: string) => {
    const channelSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "==", channel_code)
        )
    );

    if(!channelSnapshot || channelSnapshot.empty) {
        throw new Error("Channel not found");
    }

    const channel = channelSnapshot.docs[0];

    const new_member_emails = [...channel?.data().member_emails, email];

    if(!channel) {
        throw new Error("Channel not found");
    }
    
    await updateDoc(channel.ref,
        {
            member_emails: new_member_emails
        }
    )

    return {
        ...channel.data(),
        member_emails: new_member_emails
    };
}

export const removeUserFromChannel = async (channel_code: string, email: string) => {
    const channelSnapshot = await getDocs(
        query(
            collection(firestore_db, "channels"),
            where("channel_code", "==", channel_code)
        )
    );

    if(!channelSnapshot || channelSnapshot.empty) {
        throw new Error("Channel not found");
    }

    const channel = channelSnapshot.docs[0];

    const new_member_emails = channel?.data().member_emails.filter((member_email: string) => member_email !== email);

    if(!channel) {
        throw new Error("Channel not found");
    }
    
    await updateDoc(channel.ref,
        {
            member_emails: new_member_emails
        }
    )

    return {
        ...channel.data(),
        member_emails: new_member_emails
    };
}

export const createChannel = async (channel: Channel) => {
    console.log(channel);
    const status = await addDoc(collection(firestore_db, "channels"), channel);

    if(!status) {
        return false;
    }
    return true;
}