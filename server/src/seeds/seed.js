import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Member from '../models/Member.js';
import Cell from '../models/Cell.js';
import Event from '../models/Event.js';
import Post from '../models/Post.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB para seed...');

    // Limpar coleções
    await Promise.all([User.deleteMany(), Member.deleteMany(), Cell.deleteMany(), Event.deleteMany(), Post.deleteMany()]);
    console.log('🗑️  Coleções limpas.');

    // Criar Admin
    const admin = await User.create({
      name: 'Pastor Thiago Galdino',
      email: 'admin@igrejashema.com',
      password: 'Shema@2024',
      role: 'admin',
    });

    // Criar Membros
    const members = await Member.insertMany([
      { name: 'Ana Clara Sousa', phone: '(85) 99001-1111', whatsapp: '(85) 99001-1111', email: 'ana@email.com', status: 'membro', ministry: 'Louvor', address: { neighborhood: 'Aldeota', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1995-03-15'), baptismDate: new Date('2015-06-20') },
      { name: 'Carlos Eduardo Lima', phone: '(85) 99002-2222', whatsapp: '(85) 99002-2222', email: 'carlos@email.com', status: 'lider', ministry: 'Jovens', address: { neighborhood: 'Meireles', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1990-07-22') },
      { name: 'Mariana Ferreira', phone: '(85) 99003-3333', status: 'membro', ministry: 'Infantil', address: { neighborhood: 'Parangaba', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1998-11-05') },
      { name: 'João Pedro Santos', phone: '(85) 99004-4444', status: 'visitante', address: { neighborhood: 'Messejana', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('2001-04-18') },
      { name: 'Rafaela Monteiro', phone: '(85) 99005-5555', status: 'discipulado', ministry: 'Mulheres', address: { neighborhood: 'Benfica', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1992-09-30') },
      { name: 'Lucas Cavalcante', phone: '(85) 99006-6666', status: 'membro', ministry: 'Mídia', address: { neighborhood: 'Jacarecanga', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1997-01-12') },
      { name: 'Fernanda Alves', phone: '(85) 99007-7777', status: 'membro', ministry: 'Intercessão', address: { neighborhood: 'Fátima', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1985-06-08') },
      { name: 'Roberto Nunes', phone: '(85) 99008-8888', status: 'lider', ministry: 'Homens', address: { neighborhood: 'Centro', city: 'Fortaleza', state: 'CE' }, birthDate: new Date('1983-12-25') },
    ]);

    // Criar Células
    const cells = await Cell.insertMany([
      { name: 'Célula Koinonia', leader: members[1]._id, members: [members[0]._id, members[2]._id], meetingDay: 'quinta', meetingTime: '19:30', location: 'Aldeota, Fortaleza', description: 'Célula de jovens e adultos' },
      { name: 'Célula Ágape', leader: members[7]._id, members: [members[4]._id, members[6]._id], meetingDay: 'sexta', meetingTime: '20:00', location: 'Meireles, Fortaleza', description: 'Célula do Ministério de Mulheres' },
      { name: 'Célula Shalom', leader: members[1]._id, members: [members[3]._id, members[5]._id], meetingDay: 'quarta', meetingTime: '19:00', location: 'Messejana, Fortaleza', description: 'Célula de crescimento' },
    ]);

    // Atualizar membros com célula
    await Member.findByIdAndUpdate(members[0]._id, { cell: cells[0]._id });
    await Member.findByIdAndUpdate(members[2]._id, { cell: cells[0]._id });
    await Member.findByIdAndUpdate(members[4]._id, { cell: cells[1]._id });
    await Member.findByIdAndUpdate(members[6]._id, { cell: cells[1]._id });

    // Criar Eventos
    const now = new Date();
    await Event.insertMany([
      { title: 'Culto Dominical', type: 'culto', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0), location: 'Templo Principal - Shema, Fortaleza', description: 'Culto de adoração e palavra', organizer: admin._id, attendees: [members[0]._id, members[1]._id, members[2]._id] },
      { title: 'Conferência Jovens de Fé 2024', type: 'conferencia', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 19, 0), location: 'Templo Principal', description: 'Conferência anual para jovens', organizer: admin._id },
      { title: 'Reunião de Líderes', type: 'reuniao', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 19, 0), location: 'Sala de Reuniões', description: 'Reunião mensal de líderes de célula', organizer: admin._id },
      { title: 'Culto de Oração e Jejum', type: 'culto', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 30), location: 'Templo Principal', description: 'Culto de intercessão', organizer: admin._id, attendees: members.slice(0, 5).map(m => m._id) },
    ]);

    // Criar Posts do Feed
    await Post.insertMany([
      { author: admin._id, content: '🙏 "Porque sou eu que conheço os planos que tenho para vocês", diz o Senhor, "planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro." - Jeremias 29:11\n\nQue essa palavra alcance cada coração hoje!', isPinned: true },
      { author: admin._id, content: '📣 CONFERÊNCIA JOVENS DE FÉ 2024!\n\nGuardem essa data na agenda! Será um fim de semana transformador com pregação poderosa, louvor e comunhão.\n\n📅 Data: em breve\n📍 Local: Templo da Igreja Batista Shema\n\nConvide seus amigos! 🔥' },
      { author: admin._id, content: '✨ Que honra ter celebrado mais um batismo nas águas hoje! Parabéns para todos que deram esse passo de fé. A Igreja Shema está com vocês nessa jornada! 💙' },
    ]);

    console.log('\n✅ SEED concluído com sucesso!\n');
    console.log('👤 Admin criado:');
    console.log('   Email: admin@igrejashema.com');
    console.log('   Senha: Shema@2024\n');
    console.log(`📊 Dados criados:`);
    console.log(`   - ${members.length} membros`);
    console.log(`   - ${cells.length} células`);
    console.log(`   - 4 eventos`);
    console.log(`   - 3 posts no feed\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error.message);
    process.exit(1);
  }
};

seed();
