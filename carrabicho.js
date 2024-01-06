const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Configuração do Sequelize para o banco de dados MySQL
const sequelize = new Sequelize('carrabicho', 'root', 'root', {
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
  isUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Profissional = sequelize.define('Profissional', {
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
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Agendamento = sequelize.define('Agendamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProfissional: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nomeProfissional:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  titulo:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Pets = sequelize.define('pets', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipoPet:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomePet:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  peso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});




// Sincronize o modelo com o banco de dados (isso criará a tabela se ainda não existir)
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
});

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());

// Rota para cadastrar um novo usuário
app.post('/cadastro', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const {
      nome,
      sobrenome,
      cpf,
      email,
      cel,
      nasc,
      sexo,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf,
      isUsuario
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
      senha: hashedPassword,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf,
      isUsuario
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

app.post('/loginUsuario', async (req, res) => {
  try {
    
    const { email, senha } = req.body;

    // Encontre o usuário com base no e-mail
    const user = await User.findOne({ where: { email } });

    // Se o usuário não existir, retorne um erro
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado. Tente novamente.' });
    }

    const hasedSenha = await bcrypt.compare(senha, user.senha);

    if (!hasedSenha) {
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
      isUsuario: user.isUsuario,
      status: 'Logado',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/loginProfissional', async (req, res) => {
  try {
    
    const { email, senha } = req.body;

    // Encontre o usuário com base no e-mail
    const profissional = await Profissional.findOne({ where: { email } });

    // Se o usuário não existir, retorne um erro
    if (!profissional) {
      return res.status(401).json({ error: 'Usuário não encontrado. Tente novamente.' });
    }

    const hasedSenha = await bcrypt.compare(senha, profissional.senha);

    if (!hasedSenha) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    // Se chegou até aqui, o login foi bem-sucedido
    // Agora, você pode retornar todos os dados do usuário
    res.json({
      id: profissional.id,
      nome: profissional.nome,
      sobrenome: profissional.sobrenome,
      cpf: profissional.cpf,
      email: profissional.email,
      telefone: profissional.telefone,
      nasc: profissional.nasc,
      sexo: profissional.sexo,
      cep: profissional.cep,
      endereco: profissional.endereco,
      nro: profissional.nro,
      complemento: profissional.complemento,
      bairro: profissional.bairro,
      cidade: profissional.cidade,
      uf: profissional.uf,
      isUsuario: profissional.isUsuario,
      valor: profissional.valor,
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

    // Verifica se pelo menos um dos parâmetros está presente
    if (!cpf && !email) {
      return res.status(400).json({ error: 'É necessário fornecer CPF ou E-mail.' });
    }

    // Verifica se o CPF já está cadastrado, se o parâmetro estiver presente
    if (cpf) {
      const existingCPFUser = await User.findOne({ where: { cpf } });
      if (existingCPFUser) {
        return res.json({ exists: true, message: 'CPF já cadastrado.' });
      }
    }

    // Verifica se o e-mail já está cadastrado, se o parâmetro estiver presente
    if (email) {
      const existingEmailUser = await User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.json({ exists: true, message: 'E-mail já cadastrado.' });
      }
    }

    // Se chegou até aqui, o CPF e/ou e-mail não estão cadastrados
    res.json({ exists: false, message: 'CPF e/ou e-mail não cadastrados.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/cadastro-profissional', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const {
      nome,
      sobrenome,
      cpf,
      email,
      cel,
      nasc,
      sexo,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf,
      tipo,
      valor,
      isUsuario
    } = req.body;

    // Crie um novo profissional no banco de dados
    const newProfissional = await Profissional.create({
      nome,
      sobrenome,
      cpf,
      email,
      telefone: cel, // Assuming 'telefone' corresponds to 'cel' (cellphone)
      nasc,
      sexo,
      senha: hashedPassword,
      cep,
      endereco,
      nro,
      complemento,
      bairro,
      cidade,
      uf,
      tipo,
      valor,
      isUsuario
    });

    res.json({
      id: newProfissional.id,
      status: 'Profissional criado com sucesso'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

app.get('/profissionais/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;

    // Encontre todos os profissionais com base no tipo
    const profissionais = await Profissional.findAll({ where: { tipo } });

    res.json(profissionais);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/agendamento', async (req, res) => {
  try {
    const { idUsuario, idProfissional, nomeProfissional, titulo, data, pet,hora, descricao } = req.body;

    // Valide os dados antes de inserir no banco de dados
    if (!idUsuario || !idProfissional || !data || !hora || !descricao) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios',
      });
    }

    // Adicione lógica para inserir o agendamento no banco de dados usando Sequelize
    const novoAgendamento = await Agendamento.create({
      idUsuario,
      idProfissional,
      nomeProfissional,
      titulo,
      data,
      hora,
      pet,
      descricao,
    });

    res.json({
      status: 'Agendamento criado com sucesso',
      idAgendamento: novoAgendamento.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
});

// Rota para buscar agendamentos por ID do usuário
app.get('/agendamentos/usuario/:idUsuario', async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const agendamentos = await Agendamento.findAll({ where: { idUsuario } });

    res.json(agendamentos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
});

app.get('/agendamentos/profissional/:idProfissional', async (req, res) => {
  try {
    const { idProfissional } = req.params;

    const agendamentos = await Agendamento.findAll({ where: { idProfissional } });

    res.json(agendamentos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
});


app.post('/pets', async (req, res) => {
  try {
    const { idUsuario, tipoPet, nomePet, raca, cor, peso,idade } = req.body;

    // Valide os dados antes de inserir no banco de dados
    if (!idUsuario || !tipoPet || !nomePet || !raca || !peso) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios',
      });
    }

    // Adicione lógica para inserir o agendamento no banco de dados usando Sequelize
    const novoPet = await Pets.create({
      idUsuario,
      tipoPet,
      nomePet,
      raca,
      cor,
      peso,
      idade,
    });

    res.json({
      status: 'Pet criado com sucesso',
      idPet: novoPet.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
});

// Rota para buscar agendamentos por ID do usuário
app.get('/pets/:idUsuario', async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const pets = await Pets.findAll({ where: { idUsuario } });

    res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
});





app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 8081');
});
