import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
const PDFDocument = require('pdfkit');
import dotenv from 'dotenv';
// import validator from 'validator'; // Correto para ES Modules
const fs = require('fs');

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
// Rota para envio do formulário
app.post('/enviar-formulario', async (req, res) => {
  const {
    nome = 'Não informado',
    cpf = 'Não informado',
    nascimento = 'Não informado',
    estadoCivil = 'Não informado',
    nomeConjuge = 'Não informado',
    email = 'Não informado',
    telefone = 'Não informado',
    rg = 'Não informado',
    dataEmissao = 'Não informado',
    cidadeNatal = 'Não informado',
    nomeMae = 'Não informado',
    profissao = 'Não informado',
    rendaBruta = 'Não informado',
    endereco = 'Não informado',
    cep = 'Não informado',
    formaPagamento = 'Não informado'
  } = req.body;

  try {
    // Gerar o PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'formulario.pdf');
    
    doc.pipe(fs.createWriteStream(filePath));

    // Adicionar conteúdo ao PDF
    doc.fontSize(16).text(`Formulário preenchido por: ${nome}`, { align: 'center' });
    doc.fontSize(12).moveDown();
    doc.text(`Nome: ${nome}`);
    doc.text(`CPF: ${cpf}`);
    doc.text(`Data de nascimento: ${nascimento}`);
    doc.text(`Estado Civil: ${estadoCivil}`);
    doc.text(`Nome do cônjuge: ${nomeConjuge}`);
    doc.text(`Email: ${email}`);
    doc.text(`Telefone: ${telefone}`);
    doc.text(`RG: ${rg}`);
    doc.text(`Data de emissão: ${dataEmissao}`);
    doc.text(`Cidade Natal: ${cidadeNatal}`);
    doc.text(`Nome da Mãe: ${nomeMae}`);
    doc.text(`Profissão: ${profissao}`);
    doc.text(`Renda Bruta: ${rendaBruta}`);
    doc.text(`Endereço: ${endereco}`);
    doc.text(`CEP: ${cep}`);
    doc.text(`Forma de pagamento: ${formaPagamento}`);

    doc.end();

    // Configurar o transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Enviar o e-mail com o PDF em anexo
    const mailOptions = {
      from: email,
      to: 'derickcampossantos1@gmail.com',
      subject: 'Formulário preenchido pelo cliente',
      text: 'O formulário foi preenchido e está anexado como PDF.',
      attachments: [
        {
          filename: 'formulario.pdf',
          path: filePath
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Enviar resposta ao cliente
    res.send(`
      <script>
        alert("Formulário preenchido com sucesso! O PDF foi enviado.");
        window.location.href = "/";
      </script>
    `);

  } catch (error) {
    console.error('Erro ao enviar o formulário ou gerar o PDF:', error);
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