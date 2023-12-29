const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Configuração do Sequelize para o banco de dados MySQL
const sequelize = new Sequelize('test', 'alex', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Definição do modelo de usuário
const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nasc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


// // Sincronize o modelo com o banco de dados (isso criará a tabela se ainda não existir)
// sequelize.sync().then(() => {
//   console.log('Banco de dados sincronizado');
// });

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

// Rota para cadastrar um novo usuário
app.post('/cadastro', async (req, res) => {
  try {
    const {
      nome,
      sobrenome,
      cpf,
      email,
      cel,
      nasc,
      sexo,
      senha,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf
    } = req.body;

    // Crie um novo usuário no banco de dados
    const newUser = await User.create({
      nome,
      sobrenome,
      cpf,
      email,
      telefone: cel, // Assuming 'telefone' corresponds to 'cel' (cellphone)
      nasc,
      sexo,
      senha,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf,
    });

    res.json({
      id: newUser.id,
      status: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Encontre o usuário com base no e-mail
    const user = await User.findOne({ where: { email } });

    // Se o usuário não existir, retorne um erro
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado. Tente novamente.' });
    }

    // Se a senha estiver incorreta, retorne um erro
    if (user.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    // Se chegou até aqui, o login foi bem-sucedido
    // Agora, você pode retornar todos os dados do usuário
    res.json({
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      cpf: user.cpf,
      email: user.email,
      telefone: user.telefone,
      nasc: user.nasc,
      sexo: user.sexo,
      cep: user.cep,
      endereco: user.endereco,
      nro: user.nro,
      complemento: user.complemento,
      bairro: user.bairro,
      cidade: user.cidade,
      uf: user.uf,
      status: 'Logado',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/verificar-usuario', async (req, res) => {
  try {
    const { cpf, email } = req.body;

    // Verifica se o CPF já está cadastrado
    const existingCPFUser = await User.findOne({ where: { cpf } });
    if (existingCPFUser) {
      return res.json({ exists: true, message: 'CPF já cadastrado.' });
    }

    // Verifica se o e-mail já está cadastrado
    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      return res.json({ exists: true, message: 'E-mail já cadastrado.' });
    }

    // Se chegou até aqui, o CPF e o e-mail não estão cadastrados
    res.json({ exists: false, message: 'CPF e e-mail não cadastrados.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
