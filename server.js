import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import validator from 'validator'; // Correto para ES Modules


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Para conseguir __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar o body das requisições (form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Rota principal (GET /) → serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/formulario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/simular', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simulador.html'));
});

// Rota para envio do formulário
app.post('/enviar-formulario', async (req, res) => {
  let {
    nome, cpf, nascimento, estadoCivil, nomeConjuge, email, telefone, rg, 
    dataEmissao, cidadeNatal, nomeMae, profissao, rendaBruta, endereco, 
    cep, formaPagamento
  } = req.body;

  // Substituir valores ausentes por "Não informado" ou valores padrão
  nome = nome || 'Não informado';
  cpf = cpf || 'Não informado';
  nascimento = nascimento || 'Não informado';
  estadoCivil = estadoCivil || 'Não informado';
  nomeConjuge = nomeConjuge || 'Não informado';
  email = email || 'Não informado';
  telefone = telefone || 'Não informado';
  rg = rg || 'Não informado';
  dataEmissao = dataEmissao || 'Não informado';
  cidadeNatal = cidadeNatal || 'Não informado';
  nomeMae = nomeMae || 'Não informado';
  profissao = profissao || 'Não informado';
  rendaBruta = rendaBruta || 'Não informado';
  endereco = endereco || 'Não informado';
  cep = cep || 'Não informado';
  formaPagamento = formaPagamento || 'Não informado';

  // Validação de e-mail
  if (email !== 'Não informado' && !validator.isEmail(email)) {
    return res.status(400).send('Email inválido.');
  }

  // Validação de CPF (usando expressão regular simples para validação, por exemplo)
  if (cpf !== 'Não informado' && (!validator.isLength(cpf, { min: 11, max: 11 }) || !/^\d+$/.test(cpf))) {
    return res.status(400).send('CPF inválido.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Corpo do e-mail melhorado
    const mailContent = `
      <h3>Formulário preenchido por ${nome}</h3>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>CPF:</strong> ${cpf}</p>
      <p><strong>Data de nascimento:</strong> ${nascimento}</p>
      <p><strong>Estado Civil:</strong> ${estadoCivil}</p>
      <p><strong>Nome do cônjuge:</strong> ${nomeConjuge}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>RG:</strong> ${rg}</p>
      <p><strong>Data de emissão:</strong> ${dataEmissao}</p>
      <p><strong>Cidade Natal:</strong> ${cidadeNatal}</p>
      <p><strong>Nome da Mãe:</strong> ${nomeMae}</p>
      <p><strong>Profissão:</strong> ${profissao}</p>
      <p><strong>Renda Bruta:</strong> R$ ${rendaBruta}</p>
      <p><strong>Endereço:</strong> ${endereco}</p>
      <p><strong>CEP:</strong> ${cep}</p>
      <p><strong>Forma de pagamento:</strong> ${formaPagamento}</p>
    `;

    // Enviar e-mail
    await transporter.sendMail({
      from: email,
      to: 'derickcampossantos1@gmail.com',
      subject: 'Formulário preenchido pelo cliente',
      html: mailContent
    });

    res.send(`
      <script>
        alert("Formulário preenchido com sucesso!");
        window.location.href = "/";
      </script>
    `);
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send('Erro ao enviar o formulário. Tente novamente mais tarde.');
  }
});


// Rota para envio de email
app.post('/enviar-email', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).send('Preencha todos os campos');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: 'renato.cwi@gmail.com',
      subject: 'Formulário de contato do site',
      text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
    });

    res.send(`
      <script>
        alert("Mensagem enviada com sucesso!");
        window.location.href = "/";
      </script>
    `);
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send('Erro ao enviar email');
  }
});

// Inicia o servidor (funciona tanto local quanto na Render)
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;