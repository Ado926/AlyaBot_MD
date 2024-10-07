import { promises as fs } from 'fs';
import fetch from 'node-fetch';

// Ruta del archivo characters.json (remoto en GitHub)
const charactersUrl = 'https://raw.githubusercontent.com/Elpapiema/Adiciones-para-AlyaBot-RaphtaliaBot-/refs/heads/main/image_json/characters.json';

// Función para cargar el archivo characters.json desde GitHub
async function loadCharacters() {
    try {
        const res = await fetch(charactersUrl);
        if (!res.ok) {
            throw new Error('No se pudo cargar el archivo characters.json desde GitHub.');
        }
        const characters = await res.json();
        return characters;
    } catch (error) {
        throw new Error('No se pudo cargar el archivo characters.json.');
    }
}

// Definición del handler del comando 'rw' o 'rollwaifu'
let handler = async (m, { conn }) => {
    try {
        const characters = await loadCharacters();
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

        const message = `
✨ *Nombre*: ${randomCharacter.name}
🎂 *Edad*: ${randomCharacter.age}
💖 *Estado Sentimental*: ${randomCharacter.relationship}
📚 *Origen*: ${randomCharacter.source}
        `;

        // Verificar si la URL de la imagen es válida antes de enviarla
        if (!randomCharacter.img || !randomCharacter.img.startsWith('http')) {
            throw new Error('URL de imagen no válida');
        }

        // Enviar el mensaje con la información del personaje junto con la imagen
        const sentMsg = await conn.sendFile(m.chat, randomCharacter.img, 'waifu.jpg', message, m);

        // Almacenar el personaje generado con el ID del mensaje enviado por el bot
        if (!global.lastCharacter) global.lastCharacter = {};
        global.lastCharacter[sentMsg.key.id] = randomCharacter; // Guardar usando el ID del mensaje del bot

    } catch (error) {
        await conn.reply(m.chat, `Error al cargar el personaje: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['rw', 'rollwaifu'];
handler.tags = ['anime'];
handler.command = /^(rw|rollwaifu)$/i; // Comandos "rw" y "rollwaifu"

export default handler;