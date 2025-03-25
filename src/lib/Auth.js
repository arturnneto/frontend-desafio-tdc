export const authenticate = async (username, password) => {
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else if (response.status === 401) {
            throw new Error("Usuário ou senha incorretos!");
        } else {
            throw new Error("Dados incorretos ou não cadastrados!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

