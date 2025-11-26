// --- 1. USUARIOS BASE (Identity/Authentication) ---
import { User, Profile } from '../types/user';

export const MOCK_USERS: User[] = [
    {
        id: 'user-001-tania',
        email: 'tania@app.com',
        username: 'TaniaDev',
        passwordHash: 'fakehash1',
        createdAt: new Date('2024-01-15T08:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 'user-002-andres',
        email: 'andres@app.com',
        username: 'Andres_Fit',
        passwordHash: 'fakehash2',
        createdAt: new Date('2024-03-20T12:30:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 'user-003-carmen',
        email: 'carmen@app.com',
        username: 'Carmen_Reads',
        passwordHash: 'fakehash3',
        createdAt: new Date('2024-05-10T16:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 'user-004-david',
        email: 'david@app.com',
        username: 'David_Coder',
        passwordHash: 'fakehash4',
        createdAt: new Date('2024-07-01T10:00:00Z'),
        updatedAt: new Date(),
    },
    {
        id: 'user-005-elena',
        email: 'elena@app.com',
        username: 'Elena_Mind',
        passwordHash: 'fakehash5',
        createdAt: new Date('2024-09-05T14:45:00Z'),
        updatedAt: new Date(),
    },
];

// --- 2. PERFILES (Public/Editable Details) ---

export const MOCK_PROFILES: Profile[] = [
    {
        id: 'profile-001',
        userId: MOCK_USERS[0].id,
        fullName: 'Tania Rodríguez',
        avatarURL: null,
        bio: 'Desarrolladora enfocada en metas diarias y productividad. 💻',
        location: 'Madrid, España',
        user: MOCK_USERS[0],
    },
    {
        id: 'profile-002',
        userId: MOCK_USERS[1].id,
        fullName: 'Andrés García',
        avatarURL: null,
        bio: 'Amante del fitness y las rachas de ejercicio.',
        location: 'Ciudad de México, México',
        user: MOCK_USERS[1],
    },
    {
        id: 'profile-003',
        userId: MOCK_USERS[2].id,
        fullName: 'Carmen López',
        avatarURL: null,
        bio: 'Mi meta es leer 20 páginas diarias.',
        location: 'Bogotá, Colombia',
        user: MOCK_USERS[2],
    },
    {
        id: 'profile-004',
        userId: MOCK_USERS[3].id,
        fullName: 'David M. Soto',
        avatarURL: null,
        bio: 'Enfocado en aprender React Native y Zod.',
        location: 'Barcelona, España',
        user: MOCK_USERS[3],
    },
    {
        id: 'profile-005',
        userId: MOCK_USERS[4].id,
        fullName: 'Elena Rivas',
        avatarURL: null,
        bio: 'Practicando meditación y atención plena.',
        location: 'Buenos Aires, Argentina',
        user: MOCK_USERS[4],
    },
];