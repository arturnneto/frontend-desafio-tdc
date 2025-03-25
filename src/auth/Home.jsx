import React, { useEffect, useState } from 'react';
import axiosWithToken from '../lib/RequestInterceptor';
import Label from '../components/Label';
import Input from '../components/Input';
import Button from '../components/Button';


const Home = () => {
  const [form, setForm] = useState({ title: '', resume: '', authorName: '', authorEmail: '' });
  const [respostaErro, setRespostaErro] = useState([]);
  const [respostaOk, setRespostaOk] = useState(false);
  const [enviar, setEnviar] = useState(false);
  const [talkProposal, setTalkProposal] = useState([]);
  const getTalkProposal = () => {
    axiosWithToken.get('http://localhost:8080/talk-proposal')
      .then((response) => {
        console.log(response.data);
        console.log(response.data[0].title)
        if (response.status === 200) {
          setTalkProposal(response.data);
        } else {
          console.error(`Falha ao obter palestras: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao obter palestras:', error.message);
      });
  };
  useEffect(() => {
    getTalkProposal()
  }, [talkProposal]);

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        setRespostaErro(validationErrors);
        return;
    }
    salvarPalestra();
    setEnviar(true);
};

const salvarPalestra = () => {
  console.log(form);
  axiosWithToken.post('http://localhost:8080/talk-proposal', form)
      .then((response) => {
          if (response.status === 201) {
              setForm({ title: '', resume: '', authorName: '', authorEmail: '' });
              getTalkProposal();
          }
      })
      .catch((error) => {
          setRespostaErro(error.response.data?.errors || ['Algo deu errado! Revise os campos e tente novamente.']);
          console.error('Erro ao salvar palestra:', error.message);
      });
};

const validateForm = () => {
  const errors = [];
  if (!form.title) errors.push("O título é obrigatório.");
  if (!form.resume) errors.push("O resumo é obrigatória.");
  if (!form.authorName) errors.push("O nome do autor é obrigatório.");
  if (!form.authorEmail) errors.push("O email do autor é obrigatório.");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(form.authorEmail)) errors.push("Este não é um formato válido de e-mail.")
  return errors;
};

const handleForm = (field, value) => {
    setForm({ ...form, [field]: value });
};

  return (
  <div className='flex bg-gray-200 h-screen w-screen p-8 flex items-center justify-center'>
    <div className='overflow-y-auto max-h-[calc(100vh-10rem)]'>
      {talkProposal.length > 0 ? talkProposal.map ((palestra) => (
      <div>
        <div className="shadow-md rounded-lg bg-white m-4 p-4">
          <h4>
            Titulo:
            {palestra.title}
          </h4>
          <h4>
            Resumo:
            {palestra.resume}
          </h4>
          <h4>
            Palestrante:
            {palestra.authorName}
          </h4>
          <h4>
            Contato do Palestrante:
            {palestra.authorEmail}
          </h4>
        </div>
      </div>
      )) : <p>nada encontrado</p>}
      </div>

      <div className="p-4 my-auto bg-white shadow-md rounded-lg m-4 p-4 ml-16">
                <form>
                    <h2 className="p-4">{'Cadastrar Palestra'}</h2>
                    <div className="p-4 grid grid-cols-2 gap-8">
                        <div className="m-4">
                            <Label text="Title" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.title}
                                onChange={(e) => handleForm('title', e.target.value)}
                            />
                        </div>
                        <div className="m-4">
                            <Label text="Resume" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.resume}
                                onChange={(e) => handleForm('resume', e.target.value)}
                            />
                        </div>
                        <div className="m-4">
                            <Label text="Author Name" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.authorName}
                                onChange={(e) => handleForm('authorName', e.target.value)}
                            />
                        </div>
                        <div className="m-4">
                            <Label text="Author Email" />
                            <Input
                                type="text"
                                placeholder=""
                                value={form.authorEmail}
                                onChange={(e) => handleForm('authorEmail', e.target.value)}
                            />
                        </div>
                    </div>
                    {(!respostaOk && respostaErro.length > 0) && (
                        <div className="bg-red-300 text-white rounded-md px-4 py-2 mx-8 my-2">
                            {respostaErro.map((e, index) => (
                                <p key={index}>{e}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 p-8 items-center justify-end">
                        <Button onClick={handleSubmit} text={'Cadastrar'} />
                    </div>
                </form>
            </div>
  </div>
  )
};

export default Home;
