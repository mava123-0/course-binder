import { StorageReference } from 'firebase/storage';
import { ReactNode } from 'react';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: ROLE;
}

export enum ROLE {
    ADMIN = "admin",
    PRINCIPAL = "principal",
    HOD = "hod",
    FACULTY = "faculty"
}

export interface Channel {
    channel_type: "course" | "lab" | "",
    channel_code: string,
    channel_name: string,
    channel_department: string,
    channel_year: string | null,
    channel_template: string,
}

export interface ChannelMemberRelationship {
    email: string,
    channel_role: CHANNEL_ROLE,
    channel_code: string,
}

export enum CHANNEL_ROLE {
    COURSE_MENTOR = "course_mentor",
    FACULTY = "faculty"
}

export interface NavItem {
    label: string;
    component: ReactNode;
}

export interface CourseBinderError {
    type: ERROR_TYPE;
    message: string;
}

export enum ERROR_TYPE {
    USER_NOT_FOUND,
}

export interface FirebaseFile {
    name: string;
    fullPath: string; // Path in the storage filesystem
    empty: boolean;
    downloadURL: string;
    type: "file";
}

export interface FirebaseFolder {
    name: string;
    fullPath: string; // Path in the storage filesystem
    type: "folder";
    children: (FirebaseFile | FirebaseFolder)[];
}