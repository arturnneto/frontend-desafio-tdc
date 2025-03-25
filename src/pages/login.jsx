import React, { useState } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { authenticate } from '../lib/Auth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Label from '../components/Label';
import Button from '../components/Button';

const Login = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Definindo o estado para a mensagem de erro

    const handleClickEntrar = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpar mensagem de erro ao tentar login novamente
        try {
            await authenticate(username, password).then((response) => {
                setToken(response.accessToken);
                console.log(response.accessToken);
                navigate("/home", { replace: true });
            });
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error.message);
        }
    };

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className='h-screen w-screen bg-gray-200'>
            <div className="h-screen flex items-center justify-center">
                <div>
                    <form className="bg-white shadow-md rounded-lg px-16 pt-6 pb-8 mb-4">
                        <div className="mb-6">
                            <Label text="Usuário" />
                            <Input type="text" placeholder="" onChange={handleChangeUsername} />
                        </div>
                        <div className="mb-6">
                            <Label text="Senha" />
                            <Input type="password" placeholder="" onChange={handleChangePassword} />
                        </div>
                        {errorMessage && (
                            <div className="mb-4 text-red-500 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <Button text="Entrar" onClick={handleClickEntrar} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;