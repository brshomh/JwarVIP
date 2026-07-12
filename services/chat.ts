
import { Persona } from './persona';

export interface ChatContact {
    id: string;
    persona: Persona;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
    isOnline: boolean;
    isUnlocked?: boolean; 
}

export interface TextMessage {
    id: string;
    sender: 'user' | 'contact';
    text: string;
    timestamp: number;
}

const STORAGE_KEY = 'jawr_chats_real_v1';

export const ChatService = {
    getContacts: (): ChatContact[] => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    saveContact: (persona: Persona) => {
        const contacts = ChatService.getContacts();
        const existingIndex = contacts.findIndex(c => c.id === persona.id);
        
        if (existingIndex >= 0) {
            contacts[existingIndex].lastMessageTime = Date.now();
            contacts[existingIndex].isOnline = true; 
            const contact = contacts.splice(existingIndex, 1)[0];
            contacts.unshift(contact);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
            return;
        }

        const newContact: ChatContact = {
            id: persona.id,
            persona: persona,
            lastMessage: 'Video Call Ended',
            lastMessageTime: Date.now(),
            unreadCount: 0,
            isOnline: true,
            isUnlocked: false 
        };

        contacts.unshift(newContact); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    },

    unlockContact: (contactId: string) => {
        const contacts = ChatService.getContacts();
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            contact.isUnlocked = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        }
    },

    getMessages: (contactId: string): TextMessage[] => {
        const key = `jawr_msgs_real_${contactId}`;
        try {
             return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    },

    saveIncomingMessage: (contactId: string, text: string): TextMessage => {
        const key = `jawr_msgs_real_${contactId}`;
        const messages = ChatService.getMessages(contactId);
        
        const newMsg: TextMessage = {
            id: Date.now().toString() + Math.random(),
            sender: 'contact',
            text: text,
            timestamp: Date.now()
        };
        messages.push(newMsg);
        localStorage.setItem(key, JSON.stringify(messages));

        // Update Contact Last Message
        const contacts = ChatService.getContacts();
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        if (contactIndex >= 0) {
            contacts[contactIndex].lastMessage = text;
            contacts[contactIndex].lastMessageTime = Date.now();
            contacts[contactIndex].unreadCount += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        }
        
        return newMsg;
    },

    sendMessage: async (contactId: string, text: string, onReply?: (msg: TextMessage) => void): Promise<TextMessage> => {
        const key = `jawr_msgs_real_${contactId}`;
        const messages = ChatService.getMessages(contactId);
        
        // 1. Save User Message
        const newMsg: TextMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: text,
            timestamp: Date.now()
        };
        messages.push(newMsg);
        localStorage.setItem(key, JSON.stringify(messages));
        
        // Update Last Message
        const contacts = ChatService.getContacts();
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        if (contactIndex >= 0) {
            contacts[contactIndex].lastMessage = text;
            contacts[contactIndex].lastMessageTime = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        }

        return newMsg;
    }
};
